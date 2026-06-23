"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Plus, Search, Pencil, Trash2, RefreshCw,
  MoreHorizontal, Layers
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/pagination";

import {
  createCategory,
  updateCategory,
  deleteCategory,
  categorySchema,
  type CategoryFormData,
} from "@/lib/actions/categories";

type Category = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  _count: { products: number };
};

interface CategoriesClientProps {
  categories: Category[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  dateFrom: string;
  dateTo: string;
}

type SheetMode = "create" | "edit" | "delete" | null;

export function CategoriesClient({
  categories,
  total,
  page,
  pageSize,
  totalPages,
  search: initialSearch,
  dateFrom: initialDateFrom,
  dateTo: initialDateTo,
}: CategoriesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sheetMode, setSheetMode] = useState<SheetMode>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filter state (local only, committed on submit/reset)
  const [search, setSearch] = useState(initialSearch);
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "" },
  });

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (search) params.set("search", search); else params.delete("search");
    if (dateFrom) params.set("dateFrom", dateFrom); else params.delete("dateFrom");
    if (dateTo) params.set("dateTo", dateTo); else params.delete("dateTo");
    router.push(`${pathname}?${params.toString()}`);
  }

  function resetFilters() {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    router.push(pathname);
  }

  function openCreate() {
    reset({ name: "", description: "" });
    setSelectedCategory(null);
    setSheetMode("create");
  }

  function openEdit(cat: Category) {
    reset({ name: cat.name, description: cat.description ?? "" });
    setSelectedCategory(cat);
    setSheetMode("edit");
  }

  function openDelete(cat: Category) {
    setSelectedCategory(cat);
    setSheetMode("delete");
  }

  function closeSheet() {
    setSheetMode(null);
    setSelectedCategory(null);
  }

  async function onSubmitCreate(data: CategoryFormData) {
    try {
      await createCategory(data);
      toast.success("Category created successfully");
      closeSheet();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create category");
    }
  }

  async function onSubmitEdit(data: CategoryFormData) {
    if (!selectedCategory) return;
    try {
      await updateCategory(selectedCategory.id, data);
      toast.success("Category updated successfully");
      closeSheet();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update category");
    }
  }

  function onConfirmDelete() {
    if (!selectedCategory) return;
    startTransition(async () => {
      try {
        await deleteCategory(selectedCategory.id);
        toast.success("Category deleted successfully");
        closeSheet();
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete category");
      }
    });
  }

  const hasFilters = initialSearch || initialDateFrom || initialDateTo;

  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your product categories ({total} total)
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="cat-search" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="cat-search"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cat-date-from" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">From</Label>
          <Input
            id="cat-date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full sm:w-40"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cat-date-to" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">To</Label>
          <Input
            id="cat-date-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full sm:w-40"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={applyFilters} size="sm" className="flex-1 sm:flex-none">
            <Search className="h-4 w-4 mr-1" />
            Filter
          </Button>
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={resetFilters} className="flex-1 sm:flex-none">
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table — Desktop */}
      <div className="hidden md:block rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Products</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Layers className="h-8 w-8 opacity-40" />
                    <p>No categories found</p>
                    {hasFilters && <p className="text-xs">Try adjusting your filters</p>}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {cat.description || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{cat._count.products}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(cat.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(cat)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => openDelete(cat)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Card layout — Mobile */}
      <div className="md:hidden space-y-3">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <Layers className="h-8 w-8 opacity-40" />
            <p>No categories found</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{cat.name}</p>
                  {cat.description && (
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-1">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(cat)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => openDelete(cat)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge variant="secondary">{cat._count.products} products</Badge>
                <span>{format(new Date(cat.createdAt), "MMM d, yyyy")}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={pageSize}
      />

      {/* Create / Edit Sheet */}
      <Sheet
        open={sheetMode === "create" || sheetMode === "edit"}
        onOpenChange={(open) => !open && closeSheet()}
      >
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "create" ? "Add Category" : "Edit Category"}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "create"
                ? "Create a new product category."
                : "Update the category details."}
            </SheetDescription>
          </SheetHeader>

          <form
            onSubmit={handleSubmit(
              sheetMode === "create" ? onSubmitCreate : onSubmitEdit
            )}
            className="space-y-5 mt-6"
          >
            <div className="space-y-2">
              <Label htmlFor="cat-name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cat-name"
                placeholder="e.g. Electronics"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat-description">Description</Label>
              <textarea
                id="cat-description"
                placeholder="Optional description..."
                className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <SheetFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeSheet}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : sheetMode === "create"
                  ? "Create Category"
                  : "Save Changes"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Sheet */}
      <Sheet open={sheetMode === "delete"} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Delete Category</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete the category
              {selectedCategory && (
                <strong> "{selectedCategory.name}"</strong>
              )}{" "}
              and may affect its associated products.
            </SheetDescription>
          </SheetHeader>
          <SheetFooter className="mt-8 gap-2">
            <Button variant="outline" onClick={closeSheet}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete Category"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
