import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Activity,
  AlertTriangle,
  Archive,
  BarChart3,
  Barcode,
  CheckCircle2,
  Copy,
  Download,
  Edit3,
  Eye,
  FileUp,
  FolderKanban,
  Globe2,
  History,
  KeyRound,
  MapPin,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  Plus,
  QrCode,
  ScanLine,
  Search,
  ShieldCheck,
  Trash2,
  Users,
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
import { Checkbox } from "../components/ui/checkbox";
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
import { Progress } from "../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Switch } from "../components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/SmartTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";

type CodeRole = "venue" | "coach" | "organizer" | "admin";
type CodeFormat = "dynamic_qr" | "static_qr" | "code128" | "ean13" | "upca" | "datamatrix" | "pdf417";
type CodeStatus = "active" | "paused" | "expired" | "revoked";

type CodeActivity = { id: string; action: string; at: string; actor: string };
type CodeAsset = {
  id: string;
  name: string;
  format: CodeFormat;
  purpose: string;
  destination: string;
  folder: string;
  owner: string;
  organization: string;
  tags: string[];
  status: CodeStatus;
  scans: number;
  uniqueScans: number;
  lastScan: string;
  expiresAt: string;
  scanLimit: number;
  passwordProtected: boolean;
  oneTime: boolean;
  antiPassback: boolean;
  collectLocation: boolean;
  fallback: string;
  activity: CodeActivity[];
};

const ROLE_CONFIG: Record<CodeRole, { label: string; description: string; purposes: string[]; folders: string[] }> = {
  venue: {
    label: "Arena Owner",
    description: "Check-in, memberships, equipment, inventory, payments, and guest journeys",
    purposes: ["Guest check-in", "Membership pass", "Equipment asset", "Product SKU", "Payment", "Feedback"],
    folders: ["Front desk", "Memberships", "Equipment", "Retail"],
  },
  coach: {
    label: "Coach",
    description: "Attendance, student access, programs, equipment, resources, and payments",
    purposes: ["Session attendance", "Student pass", "Program resource", "Equipment asset", "Product SKU", "Payment"],
    folders: ["Students", "Sessions", "Programs", "Equipment"],
  },
  organizer: {
    label: "Tournament Organiser",
    description: "Tickets, accreditation, check-in, merchandise, live results, and sponsor activation",
    purposes: ["Participant check-in", "Accreditation", "Event ticket", "Merchandise SKU", "Live results", "Sponsor activation"],
    folders: ["Events", "Tickets", "Accreditation", "Sponsors"],
  },
  admin: {
    label: "Super Admin",
    description: "Platform-wide code governance, abuse response, ownership, policy, and audit",
    purposes: ["Platform redirect", "Partner campaign", "Identity credential", "Asset label", "Support recovery", "Compliance"],
    folders: ["Platform", "Partners", "Investigations", "Archived"],
  },
};

const STATUS_STYLE: Record<CodeStatus, string> = {
  active: "border-sky-200 bg-sky-50 text-sky-700",
  paused: "border-amber-200 bg-amber-50 text-amber-700",
  expired: "border-border bg-muted text-muted-foreground",
  revoked: "border-red-200 bg-red-50 text-red-700",
};

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
const today = () => new Date().toISOString().slice(0, 10);
const future = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};
const title = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function blankAsset(role: CodeRole, format: CodeFormat = "dynamic_qr"): CodeAsset {
  const config = ROLE_CONFIG[role];
  return {
    id: uid(),
    name: "",
    format,
    purpose: config.purposes[0],
    destination: "",
    folder: config.folders[0],
    owner: role === "admin" ? "Platform Operations" : config.label,
    organization: role === "venue" ? "Court Masters" : role === "coach" ? "Coach Rajesh" : role === "organizer" ? "SportsFest" : "InspirQ",
    tags: [],
    status: "active",
    scans: 0,
    uniqueScans: 0,
    lastScan: "Never",
    expiresAt: "",
    scanLimit: 0,
    passwordProtected: false,
    oneTime: false,
    antiPassback: false,
    collectLocation: true,
    fallback: "",
    activity: [{ id: uid(), action: "Code draft created", at: now(), actor: "Current user" }],
  };
}

