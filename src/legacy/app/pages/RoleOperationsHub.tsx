import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Edit3,
  Flag,
  MoreHorizontal,
  Plus,
  Search,
  Target,
  Trash2,
  TrendingUp,
  UserRoundCheck,
  Users,
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

type HubRole = "coach" | "organizer";
type Health = "on_track" | "attention" | "blocked" | "complete";

type JourneyRecord = {
  id: string;
  name: string;
  context: string;
  stage: string;
  health: Health;
  owner: string;
  nextAction: string;
  due: string;
  progress: number;
  commercialValue: number;
  engagement: number;
  notes: string;
  updatedAt: string;
};

const CONFIG = {
  coach: {
    eyebrow: "Coach operating system",
    title: "Clients, delivery and sustainable growth",
    description: "One client record from first enquiry to assessment, measurable progress, renewal, and referral.",
    noun: "client journey",
    plural: "clients",
    tabs: [
      { id: "overview", label: "Command center" },
      { id: "pipeline", label: "Clients & pipeline" },
      { id: "delivery", label: "Delivery & progress" },
      { id: "outcomes", label: "Reviews & renewals" },
    ],
    stages: ["New enquiry", "Trial booked", "Assessment", "Active program", "Review due", "Renewal due", "Alumni"],
    contexts: ["Private · Badminton", "Group · Tennis", "Academy · Football", "Online · Strength"],
    journey: [
      { title: "Acquire", detail: "Enquiry source, response SLA, trial and conversion" },
      { title: "Assess", detail: "Goals, baseline, constraints and informed consent" },
      { title: "Deliver", detail: "Schedule, attendance, plan, notes and workload" },
      { title: "Prove", detail: "Milestones, evidence, feedback and review" },
      { title: "Retain", detail: "Renewal, referral, pause and win-back" },
    ],
  },
  organizer: {
    eyebrow: "Tournament operating system",
    title: "Portfolio, participants and live event control",
    description: "One event record from commercial validation to safe delivery, verified results, settlement, and learning.",
    noun: "event",
    plural: "events",
    tabs: [
      { id: "overview", label: "Command center" },
      { id: "pipeline", label: "Event portfolio" },
      { id: "delivery", label: "Participants & control" },
      { id: "outcomes", label: "Results & closeout" },
    ],
    stages: ["Concept", "Draft", "Registration", "Event ready", "Live", "Reconciliation", "Complete"],
    contexts: ["128 players · Knockout", "64 players · Group + KO", "16 teams · League", "48 players · Round robin"],
    journey: [
      { title: "Validate", detail: "Audience, format, budget, venue and sanctioning" },
      { title: "Launch", detail: "Listing, registration, eligibility and payments" },
      { title: "Prepare", detail: "Seeding, schedule, suppliers, safety and comms" },
      { title: "Operate", detail: "Check-in, incidents, scoring and live results" },
      { title: "Close", detail: "Payouts, refunds, reports, NPS and next event" },
    ],
  },
} as const;

const HEALTH: Record<Health, { label: string; className: string }> = {
  on_track: { label: "On track", className: "border-sky-200 bg-sky-50 text-sky-700" },
  attention: { label: "Needs attention", className: "border-amber-200 bg-amber-50 text-amber-700" },
  blocked: { label: "Blocked", className: "border-red-200 bg-red-50 text-red-700" },
  complete: { label: "Complete", className: "border-blue-200 bg-blue-50 text-blue-700" },
};

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

function blankRecord(role: HubRole): JourneyRecord {
  const config = CONFIG[role];
  return {
    id: uid(),
    name: "",
    context: config.contexts[0],
    stage: config.stages[0],
    health: "on_track",
    owner: "",
    nextAction: "",
    due: "",
    progress: 0,
    commercialValue: 0,
    engagement: 0,
    notes: "",
    updatedAt: now(),
  };
}

