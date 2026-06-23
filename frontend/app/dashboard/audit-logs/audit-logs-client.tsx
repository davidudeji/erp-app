"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Search, RefreshCw, Shield, ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/pagination";

type AuditUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type AuditLog = {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  prevValue: unknown;
  newValue: unknown;
  createdAt: Date;
  user: AuditUser;
};

interface AuditLogsClientProps {
  logs: AuditLog[];
  users: AuditUser[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  userId: string;
  action: string;
  entity: string;
  dateFrom: string;
  dateTo: string;
}

const ACTION_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CREATE: "default",
  UPDATE: "outline",
  DELETE: "destructive",
  STATUS_CHANGE: "secondary",
};

const ACTION_LABELS: Record<string, string> = {
  CREATE: "Create",
  UPDATE: "Update",
  DELETE: "Delete",
  STATUS_CHANGE: "Status Change",
};

function JsonViewer({ value, label }: { value: unknown; label: string }) {
  const [expanded, setExpanded] = useState(false);
  if (!value || typeof value !== "object") return <span className="text-muted-foreground text-xs">—</span>;
  const json = JSON.stringify(value, null, 2);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {label}
      </button>
      {expanded && (
        <pre className="mt-1 p-2 rounded text-xs bg-muted overflow-x-auto max-w-xs font-mono">{json}</pre>
      )}
    </div>
  );
}

export function AuditLogsClient({
  logs,
  users,
  total,
  page,
  pageSize,
  totalPages,
  userId: initialUserId,
  action: initialAction,
  entity: initialEntity,
  dateFrom: initialDateFrom,
  dateTo: initialDateTo,
}: AuditLogsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [userId, setUserId] = useState(initialUserId);
  const [action, setAction] = useState(initialAction);
  const [entity, setEntity] = useState(initialEntity);
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (userId) params.set("userId", userId); else params.delete("userId");
    if (action) params.set("action", action); else params.delete("action");
    if (entity) params.set("entity", entity); else params.delete("entity");
    if (dateFrom) params.set("dateFrom", dateFrom); else params.delete("dateFrom");
    if (dateTo) params.set("dateTo", dateTo); else params.delete("dateTo");
    router.push(`${pathname}?${params.toString()}`);
  }

  function resetFilters() {
    setUserId(""); setAction(""); setEntity(""); setDateFrom(""); setDateTo("");
    router.push(pathname);
  }

  const hasFilters = initialUserId || initialAction || initialEntity || initialDateFrom || initialDateTo;

  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" /> Admin Only
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Full audit trail for all CRUD operations ({total} total entries)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-end sm:flex-wrap">
        <div className="w-full sm:w-52 space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">User</Label>
          <Select value={userId || "all"} onValueChange={(v) => setUserId(v === "all" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder="All users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All users</SelectItem>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.firstName} {u.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-44 space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</Label>
          <Select value={action || "all"} onValueChange={(v) => setAction(v === "all" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              <SelectItem value="CREATE">Create</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
              <SelectItem value="STATUS_CHANGE">Status Change</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-44 space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Entity</Label>
          <Select value={entity || "all"} onValueChange={(v) => setEntity(v === "all" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder="All entities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All entities</SelectItem>
              <SelectItem value="Category">Category</SelectItem>
              <SelectItem value="Product">Product</SelectItem>
              <SelectItem value="Invoice">Invoice</SelectItem>
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
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Entity ID</TableHead>
              <TableHead>Previous</TableHead>
              <TableHead>New Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Shield className="h-8 w-8 opacity-40" />
                    <p>No audit logs found</p>
                    {hasFilters && <p className="text-xs">Try adjusting your filters</p>}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{log.user.firstName} {log.user.lastName}</p>
                      <p className="text-xs text-muted-foreground">{log.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ACTION_VARIANTS[log.action] ?? "outline"} className="text-xs">
                      {ACTION_LABELS[log.action] ?? log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{log.entity}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground max-w-24 truncate">
                    {log.entityId}
                  </TableCell>
                  <TableCell>
                    <JsonViewer value={log.prevValue} label="Previous" />
                  </TableCell>
                  <TableCell>
                    <JsonViewer value={log.newValue} label="New" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Card layout — Mobile */}
      <div className="md:hidden space-y-3">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <Shield className="h-8 w-8 opacity-40" />
            <p>No audit logs found</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge variant={ACTION_VARIANTS[log.action] ?? "outline"} className="text-xs">
                  {ACTION_LABELS[log.action] ?? log.action}
                </Badge>
                <Badge variant="outline" className="text-xs">{log.entity}</Badge>
              </div>
              <p className="text-sm font-medium">{log.user.firstName} {log.user.lastName}</p>
              <p className="text-xs text-muted-foreground">{format(new Date(log.createdAt), "MMM d, yyyy HH:mm")}</p>
              <div className="flex gap-4">
                <JsonViewer value={log.prevValue} label="Previous" />
                <JsonViewer value={log.newValue} label="New" />
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} totalItems={total} pageSize={pageSize} />
    </div>
  );
}
