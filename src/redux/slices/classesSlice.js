import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";

// Fetch classes
export const fetchClasses = createAsyncThunk(
    'classes/fetchClasses',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/classes`);
            return res.data;
        } catch (e) {
            const errorMessage = e.response?.data?.message || e.response?.data?.error || "حدث خطأ أثناء جلب الصفوف";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

// Create class
export const createClass = createAsyncThunk(
    'classes/createClass',
    async (classData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/classes`, classData);
            return res.data;
        } catch (e) {
            const errorMessage = e.response?.data?.message || e.response?.data?.error || "حدث خطأ أثناء إنشاء الصف";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

const initialState = {
    classes: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    createStatus: 'idle',
    createError: null,
};

const classesSlice = createSlice({
    name: 'classes',
    initialState,
    reducers: {
        resetCreateStatus: (state) => {
            state.createStatus = 'idle';
            state.createError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchClasses.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchClasses.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.classes = action.payload.classes || [];
            })
            .addCase(fetchClasses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })
            // Create
            .addCase(createClass.pending, (state) => {
                state.createStatus = 'loading';
                state.createError = null;
            })
            .addCase(createClass.fulfilled, (state, action) => {
                state.createStatus = 'succeeded';
                if(action.payload.class){
                  state.classes.push(action.payload.class);
                }
            })
            .addCase(createClass.rejected, (state, action) => {
                state.createStatus = 'failed';
                state.createError = action.payload.message;
            })
    }
});

export const { resetCreateStatus } = classesSlice.actions;

export default classesSlice.reducer;
