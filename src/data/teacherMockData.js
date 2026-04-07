// ============================================
// Teacher Dashboard - Mock Data
// ============================================

export const teacherProfile = {
  id: "teacher-001",
  firstName: "أحمد",
  lastName: "الخالدي",
  email: "ahmed.khalidi@school.com",
  phone: "0771234567",
  gender: "MALE",
  birthDate: "1988-03-15",
  role: "TEACHER",
  image: null,
  schoolName: "مدرسة النور الأهلية",
};

// ============================================
// Classes & Subjects
// ============================================

export const teacherClasses = [
  {
    id: "class-1",
    name: "الصف الأول",
    subjectsCount: 1,
    studentsCount: 8,
    subjects: [{ id: "sub-1", name: "الرياضيات" }],
    students: [
      { id: "s1", firstName: "علي", lastName: "حسن", gender: "MALE", phone: "0770000001" },
      { id: "s2", firstName: "فاطمة", lastName: "أحمد", gender: "FEMALE", phone: "0770000002" },
      { id: "s3", firstName: "محمد", lastName: "كريم", gender: "MALE", phone: "0770000003" },
      { id: "s4", firstName: "زينب", lastName: "جاسم", gender: "FEMALE", phone: "0770000004" },
      { id: "s5", firstName: "حسين", lastName: "عباس", gender: "MALE", phone: "0770000005" },
      { id: "s6", firstName: "مريم", lastName: "صالح", gender: "FEMALE", phone: "0770000006" },
      { id: "s7", firstName: "عمر", lastName: "خالد", gender: "MALE", phone: "0770000007" },
      { id: "s8", firstName: "نور", lastName: "ياسين", gender: "FEMALE", phone: "0770000008" },
    ],
  },
  {
    id: "class-2",
    name: "الصف الثاني",
    subjectsCount: 1,
    studentsCount: 6,
    subjects: [{ id: "sub-2", name: "العلوم" }],
    students: [
      { id: "s9", firstName: "أمير", lastName: "سعد", gender: "MALE", phone: "0770000009" },
      { id: "s10", firstName: "رقية", lastName: "نعمة", gender: "FEMALE", phone: "0770000010" },
      { id: "s11", firstName: "يوسف", lastName: "طالب", gender: "MALE", phone: "0770000011" },
      { id: "s12", firstName: "سارة", lastName: "هادي", gender: "FEMALE", phone: "0770000012" },
      { id: "s13", firstName: "كرار", lastName: "مهدي", gender: "MALE", phone: "0770000013" },
      { id: "s14", firstName: "هدى", lastName: "علوان", gender: "FEMALE", phone: "0770000014" },
    ],
  },
  {
    id: "class-3",
    name: "الصف الثالث",
    subjectsCount: 2,
    studentsCount: 7,
    subjects: [
      { id: "sub-3", name: "الرياضيات" },
      { id: "sub-4", name: "الفيزياء" },
    ],
    students: [
      { id: "s15", firstName: "حسام", lastName: "فاضل", gender: "MALE", phone: "0770000015" },
      { id: "s16", firstName: "ريم", lastName: "عادل", gender: "FEMALE", phone: "0770000016" },
      { id: "s17", firstName: "مصطفى", lastName: "جواد", gender: "MALE", phone: "0770000017" },
      { id: "s18", firstName: "بتول", lastName: "كاظم", gender: "FEMALE", phone: "0770000018" },
      { id: "s19", firstName: "عبدالله", lastName: "رشيد", gender: "MALE", phone: "0770000019" },
      { id: "s20", firstName: "آية", lastName: "ناظم", gender: "FEMALE", phone: "0770000020" },
      { id: "s21", firstName: "حيدر", lastName: "سلمان", gender: "MALE", phone: "0770000021" },
    ],
  },
];

// ============================================
// All subjects the teacher teaches
// ============================================

export const teacherSubjects = [
  { id: "sub-1", name: "الرياضيات", className: "الصف الأول", classId: "class-1" },
  { id: "sub-2", name: "العلوم", className: "الصف الثاني", classId: "class-2" },
  { id: "sub-3", name: "الرياضيات", className: "الصف الثالث", classId: "class-3" },
  { id: "sub-4", name: "الفيزياء", className: "الصف الثالث", classId: "class-3" },
];

// ============================================
// Salary History
// ============================================

export const salaryHistory = [
  { id: "sal-1", title: "راتب شهر آذار 2025", amount: 750000, date: "2025-03-28", type: "SALARY" },
  { id: "sal-2", title: "راتب شهر شباط 2025", amount: 750000, date: "2025-02-27", type: "SALARY" },
  { id: "sal-3", title: "راتب شهر كانون الثاني 2025", amount: 750000, date: "2025-01-30", type: "SALARY" },
  { id: "sal-4", title: "راتب شهر كانون الأول 2024", amount: 700000, date: "2024-12-28", type: "SALARY" },
  { id: "sal-5", title: "راتب شهر تشرين الثاني 2024", amount: 700000, date: "2024-11-28", type: "SALARY" },
];

// ============================================
// Grades Data
// ============================================

