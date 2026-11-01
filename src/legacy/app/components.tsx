import { useState, useMemo, useRef, type ChangeEvent, type DragEvent, type MouseEvent } from "react";
import type { ReactNode } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  MapPin, Star, Heart, CheckCircle, X, Info, XCircle, ChevronLeft, ChevronRight,
  LogOut, Zap, Bell, Calendar, Trophy, MessageSquare, CreditCard, Award,
  Home, Search, Users, Dumbbell, BarChart2, Wallet, UserCheck, Headphones,
  Building2, GraduationCap, Clock, BookOpen, Package, DollarSign, Settings,
  Activity, MessageSquare as Msg, Target, Shield, Tag, ClipboardList, FileText,
  CreditCard as CardIcon, Smartphone, Building as BankIcon, CheckCircle2,
  ChevronsUpDown, ChevronUp, ChevronDown, Filter,
  LayoutGrid, List, Upload, QrCode, Download, Share2, ShoppingCart, Brain,
  Menu, LogIn, UserPlus, LayoutDashboard, ArrowUpDown, ArrowUp, ArrowDown,
  Plus
} from "lucide-react";
import type { Role, Page } from "./data";
import { VENUES, NOTIFICATIONS_DATA, CITIES } from "./data";
import { Button as UiButton } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";

