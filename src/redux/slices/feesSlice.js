import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";

// Fetch students fees summary (paginated)
export const fetchStudentsSummary = createAsyncThunk(
    'fees/fetchStudentsSummary',
    async ({ page = 1, limit = 10, search = '', classFilter = 'ALL' }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/payments/students-summary?page=${page}&limit=${limit}&search=${search}&classFilter=${classFilter}`);
            return res.data;
        } catch (e) {
            const errorMessage = e.response?.data?.message || e.response?.data?.error || "حدث خطأ أثناء جلب سجلات الرسوم";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

const initialState = {
    students: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalStudents: 0,
        itemsPerPage: 10
    },
    status: 'idle',
    error: null,
};

const feesSlice = createSlice({
    name: 'fees',
    initialState,
    reducers: {
        clearFeesError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudentsSummary.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchStudentsSummary.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.students = action.payload.data.students || [];
                state.pagination = action.payload.data.pagination || initialState.pagination;
            })
            .addCase(fetchStudentsSummary.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            });
    }
});

export const { clearFeesError } = feesSlice.actions;
export default feesSlice.reducer;
