import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/SmartTable";
import { useState } from "react";
import { MessageCircle, Plus, X, Send, Users, TrendingUp, CheckCircle, Clock, Edit2, Trash2, Bell, Calendar, Trophy, CreditCard, AlertCircle, User, Lock, Globe, Smartphone, Building, Upload, Save, ShieldCheck, Zap, LogOut, ChevronDown, ChevronRight, Mail, Phone, MapPin, Star, Heart, Shield, Award, Zap as ZapIcon, ArrowRight, Search, BookOpen, LifeBuoy, HelpCircle, MessageSquare, ExternalLink, CheckCircle2, FileText, LayoutGrid, ArrowUpDown, Download, Share2, Eye, Copy, ToggleLeft, Sliders, Info, AlertTriangle, CheckSquare, Type, Palette, Box, Layers, Component, Hash } from "lucide-react";
import type { Page } from "../data";
import { NOTIFICATIONS_DATA } from "../data";
import { Badge, StatCard, FilterBar } from "../components";

const CAMPAIGNS = [
  { id: 1, name: "Weekend Offer — 20% Off", segment: "All Players", sent: 2840, opened: 1420, clicks: 284, status: "completed", date: "Jul 5, 2026" },
  { id: 2, name: "Tournament Registration Reminder", segment: "Active Players", sent: 1240, opened: 820, clicks: 156, status: "completed", date: "Jul 3, 2026" },
  { id: 3, name: "New Venue Launch — Whitefield", segment: "Bangalore Players", sent: 0, opened: 0, clicks: 0, status: "scheduled", date: "Jul 12, 2026" },
];

