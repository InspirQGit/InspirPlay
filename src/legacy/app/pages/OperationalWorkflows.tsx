import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  Edit3,
  Eye,
  EyeOff,
  IndianRupee,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";
import type { CoachSessionItem, TournamentItem, VenueItem } from "../data";
import { COACH_SESSIONS, COACH_SESSIONS_STORAGE_KEY } from "../data";
import { ImageUpload } from "../components";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
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
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/SmartTable";
import { Textarea } from "../components/ui/textarea";

const VENUE_FALLBACK = "/inspirq-media/football.png";
const TOURNAMENT_FALLBACK = "/inspirq-media/badminton.png";
const SESSION_FALLBACK = "/inspirq-media/tennis.png";

const SPORTS = ["Badminton", "Football", "Tennis", "Basketball", "Cricket", "Squash", "Fitness"];
const AMENITIES = ["Parking", "Changing room", "Showers", "Floodlights", "First aid", "Equipment rental", "Café", "WiFi"];
const WIZARD_STEPS = ["Basics", "Operations", "Experience", "Review"];

function money(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function exportCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => escape(row[header])).join(","))].join("\n");
  const anchor = window.document.createElement("a");
  anchor.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}

function StatusPill({ status }: { status: string }) {
  const normalized = status.toLowerCase().replaceAll("_", " ");
  const tone =
    normalized === "active" || normalized === "upcoming" || normalized === "live"
      ? "border-sky-200 bg-sky-50 text-sky-700"
      : normalized === "pending review" || normalized === "filling fast"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : normalized === "suspended" || normalized === "cancelled"
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-border bg-muted text-muted-foreground";
  return <Badge variant="outline" className={`capitalize ${tone}`}>{normalized}</Badge>;
}

function ManagementHeader({
  eyebrow,
  title,
  description,
  onCreate,
  createLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  onCreate: () => void;
  createLabel: string;
}) {
  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-['Lexend'] text-2xl font-semibold tracking-tight">{title}</div>
        <Button onClick={onCreate}><Plus /> {createLabel}</Button>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof Users;
}) {
  return (
    <Card className="gap-0 shadow-none">
      <CardContent className="flex items-start justify-between p-4">
        <div>
          <div className="text-xs font-medium text-muted-foreground">{label}</div>
          <div className="mt-1 font-['Lexend'] text-xl font-semibold">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{note}</div>
        </div>
        <div className="rounded-lg bg-primary/10 p-2.5 text-brand-text"><Icon className="size-5" /></div>
      </CardContent>
    </Card>
  );
}

