import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/SmartTable";
import { useState } from "react";
import { Plus, X, Edit2, Trash2, CheckCircle, Send, BarChart2, DollarSign, Package, Users, Clock, Settings, MessageSquare, TrendingUp, ShoppingCart, Brain, AlertCircle } from "lucide-react";
import { StatCard, Badge, DataTable, PageHeader } from "../components";
import type { ColDef } from "../components";
import { SPORTS } from "../data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  setTimeout(onDone, 2200);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#181A1F] text-white px-4 py-3 rounded-lg shadow-xl text-sm">
      <CheckCircle size={16} className="text-[#755900]" />
      {msg}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#DFE0D8]">
          <h2 className="font-semibold text-[#181A1F] font-['Lexend']">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#DFE0D8] rounded-full"><X size={18} /></button>
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

// ─── 1. TrainerPOS ────────────────────────────────────────────────────────────

const POS_PRODUCTS = [
  { id: 1, name: "Grip Tape", price: 80, stock: 7, cat: "Equipment", minStock: 10 },
  { id: 2, name: "Shuttle Tube", price: 120, stock: 48, cat: "Equipment", minStock: 10 },
  { id: 3, name: "Water Bottle", price: 30, stock: 100, cat: "Beverages", minStock: 20 },
  { id: 4, name: "Protein Bar", price: 60, stock: 3, cat: "Beverages", minStock: 10 },
  { id: 5, name: "Resistance Band", price: 150, stock: 0, cat: "Equipment", minStock: 5 },
  { id: 6, name: "Sports Towel", price: 120, stock: 25, cat: "Accessories", minStock: 5 },
  { id: 7, name: "Energy Drink", price: 60, stock: 35, cat: "Beverages", minStock: 15 },
  { id: 8, name: "Session Recording USB", price: 200, stock: 8, cat: "Accessories", minStock: 5 },
];

const RECENT_SALES = [
  { id: "S001", customer: "Rahul Singh", items: "2x Shuttle Tube, 1x Grip Tape", total: "₹320", time: "10:15 AM", mode: "UPI" },
  { id: "S002", customer: "Meera Joshi", items: "1x Protein Bar, 1x Water Bottle", total: "₹90", time: "09:40 AM", mode: "Cash" },
  { id: "S003", customer: "Aditya Kumar", items: "1x Recording USB", total: "₹200", time: "09:00 AM", mode: "Card" },
  { id: "S004", customer: "Sneha Rao", items: "1x Resistance Band", total: "₹150", time: "08:30 AM", mode: "UPI" },
  { id: "S005", customer: "Kartik Nair", items: "2x Energy Drink, 1x Sports Towel", total: "₹240", time: "07:55 AM", mode: "Cash" },
];

type POSProduct = { id: number; name: string; price: number; stock: number; cat: string; minStock: number };
type CartItem = { product: POSProduct; qty: number };

const stockStatus = (p: { stock: number; minStock: number }) =>
  p.stock === 0 ? "out" : p.stock < p.minStock ? "low" : "ok";

function StockBadge({ p }: { p: { stock: number; minStock: number } }) {
  const s = stockStatus(p);
  if (s === "out") return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Out of Stock</span>;
  if (s === "low") return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Low Stock</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-700">OK</span>;
}

const EMPTY_FORM = { name: "", cat: "Equipment", price: "", stock: "", minStock: "" };