export function Badge({ text, color = "success" }: { text: string; color?: string }) {
  const colors: Record<string, string> = {
    success: "border border-[#A6F4C5] bg-[var(--color-success-bg)] text-[var(--color-success-text)]",
    blue: "border border-[#B2DDFF] bg-[var(--color-info-bg)] text-[var(--color-info-text)]",
    orange: "border border-[#FEDF89] bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]",
    red: "border border-[#FECDCA] bg-[var(--color-error-bg)] text-[var(--color-error-text)]",
    gray: "border border-border bg-secondary text-secondary-foreground",
    yellow: "border border-[#FDE272] bg-[#FFFAEB] text-[#713B12]",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.gray}`}>
      {text}
    </span>
  );
}

export function StatCard({ label, value, sub, icon: Icon, color = "#755900" }: {
  label: string; value: string; sub?: string; icon: any; color?: string;
}) {
  return (
    <div className="bg-white rounded-md p-5 border border-[#C9CBC2] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div style={{ background: color + "18" }} className="p-2.5 rounded-md">
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-bold text-[#181A1F] font-['Lexend']">{value}</div>
      <div className="text-sm text-[#5F635C] mt-0.5">{label}</div>
      {sub && <div className="text-xs text-sky-600 mt-1 font-medium">{sub}</div>}
    </div>
  );
}

export function VenueCard({ v, onBook, isFav, onToggleFav }: { v: typeof VENUES[0]; onBook: (v: typeof VENUES[0]) => void; isFav?: boolean; onToggleFav?: (e: MouseEvent) => void }) {
  return (
    <div className="bg-white rounded-md overflow-hidden border border-[#C9CBC2] shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).src = "/inspirq-media/football.png"; }} />
        <div className="absolute top-3 left-3 flex gap-2">
          {v.verified && <span className="bg-white/90 backdrop-blur-sm text-sky-600 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle size={10} /> Verified</span>}
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${v.available ? "bg-sky-500 text-white" : "bg-[#7D8178] text-white"}`}>{v.available ? "Available" : "Booked"}</span>
        </div>
        <button onClick={onToggleFav} className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-colors">
          <Heart size={14} className={isFav ? "text-red-500 fill-red-500" : "text-[#7D8178]"} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-[#181A1F] text-sm leading-tight">{v.name}</h3>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold text-[#30342F]">{v.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#5F635C] text-xs mb-2">
          <MapPin size={11} /> <span>{v.location}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {v.amenities.slice(0, 3).map(a => (
            <span key={a} className="bg-[#F7F7F3] text-[#464A45] text-xs px-2 py-0.5 rounded-md border border-[#C9CBC2]">{a}</span>
          ))}
          {v.amenities.length > 3 && <span className="text-[#7D8178] text-xs">+{v.amenities.length - 3}</span>}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-[#181A1F]">₹{v.price.toLocaleString()}</span>
            <span className="text-xs text-[#7D8178]">/hr</span>
          </div>
          <button
            onClick={() => onBook(v)}
            disabled={!v.available}
            className="bg-[#FFC400] text-[#17140A] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#D9A900] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export function PaymentGatewayModal({ amount, description, onClose, onSuccess }: {
  amount: number; description: string; onClose: () => void; onSuccess: () => void;
}) {
  const [method, setMethod] = useState<"upi" | "card" | "netbanking" | "wallet">("upi");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const pay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setDone(true); setTimeout(onSuccess, 1200); }, 2000);
  };

  const methods = [
    { id: "upi" as const, label: "UPI", icon: Smartphone },
    { id: "card" as const, label: "Card", icon: CardIcon },
    { id: "netbanking" as const, label: "Net Banking", icon: BankIcon },
    { id: "wallet" as const, label: "InspirQ Wallet", icon: Wallet },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-md w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFC400] to-[#D9A900] p-5 text-[#17140A]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={18} />
              <span className="font-bold text-sm">EasyPlugin Pay</span>
            </div>
            <button aria-label="Close payment" onClick={onClose} className="p-1 hover:bg-white/20 rounded-full"><X size={16} /></button>
          </div>
          <div className="text-[#3B310F] text-xs mb-0.5">{description}</div>
          <div className="text-3xl font-bold">₹{amount.toLocaleString()}</div>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-sky-500" />
            </div>
            <div className="text-lg font-bold text-[#181A1F] mb-1">Payment Successful!</div>
            <div className="text-sm text-[#5F635C]">₹{amount.toLocaleString()} paid via {method.toUpperCase()}</div>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Payment method tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#DFE0D8] rounded-md">
              {methods.map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-medium transition-all ${method === m.id ? "bg-white text-[#755900] shadow-sm" : "text-[#5F635C]"}`}>
                  <m.icon size={15} />
                  {m.label}
                </button>
              ))}
            </div>

            {method === "upi" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-[#464A45] mb-1.5 block">UPI ID</label>
                  <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi"
                    className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Google Pay", "PhonePe", "Paytm", "BHIM"].map(app => (
                    <button key={app} className="text-xs border border-[#C9CBC2] px-3 py-1.5 rounded-lg hover:border-[#D6A500] hover:text-[#755900] transition-colors">{app}</button>
                  ))}
                </div>
              </div>
            )}

            {method === "card" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-[#464A45] mb-1.5 block">Card Number</label>
                  <input placeholder="4242 4242 4242 4242"
                    className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#464A45] mb-1.5 block">Expiry</label>
                    <input placeholder="MM / YY" className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#464A45] mb-1.5 block">CVV</label>
                    <input placeholder="•••" type="password" className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
                  </div>
                </div>
              </div>
            )}

            {method === "netbanking" && (
              <div className="grid grid-cols-3 gap-2">
                {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "Yes Bank"].map(bank => (
                  <button key={bank} className="border border-[#C9CBC2] rounded-md py-3 text-xs font-medium text-[#30342F] hover:border-[#D6A500] hover:text-[#755900] transition-colors">{bank}</button>
                ))}
              </div>
            )}

            {method === "wallet" && (
              <div className="bg-sky-50 rounded-md p-4 border border-sky-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#30342F]">InspirQ Wallet Balance</span>
                  <span className="text-lg font-bold text-sky-600">₹2,450</span>
                </div>
                <div className="text-xs text-[#5F635C]">After payment: ₹{(2450 - amount).toLocaleString()} remaining</div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-[#7D8178]">
              <Shield size={12} />
              <span>Secured by 256-bit SSL encryption · PCI DSS compliant</span>
            </div>

            <button onClick={pay} disabled={processing}
              className="w-full py-3.5 bg-[#FFC400] text-[#17140A] rounded-md font-bold hover:bg-[#D9A900] transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {processing ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Processing…</>
              ) : (
                <>Pay ₹{amount.toLocaleString()}</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function BookingModal({ venue, onClose, onConfirm }: { venue: typeof VENUES[0]; onClose: () => void; onConfirm: () => void }) {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-07-12");
  const [duration, setDuration] = useState("1");
  const [showPayment, setShowPayment] = useState(false);

  const total = venue.price * parseInt(duration) + 50;

  if (showPayment) {
    return <PaymentGatewayModal
      amount={total}
      description={`${venue.name} · ${selectedSlot} · ${duration}hr`}
      onClose={() => setShowPayment(false)}
      onSuccess={onConfirm}
    />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-md w-full max-w-lg shadow-2xl">
        <div className="p-6 border-b border-[#DFE0D8] flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#181A1F]">Book Slot</h3>
          <button aria-label="Close booking" onClick={onClose} className="p-2 hover:bg-[#DFE0D8] rounded-full"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3 bg-[#F7F7F3] rounded-md">
            <img src={venue.image} alt="" className="w-16 h-16 rounded-lg object-cover"
              onError={e => { (e.target as HTMLImageElement).src = "/inspirq-media/football.png"; }} />
            <div>
              <div className="font-semibold text-[#181A1F] text-sm">{venue.name}</div>
              <div className="text-xs text-[#5F635C] flex items-center gap-1 mt-0.5"><MapPin size={10} />{venue.location}</div>
              <div className="text-sky-600 font-semibold text-sm mt-1">₹{venue.price}/hr</div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[#30342F] mb-2 block">Select Date</label>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#30342F] mb-2 block">Available Slots</label>
            <div className="grid grid-cols-4 gap-2">
              {venue.slots.map(slot => (
                <button key={slot} onClick={() => setSelectedSlot(slot)}
                  className={`py-2 text-sm font-medium rounded-md border transition-all ${selectedSlot === slot ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "border-[#C9CBC2] text-[#464A45] hover:border-[#D6A500] hover:text-[#755900]"}`}>
                  {slot}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[#30342F] mb-2 block">Duration</label>
            <div className="flex gap-2">
              {["1", "2", "3"].map(d => (
                <button key={d} onClick={() => setDuration(d)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md border transition-all ${duration === d ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "border-[#C9CBC2] text-[#464A45] hover:border-[#D6A500]"}`}>
                  {d}hr
                </button>
              ))}
            </div>
          </div>
          {selectedSlot && (
            <div className="bg-sky-50 rounded-md p-3 border border-sky-100">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#464A45]">Slot cost</span>
                <span className="font-medium">₹{venue.price} × {duration}hr</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#464A45]">Platform fee</span>
                <span className="font-medium">₹50</span>
              </div>
              <div className="border-t border-sky-200 mt-2 pt-2 flex justify-between font-bold text-[#181A1F]">
                <span>Total</span>
                <span className="text-[#755900]">₹{total}</span>
              </div>
            </div>
          )}
        </div>
        <div className="p-6 pt-0 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-[#C9CBC2] rounded-md text-[#464A45] font-medium hover:bg-[#F7F7F3] transition-colors">Cancel</button>
          <button onClick={() => setShowPayment(true)} disabled={!selectedSlot}
            className="flex-1 py-3 bg-[#FFC400] text-[#17140A] rounded-md font-semibold hover:bg-[#D9A900] transition-colors disabled:opacity-50">
            Confirm & Pay
          </button>
        </div>
      </div>
    </div>
  );
}

