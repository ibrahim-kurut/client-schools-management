import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

export const fetchDashboardStats = createAsyncThunk(
    'dashboard/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/schools/stats/overview');
            return response.data.stats;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'فشل في جلب إحصائيات لوحة التحكم'
            );
        }
    },
    {
        condition: (_, { getState }) => {
            const { dashboard } = getState();
            if (dashboard.status === 'loading' || dashboard.stats) {
                return false;
            }
        }
    }
);

const initialState = {
    stats: null,
    status: 'idle',
    error: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        resetDashboardStats: (state) => {
            state.stats = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { resetDashboardStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;