export function TrainerPOS() {
  const [posTab, setPosTab] = useState<"pos" | "inventory">("pos");
  const [products, setProducts] = useState<POSProduct[]>(POS_PRODUCTS);

  // POS tab state
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState("");
  const [toast, setToast] = useState("");
  const cats = ["All", "Equipment", "Beverages", "Accessories"];

  // Inventory tab state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<POSProduct | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // POS helpers
  const filtered = cat === "All" ? products : products.filter(p => p.cat === cat);
  const addToCart = (p: POSProduct) => {
    if (p.stock === 0) return;
    setCart(c => {
      const ex = c.find(i => i.product.id === p.id);
      if (ex) return c.map(i => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { product: p, qty: 1 }];
    });
  };
  const adjust = (id: number, delta: number) => setCart(c =>
    c.map(i => i.product.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
  );
  const remove = (id: number) => setCart(c => c.filter(i => i.product.id !== id));
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const completeSale = () => {
    if (!cart.length) return;
    setToast(`Sale of ₹${total} completed!`);
    setCart([]);
    setCustomer("");
  };

  const salesCols: ColDef<typeof RECENT_SALES[0]>[] = [
    { key: "id", label: "ID" },
    { key: "customer", label: "Student" },
    { key: "items", label: "Items" },
    { key: "total", label: "Total" },
    { key: "time", label: "Time" },
    { key: "mode", label: "Mode", render: (v) => <Badge text={v} color={v === "UPI" ? "blue" : v === "Cash" ? "success" : "gray"} /> },
  ];

  // Inventory helpers
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < p.minStock).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const criticalItems = products.filter(p => p.stock > 0 && p.stock < 3);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setShowAddModal(true);
  };
  const openEdit = (p: POSProduct) => {
    setForm({ name: p.name, cat: p.cat, price: String(p.price), stock: String(p.stock), minStock: String(p.minStock) });
    setEditProduct(p);
  };
  const closeModals = () => {
    setShowAddModal(false);
    setEditProduct(null);
  };
  const saveAdd = () => {
    if (!form.name.trim()) return;
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts(prev => [...prev, {
      id: newId,
      name: form.name.trim(),
      cat: form.cat,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      minStock: Number(form.minStock) || 0,
    }]);
    setToast("Product added!");
    closeModals();
  };
  const saveEdit = () => {
    if (!editProduct || !form.name.trim()) return;
    setProducts(prev => prev.map(p => p.id === editProduct.id ? {
      ...p,
      name: form.name.trim(),
      cat: form.cat,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      minStock: Number(form.minStock) || 0,
    } : p));
    setToast("Product updated!");
    closeModals();
  };
  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(c => c.filter(i => i.product.id !== id));
    setToast("Product deleted.");
  };

  const fld = (k: keyof typeof EMPTY_FORM, label: string, type = "text") => (
    <Field label={label}>
      {k === "cat" ? (
        <select value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className={inp}>
          {cats.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      ) : (
        <input type={type} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className={inp} />
      )}
    </Field>
  );

  return (
    <div className="p-6 space-y-6">
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#181A1F] font-['Lexend']">Store</h1>
          <p className="text-sm text-[#5F635C] mt-0.5">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        {posTab === "pos" && (
          <div className="flex items-center gap-2 bg-[#FFC400]/10 px-3 py-2 rounded-lg">
            <ShoppingCart size={16} className="text-[#755900]" />
            <span className="text-sm font-semibold text-[#755900]">{cart.length} items</span>
          </div>
        )}
        {posTab === "inventory" && (
          <button onClick={openAdd} className="flex items-center gap-2 bg-[#FFC400] text-[#17140A] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#D9A900]">
            <Plus size={15} /> Add Product
          </button>
        )}
      </div>

      {/* Tab switcher */}
      <div className="flex gap-6 border-b border-[#C9CBC2]">
        {(["pos", "inventory"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setPosTab(tab)}
            className={`pb-2.5 text-sm font-semibold transition-colors ${posTab === tab ? "text-[#755900] border-b-2 border-[#D6A500]" : "text-[#5F635C] hover:text-[#30342F]"}`}
          >
            {tab === "pos" ? "Point of Sale" : "Inventory"}
          </button>
        ))}
      </div>

      {/* ── POS Tab ── */}
      {posTab === "pos" && (
        <>
          <div className="flex gap-6">
            <div className="flex-[3] space-y-4">
              <div className="flex gap-2 flex-wrap">
                {cats.map(c => (
                  <button key={c} onClick={() => setCat(c)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${cat === c ? "bg-[#FFC400] text-[#17140A]" : "bg-[#DFE0D8] text-[#464A45] hover:bg-[#C9CBC2]"}`}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {filtered.map(p => {
                  const outOfStock = p.stock === 0;
                  return (
                    <div key={p.id} className={`bg-white border rounded-xl p-4 transition-shadow ${outOfStock ? "border-red-100 opacity-60" : "border-[#DFE0D8] hover:shadow-md"}`}>
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-semibold text-[#222520]">{p.name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${outOfStock ? "bg-red-50 text-red-500" : "bg-[#F7F7F3] text-[#7D8178]"}`}>{p.stock}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-base font-bold text-[#181A1F]">₹{p.price}</span>
                        <button
                          onClick={() => addToCart(p)}
                          disabled={outOfStock}
                          className="w-7 h-7 rounded-full bg-[#FFC400] text-[#17140A] flex items-center justify-center hover:bg-[#D9A900] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      {outOfStock && <p className="text-xs text-red-400 mt-1">Out of stock</p>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex-[2] bg-white border border-[#DFE0D8] rounded-xl p-4 shadow-sm flex flex-col h-fit min-h-[400px]">
              <h3 className="font-semibold text-[#181A1F] mb-3 font-['Lexend']">Cart</h3>
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-[#7D8178] py-8">
                  <ShoppingCart size={32} className="mb-2 opacity-40" />
                  <p className="text-sm">Cart is empty</p>
                </div>
              ) : (
                <div className="flex-1 space-y-2 mb-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center gap-2 py-2 border-b border-[#F7F7F3] last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#222520] truncate">{item.product.name}</p>
                        <p className="text-xs text-[#7D8178]">₹{item.product.price} each</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => adjust(item.product.id, -1)} className="w-6 h-6 rounded-full bg-[#DFE0D8] text-[#464A45] text-xs flex items-center justify-center hover:bg-[#C9CBC2]">-</button>
                        <span className="text-sm font-medium w-5 text-center">{item.qty}</span>
                        <button onClick={() => adjust(item.product.id, 1)} className="w-6 h-6 rounded-full bg-[#DFE0D8] text-[#464A45] text-xs flex items-center justify-center hover:bg-[#C9CBC2]">+</button>
                      </div>
                      <span className="text-sm font-semibold text-[#181A1F] w-14 text-right">₹{item.product.price * item.qty}</span>
                      <button onClick={() => remove(item.product.id)} className="text-[#A5A89E] hover:text-red-400"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-[#DFE0D8] pt-3 space-y-1.5 mt-auto">
                <div className="flex justify-between text-sm text-[#464A45]"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between text-sm text-[#5F635C]"><span>GST (18%)</span><span>₹{gst}</span></div>
                <div className="flex justify-between font-bold text-[#181A1F] text-base pt-1 border-t border-[#DFE0D8] mt-1"><span>Total</span><span>₹{total}</span></div>
                <input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Student name (optional)" className={`${inp} mt-3`} />
                <button onClick={completeSale} disabled={!cart.length}
                  className="w-full bg-[#FFC400] text-[#17140A] py-2.5 rounded-lg font-semibold text-sm hover:bg-[#D9A900] disabled:opacity-40 disabled:cursor-not-allowed mt-2">
                  Complete Sale
                </button>
              </div>
            </div>
          </div>

          <DataTable data={RECENT_SALES} columns={salesCols} title="Recent Sales" pageSize={5} />
        </>
      )}

      {/* ── Inventory Tab ── */}
      {posTab === "inventory" && (
        <div className="space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-[#DFE0D8] rounded-xl p-4 shadow-sm">
              <p className="text-xs text-[#5F635C] mb-1">Total Products</p>
              <p className="text-2xl font-bold text-[#181A1F] font-['Lexend']">{totalProducts}</p>
            </div>
            <div className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-amber-600 mb-1">Low Stock</p>
              <p className="text-2xl font-bold text-amber-600 font-['Lexend']">{lowStockCount}</p>
            </div>
            <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-red-500 mb-1">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600 font-['Lexend']">{outOfStockCount}</p>
            </div>
            <div className="bg-white border border-[#DFE0D8] rounded-xl p-4 shadow-sm">
              <p className="text-xs text-[#5F635C] mb-1">Total Value</p>
              <p className="text-2xl font-bold text-[#181A1F] font-['Lexend']">₹{totalValue.toLocaleString("en-IN")}</p>
            </div>
          </div>

          {/* Critical alert banner */}
          {criticalItems.length > 0 && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-700">Critical Stock Alert</p>
                <p className="text-xs text-red-600 mt-0.5">
                  {criticalItems.map(p => `${p.name} (${p.stock} left)`).join(" · ")}
                </p>
              </div>
            </div>
          )}

          {/* Inventory table */}
          <div className="bg-white border border-[#DFE0D8] rounded-xl shadow-sm overflow-hidden">
            <Table className="w-full text-sm">
              <TableHeader className="bg-[#FFC400]/10 border-b border-[#D6A500]/20">
                <TableRow>
                  {["Name", "Category", "Price", "Stock", "Min Stock", "Status", "Actions"].map(h => (
                    <TableHead key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#755900] uppercase tracking-wide">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((row, idx) => (
                  <TableRow key={row.id} className={`border-b border-[#F7F7F3] last:border-0 ${idx % 2 === 1 ? "bg-[#F7F7F3]/40" : ""}`}>
                    <TableCell className="px-4 py-3 font-medium text-[#222520]">{row.name}</TableCell>
                    <TableCell className="px-4 py-3 text-[#5F635C]">{row.cat}</TableCell>
                    <TableCell className="px-4 py-3 text-[#30342F]">₹{row.price}</TableCell>
                    <TableCell className="px-4 py-3 text-[#30342F]">{row.stock}</TableCell>
                    <TableCell className="px-4 py-3 text-[#5F635C]">{row.minStock}</TableCell>
                    <TableCell className="px-4 py-3"><StockBadge p={row} /></TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-[#DFE0D8] text-[#7D8178] hover:text-[#755900] transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => deleteProduct(row.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#7D8178] hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <Modal title="Add Product" onClose={closeModals}>
          {fld("name", "Product Name")}
          {fld("cat", "Category")}
          {fld("price", "Price (₹)", "number")}
          {fld("stock", "Stock", "number")}
          {fld("minStock", "Min Stock", "number")}
          <div className="flex gap-3 pt-2">
            <button onClick={closeModals} className="flex-1 border border-[#C9CBC2] text-[#464A45] py-2.5 rounded-lg text-sm font-medium hover:bg-[#F7F7F3]">Cancel</button>
            <button onClick={saveAdd} className="flex-1 bg-[#FFC400] text-[#17140A] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#D9A900]">Add Product</button>
          </div>
        </Modal>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <Modal title="Edit Product" onClose={closeModals}>
          {fld("name", "Product Name")}
          {fld("cat", "Category")}
          {fld("price", "Price (₹)", "number")}
          {fld("stock", "Stock", "number")}
          {fld("minStock", "Min Stock", "number")}
          <div className="flex gap-3 pt-2">
            <button onClick={closeModals} className="flex-1 border border-[#C9CBC2] text-[#464A45] py-2.5 rounded-lg text-sm font-medium hover:bg-[#F7F7F3]">Cancel</button>
            <button onClick={saveEdit} className="flex-1 bg-[#FFC400] text-[#17140A] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#D9A900]">Save Changes</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── 2. TrainerExpenses ───────────────────────────────────────────────────────

const TRAINER_EXPENSE_CATS = ["Court Booking Fees", "Equipment Purchase", "Travel & Transport", "Online Tools & Software", "Marketing", "Insurance", "Miscellaneous"];

const INIT_EXPENSES = [
  { id: 1, date: "2026-07-01", description: "Court booking — Court Masters", category: "Court Booking Fees", amount: 8000, mode: "UPI", notes: "16 hours @ ₹500/hr" },
  { id: 2, date: "2026-07-03", description: "New Rackets x3", category: "Equipment Purchase", amount: 3500, mode: "Card", notes: "" },
  { id: 3, date: "2026-07-05", description: "Auto & taxi — home visits", category: "Travel & Transport", amount: 2000, mode: "Cash", notes: "" },
  { id: 4, date: "2026-07-07", description: "Zoom + Notion subscription", category: "Online Tools & Software", amount: 1500, mode: "Card", notes: "" },
  { id: 5, date: "2026-07-09", description: "Instagram ads", category: "Marketing", amount: 1200, mode: "Card", notes: "" },
  { id: 6, date: "2026-07-10", description: "Trainer liability insurance", category: "Insurance", amount: 800, mode: "Bank Transfer", notes: "Annual pro-rated" },
];

const CHART_DATA = [
  { month: "Jan", amount: 12000 },
  { month: "Feb", amount: 15000 },
  { month: "Mar", amount: 13500 },
  { month: "Apr", amount: 14800 },
  { month: "May", amount: 16200 },
  { month: "Jun", amount: 17000 },
];

export function TrainerExpenses() {
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

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="p-6 space-y-6">
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <PageHeader title="Expense Management" subtitle="Track coaching business expenses"
        action={<button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#FFC400] text-[#17140A] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#D9A900]"><Plus size={16} />Add Expense</button>} />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total This Month" value={`₹${total.toLocaleString()}`} sub="+8% vs last month" icon={DollarSign} />
        <StatCard label="Largest Category" value="Court Fees" sub="₹8,000" icon={Package} />
        <StatCard label="Budget Used" value="68%" sub="₹7,700 remaining" icon={TrendingUp} />
      </div>

      <div className="bg-white border border-[#DFE0D8] rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-[#181A1F] mb-4 font-['Lexend']">Coaching Expenses (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={CHART_DATA}>
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
          <Field label="Description"><input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Court booking" className={inp} /></Field>
          <Field label="Category">
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inp}>
              <option value="">Select category</option>
              {TRAINER_EXPENSE_CATS.map(c => <option key={c} value={c}>{c}</option>)}
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

// ─── 3. TrainerSubscriptions ──────────────────────────────────────────────────

const INIT_PACKAGES = [
  { id: 1, name: "Trial Pack", sessions: 2, price: 2000, validity: 30, description: "Perfect for first-timers", benefits: ["2 private sessions", "Skill assessment", "Personalized plan"], active: true, subs: 1 },
  { id: 2, name: "Starter Pack", sessions: 8, price: 7500, validity: 60, description: "For casual learners", benefits: ["8 sessions", "Video analysis", "WhatsApp support"], active: true, subs: 5 },
  { id: 3, name: "Monthly Elite", sessions: 16, price: 13500, validity: 30, description: "For serious improvement", benefits: ["16 sessions", "Tournament prep", "Diet guidance", "Priority slots"], active: true, subs: 8 },
  { id: 4, name: "Intensive Pro", sessions: 24, price: 18000, validity: 45, description: "For competitive players", benefits: ["24 sessions", "Match analysis", "Physical conditioning", "1:1 video calls"], active: true, subs: 3 },
];

const MOCK_STUDENTS = [
  { name: "Arjun Mehta", package: "Monthly Elite", startDate: "2026-07-01", sessionsRemaining: "7 left", status: "Active" },
  { name: "Priya Sharma", package: "Intensive Pro", startDate: "2026-06-20", sessionsRemaining: "11 left", status: "Active" },
  { name: "Rahul Singh", package: "Starter Pack", startDate: "2026-07-05", sessionsRemaining: "5 left", status: "Active" },
  { name: "Deepa Nair", package: "Trial Pack", startDate: "2026-07-10", sessionsRemaining: "1 left", status: "Active" },
  { name: "Kiran Rao", package: "Monthly Elite", startDate: "2026-06-15", sessionsRemaining: "0 left", status: "Expired" },
];

export function TrainerSubscriptions() {
  const [packages, setPackages] = useState(INIT_PACKAGES);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ name: "", sessions: "", price: "", validity: "30", description: "", benefits: "", active: true });

  const savePackage = () => {
    if (!form.name || !form.price) return;
    setPackages(p => [...p, { id: Date.now(), name: form.name, sessions: Number(form.sessions), price: Number(form.price), validity: Number(form.validity), description: form.description, benefits: form.benefits.split("\n").filter(Boolean), active: form.active, subs: 0 }]);
    setShowModal(false);
    setToast("Package created");
  };

  type Student = typeof MOCK_STUDENTS[0];
  const subCols: ColDef<Student>[] = [
    { key: "name", label: "Student" },
    { key: "package", label: "Package", render: (v) => <Badge text={v} color="blue" /> },
    { key: "startDate", label: "Start Date" },
    { key: "sessionsRemaining", label: "Sessions" },
    { key: "status", label: "Status", render: (v) => <Badge text={v} color={v === "Active" ? "success" : v === "Expired" ? "red" : "orange"} /> },
  ];

  return (
    <div className="p-6 space-y-6">
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <PageHeader title="Coaching Packages" subtitle="Manage session bundles for your students"
        action={<button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#FFC400] text-[#17140A] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#D9A900]"><Plus size={16} />Create Package</button>} />

      <div className="grid grid-cols-4 gap-4">
        {packages.map(pkg => (
          <div key={pkg.id} className="bg-white border border-[#DFE0D8] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-[#181A1F] text-sm font-['Lexend']">{pkg.name}</h3>
                <p className="text-xs text-[#5F635C] mt-0.5">{pkg.description}</p>
              </div>
              <Badge text={pkg.active ? "Active" : "Paused"} color={pkg.active ? "success" : "orange"} />
            </div>
            <div className="text-2xl font-bold text-[#755900] mt-3">₹{pkg.price.toLocaleString()}</div>
            <p className="text-xs text-[#5F635C] mt-1">{pkg.sessions} sessions · {pkg.validity} days validity</p>
            <div className="flex items-center gap-1 text-xs text-[#7D8178] mt-2 mb-4"><Users size={12} />{pkg.subs} students enrolled</div>
            <ul className="space-y-1 mb-4">
              {pkg.benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-[#464A45]"><CheckCircle size={10} className="text-[#755900] shrink-0" />{b}</li>
              ))}
            </ul>
            <div className="flex gap-1.5 pt-3 border-t border-[#F7F7F3]">
              <button aria-label="Edit" className="flex-1 text-xs text-[#464A45] border border-[#C9CBC2] py-1.5 rounded-lg hover:bg-[#F7F7F3] flex items-center justify-center gap-1"><Edit2 size={10} />Edit</button>
              <button onClick={() => setPackages(p => p.map(x => x.id === pkg.id ? { ...x, active: !x.active } : x))} className="flex-1 text-xs text-[#464A45] border border-[#C9CBC2] py-1.5 rounded-lg hover:bg-[#F7F7F3]">{pkg.active ? "Pause" : "Resume"}</button>
              <button onClick={() => setPackages(p => p.filter(x => x.id !== pkg.id))} className="px-2 text-red-400 border border-red-100 py-1.5 rounded-lg hover:bg-red-50"><Trash2 size={11} /></button>
            </div>
          </div>
        ))}
      </div>

      <DataTable data={MOCK_STUDENTS} columns={subCols} title="Enrolled Students" pageSize={5} />

      {showModal && (
        <Modal title="Create Coaching Package" onClose={() => setShowModal(false)}>
          <Field label="Package Name"><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Weekend Warrior" className={inp} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Sessions"><input type="number" value={form.sessions} onChange={e => setForm(f => ({ ...f, sessions: e.target.value }))} placeholder="8" className={inp} /></Field>
            <Field label="Price (₹)"><input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="7500" className={inp} /></Field>
          </div>
          <Field label="Validity (days)"><input type="number" value={form.validity} onChange={e => setForm(f => ({ ...f, validity: e.target.value }))} className={inp} /></Field>
          <Field label="Short Description"><input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Ideal for..." className={inp} /></Field>
          <Field label="Benefits (one per line)"><textarea value={form.benefits} onChange={e => setForm(f => ({ ...f, benefits: e.target.value }))} rows={4} placeholder="Video analysis&#10;WhatsApp support" className={inp} /></Field>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="accent-[#D6A500] w-4 h-4" />
            <span className="text-sm text-[#30342F]">Publish immediately</span>
          </label>
          <button onClick={savePackage} className="w-full bg-[#FFC400] text-[#17140A] py-2.5 rounded-lg font-semibold text-sm hover:bg-[#D9A900]">Create Package</button>
        </Modal>
      )}
    </div>
  );
}

// ─── 4. TrainerAIInsights ─────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  "Student retention rate",
  "Peak hours analysis",
  "Revenue per student",
  "Popular sessions",
  "Underperforming slots",
  "Draft WhatsApp message",
];

const CANNED_RESPONSES = [
  "Your student retention is 78% over 90 days. Students who book within 48h of their last session have 94% retention — consider sending a rebooking nudge.",
  "Tuesday and Thursday 7–9 AM are your most booked slots (97% fill rate). Friday afternoons are at only 31% — consider a promotional offer.",
  "Average revenue per student this month is ₹2,340. Your top 5 students account for 42% of revenue.",
  "Here's a draft: 'Hi [Name]! 🏸 Great session today. Ready to work on those smashes next time? Book your next slot: [link]'",
];

type ChatMsg = { role: "ai" | "user"; text: string };

const INIT_CHAT: ChatMsg[] = [
  { role: "ai", text: "You have 3 students with sessions expiring this week. Sending a reminder now could recover ₹22,500 in potential renewals." },
  { role: "user", text: "Which session type is most popular?" },
  { role: "ai", text: "Private 1:1 sessions account for 68% of your bookings. Group sessions have higher revenue per hour (₹1,800 vs ₹1,200) but lower demand on weekday mornings." },
];

export function TrainerAIInsights() {
  const [messages, setMessages] = useState<ChatMsg[]>(INIT_CHAT);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [responseIdx, setResponseIdx] = useState(0);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", text: text.trim() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { role: "ai", text: CANNED_RESPONSES[responseIdx % CANNED_RESPONSES.length] }]);
      setResponseIdx(i => i + 1);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex">
      <div className="w-72 shrink-0 bg-[#111827] flex flex-col p-5">
        <div className="flex items-center gap-2 mb-6">
          <Brain size={20} className="text-[#755900]" />
          <h2 className="text-white font-bold font-['Lexend']">AI Insights</h2>
        </div>
        <p className="text-[#7D8178] text-xs mb-4">Quick actions</p>
        <div className="space-y-2 flex-1">
          {QUICK_ACTIONS.map(q => (
            <button key={q} onClick={() => send(q)}
              className="w-full text-left text-sm text-[#A5A89E] px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
              {q}
            </button>
          ))}
        </div>
        <div className="pt-4 border-t border-white/10">
          <p className="text-[#5F635C] text-xs">Powered by InspirQ AI · Your data stays private</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#F7F7F3]">
        <div className="px-6 py-4 bg-white border-b border-[#DFE0D8] flex items-center gap-3">
          <Brain size={18} className="text-[#755900]" />
          <span className="font-semibold text-[#181A1F]">Coaching Intelligence Assistant</span>
          <span className="ml-auto text-xs text-[#7D8178] bg-[#DFE0D8] px-2 py-1 rounded-full">Beta</span>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === "ai" ? "bg-white border border-[#DFE0D8] shadow-sm text-[#222520] rounded-tl-sm" : "bg-[#FFC400] text-[#17140A] rounded-tr-sm"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#DFE0D8] shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-2 h-2 rounded-full bg-[#7D8178] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="p-4 bg-white border-t border-[#DFE0D8]">
          <div className="flex gap-3">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)}
              placeholder="Ask about students, revenue, retention..."
              className="flex-1 border border-[#C9CBC2] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]" />
            <button onClick={() => send(input)} className="bg-[#FFC400] text-[#17140A] px-4 py-2.5 rounded-xl hover:bg-[#D9A900]"><Send size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 5. TrainerDataSettings ───────────────────────────────────────────────────

const SESSION_TYPES_INIT = [
  { id: "private", label: "Private 1:1", enabled: true, price: 1200, maxStudents: 1 },
  { id: "group", label: "Group Session", enabled: true, price: 600, maxStudents: 6 },
  { id: "online", label: "Online / Virtual", enabled: false, price: 800, maxStudents: 1 },
];

export function TrainerDataSettings() {
  const [tab, setTab] = useState<"sports" | "specs" | "sessions" | "venues">("sports");
  const [selectedSports, setSelectedSports] = useState<string[]>(["badminton", "tennis"]);
  const [specs, setSpecs] = useState<string[]>(["Footwork", "Smash Technique", "Tournament Prep"]);
  const [newSpec, setNewSpec] = useState("");
  const [sessionTypes, setSessionTypes] = useState(SESSION_TYPES_INIT);
  const [venuePrefs, setVenuePrefs] = useState({ homeName: "Court Masters Indoor Arena", homeAddress: "Indiranagar, Bangalore", radius: 15, slots: ["morning", "evening"] });
  const [toast, setToast] = useState("");

  const save = () => setToast("Settings saved successfully");

  const TABS = [
    { key: "sports" as const, label: "Sports" },
    { key: "specs" as const, label: "Specializations" },
    { key: "sessions" as const, label: "Session Types" },
    { key: "venues" as const, label: "Venue Preferences" },
  ];

  const TIME_SLOTS = [
    { id: "morning", label: "Morning (6–12 AM)" },
    { id: "afternoon", label: "Afternoon (12–5 PM)" },
    { id: "evening", label: "Evening (5–9 PM)" },
    { id: "weekend", label: "Weekends" },
  ];

  return (
    <div className="p-6 space-y-6">
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <PageHeader title="Data & Attribute Settings" subtitle="Configure your coaching profile, specializations, and preferences" />

      <div className="flex gap-1 bg-[#DFE0D8] p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? "bg-white text-[#181A1F] shadow-sm" : "text-[#5F635C] hover:text-[#30342F]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#DFE0D8] rounded-xl p-6 shadow-sm">
        {tab === "sports" && (
          <div>
            <h3 className="font-semibold text-[#181A1F] mb-4 font-['Lexend']">Sports You Coach</h3>
            <div className="grid grid-cols-3 gap-3">
              {SPORTS.map(s => (
                <label key={s.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedSports.includes(s.id) ? "border-[#D6A500] bg-[#FFC400]/5" : "border-[#C9CBC2] hover:border-[#A5A89E]"}`}>
                  <input type="checkbox" checked={selectedSports.includes(s.id)} onChange={() => setSelectedSports(ss => ss.includes(s.id) ? ss.filter(x => x !== s.id) : [...ss, s.id])} className="accent-[#D6A500]" />
                  <span className="text-base">{s.icon}</span>
                  <span className="text-sm font-medium text-[#222520]">{s.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {tab === "specs" && (
          <div>
            <h3 className="font-semibold text-[#181A1F] mb-4 font-['Lexend']">Your Specializations</h3>
            <div className="flex flex-wrap gap-2 mb-5">
              {specs.map(s => (
                <span key={s} className="flex items-center gap-1.5 bg-[#FFC400]/10 text-[#755900] px-3 py-1.5 rounded-full text-sm font-medium">
                  {s}
                  <button onClick={() => setSpecs(ss => ss.filter(x => x !== s))} className="hover:text-red-500 transition-colors"><X size={12} /></button>
                </span>
              ))}
              {specs.length === 0 && <p className="text-sm text-[#7D8178]">No specializations added yet.</p>}
            </div>
            <div className="flex gap-2 pt-4 border-t border-[#DFE0D8]">
              <input value={newSpec} onChange={e => setNewSpec(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && newSpec.trim()) { setSpecs(s => [...s, newSpec.trim()]); setNewSpec(""); } }} placeholder="Add specialization (e.g. Drop Shot Mastery)" className={`${inp} flex-1`} />
              <button onClick={() => { if (newSpec.trim()) { setSpecs(s => [...s, newSpec.trim()]); setNewSpec(""); } }} className="px-4 bg-[#181A1F] text-white rounded-lg text-sm font-medium hover:bg-[#222520]"><Plus size={16} /></button>
            </div>
          </div>
        )}

        {tab === "sessions" && (
          <div>
            <h3 className="font-semibold text-[#181A1F] mb-4 font-['Lexend']">Session Types & Pricing</h3>
            <div className="space-y-4">
              {sessionTypes.map((st, i) => (
                <div key={st.id} className={`p-4 rounded-xl border transition-colors ${st.enabled ? "border-[#D6A500]/30 bg-[#FFC400]/5" : "border-[#C9CBC2] bg-[#F7F7F3]"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-[#181A1F]">{st.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={st.enabled} onChange={() => setSessionTypes(s => s.map((x, j) => j === i ? { ...x, enabled: !x.enabled } : x))} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[#C9CBC2] rounded-full peer peer-checked:bg-[#FFC400] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Price per hour (₹)">
                      <input type="number" value={st.price} disabled={!st.enabled}
                        onChange={e => setSessionTypes(s => s.map((x, j) => j === i ? { ...x, price: Number(e.target.value) } : x))}
                        className={`${inp} disabled:bg-[#DFE0D8] disabled:text-[#7D8178]`} />
                    </Field>
                    <Field label="Max students">
                      <input type="number" value={st.maxStudents} disabled={!st.enabled}
                        onChange={e => setSessionTypes(s => s.map((x, j) => j === i ? { ...x, maxStudents: Number(e.target.value) } : x))}
                        className={`${inp} disabled:bg-[#DFE0D8] disabled:text-[#7D8178]`} />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "venues" && (
          <div className="space-y-5">
            <h3 className="font-semibold text-[#181A1F] font-['Lexend']">Venue Preferences</h3>
            <Field label="Home Venue Name"><input value={venuePrefs.homeName} onChange={e => setVenuePrefs(v => ({ ...v, homeName: e.target.value }))} className={inp} /></Field>
            <Field label="Address"><input value={venuePrefs.homeAddress} onChange={e => setVenuePrefs(v => ({ ...v, homeAddress: e.target.value }))} className={inp} /></Field>
            <Field label={`Travel Radius: ${venuePrefs.radius} km`}>
              <input type="range" min={0} max={50} value={venuePrefs.radius} onChange={e => setVenuePrefs(v => ({ ...v, radius: Number(e.target.value) }))}
                className="w-full accent-[#D6A500]" />
              <div className="flex justify-between text-xs text-[#7D8178] mt-1"><span>0 km</span><span>50 km</span></div>
            </Field>
            <Field label="Preferred Time Slots">
              <div className="grid grid-cols-2 gap-2 mt-1">
                {TIME_SLOTS.map(slot => (
                  <label key={slot.id} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${venuePrefs.slots.includes(slot.id) ? "border-[#D6A500] bg-[#FFC400]/5" : "border-[#C9CBC2]"}`}>
                    <input type="checkbox" checked={venuePrefs.slots.includes(slot.id)} onChange={() => setVenuePrefs(v => ({ ...v, slots: v.slots.includes(slot.id) ? v.slots.filter(x => x !== slot.id) : [...v.slots, slot.id] }))} className="accent-[#D6A500]" />
                    <span className="text-sm text-[#30342F]">{slot.label}</span>
                  </label>
                ))}
              </div>
            </Field>
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
