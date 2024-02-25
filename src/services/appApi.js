
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


// define a service using a base URL

const appApi = createApi({

    reducerPath: 'appApi',

    baseQuery: fetchBaseQuery({
        // Replace this with the actual URL of your deployed backend
        baseUrl: process.env.REACT_APP_BACKEND_URL // "http://localhost:5001"
    }),

    endpoints: (builder) => ({
        // POST request: signup user (creating the user)
        signupUser: builder.mutation({
            query: (user) => ({
                url: '/users',
                method: "POST",
                body: user
            })
        }),

        // POST request: login user
        loginUser: builder.mutation({
            query: (user) => ({
                url: '/users/login',
                method: "POST",
                body: user
            })
        }),

        // DELETE request: logout user
        logoutUser: builder.mutation({
            query: (payload) => ({
                url: '/logout',
                method: 'DELETE',
                body: payload
            })
        }),

    })

});




export const { useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation } = appApi;


export default appApi;

