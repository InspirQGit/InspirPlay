import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  IndianRupee,
  MessageSquare,
  Plus,
  Search,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import type { Page } from "../data";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
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

type CoachProgram = {
  id: number;
  student: string;
  sport: string;
  goal: string;
  level: string;
  packageName: string;
  sessionsUsed: number;
  sessionsTotal: number;
  progress: number;
  attendance: number;
  nextSession: string;
  reviewDue: string;
  balance: number;
  status: "active" | "at_risk" | "paused" | "completed";
  baseline: number;
  target: number;
  current: number;
  milestones: { label: string; complete: boolean }[];
};

const INITIAL_PROGRAMS: CoachProgram[] = [
  {
    id: 1,
    student: "Arjun Mehta",
    sport: "Badminton",
    goal: "Tournament readiness",
    level: "Advanced",
    packageName: "Monthly Elite",
    sessionsUsed: 9,
    sessionsTotal: 16,
    progress: 78,
    attendance: 92,
    nextSession: "19 Jul, 07:00",
    reviewDue: "24 Jul",
    balance: 0,
    status: "active",
    baseline: 48,
    current: 78,
    target: 88,
    milestones: [
      { label: "Consistent split-step timing", complete: true },
      { label: "Recover to base after rear-court shots", complete: true },
      { label: "Maintain movement quality in deciding game", complete: false },
    ],
  },
  {
    id: 2,
    student: "Priya Sharma",
    sport: "Tennis",
    goal: "Improve serve consistency",
    level: "Intermediate",
    packageName: "Starter Pack",
    sessionsUsed: 7,
    sessionsTotal: 8,
    progress: 64,
    attendance: 88,
    nextSession: "20 Jul, 17:00",
    reviewDue: "20 Jul",
    balance: 1500,
    status: "at_risk",
    baseline: 36,
    current: 64,
    target: 80,
    milestones: [
      { label: "Repeatable ball toss", complete: true },
      { label: "Second serve above 70% in practice", complete: false },
      { label: "Transfer technique into match play", complete: false },
    ],
  },
  {
    id: 3,
    student: "Rahul Singh",
    sport: "Badminton",
    goal: "State ranking preparation",
    level: "Competitive",
    packageName: "Intensive Pro",
    sessionsUsed: 14,
    sessionsTotal: 24,
    progress: 86,
    attendance: 96,
    nextSession: "21 Jul, 07:00",
    reviewDue: "02 Aug",
    balance: 0,
    status: "active",
    baseline: 62,
    current: 86,
    target: 92,
    milestones: [
      { label: "Complete technical benchmark", complete: true },
      { label: "Win three match-scenario blocks", complete: true },
      { label: "Competition taper completed", complete: false },
    ],
  },
  {
    id: 4,
    student: "Divya Nair",
    sport: "Tennis",
    goal: "Return to play",
    level: "Beginner",
    packageName: "Trial Pack",
    sessionsUsed: 2,
    sessionsTotal: 2,
    progress: 42,
    attendance: 67,
    nextSession: "Not scheduled",
    reviewDue: "Overdue",
    balance: 900,
    status: "paused",
    baseline: 30,
    current: 42,
    target: 70,
    milestones: [
      { label: "Pain-free movement assessment", complete: true },
      { label: "Complete controlled rally", complete: false },
      { label: "Return to group session", complete: false },
    ],
  },
];

const TODAY = [
  { time: "07:00", name: "Advanced Footwork Clinic", context: "8 students · Court Masters", state: "Ready" },
  { time: "10:00", name: "Arjun Mehta · Private", context: "Tournament program · Court 2", state: "Prepare" },
  { time: "16:00", name: "Maya Menon · Trial", context: "Consent pending · Court 1", state: "Action" },
  { time: "18:30", name: "Priya Sharma · Review", context: "Online · Package renewal", state: "Ready" },
];

const ACTIONS = [
  { title: "3 consent forms are incomplete", note: "Required before upcoming youth sessions", page: "trainer-students" as Page, tone: "warning" },
  { title: "2 packages have one session remaining", note: "Review progress before sending renewal", page: "trainer-programs" as Page, tone: "warning" },
  { title: "4 session reports need closure", note: "Attendance and package usage are not final", page: "trainer-sessions" as Page, tone: "default" },
  { title: "5 enquiries need a next action", note: "Oldest follow-up has been waiting for two days", page: "trainer-leads" as Page, tone: "default" },
];

