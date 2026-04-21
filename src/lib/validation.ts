import { z } from "zod";

export const pinSchema = z
  .string()
  .length(4, "PIN must be exactly 4 digits")
  .regex(/^\d+$/, "PIN must contain only numbers");

export const amountSchema = z
  .string()
  .refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Amount must be a positive number");

export const transactionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["income", "expense"]),
  category: z.string().optional(),
});

export const emailSchema = z
  .string()
  .email("Invalid email address");

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters");

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .trim();
}

export function validatePin(pin: string): { valid: boolean; error?: string } {
  const result = pinSchema.safeParse(pin);
  if (!result.success) {
    return { 
      valid: false, 
      error: result.error.issues[0]?.message || "Invalid PIN" 
    };
  }
  return { valid: true };
}