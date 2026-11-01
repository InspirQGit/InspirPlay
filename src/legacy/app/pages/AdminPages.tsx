import { useState } from "react";
import {
  Users, Building2, DollarSign, TrendingUp, Shield, CheckCircle, XCircle,
  Eye, Edit2, Trash2, Plus, X, AlertTriangle, Settings, Activity, BarChart2,
  Trophy, Star, Clock, Globe, EyeOff, Award, Sparkles, Search, Filter
} from "lucide-react";
import { ADMIN_STATS, MONTHLY_REVENUE } from "../data";
import type { VenueItem, TrainerItem, TournamentItem } from "../data";
import { StatCard, Badge, DataTable } from "../components";
import type { ColDef } from "../components";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const PLATFORM_USERS = [
  { id: 1,  name: "Arjun Mehta",       role: "player",    email: "arjun@gmail.com",        city: "Bangalore", joined: "Jan 2026", status: "active",    spend: 12450 },
  { id: 2,  name: "Court Masters",     role: "venue",     email: "courts@masters.com",      city: "Bangalore", joined: "Feb 2026", status: "active",    spend: 0 },
  { id: 3,  name: "Rajesh Kumar",      role: "trainer",   email: "rajesh@coach.com",        city: "Bangalore", joined: "Mar 2026", status: "active",    spend: 0 },
  { id: 4,  name: "SportsFest",        role: "organizer", email: "admin@sportsfest.in",     city: "Mumbai",    joined: "Dec 2025", status: "active",    spend: 0 },
  { id: 5,  name: "Priya Sharma",      role: "player",    email: "priya@gmail.com",         city: "Mumbai",    joined: "Feb 2026", status: "suspended", spend: 8900 },
  { id: 6,  name: "Green Valley FC",   role: "venue",     email: "gvfc@sports.com",         city: "Hyderabad", joined: "Jan 2026", status: "active",    spend: 0 },
  { id: 7,  name: "Vikram Nair",       role: "player",    email: "vikram@gmail.com",        city: "Pune",      joined: "Mar 2026", status: "active",    spend: 6800 },
  { id: 8,  name: "Elite Racquet Club",role: "venue",     email: "elite@racquet.com",       city: "Mumbai",    joined: "Jan 2026", status: "active",    spend: 0 },
  { id: 9,  name: "Coach Ananya",      role: "trainer",   email: "ananya@tennis.com",       city: "Chennai",   joined: "Apr 2026", status: "active",    spend: 0 },
  { id: 10, name: "Rahul Singh",       role: "player",    email: "rahul@gmail.com",         city: "Bangalore", joined: "Apr 2026", status: "active",    spend: 4200 },
  { id: 11, name: "City Events",       role: "organizer", email: "cityevents@mail.com",     city: "Delhi",     joined: "Feb 2026", status: "active",    spend: 0 },
  { id: 12, name: "Divya Patel",       role: "player",    email: "divya@gmail.com",         city: "Hyderabad", joined: "May 2026", status: "active",    spend: 3100 },
  { id: 13, name: "Nexus Sports Hub",  role: "venue",     email: "nexus@sports.in",         city: "Bangalore", joined: "May 2026", status: "pending_kyc", spend: 0 },
  { id: 14, name: "Suresh Babu",       role: "player",    email: "suresh.b@gmail.com",      city: "Chennai",   joined: "Jun 2026", status: "active",    spend: 2200 },
  { id: 15, name: "Kavya Reddy",       role: "player",    email: "kavya@gmail.com",         city: "Mumbai",    joined: "Jun 2026", status: "active",    spend: 1800 },
];

const KYC_QUEUE = [
  { id: 1, name: "Vikram Singh", role: "player", doc: "Aadhaar + PAN", submitted: "Jul 8, 2026", status: "pending" },
  { id: 2, name: "Elite Sports Hub", role: "venue", doc: "GST + Aadhaar", submitted: "Jul 7, 2026", status: "pending" },
  { id: 3, name: "Ananya Reddy", role: "trainer", doc: "Aadhaar + Certificate", submitted: "Jul 6, 2026", status: "pending" },
  { id: 4, name: "Rohit Kumar", role: "player", doc: "Aadhaar + PAN", submitted: "Jul 5, 2026", status: "approved" },
];