export function WhatsAppMarketing() {
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", message: "", segment: "All Players", date: "" });

  const create = () => {
    setCampaigns(prev => [...prev, {
      id: Date.now(), ...form, sent: 0, opened: 0, clicks: 0, status: "scheduled"
    }]);
    setShowCreate(false);
    setForm({ name: "", message: "", segment: "All Players", date: "" });
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-[#1473E6]/10 rounded-md flex items-center justify-center">
          <MessageCircle size={20} className="text-[#1473E6]" />
        </div>
        <div>
          <h2 className="font-bold text-[#181A1F]">WhatsApp Marketing</h2>
          <p className="text-sm text-[#5F635C]">Engage your audience with targeted campaigns</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="ml-auto bg-[#1473E6] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#0B4F9C] flex items-center gap-2">
          <Plus size={15} /> New Campaign
        </button>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <StatCard label="Total Sent" value="4,080" sub="This month" icon={Send} />
        <StatCard label="Open Rate" value="51.2%" sub="Industry avg: 35%" icon={TrendingUp} color="#1473E6" />
        <StatCard label="Click Rate" value="10.6%" sub="↑ 2.3% vs last" icon={CheckCircle} color="#3F718B" />
        <StatCard label="Campaigns" value={campaigns.length.toString()} sub={`${campaigns.filter(c => c.status === "scheduled").length} scheduled`} icon={Clock} color="#C08B3E" />
      </div>

      <div className="space-y-4">
        {campaigns.map(c => (
          <div key={c.id} className="bg-white rounded-md border border-[#DFE0D8] p-5">
            <div className="flex items-start justify-between mb-3 gap-2">
              <div>
                <h3 className="font-bold text-[#181A1F]">{c.name}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-[#5F635C]">
                  <Users size={11} /> {c.segment} · Scheduled {c.date}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge text={c.status} color={c.status === "completed" ? "success" : "yellow"} />
                {c.status === "scheduled" && (
                  <>
                    <button aria-label="Edit" className="p-1.5 text-[#7D8178] hover:text-[#464A45]"><Edit2 size={13} /></button>
                    <button onClick={() => setCampaigns(prev => prev.filter(x => x.id !== c.id))} className="p-1.5 text-red-300 hover:text-red-500"><Trash2 size={13} /></button>
                  </>
                )}
              </div>
            </div>
            {c.status === "completed" && (
              <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-[#F7F7F3]">
                <div className="text-center">
                  <div className="text-lg font-bold text-[#181A1F]">{c.sent.toLocaleString()}</div>
                  <div className="text-xs text-[#7D8178]">Sent</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#1473E6]">{c.opened.toLocaleString()}</div>
                  <div className="text-xs text-[#7D8178]">Opened ({Math.round((c.opened / c.sent) * 100)}%)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{c.clicks}</div>
                  <div className="text-xs text-[#7D8178]">Clicks ({Math.round((c.clicks / c.sent) * 100)}%)</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#181A1F]">Create Campaign</h3>
              <button onClick={() => setShowCreate(false)}><X size={18} className="text-[#7D8178]" /></button>
            </div>
            <div>
              <label className="text-xs font-medium text-[#464A45] mb-1 block">Campaign Name</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Weekend Promo"
                className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1473E6]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#464A45] mb-1 block">Message</label>
              <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Hey {name}! 🎉 Enjoy 20% off this weekend at Court Masters. Book now: {link}"
                rows={4} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1473E6] resize-none" />
              <p className="text-xs text-[#7D8178] mt-1">Use {"{name}"} for personalization</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Target Segment</label>
                <select value={form.segment} onChange={e => setForm(p => ({ ...p, segment: e.target.value }))}
                  className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1473E6]">
                  {["All Players", "Active Players", "Premium Members", "Bangalore Players", "Mumbai Players"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Schedule Date</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1473E6]" />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowCreate(false)} className="flex-1 border border-[#C9CBC2] rounded-md py-2.5 text-sm">Cancel</button>
              <button onClick={create} className="flex-1 bg-[#1473E6] text-white rounded-md py-2.5 text-sm font-semibold">Schedule Campaign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const MOCK_TICKETS = [
  { id: "TK001", subject: "Court 2 booking cancelled without refund", category: "Payment Problem", priority: "High", status: "Open", created: "Jul 12, 2026", updated: "Jul 12, 2026", description: "I booked Court 2 for July 11 at 7AM. It was cancelled 30 minutes before without any notification, and my ₹800 hasn't been refunded yet. Booking ID: BK-2891." },
  { id: "TK002", subject: "App crashes when trying to book", category: "Technical Bug", priority: "Medium", status: "In Progress", created: "Jul 10, 2026", updated: "Jul 11, 2026", description: "Every time I try to complete a booking for Ace Tennis Academy, the app crashes at the payment step." },
  { id: "TK003", subject: "Venue description mismatch", category: "Venue Complaint", priority: "Low", status: "Resolved", created: "Jul 8, 2026", updated: "Jul 9, 2026", description: "The venue listing says AC is available but there was no AC when I arrived." },
  { id: "TK004", subject: "Unable to access my wallet", category: "Account Issue", priority: "Medium", status: "Open", created: "Jul 11, 2026", updated: "Jul 11, 2026", description: "My wallet shows ₹500 balance but I can't use it to pay. The option is greyed out." },
  { id: "TK005", subject: "Tournament registration payment failed", category: "Payment Problem", priority: "High", status: "In Progress", created: "Jul 9, 2026", updated: "Jul 10, 2026", description: "My payment for the Badminton Open 2026 failed but ₹500 was deducted from my account." },
  { id: "TK006", subject: "Wrong venue address shown", category: "Venue Complaint", priority: "Low", status: "Resolved", created: "Jul 5, 2026", updated: "Jul 6, 2026", description: "The map shows an incorrect address for BasketBall Zone." },
  { id: "TK007", subject: "Refund for rained-out game", category: "Refund Request", priority: "High", status: "Open", created: "Jul 13, 2026", updated: "Jul 13, 2026", description: "The football game on July 13 was cancelled due to rain. I'd like a full refund of ₹300." },
  { id: "TK008", subject: "Invoice not generated for booking BK001", category: "Booking Issue", priority: "Medium", status: "Closed", created: "Jul 1, 2026", updated: "Jul 3, 2026", description: "No invoice was generated for my booking BK001 at Court Masters." },
];

export function SupportPage() {
  const [view, setView] = useState<"list" | "create" | "detail">("list");
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<typeof MOCK_TICKETS[0] | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({ subject: "", category: "Booking Issue", priority: "Medium", bookingId: "", description: "" });
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ from: string; text: string; time: string }[]>([]);

  const filtered = tickets.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const createTicket = () => {
    if (!form.subject || !form.description) return;
    const newTicket = { id: "TK" + String(tickets.length + 1).padStart(3, "0"), subject: form.subject, category: form.category, priority: form.priority, status: "Open", created: "Jul 13, 2026", updated: "Jul 13, 2026", description: form.description };
    setTickets(prev => [newTicket, ...prev]);
    setForm({ subject: "", category: "Booking Issue", priority: "Medium", bookingId: "", description: "" });
    setView("list");
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { from: "user", text: chatInput, time: "Now" }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages(prev => [...prev, { from: "support", text: "Thank you for your message. Our support team will respond within 2-4 hours.", time: "Just now" }]);
    }, 1000);
  };

  const statusColor = (s: string) => s === "Open" ? "red" : s === "In Progress" ? "yellow" : s === "Resolved" ? "success" : "gray";
  const priorityColor = (p: string) => p === "High" ? "red" : p === "Medium" ? "yellow" : "gray";

  if (view === "list") return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-[#151713]">Help &amp; Support</h1>
        <button onClick={() => setView("create")} className="flex items-center gap-2 bg-[#FFC400] text-[#17140A] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#D9A900]"><Plus size={15} /> New Ticket</button>
      </div>
      <div className="space-y-5">
        <div className="grid sm:grid-cols-4 gap-4">
          <StatCard label="Open Tickets" value={String(tickets.filter(t => t.status === "Open").length)} icon={AlertCircle} color="#B84A4A" />
          <StatCard label="In Progress" value={String(tickets.filter(t => t.status === "In Progress").length)} icon={Clock} color="#C08B3E" />
          <StatCard label="Resolved" value={String(tickets.filter(t => t.status === "Resolved").length)} icon={CheckCircle2} color="#1473E6" />
          <StatCard label="Avg Response" value="4hrs" icon={MessageSquare} color="#3F718B" />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[{ icon: HelpCircle, label: "Browse FAQ", sub: "Find instant answers", color: "#3F718B" }, { icon: MessageSquare, label: "Live Chat", sub: "Response in 5 mins", color: "#FFC400" }, { icon: Phone, label: "Call Support", sub: "1800-123-4567 (free)", color: "#765A88" }].map(item => {
            const ItemIcon = item.icon;
            return (
              <div key={item.label} className="bg-white rounded-md border border-[#DFE0D8] p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="p-3 rounded-md" style={{ background: item.color + "18" }}><ItemIcon size={20} style={{ color: item.color }} /></div>
                <div><p className="font-semibold text-[#181A1F] text-sm">{item.label}</p><p className="text-xs text-[#5F635C]">{item.sub}</p></div>
              </div>
            );
          })}
        </div>
        <FilterBar search={search} onSearch={setSearch} placeholder="Search tickets…"
          filters={[{ label: "Status", value: statusFilter, onChange: setStatusFilter, options: [{ label: "All", value: "all" }, { label: "Open", value: "Open" }, { label: "In Progress", value: "In Progress" }, { label: "Resolved", value: "Resolved" }, { label: "Closed", value: "Closed" }] }]} />
        <div className="bg-white rounded-md border border-[#DFE0D8] overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full text-sm">
              <TableHeader><TableRow className="bg-[#FFC400]/10">{["Ticket ID","Subject","Category","Priority","Status","Created","Action"].map(h => <TableHead key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#755900] uppercase tracking-wide">{h}</TableHead>)}</TableRow></TableHeader>
              <TableBody className="divide-y divide-[#F7F7F3]">
                {filtered.map(t => (
                  <TableRow key={t.id} className="hover:bg-[#F7F7F3]/50">
                    <TableCell className="px-4 py-3 font-mono text-xs text-[#464A45]">{t.id}</TableCell>
                    <TableCell className="px-4 py-3"><span className="font-medium text-[#181A1F] line-clamp-1 max-w-[200px]">{t.subject}</span></TableCell>
                    <TableCell className="px-4 py-3 text-[#5F635C] text-xs">{t.category}</TableCell>
                    <TableCell className="px-4 py-3"><Badge text={t.priority} color={priorityColor(t.priority)} /></TableCell>
                    <TableCell className="px-4 py-3"><Badge text={t.status} color={statusColor(t.status)} /></TableCell>
                    <TableCell className="px-4 py-3 text-[#5F635C] text-xs">{t.created}</TableCell>
                    <TableCell className="px-4 py-3"><button onClick={() => { setSelectedTicket(t); setChatMessages([{ from: "support", text: "Thank you for reaching out. We have received your ticket " + t.id + " and our team will review it within 24 hours.", time: t.created }]); setView("detail"); }} className="text-xs bg-[#FFC400]/10 text-[#755900] border border-[#D6A500]/20 px-3 py-1.5 rounded-md font-medium hover:bg-[#FFC400]/20">View</button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );

  if (view === "create") return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-[#7D8178] mb-1">Support → New Ticket</p>
          <h1 className="text-xl font-bold text-[#151713]">New Support Ticket</h1>
        </div>
        <button onClick={() => setView("list")} className="flex items-center gap-1.5 text-sm text-[#5F635C] border border-[#C9CBC2] rounded-md px-3 py-1.5">← Back</button>
      </div>
      <div className="max-w-2xl space-y-4">
        <div className="bg-white rounded-md border border-[#DFE0D8] p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#5F635C] uppercase tracking-wide block mb-1">Subject *</label>
            <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Brief description of your issue" className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#5F635C] uppercase tracking-wide block mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30">
                {["Booking Issue","Payment Problem","Venue Complaint","Technical Bug","Refund Request","Account Issue","Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#5F635C] uppercase tracking-wide block mb-1">Priority</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30">
                {["High","Medium","Low"].map(pr => <option key={pr}>{pr}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#5F635C] uppercase tracking-wide block mb-1">Related Booking ID (optional)</label>
            <input value={form.bookingId} onChange={e => setForm(p => ({ ...p, bookingId: e.target.value }))} placeholder="e.g. BK001" className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#5F635C] uppercase tracking-wide block mb-1">Description * <span className="text-[#7D8178] font-normal normal-case">({form.description.length}/50 min)</span></label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={5} placeholder="Describe your issue in detail. Include dates, booking IDs, screenshots if possible." className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500] resize-none" />
          </div>
          <div className="flex items-center gap-2 p-3 bg-[#F7F7F3] border border-dashed border-[#C9CBC2] rounded-md cursor-pointer hover:bg-[#DFE0D8]">
            <FileText size={16} className="text-[#7D8178]" />
            <span className="text-sm text-[#5F635C]">Attach files (screenshots, receipts) — click to browse</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setView("list")} className="flex-1 border border-[#C9CBC2] rounded-md py-2.5 text-sm">Cancel</button>
            <button onClick={createTicket} disabled={form.subject.length < 3 || form.description.length < 20} className="flex-1 bg-[#FFC400] text-[#17140A] rounded-md py-2.5 text-sm font-semibold hover:bg-[#D9A900] disabled:opacity-50 disabled:cursor-not-allowed">Submit Ticket</button>
          </div>
        </div>
      </div>
    </div>
  );

  const ticket = selectedTicket!;
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-[#7D8178] mb-1">Support → {ticket.id}</p>
          <h1 className="text-xl font-bold text-[#151713] line-clamp-1">{ticket.subject}</h1>
        </div>
        <button onClick={() => setView("list")} className="flex items-center gap-1.5 text-sm text-[#5F635C] border border-[#C9CBC2] rounded-md px-3 py-1.5 shrink-0">← Back</button>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-md border border-[#DFE0D8] flex flex-col" style={{ minHeight: 400 }}>
            <div className="px-4 py-3 border-b border-[#DFE0D8] flex items-center justify-between">
              <span className="text-sm font-semibold text-[#181A1F]">Conversation</span>
              <Badge text={ticket.status} color={statusColor(ticket.status)} />
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              <div className="flex justify-end"><div className="bg-[#FFC400]/10 border border-[#D6A500]/20 rounded-md p-3 max-w-lg"><p className="text-sm text-[#222520]">{ticket.description}</p><p className="text-xs text-[#7D8178] mt-1">{ticket.created} · You</p></div></div>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`rounded-md p-3 max-w-lg ${msg.from === "user" ? "bg-[#FFC400]/10 border border-[#D6A500]/20" : "bg-[#DFE0D8] border border-[#C9CBC2]"}`}>
                    <p className="text-sm text-[#222520]">{msg.text}</p>
                    <p className="text-xs text-[#7D8178] mt-1">{msg.time} · {msg.from === "user" ? "You" : "Support Team"}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-[#DFE0D8] flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="Type your reply…" className="flex-1 border border-[#C9CBC2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30" />
              <button aria-label="Send" onClick={sendChat} className="bg-[#FFC400] text-[#17140A] p-2.5 rounded-md hover:bg-[#D9A900]"><Send size={15} /></button>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-md border border-[#DFE0D8] p-4 space-y-3">
            <h3 className="font-semibold text-[#181A1F] text-sm border-b border-[#DFE0D8] pb-2">Ticket Details</h3>
            {[["Ticket ID", ticket.id], ["Category", ticket.category], ["Priority", ticket.priority], ["Created", ticket.created], ["Last Updated", ticket.updated]].map(([label, val]) => (
              <div key={label as string} className="flex items-center justify-between text-sm">
                <span className="text-[#5F635C]">{label}</span>
                <span className="font-medium text-[#181A1F]">{val}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#5F635C]">Status</span>
              <select defaultValue={ticket.status} className="text-xs border border-[#C9CBC2] rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30">
                {["Open","In Progress","Resolved","Closed"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800">
            <strong>Response SLA:</strong> We aim to respond within 24 business hours. For urgent payment issues, call <strong>1800-123-4567</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}

export const SupportTickets = SupportPage;

const notifIcons: Record<string, any> = {
  booking: Calendar,
  tournament: Trophy,
  payment: CreditCard,
  system: AlertCircle,
  default: Bell,
};

const notifColors: Record<string, string> = {
  booking: "#FFC400",
  tournament: "#C08B3E",
  payment: "#3F718B",
  system: "#B84A4A",
  default: "#707570",
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(
    NOTIFICATIONS_DATA.map(n => ({ ...n }))
  );
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? notifications : filter === "unread"
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const markRead = (id: number) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const dismiss = (id: number) =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#181A1F]">
            Notifications
          </h2>
          {unread > 0 && (
            <p className="text-sm text-[#5F635C] mt-0.5">{unread} unread</p>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-[#755900] font-semibold hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "unread", "booking", "tournament", "payment", "system"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              filter === f
                ? "bg-[#FFC400] text-[#17140A]"
                : "bg-[#DFE0D8] text-[#464A45] hover:bg-[#C9CBC2]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#7D8178]">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No notifications</p>
          </div>
        )}
        {filtered.map(n => {
          const IconComp = notifIcons[n.type] ?? notifIcons.default;
          const color = notifColors[n.type] ?? notifColors.default;
          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-4 p-4 rounded-md border cursor-pointer transition-all group ${
                !n.read
                  ? "bg-white border-[#D6A500]/20 shadow-sm"
                  : "bg-white border-[#DFE0D8] opacity-70 hover:opacity-100"
              }`}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
                style={{ background: color + "18" }}
              >
                <IconComp size={18} style={{ color }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${!n.read ? "text-[#181A1F]" : "text-[#464A45]"}`}>
                    {n.title}
                  </p>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-[#FFC400] shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-sm text-[#5F635C] mt-0.5 leading-snug">{n.body}</p>
                <p className="text-xs text-[#7D8178] mt-1">{n.time}</p>
              </div>

              {/* Dismiss */}
              <button
                onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 text-[#A5A89E] hover:text-[#5F635C] transition-all shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PrivacyPolicyPage() {
  const sections = [
    { title: "1. Information We Collect", body: "We collect information you provide directly to us, such as when you create an account, make a booking, or contact support. This includes your name, email address, phone number, date of birth, payment information, and location data. We also collect usage data such as pages visited, features used, and interactions with the platform." },
    { title: "2. How We Use Your Information", body: "We use your information to provide, maintain, and improve our services; process transactions and send related information; send promotional communications (with your consent); monitor and analyse trends and usage; detect and prevent fraudulent transactions and other illegal activities; and comply with legal obligations." },
    { title: "3. Sharing of Information", body: "We do not sell your personal information. We may share your information with venue owners, trainers, and organizers to facilitate bookings and services you have requested. We may also share information with service providers who assist in our operations, subject to confidentiality agreements." },
    { title: "4. Data Security", body: "We implement appropriate technical and organisational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes SSL/TLS encryption for data in transit, encrypted storage for sensitive data, and regular security audits." },
    { title: "5. Cookies", body: "We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some features may not function properly." },
    { title: "6. Data Retention", body: "We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting support@inspirq.in." },
    { title: "7. Your Rights", body: "You have the right to access, correct, or delete your personal data; object to or restrict processing; data portability; and withdraw consent at any time. To exercise these rights, contact our Data Protection Officer at dpo@inspirq.in." },
    { title: "8. Contact Us", body: "If you have any questions about this Privacy Policy, please contact us at: InspirQ Sport Play Pvt. Ltd., 100 Koramangala Industrial Area, Bangalore 560034, India. Email: privacy@inspirq.in. Phone: +91 80 4567 8900." },
  ];

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#181A1F] mb-1">Privacy Policy</h1>
        <p className="text-sm text-[#7D8178]">Last updated: July 1, 2026</p>
      </div>
      <div className="bg-[#FFC400]/10 border border-[#D6A500]/20 rounded-md p-4 text-sm text-[#755900] font-medium">
        At InspirQ Sport Play, we are committed to protecting your personal information and your right to privacy.
      </div>
      <div className="space-y-6">
        {sections.map(s => (
          <div key={s.title} className="bg-white rounded-md border border-[#DFE0D8] p-5">
            <h2 className="font-bold text-[#181A1F] mb-2">{s.title}</h2>
            <p className="text-sm text-[#464A45] leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TermsPage() {
  const sections = [
    { title: "1. Acceptance of Terms", body: "By accessing or using InspirQ Sport Play ('the Platform'), you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not access or use our services. These terms apply to all users, including players, venue owners, trainers, and event organisers." },
    { title: "2. User Accounts", body: "You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must notify us immediately of any unauthorised use of your account. InspirQ reserves the right to terminate accounts that violate these terms." },
    { title: "3. Booking & Payments", body: "All bookings are subject to availability. Prices are displayed in Indian Rupees (INR) and include applicable taxes. Payment is processed securely through our payment partners. InspirQ is not responsible for any bank charges or currency conversion fees." },
    { title: "4. Cancellation & Refund Policy", body: "Cancellations made more than 4 hours before the slot receive a full refund. Cancellations between 2–4 hours receive a 50% refund. No refund is provided for cancellations within 2 hours of the slot. Refunds are processed to the original payment method within 5–7 business days." },
    { title: "5. Venue Owner Obligations", body: "Venue owners must ensure accurate listing information, maintain safe and clean facilities, honour confirmed bookings, and comply with all applicable local regulations. InspirQ reserves the right to remove listings that do not meet quality standards." },
    { title: "6. Prohibited Conduct", body: "Users may not: post false or misleading information; use the platform for illegal purposes; harass or harm other users; attempt to circumvent our security measures; or use automated tools to scrape content. Violations may result in immediate account suspension." },
    { title: "7. Intellectual Property", body: "The InspirQ platform, including its logo, design, and content, is the property of InspirQ Sport Play Pvt. Ltd. and is protected by applicable intellectual property laws. Users may not reproduce or distribute any content without prior written permission." },
    { title: "8. Limitation of Liability", body: "InspirQ is a marketplace platform connecting players with venues and service providers. We are not liable for the quality of services provided by venues, trainers, or organisers. Our liability is limited to the amount paid for the booking in question." },
    { title: "9. Governing Law", body: "These Terms are governed by the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Bangalore, Karnataka, India." },
  ];

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#181A1F] mb-1">Terms of Service</h1>
        <p className="text-sm text-[#7D8178]">Last updated: July 1, 2026 · Effective: July 1, 2026</p>
      </div>
      <div className="bg-amber-50 border border-amber-100 rounded-md p-4 text-sm text-amber-700 font-medium">
        Please read these Terms carefully before using InspirQ Sport Play. Using the platform constitutes acceptance of these terms.
      </div>
      <div className="space-y-6">
        {sections.map(s => (
          <div key={s.title} className="bg-white rounded-md border border-[#DFE0D8] p-5">
            <h2 className="font-bold text-[#181A1F] mb-2">{s.title}</h2>
            <p className="text-sm text-[#464A45] leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Account Settings ─────────────────────────────────────────────────────────

export function AccountSettings() {
  const [tab, setTab] = useState<"profile"|"security"|"notifications"|"integrations">("profile");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "Court Masters Arena", email: "hello@courtmasters.com",
    phone: "+91 98765 43210", contactPerson: "Suresh Nair", contactRole: "Venue Manager",
    address: "42, Indiranagar", city: "Bangalore", state: "Karnataka", pincode: "560038",
    gstin: "29AABCT1332L1ZV", pan: "AABCT1332L", website: "https://courtmasters.com",
    bio: "Premium multi-sport facility in the heart of Indiranagar with 8 courts.",
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [notifs, setNotifs] = useState({
    bookingConfirm: true, bookingCancel: true, paymentAlert: true,
    weeklyReport: true, marketingEmail: false, smsBooking: true, smsPayment: false,
  });

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const TABS = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "security" as const, label: "Security", icon: Lock },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "integrations" as const, label: "Integrations", icon: Globe },
  ];

  const field = (label: string, key: keyof typeof form, mono = false) => (
    <div key={key}>
      <label className="block text-xs font-semibold text-[#5F635C] mb-1.5 uppercase tracking-wide">{label}</label>
      <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className={`w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm text-[#181A1F] focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500] ${mono ? "font-mono" : ""}`} />
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#181A1F]">Account Settings</h2>
        <p className="text-sm text-[#5F635C] mt-0.5">Manage your profile, security and preferences</p>
      </div>
      <div className="flex gap-1 bg-[#DFE0D8] rounded-md p-1 w-fit flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t.id ? "bg-white text-[#181A1F] shadow-sm" : "text-[#5F635C] hover:text-[#30342F]"}`}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="bg-white rounded-md border border-[#DFE0D8] p-6 space-y-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-[#FFC400]/20 rounded-md flex items-center justify-center text-[#755900] text-3xl font-bold">C</div>
            <div>
              <button aria-label="Upload" className="flex items-center gap-2 border border-[#C9CBC2] text-sm font-medium text-[#30342F] px-4 py-2 rounded-md hover:bg-[#F7F7F3] transition-colors"><Upload size={14} /> Upload Logo
              </button>
              <p className="text-xs text-[#7D8178] mt-1.5">JPG, PNG or SVG · Max 2 MB</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {field("Business / Venue Name", "name")}
            {field("Contact Person", "contactPerson")}
            {field("Role / Title", "contactRole")}
            {field("Email Address", "email")}
            {field("Phone Number", "phone")}
            {field("Website", "website")}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5F635C] mb-1.5 uppercase tracking-wide">Business Description</label>
            <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3}
              className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm text-[#181A1F] focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500] resize-none" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#181A1F] mb-3">Address</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {field("Street Address", "address")}
              {field("City", "city")}
              {field("State", "state")}
              {field("Pincode", "pincode")}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#181A1F] mb-3">Tax & Compliance</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {field("GSTIN", "gstin", true)}
              {field("PAN Number", "pan", true)}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#F7F7F3]">
            {saved && <span className="flex items-center gap-1.5 text-sm text-sky-600 font-medium"><CheckCircle size={15} /> Saved successfully</span>}
            <button onClick={save} className="ml-auto flex items-center gap-2 bg-[#FFC400] text-[#17140A] text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-[#D9A900] transition-colors">
              <Save size={15} /> Save Changes
            </button>
          </div>
        </div>
      )}

      {tab === "security" && (
        <div className="bg-white rounded-md border border-[#DFE0D8] p-6 space-y-6">
          <div>
            <h3 className="font-bold text-[#181A1F] mb-4">Change Password</h3>
            <div className="space-y-4 max-w-md">
              {(["current","next","confirm"] as const).map(k => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-[#5F635C] mb-1.5 uppercase tracking-wide">
                    {k === "current" ? "Current Password" : k === "next" ? "New Password" : "Confirm New Password"}
                  </label>
                  <input type="password" value={pw[k]} onChange={e => setPw(p => ({ ...p, [k]: e.target.value }))}
                    className="w-full border border-[#C9CBC2] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500]" />
                </div>
              ))}
              <button className="bg-[#FFC400] text-[#17140A] text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-[#D9A900] transition-colors">Update Password</button>
            </div>
          </div>
          <div className="border-t border-[#DFE0D8] pt-6">
            <h3 className="font-bold text-[#181A1F] mb-4">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between p-4 bg-[#F7F7F3] rounded-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center"><Smartphone size={18} className="text-blue-600" /></div>
                <div><div className="text-sm font-semibold text-[#181A1F]">Authenticator App</div><div className="text-xs text-[#7D8178]">Not enabled</div></div>
              </div>
              <button className="text-sm font-semibold text-[#755900] border border-[#D6A500]/30 px-4 py-2 rounded-md hover:bg-[#FFC400]/5 transition-colors">Enable</button>
            </div>
          </div>
          <div className="border-t border-[#DFE0D8] pt-6">
            <h3 className="font-bold text-[#181A1F] mb-4">Active Sessions</h3>
            {[
              { device: "Chrome on Mac", location: "Bangalore, IN", time: "Now (current)", current: true },
              { device: "Safari on iPhone", location: "Bangalore, IN", time: "2 hours ago", current: false },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-[#F7F7F3] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#DFE0D8] rounded-md flex items-center justify-center"><Globe size={14} className="text-[#5F635C]" /></div>
                  <div><div className="text-sm font-medium text-[#181A1F]">{s.device}</div><div className="text-xs text-[#7D8178]">{s.location} · {s.time}</div></div>
                </div>
                {s.current ? <span className="text-xs bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full font-medium border border-sky-200">Current</span>
                  : <button className="text-xs text-red-500 hover:text-red-700 font-medium">Revoke</button>}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div className="bg-white rounded-md border border-[#DFE0D8] p-6 space-y-5">
          {[
            { section: "Email Notifications", items: [
              { key: "bookingConfirm" as const, label: "Booking Confirmations", desc: "When a new booking is made" },
              { key: "bookingCancel" as const, label: "Booking Cancellations", desc: "When a booking is cancelled" },
              { key: "paymentAlert" as const, label: "Payment Alerts", desc: "Payment received or failed" },
              { key: "weeklyReport" as const, label: "Weekly Summary", desc: "Weekly performance report" },
              { key: "marketingEmail" as const, label: "Marketing Updates", desc: "Product news and offers" },
            ]},
            { section: "SMS Notifications", items: [
              { key: "smsBooking" as const, label: "Booking Alerts", desc: "New or cancelled bookings" },
              { key: "smsPayment" as const, label: "Payment SMS", desc: "Payment confirmations" },
            ]},
          ].map(group => (
            <div key={group.section}>
              <h3 className="font-bold text-[#181A1F] mb-1">{group.section}</h3>
              {group.items.map(n => (
                <div key={n.key} className="flex items-center justify-between py-3 border-b border-[#F7F7F3] last:border-0">
                  <div><div className="text-sm font-medium text-[#181A1F]">{n.label}</div><div className="text-xs text-[#7D8178]">{n.desc}</div></div>
                  <button onClick={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))}
                    className={`relative w-10 h-6 rounded-full transition-colors ${notifs[n.key] ? "bg-[#FFC400]" : "bg-[#C9CBC2]"}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifs[n.key] ? "left-5" : "left-1"}`} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === "integrations" && (
        <div className="bg-white rounded-md border border-[#DFE0D8] p-6 space-y-4">
          {[
            { name: "WhatsApp Business", desc: "Send booking confirmations and reminders via WhatsApp", icon: "💬", connected: true },
            { name: "Google Calendar", desc: "Sync bookings to Google Calendar automatically", icon: "📅", connected: false },
            { name: "Razorpay", desc: "Accept UPI, cards and net banking payments", icon: "💳", connected: true },
            { name: "Google My Business", desc: "Sync venue info and reviews with Google Maps", icon: "📍", connected: false },
            { name: "Zoom", desc: "Auto-create video links for online training sessions", icon: "🎥", connected: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-[#DFE0D8] rounded-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F7F7F3] rounded-md flex items-center justify-center text-2xl">{item.icon}</div>
                <div><div className="text-sm font-bold text-[#181A1F]">{item.name}</div><div className="text-xs text-[#7D8178] max-w-xs">{item.desc}</div></div>
              </div>
              <button className={`text-sm font-semibold px-4 py-2 rounded-md transition-colors ${item.connected ? "bg-[#DFE0D8] text-[#464A45] hover:bg-[#C9CBC2]" : "bg-[#FFC400] text-[#17140A] hover:bg-[#D9A900]"}`}>
                {item.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Payment & Billing ────────────────────────────────────────────────────────

export function PaymentBilling() {
  const [tab, setTab] = useState<"plan"|"transactions"|"bank"|"invoices">("plan");

  const PLANS = [
    { id: "starter", name: "Starter", price: "₹999", features: ["1 Venue", "200 bookings/mo", "Basic Analytics", "WhatsApp Alerts", "Email Support"], current: false },
    { id: "growth", name: "Growth", price: "₹2,499", features: ["3 Venues", "Unlimited bookings", "Advanced Analytics", "WhatsApp + SMS", "Priority Support", "Custom Branding"], current: true },
    { id: "pro", name: "Pro", price: "₹4,999", features: ["Unlimited Venues", "Unlimited bookings", "AI Insights", "API Access", "Dedicated Account Manager", "White-label Option"], current: false },
  ];

  const TXN = [
    { id: "INV-2026-07", date: "Jul 1, 2026", desc: "Growth Plan — Monthly", amount: "₹2,499" },
    { id: "INV-2026-06", date: "Jun 1, 2026", desc: "Growth Plan — Monthly", amount: "₹2,499" },
    { id: "INV-2026-05", date: "May 1, 2026", desc: "Growth Plan — Monthly", amount: "₹2,499" },
    { id: "INV-2026-04", date: "Apr 1, 2026", desc: "Starter Plan — Monthly", amount: "₹999" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#181A1F]">Payment &amp; Billing</h2>
        <p className="text-sm text-[#5F635C] mt-0.5">Manage your subscription, payment methods and invoices</p>
      </div>
      <div className="flex gap-1 bg-[#DFE0D8] rounded-md p-1 w-fit flex-wrap">
        {([["plan","Subscription"],["transactions","Transactions"],["bank","Bank Details"],["invoices","Invoices"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === id ? "bg-white text-[#181A1F] shadow-sm" : "text-[#5F635C] hover:text-[#30342F]"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "plan" && (
        <div className="space-y-5">
          <div className="bg-[#FFC400]/5 border border-[#D6A500]/20 rounded-md p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-[#FFC400]/20 rounded-md flex items-center justify-center"><Zap size={18} className="text-[#755900]" /></div>
            <div className="flex-1">
              <div className="text-sm font-bold text-[#181A1F]">Current Plan: <span className="text-[#755900]">Growth</span></div>
              <div className="text-xs text-[#5F635C]">Next billing on <strong>Aug 1, 2026</strong> · ₹2,499/month</div>
            </div>
            <button className="text-sm font-semibold text-red-500 hover:text-red-700">Cancel Plan</button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {PLANS.map(plan => (
              <div key={plan.id} className={`bg-white rounded-md border-2 p-5 relative ${plan.current ? "border-[#D6A500]" : "border-[#DFE0D8]"}`}>
                {plan.current && <span className="absolute -top-3 left-4 bg-[#FFC400] text-[#17140A] text-xs font-bold px-2.5 py-0.5 rounded-full">Current</span>}
                <div className="text-sm font-bold text-[#5F635C] uppercase tracking-wide mb-1">{plan.name}</div>
                <div className="text-2xl font-bold text-[#181A1F] mb-3">
                  {plan.price}<span className="text-sm font-normal text-[#7D8178]">/mo</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-[#464A45]"><CheckCircle size={12} className="text-[#755900] shrink-0" />{f}</li>
                  ))}
                </ul>
                {!plan.current && (
                  <button className="w-full py-2 text-sm font-semibold rounded-md bg-[#DFE0D8] text-[#30342F] hover:bg-[#C9CBC2] transition-colors">
                    {plan.id === "starter" ? "Downgrade" : "Upgrade"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "transactions" && (
        <div className="bg-white rounded-md border border-[#DFE0D8] overflow-hidden">
          <Table className="w-full text-sm">
            <TableHeader className="bg-[#FFC400]/10 text-xs font-semibold text-[#755900] uppercase tracking-wide">
              <TableRow>{["Invoice ID","Date","Description","Amount","Status",""].map(h => <TableHead key={h} className="px-5 py-3 text-left">{h}</TableHead>)}</TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#F7F7F3]">
              {TXN.map(t => (
                <TableRow key={t.id} className="hover:bg-[#F7F7F3] transition-colors">
                  <TableCell className="px-5 py-3.5 font-mono text-xs text-[#5F635C]">{t.id}</TableCell>
                  <TableCell className="px-5 py-3.5 text-[#464A45]">{t.date}</TableCell>
                  <TableCell className="px-5 py-3.5 text-[#181A1F] font-medium">{t.desc}</TableCell>
                  <TableCell className="px-5 py-3.5 font-semibold text-[#181A1F]">{t.amount}</TableCell>
                  <TableCell className="px-5 py-3.5"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200"><CheckCircle size={10} />Paid</span></TableCell>
                  <TableCell className="px-5 py-3.5"><button className="text-xs text-[#755900] font-semibold hover:underline">PDF</button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {tab === "bank" && (
        <div className="bg-white rounded-md border border-[#DFE0D8] p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center"><Building size={18} className="text-blue-600" /></div>
            <div>
              <h3 className="font-bold text-[#181A1F]">Bank Account Details</h3>
              <p className="text-xs text-[#7D8178]">Payouts will be transferred to this account</p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 text-xs bg-sky-50 text-sky-600 border border-sky-200 px-2.5 py-1 rounded-full font-medium"><ShieldCheck size={11} />Verified</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Account Holder Name", value: "Court Masters Arena Pvt Ltd" },
              { label: "Bank Name", value: "HDFC Bank" },
              { label: "Account Number", value: "XXXX XXXX 7842", mono: true },
              { label: "IFSC Code", value: "HDFC0001234", mono: true },
              { label: "Account Type", value: "Current Account" },
              { label: "Branch", value: "Indiranagar, Bangalore" },
            ].map(f => (
              <div key={f.label} className="bg-[#F7F7F3] rounded-md p-4">
                <div className="text-xs text-[#7D8178] mb-1">{f.label}</div>
                <div className={`text-sm font-semibold text-[#181A1F] ${f.mono ? "font-mono" : ""}`}>{f.value}</div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800">
            <strong>To update bank details,</strong> contact <span className="font-semibold text-[#755900]">support@inspirq.com</span>. Bank changes require KYC re-verification.
          </div>
          <div className="border-t border-[#DFE0D8] pt-5">
            <h3 className="font-bold text-[#181A1F] mb-4">Payout Schedule</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[{ label: "Payout Cycle", value: "T+2 Business Days" }, { label: "Last Payout", value: "₹18,420 on Jul 8" }, { label: "Next Payout", value: "₹12,840 on Jul 12" }].map(s => (
                <div key={s.label} className="bg-[#F7F7F3] rounded-md p-4">
                  <div className="text-xs text-[#7D8178] mb-1">{s.label}</div>
                  <div className="text-sm font-bold text-[#181A1F]">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "invoices" && (
        <div className="space-y-3">
          {TXN.map(t => (
            <div key={t.id} className="bg-white rounded-md border border-[#DFE0D8] p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#F7F7F3] rounded-md flex items-center justify-center"><CreditCard size={16} className="text-[#7D8178]" /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#181A1F]">{t.desc}</div>
                <div className="text-xs text-[#7D8178]">{t.date} · {t.id}</div>
              </div>
              <div className="text-sm font-bold text-[#181A1F]">{t.amount}</div>
              <button className="text-xs font-semibold text-[#755900] border border-[#D6A500]/30 px-3 py-1.5 rounded-md hover:bg-[#FFC400]/5 transition-colors">PDF</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── About Us ─────────────────────────────────────────────────────────────────

export function AboutUsPage({ onNavigate }: { onNavigate: (p: Page, ctx?: any) => void }) {
  const stats = [
    { value: "2.4L+", label: "Active Players" },
    { value: "1,800+", label: "Venues Listed" },
    { value: "320+", label: "Certified Coaches" },
    { value: "48", label: "Cities" },
  ];
  const values = [
    { icon: ZapIcon, color: "bg-amber-50 text-amber-600", title: "Instant Booking", desc: "Book any venue, game, or coach slot in under 60 seconds — no phone calls, no waiting." },
    { icon: Shield, color: "bg-blue-50 text-blue-600", title: "Verified Listings", desc: "Every venue and coach goes through a manual quality check before appearing on InspirQ." },
    { icon: Heart, color: "bg-rose-50 text-rose-600", title: "Community First", desc: "We are building a community of athletes, not just a booking engine. Leaderboards, squads, and events." },
    { icon: Award, color: "bg-sky-50 text-sky-600", title: "Rewards That Matter", desc: "InspirQ Coins on every booking. Redeem for discounts, merchandise, and tournament entries." },
  ];
  const team = [
    { name: "Rohan Kapoor", role: "CEO & Co-Founder", img: "/inspirq-media/coach-avatar.svg", bio: "Ex-Razorpay. Built InspirQ after years of struggling to book a badminton court on weekends." },
    { name: "Priya Sharma", role: "CTO & Co-Founder", img: "/inspirq-media/coach-avatar.svg", bio: "Full-stack engineer with 10 years at Flipkart. Obsessed with millisecond page loads." },
    { name: "Arjun Nair", role: "Head of Growth", img: "/inspirq-media/coach-avatar.svg", bio: "Marathon runner and ex-Swiggy. Turned a Bangalore pilot into a 48-city operation in 18 months." },
    { name: "Meena Iyer", role: "Head of Partnerships", img: "/inspirq-media/coach-avatar.svg", bio: "Former national badminton player. Brings the athlete perspective to every venue partnership decision." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-72 overflow-hidden">
        <img src="/inspirq-media/football.png" alt="Sport" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="inline-flex items-center gap-2 bg-[#FFC400] border border-[#D6A500] text-[#17140A] text-xs font-semibold px-3 py-1 rounded-full mb-4">
            India&apos;s #1 Sports Booking Platform
          </div>
          <h1 className="text-4xl font-bold mb-3">We are Building India&apos;s Sports OS</h1>
          <p className="text-white/80 max-w-xl text-base">From your next badminton game to a national-level tournament — InspirQ connects every athlete, venue, and coach on one platform.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.value} className="text-center">
              <div className="text-4xl font-bold text-[#755900]">{s.value}</div>
              <div className="text-sm text-[#5F635C] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#181A1F] mb-4">Why We Started</h2>
            <p className="text-[#464A45] leading-relaxed mb-4">In 2022, our co-founders were frustrated. Every weekend started the same way — calling 5 venues, getting put on hold, showing up to find the slot double-booked.</p>
            <p className="text-[#464A45] leading-relaxed mb-4">InspirQ started as a Bangalore experiment: 12 venues, a basic booking form, and a WhatsApp group. Within 6 months we had 20,000 players. Today we are in 48 cities with over 2.4 lakh active users.</p>
            <p className="text-[#464A45] leading-relaxed">Our mission: make it as easy to play sport in India as it is to order dinner.</p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img src="/inspirq-media/badminton.png" alt="Team playing sport" className="w-full h-64 object-cover" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#181A1F] mb-8 text-center">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map(v => (
              <div key={v.title} className="border border-[#DFE0D8] rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-lg ${v.color} flex items-center justify-center mb-4`}>
                  <v.icon size={20} />
                </div>
                <h3 className="font-bold text-[#181A1F] mb-2">{v.title}</h3>
                <p className="text-sm text-[#5F635C] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#181A1F] mb-2 text-center">The People Behind InspirQ</h2>
          <p className="text-center text-[#5F635C] mb-8">Athletes, engineers, and growth obsessives — all obsessed with sport.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(m => (
              <div key={m.name} className="text-center">
                <img src={m.img} alt={m.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-3 ring-2 ring-[#D6A500]/20" />
                <div className="font-bold text-[#181A1F] text-sm">{m.name}</div>
                <div className="text-xs text-[#755900] font-medium mb-2">{m.role}</div>
                <p className="text-xs text-[#5F635C] leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#FFC400] to-[#D9A900] rounded-2xl p-10 text-center text-[#17140A]">
          <h2 className="text-2xl font-bold mb-2">Ready to Play?</h2>
          <p className="text-[#3B310F] mb-6">Join 2.4 lakh athletes already booking on InspirQ.</p>
          <button onClick={() => onNavigate("player-venues")}
            className="bg-white text-[#755900] font-semibold px-8 py-3 rounded-lg hover:bg-[#F7F7F3] transition-colors inline-flex items-center gap-2">
            Find a Venue Near You <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Help Center ───────────────────────────────────────────────────────────────

export function HelpCenterPage({ onNavigate }: { onNavigate: (p: Page, ctx?: any) => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const categories = [
    { icon: BookOpen, label: "Bookings & Slots", color: "bg-blue-50 text-blue-600" },
    { icon: CreditCard, label: "Payments & Refunds", color: "bg-sky-50 text-sky-600" },
    { icon: User, label: "My Account", color: "bg-purple-50 text-purple-600" },
    { icon: Trophy, label: "Tournaments", color: "bg-amber-50 text-amber-600" },
    { icon: Users, label: "Coaches & Training", color: "bg-rose-50 text-rose-600" },
    { icon: Building, label: "Venue Owners", color: "bg-[#F7F7F3] text-[#464A45]" },
  ];

  const faqs = [
    { q: "How do I book a venue?", a: "Go to Find Venues, pick your sport and location, select an available time slot, and proceed to checkout. Bookings are confirmed within seconds." },
    { q: "Can I cancel my booking?", a: "Yes. You can cancel from My Bookings. Cancellations made more than 4 hours before the slot receive a full refund; 2-4 hours receive 50%; within 2 hours no refund applies." },
    { q: "What payment methods are supported?", a: "We support UPI (PhonePe, Google Pay, Paytm), credit/debit cards (Visa, Mastercard, Rupay), net banking, and InspirQ Wallet." },
    { q: "How do InspirQ Coins work?", a: "You earn coins on every booking (1 coin per Rs.10 spent). Coins can be redeemed for discounts on future bookings at a rate of 1 coin = Rs.0.50." },
    { q: "How do I join an open game?", a: "Go to Find Games, pick a game that interests you, and click Join. You will be added to the squad automatically and receive a WhatsApp confirmation." },
    { q: "What if I cannot find a slot on the app?", a: "Try adjusting your date or time filters. If a venue you like has no slots listed, you can request an update directly from the venue page." },
    { q: "How do I list my venue on InspirQ?", a: "Sign up as a Venue Owner, complete KYC verification (takes 24-48 hrs), and you can start adding your courts and slots immediately after approval." },
    { q: "How are coaches verified?", a: "All coaches submit identity documents, qualifications, and at least 2 player references. We do a background check before approving any profile." },
  ];

  const filtered = faqs.filter(f => !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#F7F7F3]">
      <div className="bg-gradient-to-br from-[#FFC400] to-[#D9A900] py-14 px-4 text-center text-[#17140A]">
        <LifeBuoy size={40} className="mx-auto mb-4 text-[#3B310F]" />
        <h1 className="text-3xl font-bold mb-2">How can we help you?</h1>
        <p className="text-[#3B310F] mb-6">Search our knowledge base or browse topics below.</p>
        <div className="relative max-w-md mx-auto">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7D8178]" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search for answers..."
            className="w-full pl-10 pr-4 py-3 rounded-lg text-[#181A1F] bg-white text-sm outline-none shadow-sm"
          />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {!search && (
          <div>
            <h2 className="text-xl font-bold text-[#181A1F] mb-5">Browse by Topic</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map(c => (
                <button key={c.label} className="flex items-center gap-3 p-4 bg-white border border-[#DFE0D8] rounded-xl hover:shadow-md transition-shadow text-left">
                  <div className={`w-10 h-10 rounded-lg ${c.color} flex items-center justify-center shrink-0`}>
                    <c.icon size={18} />
                  </div>
                  <span className="font-medium text-sm text-[#222520]">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-[#181A1F] mb-5">
            {search ? `Results for "${search}"` : "Frequently Asked Questions"}
          </h2>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#DFE0D8] p-8 text-center">
              <HelpCircle size={32} className="mx-auto text-[#A5A89E] mb-3" />
              <p className="text-[#5F635C] text-sm">No results found. Try a different search term.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((f, i) => (
                <div key={i} className="bg-white border border-[#DFE0D8] rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F7F7F3] transition-colors">
                    <span className="font-semibold text-[#181A1F] text-sm pr-4">{f.q}</span>
                    <ChevronDown size={16} className={`text-[#7D8178] shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm text-[#464A45] leading-relaxed border-t border-[#F7F7F3] pt-4">{f.a}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#181A1F] mb-5">Still need help?</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <div className="bg-white border border-[#DFE0D8] rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={22} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-[#181A1F] mb-1">Live Chat</h3>
              <p className="text-xs text-[#5F635C] mb-4">Available 9 AM to 9 PM, 7 days a week</p>
              <button className="w-full bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors">Start Chat</button>
            </div>
            <div className="bg-white border border-[#DFE0D8] rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail size={22} className="text-sky-600" />
              </div>
              <h3 className="font-bold text-[#181A1F] mb-1">Email Us</h3>
              <p className="text-xs text-[#5F635C] mb-4">Get a response within 24 hours</p>
              <div className="w-full bg-sky-600 text-white text-sm font-semibold py-2.5 rounded-lg text-center">support@inspirq.com</div>
            </div>
            <div className="bg-white border border-[#DFE0D8] rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone size={22} className="text-amber-600" />
              </div>
              <h3 className="font-bold text-[#181A1F] mb-1">Call Us</h3>
              <p className="text-xs text-[#5F635C] mb-4">Mon to Sat, 10 AM to 6 PM IST</p>
              <div className="w-full bg-amber-600 text-white text-sm font-semibold py-2.5 rounded-lg text-center">+91 8000 000 000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cookie Policy ─────────────────────────────────────────────────────────────

export function CookiePolicyPage() {
  const cookies = [
    { name: "inspirq_session", type: "Essential", purpose: "Keeps you logged in during your session.", expiry: "Session" },
    { name: "inspirq_auth", type: "Essential", purpose: "Secure authentication token.", expiry: "30 days" },
    { name: "inspirq_city", type: "Functional", purpose: "Remembers your selected city for browsing.", expiry: "1 year" },
    { name: "inspirq_prefs", type: "Functional", purpose: "Stores UI preferences (theme, filters).", expiry: "1 year" },
    { name: "_ga", type: "Analytics", purpose: "Google Analytics - tracks page views and usage patterns.", expiry: "2 years" },
    { name: "_fbp", type: "Marketing", purpose: "Facebook Pixel - supports targeted advertising.", expiry: "90 days" },
    { name: "criteo_id", type: "Marketing", purpose: "Criteo - retargeting for sport booking ads.", expiry: "13 months" },
  ];
  const typeColors: Record<string, string> = {
    Essential: "bg-sky-50 text-sky-700",
    Functional: "bg-blue-50 text-blue-700",
    Analytics: "bg-amber-50 text-amber-700",
    Marketing: "bg-rose-50 text-rose-700",
  };

  return (
    <div className="p-6 max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#181A1F] mb-1">Cookie Policy</h1>
        <p className="text-sm text-[#7D8178]">Last updated: July 1, 2026</p>
      </div>
      <p className="text-sm text-[#464A45] leading-relaxed">InspirQ Sport Play uses cookies and similar tracking technologies to improve your browsing experience, analyse site traffic, and personalise content.</p>
      <div className="space-y-4">
        <h2 className="font-bold text-[#181A1F]">What Are Cookies?</h2>
        <p className="text-sm text-[#464A45] leading-relaxed">Cookies are small text files stored on your device by your browser. They help websites remember your preferences and activity across sessions.</p>
      </div>
      <div>
        <h2 className="font-bold text-[#181A1F] mb-4">Cookies We Use</h2>
        <div className="overflow-x-auto">
          <Table className="w-full text-sm border-collapse">
            <TableHeader>
              <TableRow className="bg-[#FFC400]/10">
                <TableHead className="text-left px-3 py-2 font-semibold text-[#755900] border border-[#D6A500]/20">Cookie</TableHead>
                <TableHead className="text-left px-3 py-2 font-semibold text-[#755900] border border-[#D6A500]/20">Type</TableHead>
                <TableHead className="text-left px-3 py-2 font-semibold text-[#755900] border border-[#D6A500]/20">Purpose</TableHead>
                <TableHead className="text-left px-3 py-2 font-semibold text-[#755900] border border-[#D6A500]/20">Expiry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cookies.map((c, i) => (
                <TableRow key={c.name} className={i % 2 === 0 ? "bg-white" : "bg-[#F7F7F3]"}>
                  <TableCell className="px-3 py-2.5 border border-[#DFE0D8] font-mono text-xs text-[#30342F]">{c.name}</TableCell>
                  <TableCell className="px-3 py-2.5 border border-[#DFE0D8]">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[c.type]}`}>{c.type}</span>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 border border-[#DFE0D8] text-[#464A45]">{c.purpose}</TableCell>
                  <TableCell className="px-3 py-2.5 border border-[#DFE0D8] text-[#5F635C] whitespace-nowrap">{c.expiry}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="font-bold text-[#181A1F]">Managing Cookies</h2>
        <p className="text-sm text-[#464A45] leading-relaxed">You can control cookies through your browser settings. Disabling essential cookies will impact platform functionality. Analytics and marketing cookies can be disabled without affecting core features.</p>
      </div>
      <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 text-sm text-sky-800">
        <strong>Questions?</strong> Contact our privacy team at privacy@inspirq.com or read our full Privacy Policy.
      </div>
    </div>
  );
}

// ─── Design System Page ─────────────────────────────────────────────────────────

export function DesignSystemPage({ onNavigate }: { onNavigate: (p: Page, ctx?: any) => void }) {
  const [activeSection, setActiveSection] = useState("tokens");
  const [copied, setCopied] = useState("");

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const navItems = [
    { id: "tokens",      label: "Design Tokens", icon: Palette },
    { id: "typography",  label: "Typography",    icon: Type },
    { id: "colors",      label: "Color System",  icon: Hash },
    { id: "buttons",     label: "Buttons",        icon: Box },
    { id: "badges",      label: "Badges & Tags",  icon: Layers },
    { id: "inputs",      label: "Form Inputs",    icon: ToggleLeft },
    { id: "cards",       label: "Cards",          icon: Component },
    { id: "datatable",   label: "Data Table",     icon: LayoutGrid },
    { id: "feedback",    label: "Feedback",        icon: AlertTriangle },
    { id: "icons",       label: "Icon Usage",     icon: Star },
  ];

  return (
    <div className="min-h-full bg-[#F7F7F3]">
      {/* Page header */}
      <div className="bg-white border-b border-[#DFE0D8]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-[#FFC400] rounded-md flex items-center justify-center">
                  <Sliders size={15} className="text-[#17140A]" />
                </div>
                <span className="text-xs font-bold text-[#755900] bg-[#FFF9D6] px-2.5 py-0.5 rounded-full">v1.0 · September 2026</span>
              </div>
              <h1 className="text-3xl font-extrabold text-[#151713] mb-2">
                InspirQ Design System
              </h1>
              <p className="text-sm text-[#5F635C] max-w-xl">
                A comprehensive library of reusable UI components, design tokens, and interaction patterns powering the InspirQ Sport platform across all user roles.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-[#DFE0D8] text-[#222520] text-sm font-medium rounded-md hover:bg-[#F7F7F3] transition-colors">
                <Download size={14} /> Export Tokens
              </button>
              <button aria-label="Share" className="flex items-center gap-2 px-4 py-2 bg-[#FFC400] text-[#17140A] text-sm font-semibold rounded-md hover:bg-[#D9A900] transition-colors"><Share2 size={14} /> Share System
              </button>
            </div>
          </div>
          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-6">
            {[["48", "Components"], ["12", "Design Tokens"], ["5", "User Roles"], ["3", "Font Families"]].map(([v, l]) => (
              <div key={l}>
                <span className="text-2xl font-extrabold text-[#151713]">{v}</span>
                <span className="text-xs text-[#7D8178] ml-1.5">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8 flex gap-8">
        {/* Sidebar nav */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-6 bg-white border border-[#DFE0D8] rounded-md overflow-hidden">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors border-b border-[#EFEFE9] last:border-0 ${activeSection === item.id ? "bg-[#FFF9D6] text-[#755900]" : "text-[#464A45] hover:bg-[#F7F7F3]"}`}>
                <item.icon size={14} />
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile section tabs */}
        <div className="lg:hidden mb-6 w-full">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${activeSection === item.id ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "border-[#DFE0D8] text-[#464A45] hover:border-[#D6A500]"}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-8">

          {/* ── Design Tokens ── */}
          {activeSection === "tokens" && (
            <div className="space-y-6">
              <DSSection title="Design Tokens" subtitle="CSS custom properties powering the entire visual system">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: "--background", val: "#F7F7F3", label: "Page Background" },
                    { name: "--foreground", val: "#151713", label: "Default Text" },
                    { name: "--primary", val: "#FFC400", label: "Energy Yellow" },
                    { name: "--primary-foreground", val: "#17140A", label: "Performance Ink on Yellow" },
                    { name: "--muted", val: "#EFEFE9", label: "Muted Surface" },
                    { name: "--muted-foreground", val: "#7D8178", label: "Muted Text" },
                    { name: "--border", val: "#DFE0D8", label: "Border Color" },
                    { name: "--card", val: "#FFFFFF", label: "Card Background" },
                    { name: "--accent", val: "#FFF9D6", label: "Yellow Tint" },
                    { name: "--radius", val: "0.625rem", label: "Border Radius (10px)" },
                    { name: "--ring", val: "#B88900", label: "Accessible Focus Ring" },
                    { name: "--destructive", val: "#B44949", label: "Destructive / Error" },
                  ].map(t => (
                    <div key={t.name} className="bg-white border border-[#DFE0D8] rounded-md p-4 flex items-center gap-3 group hover:shadow-sm transition-shadow">
                      <div className="w-10 h-10 rounded-md border border-[#DFE0D8] shrink-0" style={{ background: t.val.startsWith("#") ? t.val : undefined, backgroundColor: t.val.startsWith("#") ? t.val : "#DFE0D8" }} />
                      <div className="min-w-0 flex-1">
                        <code className="text-xs font-mono text-[#755900] bg-[#FFF9D6] px-1.5 py-0.5 rounded">{t.name}</code>
                        <div className="text-sm font-semibold text-[#151713] mt-1 truncate">{t.label}</div>
                        <div className="text-xs text-[#7D8178] font-mono">{t.val}</div>
                      </div>
                      <button onClick={() => copyText(`var(${t.name})`, t.name)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#F7F7F3] rounded transition-all">
                        {copied === t.name ? <CheckCircle size={14} className="text-[#755900]" /> : <Copy size={14} className="text-[#7D8178]" />}
                      </button>
                    </div>
                  ))}
                </div>
              </DSSection>

              <DSSection title="Spacing Scale" subtitle="Consistent spacing values derived from Tailwind's 4px base grid">
                <div className="flex flex-wrap gap-3">
                  {[1,2,3,4,5,6,8,10,12,16,20,24].map(n => (
                    <div key={n} className="text-center">
                      <div className="bg-[#FFC400]/20 rounded" style={{ width: `${n * 4}px`, height: 24, maxWidth: 96 }} />
                      <div className="text-xs font-mono text-[#7D8178] mt-1">{n} / {n*4}px</div>
                    </div>
                  ))}
                </div>
              </DSSection>

              <DSSection title="Border Radius" subtitle="10px (0.625rem) system — compact, tactile, and consistent">
                <div className="flex flex-wrap gap-5 items-end">
                  {[["rounded-sm", "2px"], ["rounded", "4px"], ["rounded-md", "6px"], ["rounded-lg", "8px"], ["rounded-xl", "12px"], ["rounded-full", "9999px"]].map(([cls, val]) => (
                    <div key={cls} className="text-center">
                      <div className={`w-16 h-16 bg-[#FFC400]/20 border-2 border-[#D6A500]/30 ${cls}`} />
                      <div className="text-xs font-mono text-[#7D8178] mt-2">{cls}</div>
                      <div className="text-xs text-[#A5A89E]">{val}</div>
                    </div>
                  ))}
                </div>
              </DSSection>
            </div>
          )}

          {/* ── Typography ── */}
          {activeSection === "typography" && (
            <DSSection title="Typography System" subtitle="Font stack: Lexend (headings) + Plus Jakarta Sans (body)">
              <div className="space-y-6">
                {[
                  { label: "Display / H1", cls: "text-4xl font-extrabold", sample: "Find Your Arena" },
                  { label: "H2", cls: "text-3xl font-bold", sample: "Explore Tournaments" },
                  { label: "H3", cls: "text-2xl font-bold", sample: "Book in 3 Clicks" },
                  { label: "H4", cls: "text-xl font-semibold", sample: "Venue Highlights" },
                  { label: "H5 / Section Label", cls: "text-base font-semibold uppercase tracking-wider", sample: "FEATURED COACHES" },
                  { label: "Body Large", cls: "text-base text-[#222520]", sample: "InspirQ connects players with the best sports venues, coaches, and tournaments across India." },
                  { label: "Body Default", cls: "text-sm text-[#464A45]", sample: "Book a badminton court, join a weekend cricket match, or find a certified tennis coach in your city." },
                  { label: "Body Small / Caption", cls: "text-xs text-[#7D8178]", sample: "892+ venues · 200+ coaches · 50K+ players" },
                  { label: "Label / Overline", cls: "text-xs font-bold uppercase tracking-[0.1em] text-[#755900]", sample: "Available Now" },
                ].map(t => (
                  <div key={t.label} className="bg-white border border-[#DFE0D8] rounded-md p-5">
                    <span className="text-xs font-bold text-[#7D8178] uppercase tracking-wider">{t.label}</span>
                    <div className={`${t.cls} ${t.cls.includes("font-bold") || t.cls.includes("font-extrabold") ? "font-['Lexend']" : ""} text-[#151713] mt-2`}>
                      {t.sample}
                    </div>
                    <code className="text-xs font-mono text-[#A5A89E] mt-2 block">{t.cls}</code>
                  </div>
                ))}
              </div>
            </DSSection>
          )}

          {/* ── Color System ── */}
          {activeSection === "colors" && (
            <div className="space-y-6">
              <DSSection title="Color Palette" subtitle="InspirQ brand colors and semantic palette">
                <div className="space-y-5">
                  {[
                    { name: "Energy Yellow (Primary)", shades: [
                      { label: "950", hex: "#2A2100" }, { label: "900", hex: "#5C4600" }, { label: "800", hex: "#856400" },
                      { label: "700", hex: "#B88900" }, { label: "600", hex: "#E0AA00" }, { label: "500", hex: "#FFC400" },
                      { label: "200", hex: "#FFE36A" }, { label: "100", hex: "#FFF0A3" }, { label: "50", hex: "#FFF9D6" },
                    ]},
                    { name: "Performance Slate (Secondary)", shades: [
                      { label: "900", hex: "#182131" }, { label: "700", hex: "#354256" }, { label: "500", hex: "#5F6C80" }, { label: "100", hex: "#E6EAF0" },
                    ]},
                    { name: "Neutral", shades: [
                      { label: "900", hex: "#222520" }, { label: "700", hex: "#464A45" }, { label: "500", hex: "#5F635C" },
                      { label: "400", hex: "#7D8178" }, { label: "300", hex: "#A5A89E" }, { label: "200", hex: "#C9CBC2" },
                      { label: "100", hex: "#DFE0D8" }, { label: "50", hex: "#EFEFE9" }, { label: "25", hex: "#F7F7F3" },
                    ]},
                    { name: "Semantic", shades: [
                      { label: "Error", hex: "#B44949" }, { label: "Warning", hex: "#A87632" }, { label: "Success", hex: "#1473E6" }, { label: "Info", hex: "#3F718B" },
                    ]},
                  ].map(group => (
                    <div key={group.name}>
                      <h4 className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-2">{group.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {group.shades.map(s => (
                          <button key={s.hex} onClick={() => copyText(s.hex, s.hex)}
                            className="group flex flex-col items-center gap-1 cursor-pointer">
                            <div className="w-12 h-12 rounded-md border border-black/10 transition-transform group-hover:scale-110" style={{ background: s.hex }} />
                            <span className="text-xs font-mono text-[#7D8178]">{s.label}</span>
                            <span className="text-xs font-mono text-[#A5A89E]">{copied === s.hex ? "✓ Copied" : s.hex}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </DSSection>
            </div>
          )}

          {/* ── Buttons ── */}
          {activeSection === "buttons" && (
            <DSSection title="Button System" subtitle="Variants, sizes, and states for all interactive contexts">
              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-4">Variants</h4>
                  <div className="flex flex-wrap gap-3">
                    <button className="bg-[#FFC400] text-[#17140A] px-5 py-2.5 rounded-md text-sm font-bold hover:bg-[#D9A900] transition-colors">Primary</button>
                    <button className="bg-white text-[#222520] px-5 py-2.5 rounded-md text-sm font-semibold border border-[#DFE0D8] hover:border-[#D6A500] hover:text-[#755900] transition-colors">Secondary</button>
                    <button className="border-2 border-[#D6A500] text-[#755900] px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-[#FFF9D6] transition-colors">Outlined</button>
                    <button className="text-[#755900] px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-[#FFF9D6] transition-colors">Ghost</button>
                    <button className="bg-[#B44949] text-white px-5 py-2.5 rounded-md text-sm font-bold hover:bg-[#B03030] transition-colors">Destructive</button>
                    <button disabled className="bg-[#FFC400] text-[#17140A] px-5 py-2.5 rounded-md text-sm font-bold opacity-40 cursor-not-allowed">Disabled</button>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-4">Sizes</h4>
                  <div className="flex items-center flex-wrap gap-3">
                    <button className="bg-[#FFC400] text-[#17140A] px-3 py-1.5 rounded text-xs font-semibold">XS · Extra Small</button>
                    <button className="bg-[#FFC400] text-[#17140A] px-4 py-2 rounded-md text-sm font-semibold">SM · Small</button>
                    <button className="bg-[#FFC400] text-[#17140A] px-5 py-2.5 rounded-md text-sm font-bold">MD · Medium (default)</button>
                    <button className="bg-[#FFC400] text-[#17140A] px-6 py-3 rounded-md text-base font-bold">LG · Large</button>
                    <button className="bg-[#FFC400] text-[#17140A] px-8 py-4 rounded-md text-lg font-extrabold">XL · Hero CTA</button>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-4">With Icons</h4>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 bg-[#FFC400] text-[#17140A] px-5 py-2.5 rounded-md text-sm font-bold hover:bg-[#D9A900] transition-colors">
                      <MapPin size={15} /> Book Arena
                    </button>
                    <button className="flex items-center gap-2 border border-[#DFE0D8] text-[#222520] px-5 py-2.5 rounded-md text-sm font-semibold hover:border-[#D6A500] hover:text-[#755900] transition-colors">
                      <Download size={15} /> Export CSV
                    </button>
                    <button className="flex items-center gap-2 bg-[#FFF9D6] text-[#755900] px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-[#FFC400] hover:text-[#17140A] transition-colors">
                      <Plus size={15} /> Add New
                    </button>
                    <button aria-label="Share" className="w-10 h-10 flex items-center justify-center bg-white border border-[#DFE0D8] rounded-md hover:border-[#D6A500] hover:text-[#755900] transition-colors"><Share2 size={16} className="text-[#5F635C]" />
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-4">Full Width (Mobile)</h4>
                  <div className="max-w-sm space-y-2">
                    <button className="w-full bg-[#FFC400] text-[#17140A] py-3 rounded-md text-sm font-bold hover:bg-[#D9A900] transition-colors">Book Now</button>
                    <button className="w-full border border-[#DFE0D8] text-[#222520] py-3 rounded-md text-sm font-semibold hover:bg-[#F7F7F3] transition-colors">Save for Later</button>
                  </div>
                </div>
              </div>
            </DSSection>
          )}

          {/* ── Badges ── */}
          {activeSection === "badges" && (
            <DSSection title="Badges & Tags" subtitle="Status indicators, labels, and meta chips">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-4">Status Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { text: "Active", cls: "bg-[#FFF9D6] text-[#755900]" },
                      { text: "Pending", cls: "bg-amber-50 text-amber-700" },
                      { text: "Rejected", cls: "bg-red-50 text-red-700" },
                      { text: "Completed", cls: "bg-blue-50 text-blue-700" },
                      { text: "Verified", cls: "bg-[#FFC400] text-[#17140A]" },
                      { text: "Draft", cls: "bg-[#EFEFE9] text-[#5F635C]" },
                      { text: "Open", cls: "bg-sky-50 text-sky-700 border border-sky-200" },
                      { text: "Sold Out", cls: "bg-red-50 text-red-700 border border-red-200" },
                      { text: "Filling Fast", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
                      { text: "New", cls: "bg-purple-50 text-purple-700" },
                    ].map(b => (
                      <span key={b.text} className={`px-3 py-1 rounded-full text-xs font-bold ${b.cls}`}>{b.text}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-4">Sport / Category Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {["🏸 Badminton", "⚽ Football", "🎾 Tennis", "🏏 Cricket", "🏀 Basketball", "🏸 Squash"].map(s => (
                      <span key={s} className="bg-white text-[#464A45] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#DFE0D8] hover:border-[#D6A500] hover:text-[#755900] cursor-pointer transition-colors">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-4">Notification Dot</h4>
                  <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10 bg-[#F7F7F3] rounded-md flex items-center justify-center border border-[#DFE0D8]">
                      <Bell size={18} className="text-[#222520]" />
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full">3</span>
                    </div>
                    <div className="relative w-10 h-10 bg-[#F7F7F3] rounded-md flex items-center justify-center border border-[#DFE0D8]">
                      <MessageCircle size={18} className="text-[#222520]" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-4 bg-[#FFC400] text-[#17140A] text-xs font-bold flex items-center justify-center rounded-full px-1">12</span>
                    </div>
                  </div>
                </div>
              </div>
            </DSSection>
          )}

          {/* ── Inputs ── */}
          {activeSection === "inputs" && (
            <DSSection title="Form Inputs" subtitle="Controlled input components for data entry">
              <div className="max-w-md space-y-5">
                {/* Text input */}
                <div>
                  <label className="text-xs font-bold text-[#222520] mb-1.5 block">Text Input</label>
                  <input defaultValue="" placeholder="e.g. Koramangala, Bangalore"
                    className="w-full border border-[#DFE0D8] rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500] bg-[#F7F7F3] text-[#151713] placeholder:text-[#A5A89E] transition-colors" />
                </div>
                {/* Icon input */}
                <div>
                  <label className="text-xs font-bold text-[#222520] mb-1.5 block">Search Input (with icon)</label>
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8178]" />
                    <input placeholder="Search venues, coaches..."
                      className="w-full pl-9 pr-4 py-2.5 border border-[#DFE0D8] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500] bg-[#F7F7F3] placeholder:text-[#A5A89E] transition-colors" />
                  </div>
                </div>
                {/* Select */}
                <div>
                  <label className="text-xs font-bold text-[#222520] mb-1.5 block">Select Dropdown</label>
                  <select className="w-full border border-[#DFE0D8] rounded-md px-4 py-2.5 text-sm bg-[#F7F7F3] text-[#151713] focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500] transition-colors">
                    <option>Badminton</option><option>Football</option><option>Tennis</option><option>Cricket</option>
                  </select>
                </div>
                {/* Textarea */}
                <div>
                  <label className="text-xs font-bold text-[#222520] mb-1.5 block">Textarea</label>
                  <textarea rows={3} placeholder="Describe your venue..."
                    className="w-full border border-[#DFE0D8] rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500] bg-[#F7F7F3] text-[#151713] placeholder:text-[#A5A89E] resize-none transition-colors" />
                </div>
                {/* Error state */}
                <div>
                  <label className="text-xs font-bold text-[#222520] mb-1.5 block">Error State</label>
                  <input defaultValue="invalid@" placeholder="Email"
                    className="w-full border border-red-400 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/30 bg-[#F7F7F3] text-[#151713]" />
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> Please enter a valid email address</p>
                </div>
                {/* Success state */}
                <div>
                  <label className="text-xs font-bold text-[#222520] mb-1.5 block">Success State</label>
                  <div className="relative">
                    <input defaultValue="arjun@email.com"
                      className="w-full border border-[#D6A500] rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 bg-[#F7F7F3] text-[#151713] pr-10" />
                    <CheckCircle size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#755900]" />
                  </div>
                  <p className="text-xs text-[#755900] mt-1.5 flex items-center gap-1"><CheckCircle size={12} /> Email verified</p>
                </div>
              </div>
            </DSSection>
          )}

          {/* ── Cards ── */}
          {activeSection === "cards" && (
            <DSSection title="Card Components" subtitle="Reusable card patterns for venue, tournament, coach, and stat data">
              <div className="grid sm:grid-cols-2 gap-5">
                {/* Venue card mini */}
                <div className="bg-white rounded-md border border-[#DFE0D8] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="h-36 bg-gradient-to-br from-[#FFC400] to-[#1473E6] relative">
                    <img src="/inspirq-media/football.png" alt="Venue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3"><span className="bg-white/95 text-xs font-bold px-2 py-0.5 rounded-full">🏸 Badminton</span></div>
                    <div className="absolute top-3 right-3"><span className="bg-[#FFC400] text-[#17140A] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={8} />Verified</span></div>
                    <div className="absolute bottom-3 right-3"><span className="bg-[#FFF9D6] text-[#755900] text-xs font-bold px-2 py-0.5 rounded-full">● Available</span></div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-sm text-[#151713]">Sportz Village Koramangala</h4>
                      <div className="flex items-center gap-0.5"><Star size={11} className="text-yellow-400 fill-yellow-400" /><span className="text-xs font-bold">4.8</span></div>
                    </div>
                    <p className="text-xs text-[#5F635C] flex items-center gap-1 mb-3"><MapPin size={10} />Koramangala, Bangalore</p>
                    <div className="flex items-center justify-between pt-3 border-t border-[#EFEFE9]">
                      <div><span className="text-lg font-bold text-[#151713]">₹800</span><span className="text-xs text-[#7D8178]">/hr</span></div>
                      <button className="bg-[#FFC400] text-[#17140A] text-xs font-bold px-4 py-2 rounded-md">Book Now</button>
                    </div>
                  </div>
                </div>

                {/* Stat cards */}
                <div className="space-y-3">
                  {[
                    { label: "Total Bookings", val: "1,284", delta: "+12%", icon: Calendar, color: "bg-[#FFF9D6] text-[#755900]" },
                    { label: "Monthly Revenue", val: "₹48,920", delta: "+8%", icon: CreditCard, color: "bg-blue-50 text-blue-600" },
                    { label: "Active Venues", val: "892", delta: "+3%", icon: Building, color: "bg-purple-50 text-purple-600" },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-md border border-[#DFE0D8] p-4 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${s.color}`}>
                        <s.icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-[#7D8178] mb-0.5">{s.label}</div>
                        <div className="text-xl font-extrabold text-[#151713]">{s.val}</div>
                      </div>
                      <span className="text-xs font-bold text-[#755900] bg-[#FFF9D6] px-2 py-0.5 rounded-full">{s.delta}</span>
                    </div>
                  ))}
                </div>

                {/* Coach card */}
                <div className="bg-white rounded-md border border-[#DFE0D8] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="h-40 bg-[#EFEFE9] relative overflow-hidden">
                    <img src="/inspirq-media/badminton.png" alt="Coach" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3"><span className="bg-[#FFC400] text-[#17140A] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Shield size={8} />Verified</span></div>
                    <div className="absolute bottom-3 left-3">
                      <div className="font-bold text-white text-sm">Coach Rahul Nair</div>
                      <div className="flex items-center gap-1 mt-0.5"><Star size={10} className="text-yellow-400 fill-yellow-400" /><span className="text-white text-xs font-semibold">4.9</span><span className="text-white/70 text-xs">· 45 students</span></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-[#FFF9D6] text-[#755900] text-xs font-semibold px-2.5 py-1 rounded-full">🎾 Tennis</span>
                      <div><span className="text-base font-bold text-[#151713]">₹1,200</span><span className="text-xs text-[#7D8178]">/session</span></div>
                    </div>
                    <button className="w-full py-2 bg-[#FFF9D6] text-[#755900] text-xs font-bold rounded-md hover:bg-[#FFC400] hover:text-[#17140A] transition-colors">View Profile &amp; Book</button>
                  </div>
                </div>

                {/* Alert / notification card */}
                <div className="space-y-3">
                  {[
                    { icon: CheckCircle, text: "Booking confirmed for Sportz Village · Slot 6:00–7:00 PM", cls: "bg-[#FFF9D6] border-[#D6A500]/20 text-[#755900]" },
                    { icon: AlertCircle, text: "Payment failed. Please update your payment method to continue.", cls: "bg-red-50 border-red-200 text-red-700" },
                    { icon: Info, text: "Tournament registration closes in 2 days. 5 slots remaining.", cls: "bg-blue-50 border-blue-200 text-blue-700" },
                    { icon: AlertTriangle, text: "Your venue listing requires document verification.", cls: "bg-amber-50 border-amber-200 text-amber-700" },
                  ].map((a, i) => (
                    <div key={i} className={`rounded-md border p-3.5 flex items-start gap-2.5 text-sm ${a.cls}`}>
                      <a.icon size={15} className="shrink-0 mt-0.5" />{a.text}
                    </div>
                  ))}
                </div>
              </div>
            </DSSection>
          )}

          {/* ── DataTable ── */}
          {activeSection === "datatable" && (
            <DSSection title="Data Table" subtitle="Standard table with sorting, search, filter, export — used across all admin and player views">
              <DSDataTableDemo />
            </DSSection>
          )}

          {/* ── Feedback ── */}
          {activeSection === "feedback" && (
            <DSSection title="Feedback Components" subtitle="Loading states, empty states, and toasts">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-4">Empty States</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { icon: Calendar, title: "No bookings yet", desc: "Your upcoming bookings will appear here.", cta: "Book a Venue" },
                      { icon: Trophy, title: "No tournaments found", desc: "Try adjusting your filters or search.", cta: "Clear Filters" },
                      { icon: Users, title: "No games available", desc: "Create an open game and invite others.", cta: "Host a Game" },
                      { icon: Star, title: "No reviews yet", desc: "Reviews from players will show here.", cta: null },
                    ].map(e => (
                      <div key={e.title} className="bg-[#F7F7F3] border border-[#DFE0D8] rounded-md p-8 text-center">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-[#DFE0D8]">
                          <e.icon size={22} className="text-[#A5A89E]" />
                        </div>
                        <p className="font-semibold text-[#5F635C] mb-1 text-sm">{e.title}</p>
                        <p className="text-xs text-[#7D8178] mb-4">{e.desc}</p>
                        {e.cta && <button className="bg-[#FFC400] text-[#17140A] text-xs font-bold px-4 py-2 rounded-md hover:bg-[#D9A900] transition-colors">{e.cta}</button>}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-4">Skeleton Loading</h4>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-white border border-[#DFE0D8] rounded-md p-4 flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-md bg-[#EFEFE9] animate-pulse shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3.5 bg-[#EFEFE9] rounded animate-pulse w-3/4" />
                          <div className="h-3 bg-[#EFEFE9] rounded animate-pulse w-1/2" />
                        </div>
                        <div className="h-8 w-20 bg-[#EFEFE9] rounded-md animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-4">Toast Notifications</h4>
                  <div className="space-y-2 max-w-sm">
                    {[
                      { icon: CheckCircle, text: "Venue booked successfully!", cls: "bg-[#FFC400] text-[#17140A]" },
                      { icon: AlertCircle, text: "Payment failed. Please retry.", cls: "bg-[#B44949] text-white" },
                      { icon: Info, text: "Booking reminder in 2 hours.", cls: "bg-[#222520] text-white" },
                    ].map((t, i) => (
                      <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-md shadow-lg text-sm font-medium ${t.cls}`}>
                        <t.icon size={16} className="shrink-0" /> {t.text}
                        <X size={14} className="ml-auto opacity-70 cursor-pointer shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DSSection>
          )}

          {/* ── Icons ── */}
          {activeSection === "icons" && (
            <DSSection title="Icon Usage" subtitle="Lucide React icon system — 24px default, semantic sizing guidelines">
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800 flex items-start gap-2">
                  <Info size={15} className="shrink-0 mt-0.5" />
                  <span>All icons use <strong>Lucide React</strong>. Import only the icons you need: <code className="font-mono bg-amber-100 px-1 rounded text-xs">{"import { MapPin, Star } from \"lucide-react\""}</code></span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-4">Size Scale</h4>
                  <div className="flex items-end gap-6 flex-wrap">
                    {[[12,"xs/label"],[14,"sm/body"],[16,"md/default"],[18,"lg/header"],[20,"xl/hero"],[24,"2xl/display"]].map(([s, l]) => (
                      <div key={s} className="text-center">
                        <Star size={Number(s)} className="text-[#755900] mx-auto" />
                        <div className="text-xs font-mono text-[#7D8178] mt-1">{s}px</div>
                        <div className="text-xs text-[#A5A89E]">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#7D8178] uppercase tracking-wider mb-4">Common Icons Catalog</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                    {[
                      [MapPin, "MapPin"], [Star, "Star"], [Calendar, "Calendar"], [Trophy, "Trophy"],
                      [Users, "Users"], [CreditCard, "CreditCard"], [Bell, "Bell"], [Search, "Search"],
                      [Heart, "Heart"], [Shield, "Shield"], [CheckCircle, "CheckCircle"], [AlertCircle, "AlertCircle"],
                      [ArrowRight, "ArrowRight"], [Download, "Download"], [Share2, "Share2"], [Eye, "Eye"],
                      [Globe, "Globe"], [Mail, "Mail"], [Phone, "Phone"], [Lock, "Lock"],
                      [Info, "Info"], [Plus, "Plus"], [X, "X"], [ChevronRight, "ChevronRight"],
                    ].map(([Icon, name]) => (
                      <div key={String(name)} className="bg-white border border-[#DFE0D8] rounded-md p-3 text-center hover:border-[#D6A500] hover:bg-[#FFF9D6] transition-colors cursor-pointer group">
                        {/* @ts-ignore */}
                        <Icon size={20} className="mx-auto text-[#5F635C] group-hover:text-[#755900] transition-colors" />
                        <div className="text-xs font-mono text-[#7D8178] mt-2 truncate">{String(name)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DSSection>
          )}

        </main>
      </div>
    </div>
  );
}

// ── DS Section wrapper ──────────────────────────────────────────────────────────

function DSSection({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#DFE0D8] rounded-md overflow-hidden">
      <div className="px-6 py-5 border-b border-[#DFE0D8] bg-[#F7F7F3]">
        <h2 className="text-lg font-bold text-[#151713]">{title}</h2>
        <p className="text-sm text-[#5F635C] mt-0.5">{subtitle}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── DS DataTable demo ───────────────────────────────────────────────────────────

function DSDataTableDemo() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const PAGE = 5;

  const data = [
    { id: 1, venue: "Sportz Village Koramangala", sport: "Badminton", amount: 800, date: "Sep 7, 2026", status: "Confirmed" },
    { id: 2, venue: "Arena One Whitefield", sport: "Football", amount: 1200, date: "Sep 6, 2026", status: "Confirmed" },
    { id: 3, venue: "Play Zone HSR", sport: "Tennis", amount: 600, date: "Sep 5, 2026", status: "Pending" },
    { id: 4, venue: "Ace Badminton Centre", sport: "Badminton", amount: 900, date: "Sep 4, 2026", status: "Confirmed" },
    { id: 5, venue: "City Cricket Ground", sport: "Cricket", amount: 2000, date: "Sep 3, 2026", status: "Cancelled" },
    { id: 6, venue: "Jump Arena Indiranagar", sport: "Basketball", amount: 750, date: "Sep 2, 2026", status: "Confirmed" },
    { id: 7, venue: "Squash Club MG Road", sport: "Squash", amount: 650, date: "Sep 1, 2026", status: "Confirmed" },
    { id: 8, venue: "Smash Point Jayanagar", sport: "Badminton", amount: 850, date: "Aug 31, 2026", status: "Pending" },
  ];

  const cols = [
    { key: "id",     label: "#" },
    { key: "venue",  label: "Venue" },
    { key: "sport",  label: "Sport" },
    { key: "amount", label: "Amount" },
    { key: "date",   label: "Date" },
    { key: "status", label: "Status" },
  ];

  const toggleSort = (k: string) => {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };

  const statusColor: Record<string, string> = {
    Confirmed: "bg-[#FFF9D6] text-[#755900]",
    Pending: "bg-amber-50 text-amber-700",
    Cancelled: "bg-red-50 text-red-700",
  };

  let rows = data.filter(r => r.venue.toLowerCase().includes(search.toLowerCase()) || r.sport.toLowerCase().includes(search.toLowerCase()));
  if (sortKey) rows = [...rows].sort((a, b) => {
    const av = (a as any)[sortKey], bv = (b as any)[sortKey];
    if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
    return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });
  const total = rows.length;
  const paginated = rows.slice(page * PAGE, page * PAGE + PAGE);

  const exportCSV = () => {
    const hdr = cols.map(c => c.label).join(",");
    const body = rows.map(r => cols.map(c => (r as any)[c.key]).join(",")).join("\n");
    const blob = new Blob([hdr + "\n" + body], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "bookings.csv"; a.click();
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8178]" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} placeholder="Search..."
            className="pl-8 pr-3 py-2 border border-[#DFE0D8] rounded-md text-sm bg-[#F7F7F3] text-[#151713] focus:outline-none focus:ring-2 focus:ring-[#D6A500]/30 focus:border-[#D6A500] w-52 placeholder:text-[#A5A89E]" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigator.share?.({ title: "Bookings", text: "Booking data" })}
            className="flex items-center gap-1.5 px-3 py-2 border border-[#DFE0D8] rounded-md text-xs font-medium text-[#5F635C] hover:border-[#D6A500] hover:text-[#755900] transition-colors">
            <Share2 size={13} /> Share
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 border border-[#DFE0D8] rounded-md text-xs font-medium text-[#5F635C] hover:border-[#D6A500] hover:text-[#755900] transition-colors">
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-[#DFE0D8] overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="bg-[#FFF9D6]">
                {cols.map(c => (
                  <TableHead key={c.key} onClick={() => toggleSort(c.key)}
                    className="text-left px-4 py-3 text-xs font-bold text-[#755900] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:bg-[#EAF3FF] transition-colors">
                    <div className="flex items-center gap-1.5">
                      {c.label}
                      {sortKey === c.key
                        ? sortDir === "asc" ? <span className="text-xs">▲</span> : <span className="text-xs">▼</span>
                        : <ArrowUpDown size={11} className="text-[#755900]/50" />}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((row, i) => (
                <TableRow key={row.id} className={`border-t border-[#EFEFE9] hover:bg-[#FFF9D6]/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#F7F7F3]"}`}>
                  <TableCell className="px-4 py-3 text-[#7D8178] font-mono text-xs">{row.id}</TableCell>
                  <TableCell className="px-4 py-3 font-medium text-[#151713]">{row.venue}</TableCell>
                  <TableCell className="px-4 py-3 text-[#464A45]">{row.sport}</TableCell>
                  <TableCell className="px-4 py-3 font-semibold text-[#151713]">₹{row.amount}</TableCell>
                  <TableCell className="px-4 py-3 text-[#5F635C] whitespace-nowrap">{row.date}</TableCell>
                  <TableCell className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColor[row.status] || "bg-[#EFEFE9] text-[#5F635C]"}`}>{row.status}</span>
                  </TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow><TableCell colSpan={6} className="px-4 py-10 text-center text-sm text-[#7D8178]">No results match your search</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#F7F7F3] border-t border-[#EFEFE9] text-xs text-[#5F635C]">
          <span>Showing {Math.min(page * PAGE + 1, total)}–{Math.min(page * PAGE + PAGE, total)} of {total} rows</span>
          <div className="flex gap-1">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="px-2.5 py-1 rounded border border-[#DFE0D8] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">‹</button>
            {[...Array(Math.ceil(total / PAGE))].map((_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`px-2.5 py-1 rounded border transition-colors ${i === page ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "border-[#DFE0D8] hover:bg-white"}`}>{i + 1}</button>
            ))}
            <button disabled={page >= Math.ceil(total / PAGE) - 1} onClick={() => setPage(p => p + 1)}
              className="px-2.5 py-1 rounded border border-[#DFE0D8] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
