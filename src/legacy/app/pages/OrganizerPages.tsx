import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/SmartTable";
import { useState } from "react";
import {
  Trophy, Users, Calendar, DollarSign, TrendingUp, MapPin, Plus, X,
  Edit2, Trash2, ChevronRight, Star, CheckCircle, Activity,
  Clock, BarChart2, FileText, Globe, Eye, EyeOff, Lock
} from "lucide-react";
import { MONTHLY_REVENUE, TOURNAMENTS } from "../data";
import type { TournamentItem } from "../data";
import { StatCard, Badge, ImageUpload } from "../components";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const ORG_REGISTRATIONS = [
  { id: 1, name: "Arjun Mehta", tournament: "Bangalore Badminton Open", sport: "Badminton", date: "Jul 5, 2026", fee: 500, status: "confirmed" },
  { id: 2, name: "Priya Sharma", tournament: "City Tennis Championship", sport: "Tennis", date: "Jul 4, 2026", fee: 800, status: "confirmed" },
  { id: 3, name: "Rohit Kumar", tournament: "Football League Season 3", sport: "Football", date: "Jul 3, 2026", fee: 300, status: "pending" },
  { id: 4, name: "Divya Nair", tournament: "Bangalore Badminton Open", sport: "Badminton", date: "Jul 6, 2026", fee: 500, status: "confirmed" },
  { id: 5, name: "Vikram Singh", tournament: "City Tennis Championship", sport: "Tennis", date: "Jul 2, 2026", fee: 800, status: "refunded" },
];

