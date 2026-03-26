import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { DOMAIN } from "../../lib/domain";




// 2- Registration Process
export const register = createAsyncThunk('user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${DOMAIN}/auth/register`, userData);
            return res.data;
        } catch (e) {
            const errorMessage = e.response?.data?.message || e.response?.data?.error || "Registration failed";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

// 3- Login process

export const login = createAsyncThunk('user/login', async (loginData, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${DOMAIN}/auth/login`, loginData);
        return res.data
    } catch (e) {
        const errorMessage = e.response?.data?.message || e.response?.data?.error || "Login failed";
        return rejectWithValue({ message: errorMessage });
    }
})


// 1- Initial state
const storedUser =
    typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user"))
        : null;
const initialState = {
    user: storedUser,
    isLoggedIn: !!storedUser,
    status: 'idle',
    error: null,
    successMessage: null,
    userInfo: null
};

// 3. slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.successMessage = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.isLoggedIn = true;
                state.successMessage = action.payload.message;
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(register.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })
            // Login Process
            .addCase(login.pending, (state) => {
                state.status = 'loading';
                state.error = null; // reset error
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.isLoggedIn = true;
                state.error = null;
                if (typeof window !== "undefined") {
                    localStorage.setItem("user", JSON.stringify(action.payload));
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || "Login failed";
            });
    }
});

export default authSlice.reducer;