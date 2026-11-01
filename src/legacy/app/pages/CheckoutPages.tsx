import { useState } from "react";
import {
  CheckCircle, CreditCard, Shield, ChevronLeft, ChevronRight,
  User, MapPin, Calendar, Clock, Smartphone
} from "lucide-react";
import { QRBookingCard } from "../components";

const TIME_SLOTS = ["06:00 AM", "08:00 AM", "10:00 AM", "04:00 PM", "06:00 PM", "08:00 PM"];

const STEP_LABELS = ["Info", "Details", "Consent", "Payment", "Confirmed"];

function StepBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-0 px-6 py-4 bg-white border-b border-[#DFE0D8]">
      {STEP_LABELS.map((label, i) => {
        const num = i + 1;
        const active = num === step;
        const done = num < step;
        return (
          <div key={num} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${done ? "bg-[#FFC400] text-[#17140A]" : active ? "bg-[#FFC400] text-[#17140A] ring-4 ring-[#D6A500]/20" : "bg-[#DFE0D8] text-[#7D8178]"}`}
              >
                {done ? <CheckCircle size={16} /> : num}
              </div>
              <span className={`text-xs font-medium ${active ? "text-[#755900]" : done ? "text-[#755900]" : "text-[#7D8178]"}`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`w-10 h-0.5 mb-4 mx-1 transition-all ${num < step ? "bg-[#FFC400]" : "bg-[#C9CBC2]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CheckoutPage({ type, item, onComplete, onBack }: {
  type: string; item: any; onComplete: (id: string) => void; onBack: () => void;
}) {
  const [step, setStep] = useState(1);

  // Step 1 fields
  const [name, setName] = useState("Arjun Mehta");
  const [email, setEmail] = useState("arjun@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [emergency, setEmergency] = useState("");
  const [address, setAddress] = useState("");
  const [saveInfo, setSaveInfo] = useState(true);

  // Step 2 fields
  const [date, setDate] = useState("2026-07-20");
  const [timeSlot, setTimeSlot] = useState("");
  const [duration, setDuration] = useState("1");

  // Step 3 fields
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeData, setAgreeData] = useState(false);
  const [subscribeNews, setSubscribeNews] = useState(false);

  // Step 4 fields
  const [payMethod, setPayMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");

  // Step 5
  const [bookingId] = useState("BK" + Date.now().toString().slice(-6));

  const titleMap: Record<string, string> = {
    venue: item?.name || "Venue Booking",
    tournament: item?.name || "Tournament Registration",
    training: item?.name || "Training Session",
    game: "Open Game",
  };
  const title = titleMap[type] || item?.name || "Booking";

  const basePrice = item?.price || item?.fee || 500;
  const durationMult = type === "venue" ? parseInt(duration) : 1;
  const base = basePrice * durationMult;
  const platformFee = Math.round(base * 0.05);
  const gst = Math.round(base * 0.18);
  const total = base + platformFee + gst;

  const canNext1 = name.trim() && email.trim() && phone.trim();
  const canNext3 = agreeTerms && agreeData;

  const next = () => setStep(s => Math.min(5, s + 1));
  const back = () => { if (step === 1) onBack(); else setStep(s => s - 1); };

  return (
    <div className="min-h-screen bg-[#F7F7F3] flex flex-col">
      {/* Top nav */}
      <div className="bg-white border-b border-[#DFE0D8] px-6 py-3 flex items-center gap-3">
        <button onClick={back} className="p-2 hover:bg-[#DFE0D8] rounded-lg text-[#5F635C]">
          <ChevronLeft size={18} />
        </button>
        <div>
          <div className="font-semibold text-[#181A1F] text-sm">{title}</div>
          <div className="text-xs text-[#7D8178] capitalize">{type} checkout</div>
        </div>
      </div>

      <StepBar step={step} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-4 py-6 space-y-4">

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-[#DFE0D8] shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <User size={18} className="text-[#755900]" />
                <h2 className="font-semibold text-[#181A1F]">Personal Information</h2>
              </div>
              {[
                { label: "Full Name *", val: name, set: setName, placeholder: "Enter your name" },
                { label: "Email *", val: email, set: setEmail, placeholder: "you@example.com" },
                { label: "Phone *", val: phone, set: setPhone, placeholder: "+91 XXXXX XXXXX" },
                { label: "Emergency Contact", val: emergency, set: setEmergency, placeholder: "Name & phone (optional)" },
                { label: "Address", val: address, set: setAddress, placeholder: "Your address (optional)" },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-medium text-[#464A45] mb-1 block">{f.label}</label>
                  <input
                    value={f.val}
                    onChange={e => f.set(e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full border border-[#C9CBC2] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6A500] transition-colors"
                  />
                </div>
              ))}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={saveInfo} onChange={e => setSaveInfo(e.target.checked)} className="accent-[#D6A500]" />
                <span className="text-sm text-[#464A45]">Save for future bookings</span>
              </label>
            </div>
          )}

          {/* Step 2: Booking Details */}
          {step === 2 && (
            <div className="bg-white rounded-xl border border-[#DFE0D8] shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} className="text-[#755900]" />
                <h2 className="font-semibold text-[#181A1F]">Booking Details</h2>
              </div>

              <div className="p-3 bg-[#F7F7F3] rounded-lg border border-[#DFE0D8]">
                <div className="font-semibold text-[#181A1F] text-sm">{title}</div>
                <div className="text-xs text-[#5F635C] flex items-center gap-1 mt-0.5 capitalize">
                  <MapPin size={11} /> {type} · {item?.location || "Bangalore"}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#464A45] mb-1 block">Select Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full border border-[#C9CBC2] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6A500]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#464A45] mb-2 block">Time Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2 text-sm font-medium rounded-lg border transition-all
                        ${timeSlot === slot ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "border-[#C9CBC2] text-[#464A45] hover:border-[#D6A500] hover:text-[#755900]"}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {type === "venue" && (
                <div>
                  <label className="text-xs font-medium text-[#464A45] mb-2 block">Duration</label>
                  <div className="flex gap-2">
                    {["1", "2", "3"].map(d => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg border transition-all
                          ${duration === d ? "bg-[#FFC400] text-[#17140A] border-[#D6A500]" : "border-[#C9CBC2] text-[#464A45] hover:border-[#D6A500]"}`}
                      >
                        {d} hr
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price breakdown */}
              <div className="bg-sky-50 rounded-lg p-4 border border-sky-100 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#464A45]">
                    {type === "venue" ? `Base price (₹${basePrice} × ${duration}hr)` : "Entry / Session fee"}
                  </span>
                  <span className="font-medium">₹{base.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#464A45]">Platform fee (5%)</span>
                  <span className="font-medium">₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#464A45]">GST (18%)</span>
                  <span className="font-medium">₹{gst}</span>
                </div>
                <div className="border-t border-sky-200 pt-1.5 flex justify-between font-bold text-[#181A1F]">
                  <span>Total</span>
                  <span className="text-[#755900] text-lg">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Consent */}
          {step === 3 && (
            <div className="bg-white rounded-xl border border-[#DFE0D8] shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <Shield size={18} className="text-[#755900]" />
                <h2 className="font-semibold text-[#181A1F]">Rules & Consent</h2>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#30342F] mb-2">Venue & Service Rules</h3>
                <ul className="space-y-2">
                  {[
                    "Players must arrive 10 minutes before the scheduled slot.",
                    "Proper sports footwear is mandatory on the court.",
                    "Food and beverages are not permitted inside the court.",
                    "Cancellations must be made at least 4 hours prior to the slot.",
                    "InspirQ is not liable for personal injuries during play.",
                  ].map((rule, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#464A45]">
                      <CheckCircle size={14} className="text-[#755900] mt-0.5 shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 border-t border-[#DFE0D8] pt-4">
                {[
                  { checked: agreeTerms, set: setAgreeTerms, label: "I agree to the Terms & Cancellation Policy", required: true },
                  { checked: agreeData, set: setAgreeData, label: "I consent to data processing as per the Privacy Policy", required: true },
                  { checked: subscribeNews, set: setSubscribeNews, label: "Subscribe to InspirQ updates and offers", required: false },
                ].map((c, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={c.checked}
                      onChange={e => c.set(e.target.checked)}
                      className="accent-[#D6A500] mt-0.5"
                    />
                    <span className={`text-sm ${c.required ? "text-[#222520] font-medium" : "text-[#5F635C]"}`}>
                      {c.label}
                      {c.required && <span className="text-red-400"> *</span>}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-[#DFE0D8] shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={18} className="text-[#755900]" />
                  <h2 className="font-semibold text-[#181A1F]">Payment</h2>
                </div>

                {/* Payment method tabs */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#DFE0D8] rounded-lg mb-4">
                  {([
                    { id: "upi" as const, label: "UPI", icon: Smartphone },
                    { id: "card" as const, label: "Card", icon: CreditCard },
                    { id: "netbanking" as const, label: "Net Banking", icon: Clock },
                  ]).map(m => (
                    <button
                      key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      className={`flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-medium transition-all
                        ${payMethod === m.id ? "bg-white text-[#755900] shadow-sm" : "text-[#5F635C]"}`}
                    >
                      <m.icon size={15} />
                      {m.label}
                    </button>
                  ))}
                </div>

                {payMethod === "upi" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-[#464A45] mb-1 block">UPI ID</label>
                      <input
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full border border-[#C9CBC2] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6A500]"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Google Pay", "PhonePe", "Paytm", "BHIM"].map(app => (
                        <button key={app} className="text-xs border border-[#C9CBC2] px-3 py-1.5 rounded-lg hover:border-[#D6A500] hover:text-[#755900] transition-colors">{app}</button>
                      ))}
                    </div>
                  </div>
                )}

                {payMethod === "card" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-[#464A45] mb-1 block">Card Number</label>
                      <input placeholder="4242 4242 4242 4242" className="w-full border border-[#C9CBC2] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6A500]" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-[#464A45] mb-1 block">Expiry</label>
                        <input placeholder="MM / YY" className="w-full border border-[#C9CBC2] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6A500]" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#464A45] mb-1 block">CVV</label>
                        <input placeholder="•••" type="password" className="w-full border border-[#C9CBC2] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D6A500]" />
                      </div>
                    </div>
                  </div>
                )}

                {payMethod === "netbanking" && (
                  <div className="grid grid-cols-3 gap-2">
                    {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "Yes Bank"].map(bank => (
                      <button key={bank} className="border border-[#C9CBC2] rounded-lg py-3 text-xs font-medium text-[#30342F] hover:border-[#D6A500] hover:text-[#755900] transition-colors">{bank}</button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-[#7D8178] mt-4">
                  <Shield size={12} />
                  <span>Secured by 256-bit SSL · PCI DSS compliant</span>
                </div>
              </div>

              {/* Booking summary */}
              <div className="bg-white rounded-xl border border-[#DFE0D8] shadow-sm p-5">
                <h3 className="text-sm font-semibold text-[#30342F] mb-3">Booking Summary</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-[#5F635C]">Service</span><span className="font-medium text-[#222520]">{title}</span></div>
                  <div className="flex justify-between"><span className="text-[#5F635C]">Date</span><span className="font-medium text-[#222520]">{date}</span></div>
                  <div className="flex justify-between"><span className="text-[#5F635C]">Time</span><span className="font-medium text-[#222520]">{timeSlot || "—"}</span></div>
                  {type === "venue" && <div className="flex justify-between"><span className="text-[#5F635C]">Duration</span><span className="font-medium text-[#222520]">{duration} hr</span></div>}
                  <div className="border-t border-[#DFE0D8] pt-2 flex justify-between font-bold text-[#181A1F]">
                    <span>Total</span>
                    <span className="text-[#755900]">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <QRBookingCard
              bookingId={bookingId}
              title={title}
              date={date}
              time={timeSlot || "06:00 AM"}
              venue={item?.location || item?.venue || "InspirQ Venue"}
              amount={total}
              onClose={() => onComplete(bookingId)}
            />
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      {step < 5 && (
        <div className="bg-white border-t border-[#DFE0D8] px-6 py-4 flex gap-3">
          {step > 1 && (
            <button
              onClick={back}
              className="flex items-center gap-2 px-5 py-3 border border-[#C9CBC2] rounded-xl text-[#464A45] font-medium hover:bg-[#F7F7F3] transition-colors"
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
          <button
            onClick={step === 4 ? next : next}
            disabled={step === 1 ? !canNext1 : step === 3 ? !canNext3 : false}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#FFC400] text-[#17140A] rounded-xl font-semibold hover:bg-[#D9A900] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 4 ? (
              <><CreditCard size={16} /> Pay ₹{total.toLocaleString()} Now</>
            ) : (
              <>Next <ChevronRight size={16} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
