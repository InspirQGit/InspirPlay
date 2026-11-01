import { useState } from "react";
import {
  ArrowLeft, MapPin, Star, Shield, Heart, Share2, Clock, Users, Calendar,
  CheckCircle, CreditCard, ChevronLeft, ChevronRight, Award, Wifi,
  Car, Coffee, Dumbbell, Droplets, Zap as ZapIcon, ChevronDown,
  Trophy, Info, Phone, MessageCircle, Send, ThumbsUp,
  Flame, PlayCircle, X
} from "lucide-react";
import type { Page, TournamentItem } from "../data";
import { VENUES, TRAINERS } from "../data";

// ─── Login Wall ────────────────────────────────────────────────────────────────
function LoginWall({ icon, title, body, onNavigate, onClose }: {
  icon: React.ReactNode; title: string; body: string;
  onNavigate: (p: Page) => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl relative">
        <button aria-label="Close sign-in prompt" onClick={onClose} className="absolute top-3 right-3 p-1.5 hover:bg-[#DFE0D8] rounded-full"><X size={15} className="text-[#7D8178]" /></button>
        <div className="w-14 h-14 bg-[#FFC400]/10 rounded-2xl flex items-center justify-center mx-auto">{icon}</div>
        <h3 className="text-lg font-bold text-[#181A1F]">{title}</h3>
        <p className="text-sm text-[#5F635C]">{body}</p>
        <button onClick={() => onNavigate("auth")} className="w-full bg-[#FFC400] text-[#17140A] py-3 rounded-xl font-semibold text-sm hover:bg-[#D9A900]">Sign Up Free</button>
        <button onClick={() => onNavigate("auth")} className="w-full border border-[#C9CBC2] text-[#30342F] py-3 rounded-xl font-medium text-sm hover:bg-[#F7F7F3]">Log In</button>
        <button onClick={onClose} className="text-xs text-[#7D8178] hover:text-[#464A45]">Continue browsing</button>
      </div>
    </div>
  );
}

