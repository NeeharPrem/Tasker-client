import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    userLoggedin: boolean | null;
    userId: string | null;
    role:string | null;
}

const storedUserinfo = localStorage.getItem("userLoggedin");
const parsedUserinfo = storedUserinfo ? JSON.parse(storedUserinfo) : null;


const storedUserId = localStorage.getItem("userId");
const storedRole = localStorage.getItem("role");

const initialState: AuthState = {
    userLoggedin: parsedUserinfo ?? null,
    userId: storedUserId,
    role: storedRole
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            const { userLoggedin, userId,role } = action.payload;
            state.userLoggedin = userLoggedin;
            localStorage.setItem("userId", userId)
            localStorage.setItem('role',role)
            localStorage.setItem("userLoggedin", JSON.stringify(action.payload));
        },
        userLogout: (state) => {
            state.userLoggedin = false;
            localStorage.removeItem("userLoggedin");
        }
    },
});

export const { setLogin, userLogout } = authSlice.actions;
export default authSlice.reducer;