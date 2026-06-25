import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";
import { getProducts } from "@/lib/actions/products";
import { db } from "@/lib/db";
import { ProductsClient } from "./products-client";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoryId?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

async function ProductsContent({ searchParams }: PageProps) {
  const session = await getServerSession(authConfig);
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const search = params.search ?? "";
  const categoryId = params.categoryId ?? "";
  const dateFrom = params.dateFrom ?? "";
  const dateTo = params.dateTo ?? "";

  const userId = session.user.id;
  const dbUser = await db.user.findUnique<{ tenantId?: string | null }>({
    where: { id: userId },
    select: { tenantId: true },
  });
  const tenantId = dbUser?.tenantId ?? "";

  const [data, categories] = await Promise.all([
    getProducts({ page, pageSize: 10, search, categoryId, dateFrom, dateTo }),
    tenantId
      ? db.category.findMany({
          where: { tenantId },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        })
      : Promise.resolve([]),
  ]);

  return (
    <ProductsClient
      products={
        data.products as Parameters<typeof ProductsClient>[0]["products"]
      }
      categories={categories}
      total={data.total}
      page={data.page}
      pageSize={data.pageSize}
      totalPages={data.totalPages}
      search={search}
      categoryId={categoryId}
      dateFrom={dateFrom}
      dateTo={dateTo}
    />
  );
}

export default async function ProductsPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 p-6 md:p-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <ProductsContent {...props} />
    </Suspense>
  );
}
