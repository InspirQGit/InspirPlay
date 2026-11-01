import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/SmartTable";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Search, MapPin, Star, CheckCircle, XCircle, Eye, Calendar, Clock, Users,
  Trophy, Award, Activity, Dumbbell, GraduationCap, CreditCard, ArrowRight,
  Building2, Plus, X, FileText, Upload, Camera, BarChart2, Zap, ArrowLeft,
  Download, Share2, Heart, Filter, LayoutGrid, LayoutList, ChevronDown, ChevronUp, ChevronsUpDown, Trash2, Edit2,
  Bookmark, Shield
} from "lucide-react";
import type { Page } from "../data";
import { SPORTS, VENUES, BOOKINGS, TOURNAMENTS, TRAINERS, OPEN_GAMES, SCORECARD_DATA, BADGES, LEADERBOARD } from "../data";
import { Badge, StatCard, VenueCard, BookingModal, PaymentGatewayModal, DataTable, PageHeader } from "../components";
import type { ColDef } from "../components";

export function PlayerHome({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-[#FFC400] to-[#D9A900] rounded-md p-6 text-[#17140A]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#3B310F] text-sm mb-1">Good morning,</p>
            <h2 className="text-2xl font-bold">Arjun Mehta 👋</h2>
            <p className="text-[#3B310F] text-sm mt-1">You have 2 upcoming bookings this week</p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-white/20 rounded-md p-4 text-center">
              <div className="text-2xl font-bold">1,240</div>
              <div className="text-xs text-[#3B310F] mt-0.5">InspirQ Coins</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Book Venue", icon: Building2, page: "player-venues" as Page, color: "#FFC400" },
          { label: "Join Game", icon: Users, page: "player-games" as Page, color: "#3F718B" },
          { label: "Tournaments", icon: Trophy, page: "player-tournaments" as Page, color: "#C08B3E" },
          { label: "Find Coach", icon: GraduationCap, page: "player-training" as Page, color: "#B84A4A" },
        ].map(a => (
          <button key={a.label} onClick={() => onNavigate(a.page)}
            className="bg-white border border-[#C9CBC2] rounded-md p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all group">
            <div style={{ background: a.color + "18" }} className="w-10 h-10 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <a.icon size={20} style={{ color: a.color }} />
            </div>
            <span className="text-sm font-medium text-[#30342F]">{a.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Bookings" value="18" sub="↑ 3 this month" icon={Calendar} />
        <StatCard label="Games Played" value="52" sub="Your best: Badminton" icon={Activity} color="#3F718B" />
        <StatCard label="Tournaments" value="3" sub="1 upcoming" icon={Trophy} color="#C08B3E" />
        <StatCard label="Training Hours" value="24" sub="With Coach Arjun" icon={Dumbbell} color="#B84A4A" />
      </div>

      <div className="bg-white rounded-md border border-[#C9CBC2] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#DFE0D8] flex items-center justify-between">
          <h3 className="font-bold text-[#181A1F]">Upcoming Bookings</h3>
          <button onClick={() => onNavigate("player-bookings")} className="text-[#755900] text-sm font-medium hover:underline">View all</button>
        </div>
        <div className="divide-y divide-[#F7F7F3]">
          {BOOKINGS.filter(b => b.status === "confirmed").map(b => (
            <div key={b.id} className="px-6 py-4 flex items-center gap-4">
              <div className="bg-[#FFC400]/10 w-10 h-10 rounded-md flex items-center justify-center text-[#755900] text-lg shrink-0">
                {SPORTS.find(s => s.label === b.sport)?.icon || "🏟️"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#181A1F] text-sm truncate">{b.venue}</div>
                <div className="text-xs text-[#5F635C]">{b.date} · {b.time} · {b.duration}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-semibold text-[#181A1F] text-sm">₹{b.amount}</div>
                <Badge text="Confirmed" color="success" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Shared design-system constants ───────────────────────────────────────────
const SPORT_COLORS: Record<string, string> = {
  Badminton: "#FFC400",
  Football: "#3F718B",
  Tennis: "#C08B3E",
  Basketball: "#B84A4A",
  Cricket: "#765A88",
  Squash: "#06B6D4",
};
const SPORT_EMOJI: Record<string, string> = {
  All: "🏅",
  Badminton: "🏸",
  Football: "⚽",
  Tennis: "🎾",
  Basketball: "🏀",
  Cricket: "🏏",
  Squash: "🏸",
};

function SportPill({ sport, active, onClick }: { sport: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
        active
          ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]"
          : "bg-white text-[#464A45] border-[#C9CBC2] hover:border-[#D6A500] hover:text-[#755900]"
      }`}
    >
      <span>{SPORT_EMOJI[sport] || "🏅"}</span>
      {sport}
    </button>
  );
}
// ──────────────────────────────────────────────────────────────────────────────

export function PlayerVenues({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const EXTRA_VENUES = [
    {
      id: 101,
      name: "Squash Galaxy",
      sport: "Squash",
      location: "Koramangala, Bangalore",
      price: 1200,
      rating: 4.3,
      reviews: 41,
      image: "/inspirq-media/football.png",
      amenities: ["Changing Room", "Towels"],
      verified: true,
      available: true,
    },
    {
      id: 102,
      name: "HoopZone Arena",
      sport: "Basketball",
      location: "Whitefield, Bangalore",
      price: 1800,
      rating: 4.7,
      reviews: 88,
      image: "/inspirq-media/football.png",
      amenities: ["Cafe", "Parking", "AC"],
      verified: true,
      available: false,
    },
  ];
  const allVenues = [...VENUES, ...EXTRA_VENUES.map(venue => ({
    ...venue,
    slots: [],
    owner: "InspirQ partner",
    description: `${venue.name} sports venue.`,
    listingStatus: "active" as const,
    published: true,
    featured: false,
  }))];

  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [bookingVenue, setBookingVenue] = useState<typeof VENUES[0] | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [favVenues, setFavVenues] = useState<number[]>([]);
  const [showFavsOnly, setShowFavsOnly] = useState(false);

  const toggleFav = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavVenues(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const sportList = ["All", "Badminton", "Football", "Tennis", "Basketball", "Cricket", "Squash"];

  const filtered = allVenues.filter(v => {
    const matchSport = sport === "All" || v.sport === sport;
    const matchSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase());
    const matchFav = !showFavsOnly || favVenues.includes(v.id);
    return matchSport && matchSearch && matchFav;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    return 0;
  });

  const handleConfirm = () => {
    setBookingVenue(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="bg-white min-h-full">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#DFE0D8]">
        <div className="px-6 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-[#181A1F]">
              Find Venues
            </h1>
            <p className="text-sm text-[#7D8178]">
              {filtered.length} venues {sport !== "All" ? `for ${sport}` : "available"}
              {showFavsOnly ? " · Favourites" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8178]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search venue or area..."
                className="pl-9 pr-3 py-2 bg-[#F7F7F3] border border-[#C9CBC2] rounded-lg text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#D6A500] focus:bg-white transition-colors"
              />
            </div>
            <div className="flex border border-[#C9CBC2] rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-2.5 py-1.5 ${viewMode === "grid" ? "bg-[#FFC400] text-[#17140A]" : "text-[#7D8178] hover:bg-[#F7F7F3]"}`}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-2.5 py-1.5 ${viewMode === "list" ? "bg-[#FFC400] text-[#17140A]" : "text-[#7D8178] hover:bg-[#F7F7F3]"}`}
              >
                <LayoutList size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter strip */}
        <div className="px-6 pb-3 flex items-center gap-2 overflow-x-auto">
          {sportList.map(s => (
            <SportPill key={s} sport={s} active={sport === s} onClick={() => setSport(s)} />
          ))}
          <div className="h-5 w-px bg-[#C9CBC2] shrink-0" />
          <button
            onClick={() => setShowFavsOnly(v => !v)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              showFavsOnly
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-[#464A45] border-[#C9CBC2] hover:border-red-400 hover:text-red-500"
            }`}
          >
            <Heart size={11} className={showFavsOnly ? "fill-white" : ""} />
            Favourites
            {favVenues.length > 0 && (
              <span className="bg-white/30 rounded-full px-1 text-xs font-bold">
                {favVenues.length}
              </span>
            )}
          </button>
          <div className="h-5 w-px bg-[#C9CBC2] shrink-0" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="shrink-0 border border-[#C9CBC2] rounded-lg px-3 py-1.5 text-xs text-[#464A45] bg-white focus:outline-none focus:ring-2 focus:ring-[#D6A500]"
          >
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-5">
        {/* Mobile search */}
        <div className="sm:hidden mb-4 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8178]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search venue or area..."
            className="w-full pl-9 pr-3 py-2 bg-[#F7F7F3] border border-[#C9CBC2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500] focus:bg-white"
          />
        </div>

        {viewMode === "grid" && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(v => {
              const sportColor = SPORT_COLORS[v.sport] || "#FFC400";
              return (
                <div
                  key={v.id}
                  className="group bg-white border border-[#C9CBC2] rounded-2xl hover:shadow-md hover:border-[#A5A89E] transition-all duration-200 overflow-hidden cursor-pointer"
                >
                  {/* Image area */}
                  <div className="h-44 relative overflow-hidden rounded-t-2xl">
                    <img
                      src={v.image}
                      alt={v.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          "/inspirq-media/football.png";
                      }}
                    />
                    {/* Price badge top-left */}
                    <div className="absolute top-3 left-3 bg-white rounded-lg px-2.5 py-1 shadow-sm">
                      <span className="text-sm font-black text-[#181A1F]">&#8377;{v.price}</span>
                      <span className="text-xs text-[#7D8178]"> /hr</span>
                    </div>
                    {/* Fav button top-right */}
                    <button
                      onClick={e => toggleFav(v.id, e)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Heart
                        size={14}
                        className={favVenues.includes(v.id) ? "fill-red-500 text-red-500" : "text-[#7D8178]"}
                      />
                    </button>
                    {/* Availability pill bottom-left */}
                    <div className="absolute bottom-3 left-3">
                      {v.available ? (
                        <span className="bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          Open
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          Closed
                        </span>
                      )}
                    </div>
                    {/* Rating badge bottom-right */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 rounded-md px-2 py-0.5">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-bold">{v.rating}</span>
                    </div>
                  </div>
                  {/* Card body */}
                  <div className="p-4">
                    <h3 className="font-bold text-[#181A1F] text-sm truncate">{v.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-[#5F635C] mt-0.5">
                      <MapPin size={10} />
                      <span className="truncate">{v.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: sportColor + "18", color: sportColor }}
                      >
                        {v.sport}
                      </span>
                      <span className="text-xs text-[#7D8178]">{v.reviews} reviews</span>
                    </div>
                    {v.amenities && v.amenities.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {(v.amenities as string[]).slice(0, 2).map((a: string) => (
                          <span key={a} className="text-xs text-[#5F635C] bg-[#DFE0D8] px-2 py-0.5 rounded-full">
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-end mt-3">
                      <button
                        onClick={() => setBookingVenue(v)}
                        className="bg-[#FFC400] text-[#17140A] text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#D9A900] transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === "list" && (
          <div className="space-y-3">
            {filtered.map(v => {
              const sportColor = SPORT_COLORS[v.sport] || "#FFC400";
              return (
                <div
                  key={v.id}
                  className="group bg-white border border-[#C9CBC2] rounded-2xl hover:shadow-md hover:border-[#A5A89E] transition-all duration-200 flex items-center overflow-hidden"
                >
                  <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-l-2xl">
                    <img
                      src={v.image}
                      alt={v.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          "/inspirq-media/football.png";
                      }}
                    />
                  </div>
                  <div className="flex-1 px-4 py-3 min-w-0">
                    <h3 className="font-bold text-[#181A1F] text-sm truncate">{v.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-[#5F635C] mt-0.5">
                      <MapPin size={10} />
                      <span className="truncate">{v.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: sportColor + "18", color: sportColor }}
                      >
                        {v.sport}
                      </span>
                      <span className="flex items-center gap-0.5 text-xs text-[#7D8178]">
                        <Star size={9} className="text-yellow-400 fill-yellow-400" />
                        {v.rating} ({v.reviews})
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2 px-4 py-3 border-l border-[#DFE0D8]">
                    <div className="font-black text-[#181A1F] text-sm">
                      &#8377;{v.price}
                      <span className="text-xs font-normal text-[#7D8178]">/hr</span>
                    </div>
                    <button
                      onClick={e => toggleFav(v.id, e)}
                      className="p-1"
                    >
                      <Heart
                        size={13}
                        className={favVenues.includes(v.id) ? "fill-red-500 text-red-500" : "text-[#A5A89E]"}
                      />
                    </button>
                    <button
                      onClick={() => setBookingVenue(v)}
                      className="bg-[#FFC400] text-[#17140A] text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#D9A900] transition-colors whitespace-nowrap"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <MapPin size={48} className="text-[#C9CBC2] mb-3" />
            <p className="text-[#5F635C] font-semibold">No venues found</p>
            <p className="text-sm text-[#7D8178] mt-1">Try a different sport or clear filters</p>
            <button
              onClick={() => { setSport("All"); setSearch(""); setShowFavsOnly(false); }}
              className="mt-5 text-sm text-[#755900] font-semibold border border-[#D6A500]/30 px-5 py-2 rounded-full hover:bg-[#FFC400]/5 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {bookingVenue && (
        <BookingModal venue={bookingVenue} onClose={() => setBookingVenue(null)} onConfirm={handleConfirm} />
      )}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-[#181A1F] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50">
          <CheckCircle size={18} className="text-[#755900]" />
          <span className="font-medium text-sm">Booking confirmed!</span>
        </div>
      )}
    </div>
  );
}

function SortTh({ label, k, sortKey, sortDir, onSort }: {
  label: string; k: string; sortKey: string | null; sortDir: "asc" | "desc"; onSort: (key: string) => void;
}) {
  return (
    <TableHead onClick={() => onSort(k)} className="text-left px-4 py-3 text-xs font-semibold text-[#755900] uppercase tracking-wide whitespace-nowrap cursor-pointer hover:text-[#0B4F9C] select-none">
      <span className="flex items-center gap-1">{label}
        {sortKey === k
          ? (sortDir === "asc" ? <ChevronUp size={11} className="text-[#755900]" /> : <ChevronDown size={11} className="text-[#755900]" />)
          : <ChevronsUpDown size={11} className="text-[#A5A89E]" />}
      </span>
    </TableHead>
  );
}

const PAGE_SIZE = 8;

const MY_TOURNAMENT_BOOKINGS = [
  { id: "TR001", name: "Weekend Warriors Badminton Cup", sport: "Badminton", date: "Jul 19, 2026", venue: "Court Masters Indoor Arena", fee: 500, status: "confirmed", registeredOn: "Jul 5, 2026", prize: "₹15,000" },
  { id: "TR002", name: "Summer Smash Tennis Open", sport: "Tennis", date: "Aug 2, 2026", venue: "Ace Tennis Academy", fee: 800, status: "completed", registeredOn: "Jun 20, 2026", prize: "₹25,000" },
  { id: "TR003", name: "Premier Football League S3", sport: "Football", date: "Jul 26, 2026", venue: "Green Valley Sports Complex", fee: 2000, status: "cancelled", registeredOn: "Jul 1, 2026", prize: "₹50,000" },
];

const MY_COACH_BOOKINGS = [
  { id: "CS001", coach: "Coach Arjun Mehta", sport: "Badminton", date: "Jul 10, 2026", time: "07:00 AM", duration: "1 hr", fee: 1200, status: "completed", cert: "BWF Level 2" },
  { id: "CS002", coach: "Coach Sneha Iyer", sport: "Tennis", date: "Jul 17, 2026", time: "06:30 AM", duration: "1 hr", fee: 1500, status: "confirmed", cert: "AITA Certified" },
  { id: "CS003", coach: "Coach Ravi Shankar", sport: "Football", date: "Jul 24, 2026", time: "06:00 AM", duration: "1 hr", fee: 1000, status: "confirmed", cert: "AFC D License" },
];

export function PlayerBookings() {
  const [category, setCategory] = useState<"arenas"|"tournaments"|"coaches">("arenas");
  const [statusTab, setStatusTab] = useState<"all"|"upcoming"|"completed"|"cancelled">("all");
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<typeof BOOKINGS[0] | null>(null);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const sportOptions = ["All", ...Array.from(new Set(BOOKINGS.map(b => b.sport)))];

  const filtered = BOOKINGS.filter(b => {
    const matchStatus = statusTab === "all" ? true : statusTab === "upcoming" ? b.status === "confirmed" : b.status === statusTab;
    const matchSearch = search === "" || b.venue.toLowerCase().includes(search.toLowerCase()) || b.sport.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
    const matchSport = sportFilter === "All" || b.sport === sportFilter;
    const matchDate = dateFilter === "all" ? true : dateFilter === "this_week" ? b.date.includes("Jul 1") || b.date.includes("Jul 2") : b.date.includes("Jul");
    const matchAmount = amountFilter === "all" ? true : amountFilter === "under500" ? b.amount < 500 : amountFilter === "500to1000" ? b.amount >= 500 && b.amount <= 1000 : b.amount > 1000;
    return matchStatus && matchSearch && matchSport && matchDate && matchAmount;
  }).sort((a, b) => {
    if (!sortKey) return 0;
    const av = (a as any)[sortKey] ?? "";
    const bv = (b as any)[sortKey] ?? "";
    return sortDir === "asc" ? String(av).localeCompare(String(bv), undefined, { numeric: true }) : String(bv).localeCompare(String(av), undefined, { numeric: true });
  });

  const toggleSelect = (id: string) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const allPageSelected = (rows: any[]) => rows.length > 0 && rows.every((b: any) => selected.has(b.id));
  const toggleSelectAll = (rows: any[]) => {
    if (allPageSelected(rows)) setSelected(prev => { const s = new Set(prev); rows.forEach((b: any) => s.delete(b.id)); return s; });
    else setSelected(prev => { const s = new Set(prev); rows.forEach((b: any) => s.add(b.id)); return s; });
  };

  const exportCSV = () => {
    const rows = filtered.filter(b => selected.size === 0 || selected.has(b.id));
    const header = ["Booking ID","Sport","Arena","Date","Time","Duration","Players","Amount","Status"];
    const csv = [header, ...rows.map(b => [b.id, b.sport, b.venue, b.date, b.time, b.duration, b.players, b.amount, b.status])].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "InspirQ_Bookings.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const activeFilters = (sportFilter !== "All" ? 1 : 0) + (dateFilter !== "all" ? 1 : 0) + (amountFilter !== "all" ? 1 : 0);
  const clearFilters = () => { setSportFilter("All"); setDateFilter("all"); setAmountFilter("all"); setPage(1); };

  const statusMeta = (s: string) => {
    if (s === "confirmed") return { label: "Upcoming",  cls: "text-blue-700 bg-blue-50 border-blue-200" };
    if (s === "completed") return { label: "Completed", cls: "text-sky-700 bg-sky-50 border-sky-200" };
    if (s === "cancelled") return { label: "Cancelled", cls: "text-red-600 bg-red-50 border-red-200" };
    return { label: s, cls: "text-amber-700 bg-amber-50 border-amber-200" };
  };

  const downloadInvoice = (b: typeof BOOKINGS[0]) => {
    const lines = ["INSPIRQ SPORTS BOOKING INVOICE","================================",`Booking ID   : ${b.id}`,`Date         : ${b.date} at ${b.time}`,`Venue        : ${b.venue}`,`Sport        : ${b.sport}`,`Duration     : ${b.duration}`,`Players      : ${b.players}`,"--------------------------------",`Subtotal     : ₹${Math.round(b.amount * 0.847)}`,`GST (18%)    : ₹${Math.round(b.amount * 0.153)}`,`TOTAL        : ₹${b.amount}`,"================================",`Status       : ${b.status.toUpperCase()}`,"","Thank you for booking with InspirQ!"].join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `InspirQ_Invoice_${b.id}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const showFrom = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const showTo = Math.min(safePage * PAGE_SIZE, filtered.length);
  const totalSpent = BOOKINGS.reduce((s, b) => s + b.amount, 0) + MY_TOURNAMENT_BOOKINGS.reduce((s, t) => s + t.fee, 0) + MY_COACH_BOOKINGS.reduce((s, c) => s + c.fee, 0);

  const categoryCounts = { arenas: BOOKINGS.length, tournaments: MY_TOURNAMENT_BOOKINGS.length, coaches: MY_COACH_BOOKINGS.length };

  const statusCounts = (() => {
    const src = category === "arenas" ? BOOKINGS : category === "tournaments" ? MY_TOURNAMENT_BOOKINGS : MY_COACH_BOOKINGS;
    return {
      all: src.length,
      upcoming: src.filter((x: any) => x.status === "confirmed").length,
      completed: src.filter((x: any) => x.status === "completed").length,
      cancelled: src.filter((x: any) => x.status === "cancelled").length,
    };
  })();

  const filteredTournaments = MY_TOURNAMENT_BOOKINGS.filter(t => {
    const matchStatus = statusTab === "all" ? true : statusTab === "upcoming" ? t.status === "confirmed" : t.status === statusTab;
    return matchStatus && (search === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()));
  });

  const filteredCoaches = MY_COACH_BOOKINGS.filter(c => {
    const matchStatus = statusTab === "all" ? true : statusTab === "upcoming" ? c.status === "confirmed" : c.status === statusTab;
    return matchStatus && (search === "" || c.coach.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()));
  });

  const chkProps = (id?: string, allRows?: any[]) => {
    const rows = allRows ?? paginatedRows;
    return {
      type: "checkbox" as const,
      checked: id ? selected.has(id) : allPageSelected(rows),
      onChange: id ? () => toggleSelect(id) : () => toggleSelectAll(rows),
      style: { accentColor: "#FFC400" },
      className: "w-3.5 h-3.5 rounded border border-[#CFD6E1] bg-white cursor-pointer",
    };
  };

  return (
    <div className="min-h-full bg-[#F7F7F3]">

      {/* ══ Row 1: header bar ═══════════════════════════════════════ */}
      <div className="bg-[#F7F7F3] pt-4 pb-3 border-b border-[#EAF3FF]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-[#151713]">My Bookings</h1>
              <p className="text-xs text-[#7D8178] mt-0.5">
                Total spent: <span className="font-semibold text-[#755900]">₹{totalSpent.toLocaleString()}</span>
                {activeFilters > 0 && <> · <button onClick={clearFilters} className="text-[#B44949] font-semibold hover:underline">Clear {activeFilters} filter{activeFilters > 1 ? "s" : ""}</button></>}
              </p>
            </div>

            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7D8178]" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder={`Search ${category}…`}
                className="pl-8 pr-3 py-2 bg-white border border-[#DFE0D8] rounded-lg text-xs w-44 focus:outline-none focus:ring-2 focus:ring-[#D6A500]/20 focus:border-[#D6A500] text-[#151713] placeholder:text-[#A5A89E] transition-all shadow-sm" />
            </div>

            {category === "arenas" && (
              <>
                <div className="relative">
                  <select value={sportFilter} onChange={e => { setSportFilter(e.target.value); setPage(1); }}
                    className="pl-3 pr-7 py-2 bg-white border border-[#DFE0D8] rounded-lg text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-[#D6A500]/20 text-[#222520] cursor-pointer shadow-sm">
                    {sportOptions.map(s => <option key={s} value={s}>{s === "All" ? "All Sports" : s}</option>)}
                  </select>
                  <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7D8178] pointer-events-none" />
                </div>
                <div className="relative">
                  <select value={amountFilter} onChange={e => { setAmountFilter(e.target.value); setPage(1); }}
                    className="pl-3 pr-7 py-2 bg-white border border-[#DFE0D8] rounded-lg text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-[#D6A500]/20 text-[#222520] cursor-pointer shadow-sm">
                    <option value="all">All Amounts</option>
                    <option value="under500">Under ₹500</option>
                    <option value="500to1000">₹500 – ₹1,000</option>
                    <option value="above1000">Above ₹1,000</option>
                  </select>
                  <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7D8178] pointer-events-none" />
                </div>
              </>
            )}

            <div className="relative">
              <select value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1); }}
                className="pl-3 pr-7 py-2 bg-white border border-[#DFE0D8] rounded-lg text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-[#D6A500]/20 text-[#222520] cursor-pointer shadow-sm">
                <option value="all">All Dates</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
              </select>
              <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7D8178] pointer-events-none" />
            </div>

            {selected.size > 0 && (
              <span className="text-xs text-[#755900] font-semibold bg-[#FFF9D6] border border-[#D6A500]/20 px-2.5 py-1.5 rounded-lg shadow-sm">{selected.size} selected</span>
            )}
            <button onClick={exportCSV}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#222520] bg-white border border-[#DFE0D8] px-3 py-2 rounded-lg hover:bg-[#F7F7F3] transition-colors shadow-sm whitespace-nowrap">
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* ══ Row 2: Category tabs + status sub-filter ════════════════ */}
      <div className="bg-[#F7F7F3] border-b border-[#EAF3FF]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="flex items-center gap-0">
            {([
              { key: "arenas" as const,      label: "Arenas",      icon: "🏟️" },
              { key: "tournaments" as const,  label: "Tournaments", icon: "🏆" },
              { key: "coaches" as const,      label: "Coaches",     icon: "🎯" },
            ]).map(({ key, label, icon }) => (
              <button key={key} onClick={() => { setCategory(key); setStatusTab("all"); setSearch(""); setPage(1); setSelected(new Set()); }}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${category === key ? "border-[#D6A500] text-[#755900]" : "border-transparent text-[#5F635C] hover:text-[#222520] hover:border-[#CFD6E1]"}`}>
                <span>{icon}</span>{label}
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${category === key ? "bg-[#FFC400] text-[#17140A]" : "bg-[#EFEFE9] text-[#7D8178]"}`}>
                  {categoryCounts[key]}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 py-2.5">
            {(["all","upcoming","completed","cancelled"] as const).map(t => (
              <button key={t} onClick={() => { setStatusTab(t); setPage(1); setSelected(new Set()); }}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${statusTab === t ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "bg-white text-[#5F635C] border-[#DFE0D8] hover:border-[#D6A500]/30 hover:text-[#755900]"}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)} ({statusCounts[t]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ Row 3: DataTable ════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-5">
        <div className="bg-white rounded-xl border border-[#DFE0D8] overflow-hidden shadow-sm">

          {/* ── Arenas table ── */}
          {category === "arenas" && (
            <div className="overflow-x-auto">
              <Table className="w-full text-sm">
                <TableHeader>
                  <TableRow className="bg-[#FFF9D6] border-b border-[#FFF0A3]">
                    <TableHead className="px-4 py-3 w-10"><input {...chkProps()} /></TableHead>
                    <TableHead className="text-left px-3 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">ID</TableHead>
                    <SortTh label="Sport" k="sport" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortTh label="Arena" k="venue" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortTh label="Date & Time" k="date" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">Duration</TableHead>
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">Players</TableHead>
                    <SortTh label="Amount" k="amount" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortTh label="Status" k="status" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={10} className="py-14 text-center">
                      <Calendar size={32} className="mx-auto mb-3 text-[#A5A89E]" />
                      <p className="text-sm font-medium text-[#5F635C]">No arena bookings found</p>
                    </TableCell></TableRow>
                  ) : paginatedRows.map((b, idx) => {
                    const sm = statusMeta(b.status);
                    const isSel = selected.has(b.id);
                    return (
                      <TableRow key={b.id} className={`border-b border-[#EFEFE9] hover:bg-[#F3F5F8] transition-colors ${isSel ? "bg-[#FFF9D6]" : idx % 2 === 0 ? "bg-white" : "bg-[#FBF9F5]"}`}>
                        <TableCell className="px-4 py-3"><input {...chkProps(b.id)} /></TableCell>
                        <TableCell className="px-3 py-3 font-mono text-xs text-[#755900] font-bold">{b.id}</TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{SPORTS.find(s => s.label === b.sport)?.icon || "🏟️"}</span>
                            <span className="text-[#222520] font-medium text-xs">{b.sport}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[#151713] font-medium text-xs max-w-[150px] truncate">{b.venue}</TableCell>
                        <TableCell className="px-4 py-3 text-[#5F635C] text-xs whitespace-nowrap">{b.date}<br /><span className="text-[#7D8178]">{b.time}</span></TableCell>
                        <TableCell className="px-4 py-3 text-[#5F635C] text-xs">{b.duration}</TableCell>
                        <TableCell className="px-4 py-3 text-[#5F635C] text-xs">{b.players}</TableCell>
                        <TableCell className="px-4 py-3 font-bold text-[#151713] text-sm">₹{b.amount.toLocaleString()}</TableCell>
                        <TableCell className="px-4 py-3"><span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${sm.cls}`}>{sm.label}</span></TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setSelectedBooking(b)} className="flex items-center gap-1 text-xs font-semibold text-[#5F635C] border border-[#DFE0D8] px-2 py-1 rounded hover:bg-[#F7F7F3]"><Eye size={10} /> View</button>
                            <button onClick={() => downloadInvoice(b)} className="flex items-center gap-1 text-xs font-semibold text-[#755900] border border-[#D6A500]/30 px-2 py-1 rounded hover:bg-[#FFC400]/5"><Download size={10} /> Invoice</button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* ── Tournaments table ── */}
          {category === "tournaments" && (
            <div className="overflow-x-auto">
              <Table className="w-full text-sm">
                <TableHeader>
                  <TableRow className="bg-[#FFF9D6] border-b border-[#FFF0A3]">
                    <TableHead className="px-4 py-3 w-10"><input {...chkProps(undefined, filteredTournaments)} /></TableHead>
                    <TableHead className="text-left px-3 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">ID</TableHead>
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider">Tournament</TableHead>
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">Sport</TableHead>
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">Date</TableHead>
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider">Venue</TableHead>
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider">Prize Pool</TableHead>
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">Fee Paid</TableHead>
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">Registered</TableHead>
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTournaments.length === 0 ? (
                    <TableRow><TableCell colSpan={10} className="py-14 text-center">
                      <Trophy size={32} className="mx-auto mb-3 text-[#A5A89E]" />
                      <p className="text-sm font-medium text-[#5F635C]">No tournament registrations</p>
                    </TableCell></TableRow>
                  ) : filteredTournaments.map((t, idx) => {
                    const sm = statusMeta(t.status);
                    return (
                      <TableRow key={t.id} className={`border-b border-[#EFEFE9] hover:bg-[#F3F5F8] transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[#FBF9F5]"}`}>
                        <TableCell className="px-4 py-3"><input {...chkProps(t.id)} /></TableCell>
                        <TableCell className="px-3 py-3 font-mono text-xs text-[#755900] font-bold">{t.id}</TableCell>
                        <TableCell className="px-4 py-3 text-[#151713] font-semibold text-xs max-w-[180px] truncate">{t.name}</TableCell>
                        <TableCell className="px-4 py-3 text-[#222520] font-medium text-xs">{t.sport}</TableCell>
                        <TableCell className="px-4 py-3 text-[#5F635C] text-xs whitespace-nowrap">{t.date}</TableCell>
                        <TableCell className="px-4 py-3 text-[#5F635C] text-xs max-w-[140px] truncate">{t.venue}</TableCell>
                        <TableCell className="px-4 py-3 text-[#755900] font-bold text-xs">{t.prize}</TableCell>
                        <TableCell className="px-4 py-3 font-bold text-[#151713] text-sm">₹{t.fee.toLocaleString()}</TableCell>
                        <TableCell className="px-4 py-3 text-[#7D8178] text-xs">{t.registeredOn}</TableCell>
                        <TableCell className="px-4 py-3"><span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${sm.cls}`}>{sm.label}</span></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* ── Coaches table ── */}
          {category === "coaches" && (
            <div className="overflow-x-auto">
              <Table className="w-full text-sm">
                <TableHeader>
                  <TableRow className="bg-[#FFF9D6] border-b border-[#FFF0A3]">
                    <TableHead className="px-4 py-3 w-10"><input {...chkProps(undefined, filteredCoaches)} /></TableHead>
                    <TableHead className="text-left px-3 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">ID</TableHead>
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider">Coach</TableHead>
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">Sport</TableHead>
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">Session Date</TableHead>
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">Time</TableHead>
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">Duration</TableHead>
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">Cert</TableHead>
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">Fee Paid</TableHead>
                    <TableHead className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoaches.length === 0 ? (
                    <TableRow><TableCell colSpan={10} className="py-14 text-center">
                      <GraduationCap size={32} className="mx-auto mb-3 text-[#A5A89E]" />
                      <p className="text-sm font-medium text-[#5F635C]">No coaching sessions booked</p>
                    </TableCell></TableRow>
                  ) : filteredCoaches.map((c, idx) => {
                    const sm = statusMeta(c.status);
                    return (
                      <TableRow key={c.id} className={`border-b border-[#EFEFE9] hover:bg-[#F3F5F8] transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[#FBF9F5]"}`}>
                        <TableCell className="px-4 py-3"><input {...chkProps(c.id)} /></TableCell>
                        <TableCell className="px-3 py-3 font-mono text-xs text-[#755900] font-bold">{c.id}</TableCell>
                        <TableCell className="px-4 py-3 text-[#151713] font-semibold text-xs">{c.coach}</TableCell>
                        <TableCell className="px-4 py-3 text-[#222520] font-medium text-xs">{c.sport}</TableCell>
                        <TableCell className="px-4 py-3 text-[#5F635C] text-xs whitespace-nowrap">{c.date}</TableCell>
                        <TableCell className="px-4 py-3 text-[#5F635C] text-xs">{c.time}</TableCell>
                        <TableCell className="px-4 py-3 text-[#5F635C] text-xs">{c.duration}</TableCell>
                        <TableCell className="px-4 py-3"><span className="text-xs font-semibold text-[#755900] bg-[#FFF9D6] border border-[#D6A500]/20 px-2 py-0.5 rounded-full">{c.cert}</span></TableCell>
                        <TableCell className="px-4 py-3 font-bold text-[#151713] text-sm">₹{c.fee.toLocaleString()}</TableCell>
                        <TableCell className="px-4 py-3"><span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${sm.cls}`}>{sm.label}</span></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination — arenas only */}
          {category === "arenas" && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#EFEFE9] bg-white">
              <p className="text-xs text-[#7D8178]">
                Showing <strong className="text-[#151713]">{showFrom}–{showTo}</strong> of <strong className="text-[#151713]">{filtered.length}</strong>
                {selected.size > 0 && <span className="ml-2 text-[#755900] font-semibold">· {selected.size} selected</span>}
              </p>
              <div className="flex items-center gap-1">
                <button disabled={safePage <= 1} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 text-xs font-semibold border border-[#DFE0D8] rounded-md text-[#5F635C] hover:bg-[#F7F7F3] disabled:opacity-40 disabled:cursor-not-allowed">← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => Math.abs(p - safePage) <= 2).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs font-semibold rounded-md border ${p === safePage ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "border-[#DFE0D8] text-[#5F635C] hover:bg-[#F7F7F3]"}`}>{p}</button>
                ))}
                <button disabled={safePage >= totalPages} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 text-xs font-semibold border border-[#DFE0D8] rounded-md text-[#5F635C] hover:bg-[#F7F7F3] disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Detail Slide-out */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setSelectedBooking(null)} />
          <div className="w-full max-w-md bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="bg-white border-b border-[#DFE0D8] px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{SPORTS.find(s => s.label === selectedBooking.sport)?.icon || "🏟️"}</span>
                  <div>
                    <h2 className="text-base font-bold text-[#151713]">{selectedBooking.venue}</h2>
                    <p className="text-xs text-[#5F635C] mt-0.5">{selectedBooking.sport} · {selectedBooking.date} at {selectedBooking.time}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="p-1.5 hover:bg-[#F7F7F3] rounded-md"><X size={16} className="text-[#5F635C]" /></button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${statusMeta(selectedBooking.status).cls}`}>{statusMeta(selectedBooking.status).label}</span>
                <span className="font-mono text-xs text-[#7D8178]">{selectedBooking.id}</span>
              </div>
            </div>
            <div className="flex-1 px-6 py-5 space-y-4 bg-[#F7F7F3]">
              <div className="grid grid-cols-2 gap-3">
                {[["Date", selectedBooking.date],["Time", selectedBooking.time],["Duration", selectedBooking.duration],["Players", String(selectedBooking.players)],["Sport", selectedBooking.sport],["Booking ID", selectedBooking.id]].map(([label, value]) => (
                  <div key={label} className="bg-white rounded-md border border-[#DFE0D8] p-3">
                    <p className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-sm font-semibold text-[#151713]">{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-md border border-[#DFE0D8] p-4 space-y-2">
                <p className="text-xs font-bold text-[#5F635C] uppercase tracking-wider mb-3">Payment Summary</p>
                <div className="flex justify-between text-sm text-[#5F635C]"><span>Arena fee</span><span>₹{Math.round(selectedBooking.amount * 0.847).toLocaleString()}</span></div>
                <div className="flex justify-between text-sm text-[#5F635C]"><span>GST (18%)</span><span>₹{Math.round(selectedBooking.amount * 0.153).toLocaleString()}</span></div>
                <div className="border-t border-[#EFEFE9] mt-2 pt-2 flex justify-between font-bold text-[#151713]"><span>Total Paid</span><span className="text-[#755900]">₹{selectedBooking.amount.toLocaleString()}</span></div>
              </div>
              <div className="space-y-2.5">
                <button onClick={() => downloadInvoice(selectedBooking)} className="w-full flex items-center justify-center gap-2 py-3 bg-[#FFC400] text-[#17140A] rounded-md text-sm font-bold hover:bg-[#D9A900]"><Download size={15} /> Download Invoice</button>
                {selectedBooking.status === "confirmed" && <button className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-red-200 text-red-600 rounded-md text-sm font-semibold hover:bg-red-50"><XCircle size={15} /> Cancel Booking</button>}
                {selectedBooking.status === "completed" && <button className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-[#DFE0D8] text-[#222520] rounded-md text-sm font-semibold hover:bg-[#F7F7F3]"><Star size={15} /> Rate This Arena</button>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PlayerProfile() {
  const [kyc, setKyc] = useState<"pending"|"verified"|"not_started">("not_started");
  const [activeTab, setActiveTab] = useState<"profile"|"sports"|"emergency"|"kyc">("profile");
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const inp = (label: string, defaultValue: string, type = "text") => (
    <div key={label}>
      <label className="block text-xs font-semibold text-[#5F635C] mb-1.5 uppercase tracking-wide">{label}</label>
      <input type={type} defaultValue={defaultValue}
        className="w-full border border-[#C9CBC2] rounded-lg px-3 py-2.5 text-sm text-[#181A1F] focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500]" />
    </div>
  );
  const TABS = [
    { id: "profile" as const, label: "Personal" },
    { id: "sports" as const, label: "Sports & Skills" },
    { id: "emergency" as const, label: "Emergency" },
    { id: "kyc" as const, label: "KYC" },
  ];
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6 space-y-5">
      <div className="bg-white rounded-2xl border border-[#C9CBC2] p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <div className="w-20 h-20 bg-[#FFC400]/10 rounded-xl flex items-center justify-center text-[#755900] text-3xl font-bold">A</div>
            <button aria-label="Change photo" className="absolute -bottom-1 -right-1 bg-[#FFC400] p-1.5 rounded-full"><Camera size={12} className="text-[#17140A]" /></button>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#181A1F]">Arjun Mehta</h2>
            <div className="text-[#5F635C] text-sm">arjun.mehta@gmail.com</div>
            <div className="flex gap-2 mt-1">
              <Badge text="Premium" color="yellow" />
              {kyc === "verified" && <Badge text="KYC Verified" color="success" />}
            </div>
          </div>
        </div>
        <div className="flex gap-1 bg-[#DFE0D8] rounded-lg p-1 w-fit mb-6 flex-wrap">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === t.id ? "bg-white text-[#181A1F] shadow-sm" : "text-[#5F635C] hover:text-[#30342F]"}`}>
              {t.label}
            </button>
          ))}
        </div>
        {activeTab === "profile" && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {inp("Full Name","Arjun Mehta")}
              {inp("Username / Handle","arjun_bwf")}
              {inp("Email Address","arjun.mehta@gmail.com","email")}
              {inp("Phone Number","+91 98765 43210","tel")}
              {inp("Date of Birth","1995-03-15","date")}
              {inp("Gender","Male")}
              {inp("Blood Group","B+")}
              {inp("Nationality","Indian")}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#181A1F] mb-3">Address</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {inp("Street Address","12, 3rd Cross, Indiranagar")}
                {inp("City","Bangalore")}
                {inp("State","Karnataka")}
                {inp("Pincode","560038")}
              </div>
            </div>
          </div>
        )}
        {activeTab === "sports" && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {inp("Primary Sport","Badminton")}
              {inp("Secondary Sports","Football, Cricket")}
              {inp("Skill Level — Badminton","Intermediate (3+ years)")}
              {inp("Skill Level — Football","Beginner (casual)")}
              {inp("Playing Position (Football)","Midfielder")}
              {inp("Jersey Number","7")}
              {inp("Dominant Hand","Right")}
              {inp("Years Playing","5")}
            </div>
          </div>
        )}
        {activeTab === "emergency" && (
          <div className="space-y-5">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              Emergency contacts are only used in case of a medical emergency at a venue.
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {inp("Full Name","Sushma Mehta")}
              {inp("Relationship","Mother")}
              {inp("Phone Number","+91 98765 99999","tel")}
              {inp("Email (Optional)","sushma@gmail.com","email")}
            </div>
          </div>
        )}
        {activeTab === "kyc" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#181A1F]">KYC Verification</h3>
                <p className="text-sm text-[#5F635C] mt-0.5">Complete KYC to unlock your Verified Badge.</p>
              </div>
              <Badge text={kyc === "verified" ? "Verified" : kyc === "pending" ? "Under Review" : "Not Started"}
                color={kyc === "verified" ? "success" : kyc === "pending" ? "yellow" : "gray"} />
            </div>
            <div className="space-y-3">
              {[
                { label: "Aadhaar Card", desc: "Front and back photo" },
                { label: "PAN Card", desc: "Clear photo of PAN" },
                { label: "Address Proof", desc: "Utility bill or bank statement" },
                { label: "Selfie with ID", desc: "Hold Aadhaar and take a selfie" },
              ].map(doc => (
                <div key={doc.label} className="flex items-center justify-between p-4 border border-[#C9CBC2] rounded-xl hover:bg-[#F7F7F3]">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-[#7D8178]" />
                    <div>
                      <div className="text-sm font-medium text-[#30342F]">{doc.label}</div>
                      <div className="text-xs text-[#7D8178]">{doc.desc}</div>
                    </div>
                  </div>
                  <button aria-label="Upload" className="flex items-center gap-2 bg-[#F7F7F3] border border-[#C9CBC2] text-sm text-[#464A45] px-3 py-1.5 rounded-lg hover:bg-[#DFE0D8]"><Upload size={14} /> Upload
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => setKyc("pending")} className="bg-[#FFC400] text-[#17140A] px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#D9A900] w-full">
              Submit for Verification
            </button>
          </div>
        )}
        {activeTab !== "kyc" && (
          <div className="flex items-center justify-between pt-5 mt-5 border-t border-[#DFE0D8]">
            {saved && <span className="flex items-center gap-1.5 text-sm text-sky-600 font-medium"><CheckCircle size={15} /> Saved successfully</span>}
            <button onClick={save} className="ml-auto flex items-center gap-2 bg-[#FFC400] text-[#17140A] text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#D9A900]">
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function PlayerWallet() {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState(500);
  const [showPayment, setShowPayment] = useState(false);
  const [balance, setBalance] = useState(2450);
  const [txns] = useState([
    { id: 1, desc: "Booking - Court Masters Arena", type: "debit", amount: 800, date: "Jul 8, 2026" },
    { id: 2, desc: "Referral Bonus - Priya T.", type: "credit", amount: 200, date: "Jul 5, 2026" },
    { id: 3, desc: "Tournament Registration", type: "debit", amount: 500, date: "Jul 3, 2026" },
    { id: 4, desc: "Booking - Green Valley FC", type: "debit", amount: 2200, date: "Jun 28, 2026" },
    { id: 5, desc: "InspirQ Coins Redeemed", type: "credit", amount: 150, date: "Jun 20, 2026" },
  ]);
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6 space-y-5">
      {showPayment && (
        <PaymentGatewayModal
          amount={addAmount}
          description="Add money to InspirQ Wallet"
          onClose={() => setShowPayment(false)}
          onSuccess={() => { setBalance(b => b + addAmount); setShowPayment(false); setShowAddMoney(false); }}
        />
      )}
      {showAddMoney && !showPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#181A1F]">Add Money</h3>
              <button onClick={() => setShowAddMoney(false)}><X size={18} className="text-[#7D8178]" /></button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[200,500,1000,2000,5000,10000].map(amt => (
                <button key={amt} onClick={() => setAddAmount(amt)}
                  className={`py-2.5 text-sm font-semibold rounded-lg border transition-all ${addAmount === amt ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "border-[#C9CBC2] text-[#30342F] hover:border-[#D6A500]"}`}>
                  ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>
            <div>
              <label className="text-xs font-medium text-[#464A45] mb-1.5 block">Or enter custom amount</label>
              <input type="number" value={addAmount} onChange={e => setAddAmount(Number(e.target.value))} min={1}
                className="w-full border border-[#C9CBC2] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
            </div>
            <button onClick={() => setShowPayment(true)} className="w-full bg-[#FFC400] text-[#17140A] py-3 rounded-lg font-semibold hover:bg-[#D9A900]">
              Proceed to Pay ₹{addAmount.toLocaleString()}
            </button>
          </div>
        </div>
      )}
      <div className="bg-gradient-to-r from-[#111827] to-[#304A5D] rounded-2xl p-6 text-white">
        <div className="text-sm text-white/60 mb-1">Available Balance</div>
        <div className="text-4xl font-bold mb-3">₹{balance.toLocaleString()}.00</div>
        <div className="flex gap-3">
          <button onClick={() => setShowAddMoney(true)} className="bg-[#FFC400] text-[#17140A] text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#D9A900]">Add Money</button>
          <button className="bg-white/10 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-white/20">Withdraw</button>
        </div>
      </div>
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪙</span>
            <div>
              <div className="text-xs text-amber-700 font-semibold uppercase tracking-wide">InspirQ Coins</div>
              <div className="text-3xl font-bold text-amber-600">1,240</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#5F635C]">Coin Value</div>
            <div className="text-lg font-bold text-[#181A1F]">₹124.00</div>
            <div className="text-xs text-[#7D8178]">1 coin = ₹0.10</div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button className="flex-1 bg-amber-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-amber-600">Redeem Coins</button>
          <button className="flex-1 bg-white border border-amber-200 text-amber-700 py-2 rounded-lg text-sm font-semibold hover:bg-amber-50">Earn More</button>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-[#C9CBC2] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#DFE0D8] font-bold text-[#181A1F]">Transaction History</div>
        <div className="divide-y divide-[#F7F7F3]">
          {txns.map(t => (
            <div key={t.id} className="px-5 py-3.5 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${t.type === "credit" ? "bg-sky-50" : "bg-red-50"}`}>
                <ArrowRight size={16} className={t.type === "credit" ? "text-sky-500 -rotate-90" : "text-red-400 rotate-90"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#181A1F] truncate">{t.desc}</div>
                <div className="text-xs text-[#7D8178]">{t.date}</div>
              </div>
              <div className={`font-bold text-sm ${t.type === "credit" ? "text-sky-600" : "text-[#181A1F]"}`}>
                {t.type === "credit" ? "+" : "-"}₹{t.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PlayerTournaments() {
  const EXTRA_TOURNAMENTS = [
    {
      id: 5,
      name: "InspirQ Squash Masters",
      sport: "Squash",
      date: "2026-08-16",
      venue: "Koramangala Squash Club",
      prize: "20,000",
      slots: 16,
      filled: 4,
      fee: 600,
      status: "open",
      organizer: "InspirQ Events",
      image: "/inspirq-media/badminton.png",
    },
    {
      id: 6,
      name: "3x3 Basketball Street Cup",
      sport: "Basketball",
      date: "2026-08-23",
      venue: "BasketBall Zone",
      prize: "30,000",
      slots: 16,
      filled: 16,
      fee: 1500,
      status: "full",
      organizer: "Bangalore Ballers",
      image: "/inspirq-media/football.png",
    },
  ];

  const allTournaments = [
    ...TOURNAMENTS.map(t => ({
      ...t,
      prize: t.prize.replace(/[^0-9,]/g, ""),
      image: "/inspirq-media/football.png",
    })),
    ...EXTRA_TOURNAMENTS,
  ];

  const [tab, setTab] = useState("all");
  const [sport, setSport] = useState("All");
  const [registering, setRegistering] = useState<number | null>(null);
  const [registered, setRegistered] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  const sportList = ["All", "Badminton", "Football", "Tennis", "Cricket", "Basketball", "Squash"];

  const filtered = allTournaments.filter(t => {
    const matchSport = sport === "All" || t.sport === sport;
    const matchTab =
      tab === "all" ||
      (tab === "open" && t.status !== "full") ||
      (tab === "full" && t.status === "full");
    const matchSearch = search === "" || t.name.toLowerCase().includes(search.toLowerCase());
    return matchSport && matchTab && matchSearch;
  });

  const handleRegister = (id: number) => {
    setRegistered(p => [...p, id]);
    setRegistering(null);
  };

  const fillPct = (t: { filled: number; slots: number }) =>
    Math.round((t.filled / t.slots) * 100);

  const registeringTournament = allTournaments.find(t => t.id === registering);

  return (
    <div className="bg-white min-h-full">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#DFE0D8]">
        <div className="px-6 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-[#181A1F]">
              Tournaments
            </h1>
            <p className="text-sm text-[#7D8178]">Compete, win prizes, climb the leaderboard</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-[#7D8178]">{filtered.length} events</span>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 border border-sky-100 px-2 py-1 rounded-full">
              {registered.length} Registered
            </span>
          </div>
        </div>

        {/* Filter strip */}
        <div className="px-6 pb-3 flex items-center gap-2 overflow-x-auto flex-wrap">
          {sportList.map(s => (
            <SportPill key={s} sport={s} active={sport === s} onClick={() => setSport(s)} />
          ))}
          <div className="h-5 w-px bg-[#C9CBC2] shrink-0" />
          {/* Status tabs */}
          <div className="flex gap-1 p-1 bg-[#DFE0D8] rounded-lg shrink-0">
            {[["all", "All"], ["open", "Open"], ["full", "Full"]].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setTab(v)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  tab === v ? "bg-white shadow-sm text-[#181A1F]" : "text-[#5F635C]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="h-5 w-px bg-[#C9CBC2] shrink-0" />
          {/* Search */}
          <div className="relative shrink-0">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8178]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tournaments..."
              className="pl-9 pr-3 py-1.5 bg-[#F7F7F3] border border-[#C9CBC2] rounded-lg text-xs w-44 focus:outline-none focus:ring-2 focus:ring-[#D6A500] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Tournament cards — single-column large horizontal */}
      <div className="px-6 py-5 space-y-4">
        {filtered.map(t => {
          const color = SPORT_COLORS[t.sport] || "#FFC400";
          const pct = fillPct(t);
          const isReg = registered.includes(t.id);
          const isFull = t.status === "full";
          const formatLabel =
            t.sport === "Football"
              ? "11v11"
              : t.sport === "Cricket"
              ? "T10"
              : "Singles / Doubles";
          return (
            <div
              key={t.id}
              className="bg-white border border-[#C9CBC2] rounded-2xl hover:shadow-md hover:border-[#A5A89E] transition-all duration-200 flex overflow-hidden"
            >
              {/* Tournament image */}
              <div className="w-28 shrink-0 overflow-hidden">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      "/inspirq-media/football.png";
                  }}
                />
              </div>

              {/* Body */}
              <div className="flex-1 p-4 min-w-0">
                {/* Sport badge */}
                <span
                  className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-1.5"
                  style={{ background: color + "18", color }}
                >
                  {SPORT_EMOJI[t.sport] || "🏅"} {t.sport}
                </span>
                <h3
                  className="font-black text-[#181A1F] text-base leading-tight truncate"
                >
                  {t.name}
                </h3>
                <p className="text-xs text-[#7D8178] mt-0.5">by {t.organizer}</p>

                {/* Info pills */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-[#5F635C] bg-[#DFE0D8] px-2 py-0.5 rounded-md">
                    <Calendar size={9} />
                    {new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#5F635C] bg-[#DFE0D8] px-2 py-0.5 rounded-md">
                    <MapPin size={9} />
                    {t.venue}
                  </span>
                  <span className="text-xs text-[#5F635C] bg-[#DFE0D8] px-2 py-0.5 rounded-md">
                    {formatLabel}
                  </span>
                </div>

                {/* Fill bar */}
                <div className="mt-3">
                  <div className="h-1.5 bg-[#DFE0D8] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: pct >= 90 ? "#B84A4A" : pct >= 70 ? "#C08B3E" : color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-[#5F635C] mt-1">
                    {t.filled} of {t.slots} spots filled
                  </p>
                </div>
              </div>

              {/* Right panel */}
              <div className="shrink-0 flex flex-col items-center justify-center px-5 border-l border-[#DFE0D8] gap-3 min-w-[120px]">
                <div className="text-center">
                  <div className="text-2xl font-black" style={{ color, fontFamily: "'Lexend', sans-serif" }}>
                    {t.prize}
                  </div>
                  <div className="text-xs text-[#7D8178] uppercase tracking-wide">Prize Pool</div>
                </div>
                {isFull ? (
                  <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                    FULL
                  </span>
                ) : (
                  <span className="text-xs font-bold text-sky-600 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full">
                    OPEN
                  </span>
                )}
                {isReg ? (
                  <div className="flex items-center gap-1 text-xs font-bold text-sky-600">
                    <CheckCircle size={13} /> Registered
                  </div>
                ) : (
                  <button
                    onClick={() => setRegistering(t.id)}
                    className="w-full py-2 rounded-xl text-xs font-black text-white transition-colors"
                    style={{ background: isFull ? "#9E9E98" : color }}
                  >
                    {isFull ? "Waitlist" : "Register"}
                  </button>
                )}
                <span className="text-xs text-[#7D8178]">&#8377;{t.fee} entry</span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-20">
            <Trophy size={48} className="text-[#C9CBC2] mb-3" />
            <p className="text-[#5F635C] font-semibold">No tournaments found</p>
            <p className="text-sm text-[#7D8178] mt-1">Try changing sport or status filter</p>
          </div>
        )}
      </div>

      {/* Registration modal */}
      {registering !== null && registeringTournament && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4">
            <div className="text-3xl text-center">
              {SPORT_EMOJI[registeringTournament.sport] || "🏆"}
            </div>
            <h3 className="font-bold text-lg text-center text-[#181A1F]">
              {registeringTournament.name}
            </h3>
            <div className="bg-[#F7F7F3] rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#5F635C]">Entry Fee</span>
                <span className="font-bold text-[#181A1F]">&#8377;{registeringTournament.fee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F635C]">Prize Pool</span>
                <span className="font-bold text-sky-600">&#8377;{registeringTournament.prize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F635C]">Date</span>
                <span className="font-medium">{registeringTournament.date}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setRegistering(null)}
                className="flex-1 border border-[#C9CBC2] rounded-xl py-2.5 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRegister(registering)}
                className="flex-1 bg-[#FFC400] text-[#17140A] rounded-xl py-2.5 text-sm font-semibold"
              >
                Pay &amp; Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PlayerGames() {
  const [joined, setJoined] = useState<number[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newGame, setNewGame] = useState({
    sport: "Badminton",
    venue: "",
    date: "",
    time: "",
    slots: "4",
    level: "All Levels",
    fee: "",
  });
  const [games, setGames] = useState(OPEN_GAMES);
  const [sportFilter, setSportFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("Any");

  const TODAY = "2026-07-13";
  const TOMORROW = "2026-07-14";

  const sportList = ["All", "Badminton", "Football", "Tennis", "Basketball", "Cricket"];

  const filtered = games.filter(g => {
    const matchSport = sportFilter === "All" || g.sport === sportFilter;
    const matchLevel = levelFilter === "All" || g.level === levelFilter;
    const matchDate =
      dateFilter === "Any" ||
      (dateFilter === "Today" && g.date === TODAY) ||
      (dateFilter === "Tomorrow" && g.date === TOMORROW);
    return matchSport && matchLevel && matchDate;
  });

  const createGame = () => {
    setGames(prev => [
      ...prev,
      {
        id: Date.now(),
        ...newGame,
        slots: Number(newGame.slots),
        fee: Number(newGame.fee),
        filled: 1,
        host: "You",
        icon: SPORTS.find(s => s.label === newGame.sport)?.icon || "🏟️",
        listingStatus: "active" as const,
        published: true,
        createdBy: "player",
      },
    ]);
    setShowCreate(false);
    setNewGame({ sport: "Badminton", venue: "", date: "", time: "", slots: "4", level: "All Levels", fee: "" });
  };

  return (
    <div className="bg-white min-h-full">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#DFE0D8]">
        <div className="px-6 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-[#181A1F]">
              Open Games
            </h1>
            <p className="text-sm text-[#7D8178]">Join a pickup game or host your own</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-[#FFC400] text-[#17140A] text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#D9A900] transition-colors flex items-center gap-2 shrink-0"
          >
            <Plus size={14} /> Host Game
          </button>
        </div>

        {/* Filter strip */}
        <div className="px-6 pb-3 flex items-center gap-2 overflow-x-auto flex-wrap">
          {sportList.map(s => (
            <SportPill key={s} sport={s} active={sportFilter === s} onClick={() => setSportFilter(s)} />
          ))}
          <div className="h-5 w-px bg-[#C9CBC2] shrink-0" />
          {/* Level pills */}
          {["All", "Beginner", "Intermediate", "Advanced"].map(l => (
            <button
              key={l}
              onClick={() => setLevelFilter(l)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                levelFilter === l
                  ? "bg-[#222520] text-white border-[#222520]"
                  : "bg-white text-[#5F635C] border-[#C9CBC2] hover:border-[#7D8178]"
              }`}
            >
              {l}
            </button>
          ))}
          <div className="h-5 w-px bg-[#C9CBC2] shrink-0" />
          {/* Date pills */}
          {["Any", "Today", "Tomorrow"].map(d => (
            <button
              key={d}
              onClick={() => setDateFilter(d)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                dateFilter === d
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-white text-[#5F635C] border-[#C9CBC2] hover:border-amber-400"
              }`}
            >
              {d}
            </button>
          ))}
          <span className="text-xs text-[#7D8178] ml-auto shrink-0">{filtered.length} games</span>
        </div>
      </div>

      {/* Game cards grid */}
      <div className="px-6 py-5 grid lg:grid-cols-2 gap-4">
        {filtered.map(g => {
          const sportColor = SPORT_COLORS[g.sport] || "#FFC400";
          const spotsLeft = g.slots - g.filled;
          const isJoined = joined.includes(g.id);
          const isFull = g.filled >= g.slots;
          const levelCls =
            g.level === "Advanced"
              ? "bg-purple-100 text-purple-700 border-purple-200"
              : g.level === "Intermediate"
              ? "bg-blue-100 text-blue-700 border-blue-200"
              : g.level === "Beginner"
              ? "bg-sky-100 text-sky-700 border-sky-200"
              : "bg-[#DFE0D8] text-[#464A45] border-[#C9CBC2]";
          return (
            <div
              key={g.id}
              className="bg-white border border-[#C9CBC2] rounded-2xl hover:shadow-md hover:border-[#A5A89E] transition-all duration-200 overflow-hidden"
            >
              {/* Header strip — lightly tinted */}
              <div
                className="px-4 pt-4 pb-3 rounded-t-2xl"
                style={{ background: sportColor + "12" }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "2.5rem", lineHeight: 1 }}>{g.icon}</span>
                    <div>
                      <div
                        className="font-black text-[#181A1F] text-base leading-tight"
                      >
                        {g.sport}
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${levelCls}`}>
                        {g.level}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#7D8178] mt-1">by {g.host}</span>
                </div>
              </div>

              {/* Body */}
              <div className="px-4 pb-4 space-y-3">
                {/* Info chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="flex items-center gap-1 text-xs text-[#464A45] bg-[#F7F7F3] border border-[#C9CBC2] px-2.5 py-1 rounded-md">
                    <Calendar size={11} style={{ color: sportColor }} />
                    {new Date(g.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#464A45] bg-[#F7F7F3] border border-[#C9CBC2] px-2.5 py-1 rounded-md">
                    <Clock size={11} style={{ color: sportColor }} />
                    {g.time}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#464A45] bg-[#F7F7F3] border border-[#C9CBC2] px-2.5 py-1 rounded-md">
                    <CreditCard size={11} style={{ color: sportColor }} />
                    &#8377;{g.fee}
                  </span>
                </div>

                {/* Venue */}
                <div className="flex items-center gap-1 text-xs text-[#5F635C]">
                  <MapPin size={10} />
                  <span>{g.venue || "Indiranagar"}</span>
                </div>

                {/* Seat grid */}
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {Array.from({ length: g.slots }).map((_, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                        style={{
                          borderColor: i < g.filled ? sportColor : "#E4DED5",
                          background: i < g.filled ? sportColor : "transparent",
                        }}
                      >
                        {i < g.filled && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[#5F635C] mt-1.5">{spotsLeft} spots left</p>
                </div>

                {/* CTA */}
                {isJoined ? (
                  <div className="w-full py-2.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center gap-2 text-sm font-bold text-sky-600">
                    <CheckCircle size={15} /> You&apos;re in!
                  </div>
                ) : (
                  <button
                    onClick={() => setJoined(p => [...p, g.id])}
                    disabled={isFull}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: isFull ? "#9E9E98" : sportColor }}
                  >
                    {isFull ? "Game Full" : `Join for ₹${g.fee}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-20">
          <Users size={48} className="text-[#C9CBC2] mb-3" />
          <p className="text-[#5F635C] font-semibold">No games match your filters</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 bg-[#FFC400] text-[#17140A] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#D9A900]"
          >
            Host the First Game
          </button>
        </div>
      )}

      {/* Create game modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#181A1F] text-lg">Host a Game</h3>
              <button onClick={() => setShowCreate(false)}>
                <X size={18} className="text-[#7D8178]" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Sport</label>
                <select
                  value={newGame.sport}
                  onChange={e => setNewGame(p => ({ ...p, sport: e.target.value }))}
                  className="w-full border border-[#C9CBC2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]"
                >
                  {SPORTS.map(s => (
                    <option key={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Skill Level</label>
                <select
                  value={newGame.level}
                  onChange={e => setNewGame(p => ({ ...p, level: e.target.value }))}
                  className="w-full border border-[#C9CBC2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]"
                >
                  {["All Levels", "Beginner", "Intermediate", "Advanced"].map(l => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
            {[
              { label: "Venue / Location", key: "venue", type: "text", placeholder: "Court Masters Arena, Indiranagar" },
              { label: "Date", key: "date", type: "date", placeholder: "" },
              { label: "Time", key: "time", type: "time", placeholder: "" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">{f.label}</label>
                <input
                  type={f.type}
                  value={(newGame as Record<string, string>)[f.key]}
                  onChange={e => setNewGame(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full border border-[#C9CBC2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]"
                />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Max Players</label>
                <input
                  type="number"
                  value={newGame.slots}
                  onChange={e => setNewGame(p => ({ ...p, slots: e.target.value }))}
                  className="w-full border border-[#C9CBC2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Fee per player (&#8377;)</label>
                <input
                  type="number"
                  value={newGame.fee}
                  onChange={e => setNewGame(p => ({ ...p, fee: e.target.value }))}
                  className="w-full border border-[#C9CBC2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 border border-[#C9CBC2] rounded-xl py-2.5 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={createGame}
                className="flex-1 bg-[#FFC400] text-[#17140A] rounded-xl py-2.5 text-sm font-semibold"
              >
                Create Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PlayerTraining() {
  const EXTRA_TRAINERS = [
    {
      id: 4,
      name: "Coach Meera Pillai",
      sport: "Cricket",
      experience: "5 years",
      rating: 4.6,
      students: 28,
      fee: 900,
      location: "Whitefield, Bangalore",
      cert: "BCCI Level 1",
      image:
        "/inspirq-media/coach-avatar.svg",
      verified: true,
    },
    {
      id: 5,
      name: "Coach Dev Anand",
      sport: "Basketball",
      experience: "7 years",
      rating: 4.5,
      students: 35,
      fee: 1100,
      location: "HSR Layout, Bangalore",
      cert: "BAI Certified",
      image:
        "/inspirq-media/coach-avatar.svg",
      verified: false,
    },
    {
      id: 6,
      name: "Coach Lakshmi V.",
      sport: "Badminton",
      experience: "12 years",
      rating: 5.0,
      students: 62,
      fee: 1800,
      location: "Jayanagar, Bangalore",
      cert: "BWF Level 3",
      image:
        "/inspirq-media/coach-avatar.svg",
      verified: true,
    },
  ];
  const allTrainers = [...TRAINERS, ...EXTRA_TRAINERS.map(trainer => ({
    ...trainer,
    bio: `${trainer.name} provides structured ${trainer.sport} coaching.`,
    specializations: [trainer.sport],
    listingStatus: "active" as const,
    published: true,
  }))];

  const [enrolled, setEnrolled] = useState<number[]>([]);
  const [sportFilter, setSportFilter] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [maxFee, setMaxFee] = useState(2000);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof TRAINERS[0] | null>(null);

  const sportList = ["All", "Badminton", "Tennis", "Football", "Cricket", "Basketball"];

  let filtered = allTrainers.filter(
    t =>
      (sportFilter === "All" || t.sport === sportFilter) &&
      t.fee <= maxFee &&
      (!verifiedOnly || t.verified) &&
      (search === "" ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.sport.toLowerCase().includes(search.toLowerCase()))
  );
  filtered = [...filtered].sort((a, b) =>
    sortBy === "rating"
      ? b.rating - a.rating
      : sortBy === "fee_asc"
      ? a.fee - b.fee
      : sortBy === "fee_desc"
      ? b.fee - a.fee
      : b.students - a.students
  );

  return (
    <div className="bg-white min-h-full">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#DFE0D8]">
        <div className="px-6 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-[#181A1F]">
              Find Coaches
            </h1>
            <p className="text-sm text-[#7D8178]">{filtered.length} coaches available</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8178]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or sport..."
                className="pl-9 pr-3 py-2 bg-[#F7F7F3] border border-[#C9CBC2] rounded-lg text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#D6A500] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Filter strip */}
        <div className="px-6 pb-3 flex items-center gap-2 overflow-x-auto flex-wrap">
          {sportList.map(s => (
            <SportPill key={s} sport={s} active={sportFilter === s} onClick={() => setSportFilter(s)} />
          ))}
          <div className="h-5 w-px bg-[#C9CBC2] shrink-0" />
          <button
            onClick={() => setVerifiedOnly(v => !v)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              verifiedOnly
                ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]"
                : "bg-white text-[#464A45] border-[#C9CBC2] hover:border-[#D6A500]"
            }`}
          >
            <CheckCircle size={11} /> Certified Only
          </button>
          <div className="h-5 w-px bg-[#C9CBC2] shrink-0" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="shrink-0 border border-[#C9CBC2] rounded-lg px-3 py-1.5 text-xs text-[#464A45] bg-white focus:outline-none focus:ring-2 focus:ring-[#D6A500]"
          >
            <option value="rating">Top Rated</option>
            <option value="fee_asc">Fee: Low to High</option>
            <option value="fee_desc">Fee: High to Low</option>
            <option value="students">Most Students</option>
          </select>
          <select
            value={maxFee}
            onChange={e => setMaxFee(Number(e.target.value))}
            className="shrink-0 border border-[#C9CBC2] rounded-lg px-3 py-1.5 text-xs text-[#464A45] bg-white focus:outline-none focus:ring-2 focus:ring-[#D6A500]"
          >
            {[500, 1000, 1500, 2000].map(f => (
              <option key={f} value={f}>
                Max &#8377;{f}/session
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden px-6 pt-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8178]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or sport..."
            className="w-full pl-9 pr-3 py-2 bg-[#F7F7F3] border border-[#C9CBC2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500] focus:bg-white"
          />
        </div>
      </div>

      {/* Coach cards grid */}
      <div className="px-6 py-5 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(t => {
          const sportColor = SPORT_COLORS[t.sport] || "#FFC400";
          const isEnrolled = enrolled.includes(t.id);
          return (
            <div
              key={t.id}
              className="bg-white border border-[#C9CBC2] rounded-2xl hover:shadow-md hover:border-[#A5A89E] transition-all duration-200 cursor-pointer overflow-hidden"
              onClick={() => setSelected(t)}
            >
              {/* Photo section */}
              <div className="relative">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-40 object-cover rounded-t-2xl"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      "/inspirq-media/badminton.png";
                  }}
                />
                {/* Sport badge top-right */}
                <span
                  className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: sportColor + "EE", color: "#fff" }}
                >
                  {SPORT_EMOJI[t.sport] || "🏅"} {t.sport}
                </span>
                {/* Certified badge bottom-left */}
                {t.verified && (
                  <span className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-bold text-white bg-sky-500 px-2 py-0.5 rounded-full">
                    <CheckCircle size={9} /> Certified
                  </span>
                )}
              </div>

              {/* Card body */}
              <div className="p-4">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-[#181A1F] text-sm truncate">{t.name}</h3>
                  <span>{SPORT_EMOJI[t.sport] || "🏅"}</span>
                </div>
                <p className="text-xs text-[#7D8178] mt-0.5">
                  {t.cert} &bull; {t.location}
                </p>

                {/* Stars */}
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      size={11}
                      className={
                        i <= Math.floor(t.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-[#C9CBC2] fill-[#C9CBC2]"
                      }
                    />
                  ))}
                  <span className="text-xs font-semibold text-[#464A45] ml-1">{t.rating}</span>
                  <span className="text-xs text-[#7D8178] ml-1">{t.students} students</span>
                </div>

                {/* Experience */}
                <div className="mt-2">
                  <span className="text-xs bg-[#DFE0D8] text-[#464A45] px-2 py-0.5 rounded-full">
                    {t.experience}
                  </span>
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className="font-black text-[#181A1F] text-sm">&#8377;{t.fee}</span>
                    <span className="text-xs text-[#7D8178]">/session</span>
                  </div>
                  {isEnrolled ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-sky-600 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-xl">
                      <CheckCircle size={11} /> Booked
                    </span>
                  ) : (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setEnrolled(p => [...p, t.id]);
                      }}
                      className="bg-[#FFC400] text-[#17140A] text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-[#D9A900] transition-colors"
                    >
                      Book Free Trial
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-20">
          <GraduationCap size={48} className="text-[#C9CBC2] mb-3" />
          <p className="text-[#5F635C] font-semibold">No coaches match your filters</p>
          <p className="text-sm text-[#7D8178] mt-1">Try adjusting sport, fee or certification filter</p>
        </div>
      )}

      {/* Coach detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="relative h-56">
              <img
                src={selected.image}
                alt={selected.name}
                className="w-full h-full object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    "/inspirq-media/badminton.png";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 bg-black/40 p-2 rounded-full text-white hover:bg-black/60"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-4 left-4">
                <h2
                  className="text-xl font-bold text-white"
                >
                  {selected.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i <= Math.floor(selected.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-white/40"
                      }
                    />
                  ))}
                  <span className="text-sm text-white font-semibold">{selected.rating}</span>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Sport", value: selected.sport },
                  { label: "Experience", value: selected.experience },
                  { label: "Certification", value: selected.cert },
                  { label: "Location", value: selected.location },
                  { label: "Students", value: selected.students.toString() },
                  { label: "Session Fee", value: `₹${selected.fee}` },
                ].map(f => (
                  <div key={f.label} className="bg-[#F7F7F3] rounded-xl p-3">
                    <div className="text-xs text-[#7D8178] mb-0.5">{f.label}</div>
                    <div className="text-sm font-semibold text-[#181A1F]">{f.value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-sky-50 rounded-xl p-3 text-sm text-sky-700 border border-sky-100">
                🎁 <strong>Free trial session</strong> — Book a 30-min trial with no commitment.
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 border border-[#C9CBC2] rounded-xl py-3 text-sm font-medium"
                >
                  Back
                </button>
                {enrolled.includes(selected.id) ? (
                  <div className="flex-1 flex items-center justify-center gap-2 bg-sky-50 text-sky-600 rounded-xl text-sm font-semibold">
                    <CheckCircle size={15} /> Trial Booked
                  </div>
                ) : (
                  <button
                    onClick={() => { setEnrolled(p => [...p, selected.id]); setSelected(null); }}
                    className="flex-1 bg-[#FFC400] text-[#17140A] rounded-xl py-3 text-sm font-semibold hover:bg-[#D9A900]"
                  >
                    Book Free Trial
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PlayerScorecard() {
  const [showAdd, setShowAdd] = useState(false);
  const [scores, setScores] = useState(SCORECARD_DATA);
  const [form, setForm] = useState({ match: "", opponent: "", venue: "", date: "", myScore: "", result: "W" });

  const wins = scores.filter(s => s.result === "W").length;
  const winRate = Math.round((wins / scores.length) * 100);

  const addScore = () => {
    setScores(prev => [...prev, { id: Date.now(), ...form, partner: "—", duration: "—" }]);
    setShowAdd(false);
    setForm({ match: "", opponent: "", venue: "", date: "", myScore: "", result: "W" });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">
      <div className="bg-gradient-to-r from-[#FFC400] to-[#D9A900] rounded-md p-5 text-[#17140A]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-sm text-[#3B310F] mb-1">Season Performance</div>
            <div className="text-3xl font-bold">{winRate}% Win Rate</div>
            <div className="text-[#3B310F] text-sm mt-0.5">{wins}W – {scores.length - wins}L · {scores.length} matches played</div>
          </div>
          <div className="flex gap-4">
            {[["Matches", scores.length], ["Wins", wins], ["Sports", 3]].map(([l, v]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-bold">{v}</div>
                <div className="text-xs text-[#3B310F]">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-1.5 flex items-center gap-2">
          <Award size={14} className="text-amber-500" />
          <span className="text-xs font-semibold text-amber-700">Premium Feature</span>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-[#FFC400] text-[#17140A] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#D9A900] flex items-center gap-2">
          <Plus size={15} /> Add Match
        </button>
      </div>

      <div className="bg-white rounded-md border border-[#C9CBC2] overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[600px]">
            <TableHeader className="bg-[#FFC400]/10">
              <TableRow>
                {["Match", "Opponent", "Venue", "Date", "Score", "Result", "Duration"].map(h => (
                  <TableHead key={h} className="text-left text-xs font-semibold text-[#755900] px-4 py-3">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#F7F7F3]">
              {scores.map(s => (
                <TableRow key={s.id} className="hover:bg-[#F7F7F3]/50">
                  <TableCell className="px-4 py-3 text-sm font-medium text-[#181A1F]">{s.match}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-[#464A45]">{s.opponent}</TableCell>
                  <TableCell className="px-4 py-3 text-xs text-[#5F635C]">{s.venue}</TableCell>
                  <TableCell className="px-4 py-3 text-xs text-[#5F635C]">{s.date}</TableCell>
                  <TableCell className="px-4 py-3 text-sm font-mono text-[#30342F]">{s.myScore}</TableCell>
                  <TableCell className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${s.result === "W" ? "bg-sky-100 text-sky-600" : "bg-red-100 text-red-500"}`}>
                      {s.result}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-[#5F635C]">{s.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-6 w-full max-w-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#181A1F]">Add Match Result</h3>
              <button onClick={() => setShowAdd(false)}><X size={18} className="text-[#7D8178]" /></button>
            </div>
            {[
              { label: "Match Type", key: "match", placeholder: "e.g. Singles Badminton" },
              { label: "Opponent", key: "opponent", placeholder: "e.g. Arjun D." },
              { label: "Venue", key: "venue", placeholder: "e.g. Court Masters" },
              { label: "Score", key: "myScore", placeholder: "e.g. 21-18, 21-15" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">{f.label}</label>
                <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Date</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Result</label>
                <div className="flex gap-2">
                  {["W", "L"].map(r => (
                    <button key={r} onClick={() => setForm(p => ({ ...p, result: r }))}
                      className={`flex-1 py-2 rounded-md border text-sm font-bold transition-all ${form.result === r ? (r === "W" ? "bg-sky-500 text-white border-sky-500" : "bg-red-500 text-white border-red-500") : "border-[#C9CBC2] text-[#464A45]"}`}>
                      {r === "W" ? "Win" : "Loss"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowAdd(false)} className="flex-1 border border-[#C9CBC2] rounded-md py-2.5 text-sm">Cancel</button>
              <button onClick={addScore} className="flex-1 bg-[#FFC400] text-[#17140A] rounded-md py-2.5 text-sm font-semibold">Save Match</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PlayerAchievements() {
  const [activeTab, setActiveTab] = useState("badges");
  const rarityColors: Record<string, string> = {
    common: "border-[#C9CBC2] bg-[#F7F7F3]",
    uncommon: "border-sky-200 bg-sky-50",
    rare: "border-blue-200 bg-blue-50",
    epic: "border-purple-200 bg-purple-50",
    legendary: "border-yellow-300 bg-yellow-50",
  };
  const rarityTextColors: Record<string, string> = {
    common: "text-[#7D8178]", uncommon: "text-sky-500", rare: "text-blue-500",
    epic: "text-purple-500", legendary: "text-yellow-500",
  };
  const earned = BADGES.filter(b => b.earned).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">
      <div className="bg-gradient-to-br from-[#111827] to-[#304A5D] rounded-md p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="text-white/60 text-sm mb-1">Your InspirQ Level</div>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-4xl">⚡</div>
              <div>
                <div className="text-2xl font-bold">Level 12 · Bronze</div>
                <div className="text-white/60 text-sm">2,280 XP to Level 13</div>
              </div>
            </div>
            <div className="bg-white/20 rounded-full h-2 w-48">
              <div className="bg-[#FFC400] h-2 rounded-full" style={{ width: "62%" }} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { val: "1,240", lbl: "Coins", icon: "🪙" },
              { val: earned + "/" + BADGES.length, lbl: "Badges", icon: "🏅" },
              { val: "#4", lbl: "Rank (City)", icon: "📍" },
            ].map(s => (
              <div key={s.lbl} className="bg-white/10 rounded-md p-3 text-center">
                <div className="text-xl mb-0.5">{s.icon}</div>
                <div className="font-bold">{s.val}</div>
                <div className="text-xs text-white/60">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-[#DFE0D8] pb-4">
        {["badges", "leaderboard", "streaks"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${activeTab === t ? "bg-[#FFC400]/10 text-[#755900]" : "text-[#5F635C] hover:bg-[#F7F7F3]"}`}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === "badges" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {BADGES.map(b => (
            <div key={b.id} className={`rounded-md border-2 p-4 text-center transition-all ${b.earned ? rarityColors[b.rarity] : "border-[#DFE0D8] bg-[#F7F7F3] opacity-50"}`}>
              <div className={`text-4xl mb-2 ${!b.earned ? "grayscale" : ""}`}>{b.icon}</div>
              <div className="text-sm font-bold text-[#181A1F] mb-0.5">{b.name}</div>
              <div className={`text-xs font-semibold uppercase tracking-wide mb-1.5 ${rarityTextColors[b.rarity]}`}>{b.rarity}</div>
              <div className="text-xs text-[#5F635C] leading-snug">{b.desc}</div>
              {b.earned && b.earnedDate && (
                <div className="text-xs text-[#755900] font-medium mt-2">Earned {b.earnedDate}</div>
              )}
              {!b.earned && <div className="text-xs text-[#7D8178] mt-2">🔒 Not earned yet</div>}
            </div>
          ))}
        </div>
      )}

      {activeTab === "leaderboard" && (
        <div className="space-y-3">
          {LEADERBOARD.map(p => (
            <div key={p.rank} className={`rounded-md border p-4 flex items-center gap-4 ${(p as any).isMe ? "border-[#D6A500] bg-[#FFC400]/5" : "border-[#DFE0D8] bg-white"}`}>
              <div className="w-8 text-center font-bold text-[#30342F]">
                {p.badge !== "—" ? <span className="text-2xl">{p.badge}</span> : <span className="text-lg text-[#7D8178]">#{p.rank}</span>}
              </div>
              <div className="flex-1">
                <div className={`font-semibold ${(p as any).isMe ? "text-[#755900]" : "text-[#181A1F]"}`}>{p.name} {(p as any).isMe && "(You)"}</div>
                <div className="text-xs text-[#7D8178]">{p.city} · {p.sport}</div>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-[#181A1F]">
                <span className="text-lg">🪙</span> {p.coins.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "streaks" && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Current Streak", value: "4 days 🔥", sub: "Keep it up!", color: "#C08B3E" },
              { label: "Longest Streak", value: "14 days", sub: "Set in March 2026", color: "#FFC400" },
              { label: "This Week", value: "3/7 days", sub: "Play 4 more!", color: "#3F718B" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-md border border-[#C9CBC2] p-5 text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: s.color, fontFamily: "'Lexend', sans-serif" }}>{s.value}</div>
                <div className="text-sm text-[#464A45] font-medium">{s.label}</div>
                <div className="text-xs text-[#7D8178] mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-md border border-[#C9CBC2] p-5">
            <h3 className="font-bold text-[#181A1F] mb-4">Activity Calendar — July 2026</h3>
            <div className="grid grid-cols-7 gap-1.5">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} className="text-center text-xs font-medium text-[#7D8178] pb-1">{d}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                const active = [1, 2, 3, 5, 7, 8, 9, 10, 12].includes(day);
                const today = day === 10;
                return (
                  <div key={day} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${today ? "ring-2 ring-[#D6A500] ring-offset-1" : ""} ${active ? "bg-[#FFC400] text-[#17140A]" : day <= 10 ? "bg-[#DFE0D8] text-[#7D8178]" : "bg-[#F7F7F3] text-[#C9CBC2]"}`}>
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PlayerSearch({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState("All");
  const [city, setCity] = useState("Bangalore");
  const [priceRange, setPriceRange] = useState("Any");
  const [sortBy, setSortBy] = useState("relevance");
  const [bookingVenue, setBookingVenue] = useState<typeof VENUES[0] | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const filtered = VENUES.filter(v => {
    const matchSport = sport === "All" || v.sport === sport;
    const matchQuery = !query || v.name.toLowerCase().includes(query.toLowerCase()) || v.location.toLowerCase().includes(query.toLowerCase());
    const matchPrice = priceRange === "Any" ||
      (priceRange === "Under ₹1000" && v.price < 1000) ||
      (priceRange === "₹1000–₹2500" && v.price >= 1000 && v.price <= 2500) ||
      (priceRange === "Above ₹2500" && v.price > 2500);
    return matchSport && matchQuery && matchPrice;
  }).sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">
      {/* Search bar */}
      <div className="bg-white rounded-md border border-[#C9CBC2] p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8178]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search venues, areas, sports..."
            className="w-full pl-9 pr-4 py-2.5 border border-[#C9CBC2] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]"
          />
        </div>
        <select value={sport} onChange={e => setSport(e.target.value)}
          className="border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#D6A500]">
          <option>All</option>
          {SPORTS.map(s => <option key={s.id}>{s.label}</option>)}
        </select>
        <select value={city} onChange={e => setCity(e.target.value)}
          className="border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#D6A500]">
          {["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai"].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-[#5F635C] font-medium">{filtered.length} venues found</span>
        <div className="flex gap-2 ml-auto flex-wrap">
          <select value={priceRange} onChange={e => setPriceRange(e.target.value)}
            className="border border-[#C9CBC2] rounded-md px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#D6A500] text-[#464A45]">
            {["Any", "Under ₹1000", "₹1000–₹2500", "Above ₹2500"].map(p => <option key={p}>{p}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="border border-[#C9CBC2] rounded-md px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#D6A500] text-[#464A45]">
            <option value="relevance">Relevance</option>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Sport quick filters */}
      <div className="flex gap-2 flex-wrap">
        {SPORTS.slice(0, 8).map(s => (
          <button key={s.id} onClick={() => setSport(sport === s.label ? "All" : s.label)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${sport === s.label ? "border-[#D6A500] bg-[#FFC400]/10 text-[#755900]" : "border-[#C9CBC2] bg-white text-[#464A45] hover:border-[#A5A89E]"}`}>
            <span>{s.icon}</span> {s.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#7D8178]">
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-medium text-[#464A45]">No venues found</p>
          <p className="text-sm mt-1">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(v => (
            <VenueCard key={v.id} v={v} onBook={setBookingVenue} />
          ))}
        </div>
      )}

      {bookingVenue && (
        <BookingModal
          venue={bookingVenue}
          onClose={() => setBookingVenue(null)}
          onConfirm={() => { setBookingVenue(null); setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3000); }}
        />
      )}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-[#FFC400] text-[#17140A] px-6 py-3 rounded-md shadow-lg flex items-center gap-3 z-50">
          <CheckCircle size={20} /><span className="font-medium text-sm">Booking confirmed!</span>
        </div>
      )}
    </div>
  );
}

// ─── Player My Hosted Games ───────────────────────────────────────────────────

const HOSTED_GAMES = [
  { id: 1, sport: "Badminton Doubles", venue: "Court Masters Arena", date: "2026-07-15", time: "07:00", slots: 4, joined: 4, level: "Intermediate", fee: 200, status: "full", totalCollected: 800, description: "Doubles badminton — bring your partner!" },
  { id: 2, sport: "Football 5v5", venue: "Green Valley Sports Complex", date: "2026-07-16", time: "18:00", slots: 10, joined: 8, level: "All Levels", fee: 300, status: "open", totalCollected: 2400, description: "Casual 5-a-side football. All skill levels welcome." },
  { id: 3, sport: "Basketball 3v3", venue: "BasketBall Zone", date: "2026-07-20", time: "06:00", slots: 6, joined: 3, level: "Beginner", fee: 150, status: "open", totalCollected: 450, description: "Friendly 3v3 basketball. Great for beginners." },
  { id: 4, sport: "Tennis Doubles", venue: "Ace Tennis Academy", date: "2026-07-22", time: "17:00", slots: 4, joined: 2, level: "Advanced", fee: 400, status: "open", totalCollected: 800, description: "Advanced doubles tennis. Bring your A-game!" },
];

const GAME_PLAYERS = [
  { id: 1, name: "Priya Sharma", phone: "+91 98765 22222", joinedDate: "Jul 10, 2026", paid: true, txnId: "PAY8291" },
  { id: 2, name: "Rahul Singh", phone: "+91 98765 33333", joinedDate: "Jul 11, 2026", paid: true, txnId: "PAY8310" },
  { id: 3, name: "Divya Nair", phone: "+91 98765 44444", joinedDate: "Jul 12, 2026", paid: false, txnId: "" },
  { id: 4, name: "Vikram Patel", phone: "+91 98765 55555", joinedDate: "Jul 13, 2026", paid: true, txnId: "PAY8445" },
  { id: 5, name: "Anjali Verma", phone: "+91 98765 66666", joinedDate: "Jul 13, 2026", paid: true, txnId: "PAY8467" },
  { id: 6, name: "Suresh Kumar", phone: "+91 98765 77777", joinedDate: "Jul 14, 2026", paid: false, txnId: "" },
  { id: 7, name: "Kavya Reddy", phone: "+91 98765 88888", joinedDate: "Jul 14, 2026", paid: true, txnId: "PAY8502" },
  { id: 8, name: "Arun Dev", phone: "+91 98765 99999", joinedDate: "Jul 15, 2026", paid: true, txnId: "PAY8521" },
];

export function PlayerMyGames({ onNavigate }: { onNavigate: (p: any, ctx?: any) => void }) {
  const [games, setGames] = useState(HOSTED_GAMES);
  const [detailGameId, setDetailGameId] = useState<number | null>(null);
  const [detailTab, setDetailTab] = useState<"players" | "info" | "payments">("players");
  const [showCreate, setShowCreate] = useState(false);
  const [showQR, setShowQR] = useState<{ gameId: string; sport: string } | null>(null);
  const [search, setSearch] = useState("");
  const [createForm, setCreateForm] = useState({ sport: "Badminton", venue: "", date: "", time: "", slots: "10", level: "All Levels", fee: "0", description: "" });
  const [gameStatusFilter, setGameStatusFilter] = useState("all");
  const [gameSelectedIds, setGameSelectedIds] = useState<Set<number>>(new Set());

  const detailGame = games.find(g => g.id === detailGameId);
  const filtered = games.filter(g => g.sport.toLowerCase().includes(search.toLowerCase()) || g.venue.toLowerCase().includes(search.toLowerCase()));

  const createGame = () => {
    const newGame = { id: Date.now(), sport: createForm.sport, venue: createForm.venue, date: createForm.date, time: createForm.time, slots: Number(createForm.slots) || 10, joined: 0, level: createForm.level, fee: Number(createForm.fee) || 0, status: "open" as const, totalCollected: 0, description: createForm.description };
    setGames(prev => [...prev, newGame]);
    const newGameId = "GH" + Date.now().toString().slice(-6);
    setShowCreate(false);
    setShowQR({ gameId: newGameId, sport: createForm.sport });
  };

  if (detailGame) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-6 py-4 bg-white border-b border-[#DFE0D8] flex items-center justify-between">
          <div className="border-l-4 border-[#D6A500] pl-4">
            <p className="text-xs text-[#7D8178] uppercase tracking-wide mb-0.5">My Games → Detail</p>
            <h1 className="text-xl font-bold text-[#181A1F]">{detailGame.sport}</h1>
            <p className="text-sm text-[#5F635C]">{detailGame.venue} · {detailGame.date} at {detailGame.time}</p>
          </div>
          <button onClick={() => setDetailGameId(null)} className="flex items-center gap-1.5 text-sm text-[#5F635C] border border-[#C9CBC2] rounded-md px-3 py-1.5">← Back</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid sm:grid-cols-4 gap-4">
            {[["Players Joined", `${detailGame.joined}/${detailGame.slots}`], ["Fee per Player", `₹${detailGame.fee}`], ["Total Collected", `₹${detailGame.totalCollected}`], ["Status", detailGame.status.toUpperCase()]].map(([label, value]) => (
              <div key={label as string} className="bg-white border border-[#C9CBC2] rounded-md p-4"><p className="text-xs text-[#5F635C] mb-1">{label}</p><p className="font-bold text-[#181A1F] text-lg">{value}</p></div>
            ))}
          </div>
          <div className="flex gap-1 bg-[#DFE0D8] rounded-md p-1 w-fit">
            {(["players","info","payments"] as const).map(t => <button key={t} onClick={() => setDetailTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${detailTab === t ? "bg-white text-[#181A1F] shadow-sm" : "text-[#5F635C]"}`}>{t}</button>)}
          </div>
          {detailTab === "players" && (
            <div className="bg-white rounded-md border border-[#C9CBC2]">
              <div className="px-4 py-3 border-b border-[#DFE0D8] flex items-center justify-between">
                <span className="text-sm font-semibold text-[#181A1F]">{detailGame.joined} Players</span>
                <button className="text-xs bg-[#FFC400] text-[#17140A] px-3 py-1.5 rounded-md font-semibold">+ Add Player</button>
              </div>
              <div className="overflow-x-auto">
                <Table className="w-full text-sm">
                  <TableHeader><TableRow className="bg-[#FFC400]/10">{["Name","Phone","Joined","Payment","Actions"].map(h => <TableHead key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#755900] uppercase tracking-wide">{h}</TableHead>)}</TableRow></TableHeader>
                  <TableBody className="divide-y divide-[#F7F7F3]">
                    {GAME_PLAYERS.slice(0, detailGame.joined).map(p => (
                      <TableRow key={p.id} className="hover:bg-[#F7F7F3]/50">
                        <TableCell className="px-4 py-3 font-medium text-[#181A1F]">{p.name}</TableCell>
                        <TableCell className="px-4 py-3 font-mono text-xs text-[#5F635C]">{p.phone}</TableCell>
                        <TableCell className="px-4 py-3 text-[#5F635C] text-xs">{p.joinedDate}</TableCell>
                        <TableCell className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${p.paid ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{p.paid ? "Paid" : "Pending"}</span></TableCell>
                        <TableCell className="px-4 py-3 flex gap-1"><button className="text-xs border border-red-200 text-red-500 px-2 py-1 rounded-md hover:bg-red-50">Remove</button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          {detailTab === "info" && (
            <div className="bg-white rounded-md border border-[#C9CBC2] p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {[["Sport", detailGame.sport], ["Venue", detailGame.venue], ["Date", detailGame.date], ["Time", detailGame.time], ["Max Players", String(detailGame.slots)], ["Skill Level", detailGame.level]].map(([label, val]) => (
                  <div key={label as string}><label className="text-xs font-semibold text-[#5F635C] uppercase tracking-wide block mb-1">{label}</label><input defaultValue={val as string} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30" /></div>
                ))}
              </div>
              <div><label className="text-xs font-semibold text-[#5F635C] uppercase tracking-wide block mb-1">Description / Rules</label><textarea defaultValue={detailGame.description} rows={3} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 resize-none" /></div>
              <button className="bg-[#FFC400] text-[#17140A] px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-[#D9A900]">Save Changes</button>
            </div>
          )}
          {detailTab === "payments" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                {[["Total Collected", `₹${detailGame.totalCollected}`, "#FFC400"], ["Pending", `₹${GAME_PLAYERS.slice(0,detailGame.joined).filter(p=>!p.paid).length * detailGame.fee}`, "#C08B3E"], ["Net (after 5% fee)", `₹${Math.round(detailGame.totalCollected * 0.95)}`, "#3F718B"]].map(([label, val, color]) => (
                  <div key={label as string} className="bg-white border border-[#C9CBC2] rounded-md p-4"><p className="text-xs text-[#5F635C] mb-1">{label}</p><p className="font-bold text-xl" style={{ color: color as string }}>{val}</p></div>
                ))}
              </div>
              <div className="bg-white rounded-md border border-[#C9CBC2] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#DFE0D8]"><span className="text-sm font-semibold text-[#181A1F]">Individual Payments</span></div>
                <div className="overflow-x-auto">
                  <Table className="w-full text-sm">
                    <TableHeader><TableRow className="bg-[#FFC400]/10">{["Player","Amount","Status","Txn ID","Date"].map(h => <TableHead key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#755900] uppercase tracking-wide">{h}</TableHead>)}</TableRow></TableHeader>
                    <TableBody className="divide-y divide-[#F7F7F3]">
                      {GAME_PLAYERS.slice(0, detailGame.joined).map(p => (
                        <TableRow key={p.id} className="hover:bg-[#F7F7F3]/50">
                          <TableCell className="px-4 py-3 font-medium text-[#181A1F]">{p.name}</TableCell>
                          <TableCell className="px-4 py-3 font-semibold text-[#181A1F]">₹{detailGame.fee}</TableCell>
                          <TableCell className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${p.paid ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{p.paid ? "Paid" : "Pending"}</span></TableCell>
                          <TableCell className="px-4 py-3 font-mono text-xs text-[#5F635C]">{p.txnId || "—"}</TableCell>
                          <TableCell className="px-4 py-3 text-[#5F635C] text-xs">{p.joinedDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const qrModal = showQR && (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="bg-[#FFC400] px-6 py-5 text-center">
          <CheckCircle size={40} className="text-[#17140A] mx-auto mb-2" />
          <h2 className="text-xl font-bold text-[#17140A]">Game Created!</h2>
          <p className="text-[#3B310F] text-sm mt-1">Share with friends to fill your slots</p>
        </div>
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <QRCodeSVG value={`INSPIRQ-GAME-${showQR.gameId}`} size={160} bgColor="#ffffff" fgColor="#182131" level="M" includeMargin />
          </div>
          <p className="text-xs text-[#5F635C] mb-1">Game ID</p>
          <p className="font-mono font-bold text-[#181A1F] text-lg mb-1">{showQR.gameId}</p>
          <p className="text-sm text-[#464A45] mb-4">{showQR.sport}</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {["Share", "Copy Link", "Download"].map(label => <button key={label} className="text-xs border border-[#C9CBC2] rounded-md py-2 text-[#464A45] hover:bg-[#F7F7F3]">{label}</button>)}
          </div>
          <button onClick={() => setShowQR(null)} className="w-full bg-[#FFC400] text-[#17140A] py-2.5 rounded-md font-semibold hover:bg-[#D9A900] text-sm">Done</button>
        </div>
      </div>
    </div>
  );

  const filteredGames = filtered.filter(g => gameStatusFilter === "all" || g.status === gameStatusFilter);
  const toggleGameSelect = (id: number) => setGameSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">
      {qrModal}

      <PageHeader
        title="My Hosted Games"
        subtitle={`${games.length} games hosted · ${games.filter(g => g.status === "open").length} currently open`}
        action={
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-[#FFC400] text-[#17140A] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#D9A900]">
            <Plus size={15} /> Host New Game
          </button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Games", val: games.length, color: "#6366F1" },
          { label: "Open", val: games.filter(g => g.status === "open").length, color: "#FFC400" },
          { label: "Total Players", val: games.reduce((s, g) => s + g.joined, 0), color: "#3F718B" },
          { label: "Revenue Collected", val: `₹${games.reduce((s, g) => s + g.totalCollected, 0).toLocaleString()}`, color: "#C08B3E" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-md border border-[#C9CBC2] p-4 shadow-sm">
            <div className="text-xl font-bold" style={{ color: c.color }}>{c.val}</div>
            <div className="text-xs text-[#5F635C] mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {["all", "open", "closed"].map(f => (
            <button key={f} onClick={() => setGameStatusFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${gameStatusFilter === f ? "bg-[#FFC400] text-[#17140A]" : "bg-white border border-[#C9CBC2] text-[#464A45] hover:border-[#D6A500]"}`}>
              {f} {f !== "all" && `(${games.filter(g => g.status === f).length})`}
            </button>
          ))}
        </div>
        {gameSelectedIds.size > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <span className="text-sm font-semibold text-amber-700">{gameSelectedIds.size} selected</span>
            <button onClick={() => { setGames(prev => prev.filter(g => !gameSelectedIds.has(g.id))); setGameSelectedIds(new Set()); }}
              className="flex items-center gap-1 text-xs text-red-500 border border-red-200 bg-white px-2 py-1 rounded-md hover:bg-red-50">
              <Trash2 size={11} /> Delete
            </button>
            <button onClick={() => setGameSelectedIds(new Set())} className="text-xs text-[#7D8178] hover:text-[#30342F]">Clear</button>
          </div>
        )}
      </div>

      {/* DataTable for games */}
      <div className="bg-white rounded-xl border border-[#C9CBC2] shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[#DFE0D8]">
          <input type="checkbox"
            checked={gameSelectedIds.size === filteredGames.length && filteredGames.length > 0}
            onChange={() => setGameSelectedIds(prev => prev.size === filteredGames.length ? new Set() : new Set(filteredGames.map(g => g.id)))}
            className="w-4 h-4 accent-[#D6A500]" />
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8178]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search games…"
              className="w-full pl-9 pr-3 py-1.5 border border-[#C9CBC2] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30" />
          </div>
          <span className="text-sm text-[#7D8178] ml-auto">{filteredGames.length} games</span>
        </div>
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="bg-[#FFC400]/10 text-left">
                <TableHead className="w-8 px-4 py-3"></TableHead>
                {["Sport & Venue", "Date & Time", "Players", "Fee", "Collected", "Status", "Actions"].map(h => (
                  <TableHead key={h} className="px-4 py-3 text-xs font-semibold text-[#755900] uppercase tracking-wide whitespace-nowrap">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#F7F7F3]">
              {filteredGames.map(g => (
                <TableRow key={g.id} className={`hover:bg-[#F7F7F3]/50 transition-colors ${gameSelectedIds.has(g.id) ? "bg-[#FFC400]/5" : ""}`}>
                  <TableCell className="px-4 py-3.5">
                    <input type="checkbox" checked={gameSelectedIds.has(g.id)} onChange={() => toggleGameSelect(g.id)}
                      className="w-4 h-4 accent-[#D6A500]" />
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-[#FFC400]/10 flex items-center justify-center text-base shrink-0">
                        {SPORTS.find(s => s.label === g.sport)?.icon || "🏟️"}
                      </div>
                      <div>
                        <div className="font-semibold text-[#181A1F]">{g.sport}</div>
                        <div className="text-xs text-[#7D8178] truncate max-w-[140px]">{g.venue}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <div className="text-sm text-[#30342F]">{g.date}</div>
                    <div className="text-xs text-[#7D8178]">{g.time}</div>
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-[#DFE0D8] rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-[#FFC400]" style={{ width: `${(g.joined / g.slots) * 100}%` }} />
                      </div>
                      <span className="text-xs text-[#464A45] font-medium">{g.joined}/{g.slots}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3.5 font-semibold text-[#181A1F]">₹{g.fee}</TableCell>
                  <TableCell className="px-4 py-3.5 text-[#755900] font-semibold">₹{g.totalCollected}</TableCell>
                  <TableCell className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${g.status === "open" ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-[#DFE0D8] text-[#5F635C] border-[#C9CBC2]"}`}>
                      {g.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => { setDetailGameId(g.id); setDetailTab("players"); }}
                        className="flex items-center gap-1 text-xs text-[#755900] hover:text-[#D9A900] font-medium">
                        <Eye size={12} /> View
                      </button>
                      <button onClick={() => setShowQR({ gameId: String(g.id), sport: g.sport })}
                        className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-medium">
                        QR
                      </button>
                      <button onClick={() => setGames(prev => prev.filter(x => x.id !== g.id))}
                        className="p-1 text-[#A5A89E] hover:text-red-500 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredGames.length === 0 && (
            <div className="text-center py-12 text-[#7D8178]">
              <Trophy size={32} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm font-medium">No games found</p>
            </div>
          )}
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-6 w-full max-w-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#181A1F]">Host New Game</h3>
              <button onClick={() => setShowCreate(false)}><X size={18} className="text-[#7D8178]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Sport</label>
                <select value={createForm.sport} onChange={e => setCreateForm(p => ({ ...p, sport: e.target.value }))} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]">
                  {["Badminton","Football","Tennis","Basketball","Cricket","Squash"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Skill Level</label>
                <select value={createForm.level} onChange={e => setCreateForm(p => ({ ...p, level: e.target.value }))} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]">
                  {["Beginner","Intermediate","Advanced","All Levels"].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            {[["Venue Name", "venue", "Court Masters Arena"], ["Max Players", "slots", "10"], ["Fee per Player (₹)", "fee", "200"]].map(([label, key, placeholder]) => (
              <div key={key as string}>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">{label}</label>
                <input value={(createForm as any)[key as string]} onChange={e => setCreateForm(p => ({ ...p, [key as string]: e.target.value }))} placeholder={placeholder as string} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Date</label>
                <input type="date" value={createForm.date} onChange={e => setCreateForm(p => ({ ...p, date: e.target.value }))} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Time</label>
                <input type="time" value={createForm.time} onChange={e => setCreateForm(p => ({ ...p, time: e.target.value }))} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[#464A45] mb-1 block">Description / Rules</label>
              <textarea value={createForm.description} onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="Game rules and notes..." className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500] resize-none" />
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowCreate(false)} className="flex-1 border border-[#C9CBC2] rounded-md py-2.5 text-sm">Cancel</button>
              <button onClick={createGame} className="flex-1 bg-[#FFC400] text-[#17140A] rounded-md py-2.5 text-sm font-semibold">Host Game</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const INVOICES = [
  { id: "INV-2026-001", type: "Booking", description: "Badminton Court B2 - 2 hrs", venue: "Court Masters", date: "2026-07-10", amount: 600, status: "paid", bookingId: "BK001" },
  { id: "INV-2026-002", type: "Booking", description: "Football Ground - 1.5 hrs", venue: "Kick Arena", date: "2026-07-08", amount: 750, status: "paid", bookingId: "BK002" },
  { id: "INV-2026-003", type: "Game Hosting", description: "Badminton Open - 12 players", venue: "Court Masters", date: "2026-07-06", amount: 1200, status: "paid", bookingId: "GH001" },
  { id: "INV-2026-004", type: "Booking", description: "Tennis Court A1 - 1 hr", venue: "Tennis Hub", date: "2026-07-04", amount: 400, status: "paid", bookingId: "BK003" },
  { id: "INV-2026-005", type: "Game Hosting", description: "Basketball Pickup - 8 players", venue: "Sports Zone", date: "2026-07-01", amount: 640, status: "refunded", bookingId: "GH002" },
  { id: "INV-2026-006", type: "Booking", description: "Squash Court - 1 hr", venue: "SquashPlex", date: "2026-06-28", amount: 350, status: "pending", bookingId: "BK004" },
];

export function PlayerInvoices({ onNavigate }: { onNavigate: (p: any, ctx?: any) => void }) {
  const [typeFilter, setTypeFilter] = useState<"All" | "Booking" | "Game Hosting">("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<typeof INVOICES[0] | null>(null);

  const filtered = INVOICES.filter(inv => {
    const typeMatch = typeFilter === "All" || inv.type === typeFilter;
    const statusMatch = statusFilter === "all" || inv.status === statusFilter;
    return typeMatch && statusMatch;
  });

  const totalPaid = INVOICES.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pendingCount = INVOICES.filter(i => i.status === "pending").length;

  const cols: ColDef<(typeof INVOICES)[number]>[] = [
    { key: "id", label: "Invoice ID", render: (v: string) => <span className="font-mono text-xs text-[#30342F]">{v}</span> },
    {
      key: "type", label: "Type",
      render: (v: string) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${v === "Booking" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{v}</span>
      )
    },
    { key: "description", label: "Description", render: (v: string) => <span className="text-sm text-[#30342F]">{v}</span> },
    { key: "date", label: "Date", render: (v: string) => <span className="text-sm text-[#5F635C]">{v}</span> },
    { key: "amount", label: "Amount", render: (v: number) => <span className="text-sm font-semibold text-[#222520]">₹{v.toLocaleString()}</span> },
    {
      key: "status", label: "Status",
      render: (v: string) => {
        const cls = v === "paid" ? "bg-sky-100 text-sky-700" : v === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";
        return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${cls}`}>{v}</span>;
      }
    },
    {
      key: "actions", label: "Actions",
      render: (_v: string, row: typeof INVOICES[0]) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectedInvoice(row)} className="flex items-center gap-1 text-xs text-[#755900] hover:underline font-medium">
            <Eye size={13} /> View
          </button>
          <button className="p-1 rounded hover:bg-[#DFE0D8] text-[#5F635C]" title="Download">
            <Download size={14} />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
      <PageHeader title="Invoices" subtitle="All payment receipts for bookings and games" />

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Paid" value={`₹${totalPaid.toLocaleString()}`} icon={CreditCard} color="#FFC400" />
        <StatCard label="Pending" value={String(pendingCount)} icon={Clock} color="#C08B3E" />
        <StatCard label="Total Invoices" value={String(INVOICES.length)} icon={FileText} color="#3F718B" />
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-1 bg-[#DFE0D8] rounded-lg p-1">
          {(["All", "Booking", "Game Hosting"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setTypeFilter(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${typeFilter === tab ? "bg-white text-[#755900] shadow-sm" : "text-[#5F635C] hover:text-[#30342F]"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-[#C9CBC2] rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]"
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Table */}
      <DataTable columns={cols} data={filtered} />

      {/* Invoice preview panel */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedInvoice(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedInvoice(null)} className="absolute top-4 right-4 p-1 rounded hover:bg-[#DFE0D8]">
              <X size={16} className="text-[#5F635C]" />
            </button>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-lg font-bold text-[#755900]">InspirQ Sports</div>
                <div className="text-xs text-[#7D8178]">inspirqsports.com</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#5F635C]">Invoice #</div>
                <div className="font-mono text-sm font-semibold text-[#222520]">{selectedInvoice.id}</div>
                <div className="text-xs text-[#7D8178] mt-0.5">{selectedInvoice.date}</div>
              </div>
            </div>

            <div className="border-t border-[#DFE0D8] pt-3 mb-3">
              <div className="text-xs text-[#5F635C] mb-0.5">Billed To</div>
              <div className="text-sm font-semibold text-[#222520]">Arjun Mehta</div>
              <div className="text-xs text-[#7D8178]">{selectedInvoice.venue}</div>
            </div>

            {/* Itemized table */}
            <Table className="w-full text-xs mb-3">
              <TableHeader>
                <TableRow className="bg-[#FFC400]/10">
                  <TableHead className="text-left py-1.5 px-2 font-medium text-[#755900] rounded-l">Description</TableHead>
                  <TableHead className="text-right py-1.5 px-2 font-medium text-[#755900] rounded-r">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="py-1.5 px-2 text-[#30342F]">{selectedInvoice.description}</TableCell>
                  <TableCell className="py-1.5 px-2 text-right text-[#30342F]">₹{selectedInvoice.amount.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Breakdown */}
            <div className="border-t border-[#DFE0D8] pt-3 space-y-1 text-xs mb-4">
              <div className="flex justify-between text-[#5F635C]">
                <span>Subtotal</span>
                <span>₹{Math.round(selectedInvoice.amount / 1.18).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#5F635C]">
                <span>GST (18%)</span>
                <span>₹{Math.round(selectedInvoice.amount - selectedInvoice.amount / 1.18).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-[#222520] text-sm pt-1 border-t border-[#DFE0D8]">
                <span>Total</span>
                <span>₹{selectedInvoice.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* QR + Payment + Stamp */}
            <div className="flex items-end justify-between">
              <div>
                {/* QR code placeholder as 12x12 CSS grid */}
                <div className="grid grid-cols-6 gap-px w-12 h-12 mb-1">
                  {Array.from({ length: 36 }).map((_c, i) => (
                    <div key={i} className={`rounded-sm ${(i + Math.floor(i / 6)) % 3 === 0 ? "bg-[#222520]" : "bg-[#C9CBC2]"}`} />
                  ))}
                </div>
                <div className="text-xs text-[#7D8178]">Scan to verify</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#7D8178] mb-1">Payment Method</div>
                <div className="text-xs font-medium text-[#464A45]">UPI / Wallet</div>
              </div>
              <div className={`px-3 py-1.5 rounded-md border-2 text-xs font-bold uppercase tracking-widest ${selectedInvoice.status === "paid" ? "border-sky-400 text-sky-500" : selectedInvoice.status === "pending" ? "border-yellow-400 text-yellow-500" : "border-red-400 text-red-500"}`}>
                {selectedInvoice.status}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// ─── Player Bookmarks ─────────────────────────────────────────────────────────

const BOOKMARKED_VENUES_DATA = VENUES.slice(0, 3).map(v => ({ ...v, savedAt: "Jul 10, 2026" }));
const BOOKMARKED_TOURNAMENTS_DATA = TOURNAMENTS.slice(0, 2).map(t => ({ ...t, savedAt: "Jul 8, 2026" }));
const BOOKMARKED_COACHES_DATA = TRAINERS.slice(0, 2).map(t => ({ ...t, savedAt: "Jul 5, 2026" }));

export function PlayerBookmarks({ onNavigate }: { onNavigate: (p: Page, ctx?: any) => void }) {
  const [activeTab, setActiveTab] = useState<"venues"|"tournaments"|"coaches">("venues");
  const [search, setSearch] = useState("");

  const tabs = [
    { id: "venues" as const, label: "Arenas", count: BOOKMARKED_VENUES_DATA.length, icon: Building2 },
    { id: "tournaments" as const, label: "Tournaments", count: BOOKMARKED_TOURNAMENTS_DATA.length, icon: Trophy },
    { id: "coaches" as const, label: "Coaches", count: BOOKMARKED_COACHES_DATA.length, icon: GraduationCap },
  ];

  const q = search.toLowerCase();

  return (
    <div className="min-h-full bg-[#F7F7F3]">
      <div className="bg-[#F7F7F3]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 pt-5 pb-4">
          <nav className="flex items-center gap-1.5 text-xs text-[#7D8178] mb-2">
            <span>Home</span>
            <span className="text-[#A5A89E]">›</span>
            <span className="text-[#755900] font-semibold">Bookmarks</span>
          </nav>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-[#151713]">Bookmarks</h1>
              <p className="text-xs text-[#7D8178] mt-0.5">Your saved arenas, tournaments, and coaches</p>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8178]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bookmarks..."
                className="pl-9 pr-3 py-2 text-xs bg-white border border-[#DFE0D8] rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500] placeholder:text-[#A5A89E]" />
            </div>
          </div>
          <div className="flex gap-0.5 mt-4 bg-white border border-[#DFE0D8] rounded-md p-1 w-fit">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-semibold transition-colors ${activeTab === t.id ? "bg-[#FFC400] text-[#17140A]" : "text-[#5F635C] hover:text-[#151713]"}`}>
                  <Icon size={12} />
                  {t.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${activeTab === t.id ? "bg-white/25 text-white" : "bg-[#EFEFE9] text-[#7D8178]"}`}>{t.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6">
        {activeTab === "venues" && (() => {
          const items = BOOKMARKED_VENUES_DATA.filter(v => v.name.toLowerCase().includes(q) || v.location.toLowerCase().includes(q));
          if (items.length === 0) return (
            <div className="text-center py-20">
              <Bookmark size={36} className="mx-auto mb-3 text-[#A5A89E]" />
              <p className="font-medium text-[#5F635C]">No saved arenas</p>
              <button onClick={() => onNavigate("player-venues")} className="mt-3 text-[#755900] text-sm font-semibold hover:underline">Browse Arenas →</button>
            </div>
          );
          return (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(v => (
                <div key={v.id} onClick={() => onNavigate("venue-detail", v)}
                  className="bg-white rounded-md border border-[#DFE0D8] overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                  <div className="relative h-40 overflow-hidden bg-[#EFEFE9]">
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { (e.target as HTMLImageElement).src = "/inspirq-media/football.png"; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="bg-white/95 text-[#151713] text-xs font-bold px-2 py-0.5 rounded-full">{v.sport}</span>
                      {v.verified && <span className="bg-[#FFC400] text-[#17140A] text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Shield size={7} /> Verified</span>}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#151713] text-sm mb-1 group-hover:text-[#755900] transition-colors">{v.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-[#5F635C] mb-3">
                      <span className="flex items-center gap-1"><MapPin size={9} className="text-[#755900]" />{v.location}</span>
                      <span className="flex items-center gap-0.5"><Star size={9} className="fill-yellow-400 text-yellow-400" />{v.rating}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#EFEFE9]">
                      <span className="font-bold text-[#151713] text-sm">₹{v.price.toLocaleString()}<span className="text-xs text-[#7D8178] font-normal">/hr</span></span>
                      <button onClick={e => { e.stopPropagation(); onNavigate("venue-detail", v); }}
                        className="bg-[#FFC400] text-[#17140A] text-xs font-bold px-3 py-1.5 rounded-md hover:bg-[#D9A900] transition-colors">Book Now</button>
                    </div>
                    <p className="text-xs text-[#A5A89E] mt-2 flex items-center gap-1"><Bookmark size={9} /> Saved {v.savedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {activeTab === "tournaments" && (() => {
          const items = BOOKMARKED_TOURNAMENTS_DATA.filter(t => t.name.toLowerCase().includes(q));
          if (items.length === 0) return (
            <div className="text-center py-20">
              <Bookmark size={36} className="mx-auto mb-3 text-[#A5A89E]" />
              <p className="font-medium text-[#5F635C]">No saved tournaments</p>
              <button onClick={() => onNavigate("player-tournaments")} className="mt-3 text-[#755900] text-sm font-semibold hover:underline">Browse Tournaments →</button>
            </div>
          );
          return (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(t => (
                <div key={t.id} onClick={() => onNavigate("tournament-detail", t)}
                  className="bg-white rounded-md border border-[#DFE0D8] p-4 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#FBF1DE] rounded-md flex items-center justify-center text-xl shrink-0">🏆</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#151713] text-sm group-hover:text-[#755900] transition-colors">{t.name}</h3>
                      <p className="text-xs text-[#7D8178] mt-0.5">by {t.organizer}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[["Sport", t.sport], ["Date", new Date(t.date).toLocaleDateString("en-IN",{day:"numeric",month:"short"})], ["Prize", t.prize], ["Entry", `₹${t.fee}`]].map(([l,v]) => (
                      <div key={String(l)} className="bg-[#F7F7F3] rounded-md p-2">
                        <p className="text-xs text-[#7D8178] uppercase tracking-wide">{l}</p>
                        <p className="text-xs font-semibold text-[#151713]">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#EFEFE9]">
                    <p className="text-xs text-[#A5A89E] flex items-center gap-1"><Bookmark size={9} /> Saved {t.savedAt}</p>
                    <button onClick={e => { e.stopPropagation(); onNavigate("tournament-detail", t); }} className="text-xs font-bold text-[#755900] hover:underline">Register →</button>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {activeTab === "coaches" && (() => {
          const items = BOOKMARKED_COACHES_DATA.filter(t => t.name.toLowerCase().includes(q) || t.sport.toLowerCase().includes(q));
          if (items.length === 0) return (
            <div className="text-center py-20">
              <Bookmark size={36} className="mx-auto mb-3 text-[#A5A89E]" />
              <p className="font-medium text-[#5F635C]">No saved coaches</p>
              <button onClick={() => onNavigate("player-training")} className="mt-3 text-[#755900] text-sm font-semibold hover:underline">Browse Coaches →</button>
            </div>
          );
          return (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(t => (
                <div key={t.id} onClick={() => onNavigate("coach-detail", t)}
                  className="bg-white rounded-md border border-[#DFE0D8] overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                  <div className="relative h-40 overflow-hidden bg-[#EFEFE9]">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={e => { (e.target as HTMLImageElement).src = "/inspirq-media/coach-avatar.svg"; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <p className="font-bold text-white text-sm">{t.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={9} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-white text-xs">{t.rating} · {t.students} students</span>
                      </div>
                    </div>
                    {t.verified && <div className="absolute top-3 left-3"><span className="bg-[#FFC400] text-[#17140A] text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Shield size={7} /> Verified</span></div>}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-[#FFF9D6] text-[#755900] font-semibold px-2 py-0.5 rounded-full">{t.sport}</span>
                      <span className="font-bold text-[#151713] text-sm">₹{t.fee.toLocaleString()}<span className="text-xs text-[#7D8178] font-normal">/session</span></span>
                    </div>
                    <p className="text-xs text-[#5F635C] flex items-center gap-1 mb-3"><MapPin size={9} className="text-[#755900]" />{t.location}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-[#EFEFE9]">
                      <p className="text-xs text-[#A5A89E] flex items-center gap-1"><Bookmark size={9} /> Saved {t.savedAt}</p>
                      <button onClick={e => { e.stopPropagation(); onNavigate("coach-detail", t); }} className="text-xs font-bold text-[#755900] hover:underline">View →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
