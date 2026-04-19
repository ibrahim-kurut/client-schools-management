import { z } from "zod";

const requiredTrim = (message) =>
  z
    .string()
    .trim()
    .min(1, { message });

const loginSchema = z.object({
  email: requiredTrim("يرجى إدخال البريد الإلكتروني أو كود الطالب"),
  password: z.string().trim().min(6, { message: "كلمة المرور يجب ألا تقل عن 6 خانات" }),
});

// Admin/Staff strong password schema (Must contain letters and numbers)
const strongPasswordSchema = z.string()
  .trim()
  .min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" })
  .regex(/[a-zA-Z]/, { message: "يجب أن تحتوي كلمة المرور على حروف" })
  .regex(/[0-9]/, { message: "يجب أن تحتوي كلمة المرور على أرقام" });

// Student/Parent flexible password schema (Allows only numbers)
const flexiblePasswordSchema = z.string()
  .trim()
  .min(8, { message: "كلمة المرور يجب أن تكون 8 أرقام على الأقل" })
  .regex(/^\d+$/, { message: "كلمة مرور الطالب يجب أن تتكون من أرقام فقط (رقم الهاتف)" });

const signupStep1Schema = z.object({
  firstName: requiredTrim("يرجى إدخال الاسم الأول").min(2, "الاسم قصير جداً").max(50, "الاسم طويل جداً"),
  lastName: requiredTrim("يرجى إدخال الاسم الأخير").min(2, "الاسم قصير جداً").max(50, "الاسم طويل جداً"),
  phone: z.string().trim().regex(/^\d{10,11}$/, { message: "يجب أن يكون رقم الهاتف 10 أو 11 رقماً" }),
  gender: requiredTrim("يرجى اختيار الجنس").refine(
    (v) => v === "MALE" || v === "FEMALE",
    { message: "يرجى اختيار الجنس" }
  ),
  birthDate: requiredTrim("يرجى إدخال تاريخ الميلاد").refine(
    (v) => {
      const ms = Date.parse(v);
      return !Number.isNaN(ms);
    },
    { message: "يرجى إدخال تاريخ ميلاد صالح" }
  ),
});

const signupStep2Schema = z.object({
  email: requiredTrim("يرجى إدخال البريد الإلكتروني").email("يرجى إدخال بريد إلكتروني صالح"),
  password: strongPasswordSchema, // Admins must use strong passwords
  confirmPassword: z.string().trim().min(1, "يرجى تأكيد كلمة المرور"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمة المرور وتأكيدها غير متطابقتين",
  path: ["confirmPassword"],
});

function firstZodErrorMessage(error) {
  const issue = error?.issues?.[0];
  return issue?.message || "حدث خطأ أثناء التحقق من البيانات";
}

export function validateLogin(values) {
  const result = loginSchema.safeParse(values);
  if (!result.success) return { ok: false, error: firstZodErrorMessage(result.error) };
  return { ok: true, data: result.data };
}

export function validateSignupStep1(values) {
  const result = signupStep1Schema.safeParse(values);
  if (!result.success) return { ok: false, error: firstZodErrorMessage(result.error) };
  return { ok: true, data: result.data };
}

export function validateSignupStep2(values) {
  const result = signupStep2Schema.safeParse(values);
  if (!result.success) return { ok: false, error: firstZodErrorMessage(result.error) };
  return { ok: true, data: result.data };
}

