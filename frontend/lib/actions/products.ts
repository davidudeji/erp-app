"use server";

import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { db } from "@/lib/db";
import { productSchema, type ProductFormData } from "@/lib/schemas/products";
import type { GetProductsParams } from "@/lib/types/products";

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
  return db.product.update({ where: { id }, data: parsed });
}

export async function deleteProduct(id: string) {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error("Unauthorized");

  return db.product.delete({ where: { id } });
}