export function OrganizerDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-[#FFC400] to-[#D9A900] rounded-md p-6 text-[#17140A]">
        <h2 className="text-xl font-bold mb-1">Good morning, SportsFest 👋</h2>
        <p className="text-[#3B310F] text-sm">3 active tournaments. 124 registrations this week.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Tournaments" value="3" sub="2 upcoming" icon={Trophy} />
        <StatCard label="Total Participants" value="486" sub="↑ 124 this week" icon={Users} color="#3F718B" />
        <StatCard label="Monthly Revenue" value="₹2.4L" sub="↑ 32% vs last" icon={DollarSign} color="#C08B3E" />
        <StatCard label="Completion Rate" value="94%" sub="Tournaments completed" icon={Activity} color="#B84A4A" />
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
          <h3 className="font-bold text-[#181A1F] mb-4">Registrations by Tournament</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={TOURNAMENTS.map(t => ({ name: t.name.split(" ").slice(0, 2).join(" "), registrations: t.filled }))}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar name="Registrations" dataKey="registrations" fill="#FFC400" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
          <h3 className="font-bold text-[#181A1F] mb-4">Recent Registrations</h3>
          <div className="space-y-2.5">
            {ORG_REGISTRATIONS.slice(0, 4).map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-[#F7F7F3] rounded-md">
                <div className="w-8 h-8 rounded-full bg-[#FFC400]/15 flex items-center justify-center text-[#755900] font-bold text-sm shrink-0">{r.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#181A1F] truncate">{r.name}</div>
                  <div className="text-xs text-[#5F635C] truncate">{r.tournament}</div>
                </div>
                <div className="text-sm font-bold text-[#181A1F] shrink-0">₹{r.fee}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const EMPTY_FORM = { name: "", sport: "Badminton", date: "", venue: "", slots: "", fee: "", prize: "", description: "", image: "" };

export function OrganizerTournaments({ tournaments, onAddTournament, onUpdateTournament, onDeleteTournament }: {
  tournaments: TournamentItem[];
  onAddTournament: (t: TournamentItem) => void;
  onUpdateTournament: (t: TournamentItem) => void;
  onDeleteTournament: (id: number) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const liveCount = tournaments.filter(t => t.published && t.listingStatus === "active").length;
  const draftCount = tournaments.filter(t => !t.published || t.listingStatus === "draft").length;

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (t: TournamentItem) => {
    setForm({ name: t.name, sport: t.sport, date: t.date, venue: t.venue, slots: String(t.slots), fee: String(t.fee), prize: t.prize, description: t.description || "", image: t.image || "" });
    setEditId(t.id);
    setShowForm(true);
  };

  const submit = () => {
    if (!form.name.trim()) return;
    if (editId !== null) {
      const existing = tournaments.find(t => t.id === editId)!;
      onUpdateTournament({ ...existing, ...form, slots: Number(form.slots) || existing.slots, fee: Number(form.fee) || existing.fee });
    } else {
      onAddTournament({
        id: Date.now(), name: form.name, sport: form.sport, date: form.date, venue: form.venue,
        slots: Number(form.slots) || 32, fee: Number(form.fee) || 0, prize: form.prize,
        filled: 0, status: "open", organizer: "SportsFest", image: form.image, description: form.description,
        listingStatus: "draft" as any, published: false, createdBy: "organizer",
      } as TournamentItem);
    }
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const togglePublish = (t: TournamentItem) => {
    const nowPublished = !t.published;
    onUpdateTournament({ ...t, published: nowPublished, listingStatus: nowPublished ? "active" as any : "draft" as any });
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[#30342F]">{tournaments.length} tournaments</span>
          <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-medium">{liveCount} live</span>
          {draftCount > 0 && <span className="text-xs bg-[#DFE0D8] text-[#5F635C] px-2 py-0.5 rounded-full font-medium">{draftCount} draft</span>}
        </div>
        <button onClick={openCreate} className="bg-[#FFC400] text-[#17140A] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#D9A900] flex items-center gap-2">
          <Plus size={15} /> Create Tournament
        </button>
      </div>

      {/* B2C info banner */}
      <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-md px-4 py-3">
        <Globe size={14} className="text-blue-500 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-700">Tournaments with <strong>Active</strong> status and <strong>Published</strong> toggled ON appear in the B2C Find Tournaments page. Draft tournaments are only visible here.</p>
      </div>

      {tournaments.length === 0 && (
        <div className="text-center py-16 text-[#7D8178]">
          <Trophy size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No tournaments yet. Create your first one!</p>
        </div>
      )}

      <div className="space-y-4">
        {tournaments.map(t => {
          const isLive = t.published && t.listingStatus === "active";
          return (
            <div key={t.id} className={`bg-white rounded-md border overflow-hidden ${isLive ? "border-sky-200" : "border-[#DFE0D8]"}`}>
              {isLive && <div className="bg-sky-500 text-white text-xs font-semibold px-4 py-1 flex items-center gap-1.5"><Globe size={11} /> Live on Find Tournaments</div>}
              {t.image && (
                <div className="relative h-40 overflow-hidden">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = "/inspirq-media/badminton.png"; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-bold text-white text-base leading-tight drop-shadow">{t.name}</h3>
                  </div>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div>
                    {!t.image && <h3 className="font-bold text-[#181A1F] mb-0.5">{t.name}</h3>}
                    <p className="text-xs text-[#5F635C] mt-0.5">{t.sport} · {t.venue}</p>
                    {t.description && <p className="text-xs text-[#7D8178] mt-1 max-w-xl leading-relaxed">{t.description}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge text={t.listingStatus === "active" ? "Active" : t.listingStatus === "pending_review" ? "Pending" : "Draft"}
                      color={t.listingStatus === "active" ? "success" : t.listingStatus === "pending_review" ? "yellow" : "gray"} />
                    <button onClick={() => openEdit(t)} className="p-1.5 text-[#7D8178] hover:text-[#464A45] hover:bg-[#DFE0D8] rounded-md"><Edit2 size={14} /></button>
                    <button onClick={() => onDeleteTournament(t.id)} className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-md"><Trash2 size={14} /></button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
                  <div><span className="text-[#7D8178] block text-xs mb-0.5">Date</span><span className="font-semibold text-[#181A1F]">{t.date}</span></div>
                  <div><span className="text-[#7D8178] block text-xs mb-0.5">Prize Pool</span><span className="font-semibold text-sky-600">{t.prize}</span></div>
                  <div><span className="text-[#7D8178] block text-xs mb-0.5">Entry Fee</span><span className="font-semibold text-[#181A1F]">₹{t.fee}</span></div>
                  <div><span className="text-[#7D8178] block text-xs mb-0.5">Slots</span><span className="font-semibold text-[#181A1F]">{t.filled}/{t.slots}</span></div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 bg-[#DFE0D8] rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all ${t.filled === t.slots ? "bg-red-400" : t.filled / t.slots > 0.7 ? "bg-amber-400" : "bg-[#FFC400]"}`}
                      style={{ width: `${(t.filled / t.slots) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-[#7D8178]">{Math.round((t.filled / t.slots) * 100)}% full</span>
                </div>

                {/* Publish toggle */}
                <div className="flex items-center justify-between pt-3 border-t border-[#F7F7F3]">
                  <span className="text-xs text-[#5F635C]">
                    {isLive ? <span className="flex items-center gap-1 text-sky-600 font-medium"><Eye size={12} /> Visible to players</span>
                      : <span className="flex items-center gap-1 text-[#7D8178]"><EyeOff size={12} /> Hidden from players</span>}
                  </span>
                  <button
                    onClick={() => togglePublish(t)}
                    className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors ${isLive ? "border-red-200 text-red-600 hover:bg-red-50" : "border-[#D6A500] text-[#755900] hover:bg-sky-50"}`}>
                    {isLive ? <><EyeOff size={12} /> Unpublish</> : <><Globe size={12} /> Publish to B2C</>}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-6 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#181A1F]">{editId ? "Edit Tournament" : "Create Tournament"}</h3>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-[#7D8178]" /></button>
            </div>
            {[
              { label: "Tournament Name", key: "name", placeholder: "Bangalore Open 2026" },
              { label: "Venue", key: "venue", placeholder: "Court Masters Arena" },
              { label: "Prize Pool", key: "prize", placeholder: "₹50,000" },
              { label: "Entry Fee (₹)", key: "fee", placeholder: "500" },
              { label: "Max Slots", key: "slots", placeholder: "32" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">{f.label}</label>
                <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-[#464A45] mb-2 block">Cover Image</label>
              <ImageUpload value={form.image} onChange={image => setForm(p => ({ ...p, image }))} label="Upload tournament cover" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#464A45] mb-1 block">Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="Brief tournament overview..."
                className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500] resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Sport</label>
                <select value={form.sport} onChange={e => setForm(p => ({ ...p, sport: e.target.value }))}
                  className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]">
                  {["Badminton", "Tennis", "Football", "Basketball", "Cricket"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Date</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
              </div>
            </div>
            {!editId && (
              <div className="bg-amber-50 border border-amber-100 rounded-md p-3 text-xs text-amber-700">
                New tournaments are saved as <strong>Draft</strong>. Use the Publish button to make them visible to players.
              </div>
            )}
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-[#C9CBC2] rounded-md py-2.5 text-sm">Cancel</button>
              <button onClick={submit} className="flex-1 bg-[#FFC400] text-[#17140A] rounded-md py-2.5 text-sm font-semibold">{editId ? "Save Changes" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function OrganizerRegistrations() {
  const [registrations, setRegistrations] = useState(ORG_REGISTRATIONS);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? registrations : registrations.filter(r => r.status === filter);
  const confirm = (id: number) => setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: "confirmed" } : r));

  return (
    <div className="p-6 space-y-5">
      <div className="grid sm:grid-cols-4 gap-3">
        {[
          { label: "Total", count: registrations.length, color: "gray" },
          { label: "Confirmed", count: registrations.filter(r => r.status === "confirmed").length, color: "success" },
          { label: "Pending", count: registrations.filter(r => r.status === "pending").length, color: "yellow" },
          { label: "Refunded", count: registrations.filter(r => r.status === "refunded").length, color: "red" },
        ].map(s => (
          <button key={s.label} onClick={() => setFilter(s.label.toLowerCase())}
            className={`bg-white rounded-md border p-4 text-left hover:shadow-sm transition-all ${filter === s.label.toLowerCase() ? "border-[#D6A500]" : "border-[#DFE0D8]"}`}>
            <div className="text-2xl font-bold text-[#181A1F]">{s.count}</div>
            <div className="text-sm text-[#5F635C]">{s.label}</div>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-md border border-[#DFE0D8] overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[600px]">
            <TableHeader className="bg-[#FFC400]/10">
              <TableRow>
                {["Participant", "Tournament", "Sport", "Date", "Fee", "Status", "Action"].map(h => (
                  <TableHead key={h} className="text-left text-xs font-semibold text-[#755900] px-4 py-3">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#F7F7F3]">
              {filtered.map(r => (
                <TableRow key={r.id} className="hover:bg-[#F7F7F3]/50">
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#FFC400]/15 flex items-center justify-center text-[#755900] text-xs font-bold">{r.name[0]}</div>
                      <span className="text-sm font-medium text-[#181A1F]">{r.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-[#464A45] max-w-[160px] truncate">{r.tournament}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-[#464A45]">{r.sport}</TableCell>
                  <TableCell className="px-4 py-3 text-xs text-[#5F635C]">{r.date}</TableCell>
                  <TableCell className="px-4 py-3 text-sm font-bold text-[#181A1F]">₹{r.fee}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge text={r.status} color={r.status === "confirmed" ? "success" : r.status === "pending" ? "yellow" : "red"} />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {r.status === "pending" && (
                      <button onClick={() => confirm(r.id)} className="text-xs bg-sky-50 text-sky-600 px-2.5 py-1 rounded-lg font-medium">
                        Confirm
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export function OrganizerBrackets() {
  const [selectedTournament, setSelectedTournament] = useState(TOURNAMENTS[0]?.name ?? "");

  const r16 = [
    ["Arjun M.", "Rahul S."], ["Priya T.", "Divya N."], ["Vikram K.", "Ankit P."], ["Suresh R.", "Deepak M."],
  ];
  const qf = [["Arjun M.", "Priya T."], ["Vikram K.", "Suresh R."]];
  const sf = [["Arjun M.", "?"]];
  const final = [["TBD", "TBD"]];

  const BracketMatch = ({ p1, p2, winner }: { p1: string; p2: string; winner?: number }) => (
    <div className="bg-white border border-[#DFE0D8] rounded-md overflow-hidden text-sm w-40 shadow-sm">
      <div className={`px-3 py-2 border-b border-[#F7F7F3] flex items-center justify-between ${winner === 1 ? "bg-sky-50" : ""}`}>
        <span className={winner === 1 ? "font-bold text-sky-700" : "text-[#30342F]"}>{p1}</span>
        {winner === 1 && <CheckCircle size={12} className="text-sky-500" />}
      </div>
      <div className={`px-3 py-2 flex items-center justify-between ${winner === 2 ? "bg-sky-50" : ""}`}>
        <span className={winner === 2 ? "font-bold text-sky-700" : "text-[#30342F]"}>{p2}</span>
        {winner === 2 && <CheckCircle size={12} className="text-sky-500" />}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <select value={selectedTournament} onChange={e => setSelectedTournament(e.target.value)}
          className="border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500] bg-white">
          {TOURNAMENTS.map(t => <option key={t.id}>{t.name}</option>)}
        </select>
        <Badge text="Single Elimination" color="blue" />
        <Badge text="Round of 16" color="gray" />
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex items-start gap-8 min-w-max">
          <div>
            <div className="text-xs font-semibold text-[#7D8178] mb-3 uppercase tracking-wide">Round of 16</div>
            <div className="flex flex-col gap-4">
              {r16.map(([p1, p2], i) => <BracketMatch key={i} p1={p1} p2={p2} winner={1} />)}
            </div>
          </div>
          <div className="flex items-center self-stretch">
            <ChevronRight size={20} className="text-[#A5A89E]" />
          </div>
          <div className="flex flex-col justify-around" style={{ height: "310px" }}>
            <div className="text-xs font-semibold text-[#7D8178] mb-3 uppercase tracking-wide">Quarterfinals</div>
            {qf.map(([p1, p2], i) => <BracketMatch key={i} p1={p1} p2={p2} winner={1} />)}
          </div>
          <div className="flex items-center self-stretch">
            <ChevronRight size={20} className="text-[#A5A89E]" />
          </div>
          <div className="flex flex-col justify-around" style={{ height: "310px" }}>
            <div className="text-xs font-semibold text-[#7D8178] mb-3 uppercase tracking-wide">Semifinals</div>
            {sf.map(([p1, p2], i) => <BracketMatch key={i} p1={p1} p2={p2} />)}
          </div>
          <div className="flex items-center self-stretch">
            <ChevronRight size={20} className="text-[#A5A89E]" />
          </div>
          <div className="flex flex-col justify-around" style={{ height: "310px" }}>
            <div className="text-xs font-semibold text-[#7D8178] mb-3 uppercase tracking-wide">Final 🏆</div>
            {final.map(([p1, p2], i) => <BracketMatch key={i} p1={p1} p2={p2} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrganizerRevenue() {
  return (
    <div className="p-6 space-y-5">
      <div className="grid sm:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value="₹2.4L" sub="This month" icon={DollarSign} />
        <StatCard label="Platform Cut" value="₹24,000" sub="10% of revenue" icon={TrendingUp} color="#B84A4A" />
        <StatCard label="Net Earnings" value="₹2.16L" sub="After platform fee" icon={CheckCircle} color="#3F718B" />
        <StatCard label="Pending Payout" value="₹48,000" sub="Processing" icon={Activity} color="#C08B3E" />
      </div>
      <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
        <h3 className="font-bold text-[#181A1F] mb-4">Revenue by Tournament</h3>
        <div className="space-y-3">
          {TOURNAMENTS.map(t => {
            const revenue = t.filled * t.fee;
            const max = Math.max(...TOURNAMENTS.map(x => x.filled * x.fee));
            return (
              <div key={t.id} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#181A1F] truncate">{t.name}</span>
                    <span className="text-sm font-bold text-[#181A1F] ml-2 shrink-0">₹{revenue.toLocaleString()}</span>
                  </div>
                  <div className="bg-[#DFE0D8] rounded-full h-2">
                    <div className="bg-[#FFC400] h-2 rounded-full" style={{ width: `${(revenue / max) * 100}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function OrganizerAnalytics() {
  const sportData = [
    { name: "Badminton", value: 42, fill: "#FFC400" },
    { name: "Football", value: 28, fill: "#3F718B" },
    { name: "Tennis", value: 18, fill: "#C08B3E" },
    { name: "Basketball", value: 12, fill: "#B84A4A" },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="grid sm:grid-cols-4 gap-4">
        <StatCard label="Total Participants" value="486" sub="↑ 18% vs last month" icon={Users} />
        <StatCard label="Completion Rate" value="94%" sub="Tournaments completed" icon={CheckCircle} color="#FFC400" />
        <StatCard label="Avg Registration" value="38/event" sub="Across all tournaments" icon={Trophy} color="#C08B3E" />
        <StatCard label="Revenue / Participant" value="₹494" sub="Avg entry fee collected" icon={DollarSign} color="#3F718B" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
          <h3 className="font-bold text-[#181A1F] mb-4">Registrations Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MONTHLY_REVENUE.slice(-6).map(d => ({ month: d.month, registrations: Math.round(d.revenue / 2400) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line name="Registrations" type="monotone" dataKey="registrations" stroke="#FFC400" strokeWidth={2.5} dot={{ fill: "#FFC400", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
          <h3 className="font-bold text-[#181A1F] mb-4">Participants by Sport</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={sportData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {sportData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 shrink-0">
              {sportData.map(s => (
                <div key={s.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: s.fill }} />
                  <span className="text-[#464A45]">{s.name}</span>
                  <span className="font-bold text-[#181A1F] ml-auto pl-3">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
        <h3 className="font-bold text-[#181A1F] mb-4">Tournament Performance</h3>
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[600px]">
            <TableHeader className="bg-[#FFC400]/10">
              <TableRow>
                {["Tournament", "Sport", "Registrations", "Capacity", "Fill Rate", "Revenue", "Status"].map(h => (
                  <TableHead key={h} className="text-left text-xs font-semibold text-[#755900] px-4 py-3">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#F7F7F3]">
              {TOURNAMENTS.map(t => {
                const fillRate = Math.round((t.filled / t.slots) * 100);
                return (
                  <TableRow key={t.id} className="hover:bg-[#F7F7F3]/50">
                    <TableCell className="px-4 py-3 text-sm font-medium text-[#181A1F]">{t.name}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-[#464A45]">{t.sport || "Badminton"}</TableCell>
                    <TableCell className="px-4 py-3 text-sm font-semibold text-[#181A1F]">{t.filled}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-[#464A45]">{t.slots}</TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#DFE0D8] rounded-full h-1.5 w-16">
                          <div className="bg-[#FFC400] h-1.5 rounded-full" style={{ width: `${fillRate}%` }} />
                        </div>
                        <span className="text-xs font-medium text-[#30342F]">{fillRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm font-bold text-[#181A1F]">₹{(t.filled * t.fee).toLocaleString()}</TableCell>
                    <TableCell className="px-4 py-3"><Badge text={t.status} color={t.status === "open" ? "success" : t.status === "filling_fast" ? "orange" : "red"} /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

const ORG_MATCH_DATA = [
  { id: 1, tournament: "Bangalore Badminton Open", match: "QF: Arjun M. vs Rohit S.", sport: "Badminton", date: "Jul 19, 2026", scoreA: "21-18, 21-15", scoreB: "18-21, 15-21", winner: "Arjun M.", stage: "Quarter Final" },
  { id: 2, tournament: "Bangalore Badminton Open", match: "QF: Dev A. vs Karan M.", sport: "Badminton", date: "Jul 19, 2026", scoreA: "21-12, 19-21, 21-16", scoreB: "12-21, 21-19, 16-21", winner: "Dev A.", stage: "Quarter Final" },
  { id: 3, tournament: "City Tennis Championship", match: "R16: Priya S. vs Divya N.", sport: "Tennis", date: "Jul 20, 2026", scoreA: "6-4, 6-3", scoreB: "4-6, 3-6", winner: "Priya S.", stage: "Round of 16" },
  { id: 4, tournament: "Football League S3", match: "GW1: Team Alpha vs Team Beta", sport: "Football", date: "Jul 26, 2026", scoreA: "3", scoreB: "1", winner: "Team Alpha", stage: "Group Stage" },
];

export function OrganizerScorecard() {
  const [showAdd, setShowAdd] = useState(false);
  const [matches, setMatches] = useState(ORG_MATCH_DATA);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ tournament: "", match: "", sport: "Badminton", date: "", scoreA: "", scoreB: "", winner: "", stage: "Group Stage" });

  const tournaments = ["All", ...Array.from(new Set(matches.map(m => m.tournament)))];
  const filtered = filter === "All" ? matches : matches.filter(m => m.tournament === filter);

  const add = () => {
    setMatches(prev => [...prev, { id: Date.now(), ...form }]);
    setShowAdd(false);
    setForm({ tournament: "", match: "", sport: "Badminton", date: "", scoreA: "", scoreB: "", winner: "", stage: "Group Stage" });
  };

  return (
    <div className="p-6 space-y-5">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-md p-4 text-white flex items-center gap-3">
        <Lock size={18} />
        <div className="flex-1">
          <div className="font-bold text-sm">Premium Feature — Game Scorecard Management</div>
          <div className="text-xs text-white/80">Record and manage match results across all your tournaments.</div>
        </div>
        <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold shrink-0">Pro Plan</span>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Total Matches" value={matches.length.toString()} icon={FileText} />
        <StatCard label="Tournaments" value={Array.from(new Set(matches.map(m => m.tournament))).length.toString()} icon={Trophy} color="#3F718B" />
        <StatCard label="Sports Covered" value={Array.from(new Set(matches.map(m => m.sport))).length.toString()} icon={Activity} color="#C08B3E" />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {tournaments.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === t ? "bg-[#FFC400] text-[#17140A]" : "bg-[#DFE0D8] text-[#464A45] hover:bg-[#C9CBC2]"}`}>
              {t.split(" ").slice(0, 2).join(" ")}
            </button>
          ))}
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-[#FFC400] text-[#17140A] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#D9A900] flex items-center gap-2">
          <Plus size={15} /> Add Result
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map(m => (
          <div key={m.id} className="bg-white rounded-md border border-[#DFE0D8] p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-[#755900] font-semibold mb-0.5">{m.tournament}</div>
                <div className="font-bold text-[#181A1F]">{m.match}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#7D8178]">{m.date}</div>
                <span className="text-xs bg-[#DFE0D8] text-[#464A45] px-2 py-0.5 rounded-full">{m.stage}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-[#F7F7F3] rounded-md p-3">
              <div className="flex-1 text-center">
                <div className="text-xs text-[#7D8178] mb-1">Score A</div>
                <div className="font-bold text-[#181A1F]">{m.scoreA}</div>
              </div>
              <div className="text-[#A5A89E] font-bold">vs</div>
              <div className="flex-1 text-center">
                <div className="text-xs text-[#7D8178] mb-1">Score B</div>
                <div className="font-bold text-[#181A1F]">{m.scoreB}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-xs text-[#7D8178] mb-1">Winner</div>
                <div className="text-xs font-bold text-[#755900] bg-sky-50 px-2 py-1 rounded-lg">{m.winner}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-6 w-full max-w-md space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#181A1F]">Add Match Result</h3>
              <button onClick={() => setShowAdd(false)}><X size={18} className="text-[#7D8178]" /></button>
            </div>
            {[
              { label: "Tournament", key: "tournament", placeholder: "Bangalore Badminton Open" },
              { label: "Match Description", key: "match", placeholder: "QF: Player A vs Player B" },
              { label: "Score A", key: "scoreA", placeholder: "21-18, 21-15" },
              { label: "Score B", key: "scoreB", placeholder: "18-21, 15-21" },
              { label: "Winner", key: "winner", placeholder: "Player A" },
              { label: "Date", key: "date", type: "date" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">{f.label}</label>
                <input type={f.type || "text"} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Sport</label>
                <select value={form.sport} onChange={e => setForm(p => ({ ...p, sport: e.target.value }))}
                  className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]">
                  {["Badminton", "Tennis", "Football", "Cricket", "Basketball"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Stage</label>
                <select value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))}
                  className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]">
                  {["Group Stage", "Round of 16", "Quarter Final", "Semi Final", "Final"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowAdd(false)} className="flex-1 border border-[#C9CBC2] rounded-md py-2.5 text-sm">Cancel</button>
              <button onClick={add} className="flex-1 bg-[#FFC400] text-[#17140A] rounded-md py-2.5 text-sm font-semibold">Save Result</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
