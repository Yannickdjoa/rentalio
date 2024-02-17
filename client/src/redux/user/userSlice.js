import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        signInFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        updateUserStart: (state) => {
            state.loading = true
        },
        updateUserSuccess: (state, action) => {
            state.error = null
            state.loading = false
            state.currentUser = action.payload
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        deleteUserStart: (state) => {
            state.loading = true
        },
        deleteUserSuccess: (state) => {
            ;(state.currentUser = null),
                (state.loading = false),
                (state.error = null)
        },
        deleteUserFailure: (state, action) => {
            ;(state.loading = false), (state.error = true)
        },
        signOutStart: (state) => {
            state.loading = true
        },
        signOutSuccess: (state) => {
            ;(state.currentUser = null),
                (state.loading = false),
                (state.error = null)
        },
        signOutFailure: (state, action) => {
            ;(state.loading = false), (state.error = action.payload)
        },
    },
})

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateUserFailure,
    updateUserSuccess,
    updateUserStart,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signOutStart,
    signOutSuccess,
    signOutFailure,
} = userSlice.actions
export default userSlice.reducer
