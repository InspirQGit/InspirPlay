import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Boxes,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Copy,
  CreditCard,
  ImagePlus,
  Layers3,
  MoreHorizontal,
  Package,
  PackageCheck,
  Percent,
  Plus,
  ReceiptText,
  RefreshCcw,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Toaster } from "../components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/SmartTable";
import { Textarea } from "../components/ui/textarea";

type CommerceRole = "venue" | "coach" | "organizer";
type Section = "sell" | "catalog" | "categories" | "orders" | "promotions" | "returns";
type ItemKind = "product" | "service";

type CommerceItem = {
  id: number;
  name: string;
  kind: ItemKind;
  category: string;
  price: number;
  compareAt?: number;
  stock: number | null;
  lowStock: number | null;
  sku: string;
  image: string;
  status: "active" | "draft";
  description: string;
  duration?: string;
  tax: number;
};

type CartLine = { item: CommerceItem; quantity: number };

const PRODUCT_IMAGE =
  "/inspirq-media/gear.svg";
const KIT_IMAGE =
  "/inspirq-media/gear.svg";
const BAG_IMAGE =
  "/inspirq-media/gear.svg";

const ROLE_CONFIG = {
  venue: {
    eyebrow: "Court Masters Indoor Arena",
    helper: "Sell at the front desk and manage venue retail, rentals, and add-on services.",
    customer: "Player",
    service: "Court add-on",
  },
  coach: {
    eyebrow: "Coach Rajesh",
    helper: "Sell training plans, assessments, equipment, and session add-ons.",
    customer: "Student",
    service: "Coaching service",
  },
  organizer: {
    eyebrow: "SportsFest Events",
    helper: "Sell event merchandise, passes, team packages, and tournament services.",
    customer: "Participant",
    service: "Event service",
  },
} satisfies Record<CommerceRole, Record<string, string>>;

const BASE_ITEMS: CommerceItem[] = [
  {
    id: 1,
    name: "Pro Badminton Racket",
    kind: "product",
    category: "Equipment",
    price: 2499,
    compareAt: 2999,
    stock: 18,
    lowStock: 6,
    sku: "EQT-RKT-001",
    image: PRODUCT_IMAGE,
    status: "active",
    description: "Tournament-ready graphite racket with protective cover and fresh grip.",
    tax: 18,
  },
  {
    id: 2,
    name: "Match Day Essentials Kit",
    kind: "product",
    category: "Merchandise",
    price: 899,
    stock: 7,
    lowStock: 10,
    sku: "MER-KIT-014",
    image: KIT_IMAGE,
    status: "active",
    description: "Towel, bottle, wristband, and carry pouch bundled for match day.",
    tax: 12,
  },
  {
    id: 3,
    name: "Premium Racket Rental",
    kind: "service",
    category: "Rentals",
    price: 199,
    stock: null,
    lowStock: null,
    sku: "SRV-RNT-004",
    image: BAG_IMAGE,
    status: "active",
    description: "Premium racket rental, freshly gripped and ready at check-in.",
    duration: "2 hours",
    tax: 18,
  },
  {
    id: 4,
    name: "Performance Assessment",
    kind: "service",
    category: "Training",
    price: 1499,
    stock: null,
    lowStock: null,
    sku: "SRV-ASM-002",
    image: PRODUCT_IMAGE,
    status: "active",
    description: "A structured skill assessment with a personalized improvement report.",
    duration: "60 minutes",
    tax: 18,
  },
  {
    id: 5,
    name: "Hydration Pack",
    kind: "product",
    category: "Food & drinks",
    price: 149,
    stock: 42,
    lowStock: 12,
    sku: "FNB-HYD-008",
    image: BAG_IMAGE,
    status: "active",
    description: "Water, electrolyte drink, and energy bar in a convenient bundle.",
    tax: 5,
  },
  {
    id: 6,
    name: "Tournament Media Pack",
    kind: "service",
    category: "Event services",
    price: 2999,
    stock: null,
    lowStock: null,
    sku: "SRV-MED-011",
    image: KIT_IMAGE,
    status: "draft",
    description: "Action photography and a short highlight reel for one team.",
    duration: "Per event",
    tax: 18,
  },
];

