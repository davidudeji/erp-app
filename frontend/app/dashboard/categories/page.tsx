import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";
import { getCategories } from "@/lib/actions/categories";
import { CategoriesClient } from "./categories-client";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

async function CategoriesContent({ searchParams }: PageProps) {
  const session = await getServerSession(authConfig);
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const search = params.search ?? "";
  const dateFrom = params.dateFrom ?? "";
  const dateTo = params.dateTo ?? "";

  const data = await getCategories({ page, pageSize: 10, search, dateFrom, dateTo });

  return (
    <CategoriesClient
      categories={data.categories as Parameters<typeof CategoriesClient>[0]["categories"]}
      total={data.total}
      page={data.page}
      pageSize={data.pageSize}
      totalPages={data.totalPages}
      search={search}
      dateFrom={dateFrom}
      dateTo={dateTo}
    />
  );
}

export default async function CategoriesPage(props: PageProps) {
  return (
    <Suspense fallback={
      <div className="space-y-6 p-6 md:p-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    }>
      <CategoriesContent {...props} />
    </Suspense>
  );
}
