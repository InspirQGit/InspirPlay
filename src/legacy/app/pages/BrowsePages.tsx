import { useState, type MouseEvent } from "react";
import {
  Search, MapPin, Star, Filter, X, CheckCircle, Users, Trophy,
  Calendar, Clock, CreditCard, Zap, Plus, Building2, GraduationCap,
  Instagram, Twitter, Facebook, Youtube, Shield, Award, Heart,
  SlidersHorizontal, ChevronRight, LayoutGrid, List
} from "lucide-react";
import type { Page } from "../data";
import type { CoachSessionItem, VenueItem, TrainerItem, TournamentItem, GameItem } from "../data";
import { COACH_SESSIONS, COACH_SESSIONS_STORAGE_KEY } from "../data";
import { Badge } from "../components";
import { Button } from "../components/ui/button";

// ─── Login Wall ────────────────────────────────────────────────────────────────

function LoginWall({ onClose, onNavigate }: { onClose: () => void; onNavigate: (p: Page) => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-sm p-7 text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 bg-[#FFC400]/10 rounded-xl flex items-center justify-center mx-auto">
          <Zap size={28} className="text-[#755900]" />
        </div>
        <h3 className="text-xl font-bold text-[#151713]">
          Create a free account
        </h3>
        <p className="text-sm text-[#5F635C] leading-relaxed">
          Join 50,000+ players — book venues, register for tournaments &amp; connect with coaches.
        </p>
        <div className="grid grid-cols-3 gap-3 py-1">
          {[["892+", "Venues"], ["200+", "Coaches"], ["Free", "to Join"]].map(([v, l]) => (
            <div key={l} className="bg-[#F7F7F3] rounded-md p-2 text-center">
              <div className="text-base font-bold text-[#755900]">{v}</div>
              <div className="text-xs text-[#7D8178]">{l}</div>
            </div>
          ))}
        </div>
        <button onClick={() => onNavigate("auth")}
          className="w-full bg-[#FFC400] text-[#17140A] py-3 rounded-md font-semibold text-sm hover:bg-[#D9A900] transition-colors">
          Sign Up Free — No Credit Card
        </button>
        <button onClick={() => onNavigate("auth")}
          className="w-full border border-[#DFE0D8] text-[#222520] py-3 rounded-md font-medium text-sm hover:bg-[#F7F7F3] transition-colors">
          Already have an account? Log In
        </button>
        <button onClick={onClose} className="text-xs text-[#7D8178] hover:text-[#5F635C] transition-colors">
          Continue browsing
        </button>
      </div>
    </div>
  );
}

// ─── Browse Footer ─────────────────────────────────────────────────────────────

export function BrowseFooter({ onNavigate }: { onNavigate: (p: Page, ctx?: any) => void }) {
  const cols = [
    { title: "Discover", links: [
      { l: "Find Arenas",    p: "player-venues"      as Page },
      { l: "Tournaments",   p: "player-tournaments" as Page },
      { l: "Coaches",       p: "player-training"    as Page },
    ]},
    { title: "Company", links: [
      { l: "About Us",    p: "about-us"   as Page },
      { l: "Help Centre", p: "help-center" as Page },
      { l: "Design System", p: "design-system" as Page },
    ]},
    { title: "Legal", links: [
      { l: "Privacy Policy",  p: "privacy-policy" as Page },
      { l: "Terms of Service", p: "terms"          as Page },
      { l: "Cookie Policy",   p: "cookie-policy"  as Page },
    ]},
  ];
  return (
    <footer className="bg-[#151713] text-[#7D8178] py-12 mt-8">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#FFC400] rounded-md flex items-center justify-center">
                <Zap size={16} className="text-[#17140A]" />
              </div>
              <span className="text-white font-bold text-lg">InspirQ</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">India&apos;s most trusted sports venue booking platform. Book, play, and win.</p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <div key={i} className="group w-8 h-8 bg-white/8 rounded-md flex items-center justify-center hover:bg-[#FFC400] transition-colors cursor-pointer">
                  <Icon size={14} className="text-white group-hover:text-[#17140A]" />
                </div>
              ))}
            </div>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(({ l, p }) => (
                  <li key={l}>
                    <button onClick={() => onNavigate(p)} className="text-sm hover:text-[#755900] transition-colors text-left">{l}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span>© 2026 InspirQ Sport Play. All rights reserved.</span>
          <span>Made with ❤️ for India&apos;s sports community</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Filter Drawer ─────────────────────────────────────────────────────────────

function FilterDrawer({ open, onClose, title, children, onApply }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; onApply?: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-80 bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#DFE0D8] shrink-0">
          <h3 className="font-bold text-[#151713]">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-[#F7F7F3] rounded-md"><X size={18} className="text-[#5F635C]" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">{children}</div>
        <div className="px-5 py-4 border-t border-[#DFE0D8] shrink-0 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-[#DFE0D8] text-[#222520] rounded-md text-sm font-medium hover:bg-[#F7F7F3] transition-colors">Reset</button>
          <button onClick={onApply ?? onClose} className="flex-1 py-3 bg-[#FFC400] text-[#17140A] rounded-md text-sm font-semibold hover:bg-[#D9A900] transition-colors">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

function FSec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-3">{label}</h4>
      {children}
    </div>
  );
}

function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${value === o ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "border-[#DFE0D8] text-[#464A45] hover:border-[#D6A500] hover:text-[#755900]"}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

// ─── Page header ──────────────────────────────────────────────────────────────

function BrowsePageHeader({
  title, description, count, countLabel, search, onSearch,
  onFilter, activeFilters, onClear,
  viewMode, onViewMode,
  sortValue, onSort, sortOptions,
  sportValue, onSport, sportOptions,
  fVerified, onVerified,
}: {
  title: string; description: string; count: number; countLabel: string;
  search: string; onSearch: (v: string) => void;
  onFilter: () => void; activeFilters: number; onClear: () => void;
  viewMode?: "grid" | "list"; onViewMode?: (v: "grid" | "list") => void;
  sortValue?: string; onSort?: (v: string) => void; sortOptions?: { value: string; label: string }[];
  sportValue?: string; onSport?: (v: string) => void; sportOptions?: string[];
  fVerified?: boolean; onVerified?: () => void;
}) {
  return (
    <div className="border-b border-[#DFE0D8] bg-white py-6">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 space-y-5">

        {/* ── Row 1: Title + count + view toggle ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="font-['Lexend'] text-3xl font-bold leading-tight text-[#151713]">{title}</div>
              <span className="rounded-full border border-[#DFE0D8] bg-[#F7F7F3] px-2 py-0.5 text-xs font-semibold tabular-nums text-[#5F635C]">
                {count} {countLabel}
              </span>
            </div>
            <div className="mt-2 max-w-2xl text-sm text-[#5F635C]">{description}</div>
          </div>
          {onViewMode && (
            <div className="flex shrink-0 rounded-lg border border-[#DFE0D8] bg-[#F7F7F3] p-1">
              <button onClick={() => onViewMode("grid")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all ${viewMode === "grid" ? "bg-[#FFC400] text-[#17140A] shadow-sm" : "text-[#5F635C] hover:text-[#222520]"}`}>
                <LayoutGrid size={14} /><span className="hidden sm:inline">Cards</span>
              </button>
              <button onClick={() => onViewMode("list")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all ${viewMode === "list" ? "bg-[#FFC400] text-[#17140A] shadow-sm" : "text-[#5F635C] hover:text-[#222520]"}`}>
                <List size={14} /><span className="hidden sm:inline">List</span>
              </button>
            </div>
          )}
        </div>

        {/* ── Row 2: Search + Sort + Sport + Verified + Filter ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative min-w-[220px] flex-1">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7D8178]" />
            <input value={search} onChange={e => onSearch(e.target.value)}
              placeholder="Search…"
              className="w-full pl-8 pr-3 py-2 rounded-lg text-xs border border-[#DFE0D8] bg-white text-[#151713] focus:outline-none focus:ring-2 focus:ring-[#D6A500]/20 focus:border-[#D6A500] placeholder:text-[#A5A89E] transition-all shadow-sm" />
          </div>

          {sortOptions && onSort && (
            <div className="relative">
              <select value={sortValue} onChange={e => onSort(e.target.value)}
                className="pl-3 pr-7 py-2 bg-white border border-[#DFE0D8] rounded-lg text-xs text-[#222520] appearance-none focus:outline-none focus:ring-2 focus:ring-[#D6A500]/20 cursor-pointer shadow-sm">
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronRight size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7D8178] pointer-events-none rotate-90" />
            </div>
          )}

          {sportOptions && onSport && (
            <div className="relative">
              <select value={sportValue} onChange={e => onSport(e.target.value)}
                className="pl-3 pr-7 py-2 bg-white border border-[#DFE0D8] rounded-lg text-xs text-[#222520] appearance-none focus:outline-none focus:ring-2 focus:ring-[#D6A500]/20 cursor-pointer shadow-sm">
                {sportOptions.map(s => <option key={s} value={s}>{s === "All" ? "All Sports" : s}</option>)}
              </select>
              <ChevronRight size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7D8178] pointer-events-none rotate-90" />
            </div>
          )}

          {onVerified !== undefined && (
            <button onClick={onVerified}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap shadow-sm ${fVerified ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "bg-white text-[#464A45] border-[#DFE0D8] hover:border-[#D6A500]/40 hover:text-[#755900]"}`}>
              <Shield size={12} />
              Verified
              <span className={`inline-flex w-7 h-4 rounded-full transition-all relative ml-0.5 ${fVerified ? "bg-white/30" : "bg-[#CFD6E1]"}`}>
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all ${fVerified ? "left-3.5" : "left-0.5"}`} />
              </span>
            </button>
          )}

          <button onClick={onFilter}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap shadow-sm ${activeFilters > 0 ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "bg-white text-[#222520] border-[#DFE0D8] hover:border-[#D6A500] hover:text-[#755900]"}`}>
            <SlidersHorizontal size={13} />
            Filters
            {activeFilters > 0 && <span className="bg-white/30 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">{activeFilters}</span>}
          </button>

          {activeFilters > 0 && (
            <button onClick={onClear} className="flex items-center gap-1 text-xs font-semibold text-[#B44949] hover:underline">
              <X size={11} /> Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Player Venues ─────────────────────────────────────────────────────────────

export function PlayerVenues({ venues, onNavigate, isGuest }: { venues: VenueItem[]; onNavigate: (p: Page, ctx?: any) => void; isGuest?: boolean }) {
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [fSport, setFSport] = useState("All");
  const [fRating, setFRating] = useState(0);
  const [fPrice, setFPrice] = useState(10000);
  const [fAmenities, setFAmenities] = useState<string[]>([]);
  const [fVerified, setFVerified] = useState(false);
  const [fSort, setFSort] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid"|"list">("grid");
  const [favs, setFavs] = useState<Set<number>>(new Set());
  const toggleFav = (id: number, e: MouseEvent) => { e.stopPropagation(); setFavs(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; }); };

  const AMENITY_OPTIONS = ["AC", "Parking", "Restroom", "Floodlights", "Changing Room", "Café", "Shower"];
  const toggleAmenity = (a: string) => setFAmenities(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a]);
  const activeFilters = (fSport !== "All" ? 1 : 0) + (fRating > 0 ? 1 : 0) + (fPrice < 10000 ? 1 : 0) + fAmenities.length + (fVerified ? 1 : 0);
  const clearFilters = () => { setFSport("All"); setFRating(0); setFPrice(10000); setFAmenities([]); setFVerified(false); };

  let filtered = venues.filter(v =>
    (fSport === "All" || v.sport === fSport) &&
    v.rating >= fRating && v.price <= fPrice &&
    (!fVerified || v.verified) &&
    (fAmenities.length === 0 || fAmenities.every(a => v.amenities.includes(a))) &&
    (v.name.toLowerCase().includes(search.toLowerCase()) || v.location.toLowerCase().includes(search.toLowerCase()))
  );
  filtered = [...filtered].sort((a, b) =>
    fSort === "rating" ? b.rating - a.rating :
    fSort === "price_asc" ? a.price - b.price :
    fSort === "price_desc" ? b.price - a.price : 0
  );

  return (
    <div className="min-h-full bg-[#F7F7F3]">
      <BrowsePageHeader
        title="Find Arenas"
        description="Compare verified sports venues by location, availability, amenities, rating, and hourly price."
        count={filtered.length}
        countLabel="arenas near you"
        search={search}
        onSearch={setSearch}
        onFilter={() => setShowFilter(true)}
        activeFilters={activeFilters}
        onClear={clearFilters}
        viewMode={viewMode}
        onViewMode={setViewMode}
        sortValue={fSort}
        onSort={setFSort}
        sortOptions={[
          { value: "rating", label: "Top Rated" },
          { value: "price_asc", label: "Price: Low → High" },
          { value: "price_desc", label: "Price: High → Low" },
        ]}
        sportValue={fSport}
        onSport={setFSport}
        sportOptions={["All", "Badminton", "Football", "Tennis", "Basketball", "Cricket", "Squash"]}
        fVerified={fVerified}
        onVerified={() => setFVerified(v => !v)}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#7D8178]">
            <div className="w-16 h-16 bg-[#EFEFE9] rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 size={24} className="text-[#A5A89E]" />
            </div>
            <p className="font-semibold text-[#5F635C] mb-1">No arenas match your filters</p>
            <p className="text-sm text-[#7D8178] mb-4">Try broadening your search criteria</p>
            <button onClick={clearFilters} className="text-[#755900] text-sm font-semibold hover:underline">Clear all filters</button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(v => (
              <VenueCardMinimal key={v.id} v={v} onNavigate={onNavigate} isFav={favs.has(v.id)} onToggleFav={(e) => toggleFav(v.id, e)} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(v => (
              <div key={v.id} onClick={() => onNavigate("venue-detail", v)}
                className="bg-white border border-[#DFE0D8] rounded-md flex items-center gap-4 p-3 hover:shadow-md hover:border-[#D6A500]/30 transition-all cursor-pointer group">
                <div className="w-16 h-16 rounded-md overflow-hidden bg-[#EFEFE9] shrink-0">
                  <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { (e.target as HTMLImageElement).src = "/inspirq-media/football.png"; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-[#151713] text-sm group-hover:text-[#755900] transition-colors truncate">{v.name}</h3>
                    {v.verified && <span className="shrink-0 bg-[#FFC400] text-[#17140A] text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><CheckCircle size={7} /> Verified</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#5F635C]">
                    <span className="flex items-center gap-1"><MapPin size={9} className="text-[#755900]" />{v.location}</span>
                    <span className="flex items-center gap-0.5"><Star size={9} className="fill-yellow-400 text-yellow-400" />{v.rating}</span>
                    <span className="bg-[#F7F7F3] px-1.5 py-0.5 rounded-md">{v.sport}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-[#151713] text-sm">₹{v.price.toLocaleString()}<span className="text-xs text-[#7D8178] font-normal">/hr</span></div>
                  <span className={`text-xs font-bold ${v.available ? "text-[#755900]" : "text-[#B44949]"}`}>{v.available ? "● Available" : "● Booked"}</span>
                </div>
                <button onClick={e => { e.stopPropagation(); onNavigate("venue-detail", v); }}
                  disabled={!v.available}
                  className="shrink-0 bg-[#FFC400] text-[#17140A] text-xs font-bold px-4 py-2 rounded-md hover:bg-[#D9A900] transition-colors disabled:opacity-50 ml-2">
                  Book
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BrowseFooter onNavigate={onNavigate} />

      <FilterDrawer open={showFilter} onClose={() => setShowFilter(false)} title="Filter Venues" onApply={() => setShowFilter(false)}>
        <FSec label="Sport">
          <Chips options={["All", "Badminton", "Football", "Tennis", "Basketball", "Cricket", "Squash"]} value={fSport} onChange={setFSport} />
        </FSec>
        <FSec label="Max Price / Hour">
          <input type="range" min={500} max={10000} step={500} value={fPrice} onChange={e => setFPrice(Number(e.target.value))} className="w-full accent-[#D6A500]" />
          <div className="flex justify-between text-xs text-[#7D8178] mt-2">
            <span>₹500</span>
            <span className="font-semibold text-[#755900]">up to ₹{fPrice.toLocaleString()}</span>
            <span>₹10K+</span>
          </div>
        </FSec>
        <FSec label="Minimum Rating">
          <Chips options={["Any", "3.5+", "4.0+", "4.5+"]} value={fRating === 0 ? "Any" : `${fRating}+`} onChange={v => setFRating(v === "Any" ? 0 : parseFloat(v))} />
        </FSec>
        <FSec label="Amenities">
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map(a => (
              <button key={a} onClick={() => toggleAmenity(a)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${fAmenities.includes(a) ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "border-[#DFE0D8] text-[#464A45] hover:border-[#D6A500]"}`}>
                {a}
              </button>
            ))}
          </div>
        </FSec>
      </FilterDrawer>
    </div>
  );
}

// ─── Venue card (minimalist) ───────────────────────────────────────────────────

function VenueCardMinimal({ v, onNavigate, isFav, onToggleFav }: {
  v: VenueItem; onNavigate: (p: Page, ctx?: any) => void;
  isFav?: boolean; onToggleFav?: (e: MouseEvent) => void;
}) {
  const sportEmojis: Record<string, string> = { Badminton: "🏸", Football: "⚽", Tennis: "🎾", Cricket: "🏏", Basketball: "🏀", Squash: "🏸" };
  return (
    <div
      onClick={() => onNavigate("venue-detail", v)}
      className="bg-white rounded-md overflow-hidden border border-[#DFE0D8] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-[#EFEFE9]">
        <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).src = "/inspirq-media/football.png"; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="bg-white/95 backdrop-blur-sm text-[#151713] text-xs font-bold px-2 py-0.5 rounded-full">
            {sportEmojis[v.sport] || "🏟"} {v.sport}
          </span>
          {v.verified && (
            <span className="bg-[#FFC400] text-[#17140A] text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle size={8} /> Verified
            </span>
          )}
        </div>
        {/* Fav */}
        <button
          aria-label={isFav ? `Remove ${v.name} from favorites` : `Add ${v.name} to favorites`}
          aria-pressed={isFav}
          onClick={onToggleFav}
          className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-colors hover:bg-white"
        >
          <Heart size={13} className={isFav ? "text-red-500 fill-red-500" : "text-[#7D8178]"} />
        </button>
        {/* Availability */}
        <div className="absolute bottom-3 right-3">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${v.available ? "bg-[#FFF9D6] text-[#755900]" : "bg-[#F7E8E6] text-[#B44949]"}`}>
            {v.available ? "● Available" : "● Booked"}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[#151713] text-sm leading-snug group-hover:text-[#755900] transition-colors">{v.name}</h3>
          <div className="flex items-center gap-0.5 shrink-0">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-[#151713]">{v.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#5F635C] text-xs mb-3">
          <MapPin size={10} className="text-[#755900] shrink-0" />
          <span className="truncate">{v.location}</span>
        </div>
        {/* Amenity chips */}
        <div className="flex flex-wrap gap-1 mb-3">
          {v.amenities.slice(0, 3).map(a => (
            <span key={a} className="bg-[#F7F7F3] text-[#5F635C] text-xs px-2 py-0.5 rounded-md border border-[#EFEFE9]">{a}</span>
          ))}
          {v.amenities.length > 3 && <span className="text-[#7D8178] text-xs">+{v.amenities.length - 3}</span>}
        </div>
        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-[#EFEFE9]">
          <div>
            <span className="text-lg font-bold text-[#151713]">₹{v.price.toLocaleString()}</span>
            <span className="text-xs text-[#7D8178]">/hr</span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onNavigate("venue-detail", v); }}
            disabled={!v.available}
            className="bg-[#FFC400] text-[#17140A] text-xs font-bold px-4 py-2 rounded-md hover:bg-[#D9A900] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Player Tournaments ─────────────────────────────────────────────────────────

export function PlayerTournaments({ tournaments, onNavigate, isGuest }: { tournaments: TournamentItem[]; onNavigate: (p: Page, ctx?: any) => void; isGuest?: boolean }) {
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [fSport, setFSport] = useState("All");
  const [fStatus, setFStatus] = useState("all");
  const [fMaxFee, setFMaxFee] = useState(5000);
  const [fSort, setFSort] = useState("date");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favs, setFavs] = useState<Set<number>>(new Set());
  const toggleFav = (id: number, e: MouseEvent) => { e.stopPropagation(); setFavs(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; }); };

  const sportIcons: Record<string, string> = { Badminton: "🏸", Football: "⚽", Tennis: "🎾", Cricket: "🏏", Basketball: "🏀", Squash: "🏸" };
  const activeFilters = (fSport !== "All" ? 1 : 0) + (fStatus !== "all" ? 1 : 0) + (fMaxFee < 5000 ? 1 : 0);
  const clearFilters = () => { setFSport("All"); setFStatus("all"); setFMaxFee(5000); };

  let filtered = tournaments.filter(t =>
    (fSport === "All" || t.sport === fSport) &&
    (fStatus === "all" || (fStatus === "open" && t.status !== "full") || (fStatus === "full" && t.status === "full")) &&
    t.fee <= fMaxFee &&
    (search === "" || t.name.toLowerCase().includes(search.toLowerCase()))
  );
  filtered = [...filtered].sort((a, b) =>
    fSort === "fee_asc" ? a.fee - b.fee
      : fSort === "fee_desc" ? b.fee - a.fee
        : fSort === "availability" ? (b.slots - b.filled) - (a.slots - a.filled)
          : a.date.localeCompare(b.date)
  );

  return (
    <div className="min-h-full bg-[#F7F7F3]">
      <BrowsePageHeader
        title="Tournaments"
        description="Discover upcoming competitions, compare formats and entry fees, and register before places fill."
        count={filtered.length}
        countLabel="tournaments found"
        search={search}
        onSearch={setSearch}
        onFilter={() => setShowFilter(true)}
        activeFilters={activeFilters}
        onClear={clearFilters}
        viewMode={viewMode}
        onViewMode={setViewMode}
        sortValue={fSort}
        onSort={setFSort}
        sortOptions={[
          { value: "date", label: "Soonest Date" },
          { value: "availability", label: "Most Availability" },
          { value: "fee_asc", label: "Fee: Low → High" },
          { value: "fee_desc", label: "Fee: High → Low" },
        ]}
        sportValue={fSport}
        onSport={setFSport}
        sportOptions={["All", "Badminton", "Football", "Tennis", "Cricket", "Basketball"]}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6">
        <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-3"}>
          {filtered.map(t => {
            if (viewMode === "grid") {
              return <TournamentCardMinimal key={t.id} tournament={t} onNavigate={onNavigate} isFav={favs.has(t.id)} onToggleFav={(event) => toggleFav(t.id, event)} />;
            }
            const pct = Math.round((t.filled / t.slots) * 100);
            const statusColor = t.status === "open" ? "success" : t.status === "filling_fast" ? "orange" : "red";
            return (
              <div key={t.id} onClick={() => onNavigate("tournament-detail", t)}
                className="bg-white rounded-md border border-[#DFE0D8] p-3 hover:shadow-md hover:border-[#D6A500]/30 transition-all cursor-pointer group">
                <div className="grid gap-4 md:grid-cols-[9rem_minmax(0,1.5fr)_minmax(10rem,1fr)_8rem] md:items-center">
                <div className="relative h-28 overflow-hidden rounded-md bg-[#EFEFE9]">
                  <img src={t.image || `/inspirq-media/badminton.png`}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { (e.target as HTMLImageElement).src = "/inspirq-media/badminton.png"; }} />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 text-[#151713] text-xs font-bold px-2 py-0.5 rounded-full">
                      {sportIcons[t.sport] || "🏟"} {t.sport}
                    </span>
                  </div>
                  <button onClick={e => toggleFav(t.id, e)} className="absolute top-3 right-3 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <Heart size={13} className={favs.has(t.id) ? "text-red-500 fill-red-500" : "text-[#7D8178]"} />
                  </button>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-[#151713] text-sm group-hover:text-[#755900]">{t.name}</h3>
                    <Badge text={t.status.replace("_", " ")} color={statusColor} />
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-[#5F635C]">
                    by {t.organizer}
                    {t.organizerVerified && <span className="inline-flex items-center gap-1 text-[#755900] font-semibold"><Shield size={10} /> Verified · {t.organizerRating}</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="bg-[#F7F7F3] text-[#464A45] text-xs px-2 py-1 rounded-md">{t.format || "Knockout"}</span>
                    <span className="bg-[#F7F7F3] text-[#464A45] text-xs px-2 py-1 rounded-md">{t.level || "Open"}</span>
                    {(t.categories || []).slice(0, 2).map(category => <span key={category} className="bg-[#FFF9D6] text-[#755900] text-xs px-2 py-1 rounded-md">{category}</span>)}
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-[#5F635C]">
                  <div className="flex items-center gap-1.5"><Calendar size={11} className="text-[#755900]" />{new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                  <div className="flex items-center gap-1.5"><MapPin size={11} className="text-[#755900]" />{t.venue}</div>
                  <div className="flex items-center gap-1.5"><Users size={11} className="text-[#755900]" />{t.filled}/{t.slots} registered · {pct}%</div>
                  <div className="text-xs text-[#7D8178]">Registration closes {t.registrationDeadline || "before event"}</div>
                </div>
                <div className="md:text-right">
                  <div className="font-bold text-[#755900]">{t.prize}</div>
                  <div className="text-xs text-[#5F635C]">Prize pool</div>
                  <div className="mt-2 font-bold text-[#151713]">₹{t.fee}<span className="font-normal text-xs text-[#7D8178]"> entry</span></div>
                  <div className="mt-2 text-xs font-bold text-[#755900] group-hover:underline">View & register →</div>
                </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#7D8178]">
            <div className="w-16 h-16 bg-[#EFEFE9] rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy size={24} className="text-[#A5A89E]" />
            </div>
            <p className="font-semibold text-[#5F635C] mb-1">No tournaments match your filters</p>
            <button onClick={clearFilters} className="mt-3 text-[#755900] text-sm font-semibold hover:underline">Clear filters</button>
          </div>
        )}
      </div>

      <BrowseFooter onNavigate={onNavigate} />

      <FilterDrawer open={showFilter} onClose={() => setShowFilter(false)} title="Filter Tournaments" onApply={() => setShowFilter(false)}>
        <FSec label="Sport">
          <Chips options={["All", "Badminton", "Football", "Tennis", "Cricket", "Basketball", "Squash"]} value={fSport} onChange={setFSport} />
        </FSec>
        <FSec label="Max Entry Fee">
          <input type="range" min={100} max={5000} step={100} value={fMaxFee} onChange={e => setFMaxFee(Number(e.target.value))} className="w-full accent-[#D6A500]" />
          <div className="flex justify-between text-xs text-[#7D8178] mt-2">
            <span>₹100</span>
            <span className="font-semibold text-[#755900]">up to ₹{fMaxFee.toLocaleString()}</span>
            <span>₹5K</span>
          </div>
        </FSec>
        <FSec label="Status">
          <Chips options={["all", "open", "full"]} value={fStatus} onChange={setFStatus} />
        </FSec>
      </FilterDrawer>
    </div>
  );
}

function TournamentCardMinimal({ tournament: t, onNavigate, isFav, onToggleFav }: {
  tournament: TournamentItem;
  onNavigate: (p: Page, ctx?: any) => void;
  isFav: boolean;
  onToggleFav: (event: MouseEvent) => void;
}) {
  const placesLeft = Math.max(0, t.slots - t.filled);
  return (
    <div onClick={() => onNavigate("tournament-detail", t)}
      className="group cursor-pointer overflow-hidden rounded-md border border-[#DFE0D8] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-44 overflow-hidden bg-[#EFEFE9]">
        <img src={t.image} alt={t.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2 py-0.5 text-xs font-bold text-[#151713]">{t.sport}</span>
        <button onClick={onToggleFav} className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-white/90">
          <Heart size={13} className={isFav ? "fill-red-500 text-red-500" : "text-[#7D8178]"} />
        </button>
        <span className="absolute bottom-3 right-3 rounded-full bg-[#FFF9D6] px-2 py-0.5 text-xs font-bold text-[#755900]">{placesLeft ? `${placesLeft} places left` : "Full"}</span>
      </div>
      <div className="p-4">
        <div className="mb-1 text-sm font-semibold text-[#151713] transition-colors group-hover:text-[#755900]">{t.name}</div>
        <div className="mb-3 text-xs text-[#5F635C]">by {t.organizer}</div>
        <div className="space-y-1.5 text-xs text-[#5F635C]">
          <div className="flex items-center gap-1.5"><Calendar size={11} className="text-[#755900]" />{new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
          <div className="flex items-center gap-1.5"><MapPin size={11} className="text-[#755900]" />{t.venue}</div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-[#EFEFE9] pt-3">
          <div><span className="text-lg font-bold text-[#151713]">₹{t.fee.toLocaleString()}</span><span className="text-xs text-[#7D8178]"> entry</span></div>
          <button onClick={event => { event.stopPropagation(); onNavigate("tournament-detail", t); }} className="rounded-md bg-[#FFC400] px-4 py-2 text-xs font-bold text-[#17140A]">Register</button>
        </div>
      </div>
    </div>
  );
}

// ─── Player Games (kept but hidden from nav) ───────────────────────────────────

export function PlayerGames({ games, onNavigate, isGuest, onJoinGame }: { games: GameItem[]; onNavigate: (p: Page, ctx?: any) => void; isGuest?: boolean; onJoinGame?: (id: number) => void; }) {
  return (
    <div className="min-h-full bg-[#F7F7F3]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 text-center">
        <div className="w-16 h-16 bg-[#EFEFE9] rounded-full flex items-center justify-center mx-auto mb-4">
          <Users size={24} className="text-[#A5A89E]" />
        </div>
        <h2 className="text-xl font-bold text-[#151713] mb-2">Open Games</h2>
        <p className="text-sm text-[#5F635C] mb-6">Find and join open games from the player dashboard.</p>
        <button onClick={() => onNavigate("player-home")} className="bg-[#FFC400] text-[#17140A] px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-[#D9A900] transition-colors">
          Go to Dashboard
        </button>
      </div>
      <BrowseFooter onNavigate={onNavigate} />
    </div>
  );
}

// ─── Player Training (Coaches) ─────────────────────────────────────────────────

export function PlayerTraining({ trainers, onNavigate, isGuest }: { trainers: TrainerItem[]; onNavigate: (p: Page, ctx?: any) => void; isGuest?: boolean }) {
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [fSport, setFSport] = useState("All");
  const [fMaxFee, setFMaxFee] = useState(2000);
  const [fRating, setFRating] = useState(0);
  const [fVerified, setFVerified] = useState(false);
  const [fSort, setFSort] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favs, setFavs] = useState<Set<number>>(new Set());
  const [publishedSessions] = useState<CoachSessionItem[]>(() => {
    try {
      const stored = window.localStorage.getItem(COACH_SESSIONS_STORAGE_KEY);
      const sessions: CoachSessionItem[] = stored ? JSON.parse(stored) : COACH_SESSIONS;
      return sessions.filter((session) => session.published && session.status === "upcoming");
    } catch {
      return COACH_SESSIONS.filter((session) => session.published && session.status === "upcoming");
    }
  });
  const toggleFav = (id: number, e: MouseEvent) => { e.stopPropagation(); setFavs(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; }); };

  const EXTRA_TRAINERS: TrainerItem[] = [
    { id: 4, name: "Coach Meera Pillai", sport: "Cricket", experience: "5 years", rating: 4.6, students: 28, fee: 900, location: "Whitefield, Bangalore", cert: "BCCI Level 1", image: "/inspirq-media/coach-avatar.svg", verified: true, bio: "BCCI certified cricket coach.", specializations: ["Batting", "Fielding"], listingStatus: "active", published: true },
    { id: 5, name: "Coach Dev Anand", sport: "Basketball", experience: "7 years", rating: 4.5, students: 35, fee: 1100, location: "HSR Layout, Bangalore", cert: "BAI Certified", image: "/inspirq-media/coach-avatar.svg", verified: false, bio: "BAI certified basketball coach.", specializations: ["Shooting", "Defense"], listingStatus: "active", published: true },
    { id: 6, name: "Coach Lakshmi V.", sport: "Badminton", experience: "12 years", rating: 5.0, students: 62, fee: 1800, location: "Jayanagar, Bangalore", cert: "BWF Level 3", image: "/inspirq-media/coach-avatar.svg", verified: true, bio: "BWF Level 3 master coach.", specializations: ["All Strokes", "Tournament Prep"], listingStatus: "active", published: true },
  ];
  const allTrainers = [...trainers, ...EXTRA_TRAINERS];

  const sportIcons: Record<string, string> = { Badminton: "🏸", Tennis: "🎾", Football: "⚽", Cricket: "🏏", Basketball: "🏀" };

  const activeFilters = (fSport !== "All" ? 1 : 0) + (fRating > 0 ? 1 : 0) + (fMaxFee < 2000 ? 1 : 0) + (fVerified ? 1 : 0);
  const clearFilters = () => { setFSport("All"); setFRating(0); setFMaxFee(2000); setFVerified(false); };

  let filtered = allTrainers.filter(t =>
    (fSport === "All" || t.sport === fSport) &&
    t.fee <= fMaxFee && t.rating >= fRating &&
    (!fVerified || t.verified) &&
    (search === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.sport.toLowerCase().includes(search.toLowerCase()))
  );
  filtered = [...filtered].sort((a, b) =>
    fSort === "rating" ? b.rating - a.rating : fSort === "fee_asc" ? a.fee - b.fee : fSort === "fee_desc" ? b.fee - a.fee : b.students - a.students
  );

  return (
    <div className="min-h-full bg-[#F7F7F3]">
      <BrowsePageHeader
        title="Find Coaches"
        description="Find verified coaches by sport, experience, training mode, rating, and session price."
        count={filtered.length}
        countLabel="coaches available"
        search={search}
        onSearch={setSearch}
        onFilter={() => setShowFilter(true)}
        activeFilters={activeFilters}
        onClear={clearFilters}
        viewMode={viewMode}
        onViewMode={setViewMode}
        sortValue={fSort}
        onSort={setFSort}
        sortOptions={[
          { value: "rating", label: "Top Rated" },
          { value: "fee_asc", label: "Fee: Low → High" },
          { value: "fee_desc", label: "Fee: High → Low" },
          { value: "students", label: "Most Students" },
        ]}
        sportValue={fSport}
        onSport={setFSport}
        sportOptions={["All", "Badminton", "Tennis", "Football", "Cricket", "Basketball"]}
        fVerified={fVerified}
        onVerified={() => setFVerified(v => !v)}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6">
        {publishedSessions.length > 0 && (
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-lg font-bold text-[#151713]">Book an upcoming session</div>
                <div className="mt-1 text-sm text-[#5F635C]">Published directly by coaches with live capacity and pricing.</div>
              </div>
              <Badge text={`${publishedSessions.length} available`} color="success" />
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {publishedSessions.map((session) => (
                <div key={session.id} className="flex flex-col gap-4 rounded-md border border-[#DFE0D8] bg-white p-4 sm:flex-row sm:items-center">
                  <img src={session.image} alt={session.name} className="h-24 w-full rounded-md object-cover sm:size-24" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><div className="font-bold text-[#151713]">{session.name}</div><Badge text={session.level} color="blue" /></div>
                    <div className="mt-1 text-xs text-[#5F635C]">{session.sport} · {session.venue}</div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#464A45]"><span>{session.date}</span><span>{session.time}</span><span>{session.enrolled}/{session.maxStudents} booked</span></div>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <div className="font-bold text-[#151713]">₹{session.price.toLocaleString()}<span className="text-xs font-normal text-[#7D8178]">/person</span></div>
                    <Button size="sm" disabled={session.enrolled >= session.maxStudents} onClick={() => onNavigate("checkout", { type: "training", item: session, backTo: "player-training" })}>{session.enrolled >= session.maxStudents ? "Full" : "Book session"}</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-3"}>
          {filtered.map(t => (
            viewMode === "grid" ? (
              <CoachCardMinimal key={t.id} t={t} onNavigate={onNavigate} sportIcons={sportIcons} isFav={favs.has(t.id)} onToggleFav={(event) => toggleFav(t.id, event)} />
            ) : (
            <div key={t.id} onClick={() => onNavigate("coach-detail", t)}
              className="grid gap-4 bg-white border border-[#DFE0D8] rounded-md p-3 cursor-pointer hover:border-[#D6A500]/30 hover:shadow-md transition-all md:grid-cols-[5rem_minmax(0,1.4fr)_minmax(12rem,1fr)_8rem] md:items-center">
              <div className="relative">
                <img src={t.image} alt={t.name} className="size-20 rounded-md object-cover object-top" />
                {t.verified && <span className="absolute -bottom-1 -right-1 bg-[#FFC400] text-[#17140A] rounded-full p-1"><Shield size={10} /></span>}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[#151713]">{t.name}</span>
                  <span className="bg-[#FFF9D6] text-[#755900] text-xs font-semibold px-2 py-0.5 rounded-full">{sportIcons[t.sport]} {t.sport}</span>
                  {t.trialAvailable && <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">Trial available</span>}
                </div>
                <div className="mt-1 text-xs text-[#5F635C]">{t.cert} · {t.experience} · {t.homeVenue || t.location}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">{t.specializations.slice(0, 3).map(item => <span key={item} className="bg-[#F7F7F3] text-[#464A45] text-xs px-2 py-1 rounded-md">{item}</span>)}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div><div className="text-[#7D8178]">Levels</div><div className="font-medium text-[#222520]">{(t.levels || ["All levels"]).slice(0, 2).join(", ")}</div></div>
                <div><div className="text-[#7D8178]">Modes</div><div className="font-medium text-[#222520]">{(t.coachingModes || ["Private"]).join(", ")}</div></div>
                <div><div className="text-[#7D8178]">Languages</div><div className="font-medium text-[#222520]">{(t.languages || ["English"]).slice(0, 2).join(", ")}</div></div>
                <div><div className="text-[#7D8178]">Response</div><div className="font-medium text-[#222520]">{t.responseTime || "< 4 hours"}</div></div>
              </div>
              <div className="md:text-right">
                <div className="flex items-center md:justify-end gap-1"><Star size={12} className="text-yellow-400 fill-yellow-400" /><span className="font-bold">{t.rating}</span><span className="text-xs text-[#7D8178]">({t.reviewCount || t.students})</span></div>
                <div className="mt-2 font-bold text-[#151713]">₹{t.fee.toLocaleString()}<span className="font-normal text-xs text-[#7D8178]">/session</span></div>
                <div className="mt-2 text-xs font-bold text-[#755900]">View profile →</div>
              </div>
            </div>
            )
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#7D8178]">
            <div className="w-16 h-16 bg-[#EFEFE9] rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={24} className="text-[#A5A89E]" />
            </div>
            <p className="font-semibold text-[#5F635C] mb-1">No coaches match your filters</p>
            <button onClick={clearFilters} className="mt-3 text-[#755900] text-sm font-semibold hover:underline">Clear filters</button>
          </div>
        )}
      </div>

      <BrowseFooter onNavigate={onNavigate} />

      <FilterDrawer open={showFilter} onClose={() => setShowFilter(false)} title="Filter Coaches" onApply={() => setShowFilter(false)}>
        <FSec label="Sport">
          <Chips options={["All", "Badminton", "Tennis", "Football", "Cricket", "Basketball"]} value={fSport} onChange={setFSport} />
        </FSec>
        <FSec label="Max Fee / Session">
          <input type="range" min={300} max={2000} step={100} value={fMaxFee} onChange={e => setFMaxFee(Number(e.target.value))} className="w-full accent-[#D6A500]" />
          <div className="flex justify-between text-xs text-[#7D8178] mt-2">
            <span>₹300</span>
            <span className="font-semibold text-[#755900]">up to ₹{fMaxFee.toLocaleString()}</span>
            <span>₹2K</span>
          </div>
        </FSec>
        <FSec label="Minimum Rating">
          <Chips options={["Any", "4.0+", "4.5+", "4.8+"]} value={fRating === 0 ? "Any" : `${fRating}+`} onChange={v => setFRating(v === "Any" ? 0 : parseFloat(v))} />
        </FSec>
        <FSec label="Other">
          <button onClick={() => setFVerified(v => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-all ${fVerified ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "border-[#DFE0D8] text-[#464A45]"}`}>
            <Shield size={14} /> Verified Coaches Only
          </button>
        </FSec>
      </FilterDrawer>
    </div>
  );
}

// ─── Coach card (minimalist) ───────────────────────────────────────────────────

function CoachCardMinimal({ t, onNavigate, sportIcons, isFav, onToggleFav }: {
  t: TrainerItem; onNavigate: (p: Page, ctx?: any) => void;
  sportIcons: Record<string, string>; isFav?: boolean; onToggleFav?: (e: MouseEvent) => void;
}) {
  return (
    <div onClick={() => onNavigate("coach-detail", t)}
      className="bg-white rounded-md border border-[#DFE0D8] overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
      {/* Photo */}
      <div className="relative h-48 overflow-hidden bg-[#EFEFE9]">
        <img src={t.image} alt={t.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).src = "/inspirq-media/coach-avatar.svg"; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Verified badge */}
        {t.verified && (
          <div className="absolute top-3 left-3">
            <span className="bg-[#FFC400] text-[#17140A] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Shield size={8} /> Verified
            </span>
          </div>
        )}
        {/* Fav */}
        <button
          aria-label={isFav ? `Remove ${t.name} from favorites` : `Add ${t.name} to favorites`}
          aria-pressed={isFav}
          onClick={onToggleFav}
          className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-colors hover:bg-white"
        >
          <Heart size={13} className={isFav ? "text-red-500 fill-red-500" : "text-[#7D8178]"} />
        </button>
        {/* Name + rating overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="font-bold text-white text-sm leading-tight">{t.name}</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-semibold">{t.rating}</span>
            <span className="text-white/70 text-xs">· {t.students} students</span>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1 bg-[#FFF9D6] text-[#755900] text-xs font-semibold px-2.5 py-1 rounded-full">
            {sportIcons[t.sport] || ""} {t.sport}
          </span>
          <div className="text-right">
            <span className="text-base font-bold text-[#151713]">₹{t.fee.toLocaleString()}</span>
            <span className="text-xs text-[#7D8178]">/session</span>
          </div>
        </div>
        <div className="space-y-1.5 text-xs text-[#5F635C] mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin size={10} className="text-[#755900] shrink-0" />{t.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Award size={10} className="text-[#755900] shrink-0" />{t.cert} · {t.experience}
          </div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onNavigate("coach-detail", t); }}
          className="w-full py-2.5 bg-[#FFF9D6] text-[#755900] text-xs font-bold rounded-md hover:bg-[#FFC400] hover:text-[#17140A] group-hover:bg-[#FFC400] group-hover:text-[#17140A] transition-colors">
          View Profile &amp; Book
        </button>
      </div>
    </div>
  );
}
