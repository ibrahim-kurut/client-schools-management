import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";

const initialState = {
    notifications: [],
    unreadCount: 0,
    status: 'idle',
    error: null,
};

// Fetch notifications
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/notifications');
            return res.data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || "Failed to fetch notifications");
        }
    },
    {
        condition: (force, { getState }) => {
            const { notifications } = getState();
            if (!force && (notifications.status === 'loading' || notifications.status === 'succeeded')) {
                return false;
            }
        }
    }
);

// Mark as read
export const markNotificationAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.patch(`/notifications/${id}/read`);
            return id;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || "Failed to mark as read");
        }
    }
);

// Mark all as read
export const markAllNotificationsAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.patch('/notifications/read-all');
            return true;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || "Failed to mark all as read");
        }
    }
);

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notifications = action.payload.data;
                state.unreadCount = action.payload.data.filter(n => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const notification = (state.notifications || []).find(n => n && n.id === action.payload);
                if (notification && !notification.isRead) {
                    notification.isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.notifications.forEach(n => n.isRead = true);
                state.unreadCount = 0;
            });
    }
});

export default notificationsSlice.reducer;
