import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Copy,
  Download,
  Edit3,
  Eye,
  FileCheck2,
  FileClock,
  FileText,
  History,
  IndianRupee,
  MoreHorizontal,
  Plus,
  Printer,
  ReceiptText,
  RefreshCw,
  Search,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/SmartTable";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";

type StudioRole = "venue" | "coach" | "organizer";
type DocumentType = "quotation" | "proforma" | "invoice" | "credit_note";
type DocumentStatus = "draft" | "sent" | "viewed" | "accepted" | "rejected" | "partial" | "paid" | "overdue" | "void";
type Currency = "INR" | "USD" | "EUR" | "GBP" | "AED";

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  taxRate: number;
  discount: number;
};

type Activity = {
  id: string;
  label: string;
  at: string;
};

type BusinessDocument = {
  id: string;
  number: string;
  type: DocumentType;
  status: DocumentStatus;
  customerName: string;
  company: string;
  email: string;
  phone: string;
  billingAddress: string;
  taxId: string;
  issueDate: string;
  dueDate: string;
  currency: Currency;
  items: LineItem[];
  shipping: number;
  adjustment: number;
  paid: number;
  reference: string;
  notes: string;
  terms: string;
  recurring: boolean;
  recurringFrequency: "monthly" | "quarterly" | "yearly";
  nextRecurringDate: string;
  sourceDocument?: string;
  activities: Activity[];
  updatedAt: string;
};

type RoleConfig = {
  name: string;
  prefix: string;
  description: string;
  defaultItems: string[];
};

const ROLE_CONFIG: Record<StudioRole, RoleConfig> = {
  venue: {
    name: "Court Masters Arena",
    prefix: "CMA",
    description: "Bookings, memberships, equipment rentals, deposits, and corporate accounts",
    defaultItems: ["Court booking", "Equipment rental", "Monthly membership"],
  },
  coach: {
    name: "Coach Rajesh Performance",
    prefix: "CRP",
    description: "Assessments, sessions, packages, camps, and corporate coaching",
    defaultItems: ["Private coaching session", "Monthly training package", "Performance assessment"],
  },
  organizer: {
    name: "SportsFest Events",
    prefix: "SFE",
    description: "Registrations, team entries, sponsorships, merchandise, and vendor recovery",
    defaultItems: ["Tournament registration", "Team entry fee", "Sponsorship package"],
  },
};

const STATUS_STYLE: Record<DocumentStatus, string> = {
  draft: "border-border bg-muted text-muted-foreground",
  sent: "border-blue-200 bg-blue-50 text-blue-700",
  viewed: "border-violet-200 bg-violet-50 text-violet-700",
  accepted: "border-cyan-200 bg-cyan-50 text-cyan-700",
  rejected: "border-orange-200 bg-orange-50 text-orange-700",
  partial: "border-amber-200 bg-amber-50 text-amber-700",
  paid: "border-sky-200 bg-sky-50 text-sky-700",
  overdue: "border-red-200 bg-red-50 text-red-700",
  void: "border-border bg-muted text-muted-foreground",
};

