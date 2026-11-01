import { useState } from "react";
import { CreditCard, Smartphone, Bell, Shield, User, Eye, EyeOff, Trash2, Plus, CheckCircle, X, Settings, Lock, Globe, Moon } from "lucide-react";
import { Badge } from "../components";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  setTimeout(onDone, 2000);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#181A1F] text-white px-4 py-3 rounded-lg shadow-xl text-sm">
      <CheckCircle size={16} className="text-[#755900]" />
      {msg}
    </div>
  );
}

const inp = "w-full border border-[#C9CBC2] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-9 h-5 bg-[#C9CBC2] rounded-full peer peer-checked:bg-[#FFC400] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
    </label>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#DFE0D8] rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-[#F7F7F3]">
        <Icon size={16} className="text-[#755900]" />
        <h3 className="font-semibold text-[#181A1F] font-['Lexend']">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── Tab: Payment Methods ─────────────────────────────────────────────────────

const SAVED_CARDS = [
  { id: 1, brand: "Visa", last4: "4242", expiry: "09/27", isDefault: true },
  { id: 2, brand: "Mastercard", last4: "8888", expiry: "03/26", isDefault: false },
];

const SAVED_UPI = [
  { id: 1, handle: "arjun@hdfcbank", bank: "HDFC" },
  { id: 2, handle: "arjun@paytm", bank: "Paytm" },
];