function seedRecords(role: HubRole): JourneyRecord[] {
  if (role === "coach") {
    return [
      { id: "c1", name: "Arjun Mehta", context: "Monthly Elite · Badminton", stage: "Active program", health: "on_track", owner: "Rajesh", nextAction: "Movement review", due: "Today, 07:00", progress: 78, commercialValue: 6400, engagement: 92, notes: "Tournament in four weeks. Prioritise rear-court recovery.", updatedAt: "Today, 08:20" },
      { id: "c2", name: "Mira Rao", context: "Trial · Tennis", stage: "Trial booked", health: "attention", owner: "Rajesh", nextAction: "Send readiness form", due: "Today, 16:30", progress: 35, commercialValue: 1200, engagement: 64, notes: "Parent needs schedule clarity before committing.", updatedAt: "Today, 07:45" },
      { id: "c3", name: "Kabir Shah", context: "Foundation · Football", stage: "Renewal due", health: "attention", owner: "Rajesh", nextAction: "Guardian review", due: "Tomorrow, 18:00", progress: 62, commercialValue: 4800, engagement: 76, notes: "Share attendance and skill trend before renewal call.", updatedAt: "Yesterday" },
      { id: "c4", name: "Ananya Sen", context: "Private · Badminton", stage: "Assessment", health: "blocked", owner: "Assistant", nextAction: "Complete mobility screen", due: "22 Jul", progress: 20, commercialValue: 2400, engagement: 45, notes: "Awaiting screening and medical declaration.", updatedAt: "16 Jul" },
      { id: "c5", name: "Dev Nair", context: "Performance · Tennis", stage: "Review due", health: "on_track", owner: "Rajesh", nextAction: "Match simulation", due: "24 Jul", progress: 91, commercialValue: 7200, engagement: 96, notes: "Prepare next-cycle goals and renewal options.", updatedAt: "15 Jul" },
    ];
  }
  return [
    { id: "o1", name: "Bangalore Badminton Open", context: "128 players · Knockout", stage: "Event ready", health: "on_track", owner: "Nisha", nextAction: "Freeze seeding", due: "Today, 18:00", progress: 84, commercialValue: 184000, engagement: 96, notes: "Two medical declarations pending.", updatedAt: "Today, 09:10" },
    { id: "o2", name: "City Tennis Championship", context: "64 players · Group + KO", stage: "Registration", health: "attention", owner: "Aman", nextAction: "Clear waitlist", due: "Tomorrow, 12:00", progress: 61, commercialValue: 128000, engagement: 78, notes: "Women’s open has six waitlisted players.", updatedAt: "Today, 08:30" },
    { id: "o3", name: "Corporate Football League", context: "16 teams · League", stage: "Draft", health: "blocked", owner: "Nisha", nextAction: "Confirm referees", due: "22 Jul", progress: 46, commercialValue: 312000, engagement: 58, notes: "Second referee vendor has not accepted rate card.", updatedAt: "Yesterday" },
    { id: "o4", name: "Junior Table Tennis Cup", context: "48 players · Round robin", stage: "Concept", health: "attention", owner: "Aman", nextAction: "Approve safeguarding", due: "25 Jul", progress: 28, commercialValue: 72000, engagement: 42, notes: "Guardian consent and pickup controls required.", updatedAt: "16 Jul" },
    { id: "o5", name: "Monsoon Padel Series", context: "32 pairs · League", stage: "Reconciliation", health: "complete", owner: "Finance", nextAction: "Release payouts", due: "29 Jul", progress: 94, commercialValue: 96000, engagement: 89, notes: "Results published. Sponsor invoice remains open.", updatedAt: "15 Jul" },
  ];
}

