import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/authSlice";
import createSchoolReducer from "./slices/createSchoolSlice";
import planReducer from "./slices/planSlice";
import classesReducer from "./slices/classesSlice";
import studentsReducer from "./slices/studentsSlice";
import membersReducer from "./slices/membersSlice";
import subjectsReducer from "./slices/subjectsSlice";
import feesReducer from "./slices/feesSlice";
import expensesReducer from "./slices/expensesSlice";
import academicYearsReducer from "./slices/academicYearsSlice";
import archiveReducer from "./slices/archiveSlice";
import teacherProfileReducer from "./slices/teacherProfileSlice";
import teacherGradesReducer from "./slices/teacherGradesSlice";
import subscriptionRequestsReducer from "./slices/subscriptionRequestsSlice";
import notificationsReducer from "./slices/notificationsSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        createSchool: createSchoolReducer,
        plan: planReducer,
        classes: classesReducer,
        students: studentsReducer,
        members: membersReducer,
        subjects: subjectsReducer,
        fees: feesReducer,
        expenses: expensesReducer,
        academicYears: academicYearsReducer,
        archive: archiveReducer,
        teacherProfile: teacherProfileReducer,
        teacherGrades: teacherGradesReducer,
        subscriptionRequests: subscriptionRequestsReducer,
        notifications: notificationsReducer,
    },
});




