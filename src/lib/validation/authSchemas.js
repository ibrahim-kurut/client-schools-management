import { z } from "zod";

const requiredTrim = (message) =>
  z
    .string()
    .trim()
    .min(1, { message });

const loginSchema = z.object({
  email: requiredTrim("يرجى إدخال البريد الإلكتروني").email("يرجى إدخال بريد إلكتروني صالح"),
  password: requiredTrim("يرجى إدخال كلمة المرور"),
});

const signupStep1Schema = z.object({
  firstName: requiredTrim("يرجى إدخال الاسم الأول"),
  lastName: requiredTrim("يرجى إدخال الاسم الأخير"),
  phone: z.string().trim().regex(/^\d{10,11}$/, { message: "يجب أن يكون رقم الهاتف 10 أو 11 رقماً" }),
  gender: requiredTrim("يرجى اختيار الجنس").refine(
    (v) => v === "MALE" || v === "FEMALE",
    { message: "يرجى اختيار الجنس" }
  ),
  birthDate: requiredTrim("يرجى إدخال تاريخ الميلاد").refine(
    (v) => {
      // input type="date" returns a string like: yyyy-mm-dd
      const ms = Date.parse(v);
      return !Number.isNaN(ms);
    },
    { message: "يرجى إدخال تاريخ ميلاد صالح" }
  ),
});

const signupStep2Schema = z.object({
  email: requiredTrim("يرجى إدخال البريد الإلكتروني").email("يرجى إدخال بريد إلكتروني صالح"),
  password: requiredTrim("يرجى إدخال كلمة المرور").min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
  confirmPassword: requiredTrim("يرجى تأكيد كلمة المرور"),
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

