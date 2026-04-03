import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";




// 2- Registration Process
export const register = createAsyncThunk('user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/auth/register`, userData);
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
        const res = await axiosInstance.post(`/auth/login`, loginData);
        return res.data
    } catch (e) {
        const errorMessage = e.response?.data?.message || e.response?.data?.error || "Login failed";
        return rejectWithValue({ message: errorMessage });
    }
})

// 3.5- Login with school slug (for staff members)
export const loginWithSchoolSlug = createAsyncThunk('user/loginWithSchoolSlug',
    async ({ slug, email, password }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/auth/${slug}/login`, { email, password });
            return res.data;
        } catch (e) {
            const errorMessage = e.response?.data?.message || e.response?.data?.error || "Login failed";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

// 4- Logout process
export const logout = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post(`/auth/logout`);
        return res.data;
    } catch (e) {
        const errorMessage = e.response?.data?.message || e.response?.data?.error || "Logout failed";
        return rejectWithValue({ message: errorMessage });
    }
});


// 1- Initial state
const initialState = {
    user: null,
    isLoggedIn: false,
    status: 'idle',
    error: null,
    successMessage: null,
    userInfo: null
};

// 3. slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.isLoggedIn = !!action.payload.user;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.successMessage = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = null;
                state.isLoggedIn = false;
                state.successMessage = action.payload.message;
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
                    localStorage.setItem("user", JSON.stringify(action.payload.userData));
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || "Login failed";
            })
            // Login with School Slug Process
            .addCase(loginWithSchoolSlug.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginWithSchoolSlug.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.isLoggedIn = true;
                state.error = null;
                if (typeof window !== "undefined") {
                    localStorage.setItem("user", JSON.stringify(action.payload.userData));
                }
            })
            .addCase(loginWithSchoolSlug.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || "Login failed";
            })
            // Logout Process
            .addCase(logout.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(logout.fulfilled, (state) => {
                state.status = 'idle';
                state.user = null;
                state.isLoggedIn = false;
                state.error = null;
                state.userInfo = null;
                if (typeof window !== "undefined") {
                    localStorage.removeItem("user");
                }
            })
            .addCase(logout.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || "Logout failed";
            });
    }
});

export const { setCredentials } = authSlice.actions;
export default authSlice.reducer;