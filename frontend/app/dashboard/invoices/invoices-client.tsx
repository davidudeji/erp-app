"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Plus, Search, Pencil, Trash2, RefreshCw,
  MoreHorizontal, FileText, X
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
  createInvoice,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoice,
} from "@/lib/actions/invoices";
import { invoiceSchema, type InvoiceFormData } from "@/lib/schemas/invoices";

type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";

type Invoice = {
  id: string;
  number: string;
  status: InvoiceStatus;
  customerName: string;
  customerEmail: string | null;
  totalAmount: unknown;
  dueDate: Date | null;
  createdAt: Date;
  notes: string | null;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: unknown;
    total: unknown;
    productId: string | null;
  }>;
};

interface InvoicesClientProps {
  invoices: Invoice[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

type SheetMode = "create" | "edit" | "delete" | null;

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

const STATUS_VARIANTS: Record<InvoiceStatus, "default" | "secondary" | "outline" | "destructive"> = {
  DRAFT: "secondary",
  SENT: "outline",
  PAID: "default",
  OVERDUE: "destructive",
  CANCELLED: "secondary",
};

export function InvoicesClient({
  invoices,
  total,
  page,
  pageSize,
  totalPages,
  search: initialSearch,
  status: initialStatus,
  dateFrom: initialDateFrom,
  dateTo: initialDateTo,
}: InvoicesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sheetMode, setSheetMode] = useState<SheetMode>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      notes: "",
      dueDate: "",
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchedItems = watch("items");
  const subtotal = watchedItems?.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  ) ?? 0;

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (search) params.set("search", search); else params.delete("search");
    if (status) params.set("status", status); else params.delete("status");
    if (dateFrom) params.set("dateFrom", dateFrom); else params.delete("dateFrom");
    if (dateTo) params.set("dateTo", dateTo); else params.delete("dateTo");
    router.push(`${pathname}?${params.toString()}`);
  }

  function resetFilters() {
    setSearch(""); setStatus(""); setDateFrom(""); setDateTo("");
    router.push(pathname);
  }

  function openCreate() {
    reset({ customerName: "", customerEmail: "", notes: "", dueDate: "", items: [{ description: "", quantity: 1, unitPrice: 0 }] });
    setSelectedInvoice(null);
    setSheetMode("create");
  }

  function openEdit(invoice: Invoice) {
    reset({
      customerName: invoice.customerName,
      customerEmail: invoice.customerEmail ?? "",
      notes: invoice.notes ?? "",
      dueDate: invoice.dueDate ? format(new Date(invoice.dueDate), "yyyy-MM-dd") : "",
      items: invoice.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
      })),
    });
    setSelectedInvoice(invoice);
    setSheetMode("edit");
  }

  function openDelete(invoice: Invoice) {
    setSelectedInvoice(invoice);
    setSheetMode("delete");
  }

  function closeSheet() { setSheetMode(null); setSelectedInvoice(null); }

  async function onSubmitCreate(data: InvoiceFormData) {
    try {
      await createInvoice(data);
      toast.success("Invoice created successfully");
      closeSheet();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create invoice");
    }
  }

  async function onSubmitEdit(data: InvoiceFormData) {
    if (!selectedInvoice) return;
    try {
      await updateInvoice(selectedInvoice.id, data);
      toast.success("Invoice updated successfully");
      closeSheet();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update invoice");
    }
  }

  function onConfirmDelete() {
    if (!selectedInvoice) return;
    startTransition(async () => {
      try {
        await deleteInvoice(selectedInvoice.id);
        toast.success("Invoice deleted successfully");
        closeSheet();
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete invoice");
      }
    });
  }

  function handleStatusChange(invoiceId: string, newStatus: InvoiceStatus) {
    startTransition(async () => {
      try {
        await updateInvoiceStatus(invoiceId, newStatus);
        toast.success(`Invoice status changed to ${STATUS_LABELS[newStatus]}`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update status");
      }
    });
  }

  const hasFilters = initialSearch || initialStatus || initialDateFrom || initialDateTo;

  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your invoices ({total} total)</p>
        </div>
        <Button onClick={openCreate} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" /> New Invoice
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-end sm:flex-wrap">
        <div className="flex-1 min-w-48 space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="pl-9"
            />
          </div>
        </div>
        <div className="w-full sm:w-44 space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</Label>
          <Select value={status || "all"} onValueChange={(v) => setStatus(v === "all" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {(["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"] as InvoiceStatus[]).map((s) => (
                <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
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
          <Button onClick={applyFilters} size="sm"><Search className="h-4 w-4 mr-1" /> Filter</Button>
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={resetFilters}><RefreshCw className="h-4 w-4 mr-1" /> Reset</Button>
          )}
        </div>
      </div>

      {/* Table — Desktop */}
      <div className="hidden md:block rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileText className="h-8 w-8 opacity-40" />
                    <p>No invoices found</p>
                    {hasFilters && <p className="text-xs">Try adjusting your filters</p>}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono font-medium">{invoice.number}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{invoice.customerName}</p>
                      {invoice.customerEmail && <p className="text-xs text-muted-foreground">{invoice.customerEmail}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={invoice.status}
                      onValueChange={(v) => handleStatusChange(invoice.id, v as InvoiceStatus)}
                    >
                      <SelectTrigger className="h-7 w-32 text-xs">
                        <SelectValue>
                          <Badge variant={STATUS_VARIANTS[invoice.status]} className="text-xs">
                            {STATUS_LABELS[invoice.status]}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {(["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"] as InvoiceStatus[]).map((s) => (
                          <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${Number(invoice.totalAmount).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {invoice.dueDate ? format(new Date(invoice.dueDate), "MMM d, yyyy") : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(invoice.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(invoice)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => openDelete(invoice)}>
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
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <FileText className="h-8 w-8 opacity-40" />
            <p>No invoices found</p>
          </div>
        ) : (
          invoices.map((invoice) => (
            <div key={invoice.id} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono font-medium text-sm">{invoice.number}</p>
                  <p className="font-medium">{invoice.customerName}</p>
                  {invoice.customerEmail && <p className="text-xs text-muted-foreground">{invoice.customerEmail}</p>}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-1">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(invoice)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => openDelete(invoice)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={STATUS_VARIANTS[invoice.status]}>{STATUS_LABELS[invoice.status]}</Badge>
                <span className="font-semibold">${Number(invoice.totalAmount).toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{format(new Date(invoice.createdAt), "MMM d, yyyy")}</p>
            </div>
          ))
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} totalItems={total} pageSize={pageSize} />

      {/* Create / Edit Sheet */}
      <Sheet open={sheetMode === "create" || sheetMode === "edit"} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{sheetMode === "create" ? "New Invoice" : "Edit Invoice"}</SheetTitle>
            <SheetDescription>
              {sheetMode === "create" ? "Create a new invoice." : "Update the invoice details."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit(sheetMode === "create" ? onSubmitCreate : onSubmitEdit)} className="space-y-5 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="inv-customer">Customer Name <span className="text-destructive">*</span></Label>
                <Input id="inv-customer" placeholder="e.g. Acme Corp" {...register("customerName")} />
                {errors.customerName && <p className="text-sm text-destructive">{errors.customerName.message}</p>}
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="inv-email">Customer Email</Label>
                <Input id="inv-email" type="email" placeholder="customer@example.com" {...register("customerEmail")} />
                {errors.customerEmail && <p className="text-sm text-destructive">{errors.customerEmail.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-due">Due Date</Label>
                <Input id="inv-due" type="date" {...register("dueDate")} />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Line Items <span className="text-destructive">*</span></Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Item
                </Button>
              </div>
              {errors.items && typeof errors.items.message === "string" && (
                <p className="text-sm text-destructive">{errors.items.message}</p>
              )}
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5 space-y-1">
                      {index === 0 && <Label className="text-xs text-muted-foreground">Description</Label>}
                      <Input
                        placeholder="Item description"
                        {...register(`items.${index}.description`)}
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      {index === 0 && <Label className="text-xs text-muted-foreground">Qty</Label>}
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                      />
                    </div>
                    <div className="col-span-3 space-y-1">
                      {index === 0 && <Label className="text-xs text-muted-foreground">Unit Price</Label>}
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-1">
                      {index === 0 && <div className="h-4" />}
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => remove(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end border-t pt-2">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Subtotal</p>
                  <p className="text-lg font-semibold">${subtotal.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inv-notes">Notes</Label>
              <textarea
                id="inv-notes"
                placeholder="Optional notes..."
                className="w-full min-h-16 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                {...register("notes")}
              />
            </div>

            <SheetFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeSheet}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : sheetMode === "create" ? "Create Invoice" : "Save Changes"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Sheet */}
      <Sheet open={sheetMode === "delete"} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Delete Invoice</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete invoice
              {selectedInvoice && <strong> {selectedInvoice.number}</strong>}.
            </SheetDescription>
          </SheetHeader>
          <SheetFooter className="mt-8 gap-2">
            <Button variant="outline" onClick={closeSheet}>Cancel</Button>
            <Button variant="destructive" onClick={onConfirmDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete Invoice"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
