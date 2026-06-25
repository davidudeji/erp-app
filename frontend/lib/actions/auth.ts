"use server";

import { z } from "zod";
import { db } from "@/lib/db";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterUserInput = z.infer<typeof registerSchema>;

export async function registerUser(input: RegisterUserInput) {
  const parsed = registerSchema.parse(input);

  return db.user.create({
    data: {
      ...parsed,
      id: crypto.randomUUID(),
      role: "user",
      tenantId: null,
    },
  });
}
