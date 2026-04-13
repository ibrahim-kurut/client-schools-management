import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";

const initialState = {
    requests: [],
    pendingCount: 0,
    pendingRequest: null,
    status: 'idle',
    error: null,
    successMessage: null,
};

// Fetch all subscription requests (Super Admin)
export const fetchSubscriptionRequests = createAsyncThunk(
    'subscriptionRequests/fetchAll',
    async (status, { rejectWithValue }) => {
        try {
            const url = status ? `/subscriptions/requests?status=${status}` : '/subscriptions/requests';
            const res = await axiosInstance.get(url);
            return res.data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || "Failed to fetch requests");
        }
    }
);

// Fetch pending requests count (Super Admin)
export const fetchPendingRequestsCount = createAsyncThunk(
    'subscriptionRequests/fetchCount',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/subscriptions/requests/count');
            return res.data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || "Failed to fetch count");
        }
    }
);

// Approve subscription request (Super Admin)
export const approveSubscriptionRequest = createAsyncThunk(
    'subscriptionRequests/approve',
    async ({ id, adminNotes }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/subscriptions/approve/${id}`, { adminNotes });
            return { id, data: res.data };
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || "Failed to approve request");
        }
    }
);

// Reject subscription request (Super Admin)
export const rejectSubscriptionRequest = createAsyncThunk(
    'subscriptionRequests/reject',
    async ({ id, adminNotes }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/subscriptions/reject/${id}`, { adminNotes });
            return { id, data: res.data };
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || "Failed to reject request");
        }
    }
);

// Create subscription request (School Admin)
export const createSubscriptionRequest = createAsyncThunk(
    'subscriptionRequests/create',
    async (planId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/subscriptions/request', { planId });
            return res.data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || "Failed to create request");
        }
    }
);

// Fetch my pending request (School Admin)
export const fetchMyPendingRequest = createAsyncThunk(
    'subscriptionRequests/fetchMyPending',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/subscriptions/my-pending-request');
            return res.data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || "Failed to fetch pending request");
        }
    }
);


const subscriptionRequestsSlice = createSlice({
    name: "subscriptionRequests",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchSubscriptionRequests.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSubscriptionRequests.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.requests = action.payload.data;
            })
            .addCase(fetchSubscriptionRequests.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Fetch Count
            .addCase(fetchPendingRequestsCount.fulfilled, (state, action) => {
                state.pendingCount = action.payload.data.count;
            })
            // Approve
            .addCase(approveSubscriptionRequest.fulfilled, (state, action) => {
                state.requests = (state.requests || []).filter(r => r && r.id !== action.payload.id);
                state.pendingCount = Math.max(0, state.pendingCount - 1);
                state.successMessage = "تم قبول الطلب بنجاح";
            })
            // Reject
            .addCase(rejectSubscriptionRequest.fulfilled, (state, action) => {
                state.requests = (state.requests || []).filter(r => r && r.id !== action.payload.id);
                state.pendingCount = Math.max(0, state.pendingCount - 1);
                state.successMessage = "تم رفض الطلب";
            })
            // Create
            .addCase(createSubscriptionRequest.fulfilled, (state) => {
                state.successMessage = "تم إرسال طلب الاشتراك بنجاح، يرجى انتظار المراجعة";
            })
            .addCase(createSubscriptionRequest.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Fetch My Pending
            .addCase(fetchMyPendingRequest.fulfilled, (state, action) => {
                state.pendingRequest = action.payload.data;
            });
    }
});

export const { clearMessages } = subscriptionRequestsSlice.actions;
export default subscriptionRequestsSlice.reducer;
