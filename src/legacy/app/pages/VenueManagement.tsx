import { useState, useRef, useEffect } from "react";
import {
  Plus, X, Edit2, Trash2, CheckCircle, Send, BarChart2, DollarSign,
  Package, Users, Clock, Settings, TrendingUp, ShoppingCart, Brain, Zap,
  AlertCircle, ChevronDown, Download, Search, Tag, Percent, FileText,
  Activity, ArrowUp, ArrowDown, RefreshCw, Sparkles, MessageSquare,
  Target, Lightbulb, TrendingDown, Calendar
} from "lucide-react";
import { StatCard, Badge, DataTable, PageHeader } from "../components";
import type { ColDef } from "../components";
import { SPORTS } from "../data";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend, Area, AreaChart
} from "recharts";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#181A1F] text-white px-4 py-3 rounded-lg shadow-xl text-sm">
      <CheckCircle size={16} className="text-[#755900]" />{msg}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#DFE0D8] sticky top-0 bg-white">
          <h2 className="font-semibold text-[#181A1F]">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#DFE0D8] rounded-full transition-colors"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#464A45] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inp = "w-full border border-[#C9CBC2] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]";

// ─── 1. VenuePOS ──────────────────────────────────────────────────────────────

const POS_PRODUCTS = [
  { id: 1, name: "Shuttle Tube", price: 120, stock: 48, cat: "Equipment", minStock: 10 },
  { id: 2, name: "Grip Tape", price: 80, stock: 7, cat: "Equipment", minStock: 10 },
  { id: 3, name: "Water Bottle", price: 30, stock: 100, cat: "Beverages", minStock: 20 },
  { id: 4, name: "Energy Drink", price: 60, stock: 3, cat: "Beverages", minStock: 10 },
  { id: 5, name: "Racket Rental", price: 100, stock: 12, cat: "Rental", minStock: 5 },
  { id: 6, name: "Sports Towel", price: 150, stock: 20, cat: "Accessories", minStock: 5 },
  { id: 7, name: "Knee Brace", price: 350, stock: 10, cat: "Accessories", minStock: 3 },
  { id: 8, name: "Badminton Racket", price: 499, stock: 6, cat: "Equipment", minStock: 4 },
];

const ORDER_HISTORY = [
  { id: "ORD-2026-001", time: "10:32 AM", customer: "Arjun Mehta", items: "2× Shuttle Tube, 1× Grip Tape", subtotal: 320, gst: 58, promo: "SPORT10 (-₹32)", total: 346, mode: "UPI", status: "completed" },
  { id: "ORD-2026-002", time: "09:55 AM", customer: "Priya Sharma", items: "1× Water Bottle", subtotal: 30, gst: 5, promo: "—", total: 35, mode: "Cash", status: "completed" },
  { id: "ORD-2026-003", time: "09:12 AM", customer: "Ravi Kumar", items: "1× Racket Rental, 2× Energy Drink", subtotal: 220, gst: 40, promo: "—", total: 260, mode: "Card", status: "completed" },
  { id: "ORD-2026-004", time: "08:45 AM", customer: "Deepa Nair", items: "1× Sports Towel", subtotal: 150, gst: 27, promo: "MEMBER15 (-₹22)", total: 155, mode: "UPI", status: "completed" },
  { id: "ORD-2026-005", time: "08:10 AM", customer: "Suresh Pillai", items: "1× Knee Brace", subtotal: 350, gst: 63, promo: "—", total: 413, mode: "Cash", status: "refunded" },
  { id: "ORD-2026-006", time: "07:50 AM", customer: "Kiran Reddy", items: "2× Energy Drink, 1× Grip Tape", subtotal: 200, gst: 36, promo: "—", total: 236, mode: "UPI", status: "completed" },
];

const REFUNDS_DATA = [
  { id: "REF-001", orderId: "ORD-2026-005", customer: "Suresh Pillai", items: "1× Knee Brace", amount: 413, reason: "Product defective on delivery", date: "2026-07-15", status: "approved", mode: "Cash" },
  { id: "REF-002", orderId: "ORD-2026-009", customer: "Kiran Reddy", items: "2× Energy Drink", amount: 130, reason: "Wrong flavour delivered", date: "2026-07-12", status: "pending", mode: "UPI" },
  { id: "REF-003", orderId: "ORD-2026-003", customer: "Ravi Kumar", items: "1× Racket Rental", amount: 100, reason: "Racket damaged during use", date: "2026-07-10", status: "rejected", mode: "Card" },
];

const PROMO_CODES: Record<string, number> = { SPORT10: 10, FIRST20: 20, MEMBER15: 15, WEEKEND25: 25 };

type CartItem = { product: typeof POS_PRODUCTS[0]; qty: number };
type Product = typeof POS_PRODUCTS[0];

function stockLabel(p: Product) {
  if (p.stock === 0) return "Out";
  if (p.stock < p.minStock) return `Low (${p.stock})`;
  return null;
}

const CAT_ICONS: Record<string, string> = { Equipment: "🏸", Beverages: "🥤", Rental: "🎾", Accessories: "🛡️" };

