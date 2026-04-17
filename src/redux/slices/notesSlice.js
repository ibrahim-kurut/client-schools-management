import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

export const fetchClassNotes = createAsyncThunk(
    'notes/fetchClassNotes',
    async (classId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/notes/class/${classId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'فشل في جلب الملاحظات'
            );
        }
    }
);

export const createNote = createAsyncThunk(
    'notes/createNote',
    async (noteData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/notes', noteData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'فشل في إرسال الملاحظة'
            );
        }
    }
);

export const deleteNote = createAsyncThunk(
    'notes/deleteNote',
    async (noteId, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/notes/${noteId}`);
            return noteId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'فشل في حذف الملاحظة'
            );
        }
    }
);

export const updateNote = createAsyncThunk(
    'notes/updateNote',
    async ({ noteId, content }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/notes/${noteId}`, { content });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'فشل في تحديث الملاحظة'
            );
        }
    }
);

const initialState = {
    notes: [],
    loading: false,
    creating: false,
    error: null,
};

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        clearNotesError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Notes
            .addCase(fetchClassNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClassNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.notes = action.payload;
            })
            .addCase(fetchClassNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Note
            .addCase(createNote.pending, (state) => {
                state.creating = true;
            })
            .addCase(createNote.fulfilled, (state, action) => {
                state.creating = false;
                state.notes.unshift(action.payload);
            })
            .addCase(createNote.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
            })
            // Delete Note
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.notes = state.notes.filter(n => n.id !== action.payload);
            })
            // Update Note
            .addCase(updateNote.fulfilled, (state, action) => {
                const index = state.notes.findIndex(n => n.id === action.payload.id);
                if (index !== -1) {
                    state.notes[index] = action.payload;
                }
            });
    }
});

export const { clearNotesError } = notesSlice.actions;
export default notesSlice.reducer;