function seedAssets(role: CodeRole): CodeAsset[] {
  const config = ROLE_CONFIG[role];
  const make = (index: number, format: CodeFormat, status: CodeStatus, scans: number, purpose: string): CodeAsset => ({
    ...blankAsset(role, format),
    id: `seed-${role}-${index}`,
    name: role === "venue"
      ? ["Main desk check-in", "Premium member pass", "Yonex racquet 04", "Retail shuttle pack"][index]
      : role === "coach"
        ? ["Morning attendance", "Elite student pass", "Footwork video plan", "Racquet kit 07"][index]
        : role === "organizer"
          ? ["Badminton Open entry", "Officials accreditation", "Live bracket link", "Event tee SKU"][index]
          : ["Platform help redirect", "Court Masters tenant pass", "Partner campaign 22", "Revoked credential"][index],
    purpose,
    destination: format.includes("qr") || format === "datamatrix" ? `https://inspirq.app/c/${role}/${index + 1}` : `89010${role.length}${String(index + 1).padStart(7, "0")}`,
    folder: config.folders[index % config.folders.length],
    status,
    scans,
    uniqueScans: Math.round(scans * 0.74),
    lastScan: scans ? ["12 min ago", "Today, 08:14", "Yesterday", "16 Jul"][index] : "Never",
    expiresAt: index === 0 ? future(30) : "",
    scanLimit: index === 0 ? 500 : 0,
    passwordProtected: index === 1,
    antiPassback: purpose.includes("check-in") || purpose.includes("ticket"),
    tags: [config.folders[index % config.folders.length].toLowerCase(), status],
    activity: [
      { id: uid(), action: "Code created", at: "15 Jul 2026, 10:30 am", actor: "Operations" },
      ...(scans ? [{ id: uid(), action: `${scans} scans recorded`, at: "17 Jul 2026, 9:15 am", actor: "System" }] : []),
    ],
  });
  return [
    make(0, "dynamic_qr", "active", 342, config.purposes[0]),
    make(1, "dynamic_qr", "active", 184, config.purposes[1]),
    make(2, "static_qr", "paused", 76, config.purposes[2]),
    make(3, "code128", role === "admin" ? "revoked" : "active", 48, config.purposes[3]),
  ];
}

function validateAsset(asset: CodeAsset, assets: CodeAsset[]) {
  const errors: string[] = [];
  if (!asset.name.trim()) errors.push("Enter a recognizable code name.");
  if (!asset.destination.trim()) errors.push("Enter a destination URL or encoded value.");
  if (asset.format.includes("qr") && !/^(https?:\/\/|mailto:|tel:|wifi:)/i.test(asset.destination)) errors.push("QR destination must start with https://, http://, mailto:, tel:, or wifi:.");
  if (asset.format === "ean13" && !/^\d{13}$/.test(asset.destination)) errors.push("EAN-13 requires exactly 13 digits.");
  if (asset.format === "upca" && !/^\d{12}$/.test(asset.destination)) errors.push("UPC-A requires exactly 12 digits.");
  if (asset.format === "code128" && asset.destination.length > 80) errors.push("Code 128 values are limited to 80 characters in this workspace.");
  if (asset.expiresAt && asset.expiresAt < today()) errors.push("Expiry must be today or later.");
  if (asset.scanLimit < 0) errors.push("Scan limit cannot be negative.");
  if (asset.scanLimit > 0 && asset.scanLimit < asset.scans) errors.push("Scan limit cannot be lower than scans already recorded.");
  if (assets.some((entry) => entry.id !== asset.id && entry.destination.toLowerCase() === asset.destination.toLowerCase())) errors.push("This destination or encoded value is already registered.");
  if (asset.oneTime && asset.scanLimit > 1) errors.push("One-time codes cannot have a scan limit greater than one.");
  return errors;
}

