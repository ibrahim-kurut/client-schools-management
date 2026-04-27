import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";

export const fetchFinanceStats = createAsyncThunk(
    "financeStats/fetchFinanceStats",
    async ({ schoolId, months = 6 }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/finance/dashboard-summary/${schoolId}?months=${months}`);
            return res.data;
        } catch (e) {
            const errorMessage =
                e.response?.data?.message ||
                e.response?.data?.error ||
                "حدث خطأ أثناء جلب إحصائيات الشؤون المالية";
            return rejectWithValue({ message: errorMessage });
        }
    },
    {
        condition: (_, { getState }) => {
            const { financeStats } = getState();
            if (financeStats.status === 'loading' || financeStats.status === 'succeeded') {
                return false;
            }
        }
    }
);
const initialState = {
    stats: {
        totalRevenue: 0,
        totalExpenses: 0,
        netBalance: 0,
        pendingPayments: 0
    },
    chartData: [],
    recentOperations: [],
    school: null,
    status: "idle",
    error: null
};

const financeStatsSlice = createSlice({
    name: "financeStats",
    initialState,
    reducers: {
        resetFinanceStatsState: (state) => {
            state.status = "idle";
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFinanceStats.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchFinanceStats.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.error = null;
                const data = action.payload?.data;
                if (data) {
                    state.stats = {
                        totalRevenue: data.totalRevenue || 0,
                        totalExpenses: data.totalExpenses || 0,
                        netBalance: data.netBalance || 0,
                        pendingPayments: data.pendingPayments || 0
                    };
                    state.chartData = data.chartData || [];
                    state.recentOperations = data.recentOperations || [];
                    state.school = data.school || null;
                } else {
                    state.stats = initialState.stats;
                    state.chartData = [];
                    state.recentOperations = [];
                }
            })
            .addCase(fetchFinanceStats.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "فشل تحميل الإحصائيات";
            });
    }
});

export const { resetFinanceStatsState } = financeStatsSlice.actions;
export default financeStatsSlice.reducer;
