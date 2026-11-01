import { useState, useEffect, useCallback } from "react";
import {
  MapPin, Search, Star, Clock, Users, Trophy, Calendar, CreditCard,
  Shield, Award, CheckCircle, ChevronRight, ArrowRight, Instagram,
  Twitter, Facebook, Youtube, Zap, Building2,
  GraduationCap, ChevronLeft, Play, TrendingUp,
  BarChart3, Quote, Wallet, Target, MessageSquare, UserPlus
} from "lucide-react";
import type { Page } from "../data";
import { CITIES, VENUES, TESTIMONIALS, FAQS } from "../data";
import { GlobalHeader } from "../components";
import type { GlobalHeaderProfileItem } from "../components";
import { BookingModal } from "../components";
import footballImage from "../../imports/InspirqSportPlayV5/1dad95723be39a99dcd2b7951253089d75df1b45.png";
import badmintonImage from "../../imports/InspirqSportPlayV5/95e0ef088d129cf945b20dc8dd5b12037992fb27.png";
import tennisImage from "../../imports/InspirqSportPlayV5/b5f11eadd04f28f8b41a442b3695e9d2d840783b.png";

// ─── Constants ─────────────────────────────────────────────────────────────

const HERO_IMAGES = [
  { image: footballImage.src,  sport: "Football",  venue: "Green Valley Sports Complex", loc: "Koramangala, Bangalore", rating: "4.8", price: "₹2,200/hr" },
  { image: badmintonImage.src, sport: "Badminton", venue: "Court Masters Indoor Arena",  loc: "Indiranagar, Bangalore", rating: "4.9", price: "₹800/hr" },
  { image: tennisImage.src,    sport: "Tennis",     venue: "Ace Tennis Academy",          loc: "Jayanagar, Bangalore", rating: "4.9", price: "₹1,500/hr" },
];

const SPORT_PILLS = [
  { label: "Badminton", icon: "🏸" }, { label: "Football",   icon: "⚽" },
  { label: "Tennis",    icon: "🎾" }, { label: "Cricket",    icon: "🏏" },
  { label: "Basketball",icon: "🏀" }, { label: "Squash",     icon: "🏸" },
];

const FEATURES = [
  { icon: Shield,    title: "Verified Venues Only",    desc: "Every arena is KYC-verified and quality-checked before it goes live. No surprises on arrival." },
  { icon: Clock,     title: "Book in Under 60 Seconds", desc: "Real-time slot availability with instant confirmation. No back-and-forth calls or WhatsApp chains." },
  { icon: CreditCard,title: "Hassle-Free Refunds",     desc: "Cancel up to 4 hours before your slot for a full refund — no questions asked, no forms to fill." },
  { icon: Award,     title: "Earn as You Play",        desc: "Every booking earns InspirQ coins. Redeem for discounts, gear upgrades, and premium perks." },
  { icon: Users,     title: "Grow Your Network",       desc: "Connect with players at your level through open games, tournaments, and group training sessions." },
  { icon: MapPin,    title: "50 Cities. 1 App.",       desc: "From Bangalore to Delhi — find verified sports arenas wherever your game takes you in India." },
];

const JOURNEYS = [
  {
    icon: Users,       role: "Player",
    color: "#FFC400",  bg: "#FFF9D6",
    tagline: "Book, play, and level up",
    items: ["Find & book venues instantly", "Join daily open games", "Track scorecards & stats", "Win coins & achievement badges"],
  },
  {
    icon: Building2,   role: "Arena Owner",
    color: "#3F718B",  bg: "#E9F0F3",
    tagline: "Run a smarter sports business",
    items: ["List multiple venues with ease", "Real-time booking management", "Revenue & analytics dashboard", "Corporate & bulk booking tools"],
  },
  {
    icon: GraduationCap, role: "Coach",
    color: "#A87632",  bg: "#FBF1DE",
    tagline: "Grow your coaching practice",
    items: ["Publish training packages", "Student progress tracking", "Attendance & revenue reports", "AI-powered coaching insights"],
  },
  {
    icon: Trophy,      role: "Organizer",
    color: "#B44949",  bg: "#F7E8E6",
    tagline: "Host unforgettable competitions",
    items: ["Create & manage tournaments", "Automated bracket builder", "Live scorecard & leaderboard", "WhatsApp marketing automation"],
  },
];

