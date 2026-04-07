import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

export const fetchTeacherStudents = createAsyncThunk(
    'teacherProfile/fetchStudents',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/profile/teacher/students`);
            return response.data; // { classes: [...] }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'فشل في جلب قائمة الطلاب'
            );
        }
    }
);

export const fetchFullProfile = createAsyncThunk(
    'teacherProfile/fetchFullProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/profile`);
            return response.data.user; 
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'فشل في جلب المعلومات الشخصية'
            );
        }
    }
);

const initialState = {
    classes: [],
    profileData: null,
    loading: false,
    error: null,
};

const teacherProfileSlice = createSlice({
    name: 'teacherProfile',
    initialState,
    reducers: {
        clearTeacherProfileError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Students & Classes
            .addCase(fetchTeacherStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeacherStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = action.payload.classes || [];
            })
            .addCase(fetchTeacherStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Full Profile
            .addCase(fetchFullProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFullProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profileData = action.payload;
            })
            .addCase(fetchFullProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearTeacherProfileError } = teacherProfileSlice.actions;
export default teacherProfileSlice.reducer;
