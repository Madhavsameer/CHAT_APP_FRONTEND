import React, { useContext, useEffect } from 'react';
import { ListGroup, Row, Col } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';

import { AppContext } from '../context/appContext';

import { addNotifications, resetNotifications } from '../features/userSlice';

import './Sidebar.css';



function Sidebar() {
    // const rooms = [ "first room", "second room", "third room" ];
    const user = useSelector(state => state.user);

    const { socket, setMembers, members, setCurrentRoom, setRooms, privateMemberMsg, rooms, setPrivateMemberMsg, currentRoom } = useContext(AppContext);

    const dispatch = useDispatch();


    // function to get rooms
    function getRooms() {
        fetch('http://localhost:5001/rooms')
            .then((res) => res.json())
            .then((data) => setRooms(data));
    }


    // function to join room
    function joinRoom(room, isPublic = true) {
        if (!user) {
            return alert('Please login');
        }

        socket.emit('join-room', room, currentRoom);
        setCurrentRoom(room);

        if (isPublic) {
            setPrivateMemberMsg(null);
        }

        // dispatch for notifications
        dispatch(resetNotifications(room));
    }


    socket.off('notifications').on('notifications', (room) => {
        if (currentRoom !== room) {
            dispatch(addNotifications(room));
        }
    });


    useEffect(() => {
        if (user) {
            setCurrentRoom('general');
            getRooms();
            socket.emit('join-room', 'general');
            socket.emit('new-user');
        }
    }, []);


    socket.off('new-user').on('new-user', (payload) => {
        // console.log(payload);
        setMembers(payload);
    });


    function orderIds(id1, id2) {
        if (id1 > id2) {
            return id1 + '-' + id2;
        } else {
            return id2 + '-' + id1;
        }
    }


    // function to handle private member message
    function handlePrivateMemberMsg(member) {
        setPrivateMemberMsg(member);
        const roomId = orderIds(user._id, member._id);
        joinRoom(roomId, false);
    }


    if (!user) {
        return <></>;
    }


    return (
        <>
            <div>
                <div>
                    <h2 style={{ textAlign: 'center', marginBottom: 10 }}>Available rooms</h2>
                    <ListGroup>
                        {rooms.map((room, idx) => (
                            <ListGroup.Item key={idx} onClick={() => joinRoom(room)} active={room === currentRoom} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', border: '1px solid gray' }} >
                                {room} {currentRoom !== room && (<span className="badge rounded-pill bg-primary">{user.newMessages[room]}</span>)}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>

                <div style={{ marginTop: 15 }}>
                    <h2 style={{ textAlign: 'center', marginBottom: 10 }}>Members</h2>
                    {members.map((member) => (
                        <ListGroup.Item key={member._id} style={{ cursor: 'pointer', border: '1px solid gray', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} active={privateMemberMsg?._id === member?._id} onClick={() => handlePrivateMemberMsg(member)} disabled={member._id === user._id} >
                            <Row>
                                <Col xs={2} className="member-status">
                                    <img src={member.picture} className="member-status-img" style={{ marginLeft: 25 }} />

                                    {member.status === "online" ? (<i className="fas fa-circle sidebar-online-status"></i>) : (<i className="fas fa-circle sidebar-offline-status"></i>)}

                                </Col>
                                <Col xs={9}>
                                    {member.name}
                                    {member._id === user?._id && " (You)"}
                                    {member.status === "offline" && " (Offline)"}
                                </Col>
                                <Col xs={1}>
                                    <span className="badge rounded-pill bg-primary">{user.newMessages[orderIds(member._id, user._id)]}</span>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </div>
            </div>
        </>
    );

}


export default Sidebar;

