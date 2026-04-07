import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

// Fetch all grades for a specific class
export const fetchClassGrades = createAsyncThunk(
    'teacherGrades/fetchClassGrades',
    async ({ classId, academicYearId }, { rejectWithValue }) => {
        try {
            const params = academicYearId ? { academicYearId } : {};
            const response = await axiosInstance.get(`/grades/teacher-class/${classId}`, {
                params
            });
            return response.data.grades;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'فشل في جلب الدرجات');
        }
    }
);

export const addGrade = createAsyncThunk(
    'teacherGrades/addGrade',
    async (gradeData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/grades`, gradeData);
            return response.data.grade;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'فشل في إضافة الدرجة');
        }
    }
);

export const updateGrade = createAsyncThunk(
    'teacherGrades/updateGrade',
    async ({ studentId, gradeData }, { rejectWithValue }) => {
        try {
            // Note: In our current backend, update is likely PUT /api/grades/:id 
            // where :id is the record id, or studentId if it's a unique relation.
            // Let's assume studentId as passed from UI for now, but usually it's grade ID.
            const response = await axiosInstance.put(`/grades/${studentId}`, gradeData);
            return response.data.grade;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'فشل في تعديل الدرجة');
        }
    }
);

export const deleteGrade = createAsyncThunk(
    'teacherGrades/deleteGrade',
    async (gradeId, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/grades/${gradeId}`);
            return gradeId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'فشل في حذف الدرجة');
        }
    }
);

const initialState = {
    grades: [],
    loading: false,
    actionLoading: false,
    error: null,
};

const teacherGradesSlice = createSlice({
    name: 'teacherGrades',
    initialState,
    reducers: {
        clearGradesError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Class Grades
            .addCase(fetchClassGrades.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClassGrades.fulfilled, (state, action) => {
                state.loading = false;
                state.grades = action.payload || [];
            })
            .addCase(fetchClassGrades.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Grade
            .addCase(addGrade.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(addGrade.fulfilled, (state, action) => {
                state.actionLoading = false;
                // Add or replace the local copy
                const existingIndex = state.grades.findIndex(
                    g => g.studentId === action.payload.studentId && 
                         g.subjectId === action.payload.subjectId &&
                         g.examType === action.payload.examType
                );
                if (existingIndex > -1) {
                    state.grades[existingIndex] = action.payload;
                } else {
                    state.grades.push(action.payload);
                }
            })
            .addCase(addGrade.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })
            // Update Grade
            .addCase(updateGrade.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(updateGrade.fulfilled, (state, action) => {
                state.actionLoading = false;
                const index = state.grades.findIndex((g) => g.id === action.payload.id);
                if (index !== -1) {
                    state.grades[index] = action.payload;
                }
            })
            .addCase(updateGrade.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })
            // Delete Grade
            .addCase(deleteGrade.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(deleteGrade.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.grades = state.grades.filter((g) => g.id !== action.payload);
            })
            .addCase(deleteGrade.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearGradesError } = teacherGradesSlice.actions;
export default teacherGradesSlice.reducer;
