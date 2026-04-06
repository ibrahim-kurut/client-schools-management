import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

export const fetchAcademicYears = createAsyncThunk(
  'academicYears/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/academic-year');
      // The backend returns { status, message, academicYears: [...], stats }
      // We need to return the nested academicYears array
      return response.data.academicYears.academicYears || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'فشل في جلب السنوات الدراسية');
    }
  }
);

export const createAcademicYear = createAsyncThunk(
  'academicYears/create',
  async (yearData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/academic-year', yearData);
      // The backend returns { message, academicYear: { ... } }
      return response.data.academicYear;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'فشل في إضافة السنة الدراسية');
    }
  }
);

export const updateAcademicYear = createAsyncThunk(
  'academicYears/update',
  async ({ id, yearData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/academic-year/${id}`, yearData);
      // The backend returns { message, academicYear: { ... } }
      return response.data.academicYear;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'فشل في تحديث السنة الدراسية');
    }
  }
);

export const deleteAcademicYear = createAsyncThunk(
  'academicYears/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/academic-year/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'فشل في حذف السنة الدراسية');
    }
  }
);

const academicYearsSlice = createSlice({
  name: 'academicYears',
  initialState: {
    years: [],
    currentYear: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAcademicYears.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAcademicYears.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const yearsArray = Array.isArray(action.payload) ? action.payload : [];
        state.years = yearsArray;
        state.currentYear = yearsArray.find(y => y.isCurrent) || null;
      })
      .addCase(fetchAcademicYears.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createAcademicYear.fulfilled, (state, action) => {
        if (action.payload && typeof action.payload === 'object') {
          // If the new year is current, all others must be false
          if (action.payload.isCurrent) {
            state.years = [
              action.payload,
              ...state.years.map(y => ({ ...y, isCurrent: false }))
            ];
            state.currentYear = action.payload;
          } else {
            state.years = [action.payload, ...state.years];
          }
        }
      })
      .addCase(updateAcademicYear.fulfilled, (state, action) => {
        if (action.payload && typeof action.payload === 'object') {
          const updatedYear = action.payload;
          
          // Map to new array to ensure reference changes
          state.years = state.years.map(y => {
            if (y.id === updatedYear.id) {
              return updatedYear;
            }
            // If the updated year is set to current, all others must be false
            if (updatedYear.isCurrent) {
              return { ...y, isCurrent: false };
            }
            return y;
          });

          // Update currentYear helper
          if (updatedYear.isCurrent) {
            state.currentYear = updatedYear;
          } else if (state.currentYear?.id === updatedYear.id) {
            // Updated year was current but is not anymore
            state.currentYear = null;
          }
        }
      })
      .addCase(deleteAcademicYear.fulfilled, (state, action) => {
        state.years = state.years.filter(y => y.id !== action.payload);
        if (state.currentYear?.id === action.payload) {
          state.currentYear = null;
        }
      });
  }
});

export default academicYearsSlice.reducer;