// ─── Ecommerce Image Grid ──────────────────────────────────────────────────────
function ImageGrid({ images, alt }: { images: string[]; alt: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const shown = images.slice(0, 5);
  const fallback = "/inspirq-media/football.png";
  return (
    <div className="relative">
      <div className="grid grid-cols-4 grid-rows-2 gap-1 h-60 md:h-80 overflow-hidden md:rounded-xl">
        <div className="col-span-2 row-span-2 relative cursor-pointer" onClick={() => setLightbox(0)}>
          <img src={shown[0] || fallback} alt={alt}
            className="w-full h-full object-cover hover:brightness-95 transition-all"
            onError={e => { (e.target as HTMLImageElement).src = fallback; }} />
        </div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="relative cursor-pointer" onClick={() => setLightbox(i)}>
            {shown[i] ? (
              <img src={shown[i]} alt={`${alt} ${i + 1}`}
                className="w-full h-full object-cover hover:brightness-95 transition-all"
                onError={e => { (e.target as HTMLImageElement).src = fallback; }} />
            ) : (
              <div className="w-full h-full bg-[#EFEFE9]" />
            )}
            {i === 4 && images.length >= 5 && (
              <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1 cursor-pointer">
                <span className="text-white text-xl font-black">+{images.length - 4}</span>
                <span className="text-white/80 text-xs font-semibold uppercase tracking-wide">more</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button aria-label="Close image gallery" onClick={() => setLightbox(null)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full"><X size={20} className="text-white" /></button>
          <button aria-label="Show previous image" onClick={() => setLightbox(l => Math.max(0, (l ?? 0) - 1))} className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full"><ChevronLeft size={20} className="text-white" /></button>
          <img src={images[lightbox] || fallback} alt={`${alt} ${lightbox + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
            onError={e => { (e.target as HTMLImageElement).src = fallback; }} />
          <button aria-label="Show next image" onClick={() => setLightbox(l => Math.min(images.length - 1, (l ?? 0) + 1))} className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full"><ChevronRight size={20} className="text-white" /></button>
          <div className="absolute bottom-4 text-white/60 text-sm">{lightbox + 1} / {images.length}</div>
        </div>
      )}
    </div>
  );
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
interface Review { name: string; rating: number; date: string; text: string; avatar: string; verified?: boolean; helpfulCount?: number; }
const BASE_REVIEWS: Review[] = [
  { name: "Rohit S.", rating: 5, date: "Jul 8, 2026", avatar: "RS", verified: true, helpfulCount: 14, text: "Absolutely world-class! Everything was as described and the booking was seamless through InspirQ." },
  { name: "Priya M.", rating: 4, date: "Jun 28, 2026", avatar: "PM", verified: true, helpfulCount: 8, text: "Great experience overall. Amenities are top-notch, easy parking, and very clean. Highly recommended." },
  { name: "Dev A.", rating: 5, date: "Jun 20, 2026", avatar: "DA", verified: false, helpfulCount: 5, text: "Best in the area, no doubt. Instant booking confirmation and the slot was exactly as described." },
];

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button key={i} aria-label={`Rate ${i} out of 5 stars`} aria-pressed={value === i} type="button" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(0)} onClick={() => onChange(i)} className="hover:scale-110 transition-transform">
          <Star size={22} className={(hovered || value) >= i ? "text-yellow-400 fill-yellow-400" : "text-[#C9CBC2] fill-[#C9CBC2]"} />
        </button>
      ))}
    </div>
  );
}

function ReviewsSection({ context }: { context: string }) {
  const [reviews, setReviews] = useState<Review[]>(BASE_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 0, text: "" });
  const [submitted, setSubmitted] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState<Set<number>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? reviews : reviews.slice(0, 3);
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  const handleSubmit = () => {
    if (!form.name.trim() || form.rating === 0 || form.text.trim().length < 10) return;
    setReviews(prev => [{ name: form.name, rating: form.rating, text: form.text, avatar: form.name.slice(0, 2).toUpperCase(), date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }), verified: false, helpfulCount: 0 }, ...prev]);
    setForm({ name: "", rating: 0, text: "" }); setShowForm(false); setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-[#F7F7F3] rounded-xl">
        <div className="text-center shrink-0">
          <div className="text-4xl font-black text-[#181A1F]">{avg}</div>
          <div className="flex justify-center mt-1">{[1,2,3,4,5].map(i => <Star key={i} size={12} className={parseFloat(avg) >= i ? "text-yellow-400 fill-yellow-400" : "text-[#C9CBC2]"} />)}</div>
          <div className="text-xs text-[#5F635C] mt-1">{reviews.length} reviews</div>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5,4,3,2,1].map(n => { const c = reviews.filter(r => r.rating === n).length; return (
            <div key={n} className="flex items-center gap-2">
              <span className="text-xs text-[#5F635C] w-4">{n}</span>
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              <div className="flex-1 h-1.5 bg-[#C9CBC2] rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: `${reviews.length ? (c / reviews.length) * 100 : 0}%` }} /></div>
              <span className="text-xs text-[#7D8178] w-4">{c}</span>
            </div>
          ); })}
        </div>
      </div>

      <button onClick={() => setShowForm(v => !v)}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-[#D6A500] text-[#755900] rounded-lg font-semibold text-sm hover:bg-[#FFC400]/5 transition-colors">
        <Star size={14} className="fill-[#FFC400]" /> Write a Review
      </button>

      {submitted && <div className="flex items-center gap-2 bg-sky-50 text-sky-700 text-sm font-medium px-4 py-2.5 rounded-lg"><CheckCircle size={15} /> Review posted. Thank you!</div>}

      {showForm && (
        <div className="bg-white border border-[#D6A500]/30 rounded-xl p-4 space-y-4">
          <h4 className="font-bold text-[#181A1F] text-sm">Your experience at {context}</h4>
          <div><label className="text-xs font-semibold text-[#464A45] mb-1 block">Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="E.g. Arjun M." className="w-full bg-[#F7F7F3] border border-[#C9CBC2] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#D6A500]" /></div>
          <div><label className="text-xs font-semibold text-[#464A45] mb-1 block">Rating</label><StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} /></div>
          <div><label className="text-xs font-semibold text-[#464A45] mb-1 block">Review</label>
            <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} rows={3} placeholder="What was your experience?" className="w-full bg-[#F7F7F3] border border-[#C9CBC2] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#D6A500] resize-none" /></div>
          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-[#C9CBC2] rounded-lg text-sm font-semibold text-[#30342F]">Cancel</button>
            <button aria-label="Send" onClick={handleSubmit} disabled={!form.name.trim() || form.rating === 0 || form.text.length < 10}
              className="flex-1 py-2.5 bg-[#FFC400] text-[#17140A] rounded-lg text-sm font-bold disabled:opacity-40 flex items-center justify-center gap-1.5"><Send size={13} />Post</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {visible.map((r, idx) => (
          <div key={idx} className="border border-[#C9CBC2] rounded-xl p-4">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-9 h-9 bg-[#FFC400]/10 rounded-full flex items-center justify-center text-[#755900] font-bold text-xs shrink-0">{r.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#181A1F]">{r.name}</span>
                  {r.verified && <span className="text-xs bg-sky-50 text-sky-600 font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><CheckCircle size={8} />Verified</span>}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={10} className="text-yellow-400 fill-yellow-400" />)}</div>
                  <span className="text-xs text-[#7D8178]">{r.date}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-[#464A45] leading-relaxed">{r.text}</p>
            <button onClick={() => setHelpfulClicked(s => { const ns = new Set(s); ns.has(idx) ? ns.delete(idx) : ns.add(idx); return ns; })}
              className={`mt-2.5 flex items-center gap-1.5 text-xs font-medium transition-colors ${helpfulClicked.has(idx) ? "text-[#755900]" : "text-[#7D8178] hover:text-[#464A45]"}`}>
              <ThumbsUp size={11} /> Helpful {(r.helpfulCount || 0) + (helpfulClicked.has(idx) ? 1 : 0)}
            </button>
          </div>
        ))}
      </div>
      {reviews.length > 3 && !showAll && (
        <button onClick={() => setShowAll(true)} className="w-full py-2.5 border border-[#C9CBC2] rounded-lg text-sm font-semibold text-[#30342F] hover:bg-[#F7F7F3] flex items-center justify-center gap-2">
          View all {reviews.length} reviews <ChevronDown size={14} />
        </button>
      )}
    </div>
  );
}

// ─── Venue Detail Page ─────────────────────────────────────────────────────────
export function VenueDetailPage({ venue, onBack, isGuest, onNavigate, isFav: isFavProp, onToggleFav }: {
  venue: typeof VENUES[0]; onBack: () => void; isGuest?: boolean; onNavigate: (p: Page) => void;
  isFav?: boolean; onToggleFav?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"about" | "amenities" | "reviews">("about");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [duration, setDuration] = useState(1);
  const [booked, setBooked] = useState(false);
  const fav = isFavProp ?? false;

  const today = new Date("2026-07-13");
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const firstDow = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const monthName = new Date(calYear, calMonth).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const calCells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (calCells.length % 7 !== 0) calCells.push(null);
  const isPast = (d: number) => new Date(calYear, calMonth, d) < today;
  const bookingTotal = venue.price * duration;

  const amenityIcons: Record<string, any> = { "AC": Wifi, "Parking": Car, "Café": Coffee, "Gym": Dumbbell, "Shower": Droplets, "Restroom": Droplets, "Changing Room": Droplets, "Floodlights": ZapIcon };
  const GALLERY = [venue.image,
    "/inspirq-media/badminton.png",
    "/inspirq-media/football.png",
    "/inspirq-media/tennis.png",
    "/inspirq-media/football.png",
  ];

  const handleBook = () => {
    if (isGuest) { setShowLoginPrompt(true); return; }
    if (!selectedSlot) return;
    setBooked(true);
    onNavigate("player-bookings");
  };

  return (
    <div className="min-h-screen bg-[#F7F7F3]">
      <div className="sticky top-0 z-30 bg-[#F7F7F3]/95 backdrop-blur-md border-b border-[#DFE0D8]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 h-14 flex items-center gap-3">
          <button aria-label="Go back" onClick={onBack} className="p-2 hover:bg-white/60 rounded-lg transition-colors"><ArrowLeft size={18} className="text-[#222520]" /></button>
          <nav className="flex items-center gap-1.5 text-xs text-[#7D8178] flex-1 min-w-0">
            <button onClick={onBack} className="hover:text-[#755900] transition-colors truncate font-medium">Find Arenas</button>
            <ChevronRight size={10} className="text-[#A5A89E] shrink-0" />
            <span className="text-[#151713] font-semibold truncate">{venue.name}</span>
          </nav>
          <button aria-label="Share" className="p-2 hover:bg-white/60 rounded-lg transition-colors"><Share2 size={16} className="text-[#5F635C]" /></button>
          <button onClick={() => onToggleFav?.()} className="p-2 hover:bg-white/60 rounded-lg transition-colors">
            <Heart size={16} className={fav ? "text-red-500 fill-red-500" : "text-[#7D8178]"} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5">
        <ImageGrid images={GALLERY} alt={venue.name} />

        <div className="mt-5 lg:grid lg:grid-cols-[1fr_360px] lg:gap-8 items-start">
          {/* LEFT */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-[#C9CBC2] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-[#181A1F]">{venue.name}</h1>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-[#5F635C]"><MapPin size={13} className="text-[#755900]" />{venue.location}</div>
                </div>
                {venue.verified && (
                  <span className="shrink-0 flex items-center gap-1 bg-sky-50 text-sky-700 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-sky-100">
                    <Shield size={10} />Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 flex-wrap mt-3">
                <div className="flex items-center gap-1"><Star size={14} className="text-yellow-400 fill-yellow-400" /><span className="font-bold text-[#181A1F] text-sm">4.7</span><span className="text-[#7D8178] text-xs ml-0.5">({venue.reviews})</span></div>
                <span className="text-[#C9CBC2]">·</span>
                <span className="text-xs font-semibold text-[#755900] bg-[#FFC400]/10 px-2 py-0.5 rounded-full">{venue.sport}</span>
                <span className="text-xs text-orange-500 flex items-center gap-1"><Flame size={11} />Booked 24× today</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[
                  { icon: <ZapIcon size={14} className="text-amber-500" />, label: "Instant Confirm", bg: "bg-amber-50" },
                  { icon: <Shield size={14} className="text-sky-600" />, label: "Free Cancel 4h", bg: "bg-sky-50" },
                  { icon: <Trophy size={14} className="text-purple-600" />, label: "Top Rated", bg: "bg-purple-50" },
                ].map(c => (
                  <div key={c.label} className={`${c.bg} rounded-lg p-2.5 flex items-center gap-2`}>
                    {c.icon}<span className="text-xs font-semibold text-[#30342F]">{c.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {venue.amenities.map(a => {
                  const AmenityIcon = amenityIcons[a];
                  return (
                    <span key={a} className="flex items-center gap-1 bg-[#F7F7F3] border border-[#C9CBC2] text-[#464A45] text-xs px-2.5 py-1 rounded-full font-medium">
                      {AmenityIcon ? <AmenityIcon size={10} className="text-[#755900]" /> : null}{a}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#C9CBC2] overflow-hidden">
              <div className="flex border-b border-[#DFE0D8]">
                {(["about", "amenities", "reviews"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? "text-[#755900] border-b-2 border-[#D6A500] bg-[#FFC400]/5" : "text-[#5F635C] hover:text-[#30342F]"}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-5">
                {activeTab === "about" && (
                  <div className="space-y-4">
                    <p className="text-sm text-[#464A45] leading-relaxed">
                      {venue.name} is one of Bangalore&apos;s most sought-after {venue.sport.toLowerCase()} venues in {venue.location.split(",")[0]}. Featuring {venue.amenities.join(", ").toLowerCase()} — everything you need for a world-class session.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: "Sport", value: venue.sport },
                        { label: "Price", value: `₹${venue.price}/hr` },
                        { label: "Opens At", value: "6:00 AM" },
                        { label: "Closes At", value: "10:00 PM" },
                        { label: "Best Time", value: "6–8 AM / 6–8 PM" },
                        { label: "Owner", value: venue.owner },
                      ].map(info => (
                        <div key={info.label} className="bg-[#F7F7F3] rounded-lg p-3 border border-[#DFE0D8]">
                          <div className="text-xs text-[#7D8178] mb-0.5 uppercase tracking-wide">{info.label}</div>
                          <div className="text-sm font-semibold text-[#181A1F]">{info.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-[#FFC400]/5 border border-[#D6A500]/20 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-[#181A1F] mb-2 flex items-center gap-2"><Info size={13} className="text-[#755900]" />Booking Policy</h4>
                      <ul className="text-xs text-[#464A45] space-y-1.5">
                        {["Arrive 10 minutes before your slot", "Free cancellation up to 4 hours before", "ID proof required on first visit", "Non-marking shoes mandatory"].map(p => (
                          <li key={p} className="flex items-start gap-2"><CheckCircle size={10} className="text-[#755900] mt-0.5 shrink-0" />{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#C9CBC2] rounded-lg text-sm font-semibold text-[#30342F] hover:bg-[#F7F7F3]"><Phone size={14} />Call Venue</button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#C9CBC2] rounded-lg text-sm font-semibold text-[#30342F] hover:bg-[#F7F7F3]"><MapPin size={14} />Get Directions</button>
                    </div>
                  </div>
                )}
                {activeTab === "amenities" && (
                  <div className="grid grid-cols-2 gap-3">
                    {[...venue.amenities, "Drinking Water", "First Aid", "Wi-Fi", "CCTV Security"].map(a => {
                      const Icon = amenityIcons[a] || CheckCircle;
                      return (
                        <div key={a} className="flex items-center gap-3 p-3 bg-[#F7F7F3] rounded-lg border border-[#DFE0D8]">
                          <Icon size={15} className="text-[#755900] shrink-0" />
                          <span className="text-sm font-medium text-[#30342F]">{a}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {activeTab === "reviews" && <ReviewsSection context={venue.name} />}
              </div>
            </div>
          </div>

          {/* RIGHT: Booking widget */}
          <div className="mt-5 lg:mt-0 lg:order-last">
            <div className="sticky top-[72px] bg-white border border-[#DFE0D8] rounded-xl shadow-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-[#DFE0D8]">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#181A1F]">₹{venue.price}</span>
                  <span className="text-[#7D8178] text-sm">/hour</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5"><Star size={12} className="text-yellow-400 fill-yellow-400" /><span className="text-xs font-semibold text-[#30342F]">4.7</span><span className="text-xs text-[#7D8178]">· {venue.reviews} reviews</span></div>
              </div>
              <div className="p-4 space-y-4">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); } else setCalMonth(m => m-1); }} className="p-1 hover:bg-[#DFE0D8] rounded"><ChevronLeft size={14} /></button>
                    <span className="text-xs font-bold text-[#181A1F]">{monthName}</span>
                    <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); } else setCalMonth(m => m+1); }} className="p-1 hover:bg-[#DFE0D8] rounded"><ChevronRight size={14} /></button>
                  </div>
                  <div className="grid grid-cols-7 text-center">
                    {["S","M","T","W","T","F","S"].map((d, i) => <div key={i} className="text-xs font-bold text-[#7D8178] pb-1">{d}</div>)}
                    {calCells.map((day, i) => (
                      <button key={i} onClick={() => { if (day && !isPast(day)) { setSelectedDay(day); setSelectedSlot(null); } }}
                        disabled={!day || isPast(day)}
                        className={`aspect-square text-xs rounded-full m-px transition-all font-medium
                          ${!day ? "invisible" : ""}
                          ${day && isPast(day) ? "text-[#C9CBC2] cursor-not-allowed" : ""}
                          ${day && !isPast(day) && selectedDay !== day ? "hover:bg-[#FFC400]/10 text-[#30342F]" : ""}
                          ${day && selectedDay === day ? "bg-[#FFC400] text-[#17140A] font-bold" : ""}
                          ${day === today.getDate() && calMonth === today.getMonth() && selectedDay !== day ? "ring-1 ring-[#D6A500] text-[#755900]" : ""}`}>
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Duration */}
                <div>
                  <p className="text-xs font-bold text-[#30342F] mb-2">Duration</p>
                  <div className="flex gap-2">
                    {[1,2,3].map(d => (
                      <button key={d} onClick={() => setDuration(d)}
                        className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${duration === d ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "border-[#C9CBC2] text-[#464A45] hover:border-[#D6A500]"}`}>
                        {d}hr
                      </button>
                    ))}
                  </div>
                </div>
                {/* Slots */}
                <div>
                  <p className="text-xs font-bold text-[#30342F] mb-2">Available Slots</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {venue.slots.map(slot => (
                      <button key={slot} onClick={() => setSelectedSlot(slot)}
                        className={`py-1.5 text-xs rounded-lg border font-semibold transition-all ${selectedSlot === slot ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "text-[#30342F] border-[#C9CBC2] hover:border-[#D6A500] hover:text-[#755900]"}`}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Summary */}
                {selectedDay && selectedSlot && (
                  <div className="bg-[#FFC400]/5 border border-[#D6A500]/20 rounded-lg p-3 text-xs space-y-1.5">
                    <div className="flex justify-between"><span className="text-[#5F635C]">Date</span><span className="font-semibold">{new Date(calYear, calMonth, selectedDay).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span></div>
                    <div className="flex justify-between"><span className="text-[#5F635C]">Slot</span><span className="font-semibold">{selectedSlot}</span></div>
                    <div className="flex justify-between"><span className="text-[#5F635C]">Duration</span><span className="font-semibold">{duration}hr</span></div>
                    <div className="flex justify-between border-t border-[#D6A500]/20 pt-1.5 text-sm"><span className="font-bold text-[#181A1F]">Total</span><span className="font-bold text-[#755900]">₹{bookingTotal}</span></div>
                  </div>
                )}
                {booked ? (
                  <div className="w-full py-3 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-sm font-bold text-center flex items-center justify-center gap-2"><CheckCircle size={16} /> Booking Confirmed!</div>
                ) : (
                  <button onClick={handleBook}
                    disabled={!isGuest && !selectedSlot}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${(isGuest || selectedSlot) ? "bg-[#FFC400] text-[#17140A] hover:bg-[#D9A900]" : "bg-[#DFE0D8] text-[#7D8178] cursor-not-allowed"}`}>
                    {isGuest ? "Sign Up to Book" : selectedSlot ? `Book — ₹${bookingTotal}` : "Select a slot to book"}
                  </button>
                )}
                <div className="flex items-center justify-center gap-4 text-xs text-[#7D8178]">
                  <span className="flex items-center gap-1"><Shield size={10} />Secure</span>
                  <span className="flex items-center gap-1"><CheckCircle size={10} />Instant</span>
                  <span className="flex items-center gap-1"><ZapIcon size={10} />Free Cancel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#C9CBC2] px-4 py-3 flex items-center gap-3 lg:hidden z-40 shadow-xl">
        <div>
          <div className="text-base font-bold text-[#181A1F]">₹{venue.price}<span className="text-xs text-[#7D8178] font-normal">/hr</span></div>
          {selectedSlot ? <div className="text-xs text-[#755900] font-semibold">{selectedSlot} · {duration}hr · ₹{bookingTotal}</div> : <div className="text-xs text-[#7D8178]">Select date &amp; slot above</div>}
        </div>
        <button onClick={handleBook} disabled={!isGuest && !selectedSlot}
          className={`ml-auto px-6 py-2.5 rounded-xl font-bold text-sm ${(isGuest || selectedSlot) ? "bg-[#FFC400] text-[#17140A]" : "bg-[#DFE0D8] text-[#7D8178]"}`}>
          {isGuest ? "Sign Up" : "Book Now"}
        </button>
      </div>

      {showLoginPrompt && (
        <LoginWall icon={<ZapIcon size={24} className="text-[#755900]" />}
          title="Create a free account"
          body="Sign up to book venues, join games, and earn rewards with every play."
          onNavigate={onNavigate} onClose={() => setShowLoginPrompt(false)} />
      )}
    </div>
  );
}

// ─── Tournament Detail Page ────────────────────────────────────────────────────
export function TournamentDetailPage({ tournament, onBack, isGuest, onNavigate, isFav: isFavProp, onToggleFav }: {
  tournament: TournamentItem; onBack: () => void; isGuest?: boolean; onNavigate: (p: Page) => void;
  isFav?: boolean; onToggleFav?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "schedule" | "prizes" | "rules" | "participants" | "reviews">("overview");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [registered, setRegistered] = useState(false);
  const fav = isFavProp ?? false;

  const pct = Math.round((tournament.filled / tournament.slots) * 100);
  const spotsLeft = tournament.slots - tournament.filled;
  const sportIcons: Record<string, string> = { Badminton: "🏸", Football: "⚽", Tennis: "🎾", Cricket: "🏏", Basketball: "🏀" };

  const PARTICIPANTS = Array.from({ length: Math.min(tournament.filled, 8) }, (_, i) => ({
    name: ["Rohit S.", "Priya M.", "Dev A.", "Kiran T.", "Sneha I.", "Arjun D.", "Meera P.", "Vikram R."][i],
    seed: i + 1, city: ["Bangalore", "Hyderabad", "Mumbai", "Pune", "Chennai"][i % 5],
  }));

  const SCHEDULE = [
    { round: "Group Stage", date: new Date(tournament.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }), time: "9:00 AM – 1:00 PM" },
    { round: "Quarter Finals", date: new Date(new Date(tournament.date).getTime() + 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" }), time: "10:00 AM – 12:00 PM" },
    { round: "Semi Finals", date: new Date(new Date(tournament.date).getTime() + 86400000 * 2).toLocaleDateString("en-IN", { day: "numeric", month: "short" }), time: "3:00 PM – 5:00 PM" },
    { round: "Grand Final", date: new Date(new Date(tournament.date).getTime() + 86400000 * 2).toLocaleDateString("en-IN", { day: "numeric", month: "short" }), time: "6:00 PM – 8:00 PM" },
  ];

  const FAQS = [
    { q: "Can I register as a team or individual?", a: `This tournament accepts ${tournament.sport === "Football" || tournament.sport === "Cricket" ? "team registrations" : "individual registrations"}.` },
    { q: "Is the entry fee refundable?", a: "Entry fees are non-refundable after registration closes. Spot transfers are allowed 48h before the event." },
    { q: "Is equipment provided?", a: "Basic equipment is available. Bring your own preferred gear for the best experience." },
  ];

  const GALLERY = [
    tournament.image || "/inspirq-media/football.png",
    "/inspirq-media/badminton.png",
    "/inspirq-media/football.png",
    "/inspirq-media/football.png",
  ];

  const handleRegister = () => {
    if (isGuest) { setShowLoginPrompt(true); return; }
    if (tournament.status === "full") return;
    setRegistered(true);
    onNavigate("player-bookings");
  };

  return (
    <div className="min-h-screen bg-[#F7F7F3]">
      <div className="sticky top-0 z-30 bg-white border-b border-[#C9CBC2] px-4 h-14 flex items-center gap-3">
        <button aria-label="Go back" onClick={onBack} className="p-2 hover:bg-[#DFE0D8] rounded-lg"><ArrowLeft size={20} className="text-[#30342F]" /></button>
        <nav className="flex items-center gap-1.5 text-sm text-[#7D8178] flex-1 min-w-0">
          <button onClick={onBack} className="hover:text-[#755900] transition-colors">Tournaments</button>
          <span>/</span>
          <span className="text-[#181A1F] font-medium truncate">{tournament.name}</span>
        </nav>
        <button aria-label="Share" className="p-2 hover:bg-[#DFE0D8] rounded-lg"><Share2 size={18} className="text-[#5F635C]" /></button>
        <button onClick={() => onToggleFav?.()} className="p-2 hover:bg-[#DFE0D8] rounded-lg">
          <Heart size={18} className={fav ? "text-red-500 fill-red-500" : "text-[#7D8178]"} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5">
        <ImageGrid images={GALLERY} alt={tournament.name} />

        <div className="mt-5 lg:grid lg:grid-cols-[1fr_340px] lg:gap-8 items-start">
          {/* LEFT */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-[#C9CBC2] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFC400]/10 text-[#755900] mb-2">
                    {sportIcons[tournament.sport] || "🏅"} {tournament.sport}
                  </span>
                  <h1 className="text-xl font-black text-[#181A1F]">{tournament.name}</h1>
                  <p className="text-sm text-[#5F635C] mt-1 flex items-center gap-1.5">By <span className="font-semibold text-[#30342F]">{tournament.organizer}</span>{tournament.organizerVerified && <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700"><Shield size={10} />Verified · {tournament.organizerRating} rating · {tournament.organizerEvents} events</span>}</p>
                </div>
                <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border ${tournament.status === "full" ? "bg-red-50 text-red-600 border-red-100" : tournament.status === "filling_fast" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-sky-50 text-sky-700 border-sky-100"}`}>
                  {tournament.status === "full" ? "SOLD OUT" : tournament.status === "filling_fast" ? "FILLING FAST" : "OPEN"}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {[
                  { label: "Date", value: new Date(tournament.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) },
                  { label: "Venue", value: tournament.venue },
                  { label: "Entry Fee", value: `₹${tournament.fee}` },
                  { label: "Prize Pool", value: tournament.prize, hi: true },
                ].map(info => (
                  <div key={info.label} className="bg-[#F7F7F3] rounded-lg p-3 border border-[#DFE0D8]">
                    <div className="text-xs text-[#7D8178] uppercase tracking-wide mb-0.5">{info.label}</div>
                    <div className={`text-sm font-bold ${(info as any).hi ? "text-[#755900]" : "text-[#181A1F]"}`}>{info.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#5F635C] flex items-center gap-1"><Users size={11} />{tournament.filled} / {tournament.slots} registered</span>
                  <span className={`font-bold ${pct >= 90 ? "text-red-500" : pct >= 70 ? "text-amber-500" : "text-[#755900]"}`}>
                    {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
                  </span>
                </div>
                <div className="h-2 bg-[#DFE0D8] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${pct >= 90 ? "bg-red-400" : pct >= 70 ? "bg-amber-400" : "bg-[#FFC400]"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#C9CBC2] overflow-hidden">
              <div className="flex border-b border-[#DFE0D8] overflow-x-auto">
                {(["overview","schedule","prizes","rules","participants","reviews"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`shrink-0 px-4 py-3 text-xs font-semibold capitalize transition-colors ${activeTab === tab ? "text-[#755900] border-b-2 border-[#D6A500] bg-[#FFC400]/5" : "text-[#5F635C] hover:text-[#30342F]"}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-5">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <p className="text-sm text-[#464A45] leading-relaxed">{tournament.description || `${tournament.name} is an exciting ${tournament.sport} tournament open to all skill levels. Compete against the best players, win prizes, and track your bracket live on InspirQ.`}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Format", value: tournament.format || "Knockout" },
                        { label: "Skill level", value: tournament.level || "Open" },
                        { label: "Age group", value: tournament.ageGroup || "Open age" },
                        { label: "Check-in", value: tournament.checkInTime || "See schedule" },
                        { label: "Registration closes", value: tournament.registrationDeadline || "Before event" },
                        { label: "Refund policy", value: tournament.refundPolicy || "Contact organizer" },
                      ].map(item => <div key={item.label} className="bg-[#F7F7F3] rounded-lg p-3 border border-[#DFE0D8]"><div className="text-xs text-[#7D8178] uppercase tracking-wide">{item.label}</div><div className="text-sm font-semibold text-[#181A1F] mt-0.5">{item.value}</div></div>)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#181A1F] mb-2">Categories</h4>
                      <div className="flex flex-wrap gap-2">{(tournament.categories || ["Open"]).map(category => <span key={category} className="bg-[#FFC400]/10 text-[#755900] text-xs font-semibold px-3 py-1 rounded-full">{category}</span>)}</div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#181A1F] mb-2">What your entry includes</h4>
                      <div className="space-y-2">{(tournament.inclusions || ["Tournament entry", "Digital certificate"]).map(item => <div key={item} className="flex items-center gap-2 text-sm text-[#464A45]"><CheckCircle size={13} className="text-[#755900]" />{item}</div>)}</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#5F635C]"><MapPin size={13} className="text-[#755900]" />{tournament.venue}</div>
                    <div className="space-y-2">
                      {FAQS.map((f, i) => (
                        <div key={i} className="border border-[#C9CBC2] rounded-lg overflow-hidden">
                          <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-3.5 text-left hover:bg-[#F7F7F3]">
                            <span className="text-sm font-semibold text-[#181A1F] pr-3">{f.q}</span>
                            <ChevronDown size={13} className={`text-[#7D8178] shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                          </button>
                          {openFaq === i && <div className="px-4 pb-4 text-sm text-[#464A45] border-t border-[#F7F7F3] pt-3">{f.a}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === "schedule" && (
                  <div className="space-y-3">
                    {SCHEDULE.map((s, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-[#F7F7F3] rounded-lg border border-[#DFE0D8]">
                        <div className="w-8 h-8 bg-[#FFC400]/10 rounded-lg flex items-center justify-center shrink-0"><span className="text-xs font-bold text-[#755900]">{i + 1}</span></div>
                        <div><div className="font-semibold text-[#181A1F] text-sm">{s.round}</div><div className="text-xs text-[#7D8178] mt-0.5">{s.date} · {s.time}</div></div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "prizes" && (
                  <div className="space-y-3">
                    {[
                      { place: "🥇 1st Place", prize: tournament.prize, extra: "Trophy + Certificate" },
                      { place: "🥈 2nd Place", prize: `₹${Math.round(parseInt(String(tournament.prize).replace(/[₹,]/g, "")) * 0.35).toLocaleString()}`, extra: "Medal + Certificate" },
                      { place: "🥉 3rd Place", prize: `₹${Math.round(parseInt(String(tournament.prize).replace(/[₹,]/g, "")) * 0.15).toLocaleString()}`, extra: "Medal + Certificate" },
                    ].map(p => (
                      <div key={p.place} className="flex items-center justify-between p-4 bg-[#F7F7F3] rounded-lg border border-[#DFE0D8]">
                        <div><div className="font-bold text-[#181A1F] text-sm">{p.place}</div><div className="text-xs text-[#7D8178]">{p.extra}</div></div>
                        <div className="text-lg font-black text-[#755900]">{p.prize}</div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "rules" && (
                  <div className="space-y-2">
                    {(tournament.rules || ["All players must check in 30 minutes before their match", "Format may change based on final registration numbers", "All scores are recorded live on the InspirQ platform"]).map((rule, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-[#F7F7F3] rounded-lg">
                        <span className="text-xs font-bold text-[#755900] bg-[#FFC400]/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        <p className="text-sm text-[#464A45]">{rule}</p>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "participants" && (
                  <div className="space-y-2">
                    {PARTICIPANTS.map(p => (
                      <div key={p.name} className="flex items-center gap-3 p-3 bg-[#F7F7F3] rounded-lg border border-[#DFE0D8]">
                        <div className="w-8 h-8 bg-[#FFC400]/10 rounded-full flex items-center justify-center text-[#755900] font-bold text-xs shrink-0">{p.name.split(" ").map((n: string) => n[0]).join("")}</div>
                        <div className="flex-1"><div className="text-sm font-semibold text-[#181A1F]">{p.name}</div><div className="text-xs text-[#7D8178]">{p.city} · Seed #{p.seed}</div></div>
                        <CheckCircle size={14} className="text-sky-500" />
                      </div>
                    ))}
                    {tournament.filled > 8 && <p className="text-center text-sm text-[#7D8178] py-2">+{tournament.filled - 8} more participants</p>}
                  </div>
                )}
                {activeTab === "reviews" && <ReviewsSection context={tournament.name} />}
              </div>
            </div>
          </div>

          {/* RIGHT: Registration widget */}
          <div className="mt-5 lg:mt-0">
            <div className="sticky top-20 bg-white border border-[#C9CBC2] rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-[#111827] to-[#304A5D] px-5 py-4 text-white">
                <div className="text-2xl font-black">{tournament.prize}</div>
                <div className="text-white/60 text-xs mt-0.5">Total Prize Pool</div>
                <div className="mt-2 text-sm font-semibold text-white/90">Entry: ₹{tournament.fee}</div>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  {[
                    { label: "Date", v: new Date(tournament.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) },
                    { label: "Venue", v: tournament.venue.split(" ").slice(0, 2).join(" ") },
                    { label: "Format", v: tournament.format || (tournament.sport === "Football" ? "7v7" : "Singles / Doubles") },
                    { label: "Spots Left", v: spotsLeft > 0 ? `${spotsLeft}` : "Full" },
                  ].map(s => (
                    <div key={s.label} className="bg-[#F7F7F3] rounded-lg p-2.5 border border-[#DFE0D8]">
                      <div className="text-xs text-[#7D8178] uppercase tracking-wide">{s.label}</div>
                      <div className="text-sm font-bold text-[#181A1F] mt-0.5">{s.v}</div>
                    </div>
                  ))}
                </div>
                {registered ? (
                  <div className="w-full py-3 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-sm font-bold text-center flex items-center justify-center gap-2"><CheckCircle size={16} /> Registered!</div>
                ) : (
                  <button onClick={handleRegister}
                    disabled={tournament.status === "full"}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${tournament.status === "full" ? "bg-[#DFE0D8] text-[#7D8178] cursor-not-allowed" : "bg-[#FFC400] text-[#17140A] hover:bg-[#D9A900]"}`}>
                    {tournament.status === "full" ? "Join Waitlist" : isGuest ? "Sign Up to Register" : `Register — ₹${tournament.fee}`}
                  </button>
                )}
                <div className="flex items-center gap-3 text-xs text-[#7D8178]">
                  <span className="flex items-center gap-1"><Shield size={10} />Secure Payment</span>
                  <span className="flex items-center gap-1"><Calendar size={10} />Schedule via App</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#C9CBC2] px-4 py-3 flex items-center gap-3 lg:hidden z-40 shadow-xl">
        <div>
          <div className="text-base font-bold text-[#181A1F]">₹{tournament.fee} entry</div>
          <div className="text-xs text-[#7D8178]">{tournament.prize} prize · {spotsLeft} spots left</div>
        </div>
        <button onClick={handleRegister} disabled={tournament.status === "full"}
          className={`ml-auto px-6 py-2.5 rounded-xl font-bold text-sm ${tournament.status === "full" ? "bg-[#DFE0D8] text-[#7D8178]" : "bg-[#FFC400] text-[#17140A] hover:bg-[#D9A900]"}`}>
          {registered ? "Registered ✓" : tournament.status === "full" ? "Waitlist" : isGuest ? "Sign Up" : "Register"}
        </button>
      </div>

      {showLoginPrompt && (
        <LoginWall icon={<Trophy size={24} className="text-[#755900]" />}
          title="Join the Tournament"
          body="Create a free account to register, track your bracket, and win prizes."
          onNavigate={onNavigate} onClose={() => setShowLoginPrompt(false)} />
      )}
    </div>
  );
}

// ─── Game Detail Page ──────────────────────────────────────────────────────────
export function GameDetailPage({ game, onBack, isGuest, onNavigate, onJoin, isFav: isFavProp, onToggleFav }: {
  game: any; onBack: () => void; isGuest?: boolean;
  onNavigate: (p: Page) => void; onJoin?: (id: number) => void;
  isFav?: boolean; onToggleFav?: () => void;
}) {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "players" | "reviews">("details");
  const [joined, setJoined] = useState(false);
  const fav = isFavProp ?? false;

  const spotsLeft = game.slots - game.filled;
  const levelColor = game.level === "Advanced" ? "bg-purple-100 text-purple-700" : game.level === "Intermediate" ? "bg-blue-100 text-blue-700" : "bg-sky-100 text-sky-700";
  const BRING: Record<string, string[]> = {
    Badminton: ["Racket (or borrow at venue)", "Non-marking shoes", "Water bottle"],
    Football: ["Football boots", "Shin guards", "Sports kit", "Water bottle"],
    Tennis: ["Tennis racket", "Non-marking shoes", "Water bottle"],
    Basketball: ["Basketball shoes", "Comfortable kit", "Water bottle"],
    Cricket: ["Cricket whites", "Batting gloves", "Water bottle"],
  };
  const bring = BRING[game.sport] || ["Sports shoes", "Sportswear", "Water bottle"];

  const handleJoin = () => {
    if (isGuest) { setShowLoginPrompt(true); return; }
    if (spotsLeft <= 0) return;
    setJoined(true);
    if (onJoin) onJoin(game.id);
    onNavigate("player-bookings");
  };

  return (
    <div className="min-h-screen bg-[#F7F7F3]">
      <div className="sticky top-0 z-30 bg-white border-b border-[#C9CBC2] px-4 h-14 flex items-center gap-3">
        <button aria-label="Go back" onClick={onBack} className="p-2 hover:bg-[#DFE0D8] rounded-lg"><ArrowLeft size={20} className="text-[#30342F]" /></button>
        <nav className="flex items-center gap-1.5 text-sm text-[#7D8178] flex-1 min-w-0">
          <button onClick={onBack} className="hover:text-[#755900] transition-colors">Open Games</button>
          <span>/</span>
          <span className="text-[#181A1F] font-medium truncate">{game.sport}</span>
        </nav>
        <button onClick={() => onToggleFav?.()} className="p-2 hover:bg-[#DFE0D8] rounded-lg">
          <Heart size={18} className={fav ? "text-red-500 fill-red-500" : "text-[#7D8178]"} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 items-start">
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-[#C9CBC2] p-5">
              <div className="flex items-start gap-4">
                <div className="text-5xl shrink-0">{game.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-black text-[#181A1F]">{game.sport}</h1>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColor}`}>{game.level}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-[#5F635C]"><MapPin size={12} className="text-[#755900]" />{game.venue}</div>
                  <div className="text-xs text-[#7D8178] mt-0.5">Hosted by <span className="font-semibold text-[#464A45]">{game.host}</span></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: <Calendar size={14} className="text-[#755900]" />, label: "Date", value: game.date },
                  { icon: <Clock size={14} className="text-[#755900]" />, label: "Time", value: game.time },
                  { icon: <CreditCard size={14} className="text-[#755900]" />, label: "Fee", value: game.fee === 0 ? "Free" : `₹${game.fee}` },
                ].map(info => (
                  <div key={info.label} className="bg-[#F7F7F3] rounded-lg p-3 border border-[#DFE0D8]">
                    <div className="flex items-center gap-1 mb-1">{info.icon}</div>
                    <div className="text-xs text-[#7D8178] uppercase">{info.label}</div>
                    <div className="text-sm font-bold text-[#181A1F]">{info.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#5F635C]">{game.filled} of {game.slots} spots filled</span>
                  <span className={`font-bold ${spotsLeft <= 1 ? "text-red-500" : "text-[#755900]"}`}>{spotsLeft > 0 ? `${spotsLeft} open` : "Full"}</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: game.slots }).map((_, i) => (
                    <div key={i} className={`flex-1 h-2 rounded-full ${i < game.filled ? "bg-[#FFC400]" : "bg-[#DFE0D8]"}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#C9CBC2] overflow-hidden">
              <div className="flex border-b border-[#DFE0D8]">
                {(["details","players","reviews"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? "text-[#755900] border-b-2 border-[#D6A500] bg-[#FFC400]/5" : "text-[#5F635C]"}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-5">
                {activeTab === "details" && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#181A1F] mb-2">What to bring</h4>
                      <div className="space-y-2">
                        {bring.map(b => (
                          <div key={b} className="flex items-center gap-2.5 text-sm text-[#464A45]"><CheckCircle size={14} className="text-[#755900] shrink-0" />{b}</div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-700">
                      <strong>Reminder:</strong> Arrive 10 minutes early and bring valid ID.
                    </div>
                  </div>
                )}
                {activeTab === "players" && (
                  <div className="space-y-2">
                    {Array.from({ length: game.filled }, (_, i) => ({
                      name: ["Arjun M.", "Priya S.", "Rohit K.", "Dev A.", "Kiran T.", "Meera P.", "Vikram R."][i % 7],
                      skill: ["Beginner", "Intermediate", "Advanced"][i % 3],
                    })).map((p, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-[#F7F7F3] rounded-lg border border-[#DFE0D8]">
                        <div className="w-8 h-8 bg-[#FFC400]/10 rounded-full flex items-center justify-center text-[#755900] font-bold text-xs shrink-0">{p.name.split(" ").map((n: string) => n[0]).join("")}</div>
                        <div className="flex-1"><div className="text-sm font-semibold text-[#181A1F]">{p.name}</div><div className="text-xs text-[#7D8178]">{p.skill}</div></div>
                        <CheckCircle size={14} className="text-sky-500" />
                      </div>
                    ))}
                    {Array.from({ length: spotsLeft }).map((_, i) => (
                      <div key={`empty-${i}`} className="flex items-center gap-3 p-3 border border-dashed border-[#C9CBC2] rounded-lg">
                        <div className="w-8 h-8 border-2 border-dashed border-[#C9CBC2] rounded-full flex items-center justify-center shrink-0"><Users size={13} className="text-[#A5A89E]" /></div>
                        <span className="text-sm text-[#A5A89E]">Open Spot</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "reviews" && <ReviewsSection context={`${game.sport} at ${game.venue}`} />}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="mt-4 lg:mt-0">
            <div className="sticky top-20 bg-white border border-[#C9CBC2] rounded-xl shadow-lg p-5 space-y-4">
              <div>
                <div className="text-2xl font-black text-[#181A1F]">{game.fee === 0 ? "Free" : `₹${game.fee}`}</div>
                <div className="text-xs text-[#7D8178] mt-0.5">per player · {spotsLeft} spots left</div>
              </div>
              {joined ? (
                <div className="w-full py-3 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-sm font-bold text-center flex items-center justify-center gap-2"><CheckCircle size={16} /> You&apos;re In!</div>
              ) : (
                <button onClick={handleJoin}
                  disabled={spotsLeft <= 0}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${spotsLeft > 0 ? "bg-[#FFC400] text-[#17140A] hover:bg-[#D9A900]" : "bg-[#DFE0D8] text-[#7D8178] cursor-not-allowed"}`}>
                  {spotsLeft <= 0 ? "Game Full" : isGuest ? "Sign Up to Join" : game.fee === 0 ? "Join for Free" : `Join — ₹${game.fee}`}
                </button>
              )}
              <div className="text-xs text-[#5F635C] space-y-1.5">
                <div className="flex items-center gap-2"><MapPin size={11} className="text-[#755900]" />{game.venue}</div>
                <div className="flex items-center gap-2"><Calendar size={11} className="text-[#755900]" />{game.date} at {game.time}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#C9CBC2] px-4 py-3 flex items-center gap-3 lg:hidden z-40 shadow-xl">
        <div>
          <div className="text-base font-bold text-[#181A1F]">{game.fee === 0 ? "Free Entry" : `₹${game.fee}/player`}</div>
          <div className="text-xs text-[#7D8178]">{spotsLeft} spots remaining</div>
        </div>
        <button onClick={handleJoin} disabled={spotsLeft <= 0}
          className={`ml-auto px-6 py-2.5 rounded-xl font-bold text-sm ${spotsLeft > 0 ? "bg-[#FFC400] text-[#17140A]" : "bg-[#DFE0D8] text-[#7D8178]"}`}>
          {joined ? "Joined ✓" : spotsLeft <= 0 ? "Full" : isGuest ? "Sign Up" : "Join Now"}
        </button>
      </div>

      {showLoginPrompt && (
        <LoginWall icon={<Users size={24} className="text-[#755900]" />}
          title="Join the Game"
          body="Create a free account to join games, track your stats, and connect with players."
          onNavigate={onNavigate} onClose={() => setShowLoginPrompt(false)} />
      )}
    </div>
  );
}

// ─── Coach Detail Page ─────────────────────────────────────────────────────────
export function CoachDetailPage({ coach, onBack, isGuest, onNavigate, isFav: isFavProp, onToggleFav }: {
  coach: typeof TRAINERS[0]; onBack: () => void; isGuest?: boolean; onNavigate: (p: Page) => void;
  isFav?: boolean; onToggleFav?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"about" | "packages" | "schedule" | "reviews">("about");
  const [selectedPkg, setSelectedPkg] = useState(1);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [booked, setBooked] = useState(false);
  const fav = isFavProp ?? false;

  const PACKAGES = [
    { name: "Trial Session", sessions: 1, price: coach.fee, desc: "No commitment — try first", save: null, popular: false },
    { name: "Starter Pack", sessions: 4, price: Math.round(coach.fee * 3.6), desc: `₹${Math.round(coach.fee * 0.9)}/session · save 10%`, save: "10%", popular: false },
    { name: "Monthly Pack", sessions: 8, price: Math.round(coach.fee * 6.4), desc: `₹${Math.round(coach.fee * 0.8)}/session · save 20%`, save: "20%", popular: true },
    { name: "Intensive", sessions: 16, price: Math.round(coach.fee * 11.2), desc: `₹${Math.round(coach.fee * 0.7)}/session · save 30%`, save: "30%", popular: false },
  ];

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const SLOTS = ["06:00–07:00", "07:00–08:00", "17:00–18:00", "18:00–19:00", "19:00–20:00"];
  const FAQS = [
    { q: "Can I reschedule my session?", a: "Yes, up to 12 hours before your session at no extra charge." },
    { q: "Am I too much of a beginner?", a: "Not at all. Session 1 includes a skill assessment to tailor the program to you." },
    { q: "Is equipment provided?", a: "Basic equipment available on loan. Bringing your own is recommended from session 3." },
    { q: "Refund if unsatisfied after trial?", a: "Yes — full refund after trial if not satisfied. No questions asked." },
  ];

  const GALLERY = [
    coach.image,
    "/inspirq-media/coach-avatar.svg",
    "/inspirq-media/football.png",
    "/inspirq-media/badminton.png",
  ];

  const handleBook = () => {
    if (isGuest) { setShowLoginPrompt(true); return; }
    setBooked(true);
    onNavigate("player-bookings");
  };

  return (
    <div className="min-h-screen bg-[#F7F7F3]">
      <div className="sticky top-0 z-30 bg-white border-b border-[#C9CBC2] px-4 h-14 flex items-center gap-3">
        <button aria-label="Go back" onClick={onBack} className="p-2 hover:bg-[#DFE0D8] rounded-lg"><ArrowLeft size={20} className="text-[#30342F]" /></button>
        <nav className="flex items-center gap-1.5 text-sm text-[#7D8178] flex-1 min-w-0">
          <button onClick={onBack} className="hover:text-[#755900] transition-colors">Find Coaches</button>
          <span>/</span>
          <span className="text-[#181A1F] font-medium truncate">{coach.name}</span>
        </nav>
        <button onClick={() => onToggleFav?.()} className="p-2 hover:bg-[#DFE0D8] rounded-lg">
          <Heart size={18} className={fav ? "text-red-500 fill-red-500" : "text-[#7D8178]"} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5">
        <ImageGrid images={GALLERY} alt={coach.name} />

        <div className="mt-5 lg:grid lg:grid-cols-[1fr_340px] lg:gap-8 items-start">
          {/* LEFT */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-[#C9CBC2] p-5">
              <div className="flex items-start gap-4">
                <img src={coach.image} alt={coach.name}
                  className="w-20 h-20 rounded-xl object-cover border-2 border-[#DFE0D8] shrink-0"
                  onError={e => { (e.target as HTMLImageElement).src = "/inspirq-media/coach-avatar.svg"; }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-black text-[#181A1F]">{coach.name}</h1>
                    {coach.verified && <span className="flex items-center gap-1 bg-sky-50 text-sky-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-sky-100"><Shield size={9} />Verified</span>}
                  </div>
                  <p className="text-sm text-[#5F635C] mt-0.5">{coach.sport} Coach · {coach.experience}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="flex items-center gap-1 font-bold text-sm text-[#181A1F]"><Star size={13} className="text-yellow-400 fill-yellow-400" />{coach.rating}</span>
                    <span className="text-xs text-[#7D8178]">· {coach.students}+ students</span>
                    <span className="text-xs text-[#7D8178]">· {coach.cert}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[
                  { label: "Cert", v: coach.cert.split(" ").slice(0, 2).join(" ") },
                  { label: "Location", v: coach.location.split(",")[0] },
                  { label: "Per Session", v: `₹${coach.fee}` },
                  { label: "Response", v: coach.responseTime || "< 4hrs" },
                ].map(s => (
                  <div key={s.label} className="bg-[#F7F7F3] rounded-lg p-2.5 text-center border border-[#DFE0D8]">
                    <div className="text-xs font-bold text-[#181A1F]">{s.v}</div>
                    <div className="text-xs text-[#7D8178] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-gradient-to-r from-[#111827] to-[#304A5D] rounded-lg p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0"><PlayCircle size={22} className="text-white" /></div>
                <div className="flex-1">
                  <div className="text-white font-bold text-sm">Watch Introduction</div>
                  <div className="text-white/60 text-xs">2 min · Meet your coach before booking</div>
                </div>
                <button className="bg-[#FFC400] text-[#17140A] text-xs font-bold px-3 py-1.5 rounded-lg">Watch</button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#C9CBC2] overflow-hidden">
              <div className="flex border-b border-[#DFE0D8] overflow-x-auto">
                {(["about","packages","schedule","reviews"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`shrink-0 flex-1 py-3 text-xs font-semibold capitalize transition-colors ${activeTab === tab ? "text-[#755900] border-b-2 border-[#D6A500] bg-[#FFC400]/5" : "text-[#5F635C]"}`}>
                    {tab === "reviews" ? "Reviews (120)" : tab}
                  </button>
                ))}
              </div>
              <div className="p-5">
                {activeTab === "about" && (
                  <div className="space-y-4">
                    <p className="text-sm text-[#464A45] leading-relaxed">
                      {coach.name} is a {coach.cert}-certified {coach.sport.toLowerCase()} coach with {coach.experience} of experience. Based in {coach.location}, they have trained {coach.students}+ students from complete beginners to competitive level.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Levels", v: (coach.levels || ["All Levels"]).join(", ") },
                        { label: "Teaching style", v: coach.methodology || "Drill + Strategy" },
                        { label: "Age groups", v: (coach.ageGroups || ["10 years and above"]).join(", ") },
                        { label: "Languages", v: (coach.languages || ["English", "Hindi"]).join(", ") },
                      ].map(s => (
                        <div key={s.label} className="bg-[#F7F7F3] rounded-lg p-3 border border-[#DFE0D8]">
                          <div className="text-xs text-[#7D8178] mb-0.5 uppercase tracking-wide">{s.label}</div>
                          <div className="text-sm font-semibold text-[#181A1F]">{s.v}</div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#181A1F] mb-3">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {((coach as any).specializations || ["Footwork", "Technique", "Match Strategy", "Fitness"]).map((s: string) => (
                          <span key={s} className="bg-[#FFC400]/10 text-[#755900] text-xs font-semibold px-3 py-1 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#181A1F] mb-3">Coaching options</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#F7F7F3] rounded-lg p-3 border border-[#DFE0D8]"><div className="text-xs text-[#7D8178] uppercase">Modes</div><div className="text-sm font-semibold mt-1">{(coach.coachingModes || ["Private"]).join(", ")}</div></div>
                        <div className="bg-[#F7F7F3] rounded-lg p-3 border border-[#DFE0D8]"><div className="text-xs text-[#7D8178] uppercase">Home venue</div><div className="text-sm font-semibold mt-1">{coach.homeVenue || coach.location}</div></div>
                        <div className="bg-[#F7F7F3] rounded-lg p-3 border border-[#DFE0D8]"><div className="text-xs text-[#7D8178] uppercase">Group fee</div><div className="text-sm font-semibold mt-1">{coach.groupFee ? `₹${coach.groupFee}/person` : "Ask coach"}</div></div>
                        <div className="bg-[#F7F7F3] rounded-lg p-3 border border-[#DFE0D8]"><div className="text-xs text-[#7D8178] uppercase">Trial</div><div className="text-sm font-semibold mt-1">{coach.trialAvailable ? "Available" : "Not offered"}</div></div>
                      </div>
                    </div>
                    {coach.achievements && <div><h4 className="text-sm font-bold text-[#181A1F] mb-3">Credentials & achievements</h4><div className="space-y-2">{coach.achievements.map(item => <div key={item} className="flex items-center gap-2 text-sm text-[#464A45]"><Award size={13} className="text-[#755900]" />{item}</div>)}</div></div>}
                    <div className="space-y-2">
                      {FAQS.map((f, i) => (
                        <div key={i} className="border border-[#C9CBC2] rounded-lg overflow-hidden">
                          <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-3.5 text-left hover:bg-[#F7F7F3]">
                            <span className="text-sm font-semibold text-[#181A1F] pr-3">{f.q}</span>
                            <ChevronDown size={13} className={`text-[#7D8178] shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                          </button>
                          {openFaq === i && <div className="px-4 pb-4 text-sm text-[#464A45] border-t border-[#F7F7F3] pt-3">{f.a}</div>}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#C9CBC2] rounded-lg text-sm font-semibold text-[#30342F] hover:bg-[#F7F7F3]"><Phone size={14} />Call</button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#C9CBC2] rounded-lg text-sm font-semibold text-[#30342F] hover:bg-[#F7F7F3]"><MessageCircle size={14} />WhatsApp</button>
                    </div>
                  </div>
                )}
                {activeTab === "packages" && (
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3.5 text-sm text-blue-700 flex items-start gap-2">
                      <Info size={14} className="shrink-0 mt-0.5" />
                      <span>Start with a <strong>Trial Session</strong> — full refund if not satisfied.</span>
                    </div>
                    {PACKAGES.map((pkg, i) => (
                      <button key={i} onClick={() => setSelectedPkg(i)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all relative ${selectedPkg === i ? "border-[#D6A500] bg-[#FFC400]/5" : "border-[#C9CBC2] hover:border-[#D6A500]/50"}`}>
                        {pkg.popular && <span className="absolute -top-2.5 left-4 bg-[#FFC400] text-[#17140A] text-xs font-bold px-2.5 py-0.5 rounded-full">MOST POPULAR</span>}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-bold text-[#181A1F]">{pkg.name}</div>
                            <div className="text-xs text-[#5F635C] mt-0.5">{pkg.desc}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-lg font-bold text-[#755900]">₹{pkg.price.toLocaleString()}</div>
                            {pkg.save && <div className="text-xs text-sky-600 font-medium bg-sky-50 px-2 py-0.5 rounded-full mt-1">Save {pkg.save}</div>}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {activeTab === "schedule" && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#181A1F] mb-2">Available Days</h4>
                      <div className="flex gap-2 flex-wrap">
                        {DAYS.map((d, i) => (
                          <span key={d} className={`px-3 py-2 rounded-lg text-xs font-bold border ${i < 5 ? "bg-[#FFC400]/10 text-[#755900] border-[#D6A500]/20" : "bg-[#F7F7F3] text-[#A5A89E] border-[#DFE0D8]"}`}>{d}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#181A1F] mb-2">Available Slots</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {SLOTS.map(slot => (
                          <div key={slot} className="flex items-center gap-2 p-3 bg-[#F7F7F3] rounded-lg border border-[#DFE0D8]">
                            <Clock size={12} className="text-[#755900]" />
                            <span className="text-xs font-mono font-semibold text-[#30342F]">{slot}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "reviews" && <ReviewsSection context={`${coach.name} coaching`} />}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="mt-5 lg:mt-0">
            <div className="sticky top-20 bg-white border border-[#C9CBC2] rounded-xl shadow-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-[#DFE0D8]">
                <div className="text-2xl font-black text-[#181A1F]">₹{PACKAGES[selectedPkg].price.toLocaleString()}</div>
                <div className="text-xs text-[#7D8178] mt-0.5">{PACKAGES[selectedPkg].name} · {PACKAGES[selectedPkg].sessions} session{PACKAGES[selectedPkg].sessions > 1 ? "s" : ""}</div>
                {PACKAGES[selectedPkg].save && (
                  <span className="inline-block mt-1.5 text-xs bg-sky-50 text-sky-600 font-semibold px-2 py-0.5 rounded-full">Save {PACKAGES[selectedPkg].save}</span>
                )}
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs font-bold text-[#30342F]">Choose Package</p>
                <div className="space-y-2">
                  {PACKAGES.map((pkg, i) => (
                    <button key={i} onClick={() => setSelectedPkg(i)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition-all ${selectedPkg === i ? "border-[#D6A500] bg-[#FFC400]/5" : "border-[#C9CBC2] hover:border-[#A5A89E]"}`}>
                      <span className="font-semibold text-[#181A1F]">{pkg.name}</span>
                      <span className="font-bold text-[#755900]">₹{pkg.price.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
                {booked ? (
                  <div className="w-full py-3 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-sm font-bold text-center flex items-center justify-center gap-2"><CheckCircle size={16} /> Sessions Booked!</div>
                ) : (
                  <button onClick={handleBook}
                    className="w-full py-3 bg-[#FFC400] text-[#17140A] rounded-xl font-bold text-sm hover:bg-[#D9A900] transition-colors">
                    {isGuest ? "Sign Up to Book" : "Book Sessions"}
                  </button>
                )}
                <div className="flex items-center gap-3 text-xs text-[#7D8178]">
                  <span className="flex items-center gap-1"><Shield size={10} />Secure</span>
                  <span className="flex items-center gap-1"><CheckCircle size={10} />Trial Refund</span>
                  <span className="flex items-center gap-1"><ZapIcon size={10} />Reschedule Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#C9CBC2] px-4 py-3 flex items-center gap-3 lg:hidden z-40 shadow-xl">
        <div>
          <div className="text-base font-bold text-[#181A1F]">₹{PACKAGES[selectedPkg].price.toLocaleString()}</div>
          <div className="text-xs text-[#7D8178]">{PACKAGES[selectedPkg].name} · {PACKAGES[selectedPkg].sessions} sessions</div>
        </div>
        <button onClick={handleBook} className="ml-auto px-6 py-2.5 bg-[#FFC400] text-[#17140A] rounded-xl font-bold text-sm">
          {booked ? "Booked ✓" : isGuest ? "Sign Up" : "Book Now"}
        </button>
      </div>

      {showLoginPrompt && (
        <LoginWall icon={<Award size={24} className="text-[#755900]" />}
          title="Book Your Coach"
          body="Create a free account to book sessions, track your progress, and message your coach."
          onNavigate={onNavigate} onClose={() => setShowLoginPrompt(false)} />
      )}
    </div>
  );
}