export function Toast({ message, type = "success", onClose }: { message: string; type?: "success" | "error" | "info"; onClose: () => void }) {
  const colors = {
    success: "bg-[var(--color-success-text)] text-white",
    error: "bg-destructive text-destructive-foreground",
    info: "bg-[var(--color-info-text)] text-white",
  };
  const icons = { success: CheckCircle, error: XCircle, info: Info };
  const Icon = icons[type];
  return (
    <div className={`fixed bottom-6 right-6 z-[100] ${colors[type]} px-5 py-3.5 rounded-md shadow-2xl flex items-center gap-3 min-w-[280px]`}>
      <Icon size={18} className="shrink-0" />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button aria-label="Dismiss notification" onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={15} /></button>
    </div>
  );
}

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));

  const typeIcons: Record<string, any> = {
    booking: Calendar, tournament: Trophy, message: MessageSquare,
    payment: CreditCard, review: Star, reward: Award
  };
  const typeColors: Record<string, string> = {
    booking: "#FFC400", tournament: "#C08B3E", message: "#3F718B",
    payment: "#765A88", review: "#C08B3E", reward: "#B84A4A"
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-md shadow-2xl border border-[#DFE0D8] z-50 overflow-hidden">
      <div className="px-5 py-4 border-b border-[#DFE0D8] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-[#181A1F]">Notifications</h3>
          <span className="bg-[#FFC400] text-[#17140A] text-xs font-bold px-2 py-0.5 rounded-full">
            {notifications.filter(n => !n.read).length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={markAllRead} className="text-xs text-[#755900] font-medium hover:underline">Mark all read</button>
          <button aria-label="Close notifications" onClick={onClose} className="p-1 hover:bg-[#DFE0D8] rounded-full"><X size={15} className="text-[#7D8178]" /></button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto divide-y divide-[#F7F7F3]">
        {notifications.map(n => {
          const Icon = typeIcons[n.type] || Bell;
          return (
            <div key={n.id} className={`px-5 py-3.5 flex items-start gap-3 hover:bg-[#F7F7F3]/70 transition-colors ${!n.read ? "bg-[#FFC400]/3" : ""}`}>
              <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0" style={{ background: typeColors[n.type] + "18" }}>
                <Icon size={16} style={{ color: typeColors[n.type] }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold text-[#181A1F] flex items-center gap-1.5">
                    {n.title}
                    {!n.read && <span className="w-2 h-2 bg-[#FFC400] rounded-full inline-block" />}
                  </div>
                  <button aria-label={`Dismiss ${n.title}`} onClick={() => dismiss(n.id)} className="shrink-0">
                    <X size={12} className="text-[#A5A89E]" />
                  </button>
                </div>
                <div className="text-xs text-[#5F635C] mt-0.5 leading-relaxed">{n.body}</div>
                <div className="text-xs text-[#7D8178] mt-1">{n.time}</div>
              </div>
            </div>
          );
        })}
        {notifications.length === 0 && (
          <div className="py-12 text-center text-[#7D8178] text-sm">All caught up! 🎉</div>
        )}
      </div>
      <div className="px-5 py-3 border-t border-[#DFE0D8]">
        <button className="w-full text-center text-sm text-[#755900] font-medium hover:underline">View all notifications</button>
      </div>
    </div>
  );
}

export function Sidebar({ role, currentPage, onNavigate, onLogout }: {
  role: Role; currentPage: Page; onNavigate: (p: Page) => void; onLogout: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const navs: Record<Role, { icon: any; label: string; page: Page; divider?: boolean }[]> = {
    player: [
      { icon: Home, label: "Dashboard", page: "player-home" },
      { icon: Building2, label: "Find Arenas", page: "player-venues" },
      { icon: Users, label: "Find Games", page: "player-games" },
      { icon: Trophy, label: "Find Tournaments", page: "player-tournaments" },
      { icon: Dumbbell, label: "Find Coaches", page: "player-training" },
      { icon: Search, label: "Advanced Search", page: "player-search" },
      { icon: Calendar, label: "My Bookings", page: "player-bookings" },
      { icon: BarChart2, label: "Scorecard", page: "player-scorecard" },
      { icon: Award, label: "Achievements", page: "player-achievements", divider: true },
      { icon: Users, label: "My Hosted Games", page: "player-my-games" },
      { icon: FileText, label: "Invoices", page: "player-invoices" },
      { icon: Wallet, label: "Wallet", page: "player-wallet" },
      { icon: UserCheck, label: "Profile / KYC", page: "player-profile" },
      { icon: Settings, label: "Settings", page: "player-settings" },
      { icon: Headphones, label: "Support", page: "support-tickets" },
    ],
    venue: [
      { icon: Home, label: "Dashboard", page: "venue-dashboard" },
      { icon: Building2, label: "My Venues", page: "venue-list" },
      { icon: Calendar, label: "Bookings", page: "venue-bookings" },
      { icon: ShoppingCart as any, label: "Inventory & POS", page: "venue-pos", divider: true },
      { icon: BarChart2, label: "Revenue & Analytics", page: "venue-revenue" },
      { icon: Users, label: "Customers", page: "venue-customers" },
      { icon: Tag, label: "Expenses", page: "venue-expenses" },
      { icon: Award, label: "Subscriptions", page: "venue-subscriptions" },
      { icon: FileText, label: "Invoice Generator", page: "venue-invoice" },
      { icon: QrCode, label: "QR & Barcodes", page: "venue-codes" },
      { icon: Settings, label: "Data Settings", page: "venue-data-settings" },
      { icon: Headphones, label: "Support", page: "support-tickets" },
    ],
    trainer: [
      { icon: Home, label: "Coach Overview", page: "trainer-dashboard" },
      { icon: Calendar, label: "Sessions & Publishing", page: "trainer-sessions" },
      { icon: Users, label: "Clients", page: "trainer-students" },
      { icon: Target, label: "Programs & Progress", page: "trainer-programs" },
      { icon: UserCheck, label: "Enquiries & Trials", page: "trainer-leads" },
      { icon: ShoppingCart as any, label: "Inventory & POS", page: "trainer-pos", divider: true },
      { icon: BarChart2, label: "Revenue & Analytics", page: "trainer-revenue" },
      { icon: Tag, label: "Expenses", page: "trainer-expenses" },
      { icon: FileText, label: "Quotes & Invoices", page: "trainer-invoice" },
      { icon: QrCode, label: "QR & Barcodes", page: "trainer-codes" },
      { icon: Headphones, label: "Support", page: "support-tickets" },
    ],
    organizer: [
      { icon: Home, label: "Organiser Overview", page: "organizer-dashboard" },
      { icon: Trophy, label: "Events & Publishing", page: "organizer-tournaments" },
      { icon: Users, label: "Registrations", page: "organizer-registrations" },
      { icon: ClipboardList, label: "Event Readiness", page: "organizer-operations" },
      { icon: Target, label: "Brackets", page: "organizer-brackets" },
      { icon: CheckCircle, label: "Results", page: "organizer-scorecard" },
      { icon: ShoppingCart, label: "Inventory & POS", page: "organizer-pos", divider: true },
      { icon: BarChart2, label: "Revenue & Analytics", page: "organizer-revenue" },
      { icon: FileText, label: "Quotes & Invoices", page: "organizer-invoice" },
      { icon: QrCode, label: "QR & Barcodes", page: "organizer-codes" },
      { icon: Headphones, label: "Support", page: "support" },
    ],
    admin: [
      { icon: Home, label: "Dashboard", page: "admin-dashboard" },
      { icon: Users, label: "Users", page: "admin-users" },
      { icon: Building2, label: "Venues", page: "admin-venues" },
      { icon: BarChart2, label: "Revenue & Analytics", page: "admin-revenue" },
      { icon: Award, label: "Subscriptions", page: "admin-subscriptions" },
      { icon: Tag, label: "Pricing", page: "admin-pricing" },
      { icon: UserCheck, label: "KYC Approvals", page: "admin-kyc", divider: true },
      { icon: Shield, label: "Disputes & Risk", page: "admin-disputes" },
      { icon: Activity, label: "Attributes", page: "admin-attributes" },
      { icon: QrCode, label: "QR & Barcodes", page: "admin-codes" },
      { icon: Settings, label: "Settings", page: "admin-settings" },
    ],
    guest: [],
  };

  const items = navs[role] || [];

  return (
    <aside className={`${collapsed ? "w-[4.5rem]" : "w-64"} h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-all duration-300 shrink-0 shadow-[4px_0_24px_rgba(11,31,58,0.12)]`}>
      <div className="h-[4.5rem] px-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#FFC400] rounded-xl flex items-center justify-center shadow-sm">
              <Zap size={16} className="text-[#17140A]" />
            </div>
            <div>
              <span className="block font-['Lexend'] font-bold text-white text-sm leading-tight">InspirQ</span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-white/60">Sport OS</span>
            </div>
          </div>
        )}
        <button aria-label={collapsed ? "Expand navigation" : "Collapse navigation"} onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label={`${role} navigation`}>
        {items.map(item => (
          <div key={item.page}>
            {item.divider && !collapsed && <div className="border-t border-white/10 my-3 mx-2" />}
            {item.divider && collapsed && <div className="border-t border-white/10 my-3" />}
            <button onClick={() => onNavigate(item.page)}
              title={collapsed ? item.label : undefined}
              aria-current={currentPage === item.page ? "page" : undefined}
              className={`w-full min-h-10 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${currentPage === item.page ? "bg-primary text-primary-foreground shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
              <item.icon size={17} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          </div>
        ))}
      </nav>

    </aside>
  );
}

// ─── DataTable ────────────────────────────────────────────────────────────────

export type ColDef<T> = {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => ReactNode;
};

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 8,
  searchable = true,
  searchPlaceholder = "Search...",
  emptyText = "No data found",
  emptyIcon,
  title,
  actions,
}: {
  data: T[];
  columns: ColDef<T>[];
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
  emptyIcon?: ReactNode;
  title?: string;
  actions?: ReactNode;
}) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [searchColumn, setSearchColumn] = useState("all");

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(r => searchColumn === "all"
        ? Object.values(r).some(v => String(v ?? "").toLowerCase().includes(q))
        : String(r[searchColumn] ?? "").toLowerCase().includes(q)
      );
    }
    if (sortKey) {
      rows.sort((a, b) => {
        const av = a[sortKey] ?? "";
        const bv = b[sortKey] ?? "";
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [data, search, searchColumn, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const exportRows = () => {
    const rows = selectedRows.size ? filtered.filter((_, index) => selectedRows.has(index)) : filtered;
    if (!rows.length) return;
    const headers = columns.map((column) => String(column.key));
    const escape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => escape(row[header])).join(","))].join("\n");
    const anchor = window.document.createElement("a");
    anchor.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    anchor.download = `${title || "table"}-export.csv`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  };

  const SortIcon = ({ col }: { col: ColDef<T> }) => {
    if (col.sortable === false || col.key === "actions") return null;
    const k = col.key as string;
    if (sortKey !== k) return <ChevronsUpDown size={13} className="text-[#A5A89E] ml-1" />;
    return sortDir === "asc"
      ? <ChevronUp size={13} className="text-[#755900] ml-1" />
      : <ChevronDown size={13} className="text-[#755900] ml-1" />;
  };

  return (
    <div className="bg-white rounded-md border border-[#C9CBC2] shadow-sm overflow-hidden">
      {/* Header bar */}
      {(title || actions || searchable) && (
        <div className="px-4 py-3 border-b border-[#DFE0D8] flex items-center gap-3 flex-wrap">
          {title && <h3 className="font-semibold text-[#181A1F] text-sm">{title}</h3>}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <UiButton variant="outline" size="sm" onClick={exportRows}><Download />Export{selectedRows.size ? ` (${selectedRows.size})` : ""}</UiButton>
            {searchable && (
              <select
                aria-label="Filter table by column"
                value={searchColumn}
                onChange={event => { setSearchColumn(event.target.value); setPage(1); }}
                className="h-8 rounded-md border border-[#C9CBC2] bg-white px-2 text-xs text-[#464A45] outline-none focus:border-[#D6A500]"
              >
                <option value="all">All columns</option>
                {columns.filter(column => column.key !== "actions").map(column => (
                  <option key={String(column.key)} value={String(column.key)}>{column.label}</option>
                ))}
              </select>
            )}
            {searchable && (
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8178]" />
                <input
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="pl-8 pr-3 py-1.5 text-sm border border-[#C9CBC2] rounded-md outline-none focus:border-[#D6A500] w-44 transition-colors"
                />
              </div>
            )}
            {actions}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FFC400]/10 border-b border-[#D6A500]/20">
              <th className="w-10 px-4 py-3"><Checkbox checked={filtered.length > 0 && selectedRows.size === filtered.length} onCheckedChange={(checked) => setSelectedRows(checked ? new Set(filtered.map((_, index) => index)) : new Set())} /></th>
              {columns.map(col => (
                <th
                  key={col.key as string}
                  style={col.width ? { width: col.width } : undefined}
                  className={`px-4 py-3 text-left text-xs font-semibold text-[#151713] uppercase tracking-wide ${col.sortable === false || col.key === "actions" ? "" : "cursor-pointer hover:text-[#30342F] select-none"}`}
                  onClick={col.sortable === false || col.key === "actions" ? undefined : () => handleSort(col.key as string)}
                >
                  <span className="flex items-center">
                    {col.label}
                    <SortIcon col={col} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F7F7F3]">
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-[#7D8178]">
                  <div className="flex flex-col items-center gap-2">
                    {emptyIcon || <Filter size={32} className="opacity-20" />}
                    <span className="text-sm">{emptyText}</span>
                  </div>
                </td>
              </tr>
            ) : pageData.map((row, idx) => {
              const absoluteIndex = filtered.indexOf(row);
              return (
              <tr key={idx} className="hover:bg-[#F7F7F3]/60 transition-colors">
                <td className="px-4 py-3"><Checkbox checked={selectedRows.has(absoluteIndex)} onCheckedChange={(checked) => setSelectedRows((current) => { const next = new Set(current); checked ? next.add(absoluteIndex) : next.delete(absoluteIndex); return next; })} /></td>
                {columns.map(col => (
                  <td key={col.key as string} className="px-4 py-3 text-[#30342F]">
                    {col.render ? col.render(row[col.key as string], row) : String(row[col.key as string] ?? "—")}
                  </td>
                ))}
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > pageSize && (
        <div className="px-4 py-3 border-t border-[#DFE0D8] flex items-center justify-between">
          <span className="text-xs text-[#7D8178]">
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} rows
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md text-[#5F635C] hover:bg-[#DFE0D8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page + i - 2;
              if (pg < 1 || pg > totalPages) return null;
              return (
                <button key={pg} onClick={() => setPage(pg)}
                  className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${pg === page ? "bg-[#FFC400] text-[#17140A]" : "text-[#5F635C] hover:bg-[#DFE0D8]"}`}>
                  {pg}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-md text-[#5F635C] hover:bg-[#DFE0D8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PageHeader ───────────────────────────────────────────────────────────────

export function PageHeader({ title, subtitle, action, breadcrumb }: {
  title: string; subtitle?: string; action?: React.ReactNode; breadcrumb?: string;
}) {
  return (
    <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="text-xl font-bold text-[#181A1F] font-['Lexend']">{title}</div>
      {action && <div className="w-full sm:w-auto sm:shrink-0">{action}</div>}
    </div>
  );
}

// ─── FilterBar ────────────────────────────────────────────────────────────────

export function FilterBar({ search, onSearch, filters, viewMode, onViewMode, placeholder }: {
  search: string; onSearch: (v: string) => void;
  filters?: { label: string; value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }[];
  viewMode?: "card" | "list"; onViewMode?: (m: "card" | "list") => void; placeholder?: string;
}) {
  return (
    <div className="px-6 py-3 bg-white border-b border-[#DFE0D8] flex items-center gap-3 flex-wrap">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8178]" />
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder={placeholder || "Search..."}
          className="pl-9 pr-3 py-2 text-sm border border-[#C9CBC2] rounded-md outline-none focus:border-[#D6A500] w-52 transition-colors"
        />
      </div>
      {filters && filters.map(f => (
        <select
          key={f.label}
          value={f.value}
          onChange={e => f.onChange(e.target.value)}
          className="w-36 py-2 px-2.5 text-sm border border-[#C9CBC2] rounded-md outline-none focus:border-[#D6A500] text-[#464A45] transition-colors"
        >
          {f.options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ))}
      {viewMode && onViewMode && (
        <div className="ml-auto flex items-center gap-1 border border-[#C9CBC2] rounded-md p-0.5">
          <button
            onClick={() => onViewMode("card")}
            className={`p-1.5 rounded transition-colors ${viewMode === "card" ? "bg-[#FFC400] text-[#17140A]" : "text-[#7D8178] hover:text-[#464A45]"}`}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => onViewMode("list")}
            className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-[#FFC400] text-[#17140A]" : "text-[#7D8178] hover:text-[#464A45]"}`}
          >
            <List size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Image upload ──────────────────────────────────────────────────────────────

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Choose a PNG, JPG, or WebP image."));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      reject(new Error("Images must be 5 MB or smaller."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read this image."));
    reader.onerror = () => reject(new Error("Could not read this image."));
    reader.readAsDataURL(file);
  });
}

export function ImageUpload({ value, onChange, label = "Upload image" }: {
  value?: string;
  onChange: (image: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const selectFile = async (file?: File) => {
    if (!file) return;
    try {
      onChange(await readImage(file));
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not upload this image.");
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    void selectFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    void selectFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-2">
      <div
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`overflow-hidden rounded-lg border-2 border-dashed bg-muted/30 transition-colors ${dragging ? "border-primary bg-primary/10" : "border-border"}`}
      >
        {value ? (
          <div className="relative aspect-video">
            <img src={value} alt="Selected upload preview" className="size-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">
              <UiButton type="button" size="sm" variant="secondary" onClick={() => inputRef.current?.click()}><Upload /> Replace</UiButton>
              <UiButton type="button" size="sm" variant="destructive" onClick={() => onChange("")}><X /> Remove</UiButton>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-video w-full flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-brand-text"><Upload /></span>
            <span className="text-sm font-semibold text-foreground">{label}</span>
            <span className="text-xs">Drag and drop or choose a PNG, JPG, or WebP file up to 5 MB</span>
          </button>
        )}
      </div>
      <input ref={inputRef} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleInput} />
      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function ImageUploadGrid({ images, onChange, maxImages = 5 }: {
  images: string[]; onChange: (imgs: string[]) => void; maxImages?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  const addImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const available = Math.max(0, maxImages - images.length);
    const files = Array.from(event.target.files || []).slice(0, available);
    try {
      const uploaded = await Promise.all(files.map(readImage));
      onChange([...images, ...uploaded]);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not upload these images.");
    }
    event.target.value = "";
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {images.map((url, idx) => (
          <div key={idx} className="relative w-16 h-16 rounded-md overflow-hidden group border border-[#C9CBC2]">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              aria-label={`Remove image ${idx + 1}`}
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-16 h-16 rounded-md border-2 border-dashed border-[#A5A89E] flex flex-col items-center justify-center text-[#7D8178] hover:border-[#D6A500] hover:text-[#755900] transition-colors"
          >
            <Upload size={16} />
            <span className="text-xs mt-0.5">Add</span>
          </button>
        )}
      </div>
      <input ref={inputRef} className="sr-only" type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={addImages} />
      <p className="text-xs text-[#7D8178]">PNG, JPG, or WebP · 5 MB max per image · {images.length}/{maxImages} selected</p>
      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── QRBookingCard ────────────────────────────────────────────────────────────

export function QRBookingCard({ bookingId, title, date, time, venue, amount, onClose }: {
  bookingId: string; title: string; date: string; time: string; venue: string; amount: number; onClose?: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Energy yellow header */}
        <div className="bg-gradient-to-br from-[#FFC400] to-[#D9A900] px-6 py-5 text-[#17140A] text-center relative">
          {onClose && (
            <button onClick={onClose} className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-full">
              <X size={16} />
            </button>
          )}
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle size={24} className="text-[#17140A]" />
          </div>
          <div className="font-bold text-lg">Booking Confirmed!</div>
          <div className="text-[#3B310F] text-sm mt-0.5">{title}</div>
        </div>

        {/* QR code */}
        <div className="flex flex-col items-center px-6 py-5 gap-4">
          <QRCodeSVG value={`INSPIRQ-${bookingId}`} size={150} bgColor="#ffffff" fgColor="#182131" level="M" includeMargin />

          <div className="text-center space-y-1">
            <div className="font-mono text-sm font-bold text-[#755900] tracking-wider">{bookingId}</div>
            <div className="font-semibold text-[#181A1F]">{title}</div>
            <div className="text-sm text-[#5F635C] flex items-center justify-center gap-3">
              <span>{date}</span>
              <span>·</span>
              <span>{time}</span>
            </div>
            <div className="text-sm text-[#5F635C]">{venue}</div>
            <div className="text-xl font-bold text-[#181A1F] mt-1">₹{amount.toLocaleString()}</div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 w-full">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-[#C9CBC2] rounded-lg text-sm text-[#464A45] hover:bg-[#F7F7F3] transition-colors">
              <Download size={14} /> Download
            </button>
            <button aria-label="Share" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-[#C9CBC2] rounded-lg text-sm text-[#464A45] hover:bg-[#F7F7F3] transition-colors"><Share2 size={14} /> Share
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-[#C9CBC2] rounded-lg text-sm text-[#464A45] hover:bg-[#F7F7F3] transition-colors">
              <QrCode size={14} /> Print
            </button>
          </div>

          {onClose && (
            <button onClick={onClose} className="w-full py-3 bg-[#FFC400] text-[#17140A] rounded-lg font-semibold hover:bg-[#D9A900] transition-colors">
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── B2C Nav items (no Open Games) ────────────────────────────────────────────
const B2C_NAV = [
  { label: "Home",         page: "landing"            as Page },
  { label: "Find Arenas",  page: "player-venues"      as Page },
  { label: "Tournaments",  page: "player-tournaments" as Page },
  { label: "Coaches",      page: "player-training"    as Page },
];

export interface GlobalHeaderProfileItem {
  label: string;
  page: Page;
  icon: React.ElementType;
}

export interface GlobalHeaderProps {
  currentPage?: Page;
  onNavigate: (p: Page, ctx?: any) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  userName?: string;
  userEmail?: string;
  userInitial?: string;
  unreadNotifications?: number;
  profileMenuItems?: GlobalHeaderProfileItem[];
  coinBalance?: number;
}

export function GlobalHeader({
  currentPage,
  onNavigate,
  isLoggedIn = false,
  onLogout,
  userName = "Arjun Mehta",
  userEmail = "arjun@example.com",
  userInitial = "A",
  unreadNotifications = 0,
  profileMenuItems = [],
  coinBalance = 0,
}: GlobalHeaderProps) {
  const [cityOpen, setCityOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Bangalore");

  const nav = (p: Page, ctx?: any) => {
    onNavigate(p, ctx);
    setCityOpen(false);
    setProfileOpen(false);
    setNotifOpen(false);
    setMobileOpen(false);
  };

  const closeAll = () => { setCityOpen(false); setProfileOpen(false); setNotifOpen(false); };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-[#DFE0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center relative">

          {/* Left: Logo + City */}
          <div className="flex items-center gap-3 flex-none">
            <button onClick={() => nav("landing")} className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-[#FFC400] rounded-md flex items-center justify-center shadow-sm">
                <Zap size={15} className="text-[#17140A] fill-[#17140A]" />
              </div>
              <span className="text-[#151713] font-bold text-lg tracking-tight hidden sm:block">InspirQ</span>
              <span className="hidden lg:inline text-xs text-[#7D8178] font-medium bg-[#EFEFE9] px-2 py-0.5 rounded-full">Sport</span>
            </button>

            {/* City selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => { setCityOpen(v => !v); setProfileOpen(false); setNotifOpen(false); }}
                className="flex items-center gap-1.5 border border-[#DFE0D8] rounded-md px-2.5 py-1.5 text-xs font-medium text-[#222520] hover:border-[#D6A500]/50 hover:text-[#755900] transition-colors bg-[#F7F7F3]">
                <MapPin size={11} className="text-[#755900]" />
                {selectedCity}
                <ChevronDown size={11} className={`text-[#A5A89E] transition-transform duration-200 ${cityOpen ? "rotate-180" : ""}`} />
              </button>
              {cityOpen && (
                <div className="absolute left-0 top-9 bg-white rounded-md shadow-xl border border-[#DFE0D8] py-1 z-50 min-w-[160px]">
                  {CITIES.map(c => (
                    <button key={c} onClick={() => { setSelectedCity(c); setCityOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-[#F7F7F3] transition-colors ${c === selectedCity ? "text-[#755900] font-semibold" : "text-[#222520]"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center: Nav (absolutely centered) */}
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-0.5">
            {B2C_NAV.map(item => (
              <button key={item.page} onClick={() => nav(item.page)}
                className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${currentPage === item.page ? "text-[#755900] bg-[#FFF9D6]" : "text-[#464A45] hover:text-[#755900] hover:bg-[#F7F7F3]"}`}>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right: Auth or Profile */}
          <div className="flex items-center gap-1.5 ml-auto flex-none">
            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); closeAll(); setNotifOpen(v => !v); }}
                    className="relative p-2 text-[#464A45] hover:bg-[#F7F7F3] rounded-md transition-colors">
                    <Bell size={18} />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">{unreadNotifications}</span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-12 z-50">
                      <NotificationsPanel onClose={() => setNotifOpen(false)} />
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div className="relative">
                  <button onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#F7F7F3] transition-colors">
                    <div className="w-8 h-8 bg-[#FFC400] rounded-full flex items-center justify-center text-[#17140A] text-sm font-bold shrink-0">{userInitial}</div>
                    <span className="hidden md:block text-sm font-medium text-[#222520] max-w-[110px] truncate">{userName.split(" ")[0]}</span>
                    <ChevronDown size={12} className={`hidden md:block text-[#A5A89E] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-white rounded-md shadow-xl border border-[#DFE0D8] py-1 z-50">
                      <div className="px-4 py-3 border-b border-[#EFEFE9]">
                        <div className="text-sm font-semibold text-[#151713]">{userName}</div>
                        <div className="text-xs text-[#7D8178] mt-0.5">{userEmail}</div>
                      </div>
                      {coinBalance > 0 && (
                        <div className="px-4 py-2 border-b border-[#EFEFE9] flex items-center justify-between">
                          <span className="text-xs text-[#5F635C] flex items-center gap-1.5">🪙 InspirQ Coins</span>
                          <span className="text-sm font-bold text-[#755900]">{coinBalance.toLocaleString()}</span>
                        </div>
                      )}
                      {profileMenuItems.map(item => (
                        <button key={String(item.page)} onClick={() => nav(item.page)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#222520] hover:bg-[#F7F7F3] transition-colors text-left">
                          <item.icon size={14} className="text-[#7D8178]" />{item.label}
                        </button>
                      ))}
                      {onLogout && (
                        <div className="border-t border-[#EFEFE9] mt-1 pt-1">
                          <button onClick={onLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                            <LogOut size={14} /> Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button onClick={() => nav("auth")}
                  className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#464A45] hover:text-[#755900] px-3 py-2 rounded-md hover:bg-[#F7F7F3] transition-colors">
                  <LogIn size={14} /> Login
                </button>
                <button onClick={() => nav("auth")}
                  className="bg-[#FFC400] text-[#17140A] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#D9A900] transition-colors flex items-center gap-1.5 shadow-sm">
                  <UserPlus size={14} className="hidden sm:block" />
                  <span className="hidden sm:block">Sign Up Free</span>
                  <span className="sm:hidden">Join</span>
                </button>
              </>
            )}
            {/* Mobile hamburger */}
            <button aria-label="Open navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-[#464A45] hover:bg-[#F7F7F3] rounded-md ml-0.5">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#DFE0D8]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#FFC400] rounded-md flex items-center justify-center">
                  <Zap size={13} className="text-[#17140A]" />
                </div>
                <span className="font-bold text-[#151713]">InspirQ</span>
              </div>
              <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="p-1.5 hover:bg-[#EFEFE9] rounded-md">
                <X size={18} className="text-[#464A45]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {/* City selector mobile */}
              <div className="px-3 py-2 mb-2">
                <label className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-1.5 block">Location</label>
                <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
                  className="w-full border border-[#DFE0D8] rounded-md px-3 py-2 text-sm text-[#222520] bg-[#F7F7F3] focus:outline-none">
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="text-xs font-bold text-[#7D8178] uppercase tracking-wider px-3 mb-1">Browse</div>
              {B2C_NAV.map(item => (
                <button key={item.page} onClick={() => nav(item.page)}
                  className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors ${currentPage === item.page ? "text-[#755900] bg-[#FFF9D6]" : "text-[#222520] hover:bg-[#F7F7F3]"}`}>
                  {item.label}
                </button>
              ))}
              {isLoggedIn && profileMenuItems.length > 0 && (
                <>
                  <div className="border-t border-[#EFEFE9] my-2" />
                  <div className="text-xs font-bold text-[#7D8178] uppercase tracking-wider px-3 mb-1">Account</div>
                  {profileMenuItems.map(item => (
                    <button key={String(item.page)} onClick={() => nav(item.page)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#222520] hover:bg-[#F7F7F3] transition-colors rounded-md text-left">
                      <item.icon size={14} className="text-[#7D8178]" />{item.label}
                    </button>
                  ))}
                </>
              )}
            </div>
            <div className="p-4 border-t border-[#DFE0D8] space-y-2">
              {isLoggedIn ? (
                <button onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={14} /> Sign Out
                </button>
              ) : (
                <>
                  <button onClick={() => nav("auth")}
                    className="w-full py-2.5 border border-[#DFE0D8] rounded-md text-sm font-semibold text-[#222520] hover:border-[#D6A500] hover:text-[#755900] transition-colors">
                    Log In
                  </button>
                  <button onClick={() => nav("auth")}
                    className="w-full py-2.5 bg-[#FFC400] text-[#17140A] rounded-md text-sm font-bold hover:bg-[#D9A900] transition-colors">
                    Sign Up Free
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── DataTableColumn (for new-style DataTable usage) ──────────────────────────

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  width?: string;
  align?: "left" | "right" | "center";
}

export function DataTableNew<T extends Record<string, unknown>>({
  columns,
  data,
  title,
  searchKey,
  pageSize = 10,
  className = "",
}: {
  columns: DataTableColumn<T>[];
  data: T[];
  title?: string;
  searchKey?: keyof T;
  pageSize?: number;
  className?: string;
}) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const handleSort = (key: keyof T, sortable?: boolean) => {
    if (sortable === false) return;
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let rows = data;
    if (search && searchKey) {
      rows = rows.filter(row => String(row[searchKey]).toLowerCase().includes(search.toLowerCase()));
    }
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
        return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }
    return rows;
  }, [data, search, searchKey, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const exportCSV = () => {
    const headers = columns.map(c => c.label).join(",");
    const rows = filtered.map(row => columns.map(c => `"${String(row[c.key] ?? "")}"`).join(",")).join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${title || "export"}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ col }: { col: DataTableColumn<T> }) => {
    if (col.sortable === false) return null;
    if (sortKey !== col.key) return <ArrowUpDown size={11} className="text-[#D3A514]/50 ml-1 shrink-0" />;
    return sortDir === "asc"
      ? <ArrowUp size={11} className="text-[#755900] ml-1 shrink-0" />
      : <ArrowDown size={11} className="text-[#755900] ml-1 shrink-0" />;
  };

  return (
    <div className={`bg-white rounded-md border border-[#DFE0D8] overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-[#DFE0D8] flex flex-wrap items-center gap-3">
        {title && <h3 className="font-semibold text-[#151713] text-sm flex-none">{title}</h3>}
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {searchKey && (
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7D8178]" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search…"
                className="pl-8 pr-3 py-1.5 text-xs border border-[#DFE0D8] rounded-md bg-[#F7F7F3] focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 w-44 text-[#222520] placeholder:text-[#A5A89E]"
              />
            </div>
          )}
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#DFE0D8] rounded-md text-xs font-medium text-[#464A45] hover:bg-[#F7F7F3] hover:border-[#C9CBC2] transition-colors">
            <Download size={12} /> Export
          </button>
          <button aria-label="Share" className="flex items-center gap-1.5 px-3 py-1.5 border border-[#DFE0D8] rounded-md text-xs font-medium text-[#464A45] hover:bg-[#F7F7F3] hover:border-[#C9CBC2] transition-colors"><Share2 size={12} /> Share
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  onClick={() => handleSort(col.key, col.sortable)}
                  style={{ width: col.width }}
                  className={`px-4 py-3 bg-[#FFF9D6] text-[#755900] text-xs font-bold uppercase tracking-wider border-b border-[#FFF0A3] text-${col.align || "left"} ${col.sortable !== false ? "cursor-pointer select-none hover:bg-[#FFF0A3] transition-colors" : ""} whitespace-nowrap`}>
                  <div className={`flex items-center gap-0 ${col.align === "right" ? "justify-end" : col.align === "center" ? "justify-center" : ""}`}>
                    {col.label}
                    <SortIcon col={col} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, idx) => (
              <tr key={idx}
                className={`border-b border-[#EFEFE9] hover:bg-[#FFF9D6]/40 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[#F7F7F3]"}`}>
                {columns.map(col => (
                  <td key={String(col.key)} className={`px-4 py-3 text-[#222520] text-${col.align || "left"}`}>
                    {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[#7D8178] text-sm">
                  No data found{search ? ` for "${search}"` : ""}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-[#EFEFE9] flex items-center justify-between text-xs text-[#5F635C] bg-white">
          <span>{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} rows</span>
          <div className="flex items-center gap-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-2.5 py-1.5 border border-[#DFE0D8] rounded-md hover:bg-[#F7F7F3] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-[#222520]">‹</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              return start + i;
            }).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${page === p ? "bg-[#FFC400] text-[#17140A]" : "border border-[#DFE0D8] hover:bg-[#F7F7F3] text-[#222520]"}`}>
                {p}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="px-2.5 py-1.5 border border-[#DFE0D8] rounded-md hover:bg-[#F7F7F3] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-[#222520]">›</button>
          </div>
        </div>
      )}
    </div>
  );
}