function CodeEditor({ open, onOpenChange, value, role, assets, onSave }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: CodeAsset | null;
  role: CodeRole;
  assets: CodeAsset[];
  onSave: (asset: CodeAsset) => void;
}) {
  const config = ROLE_CONFIG[role];
  const [form, setForm] = useState(() => value ?? blankAsset(role));
  const [errors, setErrors] = useState<string[]>([]);
  useEffect(() => {
    setForm(value ? structuredClone(value) : blankAsset(role));
    setErrors([]);
  }, [value, open, role]);
  const save = () => {
    const nextErrors = validateAsset(form, assets);
    if (nextErrors.length) return setErrors(nextErrors);
    onSave({ ...form, tags: form.tags.filter(Boolean), activity: [...form.activity, { id: uid(), action: value ? "Configuration updated" : "Code created", at: now(), actor: "Current user" }] });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[94vh] overflow-y-auto p-0 sm:max-w-5xl">
        <div className="sticky top-0 z-10 border-b bg-background/95 px-6 py-5 backdrop-blur">
          <DialogHeader><DialogTitle>{value ? `Edit ${value.name}` : "Create a code asset"}</DialogTitle><DialogDescription>Configure identity, behavior, security, and lifecycle before publishing.</DialogDescription></DialogHeader>
        </div>
        <div className="grid gap-6 px-6 pb-2 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-5">
            {errors.length > 0 && <Alert variant="destructive"><AlertTriangle /><AlertTitle>Resolve these issues</AlertTitle><AlertDescription><div className="space-y-1">{errors.map((error) => <div key={error}>{error}</div>)}</div></AlertDescription></Alert>}
            <Card className="gap-0"><CardContent className="space-y-4 p-5">
              <div><div className="font-semibold">Code identity</div><div className="mt-1 text-sm text-muted-foreground">Name, format, purpose, and ownership make codes searchable and auditable.</div></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="code-name">Code name</Label><Input id="code-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Main gate check-in" /></div>
                <div className="space-y-2"><Label>Format</Label><Select value={form.format} onValueChange={(format: CodeFormat) => setForm({ ...form, format })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="dynamic_qr">Dynamic QR</SelectItem><SelectItem value="static_qr">Static QR</SelectItem><SelectItem value="code128">Code 128</SelectItem><SelectItem value="ean13">EAN-13</SelectItem><SelectItem value="upca">UPC-A</SelectItem><SelectItem value="datamatrix">Data Matrix</SelectItem><SelectItem value="pdf417">PDF417</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Purpose</Label><Select value={form.purpose} onValueChange={(purpose) => setForm({ ...form, purpose })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{config.purposes.map((purpose) => <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Folder</Label><Select value={form.folder} onValueChange={(folder) => setForm({ ...form, folder })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{config.folders.map((folder) => <SelectItem key={folder} value={folder}>{folder}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label htmlFor="code-owner">Owner</Label><Input id="code-owner" value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="code-tags">Tags</Label><Input id="code-tags" value={form.tags.join(", ")} onChange={(event) => setForm({ ...form, tags: event.target.value.split(",").map((tag) => tag.trim()) })} placeholder="front-desk, vip, 2026" /></div>
              </div>
            </CardContent></Card>
            <Card className="gap-0"><CardContent className="space-y-4 p-5">
              <div><div className="font-semibold">Destination and continuity</div><div className="mt-1 text-sm text-muted-foreground">Dynamic QR destinations remain editable after printing; static and barcode values do not.</div></div>
              <div className="space-y-2"><Label htmlFor="code-destination">Destination or encoded value</Label><Input id="code-destination" value={form.destination} onChange={(event) => setForm({ ...form, destination: event.target.value })} placeholder={form.format.includes("qr") ? "https://inspirq.app/..." : "Encoded value"} /></div>
              <div className="space-y-2"><Label htmlFor="code-fallback">Fallback destination</Label><Input id="code-fallback" value={form.fallback} onChange={(event) => setForm({ ...form, fallback: event.target.value })} placeholder="Used when paused, expired, or unavailable" /></div>
            </CardContent></Card>
            <Card className="gap-0"><CardContent className="space-y-4 p-5">
              <div><div className="font-semibold">Security and lifecycle</div><div className="mt-1 text-sm text-muted-foreground">Reduce replay, unauthorized access, and forgotten live codes.</div></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="code-expiry">Expiry date</Label><Input id="code-expiry" type="date" value={form.expiresAt} onChange={(event) => setForm({ ...form, expiresAt: event.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="code-limit">Scan limit · 0 is unlimited</Label><Input id="code-limit" type="number" min="0" value={form.scanLimit} onChange={(event) => setForm({ ...form, scanLimit: Number(event.target.value) })} /></div>
              </div>
              {[
                { key: "passwordProtected", label: "Password protected", note: "Require a secret before redirecting.", icon: KeyRound },
                { key: "oneTime", label: "One-time credential", note: "Revoke after the first successful scan.", icon: ShieldCheck },
                { key: "antiPassback", label: "Anti-passback", note: "Prevent immediate ticket or credential reuse.", icon: Users },
                { key: "collectLocation", label: "Location analytics", note: "Record approximate scan geography with consent.", icon: MapPin },
              ].map(({ key, label, note, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between rounded-lg border p-3"><div className="flex items-start gap-3"><Icon className="mt-0.5 text-muted-foreground" /><div><div className="text-sm font-medium">{label}</div><div className="text-xs text-muted-foreground">{note}</div></div></div><Switch checked={form[key as keyof CodeAsset] as boolean} onCheckedChange={(checked) => setForm({ ...form, [key]: checked })} /></div>
              ))}
            </CardContent></Card>
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Card className="gap-0"><CardContent className="p-5">
              <div className="flex items-center justify-between"><div><div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Live preview</div><div className="mt-1 font-semibold">{form.name || "Untitled code"}</div></div>{form.format.includes("qr") || form.format === "datamatrix" ? <QrCode className="text-brand-text" /> : <Barcode className="text-brand-text" />}</div>
              <div className="my-5 flex min-h-56 items-center justify-center rounded-xl border bg-background p-4">
                {form.destination && (form.format.includes("qr") || form.format === "datamatrix")
                  ? <QRCodeSVG value={form.destination} size={190} level="H" includeMargin />
                  : <div className="text-center"><Barcode className="mx-auto size-20" /><div className="mt-3 break-all text-xs text-muted-foreground">{form.destination || "Encoded value preview"}</div></div>}
              </div>
              <div className="space-y-2 text-xs text-muted-foreground"><div className="flex justify-between"><span>Format</span><span className="font-medium text-foreground">{title(form.format)}</span></div><div className="flex justify-between"><span>Status</span><span className="font-medium text-foreground">{title(form.status)}</span></div><div className="flex justify-between"><span>Error recovery</span><span className="font-medium text-foreground">{form.fallback ? "Configured" : "Not set"}</span></div></div>
              <Button className="mt-5 w-full" onClick={save}>Save code asset</Button>
            </CardContent></Card>
          </div>
        </div>
        <DialogFooter className="sticky bottom-0 border-t bg-background/95 px-6 py-4 backdrop-blur"><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={save}>Save code asset</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PreviewDialog({ asset, open, onOpenChange, onScan }: { asset: CodeAsset | null; open: boolean; onOpenChange: (open: boolean) => void; onScan: () => void }) {
  if (!asset) return null;
  const isQr = asset.format.includes("qr") || asset.format === "datamatrix";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>{asset.name}</DialogTitle><DialogDescription>{asset.purpose} · {title(asset.format)}</DialogDescription></DialogHeader>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex min-h-72 items-center justify-center rounded-xl border bg-background p-6">{isQr ? <QRCodeSVG value={asset.destination} size={230} level="H" includeMargin /> : <div className="text-center"><Barcode className="mx-auto size-28" /><div className="mt-4 break-all font-mono text-sm">{asset.destination}</div></div>}</div>
          <div className="space-y-4">
            <div className="rounded-xl bg-muted p-4"><div className="text-xs text-muted-foreground">Destination</div><div className="mt-1 break-all text-sm font-medium">{asset.destination}</div></div>
            <div className="grid grid-cols-2 gap-3"><div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Total scans</div><div className="mt-1 text-xl font-semibold">{asset.scans}</div></div><div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Unique</div><div className="mt-1 text-xl font-semibold">{asset.uniqueScans}</div></div></div>
            <div><div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">Scan capacity</span><span>{asset.scanLimit ? `${asset.scans}/${asset.scanLimit}` : "Unlimited"}</span></div><Progress value={asset.scanLimit ? Math.min(100, asset.scans / asset.scanLimit * 100) : 0} /></div>
            <div className="flex flex-wrap gap-2"><StatusBadge status={asset.status} />{asset.passwordProtected && <Badge variant="secondary"><KeyRound />Protected</Badge>}{asset.antiPassback && <Badge variant="secondary"><ShieldCheck />Anti-passback</Badge>}</div>
          </div>
        </div>
        <DialogFooter><Button variant="outline"><Download />Download SVG</Button><Button onClick={onScan}><ScanLine />Test scan</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatusBadge({ status }: { status: CodeStatus }) {
  return <Badge variant="outline" className={STATUS_STYLE[status]}>{title(status)}</Badge>;
}

function Metric({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: typeof QrCode }) {
  return <Card className="gap-0"><CardContent className="flex items-start justify-between p-5"><div><div className="text-sm text-muted-foreground">{label}</div><div className="mt-2 text-2xl font-semibold">{value}</div><div className="mt-1 text-xs text-muted-foreground">{note}</div></div><div className="rounded-lg bg-primary/10 p-2 text-brand-text"><Icon /></div></CardContent></Card>;
}

function CodeManagement({ role }: { role: CodeRole }) {
  const config = ROLE_CONFIG[role];
  const storageKey = `inspirq-code-manager-${role}-v1`;
  const [assets, setAssets] = useState<CodeAsset[]>(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : seedAssets(role);
    } catch {
      return seedAssets(role);
    }
  });
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<CodeAsset | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [preview, setPreview] = useState<CodeAsset | null>(null);
  const [deleting, setDeleting] = useState<CodeAsset | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(assets));
    } catch {
      setNotice("Browser storage is unavailable; changes will last for this session only.");
    }
  }, [assets, storageKey]);

  const normalized = useMemo(() => assets.map((asset) => asset.expiresAt && asset.expiresAt < today() && !["revoked", "expired"].includes(asset.status) ? { ...asset, status: "expired" as const } : asset), [assets]);
  const filtered = useMemo(() => normalized.filter((asset) => {
    const query = `${asset.name} ${asset.purpose} ${asset.destination} ${asset.folder} ${asset.tags.join(" ")}`.toLowerCase();
    return query.includes(search.toLowerCase()) && (format === "all" || asset.format === format) && (status === "all" || asset.status === status);
  }), [normalized, search, format, status]);
  const scans = normalized.reduce((sum, asset) => sum + asset.scans, 0);
  const risks = normalized.filter((asset) => asset.status === "revoked" || asset.status === "expired" || (asset.scanLimit > 0 && asset.scans / asset.scanLimit >= 0.9)).length;

  const save = (asset: CodeAsset) => {
    setAssets((current) => current.some((entry) => entry.id === asset.id) ? current.map((entry) => entry.id === asset.id ? asset : entry) : [asset, ...current]);
    setEditorOpen(false);
    setNotice(asset.id ? "Code asset saved." : "Code asset created.");
  };
  const patch = (id: string, update: Partial<CodeAsset>, action: string) => setAssets((current) => current.map((asset) => asset.id === id ? { ...asset, ...update, activity: [...asset.activity, { id: uid(), action, at: now(), actor: "Current user" }] } : asset));
  const simulateScan = () => {
    if (!preview) return;
    const current = normalized.find((asset) => asset.id === preview.id);
    if (!current) return;
    if (current.status !== "active") return setNotice(`Scan blocked: code is ${current.status}.`);
    if (current.expiresAt && current.expiresAt < today()) return setNotice("Scan blocked: code has expired.");
    if (current.scanLimit > 0 && current.scans >= current.scanLimit) return setNotice("Scan blocked: scan limit reached.");
    const nextStatus: CodeStatus = current.oneTime ? "revoked" : "active";
    patch(current.id, { scans: current.scans + 1, uniqueScans: current.uniqueScans + 1, lastScan: "Just now", status: nextStatus }, current.oneTime ? "One-time scan completed and revoked" : "Test scan completed");
    setPreview({ ...current, scans: current.scans + 1, uniqueScans: current.uniqueScans + 1, lastScan: "Just now", status: nextStatus });
    setNotice(current.oneTime ? "Scan succeeded. One-time code was automatically revoked." : "Test scan succeeded.");
  };
  const bulkImport = () => {
    const rows = bulkText.split("\n").map((row) => row.trim()).filter(Boolean);
    const imported: CodeAsset[] = [];
    const errors: string[] = [];
    rows.forEach((row, index) => {
      const [name, destination, purpose = config.purposes[0], formatValue = "dynamic_qr"] = row.split(",").map((value) => value.trim());
      const asset = { ...blankAsset(role, formatValue as CodeFormat), name, destination, purpose };
      const rowErrors = validateAsset(asset, [...assets, ...imported]);
      if (rowErrors.length) errors.push(`Row ${index + 1}: ${rowErrors[0]}`);
      else imported.push(asset);
    });
    if (errors.length) return setNotice(`${errors.length} row(s) were rejected. Fix duplicate, missing, or invalid values.`);
    setAssets((current) => [...imported, ...current]);
    setBulkOpen(false);
    setBulkText("");
    setNotice(`${imported.length} code assets imported.`);
  };

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 py-1 lg:flex-row lg:items-center lg:justify-between"><div className="text-3xl font-semibold">QR & barcode management</div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setBulkOpen(true)}><FileUp />Bulk import</Button><Button onClick={() => { setEditing(null); setEditorOpen(true); }}><Plus />Create code</Button></div></div>

      {notice && <Alert><CheckCircle2 /><AlertTitle>Code manager update</AlertTitle><AlertDescription className="flex items-center justify-between gap-3"><span>{notice}</span><Button variant="ghost" size="sm" onClick={() => setNotice("")}>Dismiss</Button></AlertDescription></Alert>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Managed codes" value={String(normalized.length)} note={`${normalized.filter((asset) => asset.status === "active").length} currently active`} icon={QrCode} />
        <Metric label="Total scans" value={scans.toLocaleString()} note={`${normalized.reduce((sum, asset) => sum + asset.uniqueScans, 0).toLocaleString()} unique visitors`} icon={ScanLine} />
        <Metric label="Governance risks" value={String(risks)} note="Expired, revoked, or near limit" icon={ShieldCheck} />
        <Metric label="Folders" value={String(new Set(normalized.map((asset) => asset.folder)).size)} note="Organized operational groups" icon={FolderKanban} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <Card className="gap-0"><CardContent className="p-5"><div className="mb-4"><div className="font-semibold">Start from an operational pattern</div><div className="mt-1 text-sm text-muted-foreground">Purpose-aware defaults reduce setup mistakes.</div></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{config.purposes.slice(0, 4).map((purpose, index) => <Button key={purpose} variant="outline" className="h-auto justify-start p-4 text-left" onClick={() => { const asset = blankAsset(role, index === 3 ? "code128" : "dynamic_qr"); setEditing({ ...asset, purpose, name: purpose }); setEditorOpen(true); }}><div className="rounded-md bg-primary/10 p-2 text-brand-text">{index === 3 ? <Barcode /> : <QrCode />}</div><div><div className="font-medium">{purpose}</div><div className="mt-1 text-xs font-normal text-muted-foreground">{index === 3 ? "Inventory identity" : "Trackable dynamic QR"}</div></div></Button>)}</div></CardContent></Card>
        <Card className="gap-0"><CardContent className="p-5"><div className="flex items-start justify-between"><div><div className="font-semibold">Control health</div><div className="mt-1 text-sm text-muted-foreground">Registry safeguards</div></div><Badge variant={risks ? "destructive" : "secondary"}>{risks ? `${risks} review` : "Healthy"}</Badge></div><div className="mt-5 space-y-4">{[{ label: "Owned records", value: 100 }, { label: "Fallback coverage", value: Math.round(normalized.filter((asset) => asset.fallback).length / Math.max(1, normalized.length) * 100) }, { label: "Expiry coverage", value: Math.round(normalized.filter((asset) => asset.expiresAt).length / Math.max(1, normalized.length) * 100) }].map((item) => <div key={item.label}><div className="mb-2 flex justify-between text-xs"><span>{item.label}</span><span>{item.value}%</span></div><Progress value={item.value} /></div>)}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="registry">
        <TabsList><TabsTrigger value="registry">Registry</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger><TabsTrigger value="audit">Audit log</TabsTrigger></TabsList>
        <TabsContent value="registry" className="mt-4">
          <Card className="gap-0 overflow-hidden"><CardContent className="p-0">
            <div className="border-b p-4">
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div><div className="font-semibold">Code registry</div><div className="mt-1 text-sm text-muted-foreground">Search, govern, and operate all QR and barcode assets.</div></div>{selected.size > 0 && <div className="flex items-center gap-2"><Badge variant="secondary">{selected.size} selected</Badge><Button size="sm" variant="outline" onClick={() => { setAssets((current) => current.map((asset) => selected.has(asset.id) ? { ...asset, status: "paused" } : asset)); setSelected(new Set()); setNotice("Selected codes paused."); }}><PauseCircle />Pause</Button><Button size="sm" variant="outline" onClick={() => { setAssets((current) => current.map((asset) => selected.has(asset.id) ? { ...asset, status: "active" } : asset)); setSelected(new Set()); setNotice("Selected codes activated."); }}><PlayCircle />Activate</Button></div>}</div>
              <div className="flex flex-col gap-2 lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 text-muted-foreground" /><Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, destination, purpose, folder, or tag" /></div><Select value={format} onValueChange={setFormat}><SelectTrigger className="lg:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All formats</SelectItem>{(["dynamic_qr", "static_qr", "code128", "ean13", "upca", "datamatrix", "pdf417"] as CodeFormat[]).map((entry) => <SelectItem key={entry} value={entry}>{title(entry)}</SelectItem>)}</SelectContent></Select><Select value={status} onValueChange={setStatus}><SelectTrigger className="lg:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{(["active", "paused", "expired", "revoked"] as CodeStatus[]).map((entry) => <SelectItem key={entry} value={entry}>{title(entry)}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <Table><TableHeader><TableRow><TableHead className="w-10"><Checkbox checked={filtered.length > 0 && filtered.every((asset) => selected.has(asset.id))} onCheckedChange={(checked) => setSelected(checked ? new Set(filtered.map((asset) => asset.id)) : new Set())} /></TableHead><TableHead>Code asset</TableHead><TableHead>Purpose</TableHead>{role === "admin" && <TableHead>Organization</TableHead>}<TableHead>Activity</TableHead><TableHead>Controls</TableHead><TableHead>Status</TableHead><TableHead className="w-12" /></TableRow></TableHeader><TableBody>
              {filtered.map((asset) => <TableRow key={asset.id}>
                <TableCell><Checkbox checked={selected.has(asset.id)} onCheckedChange={(checked) => setSelected((current) => { const next = new Set(current); checked ? next.add(asset.id) : next.delete(asset.id); return next; })} /></TableCell>
                <TableCell><div className="flex items-center gap-3"><div className="rounded-md bg-muted p-2">{asset.format.includes("qr") || asset.format === "datamatrix" ? <QrCode /> : <Barcode />}</div><div><div className="font-medium">{asset.name}</div><div className="text-xs text-muted-foreground">{title(asset.format)} · {asset.folder}</div></div></div></TableCell>
                <TableCell><div>{asset.purpose}</div><div className="max-w-56 truncate text-xs text-muted-foreground">{asset.destination}</div></TableCell>
                {role === "admin" && <TableCell><div>{asset.organization}</div><div className="text-xs text-muted-foreground">{asset.owner}</div></TableCell>}
                <TableCell><div className="font-medium">{asset.scans.toLocaleString()} scans</div><div className="text-xs text-muted-foreground">{asset.lastScan}</div></TableCell>
                <TableCell><div className="flex gap-1">{asset.passwordProtected && <KeyRound className="text-muted-foreground" />}{asset.antiPassback && <ShieldCheck className="text-muted-foreground" />}{asset.collectLocation && <MapPin className="text-muted-foreground" />}</div></TableCell>
                <TableCell><StatusBadge status={asset.status} /></TableCell>
                <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal /><span className="sr-only">Code actions</span></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => setPreview(asset)}><Eye />Preview and test</DropdownMenuItem><DropdownMenuItem onClick={() => { setEditing(asset); setEditorOpen(true); }}><Edit3 />Edit configuration</DropdownMenuItem><DropdownMenuItem onClick={() => { setAssets((current) => [{ ...structuredClone(asset), id: uid(), name: `${asset.name} copy`, scans: 0, uniqueScans: 0, lastScan: "Never", status: "paused", activity: [{ id: uid(), action: `Duplicated from ${asset.name}`, at: now(), actor: "Current user" }] }, ...current]); setNotice("Paused duplicate created."); }}><Copy />Duplicate</DropdownMenuItem><DropdownMenuItem onClick={() => patch(asset.id, { status: asset.status === "active" ? "paused" : "active" }, asset.status === "active" ? "Code paused" : "Code activated")}>{asset.status === "active" ? <PauseCircle /> : <PlayCircle />}{asset.status === "active" ? "Pause" : "Activate"}</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={() => patch(asset.id, { status: "revoked" }, "Code permanently revoked")}><XCircle />Revoke</DropdownMenuItem><DropdownMenuItem variant="destructive" disabled={asset.status === "active"} onClick={() => setDeleting(asset)}><Trash2 />Delete non-active code</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell>
              </TableRow>)}
            </TableBody></Table>
            {filtered.length === 0 && <div className="p-12 text-center"><QrCode className="mx-auto text-muted-foreground" /><div className="mt-3 font-medium">No code assets found</div><div className="mt-1 text-sm text-muted-foreground">Adjust the filters or create a new governed code.</div></div>}
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="analytics" className="mt-4"><div className="grid gap-4 lg:grid-cols-3"><Card className="gap-0 lg:col-span-2"><CardContent className="p-5"><div className="font-semibold">Scan performance</div><div className="mt-5 space-y-4">{normalized.slice().sort((a, b) => b.scans - a.scans).map((asset) => <div key={asset.id}><div className="mb-2 flex justify-between text-sm"><span>{asset.name}</span><span>{asset.scans} scans</span></div><Progress value={scans ? asset.scans / scans * 100 : 0} /></div>)}</div></CardContent></Card><Card className="gap-0"><CardContent className="p-5"><div className="font-semibold">Audience signals</div><div className="mt-5 space-y-4">{[{ label: "Mobile", value: "82%", icon: ScanLine }, { label: "Top location", value: "Bangalore", icon: MapPin }, { label: "Unique rate", value: `${scans ? Math.round(normalized.reduce((sum, asset) => sum + asset.uniqueScans, 0) / scans * 100) : 0}%`, icon: Users }, { label: "Active destinations", value: String(normalized.filter((asset) => asset.status === "active").length), icon: Globe2 }].map(({ label, value, icon: Icon }) => <div key={label} className="flex items-center justify-between rounded-lg border p-3"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Icon />{label}</div><div className="font-medium">{value}</div></div>)}</div></CardContent></Card></div></TabsContent>
        <TabsContent value="audit" className="mt-4"><Card className="gap-0"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Action</TableHead><TableHead>Code asset</TableHead><TableHead>Actor</TableHead><TableHead>Time</TableHead></TableRow></TableHeader><TableBody>{normalized.flatMap((asset) => asset.activity.map((entry) => ({ ...entry, asset: asset.name }))).sort((a, b) => b.at.localeCompare(a.at)).map((entry) => <TableRow key={`${entry.id}-${entry.asset}`}><TableCell className="font-medium">{entry.action}</TableCell><TableCell>{entry.asset}</TableCell><TableCell>{entry.actor}</TableCell><TableCell className="text-muted-foreground">{entry.at}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card></TabsContent>
      </Tabs>

      <CodeEditor open={editorOpen} onOpenChange={setEditorOpen} value={editing} role={role} assets={normalized} onSave={save} />
      <PreviewDialog asset={preview} open={Boolean(preview)} onOpenChange={(open) => !open && setPreview(null)} onScan={simulateScan} />
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}><DialogContent><DialogHeader><DialogTitle>Bulk import code assets</DialogTitle><DialogDescription>Paste one record per line: name, destination, purpose, format. The entire import is rejected if any row is invalid.</DialogDescription></DialogHeader><div className="space-y-2"><Label htmlFor="bulk-codes">CSV rows</Label><Textarea id="bulk-codes" className="min-h-48 font-mono" value={bulkText} onChange={(event) => setBulkText(event.target.value)} placeholder={`Main gate, https://inspirq.app/checkin, ${config.purposes[0]}, dynamic_qr`} /></div><DialogFooter><Button variant="outline" onClick={() => setBulkOpen(false)}>Cancel</Button><Button disabled={!bulkText.trim()} onClick={bulkImport}><FileUp />Validate and import</Button></DialogFooter></DialogContent></Dialog>
      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete this code permanently?</AlertDialogTitle><AlertDialogDescription>Active codes cannot be deleted. Deletion removes analytics and audit history; revoke instead when traceability is required.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { if (deleting) setAssets((current) => current.filter((asset) => asset.id !== deleting.id)); setDeleting(null); setNotice("Code asset deleted."); }}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}

export function VenueCodeManagement() { return <CodeManagement role="venue" />; }
export function CoachCodeManagement() { return <CodeManagement role="coach" />; }
export function OrganizerCodeManagement() { return <CodeManagement role="organizer" />; }
export function AdminCodeManagement() { return <CodeManagement role="admin" />; }