function WizardProgress({ step }: { step: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {WIZARD_STEPS.map((label, index) => (
          <div key={label} className={`flex items-center gap-2 text-xs font-medium ${index <= step ? "text-brand-text" : "text-muted-foreground"}`}>
            <span className={`flex size-6 items-center justify-center rounded-full border ${index < step ? "border-primary bg-primary text-primary-foreground" : index === step ? "border-primary bg-primary/10" : "border-border bg-muted"}`}>
              {index < step ? <Check className="size-3.5" /> : index + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>
      <Progress value={(step + 1) * 25} className="h-1.5" />
    </div>
  );
}

function FormField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function SearchToolbar({
  search,
  onSearch,
  status,
  onStatus,
  secondary,
  onSecondary,
  secondaryLabel,
}: {
  search: string;
  onSearch: (value: string) => void;
  status: string;
  onStatus: (value: string) => void;
  secondary: string;
  onSecondary: (value: string) => void;
  secondaryLabel: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-b p-4 lg:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search by name, location, or sport" className="pl-9" />
      </div>
      <Select value={status} onValueChange={onStatus}>
        <SelectTrigger className="lg:w-44"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="active">Active / upcoming</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
      <Select value={secondary} onValueChange={onSecondary}>
        <SelectTrigger className="lg:w-44"><SelectValue placeholder={secondaryLabel} /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{secondaryLabel}</SelectItem>
          {SPORTS.map((sport) => <SelectItem key={sport} value={sport}>{sport}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function ExportToolbar({
  selectedRows,
  filteredIds,
  onClear,
  onExport,
}: {
  selectedRows: Set<number>;
  filteredIds: number[];
  onClear: () => void;
  onExport: () => void;
}) {
  const visibleSelected = filteredIds.filter((id) => selectedRows.has(id)).length;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2">
      <div className="text-xs text-muted-foreground">
        {visibleSelected ? `${visibleSelected} selected in this view` : `${filteredIds.length} records in this view`}
      </div>
      <div className="flex items-center gap-2">
        {visibleSelected > 0 && <Button variant="ghost" size="sm" onClick={onClear}>Clear selection</Button>}
        <Button variant="outline" size="sm" disabled={!filteredIds.length} onClick={onExport}>
          <Download /> Export {visibleSelected ? "selected" : "current view"}
        </Button>
      </div>
    </div>
  );
}

function DetailHeader({
  title,
  subtitle,
  image,
  status,
  entityLabel,
  published,
  publishIssues,
  editDisabled,
  onBack,
  onEdit,
  onDelete,
  onPublishedChange,
  operations,
  children,
}: {
  title: string;
  subtitle: string;
  image: string;
  status: string;
  entityLabel: string;
  published: boolean;
  publishIssues: string[];
  editDisabled?: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPublishedChange: (published: boolean) => void;
  operations: React.ReactNode;
  children: React.ReactNode;
}) {
  const canPublish = publishIssues.length === 0;
  return (
    <div className="min-h-full bg-background">
      <div className="border-b bg-card px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center gap-3">
          <Button variant="ghost" onClick={onBack}><ArrowLeft /> Back to list</Button>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" disabled={editDisabled} onClick={onEdit}><Edit3 /> Edit</Button>
            <Button variant="outline" className="text-destructive" onClick={onDelete}><Trash2 /> Delete</Button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-screen-2xl space-y-6 p-4 sm:p-6">
        <Card className="gap-0 overflow-hidden shadow-none">
          <div className="grid md:grid-cols-[18rem_1fr]">
            <img src={image} alt={title} className="h-full min-h-56 w-full object-cover" />
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-2"><StatusPill status={status} /><Badge variant="secondary">Managed listing</Badge></div>
              <div className="mt-4 font-['Lexend'] text-2xl font-semibold">{title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div>
              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="h-auto flex-wrap"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="operations">Operations</TabsTrigger><TabsTrigger value="publishing">Publishing</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList>
                <TabsContent value="overview" className="mt-4">{children}</TabsContent>
                <TabsContent value="operations" className="mt-4">
                  <div className="space-y-4">
                    {operations}
                    <div className="flex flex-wrap gap-2 border-t pt-4">
                      <Button disabled={editDisabled} onClick={onEdit}><Edit3 /> Edit {entityLabel}</Button>
                      <Button variant="outline" className="text-destructive" onClick={onDelete}><Trash2 /> Delete {entityLabel}</Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="publishing" className="mt-4">
                  <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div><div className="text-sm font-semibold">Public discovery</div><div className="mt-1 text-sm text-muted-foreground">{published ? `This ${entityLabel} is visible in player discovery.` : `This ${entityLabel} is hidden from player discovery.`}</div></div>
                        <Switch checked={published} disabled={!published && !canPublish} onCheckedChange={onPublishedChange} />
                      </div>
                      <div className="mt-4 flex items-center gap-2">{published ? <Eye className="size-4 text-brand-text" /> : <EyeOff className="size-4 text-muted-foreground" />}<span className="text-sm font-medium">{published ? "Published" : "Not published"}</span></div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-sm font-semibold">Publishing readiness</div>
                      <div className="mt-3 space-y-2">
                        {canPublish ? (
                          <div className="flex items-center gap-2 text-sm text-brand-text"><CheckCircle2 className="size-4" /> All required information is complete.</div>
                        ) : publishIssues.map((issue) => (
                          <div key={issue} className="flex items-start gap-2 text-sm text-muted-foreground"><Clock3 className="mt-0.5 size-4 shrink-0" />{issue}</div>
                        ))}
                      </div>
                      {!canPublish && <Button variant="outline" className="mt-4" onClick={onEdit}><Edit3 /> Resolve issues</Button>}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="activity" className="mt-4">
                  <div className="space-y-2">{[`${entityLabel} created`, published ? "Published to player discovery" : "Saved as private or draft", `Current status: ${status}`].map((item, index) => <div key={item} className="flex items-center justify-between rounded-lg border p-3 text-sm"><span className="capitalize">{item}</span><span className="text-xs text-muted-foreground">{index === 0 ? "Initial setup" : "Latest workspace state"}</span></div>)}</div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DeleteDialog({
  open,
  onOpenChange,
  entity,
  blockedReason,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity: string;
  blockedReason?: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{blockedReason ? `This ${entity} cannot be deleted` : `Delete ${entity}?`}</AlertDialogTitle>
          <AlertDialogDescription>{blockedReason || "This permanently removes the draft record. This action cannot be undone."}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{blockedReason ? "Close" : "Keep it"}</AlertDialogCancel>
          {!blockedReason && <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={onConfirm}>Delete permanently</AlertDialogAction>}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type VenueForm = {
  name: string;
  sport: string;
  location: string;
  price: string;
  description: string;
  image: string;
  amenities: string[];
  slots: string;
  publish: boolean;
};

const EMPTY_VENUE: VenueForm = {
  name: "", sport: "Badminton", location: "", price: "", description: "", image: VENUE_FALLBACK,
  amenities: [], slots: "06:00, 07:00, 18:00, 19:00", publish: false,
};

function VenueWizard({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: VenueItem | null;
  onSave: (form: VenueForm) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<VenueForm>(initial ? {
    name: initial.name, sport: initial.sport, location: initial.location, price: String(initial.price),
    description: initial.description, image: initial.image, amenities: initial.amenities,
    slots: initial.slots.join(", "), publish: initial.published,
  } : EMPTY_VENUE);

  const toggleAmenity = (amenity: string) => setForm((current) => ({
    ...current,
    amenities: current.amenities.includes(amenity) ? current.amenities.filter((item) => item !== amenity) : [...current.amenities, amenity],
  }));
  const slots = form.slots.split(",").map((slot) => slot.trim()).filter(Boolean);
  const stepValid = step === 0
    ? Boolean(form.name.trim() && form.location.trim() && Number(form.price) > 0)
    : step === 1
      ? slots.length > 0 && new Set(slots).size === slots.length
      : step === 2
        ? form.description.trim().length >= 20
        : true;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader><DialogTitle>{initial ? "Edit venue" : "Create venue"}</DialogTitle><DialogDescription>Build a complete, trustworthy listing in four guided steps.</DialogDescription></DialogHeader>
        <WizardProgress step={step} />
        <div className="min-h-72 py-2">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><FormField label="Venue name"><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Court Masters Indoor Arena" /></FormField></div>
              <FormField label="Primary sport"><Select value={form.sport} onValueChange={(sport) => setForm({ ...form, sport })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{SPORTS.map((sport) => <SelectItem key={sport} value={sport}>{sport}</SelectItem>)}</SelectContent></Select></FormField>
              <FormField label="Base price per hour"><Input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="800" /></FormField>
              <div className="sm:col-span-2"><FormField label="Address and locality" hint="Use the location players recognize when arranging travel."><Input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Indiranagar, Bengaluru" /></FormField></div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-5">
              <FormField label="Available slots" hint="Comma-separated start times. You can fine-tune capacity later."><Input value={form.slots} onChange={(event) => setForm({ ...form, slots: event.target.value })} placeholder="06:00, 07:00, 18:00" /></FormField>
              <FormField label="Amenities">
                <div className="flex flex-wrap gap-2">{AMENITIES.map((amenity) => <Button key={amenity} type="button" size="sm" variant={form.amenities.includes(amenity) ? "default" : "outline"} onClick={() => toggleAmenity(amenity)}>{form.amenities.includes(amenity) && <Check />}{amenity}</Button>)}</div>
              </FormField>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <FormField label="Player-facing description" hint="Set expectations about surfaces, access, equipment, and who the venue suits."><Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe the experience, surfaces, and arrival instructions." /></FormField>
              <FormField label="Cover image"><ImageUpload value={form.image} onChange={(image) => setForm({ ...form, image })} label="Upload venue cover" /></FormField>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/40 p-4">
                <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 size-5 text-brand-text" /><div><div className="font-medium">{form.name || "Untitled venue"}</div><div className="mt-1 text-sm text-muted-foreground">{form.sport} · {form.location || "Location required"} · {money(Number(form.price || 0))}/hour</div></div></div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4"><div><div className="text-sm font-medium">Publish after approval</div><div className="text-xs text-muted-foreground">Make the venue discoverable as soon as verification completes.</div></div><Switch checked={form.publish} onCheckedChange={(publish) => setForm({ ...form, publish })} /></div>
              <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">New venues enter a short trust and safety review before becoming visible to players.</div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => step === 0 ? onOpenChange(false) : setStep(step - 1)}>{step === 0 ? "Cancel" : "Back"}</Button>
          <Button disabled={!stepValid} onClick={() => step < 3 ? setStep(step + 1) : (onSave(form), onOpenChange(false))}>{step < 3 ? <>Continue <ArrowRight /></> : <><CheckCircle2 /> {initial ? "Save changes" : "Submit venue"}</>}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function VenueListWorkflow({ venues, onUpdateVenue, onDeleteVenue, onAddVenue }: {
  venues: VenueItem[];
  onUpdateVenue: (venue: VenueItem) => void;
  onDeleteVenue: (id: number) => void;
  onAddVenue: (venue: VenueItem) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sport, setSport] = useState("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editing, setEditing] = useState<VenueItem | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const selected = venues.find((venue) => venue.id === selectedId) ?? null;
  const filtered = useMemo(() => venues.filter((venue) => {
    const q = search.toLowerCase();
    const matchesSearch = venue.name.toLowerCase().includes(q) || venue.location.toLowerCase().includes(q);
    const matchesStatus = status === "all" || (status === "active" ? venue.listingStatus === "active" : venue.listingStatus === status);
    return matchesSearch && matchesStatus && (sport === "all" || venue.sport === sport);
  }), [venues, search, status, sport]);

  const save = (form: VenueForm) => {
    const slots = form.slots.split(",").map((slot) => slot.trim()).filter(Boolean);
    if (editing) {
      onUpdateVenue({ ...editing, ...form, price: Number(form.price), slots, listingStatus: form.publish ? "active" : editing.listingStatus, published: form.publish });
    } else {
      onAddVenue({
        id: Date.now(), name: form.name, sport: form.sport, location: form.location, price: Number(form.price),
        description: form.description, image: form.image || VENUE_FALLBACK, amenities: form.amenities, slots,
        rating: 0, reviews: 0, verified: false, available: true, owner: "You", featured: false,
        listingStatus: "pending_review", published: false,
      });
    }
    setEditing(null);
  };

  if (selected) {
    const occupancy = selected.available ? 76 : 100;
    const publishIssues = [
      !selected.verified && "Verification must be approved before publishing.",
      !selected.description?.trim() && "Add a player-facing description.",
      !selected.slots.length && "Add at least one bookable slot.",
      selected.price <= 0 && "Set a valid hourly price.",
    ].filter(Boolean) as string[];
    const deleteBlockedReason = selected.published || selected.reviews > 0
      ? "Unpublish the venue first. Venues with reviews or booking history must be retained for audit and customer support."
      : undefined;
    return (
      <>
        <DetailHeader title={selected.name} subtitle={`${selected.sport} · ${selected.location}`} image={selected.image || VENUE_FALLBACK} status={selected.listingStatus} entityLabel="venue" published={selected.published} publishIssues={publishIssues} onPublishedChange={(published) => onUpdateVenue({ ...selected, published, listingStatus: published ? "active" : "draft" })} onBack={() => setSelectedId(null)} onEdit={() => { setEditing(selected); setWizardOpen(true); }} onDelete={() => setDeleteId(selected.id)} operations={
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4"><div className="text-sm font-semibold">Availability and pricing</div><div className="mt-1 text-sm text-muted-foreground">{selected.slots.length} bookable slots at {money(selected.price)} per hour. Edit the venue to change schedule, capacity, amenities, or pricing.</div><Button variant="outline" size="sm" className="mt-4" onClick={() => onUpdateVenue({ ...selected, available: !selected.available })}>{selected.available ? <EyeOff /> : <Eye />}{selected.available ? "Pause new bookings" : "Resume bookings"}</Button></div>
            <div className="rounded-lg border p-4"><div className="text-sm font-semibold">Trust and service state</div><div className="mt-1 text-sm text-muted-foreground">{selected.verified ? "Identity and venue verification are complete." : "Verification is pending. Publishing remains blocked until approval."}</div></div>
          </div>
        }>
          <div className="grid gap-3 sm:grid-cols-4">
            {[["Hourly price", money(selected.price)], ["Bookable slots", String(selected.slots.length)], ["Occupancy", `${occupancy}%`], ["Player rating", selected.rating ? `${selected.rating} / 5` : "New"]].map(([label, value]) => <div key={label} className="rounded-lg bg-muted p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 font-semibold">{value}</div></div>)}
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div><div className="text-sm font-semibold">About this venue</div><div className="mt-2 text-sm leading-6 text-muted-foreground">{selected.description || "Add a description to help players choose with confidence."}</div><div className="mt-4 flex flex-wrap gap-2">{selected.amenities.map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}</div></div>
            <div><div className="text-sm font-semibold">Operational readiness</div><div className="mt-3 space-y-3">{[["Profile completeness", 88], ["Availability coverage", 72], ["Trust verification", selected.verified ? 100 : 60]].map(([label, value]) => <div key={label as string}><div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><span>{value}%</span></div><Progress value={value as number} /></div>)}</div></div>
          </div>
        </DetailHeader>
        <VenueWizard key={editing?.id} open={wizardOpen} onOpenChange={setWizardOpen} initial={editing} onSave={save} />
        <DeleteDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)} entity="venue" blockedReason={deleteBlockedReason} onConfirm={() => { if (deleteId !== null) onDeleteVenue(deleteId); setDeleteId(null); setSelectedId(null); }} />
      </>
    );
  }

  return (
    <div className="min-h-full bg-background">
      <ManagementHeader eyebrow="Venue operations" title="Venue portfolio" description="Keep every venue accurate, bookable, trusted, and ready for player discovery." createLabel="Add venue" onCreate={() => { setEditing(null); setWizardOpen(true); }} />
      <div className="mx-auto max-w-screen-2xl space-y-5 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={Building2} label="Managed venues" value={String(venues.length)} note="Across your portfolio" />
          <Metric icon={Eye} label="Live listings" value={String(venues.filter((item) => item.published).length)} note="Visible to players" />
          <Metric icon={CalendarDays} label="Bookable slots" value={String(venues.reduce((sum, item) => sum + item.slots.length, 0))} note="Across all venues" />
          <Metric icon={Star} label="Average rating" value="4.7" note="From verified bookings" />
        </div>
        <Card className="gap-0 overflow-hidden shadow-none">
          <SearchToolbar search={search} onSearch={setSearch} status={status} onStatus={setStatus} secondary={sport} onSecondary={setSport} secondaryLabel="All sports" />
          <ExportToolbar selectedRows={selectedRows} filteredIds={filtered.map((item) => item.id)} onClear={() => setSelectedRows(new Set())} onExport={() => exportCsv("venues.csv", (selectedRows.size ? filtered.filter((item) => selectedRows.has(item.id)) : filtered) as unknown as Record<string, unknown>[])} />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead className="w-10"><Checkbox checked={filtered.length > 0 && filtered.every((item) => selectedRows.has(item.id))} onCheckedChange={(checked) => setSelectedRows(checked ? new Set(filtered.map((item) => item.id)) : new Set())} /></TableHead><TableHead>Venue</TableHead><TableHead>Sport</TableHead><TableHead>Pricing</TableHead><TableHead>Availability</TableHead><TableHead>Rating</TableHead><TableHead>Status</TableHead><TableHead>Visibility</TableHead><TableHead /></TableRow></TableHeader>
              <TableBody>{filtered.map((venue) => (
                <TableRow key={venue.id} className="cursor-pointer" onClick={() => setSelectedId(venue.id)}>
                  <TableCell onClick={(event) => event.stopPropagation()}><Checkbox checked={selectedRows.has(venue.id)} onCheckedChange={(checked) => setSelectedRows((current) => { const next = new Set(current); checked ? next.add(venue.id) : next.delete(venue.id); return next; })} /></TableCell>
                  <TableCell><div className="flex min-w-64 items-center gap-3"><img src={venue.image || VENUE_FALLBACK} alt="" className="size-11 rounded-md object-cover" /><div><div className="font-medium">{venue.name}</div><div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" />{venue.location}</div></div></div></TableCell>
                  <TableCell>{venue.sport}</TableCell><TableCell className="font-medium">{money(venue.price)}/hr</TableCell><TableCell>{venue.slots.length} slots</TableCell>
                  <TableCell>{venue.rating ? `${venue.rating} (${venue.reviews})` : "New"}</TableCell><TableCell><StatusPill status={venue.listingStatus} /></TableCell>
                  <TableCell>{venue.published ? <Badge className="bg-primary">Live</Badge> : <Badge variant="secondary">Hidden</Badge>}</TableCell>
                  <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); setEditing(venue); setWizardOpen(true); }}><Edit3 /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={(event) => { event.stopPropagation(); setDeleteId(venue.id); }}><Trash2 /></Button></div></TableCell>
                </TableRow>
              ))}
              {!filtered.length && <TableRow><TableCell colSpan={9} className="h-32 text-center text-muted-foreground">No venues match the current search and filters.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
      <VenueWizard key={editing?.id ?? "new"} open={wizardOpen} onOpenChange={setWizardOpen} initial={editing} onSave={save} />
      <DeleteDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)} entity="venue" blockedReason={(() => { const item = venues.find((venue) => venue.id === deleteId); return item && (item.published || item.reviews > 0) ? "Unpublish the venue first. Venues with reviews or booking history must be retained for audit and customer support." : undefined; })()} onConfirm={() => { if (deleteId !== null) onDeleteVenue(deleteId); setDeleteId(null); }} />
    </div>
  );
}

type TournamentForm = {
  name: string; sport: string; venue: string; date: string; slots: string; fee: string; prize: string;
  description: string; image: string; format: string; level: string; categories: string;
  registrationDeadline: string; checkInTime: string; rules: string; inclusions: string;
  contact: string; refundPolicy: string; publish: boolean;
};
const EMPTY_TOURNAMENT: TournamentForm = { name: "", sport: "Badminton", venue: "", date: "", slots: "32", fee: "", prize: "", description: "", image: TOURNAMENT_FALLBACK, format: "Single elimination", level: "Open", categories: "", registrationDeadline: "", checkInTime: "", rules: "", inclusions: "", contact: "", refundPolicy: "", publish: false };

function TournamentWizard({ open, onOpenChange, initial, onSave }: {
  open: boolean; onOpenChange: (open: boolean) => void; initial?: TournamentItem | null; onSave: (form: TournamentForm) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<TournamentForm>(initial ? { name: initial.name, sport: initial.sport, venue: initial.venue, date: initial.date, slots: String(initial.slots), fee: String(initial.fee), prize: initial.prize, description: initial.description, image: initial.image, format: initial.format || "Single elimination", level: initial.level || "Open", categories: (initial.categories || []).join(", "), registrationDeadline: initial.registrationDeadline || "", checkInTime: initial.checkInTime || "", rules: (initial.rules || []).join("\n"), inclusions: (initial.inclusions || []).join(", "), contact: initial.contact || "", refundPolicy: initial.refundPolicy || "", publish: initial.published } : EMPTY_TOURNAMENT);
  const stepValid = step === 0
    ? Boolean(form.name.trim() && form.description.trim() && form.format)
    : step === 1
      ? Boolean(form.venue.trim() && form.date && form.registrationDeadline && form.registrationDeadline <= form.date && form.checkInTime && Number(form.slots) > 0 && Number(form.slots) >= (initial?.filled ?? 0) && Number(form.fee) >= 0)
      : step === 2
        ? Boolean(form.level.trim() && form.categories.trim() && form.rules.trim() && form.contact.trim() && form.refundPolicy.trim())
        : true;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader><DialogTitle>{initial ? "Edit tournament" : "Create tournament"}</DialogTitle><DialogDescription>Plan the competition, participant experience, and launch settings.</DialogDescription></DialogHeader>
        <WizardProgress step={step} />
        <div className="min-h-72 py-2">
          {step === 0 && <div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><FormField label="Tournament name"><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Bengaluru Badminton Open" /></FormField></div><FormField label="Sport"><Select value={form.sport} onValueChange={(sport) => setForm({ ...form, sport })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{SPORTS.map((sport) => <SelectItem key={sport} value={sport}>{sport}</SelectItem>)}</SelectContent></Select></FormField><FormField label="Format"><Select value={form.format} onValueChange={(format) => setForm({ ...form, format })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Single elimination">Single elimination</SelectItem><SelectItem value="Round robin">Round robin</SelectItem><SelectItem value="League">League</SelectItem></SelectContent></Select></FormField><div className="sm:col-span-2"><FormField label="Tournament description"><Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Who should join, competition format, and what is included." /></FormField></div></div>}
          {step === 1 && <div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><FormField label="Venue"><Input value={form.venue} onChange={(event) => setForm({ ...form, venue: event.target.value })} placeholder="Court Masters Arena" /></FormField></div><FormField label="Event date"><Input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></FormField><FormField label="Registration deadline"><Input type="date" value={form.registrationDeadline} onChange={(event) => setForm({ ...form, registrationDeadline: event.target.value })} /></FormField><FormField label="Participant capacity"><Input type="number" value={form.slots} onChange={(event) => setForm({ ...form, slots: event.target.value })} /></FormField><FormField label="Check-in time"><Input type="time" value={form.checkInTime} onChange={(event) => setForm({ ...form, checkInTime: event.target.value })} /></FormField><FormField label="Entry fee"><Input type="number" value={form.fee} onChange={(event) => setForm({ ...form, fee: event.target.value })} placeholder="500" /></FormField><FormField label="Prize pool"><Input value={form.prize} onChange={(event) => setForm({ ...form, prize: event.target.value })} placeholder="₹25,000" /></FormField></div>}
          {step === 2 && <div className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><FormField label="Skill level"><Input value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })} placeholder="Intermediate–Advanced" /></FormField><FormField label="Categories"><Input value={form.categories} onChange={(event) => setForm({ ...form, categories: event.target.value })} placeholder="Men's Singles, Open Doubles" /></FormField><FormField label="Contact"><Input value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} placeholder="+91..." /></FormField><FormField label="Refund policy"><Input value={form.refundPolicy} onChange={(event) => setForm({ ...form, refundPolicy: event.target.value })} placeholder="Full refund until 72 hours before" /></FormField></div><FormField label="Rules (one per line)"><Textarea value={form.rules} onChange={(event) => setForm({ ...form, rules: event.target.value })} /></FormField><FormField label="Entry inclusions"><Input value={form.inclusions} onChange={(event) => setForm({ ...form, inclusions: event.target.value })} placeholder="Officials, hydration, certificate" /></FormField><FormField label="Event image"><ImageUpload value={form.image} onChange={(image) => setForm({ ...form, image })} label="Upload tournament cover" /></FormField></div>}
          {step === 3 && <div className="space-y-4"><div className="rounded-lg border p-4"><div className="font-medium">{form.name || "Untitled tournament"}</div><div className="mt-1 text-sm text-muted-foreground">{form.sport} · {form.format} · {form.slots} slots</div><div className="mt-4 grid grid-cols-3 gap-3 text-sm"><div><div className="text-xs text-muted-foreground">Date</div><div className="font-medium">{form.date || "Not set"}</div></div><div><div className="text-xs text-muted-foreground">Fee</div><div className="font-medium">{money(Number(form.fee || 0))}</div></div><div><div className="text-xs text-muted-foreground">Prize</div><div className="font-medium">{form.prize || "Not set"}</div></div></div></div><div className="flex items-center justify-between rounded-lg border p-4"><div><div className="text-sm font-medium">Publish now</div><div className="text-xs text-muted-foreground">Open registration immediately after saving.</div></div><Switch checked={form.publish} onCheckedChange={(publish) => setForm({ ...form, publish })} /></div></div>}
        </div>
        <DialogFooter><Button variant="outline" onClick={() => step === 0 ? onOpenChange(false) : setStep(step - 1)}>{step === 0 ? "Cancel" : "Back"}</Button><Button disabled={!stepValid} onClick={() => step < 3 ? setStep(step + 1) : (onSave(form), onOpenChange(false))}>{step < 3 ? <>Continue <ArrowRight /></> : <><CheckCircle2 /> {initial ? "Save changes" : "Create tournament"}</>}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TournamentListWorkflow({ tournaments, onAddTournament, onUpdateTournament, onDeleteTournament }: {
  tournaments: TournamentItem[]; onAddTournament: (item: TournamentItem) => void; onUpdateTournament: (item: TournamentItem) => void; onDeleteTournament: (id: number) => void;
}) {
  const [search, setSearch] = useState(""); const [status, setStatus] = useState("all"); const [sport, setSport] = useState("all");
  const [selectedId, setSelectedId] = useState<number | null>(null); const [editing, setEditing] = useState<TournamentItem | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false); const [deleteId, setDeleteId] = useState<number | null>(null); const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const selected = tournaments.find((item) => item.id === selectedId) ?? null;
  const filtered = tournaments.filter((item) => {
    const matchesSearch = `${item.name} ${item.venue}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || (status === "active" ? item.listingStatus === "active" : status === "completed" ? item.status === "completed" : item.listingStatus === status);
    return matchesSearch && matchesStatus && (sport === "all" || item.sport === sport);
  });
  const save = (form: TournamentForm) => {
    const publicFields = { format: form.format, level: form.level, categories: form.categories.split(",").map((item) => item.trim()).filter(Boolean), registrationDeadline: form.registrationDeadline, checkInTime: form.checkInTime, rules: form.rules.split("\n").map((item) => item.trim()).filter(Boolean), inclusions: form.inclusions.split(",").map((item) => item.trim()).filter(Boolean), contact: form.contact, refundPolicy: form.refundPolicy };
    if (editing) onUpdateTournament({ ...editing, name: form.name, sport: form.sport, venue: form.venue, date: form.date, prize: form.prize, description: form.description, image: form.image, ...publicFields, slots: Number(form.slots), fee: Number(form.fee), published: form.publish, listingStatus: form.publish ? "active" : "draft" });
    else onAddTournament({ id: Date.now(), name: form.name, sport: form.sport, venue: form.venue, date: form.date, slots: Number(form.slots), filled: 0, fee: Number(form.fee), prize: form.prize, description: form.description, image: form.image || TOURNAMENT_FALLBACK, ...publicFields, status: "open", organizer: "SportsFest", organizerVerified: true, organizerEvents: 12, organizerRating: 4.8, listingStatus: form.publish ? "active" : "draft", published: form.publish, createdBy: "organizer" });
    setEditing(null);
  };
  if (selected) {
    const publishIssues = [
      !selected.description?.trim() && "Add a complete event description.",
      !selected.venue?.trim() && "Select an event venue.",
      !selected.date && "Set the event date.",
      !selected.registrationDeadline && "Set a registration deadline.",
      Boolean(selected.registrationDeadline && selected.date && selected.registrationDeadline > selected.date) && "Registration must close on or before the event date.",
      selected.slots <= 0 && "Set a valid participant capacity.",
      selected.slots < selected.filled && "Capacity cannot be lower than current registrations.",
      !(selected.rules || []).length && "Add participant rules.",
      !selected.refundPolicy?.trim() && "Add a refund policy.",
    ].filter(Boolean) as string[];
    const deleteBlockedReason = selected.filled > 0
      ? "This tournament has registrations and must be retained. Close registration or move it to draft instead of deleting it."
      : selected.published
        ? "Unpublish this tournament before deleting it."
        : undefined;
    return (
    <>
      <DetailHeader title={selected.name} subtitle={`${selected.sport} · ${selected.venue} · ${selected.date}`} image={selected.image || TOURNAMENT_FALLBACK} status={selected.listingStatus} entityLabel="tournament" published={selected.published} publishIssues={publishIssues} onPublishedChange={(published) => onUpdateTournament({ ...selected, published, listingStatus: published ? "active" : "draft" })} onBack={() => setSelectedId(null)} onEdit={() => { setEditing(selected); setWizardOpen(true); }} onDelete={() => setDeleteId(selected.id)} operations={
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-4"><div className="text-sm font-semibold">Registration window</div><div className="mt-1 text-sm text-muted-foreground">Closes {selected.registrationDeadline || "not configured"}. {Math.max(selected.slots - selected.filled, 0)} places remain.</div><Button variant="outline" size="sm" className="mt-4" onClick={() => onUpdateTournament({ ...selected, status: selected.status === "full" ? "open" : "full" })}>{selected.status === "full" ? <Eye /> : <EyeOff />}{selected.status === "full" ? "Reopen registration" : "Close registration"}</Button></div>
          <div className="rounded-lg border p-4"><div className="text-sm font-semibold">Competition setup</div><div className="mt-1 text-sm text-muted-foreground">{selected.format || "Format missing"} · {(selected.categories || []).length} categories · {(selected.rules || []).length} rules.</div></div>
          <div className="rounded-lg border p-4"><div className="text-sm font-semibold">Participant policy</div><div className="mt-1 text-sm text-muted-foreground">{selected.refundPolicy || "Refund policy is missing."}</div></div>
        </div>
      }>
        <div className="grid gap-3 sm:grid-cols-4">{[["Registrations", `${selected.filled} / ${selected.slots}`], ["Fill rate", `${Math.round(selected.filled / selected.slots * 100)}%`], ["Entry fee", money(selected.fee)], ["Projected revenue", money(selected.filled * selected.fee)]].map(([label, value]) => <div key={label} className="rounded-lg bg-muted p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 font-semibold">{value}</div></div>)}</div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2"><div><div className="text-sm font-semibold">Event overview</div><div className="mt-2 text-sm leading-6 text-muted-foreground">{selected.description}</div><div className="mt-4 flex gap-2"><Badge variant="secondary">Prize {selected.prize}</Badge><Badge variant="secondary">{selected.status}</Badge></div></div><div><div className="text-sm font-semibold">Registration health</div><div className="mt-3"><div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">Capacity filled</span><span>{selected.filled}/{selected.slots}</span></div><Progress value={selected.filled / selected.slots * 100} /></div><div className="mt-4 rounded-lg bg-primary/10 p-3 text-sm text-brand-text">Next best action: remind incomplete registrations and confirm venue operations 48 hours before the event.</div></div></div>
      </DetailHeader>
      <TournamentWizard key={editing?.id} open={wizardOpen} onOpenChange={setWizardOpen} initial={editing} onSave={save} />
      <DeleteDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)} entity="tournament" blockedReason={deleteBlockedReason} onConfirm={() => { if (deleteId !== null) onDeleteTournament(deleteId); setDeleteId(null); setSelectedId(null); }} />
    </>
  );
  }
  return (
    <div className="min-h-full bg-background">
      <ManagementHeader eyebrow="Organizer operations" title="Tournament portfolio" description="Plan, publish, fill, and deliver every competition from one operational view." createLabel="Create tournament" onCreate={() => { setEditing(null); setWizardOpen(true); }} />
      <div className="mx-auto max-w-screen-2xl space-y-5 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={Trophy} label="Total tournaments" value={String(tournaments.length)} note="All lifecycle stages" /><Metric icon={Users} label="Registrations" value={String(tournaments.reduce((sum, item) => sum + item.filled, 0))} note="Across current events" /><Metric icon={Eye} label="Open for booking" value={String(tournaments.filter((item) => item.published).length)} note="Visible to players" /><Metric icon={IndianRupee} label="Registration value" value={money(tournaments.reduce((sum, item) => sum + item.filled * item.fee, 0))} note="Gross entry fees" /></div>
        <Card className="gap-0 overflow-hidden shadow-none"><SearchToolbar search={search} onSearch={setSearch} status={status} onStatus={setStatus} secondary={sport} onSecondary={setSport} secondaryLabel="All sports" /><ExportToolbar selectedRows={selectedRows} filteredIds={filtered.map((item) => item.id)} onClear={() => setSelectedRows(new Set())} onExport={() => exportCsv("tournaments.csv", (selectedRows.size ? filtered.filter((item) => selectedRows.has(item.id)) : filtered) as unknown as Record<string, unknown>[])} /><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead className="w-10"><Checkbox checked={filtered.length > 0 && filtered.every((item) => selectedRows.has(item.id))} onCheckedChange={(checked) => setSelectedRows(checked ? new Set(filtered.map((item) => item.id)) : new Set())} /></TableHead><TableHead>Tournament</TableHead><TableHead>Date & venue</TableHead><TableHead>Registration</TableHead><TableHead>Entry fee</TableHead><TableHead>Prize</TableHead><TableHead>Status</TableHead><TableHead>Visibility</TableHead><TableHead /></TableRow></TableHeader><TableBody>{filtered.map((item) => <TableRow key={item.id} className="cursor-pointer" onClick={() => setSelectedId(item.id)}><TableCell onClick={(event) => event.stopPropagation()}><Checkbox checked={selectedRows.has(item.id)} onCheckedChange={(checked) => setSelectedRows((current) => { const next = new Set(current); checked ? next.add(item.id) : next.delete(item.id); return next; })} /></TableCell><TableCell><div className="flex min-w-64 items-center gap-3"><img src={item.image || TOURNAMENT_FALLBACK} alt="" className="size-11 rounded-md object-cover" /><div><div className="font-medium">{item.name}</div><div className="text-xs text-muted-foreground">{item.sport}</div></div></div></TableCell><TableCell><div>{item.date}</div><div className="text-xs text-muted-foreground">{item.venue}</div></TableCell><TableCell><div className="min-w-28"><div className="mb-1 flex justify-between text-xs"><span>{item.filled}/{item.slots}</span><span>{Math.round(item.filled / item.slots * 100)}%</span></div><Progress value={item.filled / item.slots * 100} /></div></TableCell><TableCell className="font-medium">{money(item.fee)}</TableCell><TableCell>{item.prize}</TableCell><TableCell><StatusPill status={item.status} /></TableCell><TableCell>{item.published ? <Badge className="bg-primary">Live</Badge> : <Badge variant="secondary">Draft</Badge>}</TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); setEditing(item); setWizardOpen(true); }}><Edit3 /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={(event) => { event.stopPropagation(); setDeleteId(item.id); }}><Trash2 /></Button></div></TableCell></TableRow>)}{!filtered.length && <TableRow><TableCell colSpan={9} className="h-32 text-center text-muted-foreground">No tournaments match the current search and filters.</TableCell></TableRow>}</TableBody></Table></div></Card>
      </div>
      <TournamentWizard key={editing?.id ?? "new"} open={wizardOpen} onOpenChange={setWizardOpen} initial={editing} onSave={save} />
      <DeleteDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)} entity="tournament" blockedReason={(() => { const item = tournaments.find((tournament) => tournament.id === deleteId); return item?.filled ? "This tournament has registrations and must be retained. Close registration or move it to draft instead of deleting it." : item?.published ? "Unpublish this tournament before deleting it." : undefined; })()} onConfirm={() => { if (deleteId !== null) onDeleteTournament(deleteId); setDeleteId(null); }} />
    </div>
  );
}

type SessionForm = { name: string; sport: string; venue: string; date: string; start: string; end: string; capacity: string; price: string; level: string; description: string; image: string; publish: boolean };
const EMPTY_SESSION: SessionForm = { name: "", sport: "Badminton", venue: "", date: "", start: "", end: "", capacity: "10", price: "", level: "All Levels", description: "", image: SESSION_FALLBACK, publish: false };

function SessionWizard({ open, onOpenChange, initial, onSave }: { open: boolean; onOpenChange: (open: boolean) => void; initial?: CoachSessionItem | null; onSave: (form: SessionForm) => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<SessionForm>(initial ? { name: initial.name, sport: initial.sport, venue: initial.venue, date: initial.date, start: initial.time.split("–")[0], end: initial.time.split("–")[1], capacity: String(initial.maxStudents), price: String(initial.price), level: initial.level, description: initial.description, image: initial.image, publish: initial.published } : EMPTY_SESSION);
  const stepValid = step === 0
    ? Boolean(form.name.trim() && form.description.trim())
    : step === 1
      ? Boolean(form.venue.trim() && form.date && form.start && form.end && form.start < form.end && Number(form.capacity) > 0 && Number(form.capacity) >= (initial?.enrolled ?? 0) && Number(form.price) >= 0)
      : true;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{initial ? "Edit training session" : "Create training session"}</DialogTitle><DialogDescription>Design a clear, bookable learning experience for the right students.</DialogDescription></DialogHeader><WizardProgress step={step} /><div className="min-h-72 py-2">
    {step === 0 && <div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><FormField label="Session name"><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Advanced Footwork Clinic" /></FormField></div><FormField label="Sport"><Select value={form.sport} onValueChange={(sport) => setForm({ ...form, sport })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{SPORTS.map((sport) => <SelectItem key={sport} value={sport}>{sport}</SelectItem>)}</SelectContent></Select></FormField><FormField label="Skill level"><Select value={form.level} onValueChange={(level) => setForm({ ...form, level })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Beginner", "Intermediate", "Advanced", "All Levels"].map((level) => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent></Select></FormField><div className="sm:col-span-2"><FormField label="Learning outcome"><Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What will students improve or be able to do after this session?" /></FormField></div></div>}
    {step === 1 && <div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><FormField label="Venue"><Input value={form.venue} onChange={(event) => setForm({ ...form, venue: event.target.value })} placeholder="Court Masters Arena" /></FormField></div><FormField label="Date"><Input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></FormField><FormField label="Capacity"><Input type="number" value={form.capacity} onChange={(event) => setForm({ ...form, capacity: event.target.value })} /></FormField><FormField label="Start time"><Input type="time" value={form.start} onChange={(event) => setForm({ ...form, start: event.target.value })} /></FormField><FormField label="End time"><Input type="time" value={form.end} onChange={(event) => setForm({ ...form, end: event.target.value })} /></FormField><FormField label="Price per student"><Input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></FormField></div>}
    {step === 2 && <div className="space-y-5"><FormField label="Session image"><ImageUpload value={form.image} onChange={(image) => setForm({ ...form, image })} label="Upload session cover" /></FormField><div className="rounded-lg bg-primary/10 p-4 text-sm text-brand-text">Students need confidence before booking. Include prerequisites, equipment, intensity, and the exact skill outcome.</div></div>}
    {step === 3 && <div className="space-y-4"><div className="rounded-lg border p-4"><div className="font-medium">{form.name || "Untitled session"}</div><div className="mt-1 text-sm text-muted-foreground">{form.sport} · {form.level} · {form.date || "Date not set"}</div><div className="mt-4 grid grid-cols-3 gap-3"><div><div className="text-xs text-muted-foreground">Time</div><div className="text-sm font-medium">{form.start}–{form.end}</div></div><div><div className="text-xs text-muted-foreground">Capacity</div><div className="text-sm font-medium">{form.capacity} students</div></div><div><div className="text-xs text-muted-foreground">Price</div><div className="text-sm font-medium">{money(Number(form.price || 0))}</div></div></div></div><div className="flex items-center justify-between rounded-lg border p-4"><div><div className="text-sm font-medium">Open booking now</div><div className="text-xs text-muted-foreground">Publish the session to students after saving.</div></div><Switch checked={form.publish} onCheckedChange={(publish) => setForm({ ...form, publish })} /></div></div>}
  </div><DialogFooter><Button variant="outline" onClick={() => step === 0 ? onOpenChange(false) : setStep(step - 1)}>{step === 0 ? "Cancel" : "Back"}</Button><Button disabled={!stepValid} onClick={() => step < 3 ? setStep(step + 1) : (onSave(form), onOpenChange(false))}>{step < 3 ? <>Continue <ArrowRight /></> : <><CheckCircle2 /> {initial ? "Save changes" : "Create session"}</>}</Button></DialogFooter></DialogContent></Dialog>;
}

export function TrainerSessionsWorkflow() {
  const [sessions, setSessions] = useState<CoachSessionItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(COACH_SESSIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : COACH_SESSIONS;
    } catch {
      return COACH_SESSIONS;
    }
  }); const [search, setSearch] = useState(""); const [status, setStatus] = useState("all"); const [sport, setSport] = useState("all");
  const [selectedId, setSelectedId] = useState<number | null>(null); const [editing, setEditing] = useState<CoachSessionItem | null>(null); const [wizardOpen, setWizardOpen] = useState(false); const [deleteId, setDeleteId] = useState<number | null>(null); const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  useEffect(() => {
    try { window.localStorage.setItem(COACH_SESSIONS_STORAGE_KEY, JSON.stringify(sessions)); } catch { /* Keep in-memory CRUD available. */ }
  }, [sessions]);
  const selected = sessions.find((item) => item.id === selectedId) ?? null;
  const filtered = sessions.filter((item) => {
    const matchesSearch = `${item.name} ${item.venue}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all"
      || (status === "active" ? item.status === "upcoming" : status === "draft" ? !item.published : item.status === status);
    return matchesSearch && matchesStatus && (sport === "all" || item.sport === sport);
  });
  const save = (form: SessionForm) => {
    const values = { name: form.name, sport: form.sport, venue: form.venue, date: form.date, time: `${form.start}–${form.end}`, maxStudents: Number(form.capacity), price: Number(form.price), level: form.level, description: form.description, image: form.image || SESSION_FALLBACK, published: form.publish };
    if (editing) setSessions((current) => current.map((item) => item.id === editing.id ? { ...item, ...values } : item));
    else setSessions((current) => [{ id: Date.now(), ...values, enrolled: 0, status: "upcoming" }, ...current]);
    setEditing(null);
  };
  if (selected) {
    const [start, end] = selected.time.split("–");
    const publishIssues = [
      selected.status !== "upcoming" && "Only upcoming sessions can accept bookings.",
      !selected.description?.trim() && "Add a clear learning outcome.",
      !selected.venue?.trim() && "Set the delivery venue.",
      !selected.date && "Set the session date.",
      (!start || !end || start >= end) && "Set a valid start and end time.",
      selected.maxStudents <= 0 && "Set a valid capacity.",
      selected.maxStudents < selected.enrolled && "Capacity cannot be lower than current enrolment.",
      selected.price < 0 && "Price cannot be negative.",
    ].filter(Boolean) as string[];
    const deleteBlockedReason = selected.enrolled > 0
      ? "This session has enrolled students and must be retained. Cancel and unpublish it so students can be notified and records remain auditable."
      : selected.published
        ? "Close booking and unpublish this session before deleting it."
        : undefined;
    return (
    <>
      <DetailHeader title={selected.name} subtitle={`${selected.sport} · ${selected.venue} · ${selected.date}, ${selected.time}`} image={selected.image} status={selected.status} entityLabel="session" published={selected.published} publishIssues={publishIssues} editDisabled={selected.status !== "upcoming"} onPublishedChange={(published) => setSessions((current) => current.map((item) => item.id === selected.id ? { ...item, published } : item))} onBack={() => setSelectedId(null)} onEdit={() => { setEditing(selected); setWizardOpen(true); }} onDelete={() => setDeleteId(selected.id)} operations={
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-4"><div className="text-sm font-semibold">Delivery plan</div><div className="mt-1 text-sm text-muted-foreground">{selected.date} · {selected.time} at {selected.venue}.</div></div>
          <div className="rounded-lg border p-4"><div className="text-sm font-semibold">Capacity controls</div><div className="mt-1 text-sm text-muted-foreground">{selected.enrolled} enrolled with {Math.max(selected.maxStudents - selected.enrolled, 0)} places remaining.</div></div>
          <div className="rounded-lg border p-4"><div className="text-sm font-semibold">Session lifecycle</div><div className="mt-1 text-sm text-muted-foreground">{selected.status === "upcoming" ? "Upcoming sessions can be edited or unpublished. Sessions with enrolments cannot be deleted." : "Historical sessions remain read-only for reporting and student records."}</div>{selected.status === "upcoming" && <Button variant="outline" size="sm" className="mt-4" onClick={() => setSessions((current) => current.map((item) => item.id === selected.id ? { ...item, status: "cancelled", published: false } : item))}><EyeOff /> Cancel session</Button>}</div>
        </div>
      }>
        <div className="grid gap-3 sm:grid-cols-4">{[["Enrolled", `${selected.enrolled} / ${selected.maxStudents}`], ["Fill rate", `${Math.round(selected.enrolled / selected.maxStudents * 100)}%`], ["Price", money(selected.price)], ["Expected income", money(selected.enrolled * selected.price)]].map(([label, value]) => <div key={label} className="rounded-lg bg-muted p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 font-semibold">{value}</div></div>)}</div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2"><div><div className="text-sm font-semibold">Learning experience</div><div className="mt-2 text-sm leading-6 text-muted-foreground">{selected.description}</div><div className="mt-4 flex gap-2"><Badge variant="secondary">{selected.level}</Badge><Badge variant="secondary">{selected.published ? "Booking open" : "Draft"}</Badge></div></div><div><div className="flex items-center justify-between"><div className="text-sm font-semibold">Roster</div><Button size="sm"><Plus /> Add student</Button></div><div className="mt-3 space-y-2">{["Arjun Mehta", "Priya Sharma", "Rahul Singh"].slice(0, Math.min(3, selected.enrolled)).map((name, index) => <div key={name} className="flex items-center gap-3 rounded-lg border p-3"><div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-brand-text">{name[0]}</div><div className="flex-1 text-sm font-medium">{name}</div><StatusPill status={index === 2 ? "pending" : "confirmed"} /></div>)}</div></div></div>
      </DetailHeader>
      <SessionWizard key={editing?.id} open={wizardOpen} onOpenChange={setWizardOpen} initial={editing} onSave={save} />
      <DeleteDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)} entity="session" blockedReason={deleteBlockedReason} onConfirm={() => { if (deleteId !== null) setSessions((current) => current.filter((item) => item.id !== deleteId)); setDeleteId(null); setSelectedId(null); }} />
    </>
  );
  }
  return (
    <div className="min-h-full bg-background">
      <ManagementHeader eyebrow="Coach operations" title="Training sessions" description="Create dependable learning experiences, manage capacity, and keep every student informed." createLabel="Create session" onCreate={() => { setEditing(null); setWizardOpen(true); }} />
      <div className="mx-auto max-w-screen-2xl space-y-5 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={CalendarDays} label="Upcoming sessions" value={String(sessions.filter((item) => item.status === "upcoming").length)} note="Ready to deliver" /><Metric icon={Users} label="Reserved places" value={String(sessions.reduce((sum, item) => sum + item.enrolled, 0))} note="Across all sessions" /><Metric icon={UserCheck} label="Average fill rate" value="68%" note="8 points above last month" /><Metric icon={IndianRupee} label="Expected income" value={money(sessions.reduce((sum, item) => sum + item.enrolled * item.price, 0))} note="From current enrolments" /></div>
        <Card className="gap-0 overflow-hidden shadow-none"><SearchToolbar search={search} onSearch={setSearch} status={status} onStatus={setStatus} secondary={sport} onSecondary={setSport} secondaryLabel="All sports" /><ExportToolbar selectedRows={selectedRows} filteredIds={filtered.map((item) => item.id)} onClear={() => setSelectedRows(new Set())} onExport={() => exportCsv("coach-sessions.csv", (selectedRows.size ? filtered.filter((item) => selectedRows.has(item.id)) : filtered) as unknown as Record<string, unknown>[])} /><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead className="w-10"><Checkbox checked={filtered.length > 0 && filtered.every((item) => selectedRows.has(item.id))} onCheckedChange={(checked) => setSelectedRows(checked ? new Set(filtered.map((item) => item.id)) : new Set())} /></TableHead><TableHead>Session</TableHead><TableHead>Schedule</TableHead><TableHead>Venue</TableHead><TableHead>Enrolment</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead>Visibility</TableHead><TableHead /></TableRow></TableHeader><TableBody>{filtered.map((item) => <TableRow key={item.id} className="cursor-pointer" onClick={() => setSelectedId(item.id)}><TableCell onClick={(event) => event.stopPropagation()}><Checkbox checked={selectedRows.has(item.id)} onCheckedChange={(checked) => setSelectedRows((current) => { const next = new Set(current); checked ? next.add(item.id) : next.delete(item.id); return next; })} /></TableCell><TableCell><div className="flex min-w-64 items-center gap-3"><img src={item.image} alt="" className="size-11 rounded-md object-cover" /><div><div className="font-medium">{item.name}</div><div className="text-xs text-muted-foreground">{item.sport} · {item.level}</div></div></div></TableCell><TableCell><div>{item.date}</div><div className="text-xs text-muted-foreground">{item.time}</div></TableCell><TableCell>{item.venue}</TableCell><TableCell><div className="min-w-28"><div className="mb-1 flex justify-between text-xs"><span>{item.enrolled}/{item.maxStudents}</span><span>{Math.round(item.enrolled / item.maxStudents * 100)}%</span></div><Progress value={item.enrolled / item.maxStudents * 100} /></div></TableCell><TableCell className="font-medium">{money(item.price)}</TableCell><TableCell><StatusPill status={item.status} /></TableCell><TableCell>{item.published ? <Badge className="bg-primary">Open</Badge> : <Badge variant="secondary">Draft</Badge>}</TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); setEditing(item); setWizardOpen(true); }}><Edit3 /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={(event) => { event.stopPropagation(); setDeleteId(item.id); }}><Trash2 /></Button></div></TableCell></TableRow>)}{!filtered.length && <TableRow><TableCell colSpan={9} className="h-32 text-center text-muted-foreground">No sessions match the current search and filters.</TableCell></TableRow>}</TableBody></Table></div></Card>
      </div>
      <SessionWizard key={editing?.id ?? "new"} open={wizardOpen} onOpenChange={setWizardOpen} initial={editing} onSave={save} />
      <DeleteDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)} entity="session" blockedReason={(() => { const item = sessions.find((session) => session.id === deleteId); return item?.enrolled ? "This session has enrolled students and must be retained. Cancel and unpublish it so students can be notified and records remain auditable." : item?.published ? "Close booking and unpublish this session before deleting it." : undefined; })()} onConfirm={() => { if (deleteId !== null) setSessions((current) => current.filter((item) => item.id !== deleteId)); setDeleteId(null); }} />
    </div>
  );
}
