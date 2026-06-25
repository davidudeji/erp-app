"use server";

import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  categorySchema,
  type CategoryFormData,
} from "@/lib/schemas/categories";

interface GetCategoriesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export async function getCategories({
  page = 1,
  pageSize = 10,
  search = "",
  dateFrom = "",
  dateTo = "",
}: GetCategoriesParams) {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error("Unauthorized");

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [{ name: { contains: search, mode: "insensitive" } }];
  }

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom)
      (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo)
      (where.createdAt as Record<string, unknown>).lte = new Date(dateTo);
  }

  const skip = (page - 1) * pageSize;

  const [categories, total] = await Promise.all([
    db.category.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    db.category.count({ where }),
  ]);

  return {
    categories,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function createCategory(data: CategoryFormData) {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = categorySchema.parse(data);
  return db.category.create({ data: parsed });
}

export async function updateCategory(id: string, data: CategoryFormData) {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = categorySchema.parse(data);
  return db.category.update({ where: { id }, data: parsed });
}

export async function deleteCategory(id: string) {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error("Unauthorized");

  return db.category.delete({ where: { id } });
}