const PLANS = [
  {
    name: "Free", price: "₹0", period: "forever",
    desc: "For the casual weekend player",
    features: ["Up to 4 bookings/month", "Join open games", "Basic scorecard", "Community access"],
    cta: "Start Free", highlight: false,
  },
  {
    name: "Premium", price: "₹199", period: "/month",
    desc: "For the serious sports enthusiast",
    features: ["Unlimited bookings", "Advanced analytics & AI tips", "2× InspirQ Coins earn rate", "Priority support", "Tournament early access", "Full scorecard history"],
    cta: "Start 14-Day Trial", highlight: true,
  },
  {
    name: "Pro Team", price: "₹499", period: "/month",
    desc: "For squads, clubs & corporates",
    features: ["Everything in Premium", "Team wallet & split billing", "Bulk booking discounts", "Dedicated account manager", "Custom team profile", "White-label scheduling"],
    cta: "Contact Sales", highlight: false,
  },
];

const AD_BANNERS = [
  {
    id: 1,
    brand: "Nike Sport",
    headline: "Gear Up for Your Game",
    subline: "Up to 40% off on badminton & tennis equipment — exclusive for InspirQ players",
    cta: "Shop Now",
    badge: "40% OFF",
    badgeColor: "#B84A4A",
    bg: "from-[#111827] to-[#304A5D]",
    accent: "#3F718B",
    img: badmintonImage.src,
  },
  {
    id: 2,
    brand: "Decathlon India",
    headline: "Sport Better. Spend Less.",
    subline: "Quality sports gear from ₹199 · Free delivery on orders above ₹999",
    cta: "Explore Deals",
    badge: "NEW ARRIVALS",
    badgeColor: "#FFC400",
    bg: "from-[#0B4F9C] to-[#0B4F9C]",
    accent: "#C5A46D",
    img: tennisImage.src,
  },
  {
    id: 3,
    brand: "HealthifyMe",
    headline: "Train Smart. Recover Fast.",
    subline: "3 months of AI-powered nutrition coaching — free for InspirQ Premium members",
    cta: "Claim Free Trial",
    badge: "FREE",
    badgeColor: "#7C3AED",
    bg: "from-[#1e0a3c] to-[#3b1f6b]",
    accent: "#A78BFA",
    img: badmintonImage.src,
  },
  {
    id: 4,
    brand: "Nivia Sports",
    headline: "Official Match Balls. Bulk Discounts.",
    subline: "Tournament-grade balls for football, basketball, volleyball · Bulk orders for clubs",
    cta: "Get Bulk Price",
    badge: "BULK SAVE",
    badgeColor: "#D97706",
    bg: "from-[#3b1a00] to-[#6b3400]",
    accent: "#FCD34D",
    img: footballImage.src,
  },
];

// ─── Sub-components ─────────────────────────────────────────────────────────

