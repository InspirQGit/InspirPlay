import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Download,
  IndianRupee,
  Lightbulb,
  Percent,
  RefreshCcw,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
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

type AnalyticsRole = "venue" | "trainer" | "organizer" | "admin";
type Period = "7d" | "30d" | "90d" | "12m";

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

const BASE_TREND = [
  { label: "Jan", revenue: 68400, previous: 59800, orders: 82 },
  { label: "Feb", revenue: 76200, previous: 64100, orders: 91 },
  { label: "Mar", revenue: 89500, previous: 70800, orders: 108 },
  { label: "Apr", revenue: 82100, previous: 73400, orders: 99 },
  { label: "May", revenue: 96800, previous: 81200, orders: 116 },
  { label: "Jun", revenue: 112400, previous: 90400, orders: 132 },
  { label: "Jul", revenue: 124680, previous: 101200, orders: 148 },
];

const ROLE_DATA = {
  venue: {
    eyebrow: "Venue business intelligence",
    title: "Revenue & analytics",
    description: "Understand how bookings, occupancy, pricing, and secondary sales influence venue profitability.",
    multiplier: 1,
    primaryLabel: "Gross revenue",
    primary: 124680,
    primaryDelta: 18.4,
    metrics: [
      { label: "Net earnings", value: "₹1,08,472", delta: "+16.2%", positive: true, note: "After fees and refunds", icon: WalletCards },
      { label: "Occupancy", value: "76%", delta: "+8 pts", positive: true, note: "Peak hours at 94%", icon: Percent },
      { label: "Revenue / booked hour", value: "₹1,146", delta: "+6.8%", positive: true, note: "Pricing efficiency", icon: Clock3 },
    ],
    streams: [
      { name: "Court bookings", value: 81200, color: "var(--chart-1)" },
      { name: "Memberships", value: 18400, color: "var(--chart-2)" },
      { name: "POS & rentals", value: 15680, color: "var(--chart-3)" },
      { name: "Corporate", value: 9400, color: "var(--chart-4)" },
    ],
    funnel: [
      { label: "Listing views", value: 6820, rate: 100 },
      { label: "Availability checks", value: 2940, rate: 43 },
      { label: "Checkout started", value: 1160, rate: 17 },
      { label: "Bookings completed", value: 824, rate: 12 },
    ],
    insights: [
      { tone: "opportunity", title: "Protect Friday peak-hour yield", body: "Friday 6–9 PM is 94% occupied. A ₹150 peak adjustment could add approximately ₹9,600 monthly without reducing conversion.", action: "Review peak pricing", impact: "+₹9.6K/mo" },
      { tone: "warning", title: "Tuesday mornings are underused", body: "Occupancy between 8–11 AM is only 28%. A recurring academy block or off-peak pass can improve fixed-cost recovery.", action: "Create off-peak offer", impact: "+11 hrs/week" },
      { tone: "success", title: "Repeat players are growing", body: "Returning customers generated 62% of booking revenue, up 7 points. Prioritize retention benefits over broad discounts.", action: "View customer cohorts", impact: "62% retained" },
    ],
    transactions: [
      { id: "VB-1842", source: "Court 2 · Badminton", customer: "Arjun Mehta", date: "18 Jul, 10:32 AM", gross: 1600, fees: 160, net: 1440, status: "Paid" },
      { id: "VB-1841", source: "Monthly membership", customer: "Priya Sharma", date: "18 Jul, 9:18 AM", gross: 3499, fees: 350, net: 3149, status: "Paid" },
      { id: "VB-1840", source: "Racket rental", customer: "Rahul Singh", date: "17 Jul, 8:45 PM", gross: 400, fees: 40, net: 360, status: "Paid" },
      { id: "VB-1839", source: "Court 1 · Tennis", customer: "Deepa Nair", date: "17 Jul, 7:12 PM", gross: 3000, fees: 300, net: 2700, status: "Refunded" },
    ],
  },
  trainer: {
    eyebrow: "Coaching business intelligence",
    title: "Revenue & analytics",
    description: "Connect session demand, student retention, pricing, and capacity to sustainable coaching income.",
    multiplier: 0.34,
    primaryLabel: "Coaching revenue",
    primary: 42380,
    primaryDelta: 15.2,
    metrics: [
      { label: "Net earnings", value: "₹38,142", delta: "+14.8%", positive: true, note: "After platform fees", icon: WalletCards },
      { label: "Revenue / student", value: "₹2,492", delta: "+9.1%", positive: true, note: "17 active students", icon: Users },
      { label: "Session fill rate", value: "71%", delta: "+5 pts", positive: true, note: "Group sessions", icon: Percent },
    ],
    streams: [
      { name: "Private sessions", value: 22800, color: "var(--chart-1)" },
      { name: "Group sessions", value: 10600, color: "var(--chart-2)" },
      { name: "Packages", value: 6580, color: "var(--chart-3)" },
      { name: "Products", value: 2400, color: "var(--chart-4)" },
    ],
    funnel: [
      { label: "Profile views", value: 2140, rate: 100 },
      { label: "Availability checks", value: 860, rate: 40 },
      { label: "Enquiries", value: 286, rate: 13 },
      { label: "Sessions booked", value: 174, rate: 8 },
    ],
    insights: [
      { tone: "opportunity", title: "Add one early-morning group", body: "The 6–8 AM window has a 92% fill rate and 11 waitlisted requests. A weekly group can increase income without adding travel.", action: "Open a group session", impact: "+₹7.2K/mo" },
      { tone: "warning", title: "Four students show churn risk", body: "These students have not booked in 18 days despite previously attending weekly. Personal outreach is more effective than a discount.", action: "Review at-risk students", impact: "₹8.4K at risk" },
      { tone: "success", title: "Packages improve retention", body: "Package students complete 2.3× more sessions and generate 31% higher lifetime value than pay-as-you-go students.", action: "Promote packages", impact: "+31% LTV" },
    ],
    transactions: [
      { id: "TS-0942", source: "Private badminton session", customer: "Arjun Mehta", date: "18 Jul, 8:00 AM", gross: 1200, fees: 120, net: 1080, status: "Paid" },
      { id: "TS-0941", source: "Footwork clinic", customer: "Group Batch A", date: "17 Jul, 6:30 PM", gross: 7200, fees: 720, net: 6480, status: "Paid" },
      { id: "TS-0940", source: "8-session package", customer: "Priya Sharma", date: "17 Jul, 2:15 PM", gross: 8400, fees: 840, net: 7560, status: "Paid" },
      { id: "TS-0939", source: "Tennis assessment", customer: "Kavya Reddy", date: "16 Jul, 5:00 PM", gross: 1500, fees: 150, net: 1350, status: "Pending" },
    ],
  },
  organizer: {
    eyebrow: "Event business intelligence",
    title: "Revenue & analytics",
    description: "Measure registration velocity, event profitability, capacity, and participant acquisition across tournaments.",
    multiplier: 1.92,
    primaryLabel: "Registration revenue",
    primary: 239400,
    primaryDelta: 31.8,
    metrics: [
      { label: "Net payout", value: "₹2,15,460", delta: "+29.4%", positive: true, note: "After platform fees", icon: WalletCards },
      { label: "Average fill rate", value: "84%", delta: "+12 pts", positive: true, note: "Across active events", icon: Percent },
      { label: "Revenue / participant", value: "₹493", delta: "-2.6%", positive: false, note: "486 participants", icon: Users },
    ],
    streams: [
      { name: "Entry fees", value: 177600, color: "var(--chart-1)" },
      { name: "Team registrations", value: 32800, color: "var(--chart-2)" },
      { name: "Sponsorships", value: 18000, color: "var(--chart-3)" },
      { name: "Merchandise", value: 11000, color: "var(--chart-4)" },
    ],
    funnel: [
      { label: "Event page views", value: 12480, rate: 100 },
      { label: "Registration starts", value: 2380, rate: 19 },
      { label: "Payment reached", value: 1710, rate: 14 },
      { label: "Registrations complete", value: 1486, rate: 12 },
    ],
    insights: [
      { tone: "opportunity", title: "Football registrations accelerate late", body: "61% of football registrations occur in the final seven days. A staged price increase can improve early cash flow and forecasting.", action: "Set early-bird pricing", impact: "+₹18K forecast" },
      { tone: "warning", title: "Checkout abandonment is elevated", body: "28% of participants who select a category leave during team-detail entry. Reduce required fields until after payment.", action: "Review registration flow", impact: "480 lost starts" },
      { tone: "success", title: "Badminton events drive referrals", body: "Referral registrations are 24% higher for badminton events and cost 42% less than paid acquisition.", action: "Launch referral reward", impact: "-42% CAC" },
    ],
    transactions: [
      { id: "TR-3042", source: "Badminton Open · Singles", customer: "Arjun Mehta", date: "18 Jul, 11:42 AM", gross: 800, fees: 80, net: 720, status: "Paid" },
      { id: "TR-3041", source: "Football League · Team", customer: "Team Falcons", date: "18 Jul, 10:05 AM", gross: 5000, fees: 500, net: 4500, status: "Paid" },
      { id: "TR-3040", source: "Tennis Open · Doubles", customer: "Priya & Deepa", date: "17 Jul, 7:20 PM", gross: 1600, fees: 160, net: 1440, status: "Paid" },
      { id: "TR-3039", source: "Cricket T10 · Team", customer: "Strikers XI", date: "17 Jul, 4:50 PM", gross: 8000, fees: 800, net: 7200, status: "Pending" },
    ],
  },
  admin: {
    eyebrow: "Platform business intelligence",
    title: "Revenue & analytics",
    description: "Monitor marketplace GMV, platform revenue, payout health, growth quality, and role-level performance.",
    multiplier: 22.8,
    primaryLabel: "Gross merchandise value",
    primary: 2847500,
    primaryDelta: 22.6,
    metrics: [
      { label: "Platform revenue", value: "₹3,18,420", delta: "+24.1%", positive: true, note: "Fees and subscriptions", icon: WalletCards },
      { label: "Effective take rate", value: "11.2%", delta: "+0.4 pts", positive: true, note: "Blended marketplace", icon: Percent },
      { label: "Pending payouts", value: "₹4,86,200", delta: "-8.2%", positive: true, note: "Within settlement SLA", icon: Clock3 },
    ],
    streams: [
      { name: "Venue bookings", value: 1542000, color: "var(--chart-1)" },
      { name: "Tournaments", value: 624000, color: "var(--chart-2)" },
      { name: "Coaching", value: 438500, color: "var(--chart-3)" },
      { name: "Subscriptions", value: 243000, color: "var(--chart-4)" },
    ],
    funnel: [
      { label: "Marketplace visitors", value: 184200, rate: 100 },
      { label: "Authenticated users", value: 92100, rate: 50 },
      { label: "Checkout starts", value: 28400, rate: 15 },
      { label: "Paid transactions", value: 22680, rate: 12 },
    ],
    insights: [
      { tone: "opportunity", title: "Coach supply is limiting growth", body: "Player demand for coaching grew 28%, while active coach availability grew 11%. Focus acquisition on badminton and tennis coaches.", action: "View supply gaps", impact: "1.8K unmet searches" },
      { tone: "warning", title: "Refund concentration needs review", body: "Five venues account for 38% of refunds, primarily from availability mismatches and late cancellations.", action: "Review flagged venues", impact: "₹74K affected" },
      { tone: "success", title: "Organizer cohort quality improved", body: "Organizers onboarded this quarter reach their first 100 registrations 34% faster than the previous cohort.", action: "View cohort analysis", impact: "34% faster" },
    ],
    transactions: [
      { id: "PY-8402", source: "Venue settlement", customer: "Court Masters", date: "18 Jul, 12:00 PM", gross: 86400, fees: 8640, net: 77760, status: "Settled" },
      { id: "PY-8401", source: "Tournament settlement", customer: "SportsFest", date: "18 Jul, 11:30 AM", gross: 124000, fees: 12400, net: 111600, status: "Processing" },
      { id: "PY-8400", source: "Coach settlement", customer: "Coach Rajesh", date: "18 Jul, 10:45 AM", gross: 42380, fees: 4238, net: 38142, status: "Settled" },
      { id: "PY-8399", source: "Venue settlement", customer: "Green Valley", date: "17 Jul, 6:00 PM", gross: 68200, fees: 6820, net: 61380, status: "On hold" },
    ],
  },
} satisfies Record<AnalyticsRole, any>;

