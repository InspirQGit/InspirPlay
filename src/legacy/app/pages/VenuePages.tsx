import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/SmartTable";
import { useState } from "react";
import {
  Building2, Calendar, TrendingUp, Users, Star, MapPin, Clock, Edit2,
  Trash2, Plus, X, CheckCircle, BarChart2, DollarSign, Activity,
  Settings, Package, UserCheck, Timer, ArrowRightCircle, Search,
  Download, AlertCircle, Wrench, ShoppingBag
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { VENUE_BOOKINGS_DATA, MONTHLY_REVENUE } from "../data";
import type { VenueItem } from "../data";
import { Badge, StatCard, DataTable, ImageUpload, PageHeader } from "../components";
import type { ColDef } from "../components";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

export function VenueDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-[#FFC400] to-[#D9A900] rounded-md p-6 text-[#17140A]">
        <h2 className="text-xl font-bold mb-1">Good morning, Court Masters 👋</h2>
        <p className="text-[#3B310F] text-sm">You have 8 bookings today. Revenue is up 18% this week.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Bookings" value="8" sub="↑ 2 vs yesterday" icon={Calendar} />
        <StatCard label="Monthly Revenue" value="₹1.24L" sub="↑ 18% vs last month" icon={TrendingUp} color="#3F718B" />
        <StatCard label="Occupancy Rate" value="76%" sub="Peak: 94% Fri–Sun" icon={Activity} color="#C08B3E" />
        <StatCard label="Avg Rating" value="4.8" sub="Based on 312 reviews" icon={Star} color="#B84A4A" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-md border border-[#DFE0D8] p-5">
          <h3 className="font-bold text-[#181A1F] mb-4">Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_REVENUE.slice(-7).map((d, i) => ({ day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i % 7], revenue: d.revenue * 0.035 }))}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
              <Bar name="Revenue" dataKey="revenue" fill="#FFC400" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
          <h3 className="font-bold text-[#181A1F] mb-4">Today's Bookings</h3>
          <div className="space-y-2.5 max-h-56 overflow-auto">
            {VENUE_BOOKINGS_DATA.filter(b => b.status === "confirmed").slice(0, 3).map(b => (
              <div key={b.id} className="flex items-center gap-3 p-3 bg-[#F7F7F3] rounded-md">
                <div className="bg-[#FFC400]/10 w-9 h-9 rounded-md flex items-center justify-center text-[#755900]">
                  <Clock size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#181A1F] truncate">{b.player}</div>
                  <div className="text-xs text-[#5F635C]">{b.time} · {b.court}</div>
                </div>
                <div className="text-sm font-bold text-[#181A1F]">₹{b.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Venue Listing Manager (B2B → B2C data flow) ────────────────────────────────
const AMENITY_OPTIONS = ["Restroom", "Changing Room", "Shower", "Gym", "AC", "Parking", "Floodlights", "Café", "Equipment Rental", "WiFi", "CCTV", "First Aid", "Drinking Water", "Scoreboard"];
const SLOT_OPTIONS = ["05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Live", color: "text-sky-700", bg: "bg-sky-50 border-sky-200" },
  draft: { label: "Draft", color: "text-[#464A45]", bg: "bg-[#F7F7F3] border-[#C9CBC2]" },
  pending_review: { label: "Pending Approval", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  suspended: { label: "Suspended", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

export function VenueList({ venues, onUpdateVenue, onDeleteVenue, onAddVenue }: {
  venues: VenueItem[];
  onUpdateVenue: (v: VenueItem) => void;
  onDeleteVenue: (id: number) => void;
  onAddVenue: (v: VenueItem) => void;
}) {
  const [editVenue, setEditVenue] = useState<VenueItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [savedToast, setSavedToast] = useState("");
  const [form, setForm] = useState<Partial<VenueItem> & { amenities: string[]; slots: string[] }>({
    name: "", location: "", sport: "Badminton", price: 0, description: "",
    amenities: [], slots: ["07:00", "10:00", "18:00"],
    image: "", owner: "You",
  });

  const openEdit = (v: VenueItem) => {
    setEditVenue(v);
    setForm({ ...v, amenities: [...v.amenities], slots: [...v.slots] });
  };

  const openAdd = () => {
    setEditVenue(null);
    setForm({ name: "", location: "", sport: "Badminton", price: 0, description: "", amenities: [], slots: ["07:00", "10:00", "18:00"], image: "", owner: "You" });
    setShowAdd(true);
  };

  const saveEdit = () => {
    if (!editVenue) return;
    onUpdateVenue({ ...editVenue, ...form, amenities: form.amenities || [], slots: form.slots || [] } as VenueItem);
    setEditVenue(null);
    showToast("Venue updated! Changes are live on the B2C browse page.");
  };

  const saveNew = () => {
    const newV: VenueItem = {
      id: Date.now(),
      name: form.name || "New Venue",
      location: form.location || "Bangalore",
      sport: form.sport || "Badminton",
      price: Number(form.price) || 0,
      description: form.description || "",
      amenities: form.amenities || [],
      slots: form.slots || [],
      image: form.image || "/inspirq-media/football.png",
      rating: 0, reviews: 0, verified: false, available: true,
      owner: "You", listingStatus: "pending_review", published: false, featured: false,
    };
    onAddVenue(newV);
    setShowAdd(false);
    showToast("Venue submitted for review! You will be notified once approved.");
  };

  const togglePublish = (v: VenueItem) => {
    const updated = { ...v, published: !v.published, listingStatus: (!v.published ? "active" : "draft") as VenueItem["listingStatus"] };
    onUpdateVenue(updated);
    showToast(updated.published ? `"${v.name}" is now LIVE on InspirQ!` : `"${v.name}" has been unpublished.`);
  };

  const showToast = (msg: string) => { setSavedToast(msg); setTimeout(() => setSavedToast(""), 4000); };

  const toggleAmenity = (a: string) => setForm(p => ({ ...p, amenities: (p.amenities || []).includes(a) ? (p.amenities || []).filter(x => x !== a) : [...(p.amenities || []), a] }));
  const toggleSlot = (s: string) => setForm(p => ({ ...p, slots: (p.slots || []).includes(s) ? (p.slots || []).filter(x => x !== s) : [...(p.slots || []), s] }));

  const fieldCls = "w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500] bg-white";

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#111827] to-[#304A5D] rounded-xl p-5 text-white">
        <h2 className="text-lg font-bold mb-1">Manage Venue Listings</h2>
        <p className="text-white/60 text-sm">Create and manage your venue profiles. Published listings appear live on the InspirQ player-facing browse page.</p>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { v: venues.length.toString(), l: "Total Venues" },
            { v: venues.filter(v => v.published).length.toString(), l: "Live on B2C" },
            { v: venues.filter(v => v.listingStatus === "pending_review").length.toString(), l: "Awaiting Approval" },
          ].map(s => (
            <div key={s.l} className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-xl font-black text-white">{s.v}</div>
              <div className="text-white/50 text-xs mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-700">
        <Settings size={15} className="shrink-0 mt-0.5" />
        <span><strong>How it works:</strong> Edit your venue details here — name, pricing, amenities, available time slots, and description. When you click <strong>"Publish"</strong>, your listing immediately appears in the B2C "Find Venues" page for players and guests to discover and book.</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#464A45]">{venues.length} venue{venues.length !== 1 ? "s" : ""} managed</span>
        <button onClick={openAdd} className="bg-[#FFC400] text-[#17140A] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#D9A900] flex items-center gap-2">
          <Plus size={15} /> Add New Venue
        </button>
      </div>

      {/* Venue cards */}
      <div className="space-y-4">
        {venues.map(v => {
          const st = STATUS_MAP[v.listingStatus] || STATUS_MAP.draft;
          return (
            <div key={v.id} className="bg-white rounded-xl border border-[#C9CBC2] overflow-hidden shadow-sm">
              <div className="flex">
                <img src={v.image} alt={v.name} className="w-32 sm:w-44 object-cover shrink-0"
                  onError={e => { (e.target as HTMLImageElement).src = "/inspirq-media/football.png"; }} />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h3 className="font-bold text-[#181A1F]">{v.name}</h3>
                      <div className="text-xs text-[#5F635C] flex items-center gap-1 mt-0.5"><MapPin size={10} />{v.location}</div>
                    </div>
                    <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>{st.label}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-[#464A45] mb-3">
                    <span className="bg-[#FFC400]/10 text-[#755900] font-semibold px-2 py-0.5 rounded-full">{v.sport}</span>
                    <span className="bg-[#F7F7F3] border border-[#DFE0D8] px-2 py-0.5 rounded-full">₹{v.price}/hr</span>
                    {v.rating > 0 && <span className="bg-[#F7F7F3] border border-[#DFE0D8] px-2 py-0.5 rounded-full flex items-center gap-0.5"><Star size={9} className="text-yellow-400 fill-yellow-400" />{v.rating}</span>}
                  </div>
                  {v.description && <p className="text-xs text-[#5F635C] mb-3 line-clamp-2">{v.description}</p>}
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => openEdit(v)}
                      className="flex items-center gap-1.5 text-xs font-semibold border border-[#C9CBC2] px-3 py-1.5 rounded-lg hover:bg-[#F7F7F3] text-[#30342F]">
                      <Edit2 size={12} />Edit Listing
                    </button>
                    {v.listingStatus !== "suspended" && v.listingStatus !== "pending_review" && (
                      <button onClick={() => togglePublish(v)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${v.published ? "bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100" : "bg-[#FFC400]/10 border border-[#D6A500]/20 text-[#755900] hover:bg-[#FFC400]/20"}`}>
                        {v.published ? "Unpublish" : "Publish Live"}
                      </button>
                    )}
                    <button onClick={() => { if (confirm("Delete this venue listing?")) onDeleteVenue(v.id); }}
                      className="p-1.5 border border-red-100 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
              {v.published && v.listingStatus === "active" && (
                <div className="px-4 py-2 bg-sky-50 border-t border-sky-100 text-xs text-sky-700 font-medium flex items-center gap-1.5">
                  <CheckCircle size={11} />This venue is currently <strong>live</strong> on the player-facing Find Venues page · {v.slots.length} slots available
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit/Add Modal */}
      {(editVenue || showAdd) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#DFE0D8] px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-[#181A1F] text-lg">{editVenue ? `Edit: ${editVenue.name}` : "Add New Venue"}</h3>
              <button onClick={() => { setEditVenue(null); setShowAdd(false); }}><X size={18} className="text-[#7D8178]" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {/* Basic info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-[#5F635C] uppercase mb-1 block">Venue Name</label>
                  <input value={form.name || ""} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Court Masters Indoor Arena" className={fieldCls} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-[#5F635C] uppercase mb-1 block">Location / Area</label>
                  <input value={form.location || ""} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                    placeholder="e.g. Indiranagar, Bangalore" className={fieldCls} />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5F635C] uppercase mb-1 block">Sport</label>
                  <select value={form.sport || "Badminton"} onChange={e => setForm(p => ({ ...p, sport: e.target.value }))} className={fieldCls}>
                    {["Badminton", "Football", "Tennis", "Basketball", "Cricket", "Squash", "Swimming"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5F635C] uppercase mb-1 block">Price / Hour (Rs)</label>
                  <input type="number" value={form.price || ""} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))}
                    placeholder="800" className={fieldCls} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#5F635C] uppercase mb-1 block">Description (shown to players)</label>
                <textarea value={form.description || ""} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Describe your venue — surface type, highlights, what makes it special..." rows={3} className={`${fieldCls} resize-none`} />
              </div>
              <div>
                <label className="text-xs font-bold text-[#5F635C] uppercase mb-2 block">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map(a => (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${(form.amenities || []).includes(a) ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "border-[#C9CBC2] text-[#464A45] hover:border-[#D6A500]"}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#5F635C] uppercase mb-2 block">Available Time Slots</label>
                <div className="flex flex-wrap gap-2">
                  {SLOT_OPTIONS.map(s => (
                    <button key={s} type="button" onClick={() => toggleSlot(s)}
                      className={`text-xs font-mono px-3 py-1.5 rounded-md border font-medium transition-all ${(form.slots || []).includes(s) ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "border-[#C9CBC2] text-[#464A45] hover:border-[#D6A500]"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#5F635C] uppercase mb-2 block">Cover Image</label>
                <ImageUpload value={form.image} onChange={image => setForm(p => ({ ...p, image }))} label="Upload venue cover" />
              </div>
              {!editVenue && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
                  <strong>Note:</strong> New venues are submitted for Admin review. Once approved, you can publish them live on the B2C page.
                </div>
              )}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-[#DFE0D8] px-6 py-4 flex gap-3">
              <button onClick={() => { setEditVenue(null); setShowAdd(false); }} className="flex-1 border border-[#C9CBC2] rounded-md py-2.5 text-sm text-[#30342F] hover:bg-[#F7F7F3]">Cancel</button>
              <button onClick={editVenue ? saveEdit : saveNew} className="flex-1 bg-[#FFC400] text-[#17140A] rounded-md py-2.5 text-sm font-semibold hover:bg-[#D9A900] flex items-center justify-center gap-2">
                <CheckCircle size={15} />{editVenue ? "Save Changes" : "Submit for Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {savedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#181A1F] text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 max-w-xs text-center">
          <CheckCircle size={15} className="text-[#755900] shrink-0" />{savedToast}
        </div>
      )}
    </div>
  );
}

export function VenueBookings() {
  const [filter, setFilter] = useState("all");
  const [sportFilter, setSportFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState(VENUE_BOOKINGS_DATA);
  const [extendId, setExtendId] = useState<string | number | null>(null);
  const [extendMins, setExtendMins] = useState(30);
  const [detailId, setDetailId] = useState<string | number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const filtered = bookings.filter(b => {
    const matchStatus = filter === "all" || b.status === filter;
    const matchSport = sportFilter === "All" || b.sport === sportFilter;
    const matchSearch = search === "" || b.player.toLowerCase().includes(search.toLowerCase()) || b.court.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSport && matchSearch;
  });

  const toggleSelect = (id: string | number) => setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleSelectAll = () => setSelectedIds(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(b => b.id)));
  const bulkExport = () => {
    const rows = filtered.filter(b => selectedIds.has(b.id));
    const csv = ["ID,Player,Sport,Court,Date,Time,Amount,Status", ...rows.map(b => `${b.id},${b.player},${b.sport},${b.court},${b.date},${b.time},${b.amount},${b.status}`)].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "venue-bookings.csv"; a.click();
  };

  const confirmBooking = (id: string | number) => setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "confirmed" } : b));
  const cancelBooking = (id: string | number) => setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
  const applyExtend = () => {
    setBookings(prev => prev.map(b => b.id === extendId ? { ...b, duration: b.duration + ` +${extendMins}min` } : b));
    setExtendId(null);
  };

  const statusColor = (s: string) => s === "confirmed" ? "success" : s === "completed" ? "blue" : s === "pending" ? "yellow" : "red";

  const detailBooking = detailId !== null ? bookings.find(b => b.id === detailId) : null;

  // Mock extra fields for detail view
  const mockPhone = "+91 98765 43210";
  const mockEmail = "player@email.com";
  const mockBookedAt = "Jul 12, 2026 · 09:34 AM";
  const mockPaymentMode = "UPI";
  const mockBookingCount = 14; // triggers VIP badge

  if (detailBooking) {
    return (
      <div className="p-6 space-y-5">
        {/* Back button + breadcrumb header */}
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => setDetailId(null)} className="flex items-center gap-2 text-sm text-[#5F635C] hover:text-[#222520] bg-white border border-[#C9CBC2] px-3 py-1.5 rounded-md transition-colors">
            <ArrowRightCircle size={14} className="rotate-180" /> Back
          </button>
        </div>
        <PageHeader title="Booking Detail" subtitle="Bookings → Detail" />

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Player info card */}
            <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
              <h3 className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-4">Player Information</h3>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[#FFC400]/15 flex items-center justify-center text-[#755900] font-bold text-2xl shrink-0">
                  {detailBooking.player[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-[#181A1F]">{detailBooking.player}</span>
                    {mockBookingCount > 10 && (
                      <span className="bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star size={10} className="fill-amber-500 text-amber-500" /> VIP Member
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-[#464A45]">
                    <div className="flex items-center gap-2"><Users size={13} className="text-[#7D8178]" />{mockPhone}</div>
                    <div className="flex items-center gap-2"><MapPin size={13} className="text-[#7D8178]" />{mockEmail}</div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-[#7D8178]">Booking ID</span>
                    <span className="font-mono text-xs bg-[#DFE0D8] px-2 py-0.5 rounded text-[#30342F]">{detailBooking.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking info card */}
            <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
              <h3 className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-4">Booking Information</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Sport", value: detailBooking.sport },
                  { label: "Court", value: detailBooking.court },
                  { label: "Date", value: detailBooking.date },
                  { label: "Time", value: detailBooking.time },
                  { label: "Duration", value: detailBooking.duration },
                  { label: "Amount", value: `₹${detailBooking.amount}` },
                  { label: "Payment Mode", value: mockPaymentMode },
                  { label: "Booked At", value: mockBookedAt },
                  { label: "Status", value: detailBooking.status },
                ].map(item => (
                  <div key={item.label} className="bg-[#F7F7F3] rounded-md p-3">
                    <div className="text-xs text-[#7D8178] mb-1">{item.label}</div>
                    {item.label === "Status"
                      ? <Badge text={item.value} color={statusColor(item.value)} />
                      : <div className="text-sm font-semibold text-[#181A1F]">{item.value}</div>
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {detailBooking.status === "pending" && (
                <button onClick={() => { confirmBooking(detailBooking.id); setDetailId(null); }}
                  className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2.5 rounded-md transition-colors">
                  <CheckCircle size={14} /> Confirm Booking
                </button>
              )}
              <button onClick={() => { cancelBooking(detailBooking.id); setDetailId(null); }}
                className="flex items-center gap-2 border border-red-300 text-red-500 hover:bg-red-50 text-sm font-semibold px-4 py-2.5 rounded-md transition-colors">
                <X size={14} /> Cancel
              </button>
              {(detailBooking.status === "confirmed" || detailBooking.status === "completed") && (
                <button className="flex items-center gap-2 border border-amber-300 text-amber-600 hover:bg-amber-50 text-sm font-semibold px-4 py-2.5 rounded-md transition-colors">
                  <DollarSign size={14} /> Initiate Refund
                </button>
              )}
              <button className="flex items-center gap-2 border border-[#C9CBC2] text-[#464A45] hover:bg-[#F7F7F3] text-sm font-semibold px-4 py-2.5 rounded-md transition-colors">
                <BarChart2 size={14} /> Print / Download
              </button>
            </div>

            {/* Notes / Activity log */}
            <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
              <h3 className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-4">Activity Log</h3>
              <div className="space-y-3">
                {[
                  { time: "Jul 12, 2026 · 09:34 AM", action: "Booking created", by: "Player (online)", color: "bg-[#FFC400]" },
                  { time: "Jul 12, 2026 · 09:35 AM", action: "Payment confirmed via UPI", by: "System", color: "bg-blue-500" },
                  { time: "Jul 12, 2026 · 10:00 AM", action: "Confirmation SMS sent to player", by: "System", color: "bg-[#7D8178]" },
                ].map((log, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${log.color}`} />
                    <div>
                      <div className="text-sm font-medium text-[#222520]">{log.action}</div>
                      <div className="text-xs text-[#7D8178]">{log.time} · by {log.by}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — QR code */}
          <div className="space-y-5">
            <div className="bg-white rounded-md border border-[#DFE0D8] overflow-hidden">
              <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-5 py-4">
                <h3 className="text-white font-bold text-sm">Entry Pass</h3>
                <p className="text-sky-100 text-xs mt-0.5">Scan at venue gate</p>
              </div>
              <div className="p-5 flex flex-col items-center gap-4">
                <QRCodeSVG value={`INSPIRQ-BK-${detailBooking.id}`} size={150} bgColor="#ffffff" fgColor="#182131" level="M" includeMargin />
                <div className="text-center">
                  <div className="font-mono text-xs text-[#5F635C]">{detailBooking.id}</div>
                  <div className="text-xs text-[#7D8178] mt-1">{detailBooking.date} · {detailBooking.time}</div>
                  <div className="text-xs text-[#7D8178]">{detailBooking.court}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <PageHeader title="Bookings" subtitle="Manage and track all court bookings"
        action={
          <div className="flex items-center gap-2">
            <button onClick={bulkExport}
              className="flex items-center gap-1.5 text-sm border border-[#C9CBC2] rounded-md px-3 py-1.5 hover:bg-[#F7F7F3] text-[#464A45]">
              <Activity size={14} /> Export CSV
            </button>
          </div>
        }
      />

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { s: "pending", color: "#C08B3E" }, { s: "confirmed", color: "#FFC400" },
          { s: "completed", color: "#3F718B" }, { s: "cancelled", color: "#B84A4A" }
        ].map(({ s, color }) => (
          <div key={s} className="bg-white rounded-md border border-[#DFE0D8] p-4 shadow-sm cursor-pointer hover:border-[#D6A500] transition-colors"
            onClick={() => setFilter(filter === s ? "all" : s)}>
            <div className="text-2xl font-bold" style={{ color }}>{bookings.filter(b => b.status === s).length}</div>
            <div className="text-xs text-[#5F635C] capitalize mt-0.5">{s}</div>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div className="bg-white border border-[#DFE0D8] rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8178]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search player name or court..."
              className="w-full pl-9 pr-3 py-2 border border-[#C9CBC2] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
          </div>
          <select value={sportFilter} onChange={e => setSportFilter(e.target.value)}
            className="border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500] bg-white">
            {["All", "Badminton", "Football", "Tennis", "Basketball", "Cricket"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "confirmed", "completed", "cancelled"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${filter === f ? "bg-[#FFC400] text-[#17140A]" : "bg-[#F7F7F3] border border-[#C9CBC2] text-[#464A45] hover:border-[#D6A500]"}`}>
              {f} ({f === "all" ? bookings.length : bookings.filter(b => b.status === f).length})
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-[#FFC400]/10 border border-[#D6A500]/20 rounded-xl px-4 py-3">
          <span className="text-sm font-semibold text-[#755900]">{selectedIds.size} selected</span>
          <button onClick={() => { filtered.filter(b => selectedIds.has(b.id) && b.status === "pending").forEach(b => confirmBooking(b.id)); setSelectedIds(new Set()); }}
            className="flex items-center gap-1.5 text-sm bg-sky-500 text-white px-3 py-1.5 rounded-md font-medium hover:bg-sky-600">
            <CheckCircle size={13} /> Confirm All
          </button>
          <button onClick={bulkExport} className="flex items-center gap-1.5 text-sm border border-[#A5A89E] px-3 py-1.5 rounded-md font-medium text-[#30342F] hover:bg-white">
            <Activity size={13} /> Export
          </button>
          <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-xs text-[#7D8178] hover:text-[#30342F]">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#DFE0D8] shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[#DFE0D8]">
          <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll}
            className="w-4 h-4 accent-[#D6A500]" />
          <span className="text-sm text-[#5F635C] font-medium">{filtered.length} bookings</span>
        </div>
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="bg-[#FFC400]/10 text-left">
                <TableHead className="w-8 px-4 py-3"></TableHead>
                {["Booking ID", "Player", "Venue / Court", "Sport", "Date & Time", "Amount", "Status", "Actions"].map(h => (
                  <TableHead key={h} className="px-4 py-3 text-xs font-semibold text-[#755900] uppercase tracking-wide whitespace-nowrap">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#F7F7F3]">
              {filtered.map(b => (
                <TableRow key={b.id} className={`hover:bg-[#F7F7F3]/50 transition-colors ${selectedIds.has(b.id) ? "bg-[#FFC400]/5" : ""}`}>
                  <TableCell className="px-4 py-3.5">
                    <input type="checkbox" checked={selectedIds.has(b.id)} onChange={() => toggleSelect(b.id)} className="w-4 h-4 accent-[#D6A500]" />
                  </TableCell>
                  <TableCell className="px-4 py-3.5 font-mono text-xs text-[#5F635C] bg-[#F7F7F3]">{b.id}</TableCell>
                  <TableCell className="px-4 py-3.5 font-medium text-[#181A1F]">{b.player}</TableCell>
                  <TableCell className="px-4 py-3.5 text-[#464A45]">{b.court}</TableCell>
                  <TableCell className="px-4 py-3.5">
                    <span className="text-xs bg-[#FFC400]/10 text-[#755900] font-semibold px-2 py-0.5 rounded-full">{b.sport}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <div className="text-sm text-[#30342F]">{b.date}</div>
                    <div className="text-xs text-[#7D8178]">{b.time} · {b.duration}</div>
                  </TableCell>
                  <TableCell className="px-4 py-3.5 font-bold text-[#181A1F]">₹{b.amount}</TableCell>
                  <TableCell className="px-4 py-3.5"><Badge text={b.status} color={statusColor(b.status)} /></TableCell>
                  <TableCell className="px-4 py-3.5">
                    <div className="flex gap-1.5 items-center flex-wrap">
                      {b.status === "pending" && (
                        <button onClick={() => confirmBooking(b.id)} className="text-xs bg-sky-50 text-sky-600 hover:bg-sky-100 px-2 py-1 rounded font-medium flex items-center gap-1">
                          <CheckCircle size={10} /> Confirm
                        </button>
                      )}
                      {b.status === "confirmed" && (
                        <button onClick={() => setExtendId(b.id)} className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded font-medium flex items-center gap-1">
                          <Timer size={10} /> Extend
                        </button>
                      )}
                      <button onClick={() => setDetailId(b.id)} className="text-xs bg-[#F7F7F3] text-[#464A45] hover:bg-[#DFE0D8] px-2 py-1 rounded font-medium flex items-center gap-1">
                        <Search size={10} /> View
                      </button>
                      {b.status !== "cancelled" && (
                        <button onClick={() => cancelBooking(b.id)} className="text-xs text-red-400 hover:text-red-600 font-medium">×</button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#7D8178]">
              <Calendar size={32} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm font-medium">No bookings match your filters</p>
            </div>
          )}
        </div>
      </div>

      {extendId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-6 w-full max-w-sm space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#181A1F]">Extend Booking Time</h3>
              <button onClick={() => setExtendId(null)}><X size={18} className="text-[#7D8178]" /></button>
            </div>
            <p className="text-sm text-[#5F635C]">Select how much extra time to add to this booking.</p>
            <div className="grid grid-cols-4 gap-2">
              {[30, 60, 90, 120].map(m => (
                <button key={m} onClick={() => setExtendMins(m)}
                  className={`py-2.5 text-sm font-semibold rounded-md border transition-all ${extendMins === m ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "border-[#C9CBC2] text-[#30342F] hover:border-[#D6A500]"}`}>
                  {m < 60 ? `${m}m` : `${m / 60}hr`}
                </button>
              ))}
            </div>
            <div className="bg-amber-50 rounded-md p-3 border border-amber-100 text-sm text-amber-700">
              Extra charge: <span className="font-bold">₹{Math.round((extendMins / 60) * 800)}</span> will be added to the booking.
            </div>
            <div className="flex gap-3">
              <button onClick={() => setExtendId(null)} className="flex-1 border border-[#C9CBC2] rounded-md py-2.5 text-sm hover:bg-[#F7F7F3] transition-colors">Cancel</button>
              <button onClick={applyExtend} className="flex-1 bg-[#FFC400] text-[#17140A] rounded-md py-2.5 text-sm font-semibold hover:bg-[#D9A900] transition-colors">Confirm Extension</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function VenueSlots() {
  const times = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];
  const days = ["Mon 7 Jul", "Tue 8 Jul", "Wed 9 Jul", "Thu 10 Jul", "Fri 11 Jul", "Sat 12 Jul", "Sun 13 Jul"];
  const courts = ["Court A", "Court B", "Court C"];

  const [selectedCourt, setSelectedCourt] = useState("Court A");
  const [slots, setSlots] = useState<Record<string, "available" | "booked" | "blocked">>(() => {
    const s: Record<string, "available" | "booked" | "blocked"> = {};
    days.forEach(d => {
      times.forEach(t => {
        const key = `${d}_${t}`;
        const r = Math.random();
        s[key] = r < 0.3 ? "booked" : r < 0.4 ? "blocked" : "available";
      });
    });
    return s;
  });

  const toggle = (key: string) => {
    setSlots(prev => {
      const cur = prev[key];
      if (cur === "booked") return prev;
      return { ...prev, [key]: cur === "available" ? "blocked" : "available" };
    });
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2">
          {courts.map(c => (
            <button key={c} onClick={() => setSelectedCourt(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCourt === c ? "bg-[#FFC400] text-[#17140A]" : "bg-[#DFE0D8] text-[#464A45] hover:bg-[#C9CBC2]"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs flex-wrap ml-auto">
          {[["available", "bg-[#FFC400]", "Available"], ["booked", "bg-blue-500", "Booked"], ["blocked", "bg-[#A5A89E]", "Blocked"]].map(([, bg, label]) => (
            <div key={label} className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded ${bg}`} /><span className="text-[#464A45]">{label}</span></div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-md border border-[#DFE0D8] overflow-auto">
        <Table className="min-w-max w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 px-4 py-3 text-left text-xs font-semibold text-[#7D8178] sticky left-0 bg-white">Time</TableHead>
              {days.map(d => (
                <TableHead key={d} className="px-3 py-3 text-xs font-semibold text-[#464A45] text-center whitespace-nowrap">{d}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {times.map(t => (
              <TableRow key={t} className="border-t border-[#F7F7F3]">
                <TableCell className="px-4 py-2 text-xs text-[#7D8178] sticky left-0 bg-white">{t}</TableCell>
                {days.map(d => {
                  const key = `${d}_${t}`;
                  const status = slots[key];
                  return (
                    <TableCell key={d} className="px-3 py-2 text-center">
                      <button onClick={() => toggle(key)}
                        className={`w-full h-8 rounded-lg text-xs font-medium transition-all ${
                          status === "booked" ? "bg-blue-100 text-blue-600 cursor-not-allowed" :
                          status === "blocked" ? "bg-[#DFE0D8] text-[#7D8178] hover:bg-[#C9CBC2]" :
                          "bg-[#FFC400]/20 text-[#755900] hover:bg-[#FFC400]/30"
                        }`}>
                        {status === "booked" ? "Booked" : status === "blocked" ? "Blocked" : "Free"}
                      </button>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-[#7D8178]">Click a slot to toggle between Available and Blocked. Booked slots cannot be modified.</p>
    </div>
  );
}

export function VenueEquipment() {
  const [items, setItems] = useState([
    { id: 1, name: "Badminton Racket", qty: 12, condition: "Good", fee: 50, sport: "Badminton" },
    { id: 2, name: "Shuttlecocks (pack)", qty: 30, condition: "New", fee: 30, sport: "Badminton" },
    { id: 3, name: "Football", qty: 8, condition: "Good", fee: 100, sport: "Football" },
    { id: 4, name: "Tennis Racket", qty: 6, condition: "Fair", fee: 80, sport: "Tennis" },
    { id: 5, name: "Yoga Mat", qty: 20, condition: "Good", fee: 40, sport: "Fitness" },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", qty: "", condition: "Good", fee: "", sport: "" });

  const add = () => {
    setItems(prev => [...prev, { id: Date.now(), ...form, qty: Number(form.qty), fee: Number(form.fee) }]);
    setShowAdd(false);
    setForm({ name: "", qty: "", condition: "Good", fee: "", sport: "" });
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[#181A1F]">Equipment Inventory</h3>
        <button onClick={() => setShowAdd(true)} className="bg-[#FFC400] text-[#17140A] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#D9A900] flex items-center gap-2">
          <Plus size={15} /> Add Item
        </button>
      </div>
      <div className="bg-white rounded-md border border-[#DFE0D8] overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-[#FFC400]/10">
            <TableRow>
              {["Equipment", "Sport", "Quantity", "Condition", "Rental Fee", "Actions"].map(h => (
                <TableHead key={h} className="text-left text-xs font-semibold text-[#755900] px-4 py-3">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-[#F7F7F3]">
            {items.map(item => (
              <TableRow key={item.id} className="hover:bg-[#F7F7F3]/50">
                <TableCell className="px-4 py-3 flex items-center gap-2">
                  <Package size={16} className="text-[#7D8178]" />
                  <span className="text-sm font-medium text-[#181A1F]">{item.name}</span>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-[#464A45]">{item.sport}</TableCell>
                <TableCell className="px-4 py-3 text-sm font-medium text-[#181A1F]">{item.qty}</TableCell>
                <TableCell className="px-4 py-3">
                  <Badge text={item.condition} color={item.condition === "New" ? "success" : item.condition === "Good" ? "blue" : "yellow"} />
                </TableCell>
                <TableCell className="px-4 py-3 text-sm font-bold text-[#181A1F]">₹{item.fee}</TableCell>
                <TableCell className="px-4 py-3">
                  <div className="flex gap-2">
                    <button aria-label="Edit" className="p-1.5 text-[#7D8178] hover:text-[#464A45]"><Edit2 size={14} /></button>
                    <button onClick={() => setItems(p => p.filter(i => i.id !== item.id))} className="p-1.5 text-red-300 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-6 w-full max-w-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#181A1F]">Add Equipment</h3>
              <button onClick={() => setShowAdd(false)}><X size={18} className="text-[#7D8178]" /></button>
            </div>
            {[
              { label: "Equipment Name", key: "name", placeholder: "Badminton Racket" },
              { label: "Sport", key: "sport", placeholder: "Badminton" },
              { label: "Quantity", key: "qty", placeholder: "10" },
              { label: "Rental Fee (₹)", key: "fee", placeholder: "50" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">{f.label}</label>
                <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
              </div>
            ))}
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

export function VenueRevenue() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today" value="₹14,200" sub="8 bookings" icon={DollarSign} />
        <StatCard label="This Week" value="₹78,500" sub="↑ 12%" icon={TrendingUp} color="#3F718B" />
        <StatCard label="This Month" value="₹1.24L" sub="↑ 18% vs last" icon={BarChart2} color="#C08B3E" />
        <StatCard label="Avg per Booking" value="₹1,750" sub="Across all courts" icon={Activity} color="#B84A4A" />
      </div>
      <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
        <h3 className="font-bold text-[#181A1F] mb-4">Monthly Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={MONTHLY_REVENUE}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
            <Line name="Revenue" type="monotone" dataKey="revenue" stroke="#FFC400" strokeWidth={2.5} dot={{ fill: "#FFC400", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-md border border-[#DFE0D8] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#DFE0D8] font-bold text-[#181A1F]">Revenue Breakdown by Sport</div>
        <div className="p-5 space-y-3">
          {[
            { sport: "Badminton", pct: 45, amount: "₹55,800" },
            { sport: "Football", pct: 28, amount: "₹34,720" },
            { sport: "Tennis", pct: 18, amount: "₹22,320" },
            { sport: "Basketball", pct: 9, amount: "₹11,160" },
          ].map(r => (
            <div key={r.sport} className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-[#30342F] shrink-0">{r.sport}</div>
              <div className="flex-1 bg-[#DFE0D8] rounded-full h-2.5">
                <div className="bg-[#FFC400] h-2.5 rounded-full" style={{ width: `${r.pct}%` }} />
              </div>
              <div className="flex gap-2 items-center w-28 justify-end">
                <span className="text-xs text-[#7D8178]">{r.pct}%</span>
                <span className="text-sm font-bold text-[#181A1F]">{r.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function VenueAnalytics() {
  return (
    <div className="p-6 space-y-5">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Peak Hour", value: "6–8 PM", sub: "Fri, Sat, Sun", icon: Clock, color: "#C08B3E" },
          { label: "Top Booker", value: "Arjun M.", sub: "22 bookings this month", icon: Users, color: "#3F718B" },
          { label: "Cancellation Rate", value: "8.3%", sub: "↓ 2% vs last month", icon: Activity, color: "#B84A4A" },
        ].map(s => <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} icon={s.icon} color={s.color} />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
          <h3 className="font-bold text-[#181A1F] mb-4">Bookings by Day of Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { day: "Mon", bookings: 24 }, { day: "Tue", bookings: 18 }, { day: "Wed", bookings: 22 },
              { day: "Thu", bookings: 26 }, { day: "Fri", bookings: 38 }, { day: "Sat", bookings: 52 }, { day: "Sun", bookings: 48 }
            ]}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar name="Bookings" dataKey="bookings" fill="#FFC400" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-md border border-[#DFE0D8] p-5">
          <h3 className="font-bold text-[#181A1F] mb-4">Occupancy by Time Slot</h3>
          <div className="space-y-2">
            {[
              { time: "6–9 AM", pct: 45 }, { time: "9–12 PM", pct: 30 }, { time: "12–3 PM", pct: 25 },
              { time: "3–6 PM", pct: 60 }, { time: "6–9 PM", pct: 94 }, { time: "9–11 PM", pct: 70 },
            ].map(r => (
              <div key={r.time} className="flex items-center gap-3">
                <div className="w-20 text-xs text-[#5F635C] shrink-0">{r.time}</div>
                <div className="flex-1 bg-[#DFE0D8] rounded-full h-2">
                  <div className="bg-[#FFC400] h-2 rounded-full" style={{ width: `${r.pct}%` }} />
                </div>
                <div className="text-xs font-semibold text-[#30342F] w-8 text-right">{r.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function VenueCustomers() {
  const [search, setSearch] = useState("");
  const customers = [
    { id: 1, name: "Arjun Mehta", sport: "Badminton", bookings: 22, spend: 17600, last: "Jul 8, 2026", rating: 5 },
    { id: 2, name: "Priya Sharma", sport: "Tennis", bookings: 15, spend: 13200, last: "Jul 6, 2026", rating: 4 },
    { id: 3, name: "Rohit Kumar", sport: "Football", bookings: 11, spend: 8800, last: "Jul 5, 2026", rating: 5 },
    { id: 4, name: "Divya Nair", sport: "Badminton", bookings: 9, spend: 7200, last: "Jul 3, 2026", rating: 4 },
    { id: 5, name: "Vikram Singh", sport: "Basketball", bookings: 8, spend: 6400, last: "Jul 2, 2026", rating: 3 },
  ];

  const filteredCustomers = search ? customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.sport.toLowerCase().includes(search.toLowerCase())) : customers;

  return (
    <div className="p-6 space-y-5">
      <PageHeader title="Customer Management" subtitle="Track your top players and spending" />
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Total Customers" value="284" sub="↑ 23 this month" icon={Users} />
        <StatCard label="Repeat Customers" value="68%" sub="Book 2+ times/month" icon={CheckCircle} color="#3F718B" />
        <StatCard label="Avg Lifetime Value" value="₹8,400" sub="Per customer" icon={DollarSign} color="#C08B3E" />
      </div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8178]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or sport..." className="w-full pl-9 pr-4 py-2.5 border border-[#C9CBC2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
      </div>
      <div className="bg-white rounded-md border border-[#DFE0D8] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#DFE0D8] font-bold text-[#181A1F]">Customers ({filteredCustomers.length})</div>
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[600px]">
            <TableHeader className="bg-[#FFC400]/10">
              <TableRow>
                {["Customer", "Fav Sport", "Bookings", "Total Spend", "Last Visit", "Rating"].map(h => (
                  <TableHead key={h} className="text-left text-xs font-semibold text-[#755900] px-4 py-3">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#F7F7F3]">
              {filteredCustomers.map(c => (
                <TableRow key={c.id} className="hover:bg-[#F7F7F3]/50">
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#FFC400]/15 flex items-center justify-center text-[#755900] font-bold text-sm">{c.name[0]}</div>
                      <span className="text-sm font-medium text-[#181A1F]">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-[#464A45]">{c.sport}</TableCell>
                  <TableCell className="px-4 py-3 text-sm font-semibold text-[#181A1F]">{c.bookings}</TableCell>
                  <TableCell className="px-4 py-3 text-sm font-bold text-[#181A1F]">₹{c.spend.toLocaleString()}</TableCell>
                  <TableCell className="px-4 py-3 text-xs text-[#5F635C]">{c.last}</TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: c.rating }).map((_, i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
                    </div>
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

export function VenuePreBooking() {
  const [prebookings, setPrebookings] = useState([
    { id: 1, player: "Arjun Mehta", sport: "Badminton", court: "Court A", day: "Monday", time: "07:00", duration: "1 hr", fee: 800, status: "active" },
    { id: 2, player: "Priya Sharma", sport: "Tennis", court: "Court B", day: "Wednesday", time: "18:00", duration: "1 hr", fee: 1200, status: "active" },
    { id: 3, player: "Rohit Kumar", sport: "Football", court: "Main Ground", day: "Saturday", time: "06:00", duration: "2 hrs", fee: 2200, status: "paused" },
  ]);

  return (
    <div className="p-6 space-y-5">
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-sm text-blue-700">
        <strong>Pre-Booking (Abonnement):</strong> Recurring weekly slots reserved by premium players. Auto-confirmed every week.
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Active Pre-Bookings" value="3" icon={Calendar} />
        <StatCard label="Monthly Guaranteed" value="₹16,800" sub="From pre-bookings" icon={DollarSign} color="#3F718B" />
        <StatCard label="Utilization" value="38%" sub="Of total capacity" icon={Activity} color="#C08B3E" />
      </div>
      <div className="space-y-3">
        {prebookings.map(pb => (
          <div key={pb.id} className="bg-white rounded-md border border-[#DFE0D8] p-5 flex items-center gap-4">
            <div className="bg-blue-50 w-10 h-10 rounded-md flex items-center justify-center text-blue-500 shrink-0">
              <Calendar size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[#181A1F]">{pb.player}</div>
              <div className="text-sm text-[#5F635C]">{pb.sport} · {pb.court} · Every {pb.day} at {pb.time} · {pb.duration}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-bold text-[#181A1F]">₹{pb.fee}/wk</div>
              <Badge text={pb.status === "active" ? "Active" : "Paused"} color={pb.status === "active" ? "success" : "yellow"} />
            </div>
            <button onClick={() => setPrebookings(prev => prev.map(p => p.id === pb.id ? { ...p, status: p.status === "active" ? "paused" : "active" } : p))}
              className="text-xs border border-[#C9CBC2] px-3 py-1.5 rounded-lg hover:bg-[#F7F7F3] shrink-0">
              {pb.status === "active" ? "Pause" : "Resume"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const CHECKIN_DATA = [
  { id: 1, player: "Arjun Mehta", sport: "Badminton", court: "Court A", time: "07:00–08:00", status: "checked_in", checkinAt: "06:58 AM", phone: "+91 98765 43210" },
  { id: 2, player: "Priya Sharma", sport: "Badminton", court: "Court B", time: "07:00–08:00", status: "upcoming", checkinAt: null, phone: "+91 87654 32109" },
  { id: 3, player: "Rohit Kumar", sport: "Badminton", court: "Court A", time: "08:00–09:00", status: "upcoming", checkinAt: null, phone: "+91 76543 21098" },
  { id: 4, player: "TCS Corporate", sport: "Badminton", court: "All Courts", time: "18:00–20:00", status: "upcoming", checkinAt: null, phone: "+91 98765 11111" },
  { id: 5, player: "Divya Nair", sport: "Tennis", court: "Court B", time: "17:00–18:00", status: "no_show", checkinAt: null, phone: "+91 65432 10987" },
];

export function VenueCheckIn() {
  const [bookings, setBookings] = useState(CHECKIN_DATA);
  const [search, setSearch] = useState("");

  const checkIn = (id: number) =>
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "checked_in", checkinAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) } : b));

  const checkOut = (id: number) =>
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "checked_out" } : b));

  const markNoShow = (id: number) =>
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "no_show" } : b));

  const filtered = bookings.filter(b =>
    b.player.toLowerCase().includes(search.toLowerCase()) ||
    b.court.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor: Record<string, string> = {
    checked_in: "success", checked_out: "blue", upcoming: "yellow", no_show: "red",
  };

  return (
    <div className="p-6 space-y-5">
      <div className="grid sm:grid-cols-4 gap-4">
        <StatCard label="Today's Slots" value={bookings.length.toString()} icon={Calendar} />
        <StatCard label="Checked In" value={bookings.filter(b => b.status === "checked_in").length.toString()} icon={CheckCircle} color="#FFC400" />
        <StatCard label="Upcoming" value={bookings.filter(b => b.status === "upcoming").length.toString()} icon={Clock} color="#C08B3E" />
        <StatCard label="No Shows" value={bookings.filter(b => b.status === "no_show").length.toString()} icon={UserCheck} color="#B84A4A" />
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8178]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search player or court..."
          className="w-full pl-9 pr-4 py-2.5 border border-[#C9CBC2] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
      </div>

      <div className="space-y-3">
        {filtered.map(b => (
          <div key={b.id} className="bg-white rounded-md border border-[#DFE0D8] p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-md flex items-center justify-center shrink-0 ${b.status === "checked_in" ? "bg-sky-50" : b.status === "no_show" ? "bg-red-50" : "bg-[#F7F7F3]"}`}>
              {b.status === "checked_in" ? <CheckCircle size={20} className="text-sky-500" /> :
               b.status === "no_show" ? <X size={20} className="text-red-400" /> :
               <Clock size={20} className="text-[#7D8178]" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[#181A1F]">{b.player}</div>
              <div className="text-sm text-[#5F635C]">{b.sport} · {b.court} · {b.time}</div>
              {b.checkinAt && (
                <div className="text-xs text-sky-600 mt-0.5">Checked in at {b.checkinAt}</div>
              )}
            </div>
            <div className="text-xs text-[#7D8178] shrink-0 hidden sm:block">{b.phone}</div>
            <div className="flex gap-2 shrink-0">
              <Badge text={b.status.replace("_", " ")} color={statusColor[b.status] ?? "gray"} />
              {b.status === "upcoming" && (
                <>
                  <button onClick={() => checkIn(b.id)}
                    className="flex items-center gap-1.5 bg-sky-50 text-sky-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-sky-100">
                    <ArrowRightCircle size={13} /> Check In
                  </button>
                  <button onClick={() => markNoShow(b.id)}
                    className="text-xs bg-red-50 text-red-400 px-2.5 py-1.5 rounded-lg hover:bg-red-100 font-medium">
                    No Show
                  </button>
                </>
              )}
              {b.status === "checked_in" && (
                <button onClick={() => checkOut(b.id)}
                  className="flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-100">
                  <Timer size={13} /> Check Out
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VenueBulkBooking() {
  const [bookings, setBookings] = useState([
    { id: 1, company: "TCS", contact: "Ramesh Kumar", email: "ramesh@tcs.com", phone: "+91 98765 11111", sport: "Badminton", courts: 4, days: "Mon–Fri", time: "18:00–20:00", players: 40, fee: 12800, status: "active", contractEnd: "Dec 31, 2026" },
    { id: 2, company: "Infosys", contact: "Priya Singh", email: "priya@infosys.com", phone: "+91 98765 22222", sport: "Football", courts: 1, days: "Sat–Sun", time: "07:00–09:00", players: 22, fee: 8800, status: "active", contractEnd: "Sep 30, 2026" },
    { id: 3, company: "Wipro", contact: "Arjun Dev", email: "arjun@wipro.com", phone: "+91 98765 33333", sport: "Badminton", courts: 2, days: "Wed, Fri", time: "19:00–21:00", players: 16, fee: 6400, status: "pending", contractEnd: "—" },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ company: "", contact: "", email: "", phone: "", sport: "Badminton", courts: "2", days: "", time: "", players: "", fee: "", contractEnd: "" });

  const add = () => {
    setBookings(prev => [...prev, { id: Date.now(), ...form, courts: Number(form.courts), players: Number(form.players), fee: Number(form.fee), status: "pending" }]);
    setShowAdd(false);
    setForm({ company: "", contact: "", email: "", phone: "", sport: "Badminton", courts: "2", days: "", time: "", players: "", fee: "", contractEnd: "" });
  };

  const companyColors: Record<string, string> = { TCS: "#0070AD", Infosys: "#007CC3", Wipro: "#341C5C" };

  return (
    <div className="p-6 space-y-5">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-md p-5 text-white">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={18} />
            <span className="font-bold text-base">Corporate &amp; Bulk Booking</span>
          </div>
          <p className="text-blue-100 text-sm max-w-xl">Dedicated recurring slots for companies, corporates, and large groups at <strong className="text-white">15–25% discounted rates</strong>. Priority slot access, dedicated account manager, and monthly invoice included.</p>
          <div className="flex flex-wrap gap-3 mt-3">
            {["Priority Slot Access", "Monthly Invoice", "Dedicated Manager", "Bulk Pricing"].map(f => (
              <span key={f} className="bg-white/15 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">{f}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <StatCard label="Active Contracts" value={bookings.filter(b => b.status === "active").length.toString()} icon={Building2} />
        <StatCard label="Monthly Guaranteed" value={`₹${bookings.filter(b => b.status === "active").reduce((s, b) => s + b.fee * 4, 0).toLocaleString()}`} sub="From bulk contracts" icon={DollarSign} color="#3F718B" />
        <StatCard label="Total Players" value={bookings.reduce((s, b) => s + b.players, 0).toString()} icon={Users} color="#C08B3E" />
        <StatCard label="Courts Reserved" value={bookings.filter(b => b.status === "active").reduce((s, b) => s + b.courts, 0).toString()} sub="Active contracts" icon={Calendar} color="#765A88" />
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowAdd(true)} className="bg-[#FFC400] text-[#17140A] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#D9A900] flex items-center gap-2">
          <Plus size={15} /> New Corporate Contract
        </button>
      </div>

      <div className="space-y-4">
        {bookings.map(b => (
          <div key={b.id} className="bg-white rounded-md border border-[#DFE0D8] overflow-hidden">
            <div className="flex items-center gap-0 sm:flex-row">
              <div className="w-2 self-stretch rounded-l-md" style={{ background: companyColors[b.company] ?? "#FFC400" }} />
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between mb-4 gap-2 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{ background: companyColors[b.company] ?? "#FFC400" }}>
                      {b.company[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#181A1F] text-base">{b.company}</h3>
                      <div className="text-xs text-[#5F635C] mt-0.5">{b.contact} · {b.email}</div>
                      <div className="text-xs text-[#7D8178]">{b.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge text={b.status} color={b.status === "active" ? "success" : "yellow"} />
                    <button aria-label="Edit" className="p-1.5 text-[#7D8178] hover:text-[#464A45] hover:bg-[#DFE0D8] rounded-md"><Edit2 size={13} /></button>
                    <button aria-label="Delete" className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-md"><Trash2 size={13} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-[#F7F7F3] rounded-md p-4">
                  <div><span className="text-[#7D8178] block text-xs mb-0.5">Sport</span><span className="font-semibold text-[#181A1F] text-sm">{b.sport}</span></div>
                  <div><span className="text-[#7D8178] block text-xs mb-0.5">Courts</span><span className="font-semibold text-[#181A1F] text-sm">{b.courts} courts</span></div>
                  <div><span className="text-[#7D8178] block text-xs mb-0.5">Schedule</span><span className="font-semibold text-[#181A1F] text-sm">{b.days}</span><span className="text-xs text-[#5F635C] block">{b.time}</span></div>
                  <div><span className="text-[#7D8178] block text-xs mb-0.5">Players</span><span className="font-semibold text-[#181A1F] text-sm">{b.players} registered</span></div>
                  <div><span className="text-[#7D8178] block text-xs mb-0.5">Monthly Fee</span><span className="font-semibold text-sky-600 text-sm">₹{(b.fee * 4).toLocaleString()}</span></div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F7F7F3] text-xs text-[#7D8178]">
                  <span>Contract ends: <strong className="text-[#464A45]">{(b as any).contractEnd ?? "—"}</strong></span>
                  <button className="text-[#755900] font-semibold hover:underline">View Details</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-6 w-full max-w-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#181A1F]">Add Corporate Contract</h3>
              <button onClick={() => setShowAdd(false)}><X size={18} className="text-[#7D8178]" /></button>
            </div>
            {[
              { label: "Company Name", key: "company", placeholder: "TCS, Infosys..." },
              { label: "Contact Person", key: "contact", placeholder: "Ramesh Kumar" },
              { label: "Contact Email", key: "email", placeholder: "ramesh@company.com" },
              { label: "Contact Phone", key: "phone", placeholder: "+91 98765 00000" },
              { label: "Schedule (Days)", key: "days", placeholder: "Mon–Fri" },
              { label: "Time Slot", key: "time", placeholder: "18:00–20:00" },
              { label: "No. of Players", key: "players", placeholder: "20" },
              { label: "Weekly Fee (₹)", key: "fee", placeholder: "6400" },
              { label: "Contract End Date", key: "contractEnd", placeholder: "Dec 31, 2026" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">{f.label}</label>
                <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Sport</label>
                <select value={form.sport} onChange={e => setForm(p => ({ ...p, sport: e.target.value }))}
                  className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]">
                  {["Badminton", "Football", "Tennis", "Basketball", "Cricket"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Courts</label>
                <input type="number" value={form.courts} onChange={e => setForm(p => ({ ...p, courts: e.target.value }))}
                  className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowAdd(false)} className="flex-1 border border-[#C9CBC2] rounded-md py-2.5 text-sm">Cancel</button>
              <button onClick={add} className="flex-1 bg-[#FFC400] text-[#17140A] rounded-md py-2.5 text-sm font-semibold">Add Contract</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function VenueRecurring() {
  const RECURRING = [
    { id: 1, player: "Arjun Mehta", phone: "+91 98765 43210", sport: "Badminton", court: "Court A", day: "Monday", time: "07:00–08:00", plan: "Monthly", fee: 3200, status: "active", since: "Apr 2026", nextDate: "Jul 14, 2026", totalPaid: 9600 },
    { id: 2, player: "Priya Sharma", phone: "+91 87654 32109", sport: "Tennis", court: "Court B", day: "Wed & Fri", time: "18:00–19:00", plan: "Quarterly", fee: 5500, status: "active", since: "May 2026", nextDate: "Jul 16, 2026", totalPaid: 11000 },
    { id: 3, player: "TCS Sports Club", phone: "+91 98765 11111", sport: "Badminton", court: "All Courts", day: "Tue & Thu", time: "19:00–21:00", plan: "Annual Corporate", fee: 45000, status: "active", since: "Jan 2026", nextDate: "Jul 15, 2026", totalPaid: 315000 },
    { id: 4, player: "Rohit Kumar", phone: "+91 76543 21098", sport: "Football", court: "Main Ground", day: "Saturday", time: "06:00–08:00", plan: "Monthly", fee: 2800, status: "paused", since: "Jun 2026", nextDate: "Paused", totalPaid: 2800 },
    { id: 5, player: "Divya Nair", phone: "+91 65432 10987", sport: "Badminton", court: "Court A", day: "Daily", time: "06:00–07:00", plan: "Weekly", fee: 1200, status: "expired", since: "Mar 2026", nextDate: "Expired", totalPaid: 16800 },
  ];

  const [records, setRecords] = useState(RECURRING);
  const [tabFilter, setTabFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    player: "", phone: "", sport: "Badminton", court: "", day: "", time: "", plan: "Monthly", fee: "", startDate: "", notes: "",
  });

  const activePlans = records.filter(r => r.status === "active");
  const monthlyRevenue = activePlans.reduce((s, r) => s + r.fee, 0);
  const corporatePlans = records.filter(r => r.plan.toLowerCase().includes("corporate")).length;

  const planDurations: Record<string, number> = { Weekly: 1, Monthly: 4, Quarterly: 12, "Annual Corporate": 52 };
  const avgDuration = records.length > 0
    ? Math.round(records.reduce((s, r) => s + (planDurations[r.plan] || 4), 0) / records.length)
    : 0;

  const planOptions = ["Weekly", "Monthly", "Quarterly", "Annual Corporate"];

  const filteredRecords = records.filter(r => {
    const matchTab = tabFilter === "all" || r.status === tabFilter;
    const matchPlan = planFilter === "all" || r.plan === planFilter;
    return matchTab && matchPlan;
  });

  const statusColor = (s: string) => s === "active" ? "success" : s === "paused" ? "yellow" : "red";

  const togglePause = (id: number) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: r.status === "active" ? "paused" : "active", nextDate: r.status === "active" ? "Paused" : "Jul 14, 2026" } : r));
  };

  const cancelRecord = (id: number) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: "expired", nextDate: "Expired" } : r));
  };

  const addRecord = () => {
    setRecords(prev => [...prev, {
      id: Date.now(),
      player: addForm.player || "New Player",
      phone: addForm.phone || "",
      sport: addForm.sport,
      court: addForm.court || "Court A",
      day: addForm.day || "Monday",
      time: addForm.time || "07:00–08:00",
      plan: addForm.plan,
      fee: Number(addForm.fee) || 0,
      status: "active",
      since: "Jul 2026",
      nextDate: addForm.startDate || "Jul 14, 2026",
      totalPaid: 0,
    }]);
    setShowAdd(false);
    setAddForm({ player: "", phone: "", sport: "Badminton", court: "", day: "", time: "", plan: "Monthly", fee: "", startDate: "", notes: "" });
  };

  const recurringColumns: ColDef<typeof RECURRING[0]>[] = [
    {
      key: "player", label: "Player", sortable: true,
      render: (v, r) => (
        <div>
          <div className="font-medium text-[#181A1F] text-sm">{v}</div>
          <div className="text-xs text-[#7D8178]">{r.phone}</div>
        </div>
      ),
    },
    {
      key: "sport", label: "Sport / Court", sortable: true,
      render: (v, r) => <span className="text-sm text-[#464A45]">{v} · {r.court}</span>,
    },
    {
      key: "day", label: "Schedule",
      render: (v, r) => (
        <div>
          <div className="text-sm font-medium text-[#222520]">{v}</div>
          <div className="text-xs text-[#7D8178]">{r.time}</div>
        </div>
      ),
    },
    {
      key: "plan", label: "Plan",
      render: (v) => (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${v === "Annual Corporate" ? "bg-indigo-50 text-indigo-700 border-indigo-200" : v === "Quarterly" ? "bg-blue-50 text-blue-700 border-blue-200" : v === "Weekly" ? "bg-[#F7F7F3] text-[#464A45] border-[#C9CBC2]" : "bg-[#FFC400]/10 text-[#755900] border-[#D6A500]/20"}`}>
          {v}
        </span>
      ),
    },
    { key: "nextDate", label: "Next Date", sortable: true, render: (v) => <span className="text-sm text-[#464A45]">{v}</span> },
    { key: "fee", label: "Fee/Cycle", sortable: true, render: (v) => <span className="font-bold text-[#181A1F] text-sm">₹{Number(v).toLocaleString()}</span> },
    { key: "totalPaid", label: "Total Paid", sortable: true, render: (v) => <span className="text-sm font-semibold text-sky-600">₹{Number(v).toLocaleString()}</span> },
    { key: "status", label: "Status", sortable: true, render: (v) => <Badge text={v} color={statusColor(v)} /> },
    {
      key: "id", label: "Actions",
      render: (_, r) => (
        <div className="flex gap-1.5 flex-wrap">
          {r.status !== "expired" && (
            <button onClick={() => togglePause(r.id)}
              className={`text-xs px-2 py-1 rounded font-medium flex items-center gap-1 ${r.status === "active" ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-sky-50 text-sky-600 hover:bg-sky-100"}`}>
              {r.status === "active" ? <Timer size={10} /> : <CheckCircle size={10} />}
              {r.status === "active" ? "Pause" : "Resume"}
            </button>
          )}
          {r.status !== "expired" && (
            <button onClick={() => cancelRecord(r.id)}
              className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-2 py-1 rounded font-medium flex items-center gap-1">
              <X size={10} /> Cancel
            </button>
          )}
          <button className="text-xs bg-[#F7F7F3] text-[#464A45] hover:bg-[#DFE0D8] px-2 py-1 rounded font-medium flex items-center gap-1">
            <Search size={10} /> View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Recurring Bookings"
        subtitle="Manage subscription-based recurring slot plans"
        action={
          <button onClick={() => setShowAdd(true)} className="bg-[#FFC400] text-[#17140A] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#D9A900] flex items-center gap-2">
            <Plus size={15} /> Add Recurring
          </button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Plans" value={activePlans.length.toString()} sub={`${records.length} total`} icon={Calendar} />
        <StatCard label="Monthly Guaranteed" value={`₹${monthlyRevenue.toLocaleString()}`} sub="From active plans" icon={DollarSign} color="#3F718B" />
        <StatCard label="Corporate Plans" value={corporatePlans.toString()} sub="Annual contracts" icon={Building2} color="#765A88" />
        <StatCard label="Avg Plan Duration" value={`${avgDuration}wks`} sub="Across all plans" icon={TrendingUp} color="#C08B3E" />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2 flex-wrap">
          {["all", "active", "paused", "expired"].map(t => (
            <button key={t} onClick={() => setTabFilter(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${tabFilter === t ? "bg-[#FFC400] text-[#17140A]" : "bg-white border border-[#C9CBC2] text-[#464A45] hover:border-[#D6A500] hover:text-[#755900]"}`}>
              {t} ({t === "all" ? records.length : records.filter(r => r.status === t).length})
            </button>
          ))}
        </div>
        <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}
          className="ml-auto border border-[#C9CBC2] rounded-md px-3 py-1.5 text-sm text-[#464A45] focus:outline-none focus:ring-2 focus:ring-[#D6A500] bg-white">
          <option value="all">All Plan Types</option>
          {planOptions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <DataTable
        data={filteredRecords}
        title="Recurring Plans"
        searchPlaceholder="Search player, sport..."
        columns={recurringColumns}
      />

      {/* Add Recurring Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#DFE0D8] px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-[#181A1F] text-lg">Add Recurring Plan</h3>
              <button onClick={() => setShowAdd(false)}><X size={18} className="text-[#7D8178]" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-[#5F635C] uppercase mb-1 block">Player Name</label>
                  <input value={addForm.player} onChange={e => setAddForm(p => ({ ...p, player: e.target.value }))}
                    placeholder="Arjun Mehta"
                    className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-[#5F635C] uppercase mb-1 block">Phone</label>
                  <input value={addForm.phone} onChange={e => setAddForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5F635C] uppercase mb-1 block">Sport</label>
                  <select value={addForm.sport} onChange={e => setAddForm(p => ({ ...p, sport: e.target.value }))}
                    className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]">
                    {["Badminton", "Football", "Tennis", "Basketball", "Cricket"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5F635C] uppercase mb-1 block">Court</label>
                  <input value={addForm.court} onChange={e => setAddForm(p => ({ ...p, court: e.target.value }))}
                    placeholder="Court A"
                    className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5F635C] uppercase mb-1 block">Day(s)</label>
                  <input value={addForm.day} onChange={e => setAddForm(p => ({ ...p, day: e.target.value }))}
                    placeholder="Monday / Mon & Wed"
                    className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5F635C] uppercase mb-1 block">Time</label>
                  <input value={addForm.time} onChange={e => setAddForm(p => ({ ...p, time: e.target.value }))}
                    placeholder="07:00–08:00"
                    className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5F635C] uppercase mb-1 block">Plan Type</label>
                  <select value={addForm.plan} onChange={e => setAddForm(p => ({ ...p, plan: e.target.value }))}
                    className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]">
                    {planOptions.map(pl => <option key={pl}>{pl}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5F635C] uppercase mb-1 block">Fee / Cycle (₹)</label>
                  <input type="number" value={addForm.fee} onChange={e => setAddForm(p => ({ ...p, fee: e.target.value }))}
                    placeholder="3200"
                    className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-[#5F635C] uppercase mb-1 block">Start Date</label>
                  <input type="date" value={addForm.startDate} onChange={e => setAddForm(p => ({ ...p, startDate: e.target.value }))}
                    className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-[#5F635C] uppercase mb-1 block">Notes (optional)</label>
                  <textarea value={addForm.notes} onChange={e => setAddForm(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Any special instructions or notes..."
                    rows={3}
                    className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500] resize-none" />
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-[#DFE0D8] px-6 py-4 flex gap-3">
              <button onClick={() => setShowAdd(false)} className="flex-1 border border-[#C9CBC2] rounded-md py-2.5 text-sm text-[#30342F] hover:bg-[#F7F7F3]">Cancel</button>
              <button onClick={addRecord} className="flex-1 bg-[#FFC400] text-[#17140A] rounded-md py-2.5 text-sm font-semibold hover:bg-[#D9A900] flex items-center justify-center gap-2">
                <CheckCircle size={15} /> Add Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── VenueInventory ──────────────────────────────────────────────────────────

const INIT_PRODUCTS = [
  { id: 1, sku: "EQ-001", name: "Shuttle Tube (6 pack)", cat: "Equipment", type: "product", price: 120, stock: 48, minStock: 10, unit: "pack" },
  { id: 2, sku: "EQ-002", name: "Grip Tape", cat: "Equipment", type: "product", price: 80, stock: 7, minStock: 10, unit: "pcs" },
  { id: 3, sku: "BV-001", name: "Water Bottle 500ml", cat: "Beverages", type: "product", price: 30, stock: 100, minStock: 20, unit: "bottle" },
  { id: 4, sku: "BV-002", name: "Energy Drink", cat: "Beverages", type: "product", price: 60, stock: 3, minStock: 10, unit: "can" },
  { id: 5, sku: "SV-001", name: "Court Booking 1hr", cat: "Court", type: "service", price: 800, stock: -1, minStock: 0, unit: "session" },
  { id: 6, sku: "SV-002", name: "Personal Training 1hr", cat: "Training", type: "service", price: 1200, stock: -1, minStock: 0, unit: "session" },
  { id: 7, sku: "RT-001", name: "Racket Rental", cat: "Rental", type: "rental", price: 100, stock: 12, minStock: 5, unit: "item/day" },
  { id: 8, sku: "RT-002", name: "Knee Brace", cat: "Accessories", type: "product", price: 350, stock: 10, minStock: 3, unit: "pcs" },
];

type InvItem = typeof INIT_PRODUCTS[0];
type InvTab = "products" | "services" | "rentals";

const INV_TAB_LABELS: Record<InvTab, string> = { products: "Products & Equipment", services: "Services", rentals: "Equipment Rentals" };

function stockBadge(item: InvItem) {
  if (item.type === "service") return <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-medium">∞ Available</span>;
  if (item.stock === 0) return <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-medium">Out of Stock</span>;
  if (item.stock < item.minStock) return <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium">Low Stock ({item.stock})</span>;
  return <span className="text-xs bg-sky-50 text-sky-600 border border-sky-200 px-2 py-0.5 rounded-full font-medium">In Stock ({item.stock})</span>;
}

const EMPTY_INV: Partial<InvItem> & { type: string } = { sku: "", name: "", cat: "Equipment", type: "product", price: 0, stock: 0, minStock: 0, unit: "pcs" };

export function VenueInventory() {
  const [tab, setTab] = useState<InvTab>("products");
  const [items, setItems] = useState(INIT_PRODUCTS);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<InvItem | null>(null);
  const [form, setForm] = useState<typeof EMPTY_INV>({ ...EMPTY_INV });
  const [toast, setToast] = useState("");

  const typeMap: Record<InvTab, string> = { products: "product", services: "service", rentals: "rental" };
  const filtered = items.filter(i => i.type === typeMap[tab] && (search === "" || i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase())));

  const totalValue = items.filter(i => i.type === "product" && i.stock > 0).reduce((s, i) => s + i.price * i.stock, 0);
  const lowStockCount = items.filter(i => i.type === "product" && i.stock > 0 && i.stock < i.minStock).length;
  const outOfStockCount = items.filter(i => i.type === "product" && i.stock === 0).length;

  const openAdd = () => {
    const defaultType = typeMap[tab];
    setEditItem(null);
    setForm({ ...EMPTY_INV, type: defaultType, cat: defaultType === "service" ? "Training" : defaultType === "rental" ? "Rental" : "Equipment" });
    setShowModal(true);
  };
  const openEdit = (item: InvItem) => { setEditItem(item); setForm({ ...item }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const saveItem = () => {
    if (!form.name || !form.sku) return;
    const parsed = { ...form, price: Number(form.price), stock: Number(form.stock), minStock: Number(form.minStock) } as InvItem;
    if (editItem) {
      setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, ...parsed } : i));
    } else {
      setItems(prev => [...prev, { ...parsed, id: Date.now() }]);
    }
    setToast(editItem ? "Item updated" : "Item added");
    closeModal();
    setTimeout(() => setToast(""), 2500);
  };
  const deleteItem = (id: number) => { setItems(prev => prev.filter(i => i.id !== id)); setToast("Item deleted"); setTimeout(() => setToast(""), 2500); };

  const exportCSV = () => {
    const csv = ["SKU,Name,Category,Type,Price,Stock,Min Stock,Unit", ...filtered.map(i => `${i.sku},${i.name},${i.cat},${i.type},${i.price},${i.stock},${i.minStock},${i.unit}`)].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = `inventory-${tab}.csv`; a.click();
  };

  const inp = "w-full border border-[#C9CBC2] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]";

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#181A1F] text-white px-4 py-3 rounded-lg shadow-xl text-sm">
          <CheckCircle size={16} className="text-[#755900]" />{toast}
        </div>
      )}

      <PageHeader title="Inventory" subtitle="Manage products, services and rental equipment"
        action={
          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="flex items-center gap-1.5 text-sm border border-[#C9CBC2] rounded-md px-3 py-1.5 hover:bg-[#F7F7F3] text-[#464A45]">
              <Download size={14} /> Export CSV
            </button>
            <button onClick={openAdd} className="flex items-center gap-2 bg-[#FFC400] text-[#17140A] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#D9A900]">
              <Plus size={15} /> Add Item
            </button>
          </div>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Items" value={String(items.length)} icon={Package} />
        <StatCard label="Low Stock" value={String(lowStockCount)} icon={AlertCircle} color="#C08B3E" />
        <StatCard label="Out of Stock" value={String(outOfStockCount)} icon={X} color="#B84A4A" />
        <StatCard label="Inventory Value" value={`₹${totalValue.toLocaleString()}`} icon={DollarSign} color="#3F718B" />
      </div>

      {/* Tab switcher */}
      <div className="flex border-b border-[#C9CBC2]">
        {(Object.entries(INV_TAB_LABELS) as [InvTab, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === key ? "border-[#D6A500] text-[#755900]" : "border-transparent text-[#5F635C] hover:text-[#30342F]"}`}>
            {key === "products" ? <Package size={14} /> : key === "services" ? <Wrench size={14} /> : <ShoppingBag size={14} />}
            {label}
            <span className="text-xs bg-[#DFE0D8] text-[#5F635C] px-1.5 py-0.5 rounded-full">{items.filter(i => i.type === typeMap[key]).length}</span>
          </button>
        ))}
      </div>

      {/* Search + table */}
      <div className="bg-white rounded-xl border border-[#DFE0D8] shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[#DFE0D8]">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8178]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${tab}...`}
              className="w-full pl-9 pr-3 py-1.5 border border-[#C9CBC2] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
          </div>
          <span className="text-sm text-[#7D8178] ml-auto">{filtered.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="bg-[#FFC400]/10 text-left">
                {["SKU", "Name", "Category", "Price", tab !== "services" ? "Stock" : "Availability", "Unit", "Status", "Actions"].map(h => (
                  <TableHead key={h} className="px-5 py-3 text-xs font-semibold text-[#755900] uppercase tracking-wide">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#F7F7F3]">
              {filtered.map(item => (
                <TableRow key={item.id} className="hover:bg-[#F7F7F3]/50 transition-colors">
                  <TableCell className="px-5 py-3.5 font-mono text-xs text-[#7D8178]">{item.sku}</TableCell>
                  <TableCell className="px-5 py-3.5 font-medium text-[#181A1F]">{item.name}</TableCell>
                  <TableCell className="px-5 py-3.5"><span className="text-xs bg-[#DFE0D8] text-[#464A45] px-2 py-0.5 rounded-full">{item.cat}</span></TableCell>
                  <TableCell className="px-5 py-3.5 font-semibold text-[#181A1F]">₹{item.price}</TableCell>
                  <TableCell className="px-5 py-3.5 text-[#464A45]">{item.type === "service" ? "∞" : item.stock}</TableCell>
                  <TableCell className="px-5 py-3.5 text-[#5F635C] text-xs">{item.unit}</TableCell>
                  <TableCell className="px-5 py-3.5">{stockBadge(item)}</TableCell>
                  <TableCell className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-[#7D8178] hover:text-[#755900] hover:bg-[#FFC400]/10 rounded-lg transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => deleteItem(item.id)} className="p-1.5 text-[#7D8178] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#7D8178]">
              <Package size={32} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm font-medium">No {tab} found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#DFE0D8]">
              <h2 className="font-semibold text-[#181A1F]">{editItem ? "Edit Item" : "Add New Item"}</h2>
              <button onClick={closeModal} className="p-1 hover:bg-[#DFE0D8] rounded-full"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#464A45] mb-1.5">SKU</label>
                  <input className={inp} value={form.sku || ""} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="EQ-001" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#464A45] mb-1.5">Type</label>
                  <select className={inp} value={form.type || "product"} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {["product", "service", "rental"].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#464A45] mb-1.5">Name</label>
                <input className={inp} value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Item name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#464A45] mb-1.5">Category</label>
                  <select className={inp} value={form.cat || "Equipment"} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}>
                    {["Equipment", "Beverages", "Accessories", "Rental", "Court", "Training"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#464A45] mb-1.5">Unit</label>
                  <input className={inp} value={form.unit || ""} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="pcs / session / day" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#464A45] mb-1.5">Price (₹)</label>
                  <input type="number" min="0" className={inp} value={form.price || ""} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
                </div>
                {form.type !== "service" && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-[#464A45] mb-1.5">Stock Qty</label>
                      <input type="number" min="0" className={inp} value={form.stock || ""} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#464A45] mb-1.5">Min Stock</label>
                      <input type="number" min="0" className={inp} value={form.minStock || ""} onChange={e => setForm(f => ({ ...f, minStock: Number(e.target.value) }))} />
                    </div>
                  </>
                )}
              </div>
              <button onClick={saveItem} className="w-full bg-[#FFC400] text-[#17140A] py-2.5 rounded-lg font-semibold text-sm hover:bg-[#D9A900] transition-colors mt-1">
                {editItem ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