function PaymentMethods() {
  const [cards, setCards] = useState(SAVED_CARDS);
  const [upis, setUpis] = useState(SAVED_UPI);
  const [addTab, setAddTab] = useState<"card" | "upi" | "netbanking">("card");
  const [toast, setToast] = useState("");
  const [cardNo, setCardNo] = useState(""); const [expiry, setExpiry] = useState(""); const [cvv, setCvv] = useState("");
  const [upiInput, setUpiInput] = useState("");
  const BANKS = ["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB", "Yes Bank", "BOB"];

  return (
    <div className="space-y-5">
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <SectionCard title="Saved Cards" icon={CreditCard}>
        {cards.map(card => (
          <div key={card.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#DFE0D8] hover:border-[#C9CBC2] transition-colors">
            <div className={`w-10 h-7 rounded flex items-center justify-center text-white text-xs font-bold ${card.brand === "Visa" ? "bg-blue-600" : "bg-orange-500"}`}>{card.brand.slice(0, 2)}</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#181A1F]">{card.brand} •••• {card.last4}</p>
              <p className="text-xs text-[#7D8178]">Expires {card.expiry}</p>
            </div>
            {card.isDefault && <Badge text="Default" color="success" />}
            <button onClick={() => setCards(c => c.filter(x => x.id !== card.id))} className="text-[#A5A89E] hover:text-red-400 ml-2"><Trash2 size={14} /></button>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Saved UPI IDs" icon={Smartphone}>
        {upis.map(u => (
          <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#DFE0D8] hover:border-[#C9CBC2] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#FFC400]/10 flex items-center justify-center text-xs font-bold text-[#755900]">{u.bank[0]}</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#181A1F]">{u.handle}</p>
              <p className="text-xs text-[#7D8178]">{u.bank}</p>
            </div>
            <button onClick={() => setUpis(uu => uu.filter(x => x.id !== u.id))} className="text-[#A5A89E] hover:text-red-400"><Trash2 size={14} /></button>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Add Payment Method" icon={Plus}>
        <div className="flex gap-1 bg-[#DFE0D8] p-1 rounded-lg">
          {(["card", "upi", "netbanking"] as const).map(t => (
            <button key={t} onClick={() => setAddTab(t)} className={`flex-1 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${addTab === t ? "bg-white shadow-sm text-[#181A1F]" : "text-[#5F635C]"}`}>{t === "netbanking" ? "Net Banking" : t.toUpperCase()}</button>
          ))}
        </div>
        {addTab === "card" && (
          <div className="space-y-3">
            <input value={cardNo} onChange={e => setCardNo(e.target.value)} placeholder="4242 4242 4242 4242" className={inp} />
            <div className="grid grid-cols-2 gap-3">
              <input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM / YY" className={inp} />
              <input value={cvv} onChange={e => setCvv(e.target.value)} placeholder="CVV" type="password" className={inp} />
            </div>
            <button onClick={() => { setCards(c => [...c, { id: Date.now(), brand: "Visa", last4: cardNo.slice(-4) || "0000", expiry: expiry || "12/28", isDefault: false }]); setCardNo(""); setToast("Card added"); }} className="w-full bg-[#FFC400] text-[#17140A] py-2.5 rounded-lg font-semibold text-sm hover:bg-[#D9A900]">Add Card</button>
          </div>
        )}
        {addTab === "upi" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input value={upiInput} onChange={e => setUpiInput(e.target.value)} placeholder="yourname@upi" className={`${inp} flex-1`} />
              <button className="px-4 bg-[#DFE0D8] text-[#30342F] rounded-lg text-sm font-medium hover:bg-[#C9CBC2]">Verify</button>
            </div>
            <button onClick={() => { if (upiInput) { setUpis(u => [...u, { id: Date.now(), handle: upiInput, bank: upiInput.split("@")[1] || "UPI" }]); setUpiInput(""); setToast("UPI ID added"); } }} className="w-full bg-[#FFC400] text-[#17140A] py-2.5 rounded-lg font-semibold text-sm hover:bg-[#D9A900]">Add UPI ID</button>
          </div>
        )}
        {addTab === "netbanking" && (
          <div className="space-y-3">
            <select className={inp}>
              <option value="">Select your bank</option>
              {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <button onClick={() => setToast("Bank account linked")} className="w-full bg-[#FFC400] text-[#17140A] py-2.5 rounded-lg font-semibold text-sm hover:bg-[#D9A900]">Link Bank Account</button>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// ─── Tab: Subscriptions ───────────────────────────────────────────────────────

const AVAILABLE_PLANS = [
  { id: 1, venue: "Court Masters Indoor Arena", plan: "Basic Pass", price: 999, sessions: 8, perks: ["8 sessions/month", "Off-peak hours"] },
  { id: 2, venue: "Green Valley Sports Complex", plan: "All Access", price: 1499, sessions: 12, perks: ["12 sessions/month", "Peak hours", "Guest pass"] },
  { id: 3, venue: "Ace Tennis Academy", plan: "Pro Member", price: 2499, sessions: 20, perks: ["20 sessions/month", "Coaching discount", "Locker access"] },
];

function Subscriptions() {
  const [toast, setToast] = useState("");
  const [cancelled, setCancelled] = useState(false);

  return (
    <div className="space-y-5">
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      {!cancelled && (
        <SectionCard title="Active Subscription" icon={CheckCircle}>
          <div className="p-4 rounded-xl border border-[#D6A500]/30 bg-[#FFC400]/5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-[#181A1F]">Court Masters Basic Pass</p>
                <p className="text-sm text-[#755900] font-semibold mt-0.5">₹999 / month</p>
                <p className="text-xs text-[#5F635C] mt-1">Next billing: Jul 19, 2026</p>
              </div>
              <Badge text="Active" color="success" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[#5F635C]"><span>Sessions used</span><span className="font-medium text-[#181A1F]">6 of 8</span></div>
              <div className="w-full bg-[#C9CBC2] rounded-full h-2"><div className="bg-[#FFC400] h-2 rounded-full" style={{ width: "75%" }}></div></div>
            </div>
            <button onClick={() => { setCancelled(true); setToast("Subscription cancelled"); }} className="mt-3 text-sm text-red-500 font-medium hover:underline">Cancel Subscription</button>
          </div>
        </SectionCard>
      )}

      <SectionCard title="Available Plans" icon={CreditCard}>
        {AVAILABLE_PLANS.map(p => (
          <div key={p.id} className="flex items-start gap-4 p-4 rounded-xl border border-[#DFE0D8] hover:border-[#D6A500]/30 transition-colors">
            <div className="flex-1">
              <p className="font-semibold text-[#181A1F] text-sm">{p.venue}</p>
              <p className="text-xs text-[#5F635C] mt-0.5">{p.plan} · {p.sessions} sessions/month</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {p.perks.map(perk => <span key={perk} className="text-xs bg-[#F7F7F3] text-[#464A45] border border-[#DFE0D8] px-2 py-0.5 rounded-full">{perk}</span>)}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-bold text-[#181A1F]">₹{p.price}</p>
              <p className="text-xs text-[#7D8178] mb-2">/month</p>
              <button onClick={() => setToast(`Subscribed to ${p.plan}`)} className="bg-[#FFC400] text-[#17140A] text-xs px-4 py-1.5 rounded-lg font-semibold hover:bg-[#D9A900]">Subscribe</button>
            </div>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

// ─── Tab: Notifications ───────────────────────────────────────────────────────

const NOTIF_ITEMS = [
  { id: "booking_confirm", label: "Booking confirmations", desc: "Email + SMS + WhatsApp", defaultOn: true },
  { id: "reminder_24h", label: "Reminders — 24 hours before", desc: "Nudge before your session", defaultOn: true },
  { id: "reminder_2h", label: "Reminders — 2 hours before", desc: "Last-minute reminder", defaultOn: true },
  { id: "payment_receipts", label: "Payment receipts", desc: "Transaction confirmations", defaultOn: true },
  { id: "venues_nearby", label: "New venues nearby", desc: "When a venue opens near you", defaultOn: true },
  { id: "tournaments", label: "Tournament announcements", desc: "Upcoming events in your area", defaultOn: true },
  { id: "promotions", label: "Promotional offers", desc: "Discounts and deals", defaultOn: false },
  { id: "game_invites", label: "Game invitations", desc: "When someone invites you to a game", defaultOn: true },
];

function Notifications() {
  const [notifs, setNotifs] = useState(() => Object.fromEntries(NOTIF_ITEMS.map(n => [n.id, n.defaultOn])));
  const [toast, setToast] = useState("");

  return (
    <div className="space-y-5">
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <SectionCard title="Notification Preferences" icon={Bell}>
        {NOTIF_ITEMS.map(n => (
          <div key={n.id} className="flex items-center justify-between py-2 border-b border-[#F7F7F3] last:border-0">
            <div>
              <p className="text-sm font-medium text-[#181A1F]">{n.label}</p>
              <p className="text-xs text-[#7D8178] mt-0.5">{n.desc}</p>
            </div>
            <Toggle checked={notifs[n.id]} onChange={() => setNotifs(prev => ({ ...prev, [n.id]: !prev[n.id] }))} />
          </div>
        ))}
        <button onClick={() => setToast("Notification preferences saved")} className="w-full bg-[#FFC400] text-[#17140A] py-2.5 rounded-lg font-semibold text-sm hover:bg-[#D9A900] mt-2">Save Preferences</button>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Privacy ─────────────────────────────────────────────────────────────

function Privacy() {
  const [showProfile, setShowProfile] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [shareActivity, setShareActivity] = useState(true);
  const [toast, setToast] = useState("");

  return (
    <div className="space-y-5">
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <SectionCard title="Privacy Settings" icon={Shield}>
        {[
          { label: "Show profile to other players", desc: "Other players can view your sports history and achievements", val: showProfile, set: () => setShowProfile(v => !v) },
          { label: "Allow game hosts to see my contact", desc: "Hosts can reach you about game details", val: showContact, set: () => setShowContact(v => !v) },
          { label: "Share activity for recommendations", desc: "Help us suggest better venues and games", val: shareActivity, set: () => setShareActivity(v => !v) },
        ].map((item, i) => (
          <div key={i} className="flex items-start justify-between py-2 border-b border-[#F7F7F3] last:border-0">
            <div className="pr-4">
              <p className="text-sm font-medium text-[#181A1F]">{item.label}</p>
              <p className="text-xs text-[#7D8178] mt-0.5">{item.desc}</p>
            </div>
            <Toggle checked={item.val} onChange={item.set} />
          </div>
        ))}
        <button onClick={() => setToast("Privacy settings saved")} className="w-full bg-[#FFC400] text-[#17140A] py-2.5 rounded-lg font-semibold text-sm hover:bg-[#D9A900] mt-2">Save</button>
      </SectionCard>

    </div>
  );
}

// ─── Tab: Account ─────────────────────────────────────────────────────────────

function Account() {
  const [showPwd, setShowPwd] = useState(false);
  const [toast, setToast] = useState("");
  const [pwd, setPwd] = useState({ current: "", new_: "", confirm: "" });
  const [twoFa, setTwoFa] = useState(false);

  return (
    <div className="space-y-5">
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}

      <SectionCard title="Change Password" icon={Lock}>
        <input value={pwd.current} onChange={e => setPwd(v => ({ ...v, current: e.target.value }))} placeholder="Current password" type="password" className={inp} />
        <div className="relative">
          <input value={pwd.new_} onChange={e => setPwd(v => ({ ...v, new_: e.target.value }))} placeholder="New password" type={showPwd ? "text" : "password"} className={`${inp} pr-10`} />
          <button onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7D8178] hover:text-[#464A45]">
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <input value={pwd.confirm} onChange={e => setPwd(v => ({ ...v, confirm: e.target.value }))} placeholder="Confirm new password" type="password" className={inp} />
        <button onClick={() => setToast("Password updated successfully")} className="bg-[#FFC400] text-[#17140A] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#D9A900]">Update Password</button>
      </SectionCard>

      <SectionCard title="Two-Factor Authentication" icon={Shield}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#181A1F]">Enable 2FA</p>
            <p className="text-xs text-[#7D8178] mt-0.5">Secure your account with an authenticator app or SMS code</p>
          </div>
          <Toggle checked={twoFa} onChange={() => { setTwoFa(v => !v); setToast(twoFa ? "Two-factor authentication disabled" : "Two-factor authentication enabled"); }} />
        </div>
        {twoFa && (
          <div className="bg-sky-50 border border-sky-100 rounded-lg px-4 py-3 text-xs text-sky-700 font-medium">
            2FA is active — your account has an extra layer of protection.
          </div>
        )}
      </SectionCard>

      <SectionCard title="Connected Accounts" icon={Globe}>
        {[
          { name: "Google", icon: "G", connected: true },
          { name: "Facebook", icon: "f", connected: false },
        ].map(acc => (
          <div key={acc.name} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${acc.name === "Google" ? "bg-red-500" : "bg-blue-600"}`}>{acc.icon}</div>
              <span className="text-sm font-medium text-[#181A1F]">{acc.name}</span>
            </div>
            {acc.connected ? (
              <Badge text="Connected" color="success" />
            ) : (
              <button onClick={() => setToast(`${acc.name} connected`)} className="text-sm text-[#5F635C] border border-[#C9CBC2] px-3 py-1.5 rounded-lg hover:bg-[#F7F7F3]">Connect</button>
            )}
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Active Sessions" icon={Settings}>
        {[
          { device: "Chrome on Windows", detail: "Current session", current: true },
          { device: "Safari on iPhone", detail: "2h ago · Mumbai, IN", current: false },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[#181A1F]">{s.device}</p>
              <p className="text-xs text-[#7D8178] mt-0.5">{s.detail}</p>
            </div>
            {s.current ? (
              <span className="text-xs bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded-full font-medium">Current</span>
            ) : (
              <button onClick={() => setToast("Session revoked")} className="text-xs text-red-500 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50">Revoke</button>
            )}
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

const TABS = [
  { id: "payment", label: "Payment Methods", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "account", label: "Account", icon: User },
] as const;

type TabId = typeof TABS[number]["id"];

export function PlayerSettings() {
  const [tab, setTab] = useState<TabId>("payment");

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#181A1F] font-['Lexend']">Settings</h1>
        <p className="text-sm text-[#5F635C] mt-0.5">Manage your payment methods, subscriptions, and account preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Left nav */}
        <div className="w-52 shrink-0">
          <div className="bg-white border border-[#DFE0D8] rounded-xl p-2 shadow-sm space-y-0.5">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${tab === t.id ? "bg-[#FFC400]/10 text-[#755900]" : "text-[#464A45] hover:bg-[#F7F7F3]"}`}>
                  <Icon size={15} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {tab === "payment" && <PaymentMethods />}
          {tab === "notifications" && <Notifications />}
          {tab === "privacy" && <Privacy />}
          {tab === "account" && <Account />}
        </div>
      </div>
    </div>
  );
}