export function VenuePOS() {
  const [posTab, setPosTab] = useState<"pos" | "orders" | "refunds">("pos");

  // POS state
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState("");
  const [payMode, setPayMode] = useState("UPI");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [toast, setToast] = useState("");

  const cats = ["All", "Equipment", "Beverages", "Rental", "Accessories"];
  const filtered = cat === "All" ? POS_PRODUCTS : POS_PRODUCTS.filter(p => p.cat === cat);

  const addToCart = (p: Product) => setCart(c => {
    if (p.stock === 0) return c;
    const ex = c.find(i => i.product.id === p.id);
    if (ex) return c.map(i => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i);
    return [...c, { product: p, qty: 1 }];
  });
  const adjust = (id: number, delta: number) => setCart(c =>
    c.map(i => i.product.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
  );
  const removeFromCart = (id: number) => setCart(c => c.filter(i => i.product.id !== id));

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const gst = Math.round(subtotal * 0.18);
  const discountAmt = promoDiscount > 0 ? Math.round(subtotal * promoDiscount / 100) : 0;
  const total = subtotal + gst - discountAmt;

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setPromoDiscount(PROMO_CODES[code]);
      setPromoError("");
    } else {
      setPromoDiscount(0);
      setPromoError("Invalid promo code");
    }
  };

  const completeSale = () => {
    if (!cart.length) return;
    setToast(`✓ Sale of ₹${total} completed via ${payMode}!`);
    setCart([]);
    setCustomer("");
    setPromoCode("");
    setPromoDiscount(0);
  };

  const orderCols: ColDef<typeof ORDER_HISTORY[0]>[] = [
    { key: "id", label: "Order ID", render: v => <span className="font-mono text-xs text-[#5F635C]">{v}</span> },
    { key: "time", label: "Time", render: v => <span className="text-sm text-[#464A45]">{v}</span> },
    { key: "customer", label: "Customer", render: v => <span className="font-medium text-[#181A1F]">{v}</span> },
    { key: "items", label: "Items", render: v => <span className="text-xs text-[#5F635C] max-w-[180px] truncate block">{v}</span> },
    { key: "subtotal", label: "Subtotal", render: v => <span className="text-sm text-[#30342F]">₹{v}</span> },
    { key: "gst", label: "GST", render: v => <span className="text-sm text-[#5F635C]">₹{v}</span> },
    { key: "promo", label: "Promo", render: v => <span className={`text-xs font-medium ${v !== "—" ? "text-sky-600" : "text-[#7D8178]"}`}>{v}</span> },
    { key: "total", label: "Total", render: v => <span className="font-bold text-[#181A1F]">₹{v}</span> },
    { key: "mode", label: "Mode", render: v => <Badge text={v} color={v === "UPI" ? "blue" : v === "Cash" ? "success" : "gray"} /> },
    { key: "status", label: "Status", render: v => <Badge text={v} color={v === "completed" ? "success" : v === "refunded" ? "red" : "yellow"} /> },
  ];

  const refundCols: ColDef<typeof REFUNDS_DATA[0]>[] = [
    { key: "id", label: "Refund ID", render: v => <span className="font-mono text-xs text-[#5F635C]">{v}</span> },
    { key: "orderId", label: "Order ID", render: v => <span className="font-mono text-xs text-[#7D8178]">{v}</span> },
    { key: "customer", label: "Customer", render: v => <span className="font-medium text-[#181A1F]">{v}</span> },
    { key: "items", label: "Items", render: v => <span className="text-xs text-[#464A45]">{v}</span> },
    { key: "amount", label: "Amount", render: v => <span className="font-bold text-red-600">₹{v}</span> },
    { key: "reason", label: "Reason", render: v => <span className="text-xs text-[#5F635C]">{v}</span> },
    { key: "date", label: "Date", render: v => <span className="text-sm text-[#5F635C]">{v}</span> },
    { key: "status", label: "Status", render: v => <Badge text={v} color={v === "approved" ? "success" : v === "pending" ? "yellow" : "red"} /> },
  ];

  return (
    <div className="p-6 space-y-5">
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#181A1F]">Point of Sale</h1>
          <p className="text-sm text-[#5F635C] mt-0.5">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        {posTab === "pos" && (
          <div className="flex items-center gap-2 bg-[#FFC400]/10 px-3 py-2 rounded-lg">
            <ShoppingCart size={16} className="text-[#755900]" />
            <span className="text-sm font-semibold text-[#755900]">{cart.reduce((s, i) => s + i.qty, 0)} items · ₹{total}</span>
          </div>
        )}
      </div>

      {/* Tab switcher */}
      <div className="flex border-b border-[#C9CBC2]">
        {[
          { key: "pos", label: "Point of Sale", icon: ShoppingCart },
          { key: "orders", label: "Order History", icon: FileText },
          { key: "refunds", label: "Refund History", icon: RefreshCw },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setPosTab(key as typeof posTab)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${posTab === key ? "border-[#D6A500] text-[#755900]" : "border-transparent text-[#5F635C] hover:text-[#30342F]"}`}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {/* POS Tab */}
      {posTab === "pos" && (
        <div className="flex gap-5">
          {/* Product catalog */}
          <div className="flex-[3] space-y-4">
            <div className="flex gap-2 flex-wrap">
              {cats.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${cat === c ? "bg-[#FFC400] text-[#17140A] shadow-sm" : "bg-white border border-[#C9CBC2] text-[#464A45] hover:border-[#D6A500]"}`}>
                  {c !== "All" && <span>{CAT_ICONS[c]}</span>} {c}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map(p => {
                const inCart = cart.find(i => i.product.id === p.id);
                const stockLbl = stockLabel(p);
                return (
                  <button key={p.id} onClick={() => addToCart(p)} disabled={p.stock === 0}
                    className={`relative bg-white border rounded-xl p-4 text-left hover:shadow-md transition-all group ${p.stock === 0 ? "opacity-50 cursor-not-allowed" : "hover:border-[#D6A500]/40"} ${inCart ? "border-[#D6A500] ring-1 ring-[#D6A500]/20" : "border-[#DFE0D8]"}`}>
                    {stockLbl && (
                      <span className={`absolute top-2 right-2 text-xs font-bold px-1.5 py-0.5 rounded-full ${p.stock === 0 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>{stockLbl}</span>
                    )}
                    {inCart && (
                      <span className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#FFC400] text-[#17140A] text-xs font-bold flex items-center justify-center">{inCart.qty}</span>
                    )}
                    <div className="text-2xl mb-2">{CAT_ICONS[p.cat] || "📦"}</div>
                    <div className="text-sm font-semibold text-[#222520] leading-tight">{p.name}</div>
                    <div className="text-xs text-[#7D8178] mt-0.5">{p.cat}</div>
                    <div className="text-base font-bold text-[#181A1F] mt-2">₹{p.price}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cart */}
          <div className="flex-[2] bg-white border border-[#DFE0D8] rounded-xl shadow-sm flex flex-col" style={{ maxHeight: "calc(100vh - 240px)", minHeight: "460px" }}>
            <div className="px-4 py-3 border-b border-[#DFE0D8] flex items-center justify-between">
              <h3 className="font-bold text-[#181A1F]">Cart</h3>
              {cart.length > 0 && (
                <button onClick={() => setCart([])} className="text-xs text-red-400 hover:text-red-600">Clear all</button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-[#A5A89E] py-8">
                <ShoppingCart size={40} className="mb-3 opacity-40" />
                <p className="text-sm font-medium text-[#7D8178]">Cart is empty</p>
                <p className="text-xs text-[#A5A89E] mt-1">Click a product to add</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-[#F7F7F3]">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3 px-4 py-3">
                      <span className="text-lg shrink-0">{CAT_ICONS[item.product.cat] || "📦"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#222520] truncate">{item.product.name}</p>
                        <p className="text-xs text-[#7D8178]">₹{item.product.price} × {item.qty}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => adjust(item.product.id, -1)} className="w-6 h-6 rounded-md bg-[#DFE0D8] text-[#464A45] text-xs font-bold flex items-center justify-center hover:bg-[#C9CBC2]">−</button>
                        <span className="text-sm font-medium w-5 text-center">{item.qty}</span>
                        <button onClick={() => adjust(item.product.id, 1)} className="w-6 h-6 rounded-md bg-[#DFE0D8] text-[#464A45] text-xs font-bold flex items-center justify-center hover:bg-[#C9CBC2]">+</button>
                      </div>
                      <span className="text-sm font-bold text-[#181A1F] w-14 text-right">₹{item.product.price * item.qty}</span>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-[#C9CBC2] hover:text-red-400 transition-colors ml-1"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-[#DFE0D8] px-4 py-4 space-y-3">
              {/* Promo code */}
              <div className="flex gap-2">
                <input value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} onKeyDown={e => e.key === "Enter" && applyPromo()}
                  placeholder="Promo code (SPORT10)" className="flex-1 border border-[#C9CBC2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
                <button onClick={applyPromo} className="px-3 py-2 bg-[#181A1F] text-white rounded-lg text-xs font-semibold hover:bg-[#222520]">Apply</button>
              </div>
              {promoError && <p className="text-xs text-red-500">{promoError}</p>}
              {promoDiscount > 0 && <p className="text-xs text-[#755900] font-semibold flex items-center gap-1"><Tag size={11} /> {promoDiscount}% discount applied!</p>}

              {/* Totals */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-sm text-[#5F635C]"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between text-sm text-[#5F635C]"><span>GST (18%)</span><span>₹{gst}</span></div>
                {discountAmt > 0 && <div className="flex justify-between text-sm text-[#755900] font-medium"><span>Promo ({promoDiscount}%)</span><span>−₹{discountAmt}</span></div>}
                <div className="flex justify-between font-bold text-[#181A1F] text-base pt-1 border-t border-[#DFE0D8]"><span>Total</span><span>₹{total}</span></div>
              </div>

              {/* Customer + payment */}
              <input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Customer name (optional)" className={`${inp} !py-2`} />
              <div className="grid grid-cols-4 gap-1.5">
                {["Cash", "UPI", "Card", "Wallet"].map(m => (
                  <button key={m} onClick={() => setPayMode(m)}
                    className={`py-1.5 text-xs font-semibold rounded-md border transition-all ${payMode === m ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "border-[#C9CBC2] text-[#464A45] hover:border-[#D6A500]"}`}>
                    {m}
                  </button>
                ))}
              </div>
              <button onClick={completeSale} disabled={!cart.length}
                className="w-full bg-[#FFC400] text-[#17140A] py-3 rounded-xl font-bold text-sm hover:bg-[#D9A900] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                <CheckCircle size={16} /> Complete Sale · ₹{total}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order History Tab */}
      {posTab === "orders" && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Today's Sales" value={`₹${ORDER_HISTORY.filter(o => o.status === "completed").reduce((s, o) => s + o.total, 0).toLocaleString()}`} icon={DollarSign} color="#FFC400" />
            <StatCard label="Orders Today" value={String(ORDER_HISTORY.length)} icon={ShoppingCart} color="#3F718B" />
            <StatCard label="Refunded" value={String(ORDER_HISTORY.filter(o => o.status === "refunded").length)} icon={RefreshCw} color="#B84A4A" />
          </div>
          <DataTable data={ORDER_HISTORY} columns={orderCols} title="Order History" pageSize={10} searchPlaceholder="Search order, customer..." />
        </div>
      )}

      {/* Refund History Tab */}
      {posTab === "refunds" && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Total Refunded" value={`₹${REFUNDS_DATA.reduce((s, r) => s + r.amount, 0).toLocaleString()}`} icon={RefreshCw} color="#B84A4A" />
            <StatCard label="Pending Review" value={String(REFUNDS_DATA.filter(r => r.status === "pending").length)} icon={Clock} color="#C08B3E" />
            <StatCard label="Approved" value={String(REFUNDS_DATA.filter(r => r.status === "approved").length)} icon={CheckCircle} color="#FFC400" />
          </div>
          <DataTable data={REFUNDS_DATA} columns={refundCols} title="Refund History" pageSize={10} searchPlaceholder="Search refund, customer..." />
        </div>
      )}
    </div>
  );
}

// ─── 2. VenueExpenses ────────────────────────────────────────────────────────

const EXPENSE_CATS = ["Rent/Lease", "Electricity", "Water", "Staff Salary", "Equipment Purchase", "Maintenance & Repair", "Marketing", "Insurance", "Internet & Software", "Miscellaneous"];

const INIT_EXPENSES = [
  { id: 1, date: "2026-07-01", description: "Monthly Rent", category: "Rent/Lease", amount: 50000, mode: "Bank Transfer", notes: "" },
  { id: 2, date: "2026-07-03", description: "EB Bill", category: "Electricity", amount: 12000, mode: "UPI", notes: "June billing" },
  { id: 3, date: "2026-07-05", description: "Staff Salaries", category: "Staff Salary", amount: 80000, mode: "Bank Transfer", notes: "4 staff" },
  { id: 4, date: "2026-07-07", description: "Court Maintenance", category: "Maintenance & Repair", amount: 8000, mode: "Cash", notes: "" },
  { id: 5, date: "2026-07-08", description: "Google Ads", category: "Marketing", amount: 6000, mode: "Card", notes: "" },
  { id: 6, date: "2026-07-09", description: "Broadband Bill", category: "Internet & Software", amount: 2000, mode: "UPI", notes: "" },
  { id: 7, date: "2026-07-10", description: "Liability Insurance", category: "Insurance", amount: 4000, mode: "Bank Transfer", notes: "Annual premium pro-rated" },
];

const EXPENSE_CHART_DATA = [
  { month: "Jan", amount: 120000 }, { month: "Feb", amount: 135000 }, { month: "Mar", amount: 145000 },
  { month: "Apr", amount: 138000 }, { month: "May", amount: 155000 }, { month: "Jun", amount: 162000 },
];

export function VenueExpenses() {
  const [expenses, setExpenses] = useState(INIT_EXPENSES);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ date: "", description: "", category: "", amount: "", mode: "UPI", notes: "" });

  const saveExpense = () => {
    if (!form.description || !form.amount) return;
    setExpenses(e => [...e, { ...form, id: Date.now(), amount: Number(form.amount) }]);
    setShowModal(false);
    setToast("Expense added");
    setForm({ date: "", description: "", category: "", amount: "", mode: "UPI", notes: "" });
  };

  type Expense = typeof INIT_EXPENSES[0];
  const cols: ColDef<Expense>[] = [
    { key: "date", label: "Date", sortable: true },
    { key: "description", label: "Description" },
    { key: "category", label: "Category", render: (v) => <Badge text={v} color="blue" /> },
    { key: "amount", label: "Amount", sortable: true, render: (v) => <span className="font-semibold">₹{v.toLocaleString()}</span> },
    { key: "mode", label: "Mode", render: (v) => <Badge text={v} color={v === "Cash" ? "success" : v === "UPI" ? "blue" : "gray"} /> },
    { key: "id", label: "Actions", render: (_v, row) => (
      <button onClick={() => setExpenses(e => e.filter(x => x.id !== row.id))} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
    )},
  ];

  return (
    <div className="p-6 space-y-6">
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <PageHeader title="Expense Management" subtitle="Track and manage all operational expenses"
        action={<button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#FFC400] text-[#17140A] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#D9A900]"><Plus size={16} />Add Expense</button>} />
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total This Month" value="₹1,62,000" sub="+12% vs last month" icon={DollarSign} />
        <StatCard label="Largest Category" value="Staff Salary" sub="₹80,000" icon={Users} />
        <StatCard label="Budget Used" value="81%" sub="₹38,000 remaining" icon={TrendingUp} />
      </div>
      <div className="bg-white border border-[#DFE0D8] rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-[#181A1F] mb-4">Expense Trend (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={EXPENSE_CHART_DATA}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: any) => [`₹${v.toLocaleString()}`, "Amount"]} />
            <Bar dataKey="amount" fill="#FFC400" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <DataTable data={expenses} columns={cols} title="All Expenses" pageSize={6} />
      {showModal && (
        <Modal title="Add Expense" onClose={() => setShowModal(false)}>
          <Field label="Date"><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inp} /></Field>
          <Field label="Description"><input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Monthly rent" className={inp} /></Field>
          <Field label="Category">
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inp}>
              <option value="">Select category</option>
              {EXPENSE_CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Amount (₹)"><input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0" className={inp} /></Field>
          <Field label="Payment Mode">
            <select value={form.mode} onChange={e => setForm(f => ({ ...f, mode: e.target.value }))} className={inp}>
              {["Cash", "UPI", "Bank Transfer", "Card"].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Notes (optional)"><textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className={inp} /></Field>
          <button onClick={saveExpense} className="w-full bg-[#FFC400] text-[#17140A] py-2.5 rounded-lg font-semibold text-sm hover:bg-[#D9A900]">Save Expense</button>
        </Modal>
      )}
    </div>
  );
}

// ─── 3. VenueSubscriptions ───────────────────────────────────────────────────

const INIT_PLANS = [
  { id: 1, name: "Basic Court Pass", price: 999, sessions: 8, validity: 30, benefits: ["8 court bookings/month", "Standard hours only", "Basic support"], active: true, subs: 1 },
  { id: 2, name: "Premium Player", price: 1999, sessions: 16, validity: 30, benefits: ["16 bookings/month", "Peak hour access", "Priority booking", "Guest pass x2"], active: true, subs: 5 },
  { id: 3, name: "Elite Champion", price: 3499, sessions: -1, validity: 30, benefits: ["Unlimited bookings", "24/7 access", "Guest passes x4", "Locker", "Coach consultation"], active: true, subs: 2 },
];

const MOCK_SUBSCRIBERS = [
  { name: "Arjun Mehta", plan: "Premium Player", startDate: "2026-07-01", nextBilling: "2026-08-01", sessionsUsed: "9/16", status: "Active" },
  { name: "Priya Sharma", plan: "Elite Champion", startDate: "2026-06-15", nextBilling: "2026-07-15", sessionsUsed: "∞", status: "Active" },
  { name: "Rahul Nair", plan: "Basic Court Pass", startDate: "2026-07-05", nextBilling: "2026-08-05", sessionsUsed: "5/8", status: "Active" },
  { name: "Deepa Singh", plan: "Premium Player", startDate: "2026-06-20", nextBilling: "2026-07-20", sessionsUsed: "14/16", status: "Active" },
  { name: "Vikram Pillai", plan: "Elite Champion", startDate: "2026-07-10", nextBilling: "2026-08-10", sessionsUsed: "∞", status: "Paused" },
];

export function VenueSubscriptions() {
  const [plans, setPlans] = useState(INIT_PLANS);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ name: "", price: "", sessions: "", validity: "30", benefits: "", active: true });

  const savePlan = () => {
    if (!form.name || !form.price) return;
    setPlans(p => [...p, { id: Date.now(), name: form.name, price: Number(form.price), sessions: Number(form.sessions) || -1, validity: Number(form.validity), benefits: form.benefits.split("\n").filter(Boolean), active: form.active, subs: 0 }]);
    setShowModal(false);
    setToast("Plan created");
  };

  type Sub = typeof MOCK_SUBSCRIBERS[0];
  const subCols: ColDef<Sub>[] = [
    { key: "name", label: "Name" },
    { key: "plan", label: "Plan", render: (v) => <Badge text={v} color="blue" /> },
    { key: "startDate", label: "Start Date" },
    { key: "nextBilling", label: "Next Billing" },
    { key: "sessionsUsed", label: "Sessions" },
    { key: "status", label: "Status", render: (v) => <Badge text={v} color={v === "Active" ? "success" : "orange"} /> },
  ];

  return (
    <div className="p-6 space-y-6">
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <PageHeader title="Subscription Plans" subtitle="Manage court access plans for players"
        action={<button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#FFC400] text-[#17140A] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#D9A900]"><Plus size={16} />Create Plan</button>} />
      <div className="grid grid-cols-3 gap-4">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white border border-[#DFE0D8] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-[#181A1F]">{plan.name}</h3>
                <div className="text-2xl font-bold text-[#755900] mt-1">₹{plan.price.toLocaleString()}<span className="text-sm text-[#7D8178] font-normal">/mo</span></div>
              </div>
              <Badge text={plan.active ? "Active" : "Paused"} color={plan.active ? "success" : "orange"} />
            </div>
            <p className="text-sm text-[#5F635C] mb-1">{plan.sessions === -1 ? "Unlimited sessions" : `${plan.sessions} sessions/month`}</p>
            <div className="flex items-center gap-1 text-xs text-[#7D8178] mb-4"><Users size={12} />{plan.subs} active subscribers</div>
            <ul className="space-y-1.5 mb-4">
              {plan.benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-[#464A45]"><CheckCircle size={12} className="text-[#755900] shrink-0" />{b}</li>
              ))}
            </ul>
            <div className="flex gap-2 pt-3 border-t border-[#F7F7F3]">
              <button aria-label="Edit" className="flex-1 flex items-center justify-center gap-1 text-xs text-[#464A45] border border-[#C9CBC2] py-1.5 rounded-lg hover:bg-[#F7F7F3]"><Edit2 size={12} />Edit</button>
              <button onClick={() => setPlans(p => p.map(x => x.id === plan.id ? { ...x, active: !x.active } : x))} className="flex-1 text-xs text-[#464A45] border border-[#C9CBC2] py-1.5 rounded-lg hover:bg-[#F7F7F3]">{plan.active ? "Pause" : "Resume"}</button>
              <button onClick={() => setPlans(p => p.filter(x => x.id !== plan.id))} className="px-3 text-red-400 border border-red-100 py-1.5 rounded-lg hover:bg-red-50"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
      <DataTable data={MOCK_SUBSCRIBERS} columns={subCols} title="Active Subscribers" pageSize={5} />
      {showModal && (
        <Modal title="Create Subscription Plan" onClose={() => setShowModal(false)}>
          <Field label="Plan Name"><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Gold Member" className={inp} /></Field>
          <Field label="Price / Month (₹)"><input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="999" className={inp} /></Field>
          <Field label="Sessions / Month (0 = unlimited)"><input type="number" value={form.sessions} onChange={e => setForm(f => ({ ...f, sessions: e.target.value }))} placeholder="8" className={inp} /></Field>
          <Field label="Validity (days)"><input type="number" value={form.validity} onChange={e => setForm(f => ({ ...f, validity: e.target.value }))} placeholder="30" className={inp} /></Field>
          <Field label="Benefits (one per line)"><textarea value={form.benefits} onChange={e => setForm(f => ({ ...f, benefits: e.target.value }))} rows={4} placeholder="Peak hour access&#10;Guest pass x2" className={inp} /></Field>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="accent-[#D6A500] w-4 h-4" />
            <span className="text-sm text-[#30342F]">Publish immediately</span>
          </label>
          <button onClick={savePlan} className="w-full bg-[#FFC400] text-[#17140A] py-2.5 rounded-lg font-semibold text-sm hover:bg-[#D9A900]">Create Plan</button>
        </Modal>
      )}
    </div>
  );
}

// ─── 4. VenueAIInsights ──────────────────────────────────────────────────────

const AI_ALERTS = [
  { id: 1, type: "critical", icon: "🔴", title: "Court 3 occupancy dropped 28%", body: "Tuesday–Thursday 9AM–12PM slots are only 34% filled. This is costing ₹8,400/week in lost revenue.", action: "Set Discount Pricing", impact: "HIGH" },
  { id: 2, type: "warning", icon: "🟡", title: "4 upcoming cancellations detected", body: "AI predicts 4 players are likely to cancel Friday bookings based on past behaviour patterns.", action: "Send Reminder WhatsApp", impact: "MEDIUM" },
  { id: 3, type: "warning", icon: "🟡", title: "Inventory reorder needed", body: "Shuttle tubes will run out in ~3 days at current consumption rate (12 tubes/day).", action: "Raise PO Now", impact: "MEDIUM" },
];

const AI_OPPORTUNITIES = [
  { id: 1, icon: "💰", title: "Increase Friday 6–8 PM pricing", body: "These slots have 97% occupancy for 6 weeks straight. A +₹200 surcharge could add ₹9,600/month.", action: "Update Pricing", impact: "+₹9,600/mo" },
  { id: 2, icon: "🎯", title: "Launch Monday Morning Promo", body: "Monday 6–10 AM is only 23% occupied. A 30% early-bird discount could drive 8–10 more bookings/week.", action: "Create Promo Code", impact: "+₹12,000/mo" },
  { id: 3, icon: "👥", title: "Upsell corporate packages to 3 prospects", body: "3 companies have booked 4+ times each. A bulk contract could lock in ₹25,000/month guaranteed.", action: "Send Proposal", impact: "+₹25,000/mo" },
  { id: 4, icon: "📱", title: "Win back 12 lapsed customers", body: "12 players who used to book weekly haven't returned in 45 days. A personalised discount offer has 68% win-back rate.", action: "Send Campaign", impact: "+₹14,400/mo" },
];

const AI_PREDICTIONS = [
  { id: 1, icon: "📈", title: "July revenue forecast", body: "Based on current bookings + seasonal trends, July GMV will reach ₹2.1L (±8%) — 14% higher than June.", confidence: 87 },
  { id: 2, icon: "⚡", title: "Peak demand next weekend", body: "Saturday 18 Jul will see highest demand of the month. Courts will be 100% occupied by Thursday evening.", confidence: 92 },
  { id: 3, icon: "🔄", title: "Subscription renewal surge", body: "18 subscriptions expire in the next 10 days. Historical renewal rate is 74% — expect ₹36K in renewals.", confidence: 74 },
];

const QUICK_ACTIONS = ["Revenue gaps this week", "Peak vs off-peak hours", "Customer retention rate", "Best court performance", "Pricing recommendations", "Draft WhatsApp campaign", "Competitor pricing analysis", "Inventory reorder alert"];

type ChatMsg = { role: "ai" | "user"; text: string };

const INIT_CHAT: ChatMsg[] = [
  { role: "ai", text: "👋 Hi! I'm your Venue Intelligence Assistant. I've analysed your last 90 days of data — Court 2 has 34% vacancy on Tuesday mornings. Want me to suggest a fix?" },
  { role: "user", text: "What's our best revenue day?" },
  { role: "ai", text: "📊 Friday–Sunday generates 68% of weekly GMV (₹87K avg). Monday is your lowest at 23% utilization — perfect for maintenance windows or promotional slots. Want a detailed breakdown by court?" },
];

const CANNED: string[] = [
  "Based on 90 days of booking data, your Court 3 has the highest utilization at 89% on weekends. I recommend a ₹200 peak surcharge for Fri–Sun 5–9PM slots — this could add ₹12,000/month.",
  "Your customer retention is 72% MoM. Players who book 3+ times in 30 days have 94% retention. Focus on converting one-time players to repeat visitors with a 'Book Again' incentive.",
  "Pricing insight: Friday evening (6–8 PM) is underpriced relative to demand. Saturday 6–8 AM is also underpriced — demand is 2× the supply but pricing is the same as off-peak.",
  "A WhatsApp nudge 48 hours after a visit drives 31% rebooking on average. I can draft a personalized message for your top 20 lapsed customers right now.",
  "Your corporate segment (3 companies) contributes 26% of revenue but only 12% of bookings. Upselling annual bulk contracts could add ₹18K–25K/month in guaranteed revenue.",
];

export function VenueAIInsights() {
  const [mode, setMode] = useState<"dashboard" | "chat">("dashboard");
  const [messages, setMessages] = useState<ChatMsg[]>(INIT_CHAT);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [cannedIdx, setCannedIdx] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", text: text.trim() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages(m => [...m, { role: "ai", text: CANNED[cannedIdx % CANNED.length] }]);
      setCannedIdx(i => i + 1);
      setTyping(false);
    }, 1200);
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, typing]);

  const impactColor = (i: string) => i === "HIGH" ? "bg-red-100 text-red-700" : i === "MEDIUM" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700";

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <div className="w-72 shrink-0 bg-[#111827] flex flex-col">
        <div className="px-5 pt-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#FFC400] flex items-center justify-center">
              <Brain size={16} className="text-[#17140A]" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">AI Intelligence</div>
              <div className="text-[#7D8178] text-xs">Powered by InspirQ AI</div>
            </div>
          </div>
        </div>

        {/* Mode switcher */}
        <div className="px-4 py-3">
          <div className="flex bg-white/10 rounded-lg p-0.5">
            {[{ key: "dashboard", label: "Insights", icon: Sparkles }, { key: "chat", label: "Chat AI", icon: MessageSquare }].map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setMode(key as typeof mode)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all ${mode === key ? "bg-white text-[#181A1F]" : "text-[#7D8178] hover:text-white"}`}>
                <Icon size={12} />{label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <p className="text-[#5F635C] text-xs uppercase tracking-wider mb-2 font-semibold">Quick Prompts</p>
          <div className="space-y-1.5">
            {QUICK_ACTIONS.map(q => (
              <button key={q} onClick={() => { setMode("chat"); send(q); }}
                className="w-full text-left text-xs text-[#A5A89E] px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors leading-relaxed">
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-white/10">
          <p className="text-[#5F635C] text-xs">Your data stays private · GDPR compliant</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F7F3]">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#DFE0D8] flex items-center gap-3 shrink-0">
          <Zap size={18} className="text-[#755900]" />
          <span className="font-semibold text-[#181A1F]">{mode === "dashboard" ? "AI Insight Dashboard" : "AI Chat Assistant"}</span>
          <span className="ml-auto text-xs text-[#7D8178] bg-[#DFE0D8] px-2 py-1 rounded-full">Beta · Last updated 2 mins ago</span>
        </div>

        {/* Dashboard mode */}
        {mode === "dashboard" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Alerts */}
            <div>
              <h3 className="text-sm font-bold text-[#30342F] mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" /> Action Required
              </h3>
              <div className="space-y-3">
                {AI_ALERTS.map(a => (
                  <div key={a.id} className="bg-white rounded-xl border border-red-100 p-4 shadow-sm flex gap-4">
                    <div className="text-2xl shrink-0">{a.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#181A1F] text-sm">{a.title}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${impactColor(a.impact)}`}>{a.impact} IMPACT</span>
                      </div>
                      <p className="text-xs text-[#5F635C] mb-3">{a.body}</p>
                      <button className="flex items-center gap-1.5 text-xs bg-[#FFC400] text-[#17140A] px-3 py-1.5 rounded-lg font-semibold hover:bg-[#D9A900] transition-colors">
                        <Zap size={11} /> {a.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div>
              <h3 className="text-sm font-bold text-[#30342F] mb-3 flex items-center gap-2">
                <Lightbulb size={16} className="text-[#755900]" /> Revenue Opportunities
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {AI_OPPORTUNITIES.map(o => (
                  <div key={o.id} className="bg-white rounded-xl border border-sky-100 p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl shrink-0">{o.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-[#181A1F] text-sm">{o.title}</span>
                          <span className="text-xs font-bold text-[#755900] bg-[#FFC400]/10 px-2 py-0.5 rounded-full">{o.impact}</span>
                        </div>
                        <p className="text-xs text-[#5F635C] mb-3 leading-relaxed">{o.body}</p>
                        <button className="text-xs text-[#755900] font-semibold hover:underline flex items-center gap-1">
                          <ArrowUp size={11} /> {o.action}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Predictions */}
            <div>
              <h3 className="text-sm font-bold text-[#30342F] mb-3 flex items-center gap-2">
                <Target size={16} className="text-blue-500" /> AI Predictions
              </h3>
              <div className="space-y-3">
                {AI_PREDICTIONS.map(p => (
                  <div key={p.id} className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm flex gap-4 items-start">
                    <div className="text-2xl shrink-0">{p.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#181A1F] text-sm">{p.title}</span>
                        <span className="text-xs text-blue-600 bg-blue-50 font-bold px-2 py-0.5 rounded-full">{p.confidence}% confidence</span>
                      </div>
                      <p className="text-xs text-[#5F635C] leading-relaxed">{p.body}</p>
                    </div>
                    <div className="shrink-0 w-12 h-12">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E4DED5" strokeWidth="2.5" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3F718B" strokeWidth="2.5"
                          strokeDasharray={`${p.confidence} ${100 - p.confidence}`} />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat mode */}
        {mode === "chat" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "ai" && (
                    <div className="w-7 h-7 rounded-full bg-[#FFC400] flex items-center justify-center shrink-0 mr-2 mt-1">
                      <Zap size={13} className="text-[#17140A]" />
                    </div>
                  )}
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === "ai" ? "bg-white border border-[#DFE0D8] shadow-sm text-[#222520] rounded-tl-sm" : "bg-[#FFC400] text-[#17140A] rounded-tr-sm"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full bg-[#FFC400] flex items-center justify-center shrink-0 mr-2">
                    <Zap size={13} className="text-[#17140A]" />
                  </div>
                  <div className="bg-white border border-[#DFE0D8] shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-2 h-2 rounded-full bg-[#A5A89E] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-white border-t border-[#DFE0D8]">
              <div className="flex gap-3">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)}
                  placeholder="Ask about revenue, utilization, customers, pricing..."
                  className="flex-1 border border-[#C9CBC2] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
                <button onClick={() => send(input)} className="bg-[#FFC400] text-[#17140A] px-4 py-2.5 rounded-xl hover:bg-[#D9A900] transition-colors">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 5. VenueDataSettings ────────────────────────────────────────────────────

const DEFAULT_AMENITIES = ["Wi-Fi", "Parking", "Restroom", "Changing Room", "Shower", "Café", "Floodlights", "AC", "CCTV", "First Aid"];
const PRICING_RULES_INIT = [
  { id: 1, name: "Peak Hours", description: "6–9 AM and 5–9 PM", adjustment: "+50%", enabled: true },
  { id: 2, name: "Weekend Surcharge", description: "Sat & Sun all slots", adjustment: "+₹200", enabled: true },
  { id: 3, name: "Early Bird", description: "Before 7 AM", adjustment: "-20%", enabled: false },
  { id: 4, name: "Member Discount", description: "Active subscribers", adjustment: "-10%", enabled: true },
];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const INIT_PROMOS = [
  { id: 1, code: "SPORT10", discount: 10, type: "percent", expiry: "2026-08-31", uses: 24, maxUses: 100, applicableTo: "All", status: "active" },
  { id: 2, code: "NEWUSER", discount: 100, type: "flat", expiry: "2026-12-31", uses: 8, maxUses: 50, applicableTo: "Bookings", status: "active" },
  { id: 3, code: "WEEKEND20", discount: 20, type: "percent", expiry: "2026-07-31", uses: 15, maxUses: 30, applicableTo: "Bookings", status: "expired" },
  { id: 4, code: "MEMBER15", discount: 15, type: "percent", expiry: "2026-09-30", uses: 5, maxUses: 200, applicableTo: "All", status: "active" },
];

export function VenueDataSettings() {
  const [tab, setTab] = useState<"sports" | "amenities" | "hours" | "pricing" | "booking" | "invoice" | "gst" | "promo">("sports");
  const [selectedSports, setSelectedSports] = useState<string[]>(["badminton", "tennis"]);
  const [amenities, setAmenities] = useState(DEFAULT_AMENITIES);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(["Parking", "Restroom", "Wi-Fi"]);
  const [newAmenity, setNewAmenity] = useState("");
  const [hours, setHours] = useState(DAYS.map(d => ({ day: d, closed: d === "Sunday", start: "06:00", end: "22:00", breakTime: "" })));
  const [rules, setRules] = useState(PRICING_RULES_INIT);
  const [promos, setPromos] = useState(INIT_PROMOS);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoForm, setPromoForm] = useState({ code: "", discount: "", type: "percent", expiry: "", maxUses: "", applicableTo: "All" });
  const [bookingConfig, setBookingConfig] = useState({ prefix: "BK-2026-", autoConfirm: true, cancelWindow: "4", lateFee: "20", guestBooking: true });
  const [invoiceConfig, setInvoiceConfig] = useState({ prefix: "INV-2026-", bizName: "Court Masters Arena", address: "23, MG Road, Koramangala, Bangalore 560034", gstin: "29ABCDE1234F1Z5", payTerms: "Net 7", footer: "Thank you for your business!", autoSend: true });
  const [gstConfig, setGstConfig] = useState({ regNo: "29ABCDE1234F1Z5", bookingsRate: "18", equipmentRate: "18", trainingRate: "18", inclusive: false });
  const [toast, setToast] = useState("");
  const save = () => { setToast("Settings saved successfully"); };

  const TABS = [
    { key: "sports", label: "Sports" }, { key: "amenities", label: "Amenities" },
    { key: "hours", label: "Hours" }, { key: "pricing", label: "Pricing" },
    { key: "booking", label: "Booking Config" }, { key: "invoice", label: "Invoice" },
    { key: "gst", label: "GST" }, { key: "promo", label: "Promo Codes" },
  ];

  const savePromo = () => {
    if (!promoForm.code || !promoForm.discount) return;
    setPromos(p => [...p, { id: Date.now(), code: promoForm.code.toUpperCase(), discount: Number(promoForm.discount), type: promoForm.type, expiry: promoForm.expiry, uses: 0, maxUses: Number(promoForm.maxUses) || 999, applicableTo: promoForm.applicableTo, status: "active" }]);
    setShowPromoModal(false);
    setPromoForm({ code: "", discount: "", type: "percent", expiry: "", maxUses: "", applicableTo: "All" });
    setToast("Promo code created");
  };

  type Promo = typeof INIT_PROMOS[0];
  const promoCols: ColDef<Promo>[] = [
    { key: "code", label: "Code", render: v => <span className="font-mono font-bold text-[#181A1F] bg-[#DFE0D8] px-2 py-0.5 rounded">{v}</span> },
    { key: "discount", label: "Discount", render: (v, row) => <span className="font-semibold text-[#755900]">{row.type === "percent" ? `${v}%` : `₹${v}`}</span> },
    { key: "applicableTo", label: "Applies To", render: v => <Badge text={v} color="blue" /> },
    { key: "expiry", label: "Expiry", render: v => <span className="text-sm text-[#5F635C]">{v}</span> },
    { key: "uses", label: "Uses", render: (v, row) => <span className="text-sm text-[#464A45]">{v}/{row.maxUses}</span> },
    { key: "status", label: "Status", render: v => <Badge text={v} color={v === "active" ? "success" : "red"} /> },
    { key: "id", label: "Actions", render: (_v, row) => (
      <div className="flex gap-2">
        <button onClick={() => setPromos(p => p.map(x => x.id === row.id ? { ...x, status: x.status === "active" ? "expired" : "active" } : x))} className="text-xs text-blue-500 hover:underline">{row.status === "active" ? "Pause" : "Activate"}</button>
        <button onClick={() => setPromos(p => p.filter(x => x.id !== row.id))} className="text-xs text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
      </div>
    )},
  ];

  return (
    <div className="p-6 space-y-6">
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <PageHeader title="Data & Settings" subtitle="Configure all venue settings — sports, amenities, booking, GST, and more" />

      {/* Tab bar — scrollable */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${tab === t.key ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "bg-white text-[#464A45] border-[#C9CBC2] hover:border-[#D6A500]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#DFE0D8] rounded-xl p-6 shadow-sm">
        {tab === "sports" && (
          <div>
            <h3 className="font-semibold text-[#181A1F] mb-4">Sports Available at Your Venue</h3>
            <div className="grid grid-cols-3 gap-3">
              {SPORTS.map(s => (
                <label key={s.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedSports.includes(s.id) ? "border-[#D6A500] bg-[#FFC400]/5" : "border-[#C9CBC2] hover:border-[#A5A89E]"}`}>
                  <input type="checkbox" checked={selectedSports.includes(s.id)} onChange={() => setSelectedSports(prev => prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id])} className="accent-[#D6A500]" />
                  <span className="text-base">{s.icon}</span>
                  <span className="text-sm font-medium text-[#222520]">{s.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {tab === "amenities" && (
          <div>
            <h3 className="font-semibold text-[#181A1F] mb-4">Venue Amenities</h3>
            <div className="flex flex-wrap gap-2 mb-5">
              {amenities.map(a => (
                <button key={a} onClick={() => setSelectedAmenities(s => s.includes(a) ? s.filter(x => x !== a) : [...s, a])}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${selectedAmenities.includes(a) ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "bg-white text-[#464A45] border-[#C9CBC2] hover:border-[#7D8178]"}`}>
                  {a}{selectedAmenities.includes(a) && " ✓"}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-4 border-t border-[#DFE0D8]">
              <input value={newAmenity} onChange={e => setNewAmenity(e.target.value)} onKeyDown={e => e.key === "Enter" && (setAmenities(a => [...a, newAmenity]), setSelectedAmenities(s => [...s, newAmenity]), setNewAmenity(""))} placeholder="Add custom amenity..." className={`${inp} flex-1`} />
              <button onClick={() => { if (newAmenity.trim()) { setAmenities(a => [...a, newAmenity.trim()]); setSelectedAmenities(s => [...s, newAmenity.trim()]); setNewAmenity(""); } }} className="px-4 bg-[#181A1F] text-white rounded-lg text-sm font-medium hover:bg-[#222520]"><Plus size={16} /></button>
            </div>
          </div>
        )}

        {tab === "hours" && (
          <div>
            <h3 className="font-semibold text-[#181A1F] mb-4">Operating Hours</h3>
            <div className="space-y-3">
              {hours.map((h, i) => (
                <div key={h.day} className={`grid grid-cols-[120px_1fr_1fr_1fr_auto] gap-3 items-center p-3 rounded-xl ${h.closed ? "bg-[#F7F7F3] opacity-60" : "bg-white border border-[#DFE0D8]"}`}>
                  <span className="text-sm font-semibold text-[#222520]">{h.day}</span>
                  <input type="time" value={h.start} disabled={h.closed} onChange={e => setHours(hrs => hrs.map((x, j) => j === i ? { ...x, start: e.target.value } : x))} className={`${inp} disabled:bg-[#F7F7F3]`} />
                  <input type="time" value={h.end} disabled={h.closed} onChange={e => setHours(hrs => hrs.map((x, j) => j === i ? { ...x, end: e.target.value } : x))} className={`${inp} disabled:bg-[#F7F7F3]`} />
                  <input type="text" value={h.breakTime} disabled={h.closed} onChange={e => setHours(hrs => hrs.map((x, j) => j === i ? { ...x, breakTime: e.target.value } : x))} placeholder="Break (optional)" className={`${inp} disabled:bg-[#F7F7F3]`} />
                  <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                    <input type="checkbox" checked={h.closed} onChange={e => setHours(hrs => hrs.map((x, j) => j === i ? { ...x, closed: e.target.checked } : x))} className="accent-red-500 w-3.5 h-3.5" />
                    <span className="text-xs text-[#5F635C]">Closed</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "pricing" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#181A1F]">Pricing Rules</h3>
              <button className="flex items-center gap-1.5 text-sm text-[#755900] font-medium hover:underline"><Plus size={14} />Add Rule</button>
            </div>
            <div className="space-y-3">
              {rules.map(rule => (
                <div key={rule.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#DFE0D8] hover:border-[#C9CBC2] transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-[#181A1F] text-sm">{rule.name}</p>
                    <p className="text-xs text-[#5F635C] mt-0.5">{rule.description}</p>
                  </div>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${rule.adjustment.startsWith("+") ? "bg-orange-50 text-orange-600" : "bg-sky-50 text-sky-600"}`}>{rule.adjustment}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={rule.enabled} onChange={() => setRules(r => r.map(x => x.id === rule.id ? { ...x, enabled: !x.enabled } : x))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[#C9CBC2] rounded-full peer peer-checked:bg-[#FFC400] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                  </label>
                  <button aria-label="Edit" className="text-[#7D8178] hover:text-[#30342F]"><Edit2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "booking" && (
          <div className="space-y-5">
            <h3 className="font-semibold text-[#181A1F]">Booking Configuration</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Booking ID Prefix">
                <input className={inp} value={bookingConfig.prefix} onChange={e => setBookingConfig(c => ({ ...c, prefix: e.target.value }))} placeholder="BK-2026-" />
              </Field>
              <Field label="Cancellation Window (hours)">
                <input type="number" className={inp} value={bookingConfig.cancelWindow} onChange={e => setBookingConfig(c => ({ ...c, cancelWindow: e.target.value }))} placeholder="4" />
              </Field>
              <Field label="Late Cancellation Fee (%)">
                <input type="number" className={inp} value={bookingConfig.lateFee} onChange={e => setBookingConfig(c => ({ ...c, lateFee: e.target.value }))} placeholder="20" />
              </Field>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F7F7F3]">
              <input type="checkbox" id="autoConfirm" checked={bookingConfig.autoConfirm} onChange={e => setBookingConfig(c => ({ ...c, autoConfirm: e.target.checked }))} className="w-4 h-4 accent-[#D6A500]" />
              <label htmlFor="autoConfirm" className="text-sm text-[#30342F] cursor-pointer"><span className="font-semibold">Auto-confirm bookings</span> — Bookings are confirmed automatically without manual review</label>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F7F7F3]">
              <input type="checkbox" id="guestBook" checked={bookingConfig.guestBooking} onChange={e => setBookingConfig(c => ({ ...c, guestBooking: e.target.checked }))} className="w-4 h-4 accent-[#D6A500]" />
              <label htmlFor="guestBook" className="text-sm text-[#30342F] cursor-pointer"><span className="font-semibold">Allow guest bookings</span> — Guests can book without creating an account</label>
            </div>
          </div>
        )}

        {tab === "invoice" && (
          <div className="space-y-5">
            <h3 className="font-semibold text-[#181A1F]">Invoice Settings</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Invoice Number Prefix">
                <input className={inp} value={invoiceConfig.prefix} onChange={e => setInvoiceConfig(c => ({ ...c, prefix: e.target.value }))} />
              </Field>
              <Field label="Business Name">
                <input className={inp} value={invoiceConfig.bizName} onChange={e => setInvoiceConfig(c => ({ ...c, bizName: e.target.value }))} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Business Address">
                  <input className={inp} value={invoiceConfig.address} onChange={e => setInvoiceConfig(c => ({ ...c, address: e.target.value }))} />
                </Field>
              </div>
              <Field label="GSTIN">
                <input className={inp} value={invoiceConfig.gstin} onChange={e => setInvoiceConfig(c => ({ ...c, gstin: e.target.value }))} placeholder="29ABCDE1234F1Z5" />
              </Field>
              <Field label="Payment Terms">
                <select className={inp} value={invoiceConfig.payTerms} onChange={e => setInvoiceConfig(c => ({ ...c, payTerms: e.target.value }))}>
                  {["Immediate", "Net 7", "Net 15", "Net 30"].map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Invoice Footer / Notes">
                  <textarea className={`${inp} resize-none`} rows={2} value={invoiceConfig.footer} onChange={e => setInvoiceConfig(c => ({ ...c, footer: e.target.value }))} />
                </Field>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F7F7F3]">
              <input type="checkbox" id="autoSendInv" checked={invoiceConfig.autoSend} onChange={e => setInvoiceConfig(c => ({ ...c, autoSend: e.target.checked }))} className="w-4 h-4 accent-[#D6A500]" />
              <label htmlFor="autoSendInv" className="text-sm text-[#30342F] cursor-pointer"><span className="font-semibold">Auto-send invoices</span> — Send invoice to player email automatically after booking</label>
            </div>
          </div>
        )}

        {tab === "gst" && (
          <div className="space-y-5">
            <h3 className="font-semibold text-[#181A1F]">GST Configuration</h3>
            <Field label="GST Registration Number">
              <input className={inp} value={gstConfig.regNo} onChange={e => setGstConfig(c => ({ ...c, regNo: e.target.value }))} placeholder="29ABCDE1234F1Z5" />
            </Field>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Bookings GST Rate (%)">
                <input type="number" className={inp} value={gstConfig.bookingsRate} onChange={e => setGstConfig(c => ({ ...c, bookingsRate: e.target.value }))} />
              </Field>
              <Field label="Equipment GST Rate (%)">
                <input type="number" className={inp} value={gstConfig.equipmentRate} onChange={e => setGstConfig(c => ({ ...c, equipmentRate: e.target.value }))} />
              </Field>
              <Field label="Training GST Rate (%)">
                <input type="number" className={inp} value={gstConfig.trainingRate} onChange={e => setGstConfig(c => ({ ...c, trainingRate: e.target.value }))} />
              </Field>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
              <strong>HSN/SAC Codes:</strong> Court bookings → SAC 999311 · Equipment rental → SAC 997212 · Training → SAC 999293
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F7F7F3]">
              <input type="checkbox" id="gstInclusive" checked={gstConfig.inclusive} onChange={e => setGstConfig(c => ({ ...c, inclusive: e.target.checked }))} className="w-4 h-4 accent-[#D6A500]" />
              <label htmlFor="gstInclusive" className="text-sm text-[#30342F] cursor-pointer"><span className="font-semibold">GST inclusive pricing</span> — Show prices with GST already included (tax is extracted from total)</label>
            </div>
          </div>
        )}

        {tab === "promo" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#181A1F]">Promo Codes</h3>
              <button onClick={() => setShowPromoModal(true)} className="flex items-center gap-1.5 bg-[#FFC400] text-[#17140A] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#D9A900]">
                <Plus size={14} /> Add Code
              </button>
            </div>
            <DataTable data={promos} columns={promoCols} pageSize={8} searchPlaceholder="Search promo codes..." />
            {showPromoModal && (
              <Modal title="Add Promo Code" onClose={() => setShowPromoModal(false)}>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Code">
                    <input className={inp} value={promoForm.code} onChange={e => setPromoForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SPORT10" />
                  </Field>
                  <Field label="Type">
                    <select className={inp} value={promoForm.type} onChange={e => setPromoForm(f => ({ ...f, type: e.target.value }))}>
                      <option value="percent">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </Field>
                  <Field label={promoForm.type === "percent" ? "Discount %" : "Discount ₹"}>
                    <input type="number" className={inp} value={promoForm.discount} onChange={e => setPromoForm(f => ({ ...f, discount: e.target.value }))} placeholder="10" />
                  </Field>
                  <Field label="Max Uses">
                    <input type="number" className={inp} value={promoForm.maxUses} onChange={e => setPromoForm(f => ({ ...f, maxUses: e.target.value }))} placeholder="100" />
                  </Field>
                  <Field label="Expiry Date">
                    <input type="date" className={inp} value={promoForm.expiry} onChange={e => setPromoForm(f => ({ ...f, expiry: e.target.value }))} />
                  </Field>
                  <Field label="Applicable To">
                    <select className={inp} value={promoForm.applicableTo} onChange={e => setPromoForm(f => ({ ...f, applicableTo: e.target.value }))}>
                      {["All", "Bookings", "POS", "Training"].map(x => <option key={x}>{x}</option>)}
                    </select>
                  </Field>
                </div>
                <button onClick={savePromo} className="w-full bg-[#FFC400] text-[#17140A] py-2.5 rounded-lg font-semibold text-sm hover:bg-[#D9A900]">Create Promo Code</button>
              </Modal>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button onClick={save} className="flex items-center gap-2 bg-[#FFC400] text-[#17140A] px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#D9A900]">
          <CheckCircle size={16} />Save Settings
        </button>
      </div>
    </div>
  );
}

// ─── 6. VenueRevenueAnalytics ─────────────────────────────────────────────────

const REV_MONTHLY = [
  { month: "Jan", revenue: 148000, bookings: 186, occupancy: 68 },
  { month: "Feb", revenue: 162000, bookings: 203, occupancy: 72 },
  { month: "Mar", revenue: 175000, bookings: 219, occupancy: 76 },
  { month: "Apr", revenue: 168000, bookings: 210, occupancy: 74 },
  { month: "May", revenue: 191000, bookings: 239, occupancy: 81 },
  { month: "Jun", revenue: 208000, bookings: 260, occupancy: 86 },
  { month: "Jul", revenue: 124000, bookings: 155, occupancy: 76 },
];

const SPORT_REVENUE = [
  { name: "Badminton", value: 68000, color: "#FFC400" }, { name: "Football", value: 42000, color: "#3F718B" },
  { name: "Tennis", value: 25000, color: "#C08B3E" }, { name: "Basketball", value: 18000, color: "#B84A4A" },
  { name: "Cricket", value: 12000, color: "#765A88" },
];

const TOP_COURTS = [
  { court: "Court A (Badminton)", revenue: 48000, occupancy: 89, bookings: 60 },
  { court: "Court B (Badminton)", revenue: 41000, occupancy: 82, bookings: 51 },
  { court: "Football Ground", revenue: 42000, occupancy: 76, bookings: 19 },
  { court: "Tennis Court", revenue: 25000, occupancy: 71, bookings: 31 },
];

const PEAK_SLOTS = [
  { slot: "6–7 PM", occupancy: 97, bookings: 28 }, { slot: "7–8 PM", occupancy: 95, bookings: 27 },
  { slot: "8–9 PM", occupancy: 91, bookings: 26 }, { slot: "6–7 AM", occupancy: 84, bookings: 24 },
  { slot: "7–8 AM", occupancy: 79, bookings: 23 },
];

const CUSTOMER_DATA = [
  { month: "Mar", newCustomers: 28, returning: 191 }, { month: "Apr", newCustomers: 22, returning: 188 },
  { month: "May", newCustomers: 35, returning: 204 }, { month: "Jun", newCustomers: 31, returning: 229 },
  { month: "Jul", newCustomers: 18, returning: 137 },
];

const PAYMENT_METHODS = [
  { name: "UPI", value: 54, color: "#FFC400" }, { name: "Card", value: 28, color: "#3F718B" },
  { name: "Cash", value: 13, color: "#C08B3E" }, { name: "Wallet", value: 5, color: "#765A88" },
];

export function VenueRevenueAnalytics() {
  const [dateRange, setDateRange] = useState("this_month");

  const totalRevenue = REV_MONTHLY.reduce((s, m) => s + m.revenue, 0);
  const avgOccupancy = Math.round(REV_MONTHLY.reduce((s, m) => s + m.occupancy, 0) / REV_MONTHLY.length);

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Revenue & Analytics" subtitle="Complete financial and operational insights for your venue"
        action={
          <div className="flex items-center gap-2">
            <select value={dateRange} onChange={e => setDateRange(e.target.value)}
              className="border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500] bg-white">
              {[["today", "Today"], ["this_week", "This Week"], ["this_month", "This Month"], ["last_month", "Last Month"], ["last_3months", "Last 3 Months"]].map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <button className="flex items-center gap-1.5 text-sm border border-[#C9CBC2] rounded-md px-3 py-2 hover:bg-[#F7F7F3] text-[#464A45]">
              <Download size={14} /> Export
            </button>
          </div>
        }
      />

      {/* KPI stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Gross Revenue", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, sub: "↑ 14% vs prev period", icon: DollarSign, color: "#FFC400" },
          { label: "Net Revenue", value: `₹${((totalRevenue * 0.92) / 100000).toFixed(1)}L`, sub: "After 8% platform fee", icon: TrendingUp, color: "#3F718B" },
          { label: "Total Bookings", value: "1,272", sub: "↑ 9.8% vs prev period", icon: Calendar, color: "#6366F1" },
          { label: "Avg Booking Value", value: "₹823", sub: "↑ ₹47 vs prev", icon: Activity, color: "#C08B3E" },
          { label: "Avg Occupancy", value: `${avgOccupancy}%`, sub: "Peak: 97% (Fri 6PM)", icon: BarChart2, color: "#B84A4A" },
          { label: "Active Customers", value: "487", sub: "+31 this period", icon: Users, color: "#1473E6" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-[#DFE0D8] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div style={{ background: c.color + "18" }} className="p-2 rounded-lg">
                <c.icon size={16} style={{ color: c.color }} />
              </div>
            </div>
            <div className="text-xl font-bold text-[#181A1F]">{c.value}</div>
            <div className="text-xs text-[#5F635C] mt-0.5">{c.label}</div>
            <div className="text-xs text-[#7D8178] mt-0.5">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart + Area chart */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#DFE0D8] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#181A1F]">Monthly Revenue</h3>
            <span className="text-xs text-[#7D8178] bg-[#DFE0D8] px-2 py-1 rounded-full">₹{(totalRevenue / 100000).toFixed(1)}L total</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={REV_MONTHLY}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [`₹${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#FFC400" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#DFE0D8] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#181A1F]">Occupancy Trend</h3>
            <span className="text-xs text-[#7D8178] bg-[#DFE0D8] px-2 py-1 rounded-full">{avgOccupancy}% avg</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REV_MONTHLY}>
              <defs>
                <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFC400" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#FFC400" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v: any) => [`${v}%`, "Occupancy"]} />
              <Area type="monotone" dataKey="occupancy" stroke="#FFC400" strokeWidth={2} fill="url(#occGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top performers */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#DFE0D8] rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-[#181A1F] mb-4">Top Courts by Revenue</h3>
          <div className="space-y-3">
            {TOP_COURTS.map((c, i) => (
              <div key={c.court} className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#7D8178] w-4">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#222520] truncate">{c.court}</span>
                    <span className="text-sm font-bold text-[#181A1F]">₹{c.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-[#DFE0D8] rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-[#FFC400]" style={{ width: `${(c.revenue / TOP_COURTS[0].revenue) * 100}%` }} />
                  </div>
                  <span className="text-xs text-[#7D8178] mt-0.5 block">{c.occupancy}% occupancy · {c.bookings} bookings</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#DFE0D8] rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-[#181A1F] mb-4">Peak Time Slots</h3>
          <div className="space-y-3">
            {PEAK_SLOTS.map((s, i) => (
              <div key={s.slot} className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#7D8178] w-4">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#222520]">{s.slot}</span>
                    <span className="text-sm font-bold text-[#755900]">{s.occupancy}%</span>
                  </div>
                  <div className="w-full bg-[#DFE0D8] rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-[#FFC400]" style={{ width: `${s.occupancy}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue breakdown + Payment methods */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#DFE0D8] rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-[#181A1F] mb-4">Revenue by Sport</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SPORT_REVENUE} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip formatter={(v: any) => [`₹${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {SPORT_REVENUE.map((entry, index) => (
                  <Cell key={`sport-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#DFE0D8] rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-[#181A1F] mb-4">Payment Methods</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={PAYMENT_METHODS} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {PAYMENT_METHODS.map((entry, i) => <Cell key={`pay-${i}`} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5">
              {PAYMENT_METHODS.map(p => (
                <div key={p.name} className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} />
                  <span className="text-sm text-[#30342F]">{p.name}</span>
                  <span className="text-sm font-bold text-[#181A1F] ml-auto">{p.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Customer analytics */}
      <div className="bg-white border border-[#DFE0D8] rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#181A1F]">Customer Analytics</h3>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#FFC400] inline-block" /> New</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#3F718B] inline-block" /> Returning</span>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={CUSTOMER_DATA}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="returning" fill="#3F718B" radius={[3, 3, 0, 0]} stackId="a" />
                <Bar dataKey="newCustomers" fill="#FFC400" radius={[3, 3, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {[
              { label: "Retention Rate", value: "72%", trend: "+4%", up: true },
              { label: "Avg LTV", value: "₹8,240", trend: "+₹620", up: true },
              { label: "Churn Rate", value: "12%", trend: "-2%", up: false },
              { label: "NPS Score", value: "67", trend: "+3", up: true },
            ].map(m => (
              <div key={m.label} className="flex items-center justify-between p-3 bg-[#F7F7F3] rounded-xl">
                <div>
                  <div className="text-lg font-bold text-[#181A1F]">{m.value}</div>
                  <div className="text-xs text-[#5F635C]">{m.label}</div>
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${m.up ? "bg-sky-50 text-sky-600" : "bg-red-50 text-red-600"}`}>
                  {m.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}{m.trend}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Insights panel */}
      <div className="bg-gradient-to-br from-[#111827] to-[#304A5D] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-[#755900]" />
          <span className="text-sm font-bold text-[#755900] uppercase tracking-wide">Smart Analytics Insights</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: "📈", text: "Revenue up 14% MoM. Friday evenings are your strongest revenue window — consider dynamic pricing." },
            { icon: "🎯", text: "87% of July's revenue will come from repeat customers. Loyalty programme is working." },
            { icon: "⚡", text: "Weekday morning slots (9–12 AM) are only 38% filled. A targeted promo could add ₹22K/month." },
            { icon: "👥", text: "Corporate bookings are 26% of GMV. Nurturing 3 prospects could secure ₹75K/quarter." },
            { icon: "🔄", text: "18 subscriptions expire in 10 days. Start renewal outreach now to protect ₹36K ARR." },
            { icon: "💡", text: "Court 3 generates 22% less than Court 2 despite similar specs. Check pricing differential." },
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2.5 bg-white/5 rounded-xl px-3 py-3">
              <span className="text-lg shrink-0">{tip.icon}</span>
              <p className="text-xs text-white/75 leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