export const examTypes = [
  { value: "OCTOBER", label: "اختبار تشرين الأول" },
  { value: "NOVEMBER", label: "اختبار تشرين الثاني" },
  { value: "DECEMBER", label: "اختبار كانون الأول" },
  { value: "MIDYEAR", label: "امتحان نصف السنة" },
  { value: "MARCH", label: "اختبار آذار" },
  { value: "APRIL", label: "اختبار نيسان" },
  { value: "FINAL_EXAM", label: "الامتحان النهائي" },
];

export const existingGrades = [
  // Class 1 - Math - October
  { studentId: "s1", subjectId: "sub-1", examType: "OCTOBER", score: 85 },
  { studentId: "s2", subjectId: "sub-1", examType: "OCTOBER", score: 92 },
  { studentId: "s3", subjectId: "sub-1", examType: "OCTOBER", score: 78 },
  { studentId: "s4", subjectId: "sub-1", examType: "OCTOBER", score: 95 },
  { studentId: "s5", subjectId: "sub-1", examType: "OCTOBER", score: 67 },
  { studentId: "s6", subjectId: "sub-1", examType: "OCTOBER", score: 88 },
  { studentId: "s7", subjectId: "sub-1", examType: "OCTOBER", score: 73 },
  { studentId: "s8", subjectId: "sub-1", examType: "OCTOBER", score: 90 },
  // Class 1 - Math - November
  { studentId: "s1", subjectId: "sub-1", examType: "NOVEMBER", score: 80 },
  { studentId: "s2", subjectId: "sub-1", examType: "NOVEMBER", score: 88 },
  { studentId: "s3", subjectId: "sub-1", examType: "NOVEMBER", score: 82 },
  { studentId: "s4", subjectId: "sub-1", examType: "NOVEMBER", score: 91 },
];

// ============================================
// Attendance Mock Data
// ============================================

export const attendanceHistory = [
  {
    date: "2025-04-06",
    classId: "class-1",
    className: "الصف الأول",
    records: [
      { studentId: "s1", status: "PRESENT" },
      { studentId: "s2", status: "PRESENT" },
      { studentId: "s3", status: "ABSENT", reason: "مرض" },
      { studentId: "s4", status: "PRESENT" },
      { studentId: "s5", status: "LATE", reason: "تأخر بسبب المواصلات" },
      { studentId: "s6", status: "PRESENT" },
      { studentId: "s7", status: "EXCUSED", reason: "إذن من الإدارة" },
      { studentId: "s8", status: "PRESENT" },
    ],
  },
  {
    date: "2025-04-05",
    classId: "class-1",
    className: "الصف الأول",
    records: [
      { studentId: "s1", status: "PRESENT" },
      { studentId: "s2", status: "ABSENT", reason: "غياب بدون عذر" },
      { studentId: "s3", status: "PRESENT" },
      { studentId: "s4", status: "PRESENT" },
      { studentId: "s5", status: "PRESENT" },
      { studentId: "s6", status: "LATE" },
      { studentId: "s7", status: "PRESENT" },
      { studentId: "s8", status: "PRESENT" },
    ],
  },
  {
    date: "2025-04-06",
    classId: "class-2",
    className: "الصف الثاني",
    records: [
      { studentId: "s9", status: "PRESENT" },
      { studentId: "s10", status: "PRESENT" },
      { studentId: "s11", status: "PRESENT" },
      { studentId: "s12", status: "ABSENT", reason: "ظرف عائلي" },
      { studentId: "s13", status: "PRESENT" },
      { studentId: "s14", status: "PRESENT" },
    ],
  },
];

export const attendanceStatusLabels = {
  PRESENT: { label: "حاضر", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  ABSENT: { label: "غائب", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
  LATE: { label: "متأخر", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  EXCUSED: { label: "مستأذن", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
};

// ============================================
// Recent Activity
// ============================================

export const recentActivities = [
  { id: "act-1", type: "grade", message: "تم رصد درجات اختبار تشرين الأول - الرياضيات - الصف الأول", time: "منذ ساعة", icon: "📝" },
  { id: "act-2", type: "grade", message: "تم تعديل درجة الطالب علي حسن في مادة الرياضيات", time: "منذ 3 ساعات", icon: "✏️" },
  { id: "act-3", type: "attendance", message: "تم تسجيل حضور الصف الأول ليوم الأحد", time: "منذ 5 ساعات", icon: "✅" },
  { id: "act-4", type: "salary", message: "تم استلام راتب شهر آذار 2025", time: "منذ يومين", icon: "💰" },
  { id: "act-5", type: "grade", message: "تم رصد درجات اختبار تشرين الثاني - الرياضيات - الصف الأول", time: "منذ 3 أيام", icon: "📝" },
  { id: "act-6", type: "attendance", message: "تم تسجيل حضور الصف الثاني ليوم السبت", time: "منذ 4 أيام", icon: "✅" },
];

// ============================================
// Dashboard Quick Stats
// ============================================

export const teacherStats = {
  totalClasses: 3,
  totalStudents: 21,
  totalSubjects: 4,
  lastSalary: 750000,
  attendanceRate: 92,
  gradesEntered: 12,
};
