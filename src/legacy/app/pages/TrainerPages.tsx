import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/SmartTable";
import { useState } from "react";
import {
  Users, Calendar, DollarSign, TrendingUp, Clock, Star, CheckCircle,
  X, Plus, Edit2, Trash2, Activity, Award, Timer, Upload, ShieldCheck, Save,
  Eye, EyeOff, Globe, AlertCircle
} from "lucide-react";
import { StatCard, Badge, DataTable, PageHeader, FilterBar, ImageUploadGrid } from "../components";
import type { ColDef } from "../components";
import { MONTHLY_REVENUE } from "../data";
import type { TrainerItem } from "../data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const TRAINER_STUDENTS = [
  { id: 1, name: "Arjun Mehta", sport: "Badminton", sessions: 12, nextSession: "Jul 11, 07:00", status: "active", progress: 75 },
  { id: 2, name: "Priya Sharma", sport: "Tennis", sessions: 8, nextSession: "Jul 12, 17:00", status: "active", progress: 60 },
  { id: 3, name: "Rahul Singh", sport: "Badminton", sessions: 20, nextSession: "Jul 13, 07:00", status: "active", progress: 90 },
  { id: 4, name: "Divya Nair", sport: "Tennis", sessions: 5, nextSession: "—", status: "paused", progress: 40 },
];

const TRAINER_SESSIONS = [
  { id: 1, student: "Arjun Mehta", sport: "Badminton", date: "Jul 11, 2026", time: "07:00–08:00", venue: "Court Masters Arena", status: "scheduled", fee: 800, type: "Private 1:1" },
  { id: 2, student: "Priya Sharma", sport: "Tennis", date: "Jul 12, 2026", time: "17:00–18:00", venue: "Green Valley FC", status: "scheduled", fee: 1000, type: "Private 1:1" },
  { id: 3, student: "Rahul Singh", sport: "Badminton", date: "Jul 10, 2026", time: "07:00–08:00", venue: "Court Masters Arena", status: "completed", fee: 800, type: "Private 1:1" },
  { id: 4, student: "Group Batch A", sport: "Badminton", date: "Jul 13, 2026", time: "06:00–07:30", venue: "Court Masters Arena", status: "scheduled", fee: 400, type: "Group (4–6)" },
  { id: 5, student: "Divya Nair", sport: "Tennis", date: "Jul 9, 2026", time: "18:00–19:00", venue: "Green Valley FC", status: "completed", fee: 1000, type: "Private 1:1" },
  { id: 6, student: "Suresh Patel", sport: "Badminton", date: "Jul 8, 2026", time: "07:00–08:00", venue: "Court Masters Arena", status: "completed", fee: 800, type: "Private 1:1" },
  { id: 7, student: "Group Batch B", sport: "Tennis", date: "Jul 14, 2026", time: "17:00–18:30", venue: "Green Valley FC", status: "scheduled", fee: 450, type: "Group (4–6)" },
  { id: 8, student: "Anjali Verma", sport: "Badminton", date: "Jul 7, 2026", time: "06:30–07:30", venue: "Court Masters Arena", status: "cancelled", fee: 800, type: "Private 1:1" },
  { id: 9, student: "Vikram Nair", sport: "Badminton", date: "Jul 15, 2026", time: "07:00–08:00", venue: "Court Masters Arena", status: "scheduled", fee: 800, type: "Private 1:1" },
  { id: 10, student: "Kavya Reddy", sport: "Tennis", date: "Jul 16, 2026", time: "17:00–18:00", venue: "Green Valley FC", status: "scheduled", fee: 1000, type: "Private 1:1" },
  { id: 11, student: "Group Batch A", sport: "Badminton", date: "Jul 6, 2026", time: "06:00–07:30", venue: "Court Masters Arena", status: "completed", fee: 400, type: "Group (4–6)" },
  { id: 12, student: "Rahul Singh", sport: "Badminton", date: "Jul 3, 2026", time: "07:00–08:00", venue: "Court Masters Arena", status: "completed", fee: 800, type: "Private 1:1" },
];