const ORDERS = [
  { id: "#IQ-1048", customer: "Arjun Mehta", time: "Today, 10:32 AM", items: "2 items", channel: "In-person", payment: "UPI", total: 2948, status: "Paid" },
  { id: "#IQ-1047", customer: "Priya Sharma", time: "Today, 9:55 AM", items: "1 service", channel: "Online", payment: "Card", total: 1769, status: "Paid" },
  { id: "#IQ-1046", customer: "Ravi Kumar", time: "Today, 9:12 AM", items: "3 items", channel: "In-person", payment: "Cash", total: 1237, status: "Partially refunded" },
  { id: "#IQ-1045", customer: "Deepa Nair", time: "Yesterday, 7:48 PM", items: "1 item", channel: "Online", payment: "UPI", total: 899, status: "Paid" },
  { id: "#IQ-1044", customer: "Kiran Reddy", time: "Yesterday, 6:20 PM", items: "2 services", channel: "In-person", payment: "Card", total: 3538, status: "Pending" },
];

const PROMOTIONS = [
  { code: "WEEKEND20", label: "Weekend rush", value: "20% off", applies: "All products", uses: 42, limit: 100, status: "Active", end: "31 Aug 2026" },
  { code: "FIRSTPLAY", label: "First purchase", value: "₹250 off", applies: "Services", uses: 67, limit: 150, status: "Active", end: "30 Sep 2026" },
  { code: "TEAM10", label: "Team checkout", value: "10% off", applies: "Orders over ₹2,000", uses: 18, limit: 80, status: "Scheduled", end: "15 Oct 2026" },
  { code: "SUMMER15", label: "Summer campaign", value: "15% off", applies: "Selected categories", uses: 120, limit: 120, status: "Expired", end: "30 Jun 2026" },
];

const RETURNS = [
  { id: "RET-028", order: "#IQ-1046", customer: "Ravi Kumar", item: "Match Day Essentials Kit", reason: "Missing item", amount: 899, date: "Today, 9:30 AM", status: "Needs review" },
  { id: "RET-027", order: "#IQ-1039", customer: "Kiran Reddy", item: "Pro Badminton Racket", reason: "Product defect", amount: 2499, date: "Yesterday", status: "Approved" },
  { id: "RET-026", order: "#IQ-1028", customer: "Meera Joshi", item: "Hydration Pack", reason: "Wrong item", amount: 149, date: "12 Jul 2026", status: "Refunded" },
];

const CATEGORIES = [
  { name: "Equipment", count: 12, type: "Products", tax: "18% GST", mapped: "Sports equipment", color: "bg-blue-50 text-blue-700" },
  { name: "Merchandise", count: 8, type: "Products", tax: "12% GST", mapped: "Apparel & accessories", color: "bg-violet-50 text-violet-700" },
  { name: "Rentals", count: 5, type: "Services", tax: "18% GST", mapped: "Equipment rental", color: "bg-amber-50 text-amber-700" },
  { name: "Training", count: 6, type: "Services", tax: "18% GST", mapped: "Sports coaching", color: "bg-sky-50 text-sky-700" },
  { name: "Food & drinks", count: 9, type: "Products", tax: "5% GST", mapped: "Packaged food", color: "bg-rose-50 text-rose-700" },
  { name: "Event services", count: 4, type: "Services", tax: "18% GST", mapped: "Event management", color: "bg-cyan-50 text-cyan-700" },
];

const SECTION_NAV: { id: Section; label: string; icon: typeof ShoppingCart }[] = [
  { id: "sell", label: "Sell", icon: ShoppingCart },
  { id: "catalog", label: "Products & services", icon: Package },
  { id: "categories", label: "Categories", icon: Layers3 },
  { id: "orders", label: "Orders", icon: ReceiptText },
  { id: "promotions", label: "Promotions", icon: Percent },
  { id: "returns", label: "Returns", icon: RefreshCcw },
];

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

function StatusBadge({ value }: { value: string }) {
  const tone =
    value === "Paid" || value === "Active" || value === "Approved" || value === "Refunded"
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : value === "Pending" || value === "Scheduled" || value === "Needs review"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : value === "Partially refunded"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-muted text-muted-foreground border-border";
  return <Badge variant="outline" className={tone}>{value}</Badge>;
}

function Metric({
  icon: Icon,
  label,
  value,
  note,
  warning,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  note: string;
  warning?: boolean;
}) {
  return (
    <Card className="gap-0 shadow-none">
      <CardContent className="flex items-start justify-between p-4">
        <div>
          <div className="text-xs font-medium text-muted-foreground">{label}</div>
          <div className="mt-1 font-['Lexend'] text-xl font-semibold text-foreground">{value}</div>
          <div className={`mt-1 text-xs ${warning ? "text-amber-700" : "text-muted-foreground"}`}>{note}</div>
        </div>
        <div className={`rounded-lg p-2.5 ${warning ? "bg-amber-50 text-amber-700" : "bg-primary/10 text-brand-text"}`}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="font-['Lexend'] text-xl font-semibold text-foreground">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{description}</div>
      </div>
      {action}
    </div>
  );
}

