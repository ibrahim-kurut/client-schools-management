import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";

// Fetch students (paginated)
export const fetchStudents = createAsyncThunk(
    'students/fetchStudents',
    async ({ page = 1, limit = 10, search = '', role = 'STUDENT' }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/school-user?page=${page}&limit=${limit}&search=${search}&role=${role}`);
            return res.data;
        } catch (e) {
            const errorMessage = e.response?.data?.message || e.response?.data?.error || "حدث خطأ أثناء جلب الطلاب";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

// Create student (Multipart for image upload)
export const createStudent = createAsyncThunk(
    'students/createStudent',
    async (formData, { rejectWithValue }) => {
        try {
            // formData should be an instance of FormData
            const res = await axiosInstance.post(`/school-user`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return res.data;
        } catch (e) {
            const errorMessage = e.response?.data?.message || e.response?.data?.error || "حدث خطأ أثناء إضافة الطالب";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

const initialState = {
    students: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalMembers: 0,
        itemsPerPage: 10
    },
    status: 'idle',
    error: null,
    createStatus: 'idle',
    createError: null,
};

const studentsSlice = createSlice({
    name: 'students',
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
            .addCase(fetchStudents.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.students = action.payload.members || [];
                state.pagination = action.payload.pagination || initialState.pagination;
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })
            // Create
            .addCase(createStudent.pending, (state) => {
                state.createStatus = 'loading';
                state.createError = null;
            })
            .addCase(createStudent.fulfilled, (state, action) => {
                state.createStatus = 'succeeded';
                // Add new student to local state
                if (action.payload.user) {
                    state.students.unshift(action.payload.user);
                    state.pagination.totalMembers += 1;
                }
            })
            .addCase(createStudent.rejected, (state, action) => {
                state.createStatus = 'failed';
                state.createError = action.payload.message;
            });
    }
});

export const { resetCreateStatus } = studentsSlice.actions;
export default studentsSlice.reducer;
