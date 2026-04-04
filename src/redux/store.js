import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/authSlice";
import createSchoolReducer from "./slices/createSchoolSlice";
import planReducer from "./slices/planSlice";
import classesReducer from "./slices/classesSlice";
import studentsReducer from "./slices/studentsSlice";
import membersReducer from "./slices/membersSlice";
import subjectsReducer from "./slices/subjectsSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        createSchool: createSchoolReducer,
        plan: planReducer,
        classes: classesReducer,
        students: studentsReducer,
        members: membersReducer,
        subjects: subjectsReducer,
    },
});