function ProductForm({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: CommerceItem | null;
  onSave: (item: CommerceItem) => void;
}) {
  const [kind, setKind] = useState<ItemKind>(initial?.kind ?? "product");
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Equipment");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [stock, setStock] = useState(String(initial?.stock ?? ""));
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState(initial?.image ?? PRODUCT_IMAGE);

  const save = () => {
    if (!name.trim() || !price) return;
    onSave({
      id: initial?.id ?? Date.now(),
      name: name.trim(),
      kind,
      category,
      price: Number(price),
      stock: kind === "product" ? Number(stock || 0) : null,
      lowStock: kind === "product" ? 5 : null,
      sku: sku || `${kind === "product" ? "PRD" : "SRV"}-${Date.now().toString().slice(-4)}`,
      image,
      status: initial?.status ?? "active",
      description,
      duration: kind === "service" ? "60 minutes" : undefined,
      tax: 18,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit item" : "Add product or service"}</DialogTitle>
          <DialogDescription>Create a sellable item with pricing, category, media, and availability.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-2 sm:grid-cols-[11rem_1fr]">
          <div className="space-y-3">
            <img src={image} alt="" className="aspect-square w-full rounded-lg border object-cover" />
            <Button variant="outline" className="w-full" onClick={() => setImage(KIT_IMAGE)}>
              <ImagePlus /> Change image
            </Button>
            <div className="relative">
              <Input type="file" accept="image/*" className="cursor-pointer text-xs file:hidden" aria-label="Upload product image" />
              <Upload className="pointer-events-none absolute right-3 top-2.5 size-4 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
              {(["product", "service"] as const).map((value) => (
                <Button key={value} variant={kind === value ? "default" : "ghost"} size="sm" onClick={() => setKind(value)}>
                  {value === "product" ? <Package /> : <CalendarClock />}
                  {value === "product" ? "Product" : "Service"}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-name">Name</Label>
              <Input id="item-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Weekend coaching clinic" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((item) => <SelectItem key={item.name} value={item.name}>{item.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-sku">SKU</Label>
                <Input id="item-sku" value={sku} onChange={(event) => setSku(event.target.value)} placeholder="Auto-generated if blank" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="item-price">Selling price</Label>
                <Input id="item-price" type="number" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0.00" />
              </div>
              {kind === "product" ? (
                <div className="space-y-2">
                  <Label htmlFor="item-stock">Opening stock</Label>
                  <Input id="item-stock" type="number" value={stock} onChange={(event) => setStock(event.target.value)} placeholder="0" />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select defaultValue="60 minutes">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30 minutes">30 minutes</SelectItem>
                      <SelectItem value="60 minutes">60 minutes</SelectItem>
                      <SelectItem value="90 minutes">90 minutes</SelectItem>
                      <SelectItem value="Per event">Per event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-description">Description</Label>
              <Textarea id="item-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What customers should know about this item" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save}>{initial ? "Save changes" : "Add to catalog"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CommerceWorkspace({ role }: { role: CommerceRole }) {
  const config = ROLE_CONFIG[role];
  const [section, setSection] = useState<Section>("sell");
  const [items, setItems] = useState(BASE_ITEMS);
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | ItemKind>("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customer, setCustomer] = useState("");
  const [payment, setPayment] = useState("UPI");
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CommerceItem | null>(null);
  const [detailItem, setDetailItem] = useState<CommerceItem | null>(null);
  const [orderDetail, setOrderDetail] = useState<(typeof ORDERS)[number] | null>(null);
  const [returnDetail, setReturnDetail] = useState<(typeof RETURNS)[number] | null>(null);
  const [showPromotionForm, setShowPromotionForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const activeItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase()) || item.sku.toLowerCase().includes(query.toLowerCase());
        const matchesKind = kindFilter === "all" || item.kind === kindFilter;
        const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
        return matchesQuery && matchesKind && matchesCategory;
      }),
    [items, query, kindFilter, categoryFilter],
  );

  const addToCart = (item: CommerceItem) => {
    setCart((current) => {
      const existing = current.find((line) => line.item.id === item.id);
      return existing
        ? current.map((line) => line.item.id === item.id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((current) =>
      current
        .map((line) => line.item.id === id ? { ...line, quantity: line.quantity + delta } : line)
        .filter((line) => line.quantity > 0),
    );
  };

  const subtotal = cart.reduce((sum, line) => sum + line.item.price * line.quantity, 0);
  const discountAmount = Math.round(subtotal * discount);
  const taxes = Math.round((subtotal - discountAmount) * 0.18);
  const total = subtotal - discountAmount + taxes;

  const applyDiscount = () => {
    if (discountCode.trim().toUpperCase() === "WEEKEND20") {
      setDiscount(0.2);
      toast.success("WEEKEND20 applied");
    } else {
      setDiscount(0);
      toast.error("Promo code isn’t valid for this order");
    }
  };

  const completeSale = () => {
    if (!cart.length) return;
    setCart([]);
    setCustomer("");
    setDiscountCode("");
    setDiscount(0);
    toast.success(`Order completed — ${money(total)} paid via ${payment}`);
  };

  const saveItem = (item: CommerceItem) => {
    setItems((current) => current.some((entry) => entry.id === item.id)
      ? current.map((entry) => entry.id === item.id ? item : entry)
      : [item, ...current]);
    setEditingItem(null);
    toast.success(item.id ? "Catalog updated" : "Item created");
  };

  return (
    <div className="min-h-full bg-background">
      <Toaster position="bottom-right" richColors />
      <div className="px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="font-['Lexend'] text-2xl font-semibold tracking-tight text-foreground">Inventory & point of sale</div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.success("Inventory report exported")}>
              <ArrowRight className="rotate-90" /> Export
            </Button>
            <Button onClick={() => { setEditingItem(null); setShowProductForm(true); }}>
              <Plus /> Add product or service
            </Button>
          </div>
        </div>
      </div>

      <div className="border-b bg-card px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-screen-2xl gap-1 overflow-x-auto py-2">
          {SECTION_NAV.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={section === id ? "secondary" : "ghost"}
              className={section === id ? "text-brand-text" : "text-muted-foreground"}
              onClick={() => setSection(id)}
            >
              <Icon /> {label}
              {id === "returns" && <span className="rounded-full bg-amber-100 px-1.5 text-xs text-amber-800">1</span>}
            </Button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl space-y-6 p-4 sm:p-6 lg:p-8">
        {section === "sell" && (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Metric icon={CircleDollarSign} label="Gross sales today" value="₹38,420" note="+12.4% from yesterday" />
              <Metric icon={ShoppingBag} label="Orders today" value="28" note="₹1,372 average order" />
              <Metric icon={Users} label="Customers" value="24" note="6 returning customers" />
              <Metric icon={AlertTriangle} label="Stock attention" value="3 items" note="1 item below reorder point" warning />
            </div>

            <div className="grid min-h-screen gap-5 xl:grid-cols-3">
              <Card className="gap-0 overflow-hidden shadow-none xl:col-span-2">
                <div className="border-b p-4">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search product, service, or scan SKU" className="pl-9" />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All categories</SelectItem>
                        {CATEGORIES.map((category) => <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {(["all", "product", "service"] as const).map((value) => (
                      <Button key={value} size="sm" variant={kindFilter === value ? "default" : "outline"} onClick={() => setKindFilter(value)}>
                        {value === "all" ? "All items" : value === "product" ? "Products" : "Services"}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeItems.filter((item) => item.status === "active").map((item) => (
                    <Card key={item.id} className="group gap-0 overflow-hidden shadow-none transition-shadow hover:shadow-md">
                      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        <img src={item.image} alt={item.name} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        <Badge className="absolute left-2 top-2 bg-card/95 text-card-foreground">{item.kind === "product" ? "Product" : "Service"}</Badge>
                        {item.stock !== null && item.lowStock !== null && item.stock <= item.lowStock && (
                          <Badge className="absolute right-2 top-2 bg-amber-100 text-amber-800">Only {item.stock} left</Badge>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <div className="text-xs text-muted-foreground">{item.category}</div>
                        <div className="mt-0.5 line-clamp-1 text-sm font-semibold text-foreground">{item.name}</div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="font-['Lexend'] font-semibold">{money(item.price)}</div>
                          <Button size="sm" onClick={() => addToCart(item)}><Plus /> Add</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Card>

              <Card className="sticky top-4 h-fit gap-0 overflow-hidden shadow-sm">
                <div className="flex items-center justify-between border-b p-4">
                  <div>
                    <div className="font-['Lexend'] font-semibold">Current order</div>
                    <div className="text-xs text-muted-foreground">{cart.reduce((sum, line) => sum + line.quantity, 0)} items</div>
                  </div>
                  {cart.length > 0 && <Button variant="ghost" size="sm" onClick={() => setCart([])}>Clear</Button>}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center px-6 py-12 text-center">
                      <div className="rounded-full bg-muted p-4"><ShoppingCart className="size-6 text-muted-foreground" /></div>
                      <div className="mt-3 text-sm font-semibold">Ready for a new order</div>
                      <div className="mt-1 text-xs text-muted-foreground">Select products or services to begin.</div>
                    </div>
                  ) : cart.map((line) => (
                    <div key={line.item.id} className="flex items-center gap-3 border-b px-4 py-3">
                      <img src={line.item.image} alt="" className="size-10 rounded-md object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{line.item.name}</div>
                        <div className="text-xs text-muted-foreground">{money(line.item.price)}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="size-7" onClick={() => updateQuantity(line.item.id, -1)}>−</Button>
                        <span className="w-6 text-center text-sm">{line.quantity}</span>
                        <Button variant="outline" size="icon" className="size-7" onClick={() => updateQuantity(line.item.id, 1)}>+</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 border-t p-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">{config.customer}</Label>
                    <Input id="customer-name" value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder={`Search or add ${config.customer.toLowerCase()}`} />
                  </div>
                  <div className="flex gap-2">
                    <Input value={discountCode} onChange={(event) => setDiscountCode(event.target.value.toUpperCase())} placeholder="Promo code" />
                    <Button variant="outline" onClick={applyDiscount}>Apply</Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{money(subtotal)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-sky-700"><span>WEEKEND20</span><span>−{money(discountAmount)}</span></div>}
                    <div className="flex justify-between text-muted-foreground"><span>Estimated tax</span><span>{money(taxes)}</span></div>
                    <div className="flex justify-between border-t pt-3 font-['Lexend'] text-lg font-semibold"><span>Total</span><span>{money(total)}</span></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["UPI", "Card", "Cash"].map((method) => (
                      <Button key={method} variant={payment === method ? "secondary" : "outline"} size="sm" onClick={() => setPayment(method)}>
                        {method === "Card" && <CreditCard />}{method}
                      </Button>
                    ))}
                  </div>
                  <Button size="lg" className="w-full" disabled={!cart.length} onClick={completeSale}>
                    Charge {money(total)} <ArrowRight />
                  </Button>
                </div>
              </Card>
            </div>
          </>
        )}

        {section === "catalog" && (
          <>
            <SectionHeader
              title="Products & services"
              description="A single catalog for stocked products, rentals, sessions, and event services."
              action={<Button onClick={() => { setEditingItem(null); setShowProductForm(true); }}><Plus /> Add item</Button>}
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Metric icon={Package} label="Active catalog" value={String(items.filter((item) => item.status === "active").length)} note={`${items.filter((item) => item.kind === "product").length} products · ${items.filter((item) => item.kind === "service").length} services`} />
              <Metric icon={Boxes} label="Units on hand" value={String(items.reduce((sum, item) => sum + (item.stock ?? 0), 0))} note="Across all locations" />
              <Metric icon={AlertTriangle} label="Low stock" value={String(items.filter((item) => item.stock !== null && item.lowStock !== null && item.stock <= item.lowStock).length)} note="Replenishment recommended" warning />
              <Metric icon={CircleDollarSign} label="Inventory value" value="₹1,24,680" note="At current retail price" />
            </div>
            <Card className="gap-0 overflow-hidden shadow-none">
              <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or SKU" className="pl-9" />
                </div>
                <Select value={kindFilter} onValueChange={(value) => setKindFilter(value as typeof kindFilter)}>
                  <SelectTrigger className="lg:w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="product">Products</SelectItem>
                    <SelectItem value="service">Services</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="lg:w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All categories</SelectItem>
                    {CATEGORIES.map((category) => <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead><TableHead>Type</TableHead><TableHead>Category</TableHead>
                      <TableHead>Price</TableHead><TableHead>Availability</TableHead><TableHead>Status</TableHead><TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeItems.map((item) => (
                      <TableRow key={item.id} className="cursor-pointer" onClick={() => setDetailItem(item)}>
                        <TableCell>
                          <div className="flex min-w-56 items-center gap-3">
                            <img src={item.image} alt="" className="size-11 rounded-md object-cover" />
                            <div><div className="font-medium">{item.name}</div><div className="text-xs text-muted-foreground">{item.sku}</div></div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="secondary">{item.kind}</Badge></TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="font-medium">{money(item.price)}</TableCell>
                        <TableCell>
                          {item.stock === null ? <span className="text-muted-foreground">{item.duration}</span> : (
                            <span className={item.lowStock !== null && item.stock <= item.lowStock ? "text-amber-700" : ""}>{item.stock} in stock</span>
                          )}
                        </TableCell>
                        <TableCell><StatusBadge value={item.status === "active" ? "Active" : "Draft"} /></TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); setEditingItem(item); setShowProductForm(true); }}>
                            <MoreHorizontal />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </>
        )}

        {section === "categories" && (
          <>
            <SectionHeader
              title="Category mapping"
              description="Organize the catalog and map every category to consistent tax and reporting groups."
              action={<Button onClick={() => setShowCategoryForm(true)}><Plus /> New category</Button>}
            />
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
              <div className="flex items-start gap-3"><Sparkles className="mt-0.5 size-4 shrink-0" /><div><span className="font-semibold">Smart mapping is on.</span> New items inherit tax rules and reporting groups from their category, reducing checkout errors.</div></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {CATEGORIES.map((category) => (
                <Card key={category.name} className="gap-0 shadow-none">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className={`rounded-lg p-2.5 ${category.color}`}><Tag className="size-5" /></div>
                      <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                    </div>
                    <div className="mt-4 font-['Lexend'] font-semibold">{category.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{category.count} items · {category.type}</div>
                    <div className="mt-4 space-y-2 rounded-lg bg-muted/70 p-3 text-xs">
                      <div className="flex justify-between"><span className="text-muted-foreground">Reporting group</span><span className="font-medium">{category.mapped}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Tax rule</span><span className="font-medium">{category.tax}</span></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {section === "orders" && (
          <>
            <SectionHeader title="Order history" description="Track every in-person and online sale from payment to refund." action={<Button variant="outline"><ArrowRight className="rotate-90" /> Export orders</Button>} />
            <div className="grid gap-4 md:grid-cols-3">
              <Metric icon={CircleDollarSign} label="Net sales" value="₹1,82,460" note="Last 30 days" />
              <Metric icon={ReceiptText} label="Total orders" value="184" note="68% in-person sales" />
              <Metric icon={RefreshCcw} label="Refund rate" value="1.8%" note="Below 2.4% benchmark" />
            </div>
            <Card className="gap-0 overflow-hidden shadow-none">
              <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
                <div className="relative flex-1"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input placeholder="Search order or customer" className="pl-9" /></div>
                <Select defaultValue="all"><SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="refunded">Refunded</SelectItem></SelectContent></Select>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Items</TableHead><TableHead>Channel</TableHead><TableHead>Payment</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
                  <TableBody>
                    {ORDERS.map((order) => (
                      <TableRow key={order.id} className="cursor-pointer" onClick={() => setOrderDetail(order)}>
                        <TableCell><div className="font-medium text-brand-text">{order.id}</div><div className="text-xs text-muted-foreground">{order.time}</div></TableCell>
                        <TableCell className="font-medium">{order.customer}</TableCell><TableCell>{order.items}</TableCell><TableCell>{order.channel}</TableCell><TableCell>{order.payment}</TableCell>
                        <TableCell className="font-semibold">{money(order.total)}</TableCell><TableCell><StatusBadge value={order.status} /></TableCell>
                        <TableCell><ChevronRight className="size-4 text-muted-foreground" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </>
        )}

        {section === "promotions" && (
          <>
            <SectionHeader title="Promotions" description="Create targeted discounts with usage limits, schedules, and catalog rules." action={<Button onClick={() => setShowPromotionForm(true)}><Plus /> Create promotion</Button>} />
            <div className="grid gap-4 md:grid-cols-3">
              <Metric icon={Percent} label="Promotion sales" value="₹46,820" note="25.7% of net sales" />
              <Metric icon={Tag} label="Active codes" value="2" note="1 scheduled next" />
              <Metric icon={Users} label="Customers reached" value="127" note="34 first-time buyers" />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {PROMOTIONS.map((promotion) => (
                <Card key={promotion.code} className="gap-0 shadow-none">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-primary/10 p-2.5 text-brand-text"><Percent className="size-5" /></div>
                        <div><div className="font-['Lexend'] font-semibold">{promotion.label}</div><div className="mt-0.5 text-sm text-muted-foreground">{promotion.value} · {promotion.applies}</div></div>
                      </div>
                      <StatusBadge value={promotion.status} />
                    </div>
                    <div className="mt-5 flex items-center gap-2">
                      <div className="rounded-md border border-dashed bg-muted/60 px-3 py-2 font-mono text-sm font-semibold tracking-wide">{promotion.code}</div>
                      <Button variant="ghost" size="icon" onClick={() => toast.success(`${promotion.code} copied`)}><Copy /></Button>
                    </div>
                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">Usage</span><span>{promotion.uses} / {promotion.limit}</span></div>
                      <Progress value={Math.min(100, promotion.uses / promotion.limit * 100)} className="h-2" />
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground"><span>Ends {promotion.end}</span><Button variant="ghost" size="sm">View performance <ChevronRight /></Button></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {section === "returns" && (
          <>
            <SectionHeader title="Returns & refunds" description="Review requests, restock eligible products, and keep a complete refund trail." action={<Button variant="outline" onClick={() => toast.success("Return created")}><Plus /> Start a return</Button>} />
            <div className="grid gap-4 md:grid-cols-3">
              <Metric icon={Clock3} label="Needs review" value="1" note="Oldest request is 2 hours" warning />
              <Metric icon={PackageCheck} label="Restocked" value="8 units" note="This month" />
              <Metric icon={CircleDollarSign} label="Refunded" value="₹4,732" note="Last 30 days" />
            </div>
            <Card className="gap-0 overflow-hidden shadow-none">
              <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
                <div className="relative flex-1"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input placeholder="Search return, order, or customer" className="pl-9" /></div>
                <Select defaultValue="all"><SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All returns</SelectItem><SelectItem value="review">Needs review</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="refunded">Refunded</SelectItem></SelectContent></Select>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Return</TableHead><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Item</TableHead><TableHead>Reason</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
                  <TableBody>
                    {RETURNS.map((item) => (
                      <TableRow key={item.id} className="cursor-pointer" onClick={() => setReturnDetail(item)}>
                        <TableCell><div className="font-medium text-brand-text">{item.id}</div><div className="text-xs text-muted-foreground">{item.date}</div></TableCell>
                        <TableCell>{item.order}</TableCell><TableCell className="font-medium">{item.customer}</TableCell><TableCell>{item.item}</TableCell><TableCell>{item.reason}</TableCell>
                        <TableCell className="font-semibold">{money(item.amount)}</TableCell><TableCell><StatusBadge value={item.status} /></TableCell><TableCell><ChevronRight className="size-4 text-muted-foreground" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </>
        )}
      </div>

      <ProductForm
        key={editingItem?.id ?? (showProductForm ? "new-open" : "new-closed")}
        open={showProductForm}
        onOpenChange={(open) => { setShowProductForm(open); if (!open) setEditingItem(null); }}
        initial={editingItem}
        onSave={saveItem}
      />

      <Dialog open={Boolean(detailItem)} onOpenChange={(open) => !open && setDetailItem(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl">
          {detailItem && (
            <>
              <DialogHeader><DialogTitle>Item details</DialogTitle><DialogDescription>{detailItem.sku} · Last updated today</DialogDescription></DialogHeader>
              <div className="grid gap-6 sm:grid-cols-[15rem_1fr]">
                <img src={detailItem.image} alt={detailItem.name} className="aspect-square w-full rounded-lg border object-cover" />
                <div>
                  <div className="flex flex-wrap gap-2"><Badge variant="secondary">{detailItem.kind}</Badge><StatusBadge value={detailItem.status === "active" ? "Active" : "Draft"} /></div>
                  <div className="mt-3 font-['Lexend'] text-2xl font-semibold">{detailItem.name}</div>
                  <div className="mt-2 text-sm leading-6 text-muted-foreground">{detailItem.description}</div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-muted p-3"><div className="text-xs text-muted-foreground">Price</div><div className="mt-1 font-semibold">{money(detailItem.price)}</div></div>
                    <div className="rounded-lg bg-muted p-3"><div className="text-xs text-muted-foreground">{detailItem.kind === "product" ? "Available" : "Duration"}</div><div className="mt-1 font-semibold">{detailItem.stock === null ? detailItem.duration : `${detailItem.stock} units`}</div></div>
                    <div className="rounded-lg bg-muted p-3"><div className="text-xs text-muted-foreground">Category</div><div className="mt-1 font-semibold">{detailItem.category}</div></div>
                    <div className="rounded-lg bg-muted p-3"><div className="text-xs text-muted-foreground">Tax</div><div className="mt-1 font-semibold">{detailItem.tax}% GST</div></div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="destructive" onClick={() => { setItems((current) => current.filter((item) => item.id !== detailItem.id)); setDetailItem(null); toast.success("Item removed"); }}><Trash2 /> Delete</Button>
                <Button onClick={() => { setEditingItem(detailItem); setDetailItem(null); setShowProductForm(true); }}>Edit item</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(orderDetail)} onOpenChange={(open) => !open && setOrderDetail(null)}>
        <DialogContent className="sm:max-w-xl">
          {orderDetail && (
            <>
              <DialogHeader><DialogTitle>Order {orderDetail.id}</DialogTitle><DialogDescription>{orderDetail.time} · {orderDetail.channel}</DialogDescription></DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-muted p-4"><div><div className="text-xs text-muted-foreground">Customer</div><div className="font-medium">{orderDetail.customer}</div></div><StatusBadge value={orderDetail.status} /></div>
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center gap-3"><img src={PRODUCT_IMAGE} alt="" className="size-12 rounded-md object-cover" /><div className="flex-1"><div className="text-sm font-medium">Pro Badminton Racket</div><div className="text-xs text-muted-foreground">1 × ₹2,499</div></div><div className="font-medium">₹2,499</div></div>
                  <div className="flex justify-between border-t pt-3 text-sm"><span className="text-muted-foreground">GST</span><span>₹449</span></div>
                  <div className="flex justify-between font-['Lexend'] font-semibold"><span>Total</span><span>{money(orderDetail.total)}</span></div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="size-4 text-sky-600" /> Paid by {orderDetail.payment} · Transaction verified</div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => toast.success("Receipt sent")}>Send receipt</Button><Button onClick={() => { setOrderDetail(null); setSection("returns"); }}>Create return</Button></DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(returnDetail)} onOpenChange={(open) => !open && setReturnDetail(null)}>
        <DialogContent className="sm:max-w-xl">
          {returnDetail && (
            <>
              <DialogHeader><DialogTitle>Review {returnDetail.id}</DialogTitle><DialogDescription>{returnDetail.order} · Requested {returnDetail.date}</DialogDescription></DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border p-4"><img src={KIT_IMAGE} alt="" className="size-14 rounded-md object-cover" /><div className="flex-1"><div className="font-medium">{returnDetail.item}</div><div className="text-sm text-muted-foreground">{returnDetail.customer}</div></div><div className="font-semibold">{money(returnDetail.amount)}</div></div>
                <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900"><span className="font-semibold">Return reason:</span> {returnDetail.reason}. Customer reported the issue at the front desk and provided the original receipt.</div>
                <div className="flex items-center justify-between rounded-lg border p-4"><div><div className="text-sm font-medium">Return item to inventory</div><div className="text-xs text-muted-foreground">Adds one sellable unit after approval</div></div><Switch defaultChecked /></div>
                <div className="space-y-2"><Label>Refund method</Label><Select defaultValue="original"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="original">Original payment method</SelectItem><SelectItem value="credit">Store credit</SelectItem><SelectItem value="cash">Cash</SelectItem></SelectContent></Select></div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => { setReturnDetail(null); toast.error("Return declined"); }}><X /> Decline</Button><Button onClick={() => { setReturnDetail(null); toast.success("Return approved and refund initiated"); }}><Check /> Approve refund</Button></DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showPromotionForm} onOpenChange={setShowPromotionForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create promotion</DialogTitle><DialogDescription>Set the offer, eligibility rules, and redemption limits.</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="promo-name">Campaign name</Label><Input id="promo-name" placeholder="Monsoon offer" /></div><div className="space-y-2"><Label htmlFor="promo-code">Promo code</Label><Input id="promo-code" placeholder="PLAY20" /></div></div>
            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Discount type</Label><Select defaultValue="percent"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="percent">Percentage</SelectItem><SelectItem value="fixed">Fixed amount</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label htmlFor="promo-value">Value</Label><Input id="promo-value" type="number" placeholder="20" /></div></div>
            <div className="space-y-2"><Label>Applies to</Label><Select defaultValue="all"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All products and services</SelectItem><SelectItem value="products">Products only</SelectItem><SelectItem value="services">Services only</SelectItem><SelectItem value="categories">Selected categories</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="promo-start">Start date</Label><Input id="promo-start" type="date" /></div><div className="space-y-2"><Label htmlFor="promo-end">End date</Label><Input id="promo-end" type="date" /></div></div>
            <div className="flex items-center justify-between rounded-lg border p-4"><div><div className="text-sm font-medium">Limit total redemptions</div><div className="text-xs text-muted-foreground">Prevent the campaign from exceeding budget</div></div><Switch defaultChecked /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowPromotionForm(false)}>Cancel</Button><Button onClick={() => { setShowPromotionForm(false); toast.success("Promotion created"); }}>Create promotion</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCategoryForm} onOpenChange={setShowCategoryForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>New category</DialogTitle><DialogDescription>Define how items in this category are taxed and reported.</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label htmlFor="category-name">Category name</Label><Input id="category-name" placeholder="e.g. Membership add-ons" /></div>
            <div className="space-y-2"><Label>Item type</Label><Select defaultValue="both"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="both">Products and services</SelectItem><SelectItem value="product">Products only</SelectItem><SelectItem value="service">Services only</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Tax rule</Label><Select defaultValue="18"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="0">Exempt</SelectItem><SelectItem value="5">5% GST</SelectItem><SelectItem value="12">12% GST</SelectItem><SelectItem value="18">18% GST</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowCategoryForm(false)}>Cancel</Button><Button onClick={() => { setShowCategoryForm(false); toast.success("Category created"); }}>Save category</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function VenueCommerce() {
  return <CommerceWorkspace role="venue" />;
}

export function CoachCommerce() {
  return <CommerceWorkspace role="coach" />;
}

export function OrganizerCommerce() {
  return <CommerceWorkspace role="organizer" />;
}
