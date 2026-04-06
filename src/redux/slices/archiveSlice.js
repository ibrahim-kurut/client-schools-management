import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

// Get archived data
export const getArchivedData = createAsyncThunk(
  'archive/getArchivedData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/archive');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Restore data
export const restoreData = createAsyncThunk(
  'archive/restoreData',
  async ({ type, id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/archive/restore', { type, id });
      return { type, id, result: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Permanent delete
export const permanentDelete = createAsyncThunk(
  'archive/permanentDelete',
  async ({ type, id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/archive/permanent/${type}/${id}`);
      return { type, id, result: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const archiveSlice = createSlice({
  name: 'archive',
  initialState: {
    classes: [],
    subjects: [],
    academicYears: [],
    loading: false,
    error: null,
    success: false,
    message: null
  },
  reducers: {
    resetArchiveState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // getArchivedData
      .addCase(getArchivedData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getArchivedData.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload.classes;
        state.subjects = action.payload.subjects;
        state.academicYears = action.payload.academicYears;
      })
      .addCase(getArchivedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch archived data';
      })
      // restoreData
      .addCase(restoreData.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.result.message;
        // Remove from local state
        const { type, id } = action.payload;
        if (type === 'class') state.classes = state.classes.filter(i => i.id !== id);
        if (type === 'subject') state.subjects = state.subjects.filter(i => i.id !== id);
        if (type === 'academicYear') state.academicYears = state.academicYears.filter(i => i.id !== id);
      })
      .addCase(restoreData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to restore data';
      })
      // permanentDelete
      .addCase(permanentDelete.pending, (state) => {
        state.loading = true;
      })
      .addCase(permanentDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.result.message;
        // Remove from local state
        const { type, id } = action.payload;
        if (type === 'class') state.classes = state.classes.filter(i => i.id !== id);
        if (type === 'subject') state.subjects = state.subjects.filter(i => i.id !== id);
        if (type === 'academicYear') state.academicYears = state.academicYears.filter(i => i.id !== id);
      })
      .addCase(permanentDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete data permanently';
      });
  }
});

export const { resetArchiveState } = archiveSlice.actions;
export default archiveSlice.reducer;