export function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-[#111827] to-[#304A5D] rounded-md p-6 text-white">
        <h2 className="text-xl font-bold mb-1">Platform Overview 🚀</h2>
        <p className="text-white/70 text-sm">All systems operational. 3 KYC reviews pending.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={ADMIN_STATS.totalUsers.toLocaleString()} sub="↑ 1.2K this month" icon={Users} />
        <StatCard label="Active Venues" value={ADMIN_STATS.venues.toString()} sub="↑ 12 this month" icon={Building2} color="#3F718B" />
        <StatCard label="Monthly GMV" value="₹48.6L" sub="↑ 23% vs last" icon={DollarSign} color="#C08B3E" />
        <StatCard label="Platform Revenue" value="₹4.86L" sub="10% take rate" icon={TrendingUp} color="#B84A4A" />
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
          <h3 className="font-bold text-[#181A1F] mb-4">Monthly GMV Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MONTHLY_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 100000).toFixed(1)}L`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "GMV"]} />
              <Line name="GMV" type="monotone" dataKey="revenue" stroke="#FFC400" strokeWidth={2.5} dot={{ fill: "#FFC400", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
          <h3 className="font-bold text-[#181A1F] mb-4">Users by Role</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { role: "Players", count: 42480 }, { role: "Venues", count: 1240 },
              { role: "Trainers", count: 680 }, { role: "Organizers", count: 320 },
            ]}>
              <XAxis dataKey="role" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip />
              <Bar name="Users" dataKey="count" fill="#FFC400" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

type UserRow = typeof PLATFORM_USERS[0];

export function AdminUsers() {
  const [users, setUsers] = useState(PLATFORM_USERS);
  const [roleFilter, setRoleFilter] = useState("all");

  const suspend = (id: number) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u));
  const deleteUser = (id: number) => setUsers(prev => prev.filter(u => u.id !== id));

  const filtered = roleFilter === "all" ? users : users.filter(u => u.role === roleFilter);

  const roleColor: Record<string, string> = { player: "blue", venue: "success", trainer: "yellow", organizer: "orange" };

  const columns: ColDef<UserRow>[] = [
    { key: "name", label: "User", sortable: true, render: (v, row) => (
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[#FFC400]/15 flex items-center justify-center text-[#755900] font-bold text-sm shrink-0">{String(v)[0]}</div>
        <div><div className="text-sm font-semibold text-[#181A1F]">{v as string}</div><div className="text-xs text-[#7D8178]">{row.email}</div></div>
      </div>
    )},
    { key: "role", label: "Role", sortable: true, render: (v) => <Badge text={v as string} color={roleColor[v as string] || "gray"} /> },
    { key: "city", label: "City", sortable: true, render: (v) => <span className="text-sm text-[#464A45]">{v as string}</span> },
    { key: "joined", label: "Joined", sortable: true, render: (v) => <span className="text-xs text-[#5F635C]">{v as string}</span> },
    { key: "spend", label: "Spend", sortable: true, render: (v) => <span className="text-sm font-medium text-[#181A1F]">{(v as number) > 0 ? `₹${(v as number).toLocaleString()}` : "—"}</span> },
    { key: "status", label: "Status", sortable: true, render: (v) => <Badge text={v as string} color={v === "active" ? "success" : v === "pending_kyc" ? "yellow" : "red"} /> },
    { key: "id", label: "Actions", render: (_, row) => (
      <div className="flex gap-1.5">
        <button aria-label="View details" className="p-1.5 text-[#7D8178] hover:text-[#464A45] hover:bg-[#DFE0D8] rounded-md transition-colors"><Eye size={14} /></button>
        <button onClick={() => suspend(row.id)} className={`p-1.5 rounded-md transition-colors ${row.status === "active" ? "text-orange-400 hover:text-orange-600 hover:bg-orange-50" : "text-sky-400 hover:text-sky-600 hover:bg-sky-50"}`}>
          {row.status === "active" ? <XCircle size={14} /> : <CheckCircle size={14} />}
        </button>
        <button onClick={() => deleteUser(row.id)} className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={14} /></button>
      </div>
    )},
  ];

  return (
    <DataTable<UserRow>
      data={filtered}
      columns={columns}
      title="Platform Users"
      searchable
      searchPlaceholder="Search name or email..."
      emptyText="No users found"
      emptyIcon={<Users />}
      actions={
        <div className="flex gap-1.5 flex-wrap">
          {["all","player","venue","trainer","organizer"].map(f => (
            <button key={f} onClick={() => setRoleFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${roleFilter === f ? "bg-[#FFC400] text-[#17140A]" : "bg-[#DFE0D8] text-[#464A45] hover:bg-[#C9CBC2]"}`}>
              {f}
            </button>
          ))}
        </div>
      }
    />
  );
}

