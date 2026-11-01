"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Download, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table as BaseTable,
  TableBody as BaseTableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead as BaseTableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type SortDirection = "ascending" | "descending";

type TableToolsContextValue = {
  query: string;
  sortColumn: number | null;
  sortDirection: SortDirection;
  setSort: (column: number) => void;
};

const TableToolsContext = React.createContext<TableToolsContextValue | null>(null);

function nodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join(" ");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return nodeText(node.props.children);
  return "";
}

function rowCells(row: React.ReactNode): React.ReactNode[] {
  if (!React.isValidElement<{ children?: React.ReactNode }>(row)) return [];
  return React.Children.toArray(row.props.children);
}

function compareValues(left: string, right: string) {
  return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
}

type SmartTableProps = React.ComponentProps<typeof BaseTable> & {
  exportName?: string;
  toolsLabel?: string;
};

function Table({
  children,
  exportName = "inspirq-table",
  toolsLabel = "Table",
  ...props
}: SmartTableProps) {
  const [query, setQuery] = React.useState("");
  const [sortColumn, setSortColumn] = React.useState<number | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("ascending");
  const tableRef = React.useRef<HTMLTableElement>(null);

  const setSort = React.useCallback((column: number) => {
    setSortColumn((current) => {
      if (current === column) {
        setSortDirection((direction) => direction === "ascending" ? "descending" : "ascending");
        return current;
      }
      setSortDirection("ascending");
      return column;
    });
  }, []);

  const downloadCsv = () => {
    const table = tableRef.current;
    if (!table) return;
    const rows = Array.from(table.querySelectorAll("tr"))
      .filter((row) => row.getClientRects().length > 0)
      .map((row) => Array.from(row.querySelectorAll("th,td")).map((cell) => `"${(cell.textContent || "").trim().replaceAll('"', '""')}"`).join(","));
    if (!rows.length) return;
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }));
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = `${exportName}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const context = React.useMemo(
    () => ({ query, sortColumn, sortDirection, setSort }),
    [query, sortColumn, sortDirection, setSort],
  );

  return (
    <TableToolsContext.Provider value={context}>
      <section className="overflow-hidden rounded-lg border border-border bg-card" aria-label={`${toolsLabel} data table`}>
        <div className="flex flex-col gap-3 border-b border-border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="bg-background pl-9"
              aria-label={`Filter ${toolsLabel}`}
              placeholder={`Filter ${toolsLabel.toLowerCase()}…`}
            />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={downloadCsv}>
            <Download aria-hidden="true" />
            Download CSV
          </Button>
        </div>
        <BaseTable ref={tableRef} {...props}>{children}</BaseTable>
      </section>
    </TableToolsContext.Provider>
  );
}

function TableBody({ children, ...props }: React.ComponentProps<typeof BaseTableBody>) {
  const context = React.useContext(TableToolsContext);
  if (!context) return <BaseTableBody {...props}>{children}</BaseTableBody>;

  const query = context.query.trim().toLocaleLowerCase();
  const rows = React.Children.toArray(children)
    .filter((row) => !query || nodeText(row).toLocaleLowerCase().includes(query));

  const sortColumn = context.sortColumn;
  if (sortColumn !== null) {
    rows.sort((left, right) => {
      const leftValue = nodeText(rowCells(left)[sortColumn]);
      const rightValue = nodeText(rowCells(right)[sortColumn]);
      const result = compareValues(leftValue, rightValue);
      return context.sortDirection === "ascending" ? result : -result;
    });
  }

  return <BaseTableBody {...props}>{rows}</BaseTableBody>;
}

function TableHead({ children, className, ...props }: React.ComponentProps<typeof BaseTableHead>) {
  const context = React.useContext(TableToolsContext);
  const [columnIndex, setColumnIndex] = React.useState<number | null>(null);
  const label = nodeText(children).trim();
  if (!context || !label) return <BaseTableHead className={className} {...props}>{children}</BaseTableHead>;

  const active = columnIndex !== null && context.sortColumn === columnIndex;
  return (
    <BaseTableHead className={className} aria-sort={active ? context.sortDirection : "none"} {...props}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 font-semibold"
        onClick={(event) => {
          const column = event.currentTarget.closest("th")?.cellIndex;
          if (column !== undefined) {
            setColumnIndex(column);
            context.setSort(column);
          }
        }}
        aria-label={`Sort by ${label}`}
      >
        {children}
        {active
          ? context.sortDirection === "ascending" ? <ArrowUp aria-hidden="true" /> : <ArrowDown aria-hidden="true" />
          : <ArrowUpDown className="text-muted-foreground" aria-hidden="true" />}
      </Button>
    </BaseTableHead>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
