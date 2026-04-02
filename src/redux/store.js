import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/authSlice";
import createSchoolReducer from "./slices/createSchoolSlice";
import planReducer from "./slices/planSlice";
import classesReducer from "./slices/classesSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        createSchool: createSchoolReducer,
        plan: planReducer,
        classes: classesReducer,
    },
});