export function TrainerDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-[#FFC400] to-[#D9A900] rounded-md p-6 text-[#17140A]">
        <h2 className="text-xl font-bold mb-1">Good morning, Coach Rajesh 👋</h2>
        <p className="text-[#3B310F] text-sm">You have 3 sessions today. 12 active students this week.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Students" value="12" sub="↑ 2 this month" icon={Users} />
        <StatCard label="Sessions This Month" value="48" sub="4.2 avg/week" icon={Calendar} color="#3F718B" />
        <StatCard label="Monthly Earnings" value="₹38,400" sub="↑ 15% vs last" icon={DollarSign} color="#C08B3E" />
        <StatCard label="Avg Rating" value="4.9" sub="From 96 reviews" icon={Star} color="#B84A4A" />
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-md border border-[#DFE0D8] p-5">
          <h3 className="font-bold text-[#181A1F] mb-4">Monthly Earnings</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MONTHLY_REVENUE.slice(-6).map(d => ({ ...d, earnings: Math.round(d.revenue * 0.031) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Earnings"]} />
              <Line name="Earnings" type="monotone" dataKey="earnings" stroke="#FFC400" strokeWidth={2.5} dot={{ fill: "#FFC400", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
          <h3 className="font-bold text-[#181A1F] mb-4">Today's Sessions</h3>
          <div className="space-y-3">
            {TRAINER_SESSIONS.filter(s => s.date.includes("Jul 1") && s.status === "scheduled").slice(0, 3).map(s => (
              <div key={s.id} className="flex items-start gap-3 p-3 bg-[#F7F7F3] rounded-md">
                <div className="bg-[#FFC400]/10 w-9 h-9 rounded-md flex items-center justify-center text-[#755900] shrink-0">
                  <Clock size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#181A1F] truncate">{s.student}</div>
                  <div className="text-xs text-[#5F635C]">{s.time} · {s.sport}</div>
                </div>
                <div className="text-sm font-bold text-[#181A1F]">₹{s.fee}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type SessionRow = typeof TRAINER_SESSIONS[0];

const SESSION_DATA = [
  { id: 1, name: "Advanced Footwork Clinic", sport: "Badminton", date: "2026-07-19", time: "07:00–09:00", venue: "Court Masters Arena", maxStudents: 10, enrolled: 8, price: 1200, level: "Advanced", status: "upcoming", published: true, image: "/inspirq-media/badminton.png", images: [] as string[], description: "Intensive footwork and movement training for advanced players." },
  { id: 2, name: "Tennis Serve Masterclass", sport: "Tennis", date: "2026-07-20", time: "17:00–19:00", venue: "Ace Tennis Academy", maxStudents: 8, enrolled: 5, price: 1500, level: "Intermediate", status: "upcoming", published: true, image: "/inspirq-media/tennis.png", images: [] as string[], description: "Perfect your serve technique with biomechanical analysis." },
  { id: 3, name: "Beginner Badminton Batch A", sport: "Badminton", date: "2026-07-14", time: "06:00–07:30", venue: "Court Masters Arena", maxStudents: 12, enrolled: 10, price: 800, level: "Beginner", status: "completed", published: true, image: "/inspirq-media/badminton.png", images: [] as string[], description: "Foundation skills for beginners: grip, stance, basic shots." },
  { id: 4, name: "Group Conditioning", sport: "Fitness", date: "2026-07-21", time: "06:00–07:00", venue: "Court Masters Arena", maxStudents: 15, enrolled: 6, price: 600, level: "All Levels", status: "upcoming", published: false, image: "", images: [] as string[], description: "Sports-specific conditioning and endurance training." },
  { id: 5, name: "Competition Prep (Advanced)", sport: "Badminton", date: "2026-07-22", time: "17:00–20:00", venue: "Court Masters Arena", maxStudents: 6, enrolled: 4, price: 2000, level: "Advanced", status: "upcoming", published: true, image: "", images: [] as string[], description: "Tournament preparation: match tactics, mental game, physical peak." },
  { id: 6, name: "Tennis Beginners Batch", sport: "Tennis", date: "2026-07-10", time: "18:00–19:30", venue: "Green Valley FC", maxStudents: 10, enrolled: 8, price: 900, level: "Beginner", status: "completed", published: true, image: "/inspirq-media/tennis.png", images: [] as string[], description: "Beginner tennis: grip, rally basics, forehand and backhand." },
];

const SESSION_STUDENTS = [
  { id: 1, name: "Arjun Mehta", phone: "+91 98765 11111", joinedDate: "Jul 5, 2026", paymentStatus: "paid", sessions: 4 },
  { id: 2, name: "Priya Sharma", phone: "+91 98765 22222", joinedDate: "Jul 6, 2026", paymentStatus: "paid", sessions: 3 },
  { id: 3, name: "Rahul Singh", phone: "+91 98765 33333", joinedDate: "Jul 7, 2026", paymentStatus: "pending", sessions: 2 },
  { id: 4, name: "Divya Nair", phone: "+91 98765 44444", joinedDate: "Jul 8, 2026", paymentStatus: "paid", sessions: 4 },
  { id: 5, name: "Vikram Patel", phone: "+91 98765 55555", joinedDate: "Jul 9, 2026", paymentStatus: "paid", sessions: 1 },
  { id: 6, name: "Anjali Verma", phone: "+91 98765 66666", joinedDate: "Jul 10, 2026", paymentStatus: "pending", sessions: 2 },
  { id: 7, name: "Suresh Kumar", phone: "+91 98765 77777", joinedDate: "Jul 11, 2026", paymentStatus: "paid", sessions: 3 },
  { id: 8, name: "Kavya Reddy", phone: "+91 98765 88888", joinedDate: "Jul 12, 2026", paymentStatus: "paid", sessions: 4 },
];

export function TrainerSessions() {
  const [sessions, setSessions] = useState(SESSION_DATA);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sportFilter, setSportFilter] = useState("all");
  const [detailSession, setDetailSession] = useState<typeof SESSION_DATA[0] | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [detailTab, setDetailTab] = useState<"students" | "attendance" | "info">("students");
  const [form, setForm] = useState({ name: "", sport: "Badminton", date: "", startTime: "", endTime: "", venue: "", maxStudents: "10", price: "", level: "All Levels", description: "", img1: "", img2: "", img3: "" });

  const filtered = sessions.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.venue.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchSport = sportFilter === "all" || s.sport === sportFilter;
    return matchSearch && matchStatus && matchSport;
  });

  const createSession = () => {
    setSessions(prev => [...prev, { id: Date.now(), name: form.name, sport: form.sport, date: form.date, time: `${form.startTime}–${form.endTime}`, venue: form.venue, maxStudents: Number(form.maxStudents) || 10, enrolled: 0, price: Number(form.price) || 0, level: form.level, status: "upcoming", published: false, image: form.img1, images: [form.img1, form.img2, form.img3].filter(Boolean), description: form.description }]);
    setShowCreate(false);
    setForm({ name: "", sport: "Badminton", date: "", startTime: "", endTime: "", venue: "", maxStudents: "10", price: "", level: "All Levels", description: "", img1: "", img2: "", img3: "" });
  };

  const togglePublish = (id: number) => setSessions(prev => prev.map(s => s.id === id ? { ...s, published: !s.published } : s));

  const sports = ["all", ...Array.from(new Set(sessions.map(s => s.sport)))];

  if (detailSession) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title={detailSession.name}
          breadcrumb="Sessions → Detail"
          subtitle={`${detailSession.sport} · ${detailSession.venue} · ${detailSession.date}`}
          action={<button onClick={() => setDetailSession(null)} className="flex items-center gap-1.5 text-sm text-[#5F635C] hover:text-[#30342F] border border-[#C9CBC2] rounded-md px-3 py-1.5">← Back</button>}
        />
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Session hero */}
          {detailSession.image && (
            <div className="relative h-40 rounded-md overflow-hidden">
              <img src={detailSession.image} alt={detailSession.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="text-white font-bold text-lg drop-shadow">{detailSession.name}</span>
                  <p className="text-white/80 text-sm">{detailSession.enrolled}/{detailSession.maxStudents} enrolled · ₹{detailSession.price}/student</p>
                </div>
                <Badge text={detailSession.status} color={detailSession.status === "upcoming" ? "success" : detailSession.status === "completed" ? "blue" : "gray"} />
              </div>
            </div>
          )}
          {/* Detail tabs */}
          <div className="flex gap-1 bg-[#DFE0D8] rounded-md p-1 w-fit">
            {(["students", "attendance", "info"] as const).map(t => (
              <button key={t} onClick={() => setDetailTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${detailTab === t ? "bg-white text-[#181A1F] shadow-sm" : "text-[#5F635C] hover:text-[#30342F]"}`}>{t}</button>
            ))}
          </div>
          {detailTab === "students" && (
            <div className="bg-white rounded-md border border-[#DFE0D8]">
              <div className="px-4 py-3 border-b border-[#DFE0D8] flex items-center justify-between">
                <span className="text-sm font-semibold text-[#181A1F]">{detailSession.enrolled} Students Enrolled</span>
                <button className="text-xs bg-[#FFC400] text-[#17140A] px-3 py-1.5 rounded-md font-semibold">+ Add Student</button>
              </div>
              <div className="overflow-x-auto">
                <Table className="w-full text-sm">
                  <TableHeader><TableRow className="bg-[#FFC400]/10">{["Name","Phone","Joined","Payment","Sessions","Actions"].map(h => <TableHead key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#755900] uppercase tracking-wide">{h}</TableHead>)}</TableRow></TableHeader>
                  <TableBody className="divide-y divide-[#F7F7F3]">
                    {SESSION_STUDENTS.slice(0, detailSession.enrolled).map(st => (
                      <TableRow key={st.id} className="hover:bg-[#F7F7F3]/50">
                        <TableCell className="px-4 py-3 font-medium text-[#181A1F]">{st.name}</TableCell>
                        <TableCell className="px-4 py-3 text-[#464A45] font-mono text-xs">{st.phone}</TableCell>
                        <TableCell className="px-4 py-3 text-[#5F635C] text-xs">{st.joinedDate}</TableCell>
                        <TableCell className="px-4 py-3"><Badge text={st.paymentStatus} color={st.paymentStatus === "paid" ? "success" : "yellow"} /></TableCell>
                        <TableCell className="px-4 py-3 text-[#30342F]">{st.sessions}</TableCell>
                        <TableCell className="px-4 py-3"><button className="text-xs text-red-400 hover:text-red-600 border border-red-200 px-2 py-1 rounded-md">Remove</button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          {detailTab === "attendance" && (
            <div className="bg-white rounded-md border border-[#DFE0D8] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#181A1F]">Attendance — {detailSession.date}</span>
                <span className="text-xs bg-sky-50 text-sky-700 border border-sky-200 px-2 py-1 rounded-full font-medium">6/8 Present — 75%</span>
              </div>
              {SESSION_STUDENTS.slice(0, detailSession.enrolled).map((st, idx) => (
                <div key={st.id} className="flex items-center justify-between p-3 bg-[#F7F7F3] rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFC400]/10 rounded-full flex items-center justify-center text-[#755900] text-sm font-bold">{st.name[0]}</div>
                    <span className="text-sm font-medium text-[#181A1F]">{st.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${idx < 6 ? "bg-sky-500 text-white border-sky-500" : "border-[#C9CBC2] text-[#5F635C] hover:bg-[#DFE0D8]"}`}>Present</button>
                    <button className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${idx >= 6 ? "bg-red-400 text-white border-red-400" : "border-[#C9CBC2] text-[#5F635C] hover:bg-[#DFE0D8]"}`}>Absent</button>
                  </div>
                </div>
              ))}
              <button className="w-full bg-[#FFC400] text-[#17140A] py-2.5 rounded-md text-sm font-semibold hover:bg-[#D9A900]">Save Attendance</button>
            </div>
          )}
          {detailTab === "info" && (
            <div className="bg-white rounded-md border border-[#DFE0D8] p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {[["Session Name", detailSession.name], ["Sport", detailSession.sport], ["Venue", detailSession.venue], ["Date", detailSession.date], ["Time", detailSession.time], ["Level", detailSession.level]].map(([label, val]) => (
                  <div key={label as string}>
                    <label className="text-xs font-semibold text-[#5F635C] uppercase tracking-wide block mb-1">{label}</label>
                    <input defaultValue={val as string} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500]" />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs font-semibold text-[#5F635C] uppercase tracking-wide block mb-1">Description</label>
                <textarea defaultValue={detailSession.description} rows={3} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 resize-none" />
              </div>
              <button className="bg-[#FFC400] text-[#17140A] px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-[#D9A900]">Save Changes</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Training Sessions" subtitle={`${sessions.length} sessions · ${sessions.filter(s => s.published).length} published`}
        action={<button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-[#FFC400] text-[#17140A] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#D9A900]"><Plus size={15} /> Create Session</button>} />
      <FilterBar search={search} onSearch={setSearch} viewMode={viewMode} onViewMode={setViewMode} placeholder="Search sessions…"
        filters={[
          { label: "Status", value: statusFilter, onChange: setStatusFilter, options: [{ label: "All", value: "all" }, { label: "Upcoming", value: "upcoming" }, { label: "Completed", value: "completed" }, { label: "Cancelled", value: "cancelled" }] },
          { label: "Sport", value: sportFilter, onChange: setSportFilter, options: sports.map(s => ({ label: s === "all" ? "All Sports" : s, value: s })) },
        ]} />
      <div className="flex-1 overflow-y-auto p-6">
        {viewMode === "card" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(s => (
              <div key={s.id} className={`bg-white rounded-md border overflow-hidden ${s.published ? "border-[#DFE0D8]" : "border-dashed border-[#C9CBC2]"}`}>
                <div className="relative h-32 bg-[#DFE0D8]">
                  {s.image ? <img src={s.image} alt={s.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#A5A89E] text-3xl">🏸</div>}
                  {!s.published && <div className="absolute top-2 left-2 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">Draft</div>}
                  {s.published && <div className="absolute top-2 left-2 bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Globe size={9} /> Live</div>}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#181A1F] text-sm mb-1 leading-snug">{s.name}</h3>
                  <p className="text-xs text-[#5F635C] mb-2">{s.sport} · {s.date} · {s.time}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-[#DFE0D8] rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-[#FFC400]" style={{ width: `${(s.enrolled / s.maxStudents) * 100}%` }} />
                    </div>
                    <span className="text-xs text-[#7D8178]">{s.enrolled}/{s.maxStudents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#755900]">₹{s.price}/student</span>
                    <div className="flex gap-1.5">
                      <button onClick={() => setDetailSession(s)} className="p-1.5 text-[#7D8178] hover:text-blue-500 hover:bg-blue-50 rounded-md"><Eye size={14} /></button>
                      <button aria-label="Edit" className="p-1.5 text-[#7D8178] hover:text-[#464A45] hover:bg-[#DFE0D8] rounded-md"><Edit2 size={14} /></button>
                      <button onClick={() => togglePublish(s.id)} className={`p-1.5 rounded-md ${s.published ? "text-sky-600 bg-sky-50" : "text-[#7D8178] hover:bg-[#DFE0D8]"}`}><Globe size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-md border border-[#DFE0D8] overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="w-full text-sm">
                <TableHeader><TableRow className="bg-[#FFC400]/10">{["Session", "Sport", "Date", "Time", "Enrolled", "Price", "Published", "Actions"].map(h => <TableHead key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#755900] uppercase tracking-wide">{h}</TableHead>)}</TableRow></TableHeader>
                <TableBody className="divide-y divide-[#F7F7F3]">
                  {filtered.map(s => (
                    <TableRow key={s.id} className="hover:bg-[#F7F7F3]/50">
                      <TableCell className="px-4 py-3"><div className="flex items-center gap-3">{s.image && <img src={s.image} alt="" className="w-10 h-10 rounded-md object-cover" />}<span className="font-medium text-[#181A1F] max-w-[160px] truncate">{s.name}</span></div></TableCell>
                      <TableCell className="px-4 py-3 text-[#464A45]">{s.sport}</TableCell>
                      <TableCell className="px-4 py-3 text-[#464A45]">{s.date}</TableCell>
                      <TableCell className="px-4 py-3 text-[#464A45]">{s.time}</TableCell>
                      <TableCell className="px-4 py-3"><span className="text-[#181A1F]">{s.enrolled}/{s.maxStudents}</span></TableCell>
                      <TableCell className="px-4 py-3 font-semibold text-[#755900]">₹{s.price}</TableCell>
                      <TableCell className="px-4 py-3"><Badge text={s.published ? "Live" : "Draft"} color={s.published ? "success" : "gray"} /></TableCell>
                      <TableCell className="px-4 py-3"><div className="flex gap-1"><button onClick={() => setDetailSession(s)} className="p-1.5 text-[#7D8178] hover:text-blue-500 hover:bg-blue-50 rounded-md"><Eye size={14} /></button><button aria-label="Edit" className="p-1.5 text-[#7D8178] hover:text-[#464A45] hover:bg-[#DFE0D8] rounded-md"><Edit2 size={14} /></button><button aria-label="Delete" className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-md"><Trash2 size={14} /></button></div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[#181A1F]">Create Training Session</h3>
              <button onClick={() => setShowCreate(false)}><X size={18} className="text-[#7D8178]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["Session Name", "name", "Advanced Footwork Clinic"], ["Venue", "venue", "Court Masters Arena"], ["Max Students", "maxStudents", "10"], ["Price per Student (₹)", "price", "1200"]].map(([label, key, placeholder]) => (
                <div key={key as string} className={key === "name" || key === "venue" ? "col-span-2" : ""}>
                  <label className="text-xs font-medium text-[#464A45] mb-1 block">{label}</label>
                  <input value={(form as any)[key as string]} onChange={e => setForm(p => ({ ...p, [key as string]: e.target.value }))} placeholder={placeholder as string} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Sport</label>
                <select value={form.sport} onChange={e => setForm(p => ({ ...p, sport: e.target.value }))} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]">
                  {["Badminton","Tennis","Football","Basketball","Fitness","Cricket"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Level</label>
                <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]">
                  {["Beginner","Intermediate","Advanced","All Levels"].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Date</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Start Time</label>
                <input type="time" value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[#464A45] mb-1 block">Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="Session overview and objectives..." className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500] resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#5F635C] uppercase tracking-wide block">Cover Images</label>
              <ImageUploadGrid
                images={[form.img1, form.img2, form.img3].filter(Boolean)}
                maxImages={3}
                onChange={images => setForm(p => ({ ...p, img1: images[0] || "", img2: images[1] || "", img3: images[2] || "" }))}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowCreate(false)} className="flex-1 border border-[#C9CBC2] rounded-md py-2.5 text-sm">Cancel</button>
              <button onClick={createSession} className="flex-1 bg-[#FFC400] text-[#17140A] rounded-md py-2.5 text-sm font-semibold">Create Session</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TrainerEquipment() {
  const [items, setItems] = useState([
    { id: 1, name: "Yonex Badminton Racket", category: "Equipment", price: 2500, stock: 6, active: true },
    { id: 2, name: "Badminton Shuttle (tube)", category: "Consumable", price: 120, stock: 24, active: true },
    { id: 3, name: "Tennis Racket", category: "Equipment", price: 3000, stock: 4, active: true },
    { id: 4, name: "Grip Tape Roll", category: "Consumable", price: 80, stock: 30, active: true },
    { id: 5, name: "Resistance Band Set", category: "Equipment", price: 350, stock: 8, active: true },
    { id: 6, name: "Agility Cones (set of 10)", category: "Equipment", price: 600, stock: 5, active: true },
    { id: 7, name: "Medicine Ball 5kg", category: "Equipment", price: 800, stock: 3, active: true },
    { id: 8, name: "Skipping Rope", category: "Equipment", price: 200, stock: 12, active: true },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Equipment", price: "", stock: "" });

  const addItem = () => {
    if (!form.name) return;
    setItems(prev => [...prev, { id: Date.now(), name: form.name, category: form.category, price: Number(form.price) || 0, stock: Number(form.stock) || 0, active: true }]);
    setShowAdd(false);
    setForm({ name: "", category: "Equipment", price: "", stock: "" });
  };

  const toggleActive = (id: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i));
  const deleteItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

  const totalValue = items.reduce((a, i) => a + i.price * i.stock, 0);
  const lowStock = items.filter(i => i.stock <= 4).length;

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Equipment & Inventory" subtitle={`${items.length} items · ₹${totalValue.toLocaleString()} total value`}
        action={<button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-[#FFC400] text-[#17140A] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#D9A900]"><Plus size={15} /> Add Item</button>} />
      <div className="p-6 space-y-5">
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard label="Total Items" value={String(items.length)} sub="In inventory" icon={Activity} />
          <StatCard label="Total Value" value={`₹${totalValue.toLocaleString()}`} sub="At cost price" icon={TrendingUp} color="#3F718B" />
          <StatCard label="Low Stock" value={String(lowStock)} sub="4 or fewer units" icon={AlertCircle} color={lowStock > 0 ? "#B84A4A" : "#1473E6"} />
        </div>
        <div className="bg-white rounded-md border border-[#DFE0D8] overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full text-sm">
              <TableHeader><TableRow className="bg-[#FFC400]/10">{["Name","Category","Price","Stock","Status","Actions"].map(h => <TableHead key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#755900] uppercase tracking-wide">{h}</TableHead>)}</TableRow></TableHeader>
              <TableBody className="divide-y divide-[#F7F7F3]">
                {items.map(item => (
                  <TableRow key={item.id} className="hover:bg-[#F7F7F3]/50">
                    <TableCell className="px-4 py-3 font-medium text-[#181A1F]">{item.name}</TableCell>
                    <TableCell className="px-4 py-3"><span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-medium">{item.category}</span></TableCell>
                    <TableCell className="px-4 py-3 font-semibold text-[#181A1F]">₹{item.price.toLocaleString()}</TableCell>
                    <TableCell className="px-4 py-3">
                      <span className={`font-semibold ${item.stock <= 4 ? "text-red-500" : "text-[#181A1F]"}`}>{item.stock}</span>
                      {item.stock <= 4 && <span className="ml-1 text-xs text-red-400">Low</span>}
                    </TableCell>
                    <TableCell className="px-4 py-3"><Badge text={item.active ? "Active" : "Inactive"} color={item.active ? "success" : "gray"} /></TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => toggleActive(item.id)} className="p-1.5 text-[#7D8178] hover:text-[#755900] hover:bg-[#FFC400]/5 rounded-md"><Edit2 size={13} /></button>
                        <button onClick={() => deleteItem(item.id)} className="p-1.5 text-[#7D8178] hover:text-red-500 hover:bg-red-50 rounded-md"><Trash2 size={13} /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-6 w-full max-w-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#181A1F]">Add Equipment Item</h3>
              <button onClick={() => setShowAdd(false)}><X size={18} className="text-[#7D8178]" /></button>
            </div>
            <div>
              <label className="text-xs font-medium text-[#464A45] mb-1 block">Item Name</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Yonex Badminton Racket" className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#464A45] mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]">
                {["Equipment","Consumable","Apparel","Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Price (₹)</label>
                <input value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="2500" className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Stock Qty</label>
                <input value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} placeholder="10" className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowAdd(false)} className="flex-1 border border-[#C9CBC2] rounded-md py-2.5 text-sm">Cancel</button>
              <button onClick={addItem} className="flex-1 bg-[#FFC400] text-[#17140A] rounded-md py-2.5 text-sm font-semibold">Add Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TrainerStudents() {
  const [students, setStudents] = useState(TRAINER_STUDENTS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", sport: "Badminton", nextSession: "" });

  const add = () => {
    setStudents(prev => [...prev, { id: Date.now(), ...form, sessions: 0, status: "active", progress: 0 }]);
    setShowAdd(false);
    setForm({ name: "", sport: "Badminton", nextSession: "" });
  };

  return (
    <div className="p-6 space-y-5">
      <PageHeader title="Student Management" subtitle={`${students.length} students · ${students.filter(s => s.status === "active").length} active`}
        action={<button onClick={() => setShowAdd(true)} className="bg-[#FFC400] text-[#17140A] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#D9A900] flex items-center gap-2"><Plus size={15} /> Add Student</button>} />
      <div className="grid sm:grid-cols-2 gap-4">
        {students.map(s => (
          <div key={s.id} className="bg-white rounded-md border border-[#DFE0D8] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FFC400]/15 flex items-center justify-center text-[#755900] font-bold">{s.name[0]}</div>
              <div className="flex-1">
                <div className="font-semibold text-[#181A1F]">{s.name}</div>
                <div className="text-xs text-[#5F635C]">{s.sport} · {s.sessions} sessions completed</div>
              </div>
              <Badge text={s.status} color={s.status === "active" ? "success" : "yellow"} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#5F635C]">Progress</span>
                <span className="font-semibold text-[#181A1F]">{s.progress}%</span>
              </div>
              <div className="bg-[#DFE0D8] rounded-full h-2">
                <div className="bg-[#FFC400] h-2 rounded-full transition-all" style={{ width: `${s.progress}%` }} />
              </div>
            </div>
            <div className="mt-3 text-xs text-[#7D8178] flex items-center gap-1.5">
              <Calendar size={11} /> Next: {s.nextSession}
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-6 w-full max-w-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#181A1F]">Add Student</h3>
              <button onClick={() => setShowAdd(false)}><X size={18} className="text-[#7D8178]" /></button>
            </div>
            {[
              { label: "Student Name", key: "name", placeholder: "Priya Sharma" },
              { label: "Next Session", key: "nextSession", placeholder: "Jul 15, 07:00" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">{f.label}</label>
                <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-[#464A45] mb-1 block">Sport</label>
              <select value={form.sport} onChange={e => setForm(p => ({ ...p, sport: e.target.value }))}
                className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]">
                {["Badminton", "Tennis", "Football", "Basketball", "Cricket"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowAdd(false)} className="flex-1 border border-[#C9CBC2] rounded-md py-2.5 text-sm">Cancel</button>
              <button onClick={add} className="flex-1 bg-[#FFC400] text-[#17140A] rounded-md py-2.5 text-sm font-semibold">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TrainerSchedule() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const slots = ["06:00", "07:00", "08:00", "09:00", "17:00", "18:00", "19:00"];

  const schedule: Record<string, string | null> = {
    "Mon_07:00": "Arjun M.", "Mon_08:00": "Rahul S.", "Wed_17:00": "Priya S.",
    "Thu_07:00": "Group A", "Fri_18:00": "Divya N.", "Sat_06:00": "Group B",
    "Sat_07:00": "Arjun M.", "Sun_06:00": "Group A",
  };

  return (
    <div className="p-6 space-y-5">
      <h3 className="font-bold text-[#181A1F]">Weekly Schedule</h3>
      <div className="bg-white rounded-md border border-[#DFE0D8] overflow-auto">
        <Table className="min-w-max w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 px-4 py-3 text-left text-xs font-semibold text-[#7D8178] sticky left-0 bg-white">Time</TableHead>
              {days.map(d => <TableHead key={d} className="px-4 py-3 text-xs font-semibold text-[#464A45] text-center w-28">{d}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {slots.map(t => (
              <TableRow key={t} className="border-t border-[#F7F7F3]">
                <TableCell className="px-4 py-2 text-xs text-[#7D8178] sticky left-0 bg-white">{t}</TableCell>
                {days.map(d => {
                  const key = `${d}_${t}`;
                  const student = schedule[key];
                  return (
                    <TableCell key={d} className="px-3 py-2 text-center">
                      {student ? (
                        <div className="bg-[#FFC400]/20 text-[#755900] text-xs font-semibold rounded-lg px-2 py-1.5 truncate">{student}</div>
                      ) : (
                        <div className="bg-[#F7F7F3] text-[#C9CBC2] text-xs rounded-lg px-2 py-1.5">—</div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function TrainerAttendance() {
  const [attendance, setAttendance] = useState(
    TRAINER_STUDENTS.map(s => ({ ...s, present: false, date: "Jul 10, 2026" }))
  );

  const toggle = (id: number) => setAttendance(prev => prev.map(s => s.id === id ? { ...s, present: !s.present } : s));

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[#181A1F]">Today's Attendance — Jul 10, 2026</h3>
        <div className="text-sm text-[#5F635C]">{attendance.filter(s => s.present).length}/{attendance.length} present</div>
      </div>
      <div className="bg-white rounded-md border border-[#DFE0D8] divide-y divide-[#F7F7F3]">
        {attendance.map(s => (
          <div key={s.id} className="px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FFC400]/15 flex items-center justify-center text-[#755900] font-bold shrink-0">{s.name[0]}</div>
            <div className="flex-1">
              <div className="font-semibold text-[#181A1F]">{s.name}</div>
              <div className="text-xs text-[#5F635C]">{s.sport}</div>
            </div>
            <button onClick={() => toggle(s.id)}
              className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${s.present ? "bg-sky-100 text-sky-600" : "bg-[#DFE0D8] text-[#7D8178]"}`}>
              <CheckCircle size={20} />
            </button>
          </div>
        ))}
      </div>
      <button className="bg-[#FFC400] text-[#17140A] w-full py-3 rounded-md font-semibold hover:bg-[#D9A900] transition-colors">
        Save Attendance
      </button>
    </div>
  );
}

export function TrainerRevenue() {
  return (
    <div className="p-6 space-y-5">
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="This Month" value="₹38,400" sub="48 sessions" icon={DollarSign} />
        <StatCard label="Pending Payout" value="₹12,800" sub="16 sessions" icon={Clock} color="#C08B3E" />
        <StatCard label="Total Earned" value="₹2.14L" sub="Lifetime" icon={TrendingUp} color="#3F718B" />
      </div>
      <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
        <h3 className="font-bold text-[#181A1F] mb-4">Monthly Earnings</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MONTHLY_REVENUE.slice(-6).map(d => ({ month: d.month, earnings: Math.round(d.revenue * 0.031) }))}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Earnings"]} />
            <Bar name="Earnings" dataKey="earnings" fill="#FFC400" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-md border border-[#DFE0D8] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#DFE0D8] font-bold text-[#181A1F]">Recent Transactions</div>
        <div className="divide-y divide-[#F7F7F3]">
          {[
            { student: "Arjun Mehta", date: "Jul 10", sport: "Badminton", amount: 800, status: "paid" },
            { student: "Priya Sharma", date: "Jul 9", sport: "Tennis", amount: 1000, status: "paid" },
            { student: "Group Batch A", date: "Jul 8", sport: "Badminton", amount: 1600, status: "pending" },
            { student: "Rahul Singh", date: "Jul 7", sport: "Badminton", amount: 800, status: "paid" },
          ].map((t, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-sky-50 flex items-center justify-center text-sky-500 shrink-0">
                <DollarSign size={15} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-[#181A1F]">{t.student}</div>
                <div className="text-xs text-[#7D8178]">{t.sport} · {t.date}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm text-[#181A1F]">₹{t.amount}</div>
                <Badge text={t.status} color={t.status === "paid" ? "success" : "yellow"} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TrainerProfile({ trainer, onUpdateTrainer }: { trainer: TrainerItem; onUpdateTrainer: (t: TrainerItem) => void }) {
  const [tab, setTab] = useState<"personal"|"professional"|"availability"|"banking"|"listing">("personal");
  const [saved, setSaved] = useState(false);

  // Controlled state for fields that propagate to B2C
  const [name, setName] = useState(trainer.name);
  const [bio, setBio] = useState(trainer.bio || "");
  const [sport, setSport] = useState(trainer.sport);
  const [location, setLocation] = useState(trainer.location);
  const [fee, setFee] = useState(String(trainer.fee));
  const [experience, setExperience] = useState(trainer.experience);
  const [cert, setCert] = useState(trainer.cert);
  const [specializations, setSpecializations] = useState((trainer.specializations || []).join(", "));
  const [coachingModes, setCoachingModes] = useState((trainer.coachingModes || ["Private"]).join(", "));
  const [levels, setLevels] = useState((trainer.levels || ["All Levels"]).join(", "));
  const [languages, setLanguages] = useState((trainer.languages || ["English", "Hindi"]).join(", "));
  const [ageGroups, setAgeGroups] = useState((trainer.ageGroups || ["10 years and above"]).join(", "));
  const [responseTime, setResponseTime] = useState(trainer.responseTime || "< 4 hours");
  const [groupFee, setGroupFee] = useState(String(trainer.groupFee || 350));
  const [onlineFee, setOnlineFee] = useState(String(trainer.onlineFee || 600));
  const [homeVenue, setHomeVenue] = useState(trainer.homeVenue || "");
  const [methodology, setMethodology] = useState(trainer.methodology || "");
  const [listingStatus, setListingStatus] = useState(trainer.listingStatus);
  const [published, setPublished] = useState(trainer.published);

  const isLive = published && listingStatus === "active";

  const save = () => {
    const updated: TrainerItem = {
      ...trainer,
      name,
      bio,
      sport,
      location,
      fee: Number(fee) || trainer.fee,
      experience,
      cert,
      specializations: specializations.split(",").map(s => s.trim()).filter(Boolean),
      coachingModes: coachingModes.split(",").map(s => s.trim()).filter(Boolean),
      levels: levels.split(",").map(s => s.trim()).filter(Boolean),
      languages: languages.split(",").map(s => s.trim()).filter(Boolean),
      ageGroups: ageGroups.split(",").map(s => s.trim()).filter(Boolean),
      responseTime,
      groupFee: Number(groupFee) || 0,
      onlineFee: Number(onlineFee) || 0,
      homeVenue,
      methodology,
      listingStatus,
      published,
    };
    onUpdateTrainer(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inp = (label: string, value: string, onChange: (v: string) => void, opts?: { type?: string; mono?: boolean; placeholder?: string }) => (
    <div key={label}>
      <label className="block text-xs font-semibold text-[#5F635C] mb-1.5 uppercase tracking-wide">{label}</label>
      <input type={opts?.type || "text"} value={value} onChange={e => onChange(e.target.value)} placeholder={opts?.placeholder}
        className={`w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm text-[#181A1F] focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500] ${opts?.mono ? "font-mono" : ""}`} />
    </div>
  );

  // For fields not connected to B2C, use uncontrolled
  const inpStatic = (label: string, defaultValue: string, opts?: { type?: string; mono?: boolean; placeholder?: string }) => (
    <div key={label}>
      <label className="block text-xs font-semibold text-[#5F635C] mb-1.5 uppercase tracking-wide">{label}</label>
      <input type={opts?.type || "text"} defaultValue={defaultValue} placeholder={opts?.placeholder}
        className={`w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm text-[#181A1F] focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500] ${opts?.mono ? "font-mono" : ""}`} />
    </div>
  );

  const TABS: { id: "personal"|"professional"|"availability"|"banking"|"listing"; label: string }[] = [
    { id: "personal", label: "Personal" }, { id: "professional", label: "Professional" },
    { id: "availability", label: "Availability" }, { id: "banking", label: "Banking" },
    { id: "listing", label: "Listing & Publish" },
  ];

  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* B2C status banner */}
      {isLive ? (
        <div className="flex items-center gap-3 bg-sky-50 border border-sky-200 rounded-md px-4 py-3">
          <Globe size={16} className="text-sky-600 shrink-0" />
          <span className="text-sm text-sky-800 font-medium">Your coaching profile is <strong>live</strong> on the Find Coaches page and visible to all players.</span>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
          <AlertCircle size={16} className="text-amber-500 shrink-0" />
          <span className="text-sm text-amber-800">Your profile is <strong>not visible</strong> to players yet. Go to <button onClick={() => setTab("listing")} className="underline font-semibold">Listing & Publish</button> to go live.</span>
        </div>
      )}

      <div className="bg-white rounded-md border border-[#DFE0D8] p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <div className="w-20 h-20 bg-[#FFC400]/10 rounded-md flex items-center justify-center text-[#755900] text-3xl font-bold">{initials}</div>
            <button aria-label="Upload" className="absolute -bottom-1 -right-1 bg-[#FFC400] p-1.5 rounded-full"><Upload size={12} className="text-[#17140A]" /></button>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#181A1F]">{name}</h2>
            <div className="text-[#5F635C] text-sm">{location}</div>
            <div className="flex gap-2 mt-1.5">
              {trainer.verified && <Badge text="Certified Coach" color="success" />}
              <div className="flex items-center gap-1 text-sm"><Star size={13} className="text-yellow-400 fill-yellow-400" /><span className="font-semibold">{trainer.rating}</span></div>
              <Badge text={isLive ? "Live" : listingStatus === "pending_review" ? "Pending Review" : "Draft"} color={isLive ? "success" : listingStatus === "pending_review" ? "yellow" : "gray"} />
            </div>
          </div>
        </div>

        <div className="flex gap-1 bg-[#DFE0D8] rounded-md p-1 w-fit mb-6 flex-wrap">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t.id ? "bg-white text-[#181A1F] shadow-sm" : "text-[#5F635C] hover:text-[#30342F]"}`}>
              {t.label}
              {t.id === "listing" && isLive && <span className="ml-1.5 w-2 h-2 bg-sky-400 rounded-full inline-block" />}
            </button>
          ))}
        </div>

        {tab === "personal" && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {inp("Full Name", name, setName)}
              {inpStatic("Display Name / Coach Name", name.replace("Coach ", "Coach "))}
              {inpStatic("Email Address", "coach@gmail.com", { type: "email" })}
              {inpStatic("Phone Number", "+91 98765 11111", { type: "tel" })}
              {inpStatic("Date of Birth", "1988-03-15", { type: "date" })}
              {inpStatic("Gender", "Male")}
              {inpStatic("Blood Group", "O+")}
              {inpStatic("Nationality", "Indian")}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#181A1F] mb-3">Address</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {inp("City / Area", location, setLocation)}
                {inpStatic("State", "Karnataka")}
                {inpStatic("Pincode", "560038")}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#181A1F] mb-3">Emergency Contact</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {inpStatic("Emergency Contact Name", "Sunita Kumar")}
                {inpStatic("Relationship", "Spouse")}
                {inpStatic("Emergency Phone", "+91 98765 22222", { type: "tel" })}
              </div>
            </div>
          </div>
        )}

        {tab === "professional" && (
          <div className="space-y-5">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-xs text-blue-700">
              Fields marked with <span className="font-semibold">★</span> are shown on your public coaching profile in B2C.
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {inp("★ Primary Sport", sport, setSport)}
              {inp("★ Experience", experience, setExperience)}
              {inp("★ Coaching Certification", cert, setCert)}
              {inp("★ Session Fee — Private 1:1 (₹/hr)", fee, setFee)}
              {inpStatic("Secondary Sports", "Fitness Training")}
              {inpStatic("Highest Playing Level", "State Level")}
              {inp("★ Group Fee (₹/person/hr)", groupFee, setGroupFee)}
              {inp("★ Online Fee (₹/hr)", onlineFee, setOnlineFee)}
              {inp("★ Coaching Modes", coachingModes, setCoachingModes, { placeholder: "Private, Group, Online" })}
              {inp("★ Skill Levels", levels, setLevels, { placeholder: "Beginner, Intermediate, Advanced" })}
              {inp("★ Languages", languages, setLanguages)}
              {inp("★ Age Groups", ageGroups, setAgeGroups)}
              {inp("★ Typical Response Time", responseTime, setResponseTime)}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5F635C] mb-1.5 uppercase tracking-wide">★ Coach Bio <span className="text-[#7D8178] normal-case font-normal">(shown on profile)</span></label>
              <textarea value={bio} onChange={e => setBio(e.target.value)}
                rows={4} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm text-[#181A1F] focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500] resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5F635C] mb-1.5 uppercase tracking-wide">★ Specializations <span className="text-[#7D8178] normal-case font-normal">(comma-separated)</span></label>
              <input value={specializations} onChange={e => setSpecializations(e.target.value)} placeholder="Footwork, Smash Technique, Tournament Prep"
                className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm text-[#181A1F] focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500]" />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {specializations.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                  <span key={s} className="text-xs bg-[#FFC400]/10 text-[#755900] px-2.5 py-1 rounded-full font-medium">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5F635C] mb-1.5 uppercase tracking-wide">★ Coaching Methodology</label>
              <textarea value={methodology} onChange={e => setMethodology(e.target.value)}
                rows={3} placeholder="Explain how you assess, coach, and measure player progress."
                className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm text-[#181A1F] focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500] resize-none" />
            </div>
          </div>
        )}

        {tab === "availability" && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {inp("★ Home Venue / Academy Name", homeVenue, setHomeVenue)}
              {inpStatic("Venue Address", "42, Indiranagar, Bangalore")}
              {inpStatic("Will Travel Radius (km)", "10")}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#181A1F] mb-3">Weekly Availability</h3>
              <div className="space-y-2">
                {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => (
                  <div key={day} className="flex items-center gap-4 p-3 bg-[#F7F7F3] rounded-md">
                    <div className="w-24 text-sm font-medium text-[#30342F]">{day}</div>
                    <input placeholder="06:00" defaultValue={day === "Sunday" ? "" : "06:00"} className="border border-[#C9CBC2] rounded-md px-3 py-1.5 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30" />
                    <span className="text-[#7D8178] text-sm">–</span>
                    <input placeholder="20:00" defaultValue={day === "Sunday" ? "" : "21:00"} className="border border-[#C9CBC2] rounded-md px-3 py-1.5 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30" />
                    <span className="text-xs text-[#7D8178]">{day === "Sunday" ? "Off" : "Available"}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {inpStatic("Max Students (per week)", "20")}
              {inpStatic("Max Sessions (per day)", "6")}
            </div>
          </div>
        )}

        {tab === "banking" && (
          <div className="space-y-5">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800">
              <strong>Required for payouts.</strong> Session fees are credited to this account within T+2 business days.
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {inpStatic("Account Holder Name", "Rajesh Kumar")}
              {inpStatic("Bank Name", "HDFC Bank")}
              {inpStatic("Account Number", "XXXX XXXX 5621", { mono: true })}
              {inpStatic("IFSC Code", "HDFC0002345", { mono: true })}
              {inpStatic("Account Type", "Savings Account")}
              {inpStatic("Branch", "Indiranagar, Bangalore")}
              {inpStatic("UPI ID (Optional)", "rajesh@hdfcbank", { mono: true })}
              {inpStatic("PAN Number", "AABPR1332L", { mono: true })}
            </div>
          </div>
        )}

        {tab === "listing" && (
          <div className="space-y-5">
            <div className="bg-[#F7F7F3] border border-[#DFE0D8] rounded-md p-4 space-y-1">
              <p className="text-sm font-semibold text-[#181A1F]">How B2C visibility works</p>
              <p className="text-xs text-[#5F635C]">When your listing is <strong>Published</strong> and status is <strong>Active</strong>, your profile appears in Find Coaches for all players. Toggle off to hide from discovery while keeping your dashboard active.</p>
            </div>

            {/* Current status */}
            <div className="flex items-center justify-between p-4 border border-[#C9CBC2] rounded-md">
              <div>
                <p className="text-sm font-semibold text-[#181A1F]">Listing Status</p>
                <p className="text-xs text-[#5F635C] mt-0.5">Controls whether players can find you in search</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  text={listingStatus === "active" ? "Active" : listingStatus === "pending_review" ? "Pending Review" : listingStatus === "suspended" ? "Suspended" : "Draft"}
                  color={listingStatus === "active" ? "success" : listingStatus === "pending_review" ? "yellow" : listingStatus === "suspended" ? "red" : "gray"} />
                {listingStatus !== "suspended" && (
                  <select value={listingStatus} onChange={e => setListingStatus(e.target.value as any)}
                    className="text-xs border border-[#C9CBC2] rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="pending_review">Submit for Review</option>
                  </select>
                )}
              </div>
            </div>

            {/* Publish toggle */}
            <div className="flex items-center justify-between p-4 border border-[#C9CBC2] rounded-md">
              <div>
                <p className="text-sm font-semibold text-[#181A1F]">Published to Find Coaches</p>
                <p className="text-xs text-[#5F635C] mt-0.5">Requires Active status. Players can see and contact you.</p>
              </div>
              <button
                disabled={listingStatus === "suspended"}
                onClick={() => setPublished(p => !p)}
                className={`relative w-12 h-6 rounded-full transition-colors ${published && listingStatus !== "suspended" ? "bg-[#FFC400]" : "bg-[#C9CBC2]"} ${listingStatus === "suspended" ? "opacity-40 cursor-not-allowed" : ""}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${published && listingStatus !== "suspended" ? "translate-x-6" : ""}`} />
              </button>
            </div>

            {/* Live preview summary */}
            <div className="border border-dashed border-[#C9CBC2] rounded-md p-4">
              <p className="text-xs font-semibold text-[#5F635C] mb-3 uppercase tracking-wide">Live Preview — What Players See</p>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-[#FFC400]/10 rounded-md flex items-center justify-center text-[#755900] font-bold text-lg shrink-0">{initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#181A1F] text-sm">{name}</p>
                  <p className="text-xs text-[#5F635C]">{sport} · {experience} · {location}</p>
                  <p className="text-xs text-[#464A45] mt-1 line-clamp-2">{bio || "No bio added yet."}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {specializations.split(",").map(s => s.trim()).filter(Boolean).slice(0, 3).map(s => (
                      <span key={s} className="text-xs bg-[#DFE0D8] text-[#464A45] px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-[#755900] text-sm">₹{fee}/hr</p>
                  <div className="flex items-center gap-1 text-xs text-[#5F635C]"><Star size={11} className="text-yellow-400 fill-yellow-400" />{trainer.rating}</div>
                </div>
              </div>
            </div>

            {listingStatus === "suspended" && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-md p-4">
                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Listing Suspended</p>
                  <p className="text-xs text-red-600 mt-0.5">Your listing has been suspended by the admin. Contact support@inspirq.in to appeal.</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-5 mt-5 border-t border-[#F7F7F3]">
          {saved && <span className="flex items-center gap-1.5 text-sm text-sky-600 font-medium"><CheckCircle size={15} /> Profile saved and {isLive ? "live on Find Coaches" : "updated"}</span>}
          <button onClick={save} className="ml-auto flex items-center gap-2 bg-[#FFC400] text-[#17140A] text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-[#D9A900] transition-colors">
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>

      <KYCSection />
    </div>
  );
}

function KYCSection() {
  const [status, setStatus] = useState<"unverified" | "submitted" | "verified">("unverified");
  const [docs, setDocs] = useState({ aadhar: "", pan: "", cert: "" });

  if (status === "verified") {
    return (
      <div className="bg-white rounded-md border border-[#DFE0D8] p-6">
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck size={22} className="text-[#755900]" />
          <h3 className="font-bold text-[#181A1F]">KYC Verification</h3>
          <span className="ml-auto text-xs bg-sky-100 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1"><CheckCircle size={12} /> Verified</span>
        </div>
        <p className="text-sm text-[#5F635C]">Your identity and coaching certification have been verified. The Verified Coach badge is active on your profile.</p>
      </div>
    );
  }

  if (status === "submitted") {
    return (
      <div className="bg-white rounded-md border border-[#DFE0D8] p-6">
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck size={22} className="text-amber-500" />
          <h3 className="font-bold text-[#181A1F]">KYC Verification</h3>
          <span className="ml-auto text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-semibold">Under Review</span>
        </div>
        <p className="text-sm text-[#5F635C] mb-4">Your documents are under review. Verification typically takes 24–48 working hours.</p>
        <button onClick={() => setStatus("verified")} className="text-xs text-[#755900] hover:underline">Simulate approval (demo)</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md border border-[#DFE0D8] p-6 space-y-4">
      <div className="flex items-center gap-3">
        <ShieldCheck size={22} className="text-[#7D8178]" />
        <div>
          <h3 className="font-bold text-[#181A1F]">KYC Verification</h3>
          <p className="text-xs text-[#5F635C]">Get the Verified Coach badge by submitting your documents</p>
        </div>
        <span className="ml-auto text-xs bg-[#DFE0D8] text-[#5F635C] px-2.5 py-1 rounded-full font-semibold">Unverified</span>
      </div>
      <div className="bg-amber-50 rounded-md p-3 border border-amber-100 text-sm text-amber-700">
        Verified coaches get <strong>3× more enquiries</strong> and appear higher in search results.
      </div>
      {[
        { label: "Aadhar Card Number", key: "aadhar", placeholder: "XXXX XXXX XXXX" },
        { label: "PAN Card Number", key: "pan", placeholder: "ABCDE1234F" },
        { label: "Coaching Certification Number", key: "cert", placeholder: "BWF-L2-12345" },
      ].map(f => (
        <div key={f.key}>
          <label className="text-xs font-medium text-[#464A45] mb-1.5 block">{f.label}</label>
          <input value={(docs as any)[f.key]} onChange={e => setDocs(p => ({ ...p, [f.key]: e.target.value }))}
            placeholder={f.placeholder}
            className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
        </div>
      ))}
      <div className="border-2 border-dashed border-[#C9CBC2] rounded-md p-5 text-center">
        <Upload size={22} className="text-[#A5A89E] mx-auto mb-2" />
        <p className="text-sm text-[#5F635C]">Upload document photos / scans</p>
        <p className="text-xs text-[#7D8178] mt-0.5">JPG, PNG, PDF · Max 5MB each</p>
        <button className="mt-3 text-xs bg-[#DFE0D8] px-4 py-2 rounded-lg text-[#464A45] hover:bg-[#C9CBC2]">Choose Files</button>
      </div>
      <button
        onClick={() => { if (docs.aadhar && docs.pan && docs.cert) setStatus("submitted"); }}
        className="w-full bg-[#FFC400] text-[#17140A] py-3 rounded-md font-semibold hover:bg-[#D9A900] transition-colors">
        Submit for Verification
      </button>
    </div>
  );
}
