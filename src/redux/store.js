import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/authSlice";
import createSchoolReducer from "./slices/createSchoolSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        createSchool: createSchoolReducer,
    },
});




