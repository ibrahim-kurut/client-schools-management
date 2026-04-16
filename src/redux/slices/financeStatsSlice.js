import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";

export const fetchFinanceStats = createAsyncThunk(
    "financeStats/fetchFinanceStats",
    async (schoolId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/finance/stats/${schoolId}`);
            return res.data;
        } catch (e) {
            const errorMessage =
                e.response?.data?.message ||
                e.response?.data?.error ||
                "حدث خطأ أثناء جلب إحصائيات الشؤون المالية";
            return rejectWithValue({ message: errorMessage });
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
                state.stats = action.payload?.data
                    ? {
                        totalRevenue: action.payload.data.totalRevenue || 0,
                        totalExpenses: action.payload.data.totalExpenses || 0,
                        netBalance: action.payload.data.netBalance || 0,
                        pendingPayments: action.payload.data.pendingPayments || 0
                    }
                    : initialState.stats;
                state.school = action.payload?.data?.school || null;
            })
            .addCase(fetchFinanceStats.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "فشل تحميل الإحصائيات";
            });
    }
});

export const { resetFinanceStatsState } = financeStatsSlice.actions;
export default financeStatsSlice.reducer;
