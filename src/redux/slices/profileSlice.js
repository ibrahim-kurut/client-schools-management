import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/profile');
            return response.data.user; 
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'فشل في جلب بيانات الملف الشخصي'
            );
        }
    },
    {
        condition: (_, { getState }) => {
            const { profile } = getState();
            if (profile.loading || profile.profileData) {
                return false;
            }
        }
    }
);

const initialState = {
    profileData: null,
    loading: false,
    error: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfileError: (state) => {
            state.error = null;
        },
        resetProfile: (state) => {
            state.profileData = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profileData = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearProfileError, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
