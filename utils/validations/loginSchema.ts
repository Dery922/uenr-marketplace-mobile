import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
});




// Signup Example (future-ready)
export const signupSchema = z.object({
  fullName: z.string().trim().min(6, "Fullname must be 6 characters and above"),
  email: z.string().trim().toLowerCase().email(),

  studentID: z.string().regex(/^\d{8}$/, "Student ID must be exactly 8 digits"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number is invalid"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

  confirmPassword: z.string(),

  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the Terms & Conditions",
  }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});



// Types auto-generated
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
