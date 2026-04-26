import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";

export const fetchMySubscription = createAsyncThunk(
    'mySubscription/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/subscriptions/my-subscription');
            return res.data.data || res.data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || "Failed to fetch subscription");
        }
    },
    {
        condition: (_, { getState }) => {
            const { mySubscription } = getState();
            if (mySubscription?.status === 'loading' || mySubscription?.status === 'succeeded') {
                return false; 
            }
        }
    }
);

const mySubscriptionSlice = createSlice({
    name: "mySubscription",
    initialState: {
        data: null,
        status: 'idle', 
        error: null,
    },
    reducers: {
        resetSubscription: (state) => {
            state.data = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMySubscription.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMySubscription.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchMySubscription.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { resetSubscription } = mySubscriptionSlice.actions;
export default mySubscriptionSlice.reducer;
