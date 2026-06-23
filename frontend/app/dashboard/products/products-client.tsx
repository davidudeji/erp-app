"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Plus, Search, Pencil, Trash2, RefreshCw,
  MoreHorizontal, Package
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/pagination";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  productSchema,
  type ProductFormData,
} from "@/lib/actions/products";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  description: string | null;
  price: unknown;
  stock: number;
  sku: string | null;
  createdAt: Date;
  category: Category | null;
};

interface ProductsClientProps {
  products: Product[];
  categories: Category[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  categoryId: string;
  dateFrom: string;
  dateTo: string;
}

type SheetMode = "create" | "edit" | "delete" | null;

export function ProductsClient({
  products,
  categories,
  total,
  page,
  pageSize,
  totalPages,
  search: initialSearch,
  categoryId: initialCategoryId,
  dateFrom: initialDateFrom,
  dateTo: initialDateTo,
}: ProductsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sheetMode, setSheetMode] = useState<SheetMode>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", description: "", price: 0, stock: 0, sku: "", categoryId: "" },
  });

  const watchedCategoryId = watch("categoryId");

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (search) params.set("search", search); else params.delete("search");
    if (categoryId) params.set("categoryId", categoryId); else params.delete("categoryId");
    if (dateFrom) params.set("dateFrom", dateFrom); else params.delete("dateFrom");
    if (dateTo) params.set("dateTo", dateTo); else params.delete("dateTo");
    router.push(`${pathname}?${params.toString()}`);
  }

  function resetFilters() {
    setSearch(""); setCategoryId(""); setDateFrom(""); setDateTo("");
    router.push(pathname);
  }

  function openCreate() {
    reset({ name: "", description: "", price: 0, stock: 0, sku: "", categoryId: "" });
    setSelectedProduct(null);
    setSheetMode("create");
  }

  function openEdit(product: Product) {
    reset({
      name: product.name,
      description: product.description ?? "",
      price: Number(product.price),
      stock: product.stock,
      sku: product.sku ?? "",
      categoryId: product.category?.id ?? "",
    });
    setSelectedProduct(product);
    setSheetMode("edit");
  }

  function openDelete(product: Product) {
    setSelectedProduct(product);
    setSheetMode("delete");
  }

  function closeSheet() { setSheetMode(null); setSelectedProduct(null); }

  async function onSubmitCreate(data: ProductFormData) {
    try {
      await createProduct(data);
      toast.success("Product created successfully");
      closeSheet();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    }
  }

  async function onSubmitEdit(data: ProductFormData) {
    if (!selectedProduct) return;
    try {
      await updateProduct(selectedProduct.id, data);
      toast.success("Product updated successfully");
      closeSheet();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    }
  }

  function onConfirmDelete() {
    if (!selectedProduct) return;
    startTransition(async () => {
      try {
        await deleteProduct(selectedProduct.id);
        toast.success("Product deleted successfully");
        closeSheet();
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete product");
      }
    });
  }

  const hasFilters = initialSearch || initialCategoryId || initialDateFrom || initialDateTo;

  function getStockBadge(stock: number) {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock < 10) return <Badge variant="outline" className="border-yellow-500 text-yellow-600">{stock} low</Badge>;
    return <Badge variant="secondary">{stock}</Badge>;
  }

  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your product catalog ({total} total)
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-end sm:flex-wrap">
        <div className="flex-1 min-w-48 space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="pl-9"
            />
          </div>
        </div>
        <div className="w-full sm:w-48 space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</Label>
          <Select value={categoryId || "all"} onValueChange={(v) => setCategoryId(v === "all" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">From</Label>
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full sm:w-40" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">To</Label>
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full sm:w-40" />
        </div>
        <div className="flex gap-2">
          <Button onClick={applyFilters} size="sm">
            <Search className="h-4 w-4 mr-1" /> Filter
          </Button>
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <RefreshCw className="h-4 w-4 mr-1" /> Reset
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
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Package className="h-8 w-8 opacity-40" />
                    <p>No products found</p>
                    {hasFilters && <p className="text-xs">Try adjusting your filters</p>}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      {product.description && (
                        <p className="text-xs text-muted-foreground truncate max-w-xs">{product.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm font-mono">{product.sku || "—"}</TableCell>
                  <TableCell>
                    {product.category ? (
                      <Badge variant="outline">{product.category.name}</Badge>
                    ) : "—"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${Number(product.price).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">{getStockBadge(product.stock)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(product.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(product)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => openDelete(product)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
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
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <Package className="h-8 w-8 opacity-40" />
            <p>No products found</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{product.name}</p>
                  {product.sku && <p className="text-xs font-mono text-muted-foreground">{product.sku}</p>}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-1">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(product)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => openDelete(product)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold">${Number(product.price).toFixed(2)}</span>
                {getStockBadge(product.stock)}
                {product.category && <Badge variant="outline">{product.category.name}</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">{format(new Date(product.createdAt), "MMM d, yyyy")}</p>
            </div>
          ))
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} totalItems={total} pageSize={pageSize} />

      {/* Create / Edit Sheet */}
      <Sheet open={sheetMode === "create" || sheetMode === "edit"} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{sheetMode === "create" ? "Add Product" : "Edit Product"}</SheetTitle>
            <SheetDescription>
              {sheetMode === "create" ? "Add a new product to your catalog." : "Update the product details."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit(sheetMode === "create" ? onSubmitCreate : onSubmitEdit)} className="space-y-5 mt-6">
            <div className="space-y-2">
              <Label htmlFor="prod-name">Name <span className="text-destructive">*</span></Label>
              <Input id="prod-name" placeholder="e.g. Laptop Pro X" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="prod-description">Description</Label>
              <textarea
                id="prod-description"
                placeholder="Optional description..."
                className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prod-price">Price ($) <span className="text-destructive">*</span></Label>
                <Input
                  id="prod-price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-stock">Stock <span className="text-destructive">*</span></Label>
                <Input
                  id="prod-stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register("stock", { valueAsNumber: true })}
                />
                {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prod-sku">SKU</Label>
              <Input id="prod-sku" placeholder="e.g. LAP-X-001" {...register("sku")} />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={watchedCategoryId || "none"}
                onValueChange={(v) => setValue("categoryId", v === "none" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <SheetFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeSheet}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : sheetMode === "create" ? "Create Product" : "Save Changes"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Sheet */}
      <Sheet open={sheetMode === "delete"} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Delete Product</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete
              {selectedProduct && <strong> "{selectedProduct.name}"</strong>}.
            </SheetDescription>
          </SheetHeader>
          <SheetFooter className="mt-8 gap-2">
            <Button variant="outline" onClick={closeSheet}>Cancel</Button>
            <Button variant="destructive" onClick={onConfirmDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete Product"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
