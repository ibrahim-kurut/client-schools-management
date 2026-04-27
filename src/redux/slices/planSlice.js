import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";


// 1- Initial state
const initialState = {
    plans: [],
    status: 'idle',
    error: null,
    successMessage: null,
    userInfo: null
};

// 2- Create a new Plan
export const createPlan = createAsyncThunk('plan/createPlan', async (planData, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post(`/plans`, planData);
        return res.data;
    } catch (e) {
        const errorMessage = e.response?.data?.message || e.response?.data?.error || "Plan creation failed";
        return rejectWithValue({ message: errorMessage });
    }
});

// 3- Fetch all plans
export const fetchPlans = createAsyncThunk('plan/fetchPlans', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/plans`);
        return res.data;
    } catch (e) {
        const errorMessage = e.response?.data?.message || e.response?.data?.error || "Failed to fetch plans";
        return rejectWithValue({ message: errorMessage });
    }
}, {
    condition: (_, { getState }) => {
        const { plan } = getState();
        if (plan.status === 'loading' || plan.plans.length > 0) {
            return false;
        }
    }
});

// 4- Update a plan
export const updatePlan = createAsyncThunk('plan/updatePlan', async ({ id, planData }, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.put(`/plans/${id}`, planData);
        return res.data;
    } catch (e) {
        const errorMessage = e.response?.data?.message || e.response?.data?.error || "Plan update failed";
        return rejectWithValue({ message: errorMessage });
    }
});

// 5- Delete a plan
export const deletePlan = createAsyncThunk('plan/deletePlan', async (id, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.delete(`/plans/${id}`);
        return { id, message: res.data.message };
    } catch (e) {
        const errorMessage = e.response?.data?.message || e.response?.data?.error || "Plan deletion failed";
        return rejectWithValue({ message: errorMessage });
    }
});


// 4- create slice
const planSlice = createSlice({
    name: "plan",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Plan
            .addCase(createPlan.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createPlan.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // push the actual plan data into the plans list
                if (action.payload.data) {
                    state.plans.push(action.payload.data);
                }
                state.successMessage = action.payload.message;
            })
            .addCase(createPlan.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })
            // Fetch Plans
            .addCase(fetchPlans.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchPlans.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.plans = action.payload.plans || [];
            })
            .addCase(fetchPlans.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })
            // Update Plan
            .addCase(updatePlan.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updatePlan.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (action.payload.plan) {
                    const index = state.plans.findIndex(p => p.id === action.payload.plan.id);
                    if (index !== -1) {
                        state.plans[index] = action.payload.plan;
                    }
                }
                state.successMessage = action.payload.message;
            })
            .addCase(updatePlan.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })
            // Delete Plan
            .addCase(deletePlan.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.successMessage = null;
            })
            .addCase(deletePlan.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.plans = state.plans.filter(p => p.id !== action.payload.id);
                state.successMessage = action.payload.message;
            })
            .addCase(deletePlan.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            });
    }
});


export const { clearMessages } = planSlice.actions;
export default planSlice.reducer;