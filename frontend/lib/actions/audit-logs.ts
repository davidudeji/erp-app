"use server";

import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { db } from "@/lib/db";

interface GetAuditLogsParams {
  page?: number;
  pageSize?: number;
  userId?: string;
  action?: string;
  entity?: string;
  dateFrom?: string;
  dateTo?: string;
}

export async function getAuditLogs({
  page = 1,
  pageSize = 10,
  userId = "",
  action = "",
  entity = "",
  dateFrom = "",
  dateTo = "",
}: GetAuditLogsParams) {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error("Unauthorized");

  const where: Record<string, unknown> = {};

  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (entity) where.entity = entity;

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom)
      (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo)
      (where.createdAt as Record<string, unknown>).lte = new Date(dateTo);
  }

  const skip = (page - 1) * pageSize;

  const [logs, total, users] = await Promise.all([
    db.auditLog.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    db.auditLog.count({ where }),
    db.user.findMany({
      select: { id: true, firstName: true, lastName: true, email: true },
    }),
  ]);

  return {
    logs,
    users,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
