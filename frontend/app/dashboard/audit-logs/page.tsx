import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";
import { getAuditLogs } from "@/lib/actions/audit-logs";
import { AuditLogsClient } from "./audit-logs-client";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    userId?: string;
    action?: string;
    entity?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

async function AuditLogsContent({ searchParams }: PageProps) {
  const session = await getServerSession(authConfig);
  if (!session?.user) redirect("/login");

  const role = session.user.role;
  if (role !== "admin") redirect("/dashboard");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const userId = params.userId ?? "";
  const action = params.action ?? "";
  const entity = params.entity ?? "";
  const dateFrom = params.dateFrom ?? "";
  const dateTo = params.dateTo ?? "";

  const data = await getAuditLogs({ page, pageSize: 10, userId, action, entity, dateFrom, dateTo });

  return (
    <AuditLogsClient
      logs={data.logs as Parameters<typeof AuditLogsClient>[0]["logs"]}
      users={data.users}
      total={data.total}
      page={data.page}
      pageSize={data.pageSize}
      totalPages={data.totalPages}
      userId={userId}
      action={action}
      entity={entity}
      dateFrom={dateFrom}
      dateTo={dateTo}
    />
  );
}

export default async function AuditLogsPage(props: PageProps) {
  return (
    <Suspense fallback={
      <div className="space-y-6 p-6 md:p-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    }>
      <AuditLogsContent {...props} />
    </Suspense>
  );
}
