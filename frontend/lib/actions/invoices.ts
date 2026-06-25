"use server";

import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { db } from "@/lib/db";
import { invoiceSchema, type InvoiceFormData } from "@/lib/schemas/invoices";
import type { GetInvoicesParams } from "@/lib/types/invoices";

export async function getInvoices({
  page = 1,
  pageSize = 10,
  search = "",
  status = "",
  dateFrom = "",
  dateTo = "",
}: GetInvoicesParams) {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error("Unauthorized");

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { number: { contains: search, mode: "insensitive" } },
      { customerName: { contains: search, mode: "insensitive" } },
      { customerEmail: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo) (where.createdAt as Record<string, unknown>).lte = new Date(dateTo);
  }

  const skip = (page - 1) * pageSize;

  const [invoices, total] = await Promise.all([
    db.invoice.findMany({ where, skip, take: pageSize, orderBy: { createdAt: "desc" } as Record<string, string> }),
    db.invoice.count({ where }),
  ]);

  return {
    invoices,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function createInvoice(data: InvoiceFormData) {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = invoiceSchema.parse(data);
  const totalAmount = parsed.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  return db.invoice.create({ data: { ...parsed, totalAmount } });
}

export async function updateInvoice(id: string, data: InvoiceFormData) {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = invoiceSchema.parse(data);
  const totalAmount = parsed.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  return db.invoice.update({ where: { id }, data: { ...parsed, totalAmount } });
}

export async function updateInvoiceStatus(id: string, status: string) {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error("Unauthorized");

  return db.invoice.update({ where: { id }, data: { status } });
}

export async function deleteInvoice(id: string) {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error("Unauthorized");

  return db.invoice.delete({ where: { id } });
}