export function AdminVenues({ venues, trainers, tournaments, onUpdateVenue, onUpdateTrainer, onUpdateTournament }: {
  venues: VenueItem[];
  trainers: TrainerItem[];
  tournaments: TournamentItem[];
  onUpdateVenue: (v: VenueItem) => void;
  onUpdateTrainer: (t: TrainerItem) => void;
  onUpdateTournament: (t: TournamentItem) => void;
}) {
  const [listingTab, setListingTab] = useState<"venues"|"coaches"|"tournaments">("venues");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all"|"active"|"draft"|"pending_review"|"suspended">("all");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const adminSetStatus = (item: VenueItem | TrainerItem | TournamentItem, newStatus: string, type: "venue"|"trainer"|"tournament") => {
    const isActive = newStatus === "active";
    if (type === "venue") onUpdateVenue({ ...(item as VenueItem), listingStatus: newStatus as any, published: isActive });
    else if (type === "trainer") onUpdateTrainer({ ...(item as TrainerItem), listingStatus: newStatus as any, published: isActive });
    else onUpdateTournament({ ...(item as TournamentItem), listingStatus: newStatus as any, published: isActive });
    showToast(`${(item as any).name} → ${newStatus}`);
  };

  const toggleFeatured = (v: VenueItem) => {
    onUpdateVenue({ ...v, featured: !v.featured });
    showToast(`${v.name} ${!v.featured ? "featured" : "unfeatured"}`);
  };

  const STATUS_ACTIONS: Record<string, { label: string; newStatus: string; color: string }[]> = {
    pending_review: [
      { label: "Approve → Active", newStatus: "active", color: "text-sky-600 hover:bg-sky-50 border-sky-200" },
      { label: "Reject → Draft", newStatus: "draft", color: "text-[#464A45] hover:bg-[#F7F7F3] border-[#C9CBC2]" },
    ],
    draft: [
      { label: "Activate", newStatus: "active", color: "text-sky-600 hover:bg-sky-50 border-sky-200" },
      { label: "Suspend", newStatus: "suspended", color: "text-red-600 hover:bg-red-50 border-red-200" },
    ],
    active: [
      { label: "Suspend", newStatus: "suspended", color: "text-red-600 hover:bg-red-50 border-red-200" },
      { label: "Unpublish → Draft", newStatus: "draft", color: "text-[#464A45] hover:bg-[#F7F7F3] border-[#C9CBC2]" },
    ],
    suspended: [
      { label: "Reinstate → Active", newStatus: "active", color: "text-sky-600 hover:bg-sky-50 border-sky-200" },
    ],
  };

  const statusColor = (s: string) => s === "active" ? "success" : s === "pending_review" ? "yellow" : s === "suspended" ? "red" : "gray";

  const filterItems = <T extends { name: string; listingStatus: string }>(items: T[]) =>
    items.filter(i => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || i.listingStatus === filterStatus;
      return matchSearch && matchStatus;
    });

  const liveVenues = venues.filter(v => v.published && v.listingStatus === "active").length;
  const pendingVenues = venues.filter(v => v.listingStatus === "pending_review").length;
  const liveTrainers = trainers.filter(t => t.published && t.listingStatus === "active").length;
  const pendingTrainers = trainers.filter(t => t.listingStatus === "pending_review").length;
  const liveTournaments = tournaments.filter(t => t.published && t.listingStatus === "active").length;

  const filteredVenues = filterItems(venues);
  const filteredTrainers = filterItems(trainers);
  const filteredTournaments = filterItems(tournaments);

  return (
    <div className="p-6 space-y-5">
      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <StatCard label="Live Venues" value={String(liveVenues)} icon={Building2} />
        <StatCard label="Live Coaches" value={String(liveTrainers)} icon={Users} color="#3F718B" />
        <StatCard label="Live Tournaments" value={String(liveTournaments)} icon={Trophy} color="#765A88" />
        <StatCard label="Pending Review" value={String(pendingVenues + pendingTrainers)} icon={Clock} color="#C08B3E" />
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#181A1F] text-white text-sm px-4 py-2.5 rounded-md shadow-lg z-50 flex items-center gap-2">
          <CheckCircle size={14} className="text-sky-400" /> {toast}
        </div>
      )}

      {/* Tab + Search + Filter bar */}
      <div className="bg-white rounded-md border border-[#DFE0D8] p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {(["venues","coaches","tournaments"] as const).map(tab => (
            <button key={tab} onClick={() => setListingTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${listingTab === tab ? "bg-[#FFC400] text-[#17140A]" : "text-[#5F635C] hover:bg-[#DFE0D8]"}`}>
              {tab}
              {tab === "venues" && pendingVenues > 0 && <span className="ml-1.5 bg-amber-400 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingVenues}</span>}
              {tab === "coaches" && pendingTrainers > 0 && <span className="ml-1.5 bg-amber-400 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingTrainers}</span>}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7D8178]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name…"
                className="pl-8 pr-3 py-1.5 border border-[#C9CBC2] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 w-44" />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}
              className="border border-[#C9CBC2] rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30">
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="pending_review">Pending Review</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Venues panel */}
        {listingTab === "venues" && (
          <div className="space-y-2 pt-1">
            {filteredVenues.length === 0 && <p className="text-sm text-[#7D8178] text-center py-6">No venues match your filter.</p>}
            {filteredVenues.map(v => (
              <div key={v.id} className={`border rounded-md p-4 ${v.listingStatus === "pending_review" ? "border-amber-200 bg-amber-50/30" : v.listingStatus === "suspended" ? "border-red-200 bg-red-50/20" : "border-[#DFE0D8]"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#181A1F] text-sm">{v.name}</span>
                      <Badge text={v.listingStatus === "active" ? "Live" : v.listingStatus === "pending_review" ? "Pending Review" : v.listingStatus === "suspended" ? "Suspended" : "Draft"}
                        color={statusColor(v.listingStatus)} />
                      {v.featured && <span className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><Sparkles size={10} /> Featured</span>}
                      {v.published && v.listingStatus === "active" && <span className="text-xs text-sky-600 flex items-center gap-1"><Globe size={10} /> Live on B2C</span>}
                    </div>
                    <p className="text-xs text-[#5F635C] mt-0.5">{v.sport} · {v.location} · ₹{v.price}/hr · {v.slots.length} time slots</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                    {/* Featured toggle */}
                    <button onClick={() => toggleFeatured(v)}
                      className={`text-xs px-2.5 py-1.5 rounded-md border font-medium transition-colors ${v.featured ? "border-yellow-300 text-yellow-700 hover:bg-yellow-50" : "border-[#C9CBC2] text-[#5F635C] hover:bg-[#F7F7F3]"}`}>
                      <Sparkles size={12} className="inline mr-1" />{v.featured ? "Unfeature" : "Feature"}
                    </button>
                    {/* Status action buttons */}
                    {(STATUS_ACTIONS[v.listingStatus] || []).map(action => (
                      <button key={action.newStatus} onClick={() => adminSetStatus(v, action.newStatus, "venue")}
                        className={`text-xs px-2.5 py-1.5 rounded-md border font-medium transition-colors ${action.color}`}>
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Coaches panel */}
        {listingTab === "coaches" && (
          <div className="space-y-2 pt-1">
            {filteredTrainers.length === 0 && <p className="text-sm text-[#7D8178] text-center py-6">No coaches match your filter.</p>}
            {filteredTrainers.map(t => (
              <div key={t.id} className={`border rounded-md p-4 ${t.listingStatus === "pending_review" ? "border-amber-200 bg-amber-50/30" : t.listingStatus === "suspended" ? "border-red-200 bg-red-50/20" : "border-[#DFE0D8]"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#181A1F] text-sm">{t.name}</span>
                      <Badge text={t.listingStatus === "active" ? "Live" : t.listingStatus === "pending_review" ? "Pending Review" : t.listingStatus === "suspended" ? "Suspended" : "Draft"}
                        color={statusColor(t.listingStatus)} />
                      {t.verified && <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><Award size={10} /> Verified</span>}
                      {t.published && t.listingStatus === "active" && <span className="text-xs text-sky-600 flex items-center gap-1"><Globe size={10} /> Live on B2C</span>}
                    </div>
                    <p className="text-xs text-[#5F635C] mt-0.5">{t.sport} · {t.experience} · {t.location} · ₹{t.fee}/hr · ⭐ {t.rating}</p>
                    {t.bio && <p className="text-xs text-[#7D8178] mt-1 line-clamp-1 max-w-lg">{t.bio}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                    {(STATUS_ACTIONS[t.listingStatus] || []).map(action => (
                      <button key={action.newStatus} onClick={() => adminSetStatus(t, action.newStatus, "trainer")}
                        className={`text-xs px-2.5 py-1.5 rounded-md border font-medium transition-colors ${action.color}`}>
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tournaments panel */}
        {listingTab === "tournaments" && (
          <div className="space-y-2 pt-1">
            {filteredTournaments.length === 0 && <p className="text-sm text-[#7D8178] text-center py-6">No tournaments match your filter.</p>}
            {filteredTournaments.map(t => (
              <div key={t.id} className={`border rounded-md p-4 ${t.listingStatus === "pending_review" ? "border-amber-200 bg-amber-50/30" : t.listingStatus === "suspended" ? "border-red-200 bg-red-50/20" : "border-[#DFE0D8]"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#181A1F] text-sm">{t.name}</span>
                      <Badge text={t.listingStatus === "active" ? "Live" : t.listingStatus === "pending_review" ? "Pending Review" : t.listingStatus === "suspended" ? "Suspended" : "Draft"}
                        color={statusColor(t.listingStatus)} />
                      {t.published && t.listingStatus === "active" && <span className="text-xs text-sky-600 flex items-center gap-1"><Globe size={10} /> Live on B2C</span>}
                    </div>
                    <p className="text-xs text-[#5F635C] mt-0.5">{t.sport} · {t.venue} · {t.date} · Prize: {t.prize} · ₹{t.fee} entry</p>
                    <p className="text-xs text-[#7D8178] mt-0.5">Organizer: {t.organizer} · {t.filled}/{t.slots} slots filled</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                    {(STATUS_ACTIONS[t.listingStatus] || []).map(action => (
                      <button key={action.newStatus} onClick={() => adminSetStatus(t, action.newStatus, "tournament")}
                        className={`text-xs px-2.5 py-1.5 rounded-md border font-medium transition-colors ${action.color}`}>
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminRevenue() {
  return (
    <div className="p-6 space-y-5">
      <div className="grid sm:grid-cols-4 gap-4">
        <StatCard label="Gross GMV" value="₹48.6L" sub="This month" icon={DollarSign} />
        <StatCard label="Platform Revenue" value="₹4.86L" sub="10% take rate" icon={TrendingUp} color="#3F718B" />
        <StatCard label="Subscription Rev" value="₹1.2L" sub="Premium plans" icon={Activity} color="#C08B3E" />
        <StatCard label="Ad Revenue" value="₹28,000" sub="Promoted listings" icon={BarChart2} color="#B84A4A" />
      </div>
      <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
        <h3 className="font-bold text-[#181A1F] mb-4">Monthly Revenue (Last 12 Months)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={MONTHLY_REVENUE}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 100000).toFixed(1)}L`} />
            <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
            <Bar name="Revenue" dataKey="revenue" fill="#FFC400" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function AdminSubscriptions() {
  const plans = [
    { name: "Player Free", price: "₹0", users: 38240, features: ["Basic bookings", "1 sport", "Community access"] },
    { name: "Player Premium", price: "₹199/mo", users: 4240, features: ["Unlimited bookings", "Scorecard", "AI coaching tips", "Priority support"] },
    { name: "Venue Basic", price: "₹999/mo", users: 820, features: ["Up to 2 venues", "Basic analytics", "Standard support"] },
    { name: "Venue Pro", price: "₹2,499/mo", users: 380, features: ["Unlimited venues", "Advanced analytics", "Priority listing", "Dedicated support"] },
    { name: "Trainer Pro", price: "₹499/mo", users: 420, features: ["Student management", "Revenue dashboard", "Profile boost"] },
    { name: "Organizer Pro", price: "₹1,999/mo", users: 180, features: ["Unlimited tournaments", "Bracket management", "Custom branding"] },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="grid sm:grid-cols-3 gap-4 mb-2">
        <StatCard label="Total Subscribers" value="6,040" icon={Users} />
        <StatCard label="Monthly Sub Rev" value="₹1.2L" icon={DollarSign} color="#3F718B" />
        <StatCard label="Churn Rate" value="3.2%" icon={Activity} color="#B84A4A" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map(p => (
          <div key={p.name} className="bg-white rounded-md border border-[#DFE0D8] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#181A1F]">{p.name}</h3>
              <span className="font-bold text-[#755900]">{p.price}</span>
            </div>
            <div className="text-2xl font-bold text-[#181A1F] mb-0.5">{p.users.toLocaleString()}</div>
            <div className="text-xs text-[#7D8178] mb-3">Active subscribers</div>
            <ul className="space-y-1">
              {p.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-[#464A45]">
                  <CheckCircle size={11} className="text-sky-500 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminKYC() {
  const [queue, setQueue] = useState(KYC_QUEUE);

  const approve = (id: number) => setQueue(prev => prev.map(k => k.id === id ? { ...k, status: "approved" } : k));
  const reject = (id: number) => setQueue(prev => prev.map(k => k.id === id ? { ...k, status: "rejected" } : k));

  return (
    <div className="p-6 space-y-5">
      <div className="grid sm:grid-cols-4 gap-4 mb-2">
        <StatCard label="Pending Review" value={queue.filter(k => k.status === "pending").length.toString()} icon={Clock} color="#C08B3E" />
        <StatCard label="Approved Today" value="8" icon={CheckCircle} />
        <StatCard label="Rejected" value="2" icon={XCircle} color="#B84A4A" />
        <StatCard label="Total Verified" value="12,480" icon={Shield} color="#3F718B" />
      </div>
      <div className="space-y-3">
        {queue.map(k => (
          <div key={k.id} className="bg-white rounded-md border border-[#DFE0D8] p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-orange-50 flex items-center justify-center shrink-0">
              <Shield size={18} className="text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[#181A1F]">{k.name}</div>
              <div className="text-sm text-[#5F635C]">
                <Badge text={k.role} color="blue" /> · {k.doc} · Submitted {k.submitted}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge text={k.status} color={k.status === "approved" ? "success" : k.status === "rejected" ? "red" : "yellow"} />
              {k.status === "pending" && (
                <>
                  <button onClick={() => approve(k.id)} className="flex items-center gap-1.5 bg-sky-50 text-sky-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-sky-100">
                    <CheckCircle size={13} /> Approve
                  </button>
                  <button onClick={() => reject(k.id)} className="flex items-center gap-1.5 bg-red-50 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-100">
                    <XCircle size={13} /> Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSettings() {
  const [settings, setSettings] = useState({
    platformFee: "10",
    referralBonus: "200",
    coinValue: "0.1",
    maintenanceMode: false,
    registrationsOpen: true,
    emailNotifications: true,
  });

  return (
    <div className="p-6 space-y-5">
      <div className="bg-white rounded-md border border-[#DFE0D8] p-6 space-y-5">
        <h3 className="font-bold text-[#181A1F]">Platform Configuration</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Platform Fee (%)", key: "platformFee" },
            { label: "Referral Bonus (₹ Coins)", key: "referralBonus" },
            { label: "Coin → INR Rate", key: "coinValue" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-medium text-[#464A45] mb-1.5 block">{f.label}</label>
              <input value={(settings as any)[f.key]} onChange={e => setSettings(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[
            { label: "Maintenance Mode", key: "maintenanceMode", desc: "Puts the app in read-only mode for all users" },
            { label: "New Registrations Open", key: "registrationsOpen", desc: "Allow new users to register" },
            { label: "Email Notifications", key: "emailNotifications", desc: "Send transactional emails to users" },
          ].map(s => (
            <div key={s.key} className="flex items-center justify-between p-4 bg-[#F7F7F3] rounded-md">
              <div>
                <div className="text-sm font-medium text-[#181A1F]">{s.label}</div>
                <div className="text-xs text-[#5F635C]">{s.desc}</div>
              </div>
              <button onClick={() => setSettings(p => ({ ...p, [s.key]: !(p as any)[s.key] }))}
                className={`w-12 h-6 rounded-full transition-colors ${(settings as any)[s.key] ? "bg-[#FFC400]" : "bg-[#A5A89E]"} relative`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${(settings as any)[s.key] ? "right-1" : "left-1"}`} />
              </button>
            </div>
          ))}
        </div>
        <button className="bg-[#FFC400] text-[#17140A] px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-[#D9A900] transition-colors">Save Settings</button>
      </div>
    </div>
  );
}

export function AdminAttributes() {
  const [sports, setSports] = useState([
    { id: 1, name: "Badminton", icon: "🏸", active: true },
    { id: 2, name: "Football", icon: "⚽", active: true },
    { id: 3, name: "Tennis", icon: "🎾", active: true },
    { id: 4, name: "Basketball", icon: "🏀", active: true },
    { id: 5, name: "Cricket", icon: "🏏", active: true },
    { id: 6, name: "Swimming", icon: "🏊", active: false },
  ]);
  const [newSport, setNewSport] = useState("");

  const add = () => {
    if (!newSport.trim()) return;
    setSports(prev => [...prev, { id: Date.now(), name: newSport, icon: "🏟️", active: true }]);
    setNewSport("");
  };

  return (
    <div className="p-6 space-y-5">
      <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
        <h3 className="font-bold text-[#181A1F] mb-4">Sports & Activities</h3>
        <div className="flex gap-3 mb-5">
          <input value={newSport} onChange={e => setNewSport(e.target.value)} placeholder="Add new sport..."
            className="flex-1 border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
          <button onClick={add} className="bg-[#FFC400] text-[#17140A] px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#D9A900] flex items-center gap-2">
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {sports.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 bg-[#F7F7F3] rounded-md">
              <span className="text-2xl">{s.icon}</span>
              <span className="flex-1 text-sm font-medium text-[#181A1F]">{s.name}</span>
              <Badge text={s.active ? "Active" : "Inactive"} color={s.active ? "success" : "gray"} />
              <button onClick={() => setSports(prev => prev.map(x => x.id === s.id ? { ...x, active: !x.active } : x))}
                className="text-xs text-[#5F635C] hover:text-[#30342F] border border-[#C9CBC2] px-2.5 py-1 rounded-lg">
                {s.active ? "Disable" : "Enable"}
              </button>
              <button onClick={() => setSports(prev => prev.filter(x => x.id !== s.id))}
                className="p-1.5 text-red-300 hover:text-red-500"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminPricing() {
  const [plans, setPlans] = useState([
    { id: 1, role: "Player", tier: "Free", price: 0, period: "forever", active: true, features: ["4 bookings/month", "Basic scorecard", "Community access"] },
    { id: 2, role: "Player", tier: "Premium", price: 199, period: "month", active: true, features: ["Unlimited bookings", "Full scorecard", "AI coaching tips", "Priority support"] },
    { id: 3, role: "Player", tier: "Pro Team", price: 499, period: "month", active: true, features: ["Everything in Premium", "Team wallet", "Bulk discounts"] },
    { id: 4, role: "Venue", tier: "Basic", price: 999, period: "month", active: true, features: ["Up to 2 venues", "Basic analytics"] },
    { id: 5, role: "Venue", tier: "Pro", price: 2499, period: "month", active: true, features: ["Unlimited venues", "Advanced analytics", "Priority listing"] },
    { id: 6, role: "Trainer", tier: "Pro", price: 499, period: "month", active: true, features: ["Student management", "Revenue dashboard"] },
    { id: 7, role: "Organizer", tier: "Pro", price: 1999, period: "month", active: true, features: ["Unlimited tournaments", "Bracket management"] },
  ]);
  const [editing, setEditing] = useState<number | null>(null);

  const updatePrice = (id: number, price: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, price: Number(price) } : p));
    setEditing(null);
  };

  const roleColor: Record<string, string> = {
    Player: "#FFC400", Venue: "#3F718B", Trainer: "#C08B3E", Organizer: "#B84A4A",
  };

  return (
    <div className="p-6 space-y-5">
      <div className="grid sm:grid-cols-4 gap-4 mb-2">
        <StatCard label="Active Plans" value={plans.filter(p => p.active).length.toString()} icon={CheckCircle} />
        <StatCard label="Monthly Sub Rev" value="₹1.2L" sub="Estimated" icon={DollarSign} color="#3F718B" />
        <StatCard label="Total Subscribers" value="6,040" icon={Users} color="#C08B3E" />
        <StatCard label="Avg Plan Value" value="₹842" sub="Per subscriber/mo" icon={TrendingUp} color="#B84A4A" />
      </div>

      <div className="space-y-3">
        {["Player", "Venue", "Trainer", "Organizer"].map(role => (
          <div key={role} className="bg-white rounded-md border border-[#DFE0D8] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#F7F7F3] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: roleColor[role] }} />
              <h3 className="font-bold text-[#181A1F]">{role} Plans</h3>
            </div>
            <div className="divide-y divide-[#F7F7F3]">
              {plans.filter(p => p.role === role).map(plan => (
                <div key={plan.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#181A1F]">{plan.tier}</span>
                      <Badge text={plan.active ? "Active" : "Inactive"} color={plan.active ? "success" : "gray"} />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {plan.features.map(f => (
                        <span key={f} className="text-xs bg-[#F7F7F3] text-[#5F635C] px-2 py-0.5 rounded-full">{f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {editing === plan.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[#5F635C] text-sm">₹</span>
                        <input
                          defaultValue={plan.price}
                          autoFocus
                          onBlur={e => updatePrice(plan.id, e.target.value)}
                          onKeyDown={e => e.key === "Enter" && updatePrice(plan.id, (e.target as HTMLInputElement).value)}
                          className="w-24 border border-[#D6A500] rounded-lg px-2 py-1.5 text-sm font-bold focus:outline-none"
                        />
                        <span className="text-[#7D8178] text-xs">/{plan.period}</span>
                      </div>
                    ) : (
                      <div className="text-right">
                        <div className="font-bold text-[#181A1F]">
                          {plan.price === 0 ? "Free" : `₹${plan.price.toLocaleString()}`}
                          {plan.price > 0 && <span className="text-[#7D8178] text-xs font-normal">/{plan.period}</span>}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => setEditing(editing === plan.id ? null : plan.id)}
                      className="p-1.5 text-[#7D8178] hover:text-[#755900] transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, active: !p.active } : p))}
                      className={`w-9 h-5 rounded-full transition-colors relative ${plan.active ? "bg-[#FFC400]" : "bg-[#A5A89E]"}`}
                    >
                      <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${plan.active ? "right-0.5" : "left-0.5"}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
