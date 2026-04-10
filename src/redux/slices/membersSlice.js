import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";

/**
 * @description Fetch school staff members (Teachers, Assistants, Accountants)
 * @param {string} search - Search keyword
 * @param {string} role - Specific role filter (optional)
 * @param {number} page - Current page
 */
export const fetchMembers = createAsyncThunk(
    'members/fetchMembers',
    async ({ page = 1, limit = 10, search = '', role = '' }, { rejectWithValue }) => {
        try {
            // If role is empty, we fetch staff members (exclude students)
            // This ensures pagination works correctly by filtering on the server
            const url = `/school-user?page=${page}&limit=${limit}&search=${search}${role ? `&role=${role}` : '&excludeRole=STUDENT'}`;
            const res = await axiosInstance.get(url);
            
            return res.data;
        } catch (e) {
            const errorMessage = e.response?.data?.message || "حدث خطأ أثناء جلب بيانات الطاقم";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

/**
 * @description Create a new school member (Staff)
 * @param {FormData} formData - Form data containing image and staff details
 */
export const createMember = createAsyncThunk(
    'members/createMember',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/school-user`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data;
        } catch (e) {
            const errorMessage = e.response?.data?.message || "فشلت عملية إضافة العضو الجديد";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

/**
 * @description Update existing member data
 */
export const updateMember = createAsyncThunk(
    'members/updateMember',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/school-user/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data;
        } catch (e) {
            const errorMessage = e.response?.data?.message || "فشلت عملية تحديث بيانات العضو";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

/**
 * @description Delete a school member
 */
export const deleteMember = createAsyncThunk(
    'members/deleteMember',
    async (id, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/school-user/${id}`);
            return { id, message: res.data.message };
        } catch (e) {
            const errorMessage = e.response?.data?.message || "حدث خطأ أثناء حذف العضو";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

const initialState = {
    members: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalMembers: 0,
        itemsPerPage: 10
    },
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    createStatus: 'idle',
    createError: null,
};

const membersSlice = createSlice({
    name: 'members',
    initialState,
    reducers: {
        resetMembersStatus: (state) => {
            state.status = 'idle';
            state.error = null;
            state.createStatus = 'idle';
            state.createError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Members
            .addCase(fetchMembers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchMembers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.members = action.payload.members || [];
                state.pagination = action.payload.pagination || initialState.pagination;
            })
            .addCase(fetchMembers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })
            
            // Create Member
            .addCase(createMember.pending, (state) => {
                state.createStatus = 'loading';
                state.createError = null;
            })
            .addCase(createMember.fulfilled, (state, action) => {
                state.createStatus = 'succeeded';
                if (action.payload.user) {
                    state.members.unshift(action.payload.user);
                    state.pagination.totalMembers += 1;
                }
            })
            .addCase(createMember.rejected, (state, action) => {
                state.createStatus = 'failed';
                state.createError = action.payload.message;
            })

            // Update Member
            .addCase(updateMember.pending, (state) => {
                state.createStatus = 'loading';
            })
            .addCase(updateMember.fulfilled, (state, action) => {
                state.createStatus = 'succeeded';
                const updated = action.payload.member;
                if (updated) {
                    const index = state.members.findIndex(m => m.id === updated.id);
                    if (index !== -1) state.members[index] = updated;
                }
            })
            .addCase(updateMember.rejected, (state, action) => {
                state.createStatus = 'failed';
                state.createError = action.payload.message;
            })

            // Delete Member
            .addCase(deleteMember.fulfilled, (state, action) => {
                state.members = state.members.filter(m => m.id !== action.payload.id);
                state.pagination.totalMembers -= 1;
            });
    }
});

export const { resetMembersStatus } = membersSlice.actions;
export default membersSlice.reducer;
