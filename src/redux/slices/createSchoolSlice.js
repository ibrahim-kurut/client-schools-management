import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";


// 1- Initial state

const initialState = {
    school: null, // لتخزين بيانات المدرسة الجديدة بعد إنشائها
    status: 'idle', // لتتبع حالة الطلب (loading, succeeded, failed)
    error: null, // لتخزين رسائل الخطأ
    successMessage: null, // لتخزين رسالة النجاح
};

// 2- Async thunk for creating school
export const createSchool = createAsyncThunk(
    'school/createSchool',
    async (schoolData, { rejectWithValue }) => {
        try {
            // schoolData can now be a FormData object for multipart/form-data
            const response = await axiosInstance.post('/schools', schoolData);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "فشلت عملية إنشاء المدرسة";
            return rejectWithValue({ message: errorMessage });
        }
    }
);


// 3- Slice
const createSchoolSlice = createSlice({
    name: 'school',
    initialState,
    // reducers: {
    //     clearSchoolError: (state) => {
    //         state.error = null;
    //         state.successMessage = null;
    //     },
    // },
    extraReducers: (builder) => {
        builder
            .addCase(createSchool.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createSchool.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.school = action.payload.school;
                state.successMessage = action.payload.message || 'تم إنشاء المدرسة بنجاح!';
            })
            .addCase(createSchool.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'حدث خطأ أثناء إنشاء المدرسة';
            });
    },
});

// export const { clearSchoolError } = createSchoolSlice.actions;
export default createSchoolSlice.reducer;