const SYMBOLS: Record<Currency, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
};

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};
const uid = () => Math.random().toString(36).slice(2, 10);
const finite = (value: number) => Number.isFinite(value) ? value : 0;
const money = (value: number, currency: Currency) =>
  `${SYMBOLS[currency]}${finite(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const labelFor = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const timestamp = () => new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

function calculate(document: Pick<BusinessDocument, "items" | "shipping" | "adjustment">) {
  const subtotal = document.items.reduce((sum, item) => {
    const quantity = Math.max(0, finite(item.quantity));
    const rate = Math.max(0, finite(item.rate));
    const discount = Math.min(100, Math.max(0, finite(item.discount)));
    return sum + quantity * rate * (1 - discount / 100);
  }, 0);
  const tax = document.items.reduce((sum, item) => {
    const quantity = Math.max(0, finite(item.quantity));
    const rate = Math.max(0, finite(item.rate));
    const discount = Math.min(100, Math.max(0, finite(item.discount)));
    const taxable = quantity * rate * (1 - discount / 100);
    return sum + taxable * Math.max(0, finite(item.taxRate)) / 100;
  }, 0);
  return {
    subtotal,
    tax,
    total: Math.max(0, subtotal + tax + Math.max(0, finite(document.shipping)) + finite(document.adjustment)),
  };
}

function freshDocument(role: StudioRole, type: DocumentType = "invoice"): BusinessDocument {
  const config = ROLE_CONFIG[role];
  return {
    id: uid(),
    number: "",
    type,
    status: "draft",
    customerName: "",
    company: "",
    email: "",
    phone: "",
    billingAddress: "",
    taxId: "",
    issueDate: today(),
    dueDate: plusDays(type === "quotation" ? 14 : 7),
    currency: "INR",
    items: [{ id: uid(), description: config.defaultItems[0], quantity: 1, rate: 0, taxRate: 18, discount: 0 }],
    shipping: 0,
    adjustment: 0,
    paid: 0,
    reference: "",
    notes: "",
    terms: type === "quotation" ? "Quotation valid until the date shown." : "Payment due by the date shown.",
    recurring: false,
    recurringFrequency: "monthly",
    nextRecurringDate: plusDays(30),
    activities: [{ id: uid(), label: "Draft created", at: timestamp() }],
    updatedAt: timestamp(),
  };
}

function seedDocuments(role: StudioRole): BusinessDocument[] {
  const config = ROLE_CONFIG[role];
  const build = (
    id: string,
    suffix: string,
    type: DocumentType,
    status: DocumentStatus,
    customerName: string,
    amount: number,
    paid: number,
    dueDate: string,
  ): BusinessDocument => ({
    ...freshDocument(role, type),
    id,
    number: `${config.prefix}-${type === "quotation" ? "QUO" : type === "proforma" ? "PRO" : type === "credit_note" ? "CRN" : "INV"}-${suffix}`,
    status,
    customerName,
    company: customerName.includes(" ") ? "" : customerName,
    email: `${customerName.toLowerCase().replaceAll(" ", ".")}@example.com`,
    items: [{ id: uid(), description: config.defaultItems[Number(suffix) % config.defaultItems.length], quantity: 1, rate: amount / 1.18, taxRate: 18, discount: 0 }],
    paid,
    dueDate,
    reference: `REF-${suffix}`,
    activities: [
      { id: uid(), label: "Document created", at: "15 Jul 2026, 10:30 am" },
      ...(status !== "draft" ? [{ id: uid(), label: `Document ${status}`, at: "16 Jul 2026, 9:15 am" }] : []),
    ],
  });
  return [
    build("seed-1", "1048", "invoice", "partial", "Apex Sports", 18400, 10000, plusDays(5)),
    build("seed-2", "0312", "quotation", "viewed", "Northstar Club", 48000, 0, plusDays(12)),
    build("seed-3", "1047", "invoice", "paid", "Mira Rao", 6400, 6400, plusDays(-3)),
    build("seed-4", "1046", "invoice", "overdue", "Kinetic Brands", 86000, 0, plusDays(-8)),
    build("seed-5", "1045", "invoice", "draft", "Arjun Mehta", 12000, 0, plusDays(7)),
  ];
}

function validate(document: BusinessDocument) {
  const errors: string[] = [];
  if (!document.customerName.trim()) errors.push("Customer name is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.email.trim())) errors.push("Enter a valid billing email.");
  if (!document.issueDate || !document.dueDate) errors.push("Issue and due dates are required.");
  if (document.issueDate && document.dueDate && document.dueDate < document.issueDate) errors.push("Due or validity date cannot be before the issue date.");
  if (document.items.length === 0) errors.push("Add at least one line item.");
  if (document.items.some((item) => !item.description.trim())) errors.push("Every line item needs a description.");
  if (document.items.some((item) => finite(item.quantity) <= 0)) errors.push("Line-item quantity must be greater than zero.");
  if (document.items.some((item) => finite(item.rate) < 0)) errors.push("Line-item rate cannot be negative.");
  if (calculate(document).total <= 0 && document.type !== "credit_note") errors.push("Document total must be greater than zero.");
  if (document.type === "credit_note" && !document.sourceDocument) errors.push("A credit note must reference its source invoice.");
  if (document.recurring && !document.nextRecurringDate) errors.push("Choose the next recurring date.");
  return errors;
}

function Metric({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: typeof FileText }) {
  return (
    <Card className="gap-0">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{note}</div>
        </div>
        <div className="rounded-lg bg-primary/10 p-2 text-brand-text"><Icon /></div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  return <Badge variant="outline" className={STATUS_STYLE[status]}>{labelFor(status)}</Badge>;
}

function EditorDialog({
  open,
  onOpenChange,
  value,
  role,
  sourceInvoices,
  existingDocuments,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: BusinessDocument | null;
  role: StudioRole;
  sourceInvoices: BusinessDocument[];
  existingDocuments: BusinessDocument[];
  onSave: (document: BusinessDocument) => void;
}) {
  const [form, setForm] = useState<BusinessDocument>(() => value ?? freshDocument(role));
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setForm(value ? structuredClone(value) : freshDocument(role));
    setErrors([]);
  }, [value, open, role]);

  const totals = calculate(form);
  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setForm((current) => ({ ...current, items: current.items.map((item) => item.id === id ? { ...item, ...patch } : item) }));
  const save = () => {
    const nextErrors = validate(form);
    if (form.number.trim() && existingDocuments.some((document) => document.id !== form.id && document.number.toLowerCase() === form.number.trim().toLowerCase())) {
      nextErrors.push("Document number already exists. Use a unique sequence number.");
    }
    if (nextErrors.length) {
      setErrors(nextErrors);
      return;
    }
    onSave({ ...form, updatedAt: timestamp() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[94vh] overflow-y-auto p-0 sm:max-w-6xl">
        <div className="sticky top-0 z-10 border-b bg-background/95 px-6 py-5 backdrop-blur">
        <DialogHeader>
          <DialogTitle>{value ? `Edit ${value.number || labelFor(value.type)}` : "Create a new document"}</DialogTitle>
          <DialogDescription>Move from customer details to a ready-to-send document without leaving this workspace.</DialogDescription>
        </DialogHeader>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {["Document", "Customer", "Line items", "Delivery"].map((step, index) => (
              <div key={step} className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-xs font-medium">
                <span className="flex size-5 items-center justify-center rounded-full bg-background text-brand-text">{index + 1}</span>
                <span className="hidden sm:inline">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5 px-6">
        {value && value.status !== "draft" && (
          <Alert>
            <History />
            <AlertTitle>Controlled revision</AlertTitle>
            <AlertDescription>Saving a sent document creates a draft revision and records the change in its activity history.</AlertDescription>
          </Alert>
        )}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle />
            <AlertTitle>Resolve these issues</AlertTitle>
            <AlertDescription><div className="space-y-1">{errors.map((error) => <div key={error}>{error}</div>)}</div></AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-6">
        <div className="rounded-xl border p-4">
          <div className="mb-4"><div className="text-sm font-semibold">Document setup</div><div className="mt-1 text-xs text-muted-foreground">Choose the commercial document, numbering, and settlement currency.</div></div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Document type</Label>
            <Select value={form.type} onValueChange={(type: DocumentType) => setForm({ ...form, type })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="quotation">Quotation</SelectItem>
                <SelectItem value="proforma">Proforma invoice</SelectItem>
                <SelectItem value="invoice">Tax invoice</SelectItem>
                <SelectItem value="credit_note">Credit note</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="document-number">Document number</Label>
            <Input id="document-number" value={form.number} onChange={(event) => setForm({ ...form, number: event.target.value })} placeholder="Auto-generated if blank" />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select value={form.currency} onValueChange={(currency: Currency) => setForm({ ...form, currency })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{(["INR", "USD", "EUR", "GBP", "AED"] as Currency[]).map((currency) => <SelectItem key={currency} value={currency}>{currency} · {SYMBOLS[currency]}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        </div>

        <div className="rounded-xl border p-4">
          <div className="mb-4"><div className="text-sm font-semibold">Customer and billing</div><div className="mt-1 text-xs text-muted-foreground">Details shown on the document and used for delivery.</div></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="customer-name">Customer name</Label><Input id="customer-name" value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="customer-company">Company</Label><Input id="customer-company" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="customer-email">Billing email</Label><Input id="customer-email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="customer-phone">Phone</Label><Input id="customer-phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="customer-tax">Tax ID / GSTIN</Label><Input id="customer-tax" value={form.taxId} onChange={(event) => setForm({ ...form, taxId: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="document-reference">PO / booking / contract reference</Label><Input id="document-reference" value={form.reference} onChange={(event) => setForm({ ...form, reference: event.target.value })} /></div>
            <div className="space-y-2 sm:col-span-2"><Label htmlFor="billing-address">Billing address</Label><Textarea id="billing-address" value={form.billingAddress} onChange={(event) => setForm({ ...form, billingAddress: event.target.value })} /></div>
          </div>
        </div>

        <div className="rounded-xl border p-4">
          <div className="mb-4 flex items-start justify-between gap-3"><div><div className="text-sm font-semibold">Products and services</div><div className="mt-1 text-xs text-muted-foreground">Apply discounts and tax independently to every line.</div></div><Button variant="outline" size="sm" onClick={() => setForm({ ...form, items: [...form.items, { id: uid(), description: "", quantity: 1, rate: 0, taxRate: 18, discount: 0 }] })}><Plus />Add line</Button></div>
          <div className="space-y-3">
            {form.items.map((item, index) => (
              <div key={item.id} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-12">
                <div className="space-y-2 sm:col-span-4"><Label htmlFor={`description-${item.id}`}>Description {index + 1}</Label><Input id={`description-${item.id}`} value={item.description} onChange={(event) => updateItem(item.id, { description: event.target.value })} /></div>
                <div className="space-y-2 sm:col-span-2"><Label htmlFor={`quantity-${item.id}`}>Quantity</Label><Input id={`quantity-${item.id}`} type="number" min="0.01" step="0.01" value={item.quantity} onChange={(event) => updateItem(item.id, { quantity: Number(event.target.value) })} /></div>
                <div className="space-y-2 sm:col-span-2"><Label htmlFor={`rate-${item.id}`}>Rate</Label><Input id={`rate-${item.id}`} type="number" min="0" step="0.01" value={item.rate} onChange={(event) => updateItem(item.id, { rate: Number(event.target.value) })} /></div>
                <div className="space-y-2 sm:col-span-1"><Label htmlFor={`discount-${item.id}`}>Disc %</Label><Input id={`discount-${item.id}`} type="number" min="0" max="100" value={item.discount} onChange={(event) => updateItem(item.id, { discount: Number(event.target.value) })} /></div>
                <div className="space-y-2 sm:col-span-1"><Label htmlFor={`tax-${item.id}`}>Tax %</Label><Input id={`tax-${item.id}`} type="number" min="0" value={item.taxRate} onChange={(event) => updateItem(item.id, { taxRate: Number(event.target.value) })} /></div>
                <div className="flex items-end justify-between gap-2 sm:col-span-2"><div className="pb-2 text-sm font-medium">{money(item.quantity * item.rate * (1 - item.discount / 100) * (1 + item.taxRate / 100), form.currency)}</div><Button variant="ghost" size="icon" disabled={form.items.length === 1} onClick={() => setForm({ ...form, items: form.items.filter((entry) => entry.id !== item.id) })}><Trash2 /><span className="sr-only">Remove line item</span></Button></div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-4">
          <div className="mb-4"><div className="text-sm font-semibold">Dates and adjustments</div><div className="mt-1 text-xs text-muted-foreground">Set payment expectations and any document-level charges.</div></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="issue-date">Issue date</Label><Input id="issue-date" type="date" value={form.issueDate} onChange={(event) => setForm({ ...form, issueDate: event.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="due-date">Due / valid until</Label><Input id="due-date" type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="shipping">Shipping / service charge</Label><Input id="shipping" type="number" min="0" value={form.shipping} onChange={(event) => setForm({ ...form, shipping: Number(event.target.value) })} /></div>
          <div className="space-y-2"><Label htmlFor="adjustment">Adjustment (+ / −)</Label><Input id="adjustment" type="number" value={form.adjustment} onChange={(event) => setForm({ ...form, adjustment: Number(event.target.value) })} /></div>
          {form.type === "credit_note" && (
            <div className="space-y-2 sm:col-span-2">
              <Label>Source invoice</Label>
              <Select value={form.sourceDocument} onValueChange={(sourceDocument) => setForm({ ...form, sourceDocument })}>
                <SelectTrigger><SelectValue placeholder="Select invoice being credited" /></SelectTrigger>
                <SelectContent>{sourceInvoices.map((invoice) => <SelectItem key={invoice.id} value={invoice.number}>{invoice.number} · {invoice.customerName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
        </div>
        </div>

        <div className="rounded-xl border p-4">
          <div className="mb-4"><div className="text-sm font-semibold">Message and terms</div><div className="mt-1 text-xs text-muted-foreground">Add customer-facing context, policies, and payment instructions.</div></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="document-notes">Customer note</Label><Textarea id="document-notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="document-terms">Terms and payment instructions</Label><Textarea id="document-terms" value={form.terms} onChange={(event) => setForm({ ...form, terms: event.target.value })} /></div>
        </div>
        </div>

        {form.type === "invoice" && (
          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between"><div><div className="text-sm font-medium">Recurring invoice</div><div className="text-xs text-muted-foreground">Generate the next draft automatically without charging the customer.</div></div><Switch checked={form.recurring} onCheckedChange={(recurring) => setForm({ ...form, recurring })} /></div>
            {form.recurring && <div className="mt-4 grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Frequency</Label><Select value={form.recurringFrequency} onValueChange={(recurringFrequency: BusinessDocument["recurringFrequency"]) => setForm({ ...form, recurringFrequency })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="quarterly">Quarterly</SelectItem><SelectItem value="yearly">Yearly</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label htmlFor="next-date">Next draft date</Label><Input id="next-date" type="date" value={form.nextRecurringDate} onChange={(event) => setForm({ ...form, nextRecurringDate: event.target.value })} /></div></div>}
          </div>
        )}
          </div>

        <div className="lg:sticky lg:top-36 lg:self-start">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between"><div><div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{labelFor(form.type)}</div><div className="mt-1 font-semibold">{form.number || "Number on save"}</div></div><FileText className="text-brand-text" /></div>
            <Separator className="my-5" />
            <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{money(totals.subtotal, form.currency)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{money(totals.tax, form.currency)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping and adjustment</span><span>{money(form.shipping + form.adjustment, form.currency)}</span></div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{money(totals.total, form.currency)}</span></div>
            </div>
            <div className="mt-5 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              {form.customerName ? `Prepared for ${form.customerName}` : "Add a customer to personalize this document."}
            </div>
            <Button className="mt-4 w-full" onClick={save}>Save document</Button>
            <div className="mt-2 text-center text-xs text-muted-foreground">Saved as a draft until you choose Send.</div>
          </div>
        </div>
        </div>
        </div>

        <DialogFooter className="sticky bottom-0 border-t bg-background/95 px-6 py-4 backdrop-blur">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save}>Save document</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PreviewDialog({ document, open, onOpenChange }: { document: BusinessDocument | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!document) return null;
  const totals = calculate(document);
  const balance = Math.max(0, totals.total - document.paid);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader><DialogTitle>{document.number}</DialogTitle><DialogDescription>{labelFor(document.type)} preview and activity trail</DialogDescription></DialogHeader>
        <div className="rounded-xl border bg-card">
          <div className="flex flex-col gap-4 border-b bg-muted/50 p-6 sm:flex-row sm:items-start sm:justify-between">
            <div><div className="text-xl font-semibold">{document.company || document.customerName}</div><div className="mt-1 text-sm text-muted-foreground">{document.email}</div><div className="text-sm text-muted-foreground">{document.billingAddress || "Billing address not supplied"}</div></div>
            <div className="text-left sm:text-right"><div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{labelFor(document.type)}</div><div className="mt-1 text-lg font-semibold">{document.number}</div><div className="mt-2"><StatusBadge status={document.status} /></div></div>
          </div>
          <div className="grid gap-4 border-b p-6 text-sm sm:grid-cols-3"><div><div className="text-muted-foreground">Issued</div><div className="font-medium">{document.issueDate}</div></div><div><div className="text-muted-foreground">Due / valid until</div><div className="font-medium">{document.dueDate}</div></div><div><div className="text-muted-foreground">Reference</div><div className="font-medium">{document.reference || "—"}</div></div></div>
          <div className="p-6">
            <Table>
              <TableHeader><TableRow><TableHead>Description</TableHead><TableHead>Qty</TableHead><TableHead>Rate</TableHead><TableHead>Tax</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
              <TableBody>{document.items.map((item) => <TableRow key={item.id}><TableCell>{item.description}<div className="text-xs text-muted-foreground">{item.discount > 0 ? `${item.discount}% discount` : ""}</div></TableCell><TableCell>{item.quantity}</TableCell><TableCell>{money(item.rate, document.currency)}</TableCell><TableCell>{item.taxRate}%</TableCell><TableCell className="text-right">{money(item.quantity * item.rate * (1 - item.discount / 100), document.currency)}</TableCell></TableRow>)}</TableBody>
            </Table>
            <div className="ml-auto mt-5 max-w-sm space-y-2 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{money(totals.subtotal, document.currency)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{money(totals.tax, document.currency)}</span></div><div className="flex justify-between text-base font-semibold"><span>Total</span><span>{money(totals.total, document.currency)}</span></div>{document.paid > 0 && <div className="flex justify-between text-sky-700"><span>Paid</span><span>− {money(document.paid, document.currency)}</span></div>}<div className="flex justify-between border-t pt-2 font-semibold"><span>Balance</span><span>{money(balance, document.currency)}</span></div></div>
          </div>
        </div>
        <div><div className="mb-3 flex items-center gap-2 text-sm font-semibold"><History />Activity trail</div><div className="space-y-2">{document.activities.slice().reverse().map((activity) => <div key={activity.id} className="flex items-center justify-between rounded-lg border p-3 text-sm"><span>{activity.label}</span><span className="text-xs text-muted-foreground">{activity.at}</span></div>)}</div></div>
        <DialogFooter><Button variant="outline" onClick={() => window.print()}><Printer />Print</Button><Button onClick={() => downloadDocument(document)}><Download />Download</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PaymentDialog({ document, open, onOpenChange, onRecord }: { document: BusinessDocument | null; open: boolean; onOpenChange: (open: boolean) => void; onRecord: (amount: number) => void }) {
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    if (document) setAmount(Math.max(0, calculate(document).total - document.paid));
  }, [document, open]);
  if (!document) return null;
  const balance = Math.max(0, calculate(document).total - document.paid);
  const invalid = amount <= 0 || amount > balance;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Record payment</DialogTitle><DialogDescription>{document.number} has an outstanding balance of {money(balance, document.currency)}.</DialogDescription></DialogHeader>
        <div className="space-y-2"><Label htmlFor="payment-amount">Amount received</Label><Input id="payment-amount" type="number" min="0.01" max={balance} step="0.01" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />{invalid && <div className="text-sm text-destructive">Enter an amount greater than zero and no more than the outstanding balance.</div>}</div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button disabled={invalid} onClick={() => onRecord(amount)}>Record payment</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function downloadDocument(document: BusinessDocument) {
  const totals = calculate(document);
  const content = [
    `${labelFor(document.type)} ${document.number}`,
    `Customer: ${document.customerName}`,
    `Email: ${document.email}`,
    `Issue: ${document.issueDate}`,
    `Due: ${document.dueDate}`,
    "",
    ...document.items.map((item) => `${item.description} | ${item.quantity} × ${item.rate} | Tax ${item.taxRate}%`),
    "",
    `Total: ${money(totals.total, document.currency)}`,
    `Paid: ${money(document.paid, document.currency)}`,
    `Balance: ${money(Math.max(0, totals.total - document.paid), document.currency)}`,
    "",
    document.terms,
  ].join("\n");
  const anchor = window.document.createElement("a");
  anchor.href = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
  anchor.download = `${document.number || "document"}.txt`;
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}

function DocumentStudio({ role }: { role: StudioRole }) {
  const config = ROLE_CONFIG[role];
  const storageKey = `inspirq-document-studio-${role}-v2`;
  const [documents, setDocuments] = useState<BusinessDocument[]>(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : seedDocuments(role);
    } catch {
      return seedDocuments(role);
    }
  });
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<BusinessDocument | null>(null);
  const [preview, setPreview] = useState<BusinessDocument | null>(null);
  const [payment, setPayment] = useState<BusinessDocument | null>(null);
  const [deleting, setDeleting] = useState<BusinessDocument | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(documents));
    } catch {
      setNotice("Changes work in this session, but browser storage is unavailable.");
    }
  }, [documents, storageKey]);

  const normalized = useMemo(() => documents.map((document) => {
    const total = calculate(document).total;
    if (document.type === "invoice" && !["paid", "void", "draft"].includes(document.status) && document.dueDate < today() && document.paid < total) return { ...document, status: "overdue" as const };
    return document;
  }), [documents]);

  const filtered = useMemo(() => normalized.filter((document) => {
    const matchesType = tab === "all" || (tab === "open" ? !["paid", "void", "rejected"].includes(document.status) : document.type === tab);
    const matchesStatus = statusFilter === "all" || document.status === statusFilter;
    const query = `${document.number} ${document.customerName} ${document.company} ${document.reference}`.toLowerCase();
    return matchesType && matchesStatus && query.includes(search.toLowerCase());
  }), [normalized, tab, statusFilter, search]);

  const receivable = normalized.filter((document) => document.type === "invoice" && document.status !== "void").reduce((sum, document) => sum + Math.max(0, calculate(document).total - document.paid), 0);
  const overdue = normalized.filter((document) => document.status === "overdue").reduce((sum, document) => sum + Math.max(0, calculate(document).total - document.paid), 0);
  const quoteCount = normalized.filter((document) => document.type === "quotation").length;
  const acceptedQuotes = normalized.filter((document) => document.type === "quotation" && document.status === "accepted").length;
  const recurring = normalized.filter((document) => document.recurring && document.status !== "void").length;

  const nextNumber = (type: DocumentType) => {
    const code = type === "quotation" ? "QUO" : type === "proforma" ? "PRO" : type === "credit_note" ? "CRN" : "INV";
    let sequence = documents.filter((document) => document.type === type).length + 1;
    let candidate = `${config.prefix}-${code}-${new Date().getFullYear()}-${String(sequence).padStart(4, "0")}`;
    while (documents.some((document) => document.number === candidate)) {
      sequence += 1;
      candidate = `${config.prefix}-${code}-${new Date().getFullYear()}-${String(sequence).padStart(4, "0")}`;
    }
    return candidate;
  };
  const activity = (label: string): Activity => ({ id: uid(), label, at: timestamp() });
  const patch = (id: string, update: Partial<BusinessDocument>, activityLabel?: string) =>
    setDocuments((current) => current.map((document) => document.id === id ? {
      ...document,
      ...update,
      updatedAt: timestamp(),
      activities: activityLabel ? [...document.activities, activity(activityLabel)] : document.activities,
    } : document));

  const save = (incoming: BusinessDocument) => {
    const existing = documents.find((document) => document.id === incoming.id);
    const revised = existing && existing.status !== "draft";
    const document = {
      ...incoming,
      number: incoming.number.trim() || nextNumber(incoming.type),
      status: revised ? "draft" as const : incoming.status,
      activities: [...incoming.activities, activity(revised ? `Revised from ${labelFor(existing.status)} state` : "Draft saved")],
    };
    setDocuments((current) => existing ? current.map((entry) => entry.id === document.id ? document : entry) : [document, ...current]);
    setEditorOpen(false);
    setNotice(revised ? "A controlled draft revision was created." : "Draft saved.");
  };

  const duplicate = (document: BusinessDocument) => {
    const copy: BusinessDocument = {
      ...structuredClone(document),
      id: uid(),
      number: "",
      status: "draft",
      paid: 0,
      issueDate: today(),
      dueDate: plusDays(7),
      sourceDocument: undefined,
      activities: [activity(`Duplicated from ${document.number}`)],
    };
    setDocuments((current) => [copy, ...current]);
    setNotice("Draft duplicate created.");
  };
  const convertToInvoice = (document: BusinessDocument) => {
    const invoice: BusinessDocument = {
      ...structuredClone(document),
      id: uid(),
      number: nextNumber("invoice"),
      type: "invoice",
      status: "draft",
      paid: 0,
      sourceDocument: document.number,
      issueDate: today(),
      dueDate: plusDays(7),
      activities: [activity(`Converted from ${document.number}`)],
    };
    setDocuments((current) => [invoice, ...current]);
    patch(document.id, { status: "accepted" }, "Accepted and converted to invoice");
    setNotice("Quotation converted to a new draft invoice.");
  };
  const createCredit = (document: BusinessDocument) => {
    const credit: BusinessDocument = {
      ...freshDocument(role, "credit_note"),
      customerName: document.customerName,
      company: document.company,
      email: document.email,
      phone: document.phone,
      billingAddress: document.billingAddress,
      taxId: document.taxId,
      currency: document.currency,
      items: document.items.map((item) => ({ ...item, id: uid() })),
      sourceDocument: document.number,
      number: nextNumber("credit_note"),
      activities: [activity(`Credit initiated for ${document.number}`)],
    };
    setDocuments((current) => [credit, ...current]);
    setNotice("Draft credit note created.");
  };
  const recordPayment = (amount: number) => {
    if (!payment) return;
    const total = calculate(payment).total;
    const nextPaid = Math.min(total, payment.paid + amount);
    patch(payment.id, { paid: nextPaid, status: nextPaid >= total ? "paid" : "partial" }, `Payment recorded: ${money(amount, payment.currency)}`);
    setPayment(null);
    setNotice(nextPaid >= total ? "Invoice marked as paid." : "Partial payment recorded.");
  };
  const startDocument = (type: DocumentType) => {
    setEditing(freshDocument(role, type));
    setEditorOpen(true);
  };
  const attentionDocuments = normalized
    .filter((document) => document.status === "overdue" || document.status === "partial")
    .sort((first, second) => calculate(second).total - second.paid - (calculate(first).total - first.paid))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 py-1 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-3xl font-semibold tracking-tight">Quotes & invoices</div>
          <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => {
            const rows = normalized.map((document) => `${document.number},${document.type},${document.customerName},${calculate(document).total},${document.paid},${document.status}`).join("\n");
            const anchor = window.document.createElement("a");
            anchor.href = URL.createObjectURL(new Blob([`Number,Type,Customer,Total,Paid,Status\n${rows}`], { type: "text/csv" }));
            anchor.download = `${config.prefix}-document-ledger.csv`;
            anchor.click();
            URL.revokeObjectURL(anchor.href);
          }}><Download />Export ledger</Button>
          <Button variant="secondary" onClick={() => startDocument("quotation")}><FileCheck2 />New quotation</Button>
          <Button onClick={() => startDocument("invoice")}><Plus />New invoice</Button>
          </div>
      </div>

      {notice && <Alert><CheckCircle2 /><AlertTitle>Update complete</AlertTitle><AlertDescription className="flex items-center justify-between gap-3"><span>{notice}</span><Button variant="ghost" size="sm" onClick={() => setNotice("")}>Dismiss</Button></AlertDescription></Alert>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Open receivables" value={money(receivable, "INR")} note="Outstanding invoice balances" icon={IndianRupee} />
        <Metric label="Overdue exposure" value={money(overdue, "INR")} note="Requires collection action" icon={CalendarClock} />
        <Metric label="Quote acceptance" value={quoteCount ? `${Math.round(acceptedQuotes / quoteCount * 100)}%` : "—"} note={`${acceptedQuotes} of ${quoteCount} accepted`} icon={FileCheck2} />
        <Metric label="Recurring schedules" value={String(recurring)} note="Future drafts automated" icon={RefreshCw} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <Card className="gap-0">
          <CardContent className="p-5">
            <div className="mb-4">
              <div className="font-semibold">What do you want to create?</div>
              <div className="mt-1 text-sm text-muted-foreground">Start with the right workflow and adjust every detail in the editor.</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto justify-start p-4 text-left" onClick={() => startDocument("invoice")}><div className="rounded-md bg-primary/10 p-2 text-brand-text"><ReceiptText /></div><div><div className="font-medium">Invoice</div><div className="mt-1 text-xs font-normal text-muted-foreground">Bill and collect</div></div></Button>
              <Button variant="outline" className="h-auto justify-start p-4 text-left" onClick={() => startDocument("quotation")}><div className="rounded-md bg-primary/10 p-2 text-brand-text"><FileCheck2 /></div><div><div className="font-medium">Quotation</div><div className="mt-1 text-xs font-normal text-muted-foreground">Propose and convert</div></div></Button>
              <Button variant="outline" className="h-auto justify-start p-4 text-left" onClick={() => startDocument("proforma")}><div className="rounded-md bg-primary/10 p-2 text-brand-text"><FileClock /></div><div><div className="font-medium">Proforma</div><div className="mt-1 text-xs font-normal text-muted-foreground">Confirm before billing</div></div></Button>
              <Button variant="outline" className="h-auto justify-start p-4 text-left" onClick={() => startDocument("credit_note")}><div className="rounded-md bg-primary/10 p-2 text-brand-text"><RefreshCw /></div><div><div className="font-medium">Credit note</div><div className="mt-1 text-xs font-normal text-muted-foreground">Correct an invoice</div></div></Button>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div><div className="font-semibold">Collection focus</div><div className="mt-1 text-sm text-muted-foreground">Highest-priority balances</div></div>
              {attentionDocuments.length > 0 && <Badge variant="destructive">{attentionDocuments.length} due</Badge>}
            </div>
            <div className="mt-4 space-y-2">
              {attentionDocuments.map((document) => (
                <Button key={document.id} variant="ghost" className="h-auto w-full justify-between px-2 py-3 text-left" onClick={() => setPreview(document)}>
                  <div><div className="text-sm font-medium">{document.customerName}</div><div className="mt-1 text-xs font-normal text-muted-foreground">{document.number} · {labelFor(document.status)}</div></div>
                  <div className="text-sm font-semibold">{money(Math.max(0, calculate(document).total - document.paid), document.currency)}</div>
                </Button>
              ))}
              {attentionDocuments.length === 0 && <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">No overdue or partially paid invoices need attention.</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="gap-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="border-b p-4">
            <div className="mb-4"><div className="font-semibold">Document register</div><div className="mt-1 text-sm text-muted-foreground">Search, filter, and act on every commercial document.</div></div>
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="h-auto flex-wrap">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="quotation">Quotes</TabsTrigger>
                <TabsTrigger value="invoice">Invoices</TabsTrigger>
                <TabsTrigger value="credit_note">Credits</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative sm:w-72"><Search className="absolute left-3 top-2.5 text-muted-foreground" /><Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer, number, reference" /></div>
              <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{(["draft", "sent", "viewed", "accepted", "partial", "paid", "overdue", "void"] as DocumentStatus[]).map((status) => <SelectItem key={status} value={status}>{labelFor(status)}</SelectItem>)}</SelectContent></Select>
            </div>
            </div>
          </div>

          <Table>
            <TableHeader><TableRow><TableHead>Document</TableHead><TableHead>Customer</TableHead><TableHead>Timeline</TableHead><TableHead>Total</TableHead><TableHead>Balance</TableHead><TableHead>Status</TableHead><TableHead>Automation</TableHead><TableHead className="w-12" /></TableRow></TableHeader>
            <TableBody>
              {filtered.map((document) => {
                const total = calculate(document).total;
                const balance = Math.max(0, total - document.paid);
                return (
                  <TableRow key={document.id}>
                    <TableCell><div className="font-medium">{document.number || "Unnumbered draft"}</div><div className="text-xs text-muted-foreground">{labelFor(document.type)} · {document.reference || "No reference"}</div></TableCell>
                    <TableCell><div>{document.customerName}</div><div className="text-xs text-muted-foreground">{document.email}</div></TableCell>
                    <TableCell><div className="text-xs">Issued {document.issueDate}</div><div className="text-xs text-muted-foreground">Due {document.dueDate}</div></TableCell>
                    <TableCell className="font-medium">{money(total, document.currency)}</TableCell>
                    <TableCell><div className={balance > 0 && document.status === "overdue" ? "font-medium text-destructive" : "font-medium"}>{money(balance, document.currency)}</div>{document.paid > 0 && <div className="text-xs text-muted-foreground">{money(document.paid, document.currency)} received</div>}</TableCell>
                    <TableCell><StatusBadge status={document.status} /></TableCell>
                    <TableCell>{document.recurring ? <Badge variant="secondary"><RefreshCw />{labelFor(document.recurringFrequency)}</Badge> : <span className="text-xs text-muted-foreground">Manual</span>}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /><span className="sr-only">Document actions</span></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setPreview(document)}><Eye />Preview and activity</DropdownMenuItem>
                          <DropdownMenuItem disabled={document.status === "paid" || document.status === "void"} onClick={() => { setEditing(document); setEditorOpen(true); }}><Edit3 />Edit or revise</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { patch(document.id, { status: "sent" }, `Sent to ${document.email}`); setNotice(`${document.number} sent to ${document.email}.`); }} disabled={document.status === "void"}><Send />Send or resend</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => downloadDocument(document)}><Download />Download</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {document.type === "quotation" && !["void", "rejected"].includes(document.status) && <DropdownMenuItem onClick={() => convertToInvoice(document)}><ArrowRight />Accept and convert</DropdownMenuItem>}
                          {document.type === "invoice" && balance > 0 && document.status !== "void" && <DropdownMenuItem onClick={() => setPayment(document)}><ReceiptText />Record payment</DropdownMenuItem>}
                          {document.type === "invoice" && document.status !== "void" && <DropdownMenuItem onClick={() => createCredit(document)}><FileClock />Create credit note</DropdownMenuItem>}
                          <DropdownMenuItem onClick={() => duplicate(document)}><Copy />Duplicate as draft</DropdownMenuItem>
                          {document.status !== "draft" && document.status !== "void" && <DropdownMenuItem onClick={() => { patch(document.id, { status: "void" }, "Document voided"); setNotice("Document voided without deleting its audit record."); }}><XCircle />Void document</DropdownMenuItem>}
                          {(document.status === "draft" || document.status === "void") && <><DropdownMenuSeparator /><DropdownMenuItem variant="destructive" onClick={() => setDeleting(document)}><Trash2 />Delete</DropdownMenuItem></>}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filtered.length === 0 && <div className="p-12 text-center"><FileText className="mx-auto text-muted-foreground" /><div className="mt-3 font-medium">No documents found</div><div className="mt-1 text-sm text-muted-foreground">Adjust the filters or create a new document.</div></div>}
        </CardContent>
      </Card>

      <EditorDialog open={editorOpen} onOpenChange={setEditorOpen} value={editing} role={role} sourceInvoices={normalized.filter((document) => document.type === "invoice" && document.status !== "void")} existingDocuments={normalized} onSave={save} />
      <PreviewDialog document={preview} open={Boolean(preview)} onOpenChange={(open) => !open && setPreview(null)} />
      <PaymentDialog document={payment} open={Boolean(payment)} onOpenChange={(open) => !open && setPayment(null)} onRecord={recordPayment} />
      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this document permanently?</AlertDialogTitle><AlertDialogDescription>Only drafts and void documents can be deleted. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { if (deleting) setDocuments((current) => current.filter((document) => document.id !== deleting.id)); setDeleting(null); setNotice("Document deleted."); }}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function VenueInvoice() {
  return <DocumentStudio role="venue" />;
}

export function TrainerInvoice() {
  return <DocumentStudio role="coach" />;
}

export function OrganizerInvoice() {
  return <DocumentStudio role="organizer" />;
}
