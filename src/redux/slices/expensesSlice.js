import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";

// Fetch all expenses (paginated)
export const fetchExpenses = createAsyncThunk(
    'expenses/fetchExpenses',
    async ({ page = 1, limit = 10, search = '', type = '' }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/expenses?page=${page}&limit=${limit}&search=${search}&type=${type}`);
            return res.data;
        } catch (e) {
            const errorMessage = e.response?.data?.message || "حدث خطأ أثناء جلب المصاريف";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

// Create Expense
export const createExpense = createAsyncThunk(
    'expenses/createExpense',
    async (expenseData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/expenses', expenseData);
            return res.data;
        } catch (e) {
            const errorMessage = e.response?.data?.message || "حدث خطأ أثناء إضافة المصروف";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

// Update Expense
export const updateExpense = createAsyncThunk(
    'expenses/updateExpense',
    async ({ id, expenseData }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/expenses/${id}`, expenseData);
            return res.data;
        } catch (e) {
            const errorMessage = e.response?.data?.message || "حدث خطأ أثناء تحديث المصروف";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

// Delete Expense
export const deleteExpense = createAsyncThunk(
    'expenses/deleteExpense',
    async (id, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/expenses/${id}`);
            return id;
        } catch (e) {
            const errorMessage = e.response?.data?.message || "حدث خطأ أثناء حذف المصروف";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

const initialState = {
    expenses: [],
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1
    },
    status: 'idle',
    error: null,
    createStatus: 'idle',
    createError: null,
    updateStatus: 'idle',
    updateError: null,
    deleteStatus: 'idle',
    deleteError: null
};

const expensesSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        resetExpensesStatus: (state) => {
            state.status = 'idle';
            state.createStatus = 'idle';
            state.updateStatus = 'idle';
            state.deleteStatus = 'idle';
            state.error = null;
            state.createError = null;
            state.updateError = null;
            state.deleteError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchExpenses.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.expenses = action.payload.data || [];
                state.pagination = action.payload.pagination || initialState.pagination;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })
            // Create
            .addCase(createExpense.pending, (state) => {
                state.createStatus = 'loading';
            })
            .addCase(createExpense.fulfilled, (state) => {
                state.createStatus = 'succeeded';
            })
            .addCase(createExpense.rejected, (state, action) => {
                state.createStatus = 'failed';
                state.createError = action.payload.message;
            })
            // Update
            .addCase(updateExpense.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(updateExpense.fulfilled, (state) => {
                state.updateStatus = 'succeeded';
            })
            .addCase(updateExpense.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.updateError = action.payload.message;
            })
            // Delete
            .addCase(deleteExpense.pending, (state) => {
                state.deleteStatus = 'loading';
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.deleteStatus = 'succeeded';
                state.expenses = state.expenses.filter(exp => exp.id !== action.payload);
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.deleteStatus = 'failed';
                state.deleteError = action.payload.message;
            });
    }
});

export const { resetExpensesStatus } = expensesSlice.actions;
export default expensesSlice.reducer;