function RecordDialog({ open, onOpenChange, value, role, records, onSave }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: JourneyRecord | null;
  role: HubRole;
  records: JourneyRecord[];
  onSave: (record: JourneyRecord) => void;
}) {
  const config = CONFIG[role];
  const [form, setForm] = useState(() => value ?? blankRecord(role));
  const [errors, setErrors] = useState<string[]>([]);
  useEffect(() => {
    setForm(value ? structuredClone(value) : blankRecord(role));
    setErrors([]);
  }, [value, open, role]);
  const save = () => {
    const nextErrors: string[] = [];
    if (!form.name.trim()) nextErrors.push(`${role === "coach" ? "Client" : "Event"} name is required.`);
    if (!form.owner.trim()) nextErrors.push("Assign an accountable owner.");
    if (!form.nextAction.trim()) nextErrors.push("Define the next best action.");
    if (!form.due.trim()) nextErrors.push("Set a due date or time.");
    if (form.progress < 0 || form.progress > 100) nextErrors.push("Progress must be between 0 and 100.");
    if (form.engagement < 0 || form.engagement > 100) nextErrors.push(`${role === "coach" ? "Engagement" : "Registration health"} must be between 0 and 100.`);
    if (form.commercialValue < 0) nextErrors.push("Commercial value cannot be negative.");
    if (records.some((record) => record.id !== form.id && record.name.toLowerCase() === form.name.trim().toLowerCase())) nextErrors.push(`A ${config.noun} with this name already exists.`);
    if (nextErrors.length) return setErrors(nextErrors);
    onSave({ ...form, updatedAt: now() });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader><DialogTitle>{value ? `Edit ${value.name}` : `Add ${config.noun}`}</DialogTitle><DialogDescription>Keep operational context, accountability, risk, and commercial value in one record.</DialogDescription></DialogHeader>
        {errors.length > 0 && <Alert variant="destructive"><AlertTriangle /><AlertTitle>Resolve these issues</AlertTitle><AlertDescription><div className="space-y-1">{errors.map((error) => <div key={error}>{error}</div>)}</div></AlertDescription></Alert>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2"><Label htmlFor="journey-name">{role === "coach" ? "Client name" : "Event name"}</Label><Input id="journey-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
          <div className="space-y-2"><Label>Context</Label><Select value={form.context} onValueChange={(context) => setForm({ ...form, context })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{config.contexts.map((context) => <SelectItem key={context} value={context}>{context}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Lifecycle stage</Label><Select value={form.stage} onValueChange={(stage) => setForm({ ...form, stage })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{config.stages.map((stage) => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Health</Label><Select value={form.health} onValueChange={(health: Health) => setForm({ ...form, health })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(HEALTH).map(([key, item]) => <SelectItem key={key} value={key}>{item.label}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label htmlFor="journey-owner">Owner</Label><Input id="journey-owner" value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="journey-action">Next best action</Label><Input id="journey-action" value={form.nextAction} onChange={(event) => setForm({ ...form, nextAction: event.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="journey-due">Due</Label><Input id="journey-due" value={form.due} onChange={(event) => setForm({ ...form, due: event.target.value })} placeholder="e.g. 24 Jul, 16:00" /></div>
          <div className="space-y-2"><Label htmlFor="journey-progress">Progress %</Label><Input id="journey-progress" type="number" min="0" max="100" value={form.progress} onChange={(event) => setForm({ ...form, progress: Number(event.target.value) })} /></div>
          <div className="space-y-2"><Label htmlFor="journey-engagement">{role === "coach" ? "Engagement %" : "Registration health %"}</Label><Input id="journey-engagement" type="number" min="0" max="100" value={form.engagement} onChange={(event) => setForm({ ...form, engagement: Number(event.target.value) })} /></div>
          <div className="space-y-2 sm:col-span-2"><Label htmlFor="journey-value">Commercial value</Label><Input id="journey-value" type="number" min="0" value={form.commercialValue} onChange={(event) => setForm({ ...form, commercialValue: Number(event.target.value) })} /></div>
          <div className="space-y-2 sm:col-span-2"><Label htmlFor="journey-notes">Context, risks, and handoff notes</Label><Textarea id="journey-notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={save}>Save record</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Metric({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: typeof Users }) {
  return <Card className="gap-0"><CardContent className="flex items-start justify-between p-5"><div><div className="text-sm text-muted-foreground">{label}</div><div className="mt-2 text-2xl font-semibold">{value}</div><div className="mt-1 text-xs text-muted-foreground">{note}</div></div><div className="rounded-lg bg-primary/10 p-2 text-brand-text"><Icon /></div></CardContent></Card>;
}

function JourneyTable({ records, role, selected, onSelected, onEdit, onDuplicate, onComplete, onDelete }: {
  records: JourneyRecord[];
  role: HubRole;
  selected: Set<string>;
  onSelected: (selected: Set<string>) => void;
  onEdit: (record: JourneyRecord) => void;
  onDuplicate: (record: JourneyRecord) => void;
  onComplete: (record: JourneyRecord) => void;
  onDelete: (record: JourneyRecord) => void;
}) {
  return (
    <Table>
      <TableHeader><TableRow><TableHead className="w-10"><Checkbox checked={records.length > 0 && records.every((record) => selected.has(record.id))} onCheckedChange={(checked) => onSelected(checked ? new Set(records.map((record) => record.id)) : new Set())} /></TableHead><TableHead>{role === "coach" ? "Client" : "Event"}</TableHead><TableHead>Lifecycle</TableHead><TableHead>Next commitment</TableHead><TableHead>Progress</TableHead><TableHead>Value</TableHead><TableHead>Health</TableHead><TableHead className="w-12" /></TableRow></TableHeader>
      <TableBody>{records.map((record) => <TableRow key={record.id}>
        <TableCell><Checkbox checked={selected.has(record.id)} onCheckedChange={(checked) => { const next = new Set(selected); checked ? next.add(record.id) : next.delete(record.id); onSelected(next); }} /></TableCell>
        <TableCell><div className="font-medium">{record.name}</div><div className="text-xs text-muted-foreground">{record.context}</div></TableCell>
        <TableCell><div>{record.stage}</div><div className="text-xs text-muted-foreground">Owner: {record.owner}</div></TableCell>
        <TableCell><div className="font-medium">{record.nextAction}</div><div className="flex items-center gap-1 text-xs text-muted-foreground"><CalendarClock />{record.due}</div></TableCell>
        <TableCell><div className="flex min-w-28 items-center gap-2"><Progress value={record.progress} /><span className="text-xs">{record.progress}%</span></div><div className="mt-1 text-xs text-muted-foreground">{role === "coach" ? "Engagement" : "Demand"} {record.engagement}%</div></TableCell>
        <TableCell className="font-medium">{money(record.commercialValue)}</TableCell>
        <TableCell><Badge variant="outline" className={HEALTH[record.health].className}>{HEALTH[record.health].label}</Badge></TableCell>
        <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /><span className="sr-only">Record actions</span></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => onEdit(record)}><Edit3 />Edit record</DropdownMenuItem><DropdownMenuItem onClick={() => onComplete(record)}><CheckCircle2 />Mark complete</DropdownMenuItem><DropdownMenuItem onClick={() => onDuplicate(record)}><Copy />Duplicate</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem variant="destructive" onClick={() => onDelete(record)}><Trash2 />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell>
      </TableRow>)}</TableBody>
    </Table>
  );
}

function OperationsHub({ role }: { role: HubRole }) {
  const config = CONFIG[role];
  const storageKey = `inspirq-${role}-operations-v1`;
  const [records, setRecords] = useState<JourneyRecord[]>(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : seedRecords(role);
    } catch {
      return seedRecords(role);
    }
  });
  const [search, setSearch] = useState("");
  const [health, setHealth] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<JourneyRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<JourneyRecord | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(records));
    } catch {
      setNotice("Browser storage is unavailable; changes will last for this session only.");
    }
  }, [records, storageKey]);

  const filtered = useMemo(() => records.filter((record) => {
    const query = `${record.name} ${record.context} ${record.stage} ${record.nextAction} ${record.owner}`.toLowerCase();
    return query.includes(search.toLowerCase()) && (health === "all" || record.health === health);
  }), [records, search, health]);
  const atRisk = records.filter((record) => record.health === "attention" || record.health === "blocked");
  const readiness = records.length ? Math.round(records.reduce((sum, record) => sum + record.progress, 0) / records.length) : 0;
  const value = records.filter((record) => record.health !== "complete").reduce((sum, record) => sum + record.commercialValue, 0);

  const save = (record: JourneyRecord) => {
    setRecords((current) => current.some((item) => item.id === record.id) ? current.map((item) => item.id === record.id ? record : item) : [record, ...current]);
    setDialogOpen(false);
    setNotice(`${config.noun[0].toUpperCase()}${config.noun.slice(1)} saved.`);
  };
  const duplicate = (record: JourneyRecord) => {
    setRecords((current) => [{ ...structuredClone(record), id: uid(), name: `${record.name} copy`, health: "attention", progress: 0, updatedAt: now() }, ...current]);
    setNotice("A review-required duplicate was created.");
  };
  const complete = (record: JourneyRecord) => setRecords((current) => current.map((item) => item.id === record.id ? { ...item, health: "complete", progress: 100, stage: config.stages[config.stages.length - 1], updatedAt: now() } : item));
  const stageRecords = (tab: string) => {
    if (tab === "pipeline") return filtered.filter((record) => config.stages.indexOf(record.stage as never) <= 2);
    if (tab === "delivery") return filtered.filter((record) => config.stages.indexOf(record.stage as never) >= 2 && config.stages.indexOf(record.stage as never) <= 4);
    if (tab === "outcomes") return filtered.filter((record) => config.stages.indexOf(record.stage as never) >= 4);
    return filtered;
  };

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 py-1 sm:flex-row sm:items-center sm:justify-between"><div className="text-3xl font-semibold">{config.title}</div><Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus />Add {config.noun}</Button></div>
      {notice && <Alert><CheckCircle2 /><AlertTitle>Workspace updated</AlertTitle><AlertDescription className="flex items-center justify-between gap-3"><span>{notice}</span><Button variant="ghost" size="sm" onClick={() => setNotice("")}>Dismiss</Button></AlertDescription></Alert>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Metric label={role === "coach" ? "Active relationships" : "Portfolio"} value={String(records.length)} note="Across the full lifecycle" icon={Users} /><Metric label="Operational readiness" value={`${readiness}%`} note="Average progress across work" icon={ClipboardCheck} /><Metric label="Needs intervention" value={String(atRisk.length)} note="Risk, delay, or dependency" icon={AlertTriangle} /><Metric label="Open commercial value" value={money(value)} note="Pipeline and committed value" icon={TrendingUp} /></div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <Card className="gap-0"><CardContent className="p-5"><div className="mb-5"><div className="font-semibold">Lifecycle that matches the real job</div><div className="mt-1 text-sm text-muted-foreground">Every step keeps customer experience and business viability visible together.</div></div><div className="grid gap-3 md:grid-cols-5">{config.journey.map((item, index) => <div key={item.title} className="rounded-lg border p-4"><div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-brand-text">{index + 1}</div><div className="mt-3 text-sm font-medium">{item.title}</div><div className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.detail}</div></div>)}</div></CardContent></Card>
        <Card className="gap-0"><CardContent className="p-5"><div className="flex items-start justify-between"><div><div className="font-semibold">Intervention queue</div><div className="mt-1 text-sm text-muted-foreground">Act before trust or revenue erodes</div></div><Badge variant={atRisk.length ? "destructive" : "secondary"}>{atRisk.length} open</Badge></div><div className="mt-4 space-y-2">{atRisk.slice(0, 3).map((record) => <Button key={record.id} variant="ghost" className="h-auto w-full justify-between px-2 py-3 text-left" onClick={() => { setEditing(record); setDialogOpen(true); }}><div><div className="text-sm font-medium">{record.name}</div><div className="mt-1 text-xs font-normal text-muted-foreground">{record.nextAction} · {record.due}</div></div><Flag className={record.health === "blocked" ? "text-destructive" : "text-amber-600"} /></Button>)}{atRisk.length === 0 && <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">Nothing needs immediate intervention.</div>}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="h-auto flex-wrap">{config.tabs.map((tab) => <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>)}</TabsList>
        {config.tabs.map((tab) => {
          const visible = stageRecords(tab.id);
          return <TabsContent key={tab.id} value={tab.id} className="mt-4"><Card className="gap-0 overflow-hidden"><CardContent className="p-0"><div className="border-b p-4"><div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div><div className="font-semibold">{tab.label}</div><div className="mt-1 text-sm text-muted-foreground">{visible.length} records · next actions, ownership, risk, outcome, and value in one view</div></div>{selected.size > 0 && <div className="flex items-center gap-2"><Badge variant="secondary">{selected.size} selected</Badge><Button variant="outline" size="sm" onClick={() => { setRecords((current) => current.map((record) => selected.has(record.id) ? { ...record, health: "on_track" } : record)); setSelected(new Set()); setNotice("Selected records marked on track."); }}><CheckCircle2 />Mark on track</Button></div>}</div><div className="flex flex-col gap-2 lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 text-muted-foreground" /><Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${config.plural}, stages, owners, or actions`} /></div><Select value={health} onValueChange={setHealth}><SelectTrigger className="lg:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All health states</SelectItem>{Object.entries(HEALTH).map(([key, item]) => <SelectItem key={key} value={key}>{item.label}</SelectItem>)}</SelectContent></Select></div></div><JourneyTable records={visible} role={role} selected={selected} onSelected={setSelected} onEdit={(record) => { setEditing(record); setDialogOpen(true); }} onDuplicate={duplicate} onComplete={complete} onDelete={setDeleting} />{visible.length === 0 && <div className="p-12 text-center"><Target className="mx-auto text-muted-foreground" /><div className="mt-3 font-medium">No records in this stage</div><div className="mt-1 text-sm text-muted-foreground">Adjust filters or add a new {config.noun}.</div></div>}</CardContent></Card></TabsContent>;
        })}
      </Tabs>

      <RecordDialog open={dialogOpen} onOpenChange={setDialogOpen} value={editing} role={role} records={records} onSave={save} />
      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete this {config.noun}?</AlertDialogTitle><AlertDialogDescription>This removes the operational history from this workspace. Completed financial documents remain in their dedicated business modules.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { if (deleting) setRecords((current) => current.filter((record) => record.id !== deleting.id)); setDeleting(null); setNotice("Record deleted."); }}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}

export function CoachOperationsHub() { return <OperationsHub role="coach" />; }
export function OrganizerOperationsHub() { return <OperationsHub role="organizer" />; }