function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const next = useCallback(() => setIdx(i => (i + 1) % HERO_IMAGES.length), []);
  const prev = () => setIdx(i => (i - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  useEffect(() => { const t = setInterval(next, 5000); return () => clearInterval(t); }, [next]);

  const slide = HERO_IMAGES[idx];

  return (
    <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[4/3] bg-neutral-800">
      {HERO_IMAGES.map((s, i) => (
        <div key={i} className={`absolute inset-0 transition-all duration-700 ${i === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}>
          <img
            src={s.image}
            alt={s.venue}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Sport badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-[#C5A46D] text-[#151713] text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase">
          {slide.sport}
        </span>
      </div>

      {/* Controls */}
      <button aria-label="Show previous featured venue" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex size-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/40">
        <ChevronLeft size={16} className="text-white" />
      </button>
      <button aria-label="Show next featured venue" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex size-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/40">
        <ChevronRight size={16} className="text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {HERO_IMAGES.map((_, i) => (
          <button key={i} aria-label={`Show featured venue ${i + 1}`} aria-current={i === idx ? "true" : undefined} onClick={() => setIdx(i)}
            className={`rounded-full transition-all duration-300 ${i === idx ? "w-6 h-2 bg-[#C5A46D]" : "w-2 h-2 bg-white/50 hover:bg-white/80"}`} />
        ))}
      </div>

      {/* Venue info card */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-white/95 backdrop-blur rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg border border-white/60">
          <div className="w-10 h-10 rounded-lg bg-[#FFF9D6] flex items-center justify-center shrink-0 text-lg">
            {slide.sport === "Football" ? "⚽" : slide.sport === "Tennis" ? "🎾" : "🏸"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-[#151713] truncate">{slide.venue}</div>
            <div className="text-xs text-[#5F635C] flex items-center gap-1 mt-0.5">
              <Star size={9} className="fill-yellow-400 text-yellow-400" /> {slide.rating} · {slide.loc}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm font-bold text-[#755900]">{slide.price}</div>
            <div className="text-xs text-[#1473E6] font-semibold bg-[#EAF3FF] px-2 py-0.5 rounded-full mt-0.5">Available</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdCarousel() {
  const [idx, setIdx] = useState(0);
  const next = useCallback(() => setIdx(i => (i + 1) % AD_BANNERS.length), []);
  const prev = () => setIdx(i => (i - 1 + AD_BANNERS.length) % AD_BANNERS.length);
  useEffect(() => { const t = setInterval(next, 5000); return () => clearInterval(t); }, [next]);

  const ad = AD_BANNERS[idx];

  return (
    <div className="relative rounded-xl overflow-hidden" style={{ minHeight: 140 }}>
      {AD_BANNERS.map((a, i) => (
        <div key={a.id}
          className={`absolute inset-0 transition-all duration-700 bg-gradient-to-r ${a.bg} ${i === idx ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <div className="relative h-full flex items-center gap-4 px-12 py-5 sm:gap-6 sm:px-14" style={{ minHeight: 140 }}>
            {/* Left: bg image */}
            <div className="absolute right-0 top-0 bottom-0 w-48 sm:w-64 opacity-15 overflow-hidden">
              <img src={a.img} alt=""
                className="w-full h-full object-cover" />
            </div>

            {/* Badge */}
            <div className="shrink-0">
              <span
                className="inline-block px-3 py-1 text-xs font-extrabold rounded-full uppercase tracking-widest"
                style={{ background: a.badgeColor, color: a.badgeColor === "#FFC400" ? "#17140A" : "#FFFFFF" }}
              >
                {a.badge}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: ad.id === a.id ? a.accent : "#9E9E98" }}>{a.brand}</p>
              <h3 className="text-white font-extrabold text-xl leading-tight mb-1">{a.headline}</h3>
              <p className="text-white/70 text-xs leading-relaxed hidden sm:block max-w-lg">{a.subline}</p>
            </div>

            {/* CTA */}
            <div className="shrink-0 relative z-10">
              <button className="px-5 py-2.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap border-2 text-white hover:opacity-90"
                style={{ borderColor: a.accent, background: a.accent + "22" }}>
                {a.cta} →
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button aria-label="Show previous offer" onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex size-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/25">
        <ChevronLeft size={14} className="text-white" />
      </button>
      <button aria-label="Show next offer" onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex size-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/25">
        <ChevronRight size={14} className="text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {AD_BANNERS.map((_, i) => (
          <button key={i} aria-label={`Show offer ${i + 1}`} aria-current={i === idx ? "true" : undefined} onClick={() => setIdx(i)}
            className={`rounded-full transition-all duration-300 ${i === idx ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"}`} />
        ))}
      </div>
    </div>
  );
}

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-2">
      {FAQS.map((faq, i) => (
        <div key={i} className={`rounded-xl border transition-colors overflow-hidden ${open === i ? "border-[#D6A500]/30 bg-white" : "border-[#DFE0D8] bg-white hover:border-[#C9CBC2]"}`}>
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left">
            <span className={`font-semibold text-sm pr-4 ${open === i ? "text-[#755900]" : "text-[#151713]"}`}>{faq.q}</span>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${open === i ? "bg-[#FFC400] rotate-180" : "bg-[#EFEFE9]"}`}>
              <ChevronRight size={12} className={`transition-transform ${open === i ? "text-[#17140A] rotate-90" : "text-[#5F635C] rotate-90"}`} />
            </div>
          </button>
          {open === i && (
            <div className="px-5 pb-5 text-sm text-[#464A45] leading-relaxed border-t border-[#EFEFE9] pt-3">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function LandingPage({ onNavigate, isLoggedIn = false, onLogout, profileMenuItems = [] }: {
  onNavigate: (page: Page) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  profileMenuItems?: GlobalHeaderProfileItem[];
}) {
  const [city, setCity] = useState("Bangalore");
  const [bookingVenue, setBookingVenue] = useState<typeof VENUES[0] | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleConfirmBook = () => {
    setBookingVenue(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F3]">
      <GlobalHeader
        currentPage="landing"
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
        profileMenuItems={profileMenuItems}
        userName="Arjun Mehta"
        userEmail="arjun@example.com"
        userInitial="A"
        coinBalance={1240}
      />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#DFE0D8] bg-[#F5F6F8]">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#FFC400]/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(28rem,1.05fr)]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D0D5DD] bg-white px-3 py-1.5 text-xs font-semibold text-[#344054] shadow-sm">
                <span className="size-2 rounded-full bg-[#FFC400]" />
                Sports, sorted.
              </div>
              <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-[#101828] sm:text-5xl lg:text-[64px]">
                Book your next game. <span className="text-[#755900]">In seconds.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#475467] sm:text-lg">
                Find verified venues, open games, tournaments, and coaches near you—all in one simple place.
              </p>

              <div className="mt-8 rounded-2xl border border-[#D0D5DD] bg-white p-2 shadow-xl shadow-[#101828]/10">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl px-3 focus-within:ring-2 focus-within:ring-[#FFC400]">
                    <Search size={18} className="shrink-0 text-[#667085]" />
                    <span className="sr-only">Search by sport, venue, or area</span>
                    <input
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Sport, venue or area"
                      className="w-full bg-transparent text-sm text-[#101828] outline-none placeholder:text-[#667085]"
                    />
                  </label>
                  <label className="flex min-h-12 items-center gap-2 rounded-xl border-t border-[#EAECF0] px-3 sm:border-l sm:border-t-0">
                    <MapPin size={16} className="shrink-0 text-[#755900]" />
                    <span className="sr-only">City</span>
                    <select className="min-w-28 bg-transparent text-sm font-medium text-[#344054] outline-none" value={city} onChange={e => setCity(e.target.value)}>
                      {CITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </label>
                  <button
                    onClick={() => onNavigate("player-venues")}
                    className="min-h-12 whitespace-nowrap rounded-xl bg-[#FFC400] px-6 text-sm font-bold text-[#17140A] shadow-sm transition-colors hover:bg-[#D9A900] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755900] focus-visible:ring-offset-2"
                  >
                    Find a venue
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-medium text-[#667085]">Popular</span>
                {SPORT_PILLS.slice(0, 4).map(s => (
                  <button key={s.label} onClick={() => onNavigate("player-venues")}
                    className="min-h-9 rounded-full border border-[#D0D5DD] bg-white px-3 text-xs font-semibold text-[#344054] transition-colors hover:border-[#FFC400] hover:bg-[#FFF9D6]">
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#D0D5DD] pt-6">
                {[["892+", "verified venues"], ["50K+", "active players"], ["4.8", "average rating"]].map(([value, label]) => (
                  <div key={label} className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-[#101828]">{value}</span>
                    <span className="text-xs text-[#667085]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-xl">
              <HeroCarousel />
              <div className="mt-4 flex items-center justify-between px-1 text-xs text-[#667085]">
                <span className="flex items-center gap-1.5"><Shield size={14} className="text-[#755900]" /> Every venue is quality checked</span>
                <span className="hidden sm:inline">Instant confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT CAN YOU DO ───────────────────────────────────────────
          4-column feature cards on canvas, each with image + CTA.
          Decision-driver — converts awareness into intent. */}
      <section className="py-20 bg-[#F7F7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[#755900] text-xs font-bold tracking-widest uppercase mb-3">Everything in One Place</p>
            <h2 className="text-4xl font-extrabold text-[#151713] leading-tight">
              What Would You Like to Do?
            </h2>
            <p className="text-[#5F635C] mt-3 max-w-md mx-auto text-sm leading-relaxed">
              Whether you're booking a court, joining a pickup game, competing, or improving with a coach — InspirQ has you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                emoji: "🏟️", label: "Book a Venue", page: "player-venues" as Page,
                img: footballImage.src,
                stat: "892+ venues",
                desc: "Instant booking, real-time availability, zero phone calls.",
                accent: "#FFC400",
              },
              {
                emoji: "⚽", label: "Join a Game", page: "player-games" as Page,
                img: footballImage.src,
                stat: "Daily games",
                desc: "Find players at your level, split costs, show up and play.",
                accent: "#3F718B",
              },
              {
                emoji: "🏆", label: "Enter Tournament", page: "player-tournaments" as Page,
                img: tennisImage.src,
                stat: "₹1L+ prize pools",
                desc: "From local cups to city championships. Register and compete.",
                accent: "#A87632",
              },
              {
                emoji: "🎯", label: "Get a Coach", page: "player-training" as Page,
                img: badmintonImage.src,
                stat: "200+ coaches",
                desc: "Certified coaches across all sports. Trials from ₹500.",
                accent: "#765A88",
              },
            ].map(item => (
              <div key={item.label}
                onClick={() => onNavigate(item.page)}
                className="group rounded-xl border border-[#DFE0D8] overflow-hidden bg-white hover:border-[#D6A500]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="relative h-44 overflow-hidden bg-[#EFEFE9]">
                  <img
                    src={item.img}
                    alt={item.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-2xl">{item.emoji}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <span className="text-white font-extrabold text-base">{item.label}</span>
                    <span className="text-xs font-bold text-white/80 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">{item.stat}</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-[#464A45] leading-relaxed mb-3">{item.desc}</p>
                  <div className="flex items-center gap-1 text-xs font-bold transition-all duration-200" style={{ color: item.accent }}>
                    Explore <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────
          Energy yellow background — strongest visual break in the funnel.
          3 numbered steps, white text, bold display numerals. */}
      <section className="py-20 bg-[#FFC400] relative overflow-hidden">
        {/* Pattern */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, #C5A46D 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A46D]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-14">
            <p className="text-[#755900] text-xs font-bold tracking-widest uppercase mb-3">How It Works</p>
            <h2 className="text-4xl font-extrabold text-[#17140A] leading-tight">
              Simple. Fast. Rewarding.
            </h2>
            <p className="text-[#3B310F] mt-3 max-w-md mx-auto text-sm">Get from couch to court in three effortless steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
            {[
              { n: "01", icon: Search,   title: "Find Your Arena",   desc: "Search 892+ verified venues by sport, location, time, and amenities. Compare prices in seconds." },
              { n: "02", icon: Calendar, title: "Book Your Slot",    desc: "Pick your time, pay securely. Get instant WhatsApp + email confirmation with a QR check-in code." },
              { n: "03", icon: Trophy,   title: "Play & Earn Coins", desc: "Show up, play hard. Every booking earns InspirQ coins — redeem for discounts, gear, and perks." },
            ].map((step, i) => (
              <div key={step.n} className="relative bg-white/45 backdrop-blur-sm rounded-2xl p-7 border border-[#17140A]/10 hover:bg-white/60 transition-colors shadow-sm">
                {/* Connector arrow (except last) */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-5 -translate-y-1/2 z-10">
                    <ChevronRight size={20} className="text-[#755900]" />
                  </div>
                )}
                <div className="text-7xl font-extrabold text-[#17140A]/10 leading-none mb-3 select-none">{step.n}</div>
                <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center mb-5 border border-[#17140A]/10">
                  <step.icon size={22} className="text-[#17140A]" />
                </div>
                <h3 className="text-xl font-bold text-[#17140A] mb-2">{step.title}</h3>
                <p className="text-[#3B310F] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button onClick={() => onNavigate("auth")}
              className="bg-white text-[#755900] px-8 py-4 rounded-xl font-extrabold hover:bg-[#F7F7F3] transition-colors shadow-xl shadow-black/20 inline-flex items-center gap-2">
              <Play size={16} className="fill-[#FFC400]" /> Start Booking Now — It's Free
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURED VENUES ───────────────────────────────────────────
          White bg, 3-col grid. Real venue data, ratings, quick-book CTA. */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#755900] text-xs font-bold tracking-widest uppercase mb-2">Top-Rated Arenas</p>
              <h2 className="text-4xl font-extrabold text-[#151713]">
                Featured Venues
              </h2>
            </div>
            <button onClick={() => onNavigate("player-venues")}
              className="hidden md:flex items-center gap-1.5 text-sm font-bold text-[#755900] hover:text-[#D9A900] border border-[#D6A500]/30 hover:border-[#D6A500] px-4 py-2 rounded-lg transition-colors">
              View All <ChevronRight size={15} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VENUES.slice(0, 6).map(v => (
              <div key={v.id}
                className="group rounded-xl border border-[#DFE0D8] overflow-hidden bg-white hover:border-[#D6A500]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-48 overflow-hidden bg-[#EFEFE9]">
                  <img src={v.image} alt={v.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {v.verified && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#FFC400] text-[#17140A] text-xs font-bold px-2 py-0.5 rounded-full">
                      <CheckCircle size={9} /> Verified
                    </div>
                  )}
                  <div className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${v.available ? "bg-[#EAF3FF] text-[#1473E6]" : "bg-[#F7E8E6] text-[#B44949]"}`}>
                    {v.available ? "Available" : "Booked"}
                  </div>
                  <div className="absolute bottom-3 left-3 text-xs text-white/80 font-medium">{v.sport}</div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-[#151713] text-sm leading-snug">{v.name}</h3>
                    <div className="flex items-center gap-0.5 text-xs font-bold text-[#151713] shrink-0">
                      <Star size={11} className="fill-yellow-400 text-yellow-400" /> {v.rating}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#5F635C] mb-3">
                    <MapPin size={11} /> {v.location}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {v.amenities.slice(0, 3).map(a => (
                      <span key={a} className="text-xs font-medium bg-[#EFEFE9] text-[#464A45] px-2 py-0.5 rounded-full">{a}</span>
                    ))}
                    {v.amenities.length > 3 && (
                      <span className="text-xs font-medium bg-[#EFEFE9] text-[#5F635C] px-2 py-0.5 rounded-full">+{v.amenities.length - 3}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-extrabold text-[#151713]">
                        ₹{v.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#5F635C]">/hr</span>
                    </div>
                    <button onClick={() => setBookingVenue(v)}
                      className="bg-[#FFC400] hover:bg-[#D9A900] text-[#17140A] text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button onClick={() => onNavigate("player-venues")}
              className="border-2 border-[#DFE0D8] hover:border-[#D6A500] text-[#222520] hover:text-[#755900] font-bold text-sm px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
              Explore All Venues <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ── WHO IS INSPIRQ FOR ────────────────────────────────────────
          Canvas bg, 4 persona cards. Each role gets its own accent color. */}
      <section className="py-20 bg-[#F7F7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[#755900] text-xs font-bold tracking-widest uppercase mb-3">For Everyone in Sport</p>
            <h2 className="text-4xl font-extrabold text-[#151713] leading-tight">
              Choose Your Journey
            </h2>
            <p className="text-[#5F635C] mt-3 text-sm max-w-lg mx-auto">
              Whether you play, coach, own an arena, or organize — InspirQ has a dedicated experience for you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {JOURNEYS.map(j => (
              <div key={j.role} onClick={() => onNavigate("auth")}
                className="group rounded-2xl border border-[#DFE0D8] bg-white p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:border-transparent">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: j.bg }}>
                  <j.icon size={22} style={{ color: j.color }} />
                </div>
                <h3 className="font-extrabold text-[#151713] mb-0.5">{j.role}</h3>
                <p className="text-xs text-[#5F635C] mb-4 font-medium">{j.tagline}</p>
                <ul className="space-y-2.5 mb-5">
                  {j.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-[#464A45]">
                      <CheckCircle size={13} className="mt-0.5 shrink-0" style={{ color: j.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="flex items-center gap-1.5 text-xs font-bold group-hover:gap-2.5 transition-all" style={{ color: j.color }}>
                  Get Started <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM METRICS / WHY INSPIRQ ───────────────────────────
          White bg, 6-feature grid. Trust reinforcement before testimonials. */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left: headline + feature list */}
            <div>
              <p className="text-[#755900] text-xs font-bold tracking-widest uppercase mb-3">Why InspirQ</p>
              <h2 className="text-4xl font-extrabold text-[#151713] leading-tight mb-5">
                Built for Serious Players
              </h2>
              <p className="text-[#5F635C] text-sm leading-relaxed mb-10">
                Every feature is designed around the way real players, coaches, and venues actually work —
                not a generic booking widget. We obsess over the details so you can focus on the game.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {FEATURES.map(f => (
                  <div key={f.title} className="flex gap-3 p-4 rounded-xl border border-[#DFE0D8] hover:border-[#D6A500]/30 hover:bg-[#F7F7F3] transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-[#FFF9D6] flex items-center justify-center shrink-0">
                      <f.icon size={16} className="text-[#755900]" />
                    </div>
                    <div>
                      <div className="font-bold text-[#151713] text-sm mb-0.5">{f.title}</div>
                      <p className="text-[#5F635C] text-xs leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: App stats visual */}
            <div className="relative">
              <div className="bg-[#151713] rounded-2xl p-6 text-white shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-xs text-[#5F635C] mb-1 font-medium">YOUR DASHBOARD</div>
                    <div className="font-bold text-lg">This Month</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#C5A46D] font-bold bg-[#C5A46D]/10 px-3 py-1 rounded-full">
                    <TrendingUp size={11} /> +24%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: Calendar,    lbl: "Sessions",    val: "12",        sub: "3 this week" },
                    { icon: Wallet,      lbl: "Coins Earned",val: "2,400",     sub: "Redeem anytime" },
                    { icon: BarChart3,   lbl: "Win Rate",    val: "68%",       sub: "↑ from 55%" },
                    { icon: Target,      lbl: "Streak",      val: "7 days",    sub: "Personal best!" },
                  ].map(s => (
                    <div key={s.lbl} className="bg-white/5 rounded-xl p-4 border border-white/8">
                      <div className="flex items-center gap-2 mb-2">
                        <s.icon size={13} className="text-[#C5A46D]" />
                        <span className="text-xs text-[#5F635C] font-medium uppercase tracking-wide">{s.lbl}</span>
                      </div>
                      <div className="text-xl font-extrabold text-white">{s.val}</div>
                      <div className="text-xs text-[#7D8178] mt-0.5">{s.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/6 rounded-xl p-4 border border-white/8">
                  <div className="text-xs text-[#5F635C] font-medium mb-3">UPCOMING BOOKINGS</div>
                  {[
                    { sport: "🏸", name: "Court Masters Arena", time: "Tomorrow 7:00 AM", status: "Confirmed" },
                    { sport: "⚽", name: "Green Valley FC Turf", time: "Sat 6:00 PM",      status: "QR Ready" },
                  ].map(b => (
                    <div key={b.name} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                      <span className="text-xl">{b.sport}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{b.name}</div>
                        <div className="text-xs text-[#5F635C]">{b.time}</div>
                      </div>
                      <span className="text-xs font-bold text-[#C5A46D] bg-[#C5A46D]/10 px-2 py-0.5 rounded-full">{b.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-3 flex items-center gap-3 border border-[#DFE0D8]">
                <div className="w-9 h-9 bg-[#C5A46D]/20 rounded-lg flex items-center justify-center">
                  <Award size={16} className="text-[#8F7145]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#151713]">Achievement Unlocked!</div>
                  <div className="text-xs text-[#5F635C]">Century Player — 100 sessions 🎉</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────
          Ink-dark section — dramatic contrast, creates emotional peak before pricing. */}
      <section className="py-20 bg-[#151713] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #C5A46D 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-14">
            <p className="text-[#C5A46D] text-xs font-bold tracking-widest uppercase mb-3">Real Players, Real Results</p>
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Loved by 50,000+ Players
            </h2>
            <p className="text-[#5F635C] mt-3 text-sm">Join a community that books smarter, plays harder, and wins together.</p>
          </div>

          {/* Metric strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { val: "4.8/5",  lbl: "App Store Rating", icon: Star },
              { val: "95%",    lbl: "Satisfaction Rate", icon: CheckCircle },
              { val: "₹2.8Cr", lbl: "Saved by Players",  icon: CreditCard },
              { val: "3 min",  lbl: "Avg. Booking Time",  icon: Clock },
            ].map(m => (
              <div key={m.lbl} className="bg-white/5 border border-white/8 rounded-2xl p-5 text-center">
                <m.icon size={18} className="text-[#C5A46D] mx-auto mb-2" />
                <div className="text-2xl font-extrabold text-white">{m.val}</div>
                <div className="text-[#5F635C] text-xs mt-1">{m.lbl}</div>
              </div>
            ))}
          </div>

          {/* Testimonial cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white/6 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors">
                <Quote size={28} className="text-[#755900] mb-4 opacity-80" />
                <p className="text-[#C9CBC2] text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                  <div className="w-10 h-10 rounded-full bg-[#FFC400]/30 border border-[#D6A500]/40 flex items-center justify-center text-[#C5A46D] font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-[#5F635C] text-xs">{t.sport}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────
          White bg, 3 tiers. Highlighted center card in energy yellow. */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-[#755900] text-xs font-bold tracking-widest uppercase mb-3">Pricing</p>
            <h2 className="text-4xl font-extrabold text-[#151713] leading-tight">
              Simple, Transparent Plans
            </h2>
            <p className="text-[#5F635C] mt-3 text-sm max-w-md mx-auto">
              Start free, upgrade when you're ready. No hidden fees, cancel anytime, no credit card required to begin.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map(plan => (
              <div key={plan.name}
                className={`rounded-2xl p-7 flex flex-col relative transition-all duration-300 ${
                  plan.highlight
                    ? "bg-[#FFC400] shadow-2xl shadow-[#FFC400]/25 scale-[1.02]"
                    : "bg-white border-2 border-[#DFE0D8] hover:border-[#D6A500]/30 hover:shadow-lg"
                }`}>
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C5A46D] text-[#151713] text-xs font-extrabold px-4 py-1.5 rounded-full tracking-wide uppercase shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`font-extrabold text-xl mb-1 ${plan.highlight ? "text-white" : "text-[#151713]"}`}>{plan.name}</h3>
                  <p className={`text-xs mb-4 ${plan.highlight ? "text-[#EBC43F]" : "text-[#5F635C]"}`}>{plan.desc}</p>
                  <div className="flex items-end gap-1.5">
                    <span className={`text-5xl font-extrabold ${plan.highlight ? "text-white" : "text-[#151713]"}`}>{plan.price}</span>
                    <span className={`pb-1.5 text-sm ${plan.highlight ? "text-[#EBC43F]" : "text-[#7D8178]"}`}>{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 flex-1 mb-7">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.highlight ? "text-[#FFF0A3]" : "text-[#464A45]"}`}>
                      <CheckCircle size={15} className={`mt-0.5 shrink-0 ${plan.highlight ? "text-[#C5A46D]" : "text-[#755900]"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button onClick={() => onNavigate("auth")}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-colors ${
                    plan.highlight
                      ? "bg-white text-[#755900] hover:bg-[#F7F7F3]"
                      : "bg-[#FFF9D6] text-[#755900] hover:bg-[#FFC400] hover:text-[#17140A] border border-[#D6A500]/20"
                  }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────
          Canvas bg, accordion. Objection handling before final CTA. */}
      <section className="py-20 bg-[#F7F7F3]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[#755900] text-xs font-bold tracking-widest uppercase mb-3">FAQ</p>
            <h2 className="text-4xl font-extrabold text-[#151713]">
              Frequently Asked Questions
            </h2>
            <p className="text-[#5F635C] mt-3 text-sm">Can't find what you're looking for? Chat with our support team.</p>
          </div>
          <FaqAccordion />
          <div className="text-center mt-8">
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#755900] hover:text-[#D9A900] transition-colors">
              <MessageSquare size={15} /> Chat with Support
            </button>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────
          Full energy yellow — action close, yellow accent, bold invitation. */}
      <section className="py-24 bg-[#FFC400] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(135deg, #C5A46D 1px, transparent 1px), linear-gradient(-45deg, #C5A46D 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#C5A46D]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#8F6B00]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/55 border border-[#17140A]/10 rounded-full px-5 py-2 mb-8">
            <Zap size={13} className="text-[#755900] fill-[#755900]" />
            <span className="text-[#5C4600] text-xs font-bold tracking-wide uppercase">Limited Time — Free 14-Day Premium Trial</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-extrabold text-[#17140A] leading-[1.1] mb-5">
            Ready to Start<br />
            <span className="text-[#755900]">Playing?</span>
          </h2>
          <p className="text-[#3B310F] text-lg mb-10 max-w-xl mx-auto">
            Join 50,000+ players already booking smarter. Your first booking is free. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button onClick={() => onNavigate("auth")}
              className="bg-white text-[#755900] px-10 py-4 rounded-xl font-extrabold text-base hover:bg-[#F7F7F3] transition-colors shadow-2xl shadow-black/20 inline-flex items-center gap-2">
              <UserPlus size={18} /> Create Free Account
            </button>
            <button onClick={() => onNavigate("player-venues")}
              className="border-2 border-[#17140A]/35 text-[#17140A] px-10 py-4 rounded-xl font-bold text-base hover:bg-white/30 transition-colors inline-flex items-center gap-2">
              <Search size={16} /> Explore Venues First
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[#3B310F] text-sm font-semibold">
            {["✓ Free to join", "✓ 892+ venues", "✓ Instant confirmation", "✓ Cancel anytime"].map(t => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="bg-[#151713] text-[#464A45] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-[#FFC400] rounded-xl flex items-center justify-center">
                  <Zap size={16} className="text-[#17140A] fill-[#17140A]" />
                </div>
                <span className="text-white font-extrabold text-xl">InspirQ</span>
                <span className="text-xs text-[#464A45] bg-white/6 border border-white/8 px-2 py-0.5 rounded-full">Sport</span>
              </div>
              <p className="text-sm leading-relaxed mb-5 max-w-xs">
                India's most trusted sports venue booking & community platform. Book, play, earn, and connect.
              </p>
              <div className="flex gap-2">
                {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                  <div key={i} className="group w-9 h-9 bg-white/6 border border-white/8 rounded-xl flex items-center justify-center hover:bg-[#FFC400] hover:border-[#D6A500] transition-colors cursor-pointer">
                    <Icon size={14} className="text-[#7D8178] group-hover:text-[#17140A]" />
                  </div>
                ))}
              </div>
            </div>

            {[
              { title: "Company",     links: ["About Us", "Careers", "Press", "Blog"] },
              { title: "For Players", links: ["Find Venues", "Join Games", "Tournaments", "Training"] },
              { title: "Support",     links: ["Help Center", "Privacy Policy", "Terms of Service", "Contact Us"] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-[#7D8178] font-bold text-xs tracking-widest uppercase mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" onClick={e => {
                        e.preventDefault();
                        if (l === "Privacy Policy") onNavigate("privacy-policy" as Page);
                        else if (l === "Terms of Service") onNavigate("terms" as Page);
                        else if (l === "Find Venues") onNavigate("player-venues");
                        else if (l === "Join Games") onNavigate("player-games");
                        else if (l === "Tournaments") onNavigate("player-tournaments");
                        else if (l === "Training") onNavigate("player-training");
                        else if (l === "About Us") onNavigate("about-us" as Page);
                        else if (l === "Help Center") onNavigate("help-center" as Page);
                      }}
                        className="text-sm hover:text-[#5F6C80] transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/6 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-[#464A45]">© 2026 InspirQ Sport Play Pvt. Ltd. All rights reserved.</span>
            <div className="flex items-center gap-4 text-xs text-[#464A45]">
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1473E6] animate-pulse" /> All systems operational
              </span>
              <span>Made with ❤️ for India's sports community</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Modals & toasts ────────────────────────────────────────── */}
      {bookingVenue && (
        <BookingModal venue={bookingVenue} onClose={() => setBookingVenue(null)} onConfirm={handleConfirmBook} />
      )}

      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-[#FFC400] text-[#17140A] px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 border border-[#C5A46D]/20">
          <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
            <CheckCircle size={16} />
          </div>
          <span className="font-semibold text-sm">Booking confirmed! Check your email.</span>
        </div>
      )}
    </div>
  );
}