function Delta({ value, positive }: { value: string; positive: boolean }) {
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return <span className={`inline-flex items-center gap-1 text-xs font-semibold ${positive ? "text-sky-700" : "text-red-700"}`}><Icon className="size-3.5" />{value}</span>;
}

function InsightIcon({ tone }: { tone: string }) {
  if (tone === "warning") return <AlertTriangle className="size-5 text-amber-700" />;
  if (tone === "success") return <CheckCircle2 className="size-5 text-sky-700" />;
  return <Lightbulb className="size-5 text-blue-700" />;
}

function TransactionStatus({ value }: { value: string }) {
  const color = value === "Paid" || value === "Settled"
    ? "border-sky-200 bg-sky-50 text-sky-700"
    : value === "Refunded" || value === "On hold"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-amber-200 bg-amber-50 text-amber-700";
  return <Badge variant="outline" className={color}>{value}</Badge>;
}

export function RoleRevenueAnalytics({ role }: { role: AnalyticsRole }) {
  const [period, setPeriod] = useState<Period>("30d");
  const [location, setLocation] = useState("all");
  const data = ROLE_DATA[role];

  const trend = useMemo(() => {
    const count = period === "7d" ? 4 : period === "30d" ? 7 : period === "90d" ? 7 : 7;
    return BASE_TREND.slice(-count).map((item) => ({
      ...item,
      revenue: Math.round(item.revenue * data.multiplier),
      previous: Math.round(item.previous * data.multiplier),
    }));
  }, [data.multiplier, period]);

  const forecast = Math.round(data.primary * 1.12);
  const chartMoney = (value: number) => value >= 100000 ? `₹${(value / 100000).toFixed(1)}L` : `₹${Math.round(value / 1000)}K`;

  return (
    <div className="min-h-full bg-background">
      <div className="px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="font-['Lexend'] text-2xl font-semibold tracking-tight">{data.title}</div>
          <div className="flex flex-wrap gap-2">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">{role === "admin" ? "All businesses" : "All locations"}</SelectItem><SelectItem value="primary">Primary location</SelectItem><SelectItem value="secondary">Secondary location</SelectItem></SelectContent>
            </Select>
            <div className="flex rounded-md border bg-muted p-1">
              {(["7d", "30d", "90d", "12m"] as const).map((value) => <Button key={value} size="sm" variant={period === value ? "default" : "ghost"} onClick={() => setPeriod(value)}>{value.toUpperCase()}</Button>)}
            </div>
            <Button variant="outline"><Download /> Export</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl space-y-6 p-4 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="gap-0 border-primary/20 bg-primary text-primary-foreground shadow-none">
            <CardContent className="p-5">
              <div className="flex items-start justify-between"><div className="text-xs font-medium text-primary-foreground/70">{data.primaryLabel}</div><CircleDollarSign className="size-5 text-primary-foreground/70" /></div>
              <div className="mt-4 font-['Lexend'] text-2xl font-semibold">{money(data.primary)}</div>
              <div className="mt-2 text-xs text-primary-foreground/70"><span className="font-semibold text-primary-foreground">+{data.primaryDelta}%</span> compared with previous period</div>
            </CardContent>
          </Card>
          {data.metrics.map((metric: any) => (
            <Card key={metric.label} className="gap-0 shadow-none">
              <CardContent className="p-5">
                <div className="flex items-start justify-between"><div className="text-xs font-medium text-muted-foreground">{metric.label}</div><metric.icon className="size-5 text-brand-text" /></div>
                <div className="mt-4 flex items-end justify-between gap-3"><div className="font-['Lexend'] text-xl font-semibold">{metric.value}</div><Delta value={metric.delta} positive={metric.positive} /></div>
                <div className="mt-2 text-xs text-muted-foreground">{metric.note}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <Card className="gap-0 shadow-none xl:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
              <div><div className="font-['Lexend'] font-semibold">Revenue trend</div><div className="text-xs text-muted-foreground">Current period compared with the previous period</div></div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" />Current</span><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-muted-foreground/30" />Previous</span></div>
            </div>
            <CardContent className="p-5">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={trend}>
                  <defs><linearGradient id={`revenue-${role}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.25} /><stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={chartMoney} />
                  <Tooltip formatter={(value: number) => money(value)} />
                  <Area type="monotone" dataKey="previous" stroke="var(--muted-foreground)" fill="transparent" strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} fill={`url(#revenue-${role})`} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="gap-0 shadow-none">
            <div className="border-b px-5 py-4"><div className="font-['Lexend'] font-semibold">Revenue mix</div><div className="text-xs text-muted-foreground">Contribution by business stream</div></div>
            <CardContent className="p-5">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart><Pie data={data.streams} dataKey="value" nameKey="name" innerRadius={52} outerRadius={76} paddingAngle={3}>{data.streams.map((entry: any) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip formatter={(value: number) => money(value)} /></PieChart>
              </ResponsiveContainer>
              <div className="space-y-2.5">{data.streams.map((stream: any, index: number) => <div key={stream.name} className="flex items-center gap-2 text-sm"><span className={`size-2.5 rounded-full ${["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4"][index]}`} /><span className="flex-1 text-muted-foreground">{stream.name}</span><span className="font-medium">{money(stream.value)}</span></div>)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <Card className="gap-0 shadow-none xl:col-span-2">
            <div className="flex items-center justify-between border-b px-5 py-4"><div><div className="font-['Lexend'] font-semibold">Decision-ready insights</div><div className="text-xs text-muted-foreground">Prioritized using demand, revenue, and behavior patterns</div></div><Badge variant="secondary"><Sparkles /> Updated today</Badge></div>
            <div className="divide-y">
              {data.insights.map((insight: any) => (
                <div key={insight.title} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                  <div className={`rounded-lg p-2.5 ${insight.tone === "warning" ? "bg-amber-50" : insight.tone === "success" ? "bg-sky-50" : "bg-blue-50"}`}><InsightIcon tone={insight.tone} /></div>
                  <div className="flex-1"><div className="font-medium">{insight.title}</div><div className="mt-1 text-sm leading-6 text-muted-foreground">{insight.body}</div><Button variant="link" className="mt-2 h-auto p-0">{insight.action} <ChevronRight /></Button></div>
                  <Badge variant="outline" className="w-fit">{insight.impact}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="gap-0 shadow-none">
            <div className="border-b px-5 py-4"><div className="font-['Lexend'] font-semibold">Period forecast</div><div className="text-xs text-muted-foreground">Based on current run rate</div></div>
            <CardContent className="space-y-5 p-5">
              <div><div className="text-xs text-muted-foreground">Projected revenue</div><div className="mt-1 font-['Lexend'] text-2xl font-semibold">{money(forecast)}</div><div className="mt-1 text-xs text-sky-700">12% above current period</div></div>
              <div><div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">Forecast confidence</span><span>84%</span></div><Progress value={84} /></div>
              <div className="rounded-lg bg-muted p-4"><div className="flex gap-2"><Target className="mt-0.5 size-4 text-brand-text" /><div><div className="text-sm font-medium">Target progress</div><div className="mt-1 text-xs text-muted-foreground">{money(data.primary)} of {money(Math.round(forecast * 1.08))}</div></div></div><Progress value={76} className="mt-3" /></div>
              <div className="space-y-3 border-t pt-4">{[["Best day", "Friday"], ["Strongest period", "6–9 PM"], ["Data refreshed", "12 min ago"]].map(([label, value]) => <div key={label} className="flex justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <Card className="gap-0 shadow-none">
            <div className="border-b px-5 py-4"><div className="font-['Lexend'] font-semibold">Conversion journey</div><div className="text-xs text-muted-foreground">Where customers progress or leave the purchase journey</div></div>
            <CardContent className="space-y-4 p-5">
              {data.funnel.map((step: any, index: number) => <div key={step.label}><div className="mb-2 flex items-center justify-between text-sm"><div className="flex items-center gap-2"><span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs">{index + 1}</span><span>{step.label}</span></div><div><span className="font-semibold">{step.value.toLocaleString("en-IN")}</span><span className="ml-2 text-xs text-muted-foreground">{step.rate}%</span></div></div><Progress value={step.rate} /></div>)}
            </CardContent>
          </Card>
          <Card className="gap-0 shadow-none">
            <div className="border-b px-5 py-4"><div className="font-['Lexend'] font-semibold">Performance drivers</div><div className="text-xs text-muted-foreground">Revenue contribution and period movement</div></div>
            <CardContent className="p-5">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.streams} layout="vertical" margin={{ left: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={110} tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip formatter={(value: number) => money(value)} />
                  <Bar dataKey="value" fill="var(--chart-1)" radius={[0, 5, 5, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="gap-0 overflow-hidden shadow-none">
          <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div><div className="font-['Lexend'] font-semibold">{role === "admin" ? "Recent settlements" : "Recent revenue activity"}</div><div className="text-xs text-muted-foreground">Gross amount, fees, and expected net earnings</div></div>
            <Button variant="outline" size="sm">View all transactions <ChevronRight /></Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Reference</TableHead><TableHead>Revenue source</TableHead><TableHead>{role === "admin" ? "Business" : "Customer"}</TableHead><TableHead>Date</TableHead><TableHead>Gross</TableHead><TableHead>Fees</TableHead><TableHead>Net</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>{data.transactions.map((item: any) => <TableRow key={item.id}><TableCell className="font-mono text-xs text-brand-text">{item.id}</TableCell><TableCell className="font-medium">{item.source}</TableCell><TableCell>{item.customer}</TableCell><TableCell className="text-muted-foreground">{item.date}</TableCell><TableCell>{money(item.gross)}</TableCell><TableCell className="text-muted-foreground">−{money(item.fees)}</TableCell><TableCell className="font-semibold">{money(item.net)}</TableCell><TableCell><TransactionStatus value={item.status} /></TableCell></TableRow>)}</TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function VenueRevenueAnalyticsPage() {
  return <RoleRevenueAnalytics role="venue" />;
}
export function TrainerRevenueAnalyticsPage() {
  return <RoleRevenueAnalytics role="trainer" />;
}
export function OrganizerRevenueAnalyticsPage() {
  return <RoleRevenueAnalytics role="organizer" />;
}
export function AdminRevenueAnalyticsPage() {
  return <RoleRevenueAnalytics role="admin" />;
}