function Header({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-2xl font-semibold tracking-tight">{title}</div>
        {action}
      </div>
    </div>
  );
}

function Metric({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: typeof Users }) {
  return (
    <Card className="gap-0 shadow-none">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <div className="text-xs font-medium text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-semibold">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{note}</div>
        </div>
        <div className="rounded-lg bg-primary/10 p-2.5 text-brand-text"><Icon className="size-5" /></div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ value }: { value: CoachProgram["status"] }) {
  const className = value === "active"
    ? "border-sky-200 bg-sky-50 text-sky-700"
    : value === "at_risk"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-border bg-muted text-muted-foreground";
  return <Badge variant="outline" className={className}>{value.replace("_", " ")}</Badge>;
}

export function CoachCommandCenter({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="min-h-full bg-background">
      <Header
        eyebrow="Coach command center"
        title="Today’s coaching operations"
        description="Deliver every session prepared, resolve business exceptions early, and keep student progress moving."
        action={<Button onClick={() => onNavigate("trainer-sessions")}><Plus /> Create session</Button>}
      />
      <div className="mx-auto max-w-screen-2xl space-y-6 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Active students" value="42" note="4 need attention" icon={Users} />
          <Metric label="Sessions this week" value="18 / 21" note="3 remaining today" icon={CalendarDays} />
          <Metric label="Collection due" value="₹12,400" note="Across 6 students" icon={IndianRupee} />
          <Metric label="Reports completed" value="14 / 18" note="4 sessions need closure" icon={FileCheck2} />
        </div>

        <div className="grid gap-5 xl:grid-cols-5">
          <Card className="gap-0 shadow-none xl:col-span-3">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <div className="font-semibold">Today’s delivery plan</div>
                <div className="text-xs text-muted-foreground">Readiness includes roster, consent, venue, and coaching plan</div>
              </div>
              <Button variant="outline" size="sm" onClick={() => onNavigate("trainer-schedule")}>Full calendar <ChevronRight /></Button>
            </div>
            <div className="divide-y">
              {TODAY.map((session) => (
                <div key={`${session.time}-${session.name}`} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-semibold">{session.time}</div>
                  <div className="flex-1">
                    <div className="font-medium">{session.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{session.context}</div>
                  </div>
                  <Badge variant={session.state === "Ready" ? "secondary" : "outline"} className={session.state === "Action" ? "border-amber-200 bg-amber-50 text-amber-700" : ""}>{session.state}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => onNavigate("trainer-sessions")}>Open <ChevronRight /></Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="gap-0 shadow-none xl:col-span-2">
            <div className="border-b px-5 py-4">
              <div className="font-semibold">Requires action</div>
              <div className="text-xs text-muted-foreground">Operational exceptions ordered by urgency</div>
            </div>
            <div className="divide-y">
              {ACTIONS.map((action) => (
                <Button
                  key={action.title}
                  variant="ghost"
                  className="h-auto w-full justify-start rounded-none px-5 py-4 text-left"
                  onClick={() => onNavigate(action.page)}
                >
                  <div className={`rounded-lg p-2 ${action.tone === "warning" ? "bg-amber-50 text-amber-700" : "bg-primary/10 text-brand-text"}`}>
                    {action.tone === "warning" ? <AlertTriangle className="size-4" /> : <CheckCircle2 className="size-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="whitespace-normal text-sm font-medium">{action.title}</div>
                    <div className="mt-1 whitespace-normal text-xs font-normal text-muted-foreground">{action.note}</div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Button>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="gap-0 shadow-none lg:col-span-2">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <div className="font-semibold">Student momentum</div>
                <div className="text-xs text-muted-foreground">Programs due for review, renewal, or re-engagement</div>
              </div>
              <Button variant="outline" size="sm" onClick={() => onNavigate("trainer-programs")}>View programs <ChevronRight /></Button>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Goal</TableHead><TableHead>Progress</TableHead><TableHead>Package</TableHead><TableHead>Next action</TableHead></TableRow></TableHeader>
              <TableBody>
                {INITIAL_PROGRAMS.slice(0, 3).map((program) => (
                  <TableRow key={program.id}>
                    <TableCell><div className="font-medium">{program.student}</div><div className="text-xs text-muted-foreground">{program.sport}</div></TableCell>
                    <TableCell>{program.goal}</TableCell>
                    <TableCell><div className="min-w-28"><div className="mb-1 flex justify-between text-xs"><span>{program.progress}%</span><span>{program.status === "at_risk" ? "At risk" : "On track"}</span></div><Progress value={program.progress} /></div></TableCell>
                    <TableCell>{program.sessionsUsed}/{program.sessionsTotal} used</TableCell>
                    <TableCell className="font-medium text-brand-text">{program.reviewDue === "Overdue" ? "Review overdue" : `Review ${program.reviewDue}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className="gap-0 shadow-none">
            <div className="border-b px-5 py-4">
              <div className="font-semibold">Business health</div>
              <div className="text-xs text-muted-foreground">Current month operating signals</div>
            </div>
            <CardContent className="space-y-5 p-5">
              {[
                ["Session fill rate", "71%", 71],
                ["Student retention", "84%", 84],
                ["Trial conversion", "46%", 46],
                ["Payment collection", "89%", 89],
              ].map(([label, value, progress]) => (
                <div key={label as string}>
                  <div className="mb-2 flex justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{value}</span></div>
                  <Progress value={progress as number} />
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={() => onNavigate("trainer-revenue")}><TrendingUp /> Open analytics</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProgramWizard({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (open: boolean) => void; onSave: (program: CoachProgram) => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    student: "",
    sport: "Badminton",
    level: "Beginner",
    goal: "",
    baseline: "40",
    target: "75",
    packageName: "Starter Pack",
    sessionsTotal: "8",
    nextSession: "",
    reviewDue: "",
    milestones: "",
  });
  const steps = ["Student & goal", "Plan & package", "Milestones", "Review"];
  const save = () => {
    onSave({
      id: Date.now(),
      student: form.student,
      sport: form.sport,
      level: form.level,
      goal: form.goal,
      packageName: form.packageName,
      sessionsUsed: 0,
      sessionsTotal: Number(form.sessionsTotal) || 1,
      progress: Number(form.baseline) || 0,
      attendance: 100,
      nextSession: form.nextSession || "Not scheduled",
      reviewDue: form.reviewDue || "Not scheduled",
      balance: 0,
      status: "active",
      baseline: Number(form.baseline) || 0,
      current: Number(form.baseline) || 0,
      target: Number(form.target) || 100,
      milestones: form.milestones.split("\n").map((label) => label.trim()).filter(Boolean).map((label) => ({ label, complete: false })),
    });
    onOpenChange(false);
    setStep(0);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create coaching program</DialogTitle>
          <DialogDescription>Connect the student’s goal, development plan, package, milestones, and review cadence.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            {steps.map((label, index) => (
              <div key={label} className={`flex items-center gap-2 text-xs font-medium ${index <= step ? "text-brand-text" : "text-muted-foreground"}`}>
                <span className={`flex size-6 items-center justify-center rounded-full border ${index < step ? "border-primary bg-primary text-primary-foreground" : index === step ? "border-primary bg-primary/10" : "border-border bg-muted"}`}>{index < step ? <Check className="size-3" /> : index + 1}</span>
                <span className="hidden sm:inline">{label}</span>
              </div>
            ))}
          </div>
          <Progress value={(step + 1) * 25} className="h-1.5" />
        </div>
        <div className="min-h-72 py-2">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2"><Label>Student</Label><Input value={form.student} onChange={(event) => setForm({ ...form, student: event.target.value })} placeholder="Student name" /></div>
              <div className="space-y-2"><Label>Sport</Label><Select value={form.sport} onValueChange={(sport) => setForm({ ...form, sport })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Badminton", "Tennis", "Football", "Fitness", "Cricket"].map((sport) => <SelectItem key={sport} value={sport}>{sport}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Current level</Label><Select value={form.level} onValueChange={(level) => setForm({ ...form, level })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Beginner", "Intermediate", "Advanced", "Competitive"].map((level) => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2 sm:col-span-2"><Label>Primary coaching goal</Label><Textarea value={form.goal} onChange={(event) => setForm({ ...form, goal: event.target.value })} placeholder="Define a specific outcome the student wants to achieve." /></div>
              <div className="space-y-2"><Label>Baseline score</Label><Input type="number" value={form.baseline} onChange={(event) => setForm({ ...form, baseline: event.target.value })} /></div>
              <div className="space-y-2"><Label>Target score</Label><Input type="number" value={form.target} onChange={(event) => setForm({ ...form, target: event.target.value })} /></div>
            </div>
          )}
          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2"><Label>Package</Label><Select value={form.packageName} onValueChange={(packageName) => setForm({ ...form, packageName })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Trial Pack", "Starter Pack", "Monthly Elite", "Intensive Pro", "Pay as you go"].map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Included sessions</Label><Input type="number" value={form.sessionsTotal} onChange={(event) => setForm({ ...form, sessionsTotal: event.target.value })} /></div>
              <div className="space-y-2"><Label>First session</Label><Input type="date" value={form.nextSession} onChange={(event) => setForm({ ...form, nextSession: event.target.value })} /></div>
              <div className="space-y-2 sm:col-span-2"><Label>Progress review date</Label><Input type="date" value={form.reviewDue} onChange={(event) => setForm({ ...form, reviewDue: event.target.value })} /></div>
              <Alert className="sm:col-span-2"><CalendarDays /><AlertTitle>Review before renewal</AlertTitle><AlertDescription>Schedule the progress review before the package ends so the next recommendation is based on evidence.</AlertDescription></Alert>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Milestones</Label><Textarea rows={7} value={form.milestones} onChange={(event) => setForm({ ...form, milestones: event.target.value })} placeholder={"One measurable milestone per line\nExample: Complete 20-shot rally with consistent technique"} /></div>
              <Alert><Target /><AlertTitle>Make progress observable</AlertTitle><AlertDescription>Use behaviors, scores, or demonstrated skills rather than broad labels such as “improve technique.”</AlertDescription></Alert>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <Card className="gap-0 shadow-none"><CardContent className="p-5"><div className="flex items-start gap-3"><UserCheck className="mt-0.5 size-5 text-brand-text" /><div><div className="font-semibold">{form.student || "Student required"}</div><div className="mt-1 text-sm text-muted-foreground">{form.sport} · {form.level} · {form.packageName}</div><div className="mt-3 text-sm">{form.goal || "Add a clear coaching goal before creating this program."}</div></div></div></CardContent></Card>
              <div className="grid gap-3 sm:grid-cols-3">{[["Baseline", form.baseline], ["Target", form.target], ["Milestones", String(form.milestones.split("\n").filter(Boolean).length)]].map(([label, value]) => <div key={label} className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 font-semibold">{value}</div></div>)}</div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => step === 0 ? onOpenChange(false) : setStep(step - 1)}>{step === 0 ? "Cancel" : "Back"}</Button>
          <Button disabled={step === 0 && (!form.student || !form.goal)} onClick={() => step < 3 ? setStep(step + 1) : save()}>{step < 3 ? <>Continue <ArrowRight /></> : <><CheckCircle2 /> Create program</>}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CoachProgramsWorkspace() {
  const [programs, setPrograms] = useState(INITIAL_PROGRAMS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const selected = programs.find((program) => program.id === selectedId) ?? null;
  const filtered = useMemo(() => programs.filter((program) => {
    const query = search.toLowerCase();
    return `${program.student} ${program.goal} ${program.sport}`.toLowerCase().includes(query) && (status === "all" || program.status === status);
  }), [programs, search, status]);

  if (selected) {
    const packageProgress = Math.round((selected.sessionsUsed / selected.sessionsTotal) * 100);
    return (
      <div className="min-h-full bg-background">
        <div className="border-b bg-card px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3">
            <Button variant="ghost" onClick={() => setSelectedId(null)}><ArrowLeft /> Back to programs</Button>
            <div className="flex gap-2"><Button variant="outline"><MessageSquare /> Message</Button><Button><CalendarDays /> Book session</Button></div>
          </div>
        </div>
        <div className="mx-auto max-w-screen-2xl space-y-5 p-4 sm:p-6">
          <Card className="gap-0 shadow-none">
            <CardContent className="p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-brand-text">{selected.student[0]}</div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><div className="text-2xl font-semibold">{selected.student}</div><StatusBadge value={selected.status} /></div>
                    <div className="mt-1 text-sm text-muted-foreground">{selected.sport} · {selected.level} · {selected.packageName}</div>
                    <div className="mt-3 flex items-center gap-2 text-sm"><Target className="size-4 text-brand-text" /><span className="font-medium">{selected.goal}</span></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[["Progress", `${selected.progress}%`], ["Attendance", `${selected.attendance}%`], ["Package", `${selected.sessionsUsed}/${selected.sessionsTotal}`], ["Balance", selected.balance ? `₹${selected.balance}` : "Paid"]].map(([label, value]) => <div key={label} className="min-w-28 rounded-lg bg-muted p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 font-semibold">{value}</div></div>)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview">
            <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="progress">Progress</TabsTrigger><TabsTrigger value="sessions">Sessions</TabsTrigger><TabsTrigger value="finance">Package & finance</TabsTrigger></TabsList>
            <TabsContent value="overview" className="mt-3 grid gap-5 lg:grid-cols-3">
              <Card className="gap-0 shadow-none lg:col-span-2">
                <div className="border-b px-5 py-4"><div className="font-semibold">Milestones</div><div className="text-xs text-muted-foreground">Observable outcomes for this coaching phase</div></div>
                <div className="divide-y">
                  {selected.milestones.map((milestone, index) => (
                    <div key={milestone.label} className="flex items-center gap-3 p-4">
                      <Button
                        size="icon"
                        variant={milestone.complete ? "default" : "outline"}
                        onClick={() => setPrograms((current) => current.map((program) => program.id === selected.id ? { ...program, milestones: program.milestones.map((item, itemIndex) => itemIndex === index ? { ...item, complete: !item.complete } : item) } : program))}
                      >
                        <Check className="size-4" />
                      </Button>
                      <div className={milestone.complete ? "text-sm text-muted-foreground line-through" : "text-sm font-medium"}>{milestone.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="gap-0 shadow-none">
                <div className="border-b px-5 py-4"><div className="font-semibold">Next actions</div><div className="text-xs text-muted-foreground">Keep the program moving</div></div>
                <CardContent className="space-y-3 p-5">
                  <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Next session</div><div className="mt-1 text-sm font-medium">{selected.nextSession}</div></div>
                  <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Progress review</div><div className="mt-1 text-sm font-medium">{selected.reviewDue}</div></div>
                  {selected.sessionsTotal - selected.sessionsUsed <= 2 && <Alert><AlertTriangle /><AlertTitle>Renewal decision due</AlertTitle><AlertDescription>Review progress before recommending the next package.</AlertDescription></Alert>}
                  <Button className="w-full"><FileCheck2 /> Complete review</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="progress" className="mt-3">
              <Card className="gap-0 shadow-none">
                <div className="border-b px-5 py-4"><div className="font-semibold">Development against target</div><div className="text-xs text-muted-foreground">Baseline, current assessment, and intended outcome</div></div>
                <CardContent className="space-y-6 p-6">
                  <div className="grid gap-4 sm:grid-cols-3">{[["Baseline", selected.baseline], ["Current", selected.current], ["Target", selected.target]].map(([label, value]) => <div key={label as string} className="rounded-lg border p-4"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-2 text-2xl font-semibold">{value}</div></div>)}</div>
                  <div><div className="mb-2 flex justify-between text-sm"><span className="text-muted-foreground">Goal progress</span><span className="font-semibold">{selected.current} / {selected.target}</span></div><Progress value={(selected.current / selected.target) * 100} className="h-3" /></div>
                  <Alert><TrendingUp /><AlertTitle>{selected.current - selected.baseline} point improvement</AlertTitle><AlertDescription>Record a new assessment during the next review to keep the recommendation evidence-based.</AlertDescription></Alert>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="sessions" className="mt-3">
              <Card className="gap-0 overflow-hidden shadow-none">
                <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Session</TableHead><TableHead>Attendance</TableHead><TableHead>Coach report</TableHead><TableHead>Package use</TableHead></TableRow></TableHeader><TableBody>
                  {[["18 Jul", "Match scenarios", "Present", "Completed", "1 credit"], ["15 Jul", "Movement & recovery", "Present", "Completed", "1 credit"], ["11 Jul", "Technical assessment", "Late", "Completed", "1 credit"]].map((row) => <TableRow key={row[0]}>{row.map((cell, index) => <TableCell key={cell} className={index === 1 ? "font-medium" : ""}>{cell}</TableCell>)}</TableRow>)}
                </TableBody></Table>
              </Card>
            </TabsContent>
            <TabsContent value="finance" className="mt-3">
              <div className="grid gap-5 lg:grid-cols-3">
                <Card className="gap-0 shadow-none lg:col-span-2"><CardContent className="space-y-5 p-6"><div><div className="mb-2 flex justify-between text-sm"><span className="font-medium">{selected.packageName}</span><span>{selected.sessionsUsed}/{selected.sessionsTotal} sessions</span></div><Progress value={packageProgress} className="h-3" /></div><div className="grid gap-3 sm:grid-cols-3">{[["Credits remaining", String(selected.sessionsTotal - selected.sessionsUsed)], ["Outstanding", selected.balance ? `₹${selected.balance}` : "₹0"], ["Renewal state", packageProgress >= 75 ? "Review due" : "Not due"]].map(([label, value]) => <div key={label} className="rounded-lg bg-muted p-4"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 font-semibold">{value}</div></div>)}</div></CardContent></Card>
                <Card className="gap-0 shadow-none"><CardContent className="space-y-3 p-5"><Button className="w-full"><CircleDollarSign /> Record payment</Button><Button variant="outline" className="w-full">View entitlement ledger</Button><Button variant="outline" className="w-full">Send renewal proposal</Button></CardContent></Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      <Header
        eyebrow="Student development"
        title="Coaching programs"
        description="Connect each student’s goal, milestones, sessions, package usage, progress reviews, and renewal decision."
        action={<Button onClick={() => setCreateOpen(true)}><Plus /> Create program</Button>}
      />
      <div className="mx-auto max-w-screen-2xl space-y-5 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Active programs" value={String(programs.filter((program) => program.status === "active").length)} note="Across all sports" icon={Target} />
          <Metric label="Goals on track" value="68%" note="Based on latest reviews" icon={TrendingUp} />
          <Metric label="Reviews due" value="3" note="One is overdue" icon={Clock3} />
          <Metric label="Renewal value" value="₹24,900" note="Packages ending soon" icon={IndianRupee} />
        </div>
        <Card className="gap-0 overflow-hidden shadow-none">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student, sport, or goal" className="pl-9" />
            </div>
            <Select value={status} onValueChange={setStatus}><SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="at_risk">At risk</SelectItem><SelectItem value="paused">Paused</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Student & goal</TableHead><TableHead>Program</TableHead><TableHead>Progress</TableHead><TableHead>Attendance</TableHead><TableHead>Package</TableHead><TableHead>Next session</TableHead><TableHead>Review</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
              <TableBody>
                {filtered.map((program) => (
                  <TableRow key={program.id} className="cursor-pointer" onClick={() => setSelectedId(program.id)}>
                    <TableCell><div className="min-w-56"><div className="font-medium">{program.student}</div><div className="mt-1 text-xs text-muted-foreground">{program.goal}</div></div></TableCell>
                    <TableCell><div>{program.sport}</div><div className="text-xs text-muted-foreground">{program.level}</div></TableCell>
                    <TableCell><div className="min-w-28"><div className="mb-1 text-xs">{program.progress}%</div><Progress value={program.progress} /></div></TableCell>
                    <TableCell>{program.attendance}%</TableCell>
                    <TableCell><div>{program.sessionsUsed}/{program.sessionsTotal} used</div><div className="text-xs text-muted-foreground">{program.packageName}</div></TableCell>
                    <TableCell>{program.nextSession}</TableCell>
                    <TableCell className={program.reviewDue === "Overdue" ? "font-medium text-amber-700" : ""}>{program.reviewDue}</TableCell>
                    <TableCell><StatusBadge value={program.status} /></TableCell>
                    <TableCell><Button variant="ghost" size="icon"><ChevronRight /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
      <ProgramWizard open={createOpen} onOpenChange={setCreateOpen} onSave={(program) => setPrograms((current) => [program, ...current])} />
    </div>
  );
}
