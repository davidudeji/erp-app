"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { db } from "@/lib/db";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be non-negative"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  sku: z.string().optional(),
  categoryId: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface GetProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export async function getProducts({
  page = 1,
  pageSize = 10,
  search = "",
  categoryId = "",
  dateFrom = "",
  dateTo = "",
}: GetProductsParams) {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error("Unauthorized");

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo) (where.createdAt as Record<string, unknown>).lte = new Date(dateTo);
  }

  const skip = (page - 1) * pageSize;

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { name: "asc" } as Record<string, string>,
    }),
    db.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function createProduct(data: ProductFormData) {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = productSchema.parse(data);
  return db.product.create({ data: parsed });
}

export async function updateProduct(id: string, data: ProductFormData) {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = productSchema.parse(data);
  return db.product.update({ data: { ...parsed, id } });
}

export async function deleteProduct(id: string) {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error("Unauthorized");

  return db.product.delete({ where: { id } });
}
