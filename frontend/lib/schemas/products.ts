import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be non-negative"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  sku: z.string().optional(),
  categoryId: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
