import React from 'react';
import { io } from 'socket.io-client';

// Replace this with the actual URL of your deployed backend
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL // "http://localhost:5001";


// socket
export const socket = io(SOCKET_URL);


// app context
export const AppContext = React.createContext();

