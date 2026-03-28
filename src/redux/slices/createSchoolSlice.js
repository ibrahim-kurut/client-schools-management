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
            // تنظيف الحقول الفارغة لضمان عدم رفضها من قبل Joi في الباك اند
            const cleanData = { ...schoolData };
            if (!cleanData.logo || cleanData.logo === '') delete cleanData.logo;
            if (!cleanData.slug || cleanData.slug === '') delete cleanData.slug;
            if (!cleanData.planId || cleanData.planId === '') delete cleanData.planId;
            
            const response = await axiosInstance.post('/schools', cleanData);
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
