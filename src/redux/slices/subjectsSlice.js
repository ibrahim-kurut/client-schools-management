import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";

/**
 * @description Fetch all subjects for the school
 */
export const fetchSubjects = createAsyncThunk(
    'subjects/fetchSubjects',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/subjects');
            return res.data;
        } catch (e) {
            const errorMessage = e.response?.data?.message || "حدث خطأ أثناء جلب المواد الدراسية";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

/**
 * @description Create a new subject
 */
export const createSubject = createAsyncThunk(
    'subjects/createSubject',
    async (subjectData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/subjects', subjectData);
            return res.data;
        } catch (e) {
            const errorMessage = e.response?.data?.message || "فشلت عملية إضافة المادة الجديدة";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

/**
 * @description Update an existing subject
 */
export const updateSubject = createAsyncThunk(
    'subjects/updateSubject',
    async ({ id, subjectData }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/subjects/${id}`, subjectData);
            return res.data;
        } catch (e) {
            const errorMessage = e.response?.data?.message || "فشلت عملية تحديث المادة";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

/**
 * @description Delete a subject
 */
export const deleteSubject = createAsyncThunk(
    'subjects/deleteSubject',
    async (id, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/subjects/${id}`);
            return { id, message: res.data.message };
        } catch (e) {
            const errorMessage = e.response?.data?.message || "حدث خطأ أثناء حذف المادة";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

const initialState = {
    subjects: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    createStatus: 'idle',
    createError: null,
};

const subjectsSlice = createSlice({
    name: 'subjects',
    initialState,
    reducers: {
        resetSubjectsStatus: (state) => {
            state.status = 'idle';
            state.error = null;
            state.createStatus = 'idle';
            state.createError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Subjects
            .addCase(fetchSubjects.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.subjects = action.payload.subjects || [];
            })
            .addCase(fetchSubjects.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })
            
            // Create Subject
            .addCase(createSubject.pending, (state) => {
                state.createStatus = 'loading';
                state.createError = null;
            })
            .addCase(createSubject.fulfilled, (state, action) => {
                state.createStatus = 'succeeded';
                if (action.payload.newSubject) {
                    state.subjects.unshift(action.payload.newSubject);
                }
            })
            .addCase(createSubject.rejected, (state, action) => {
                state.createStatus = 'failed';
                state.createError = action.payload.message;
            })

            // Update Subject
            .addCase(updateSubject.pending, (state) => {
                state.createStatus = 'loading';
            })
            .addCase(updateSubject.fulfilled, (state, action) => {
                state.createStatus = 'succeeded';
                const updated = action.payload.updatedSubject;
                if (updated) {
                    const index = state.subjects.findIndex(s => s.id === updated.id);
                    if (index !== -1) state.subjects[index] = updated;
                }
            })
            .addCase(updateSubject.rejected, (state, action) => {
                state.createStatus = 'failed';
                state.createError = action.payload.message;
            })

            // Delete Subject
            .addCase(deleteSubject.fulfilled, (state, action) => {
                state.subjects = state.subjects.filter(s => s.id !== action.payload.id);
            });
    }
});

export const { resetSubjectsStatus } = subjectsSlice.actions;
export default subjectsSlice.reducer;
