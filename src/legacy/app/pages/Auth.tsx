import { useEffect, useState } from "react";
import { ArrowLeft, Building2, Check, CheckCircle2, ChevronDown, GraduationCap, KeyRound, Loader2, Mail, Phone, ShieldCheck, Trophy, Users, Zap } from "lucide-react";
import type { Role } from "../data";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";

type IntegrationConfig = { google: boolean; facebook: boolean; otp: boolean };
type AuthMode = "login" | "signup";
type OtpStep = "identify" | "verify";

const roles: { id: Role; label: string; icon: React.ElementType; description: string }[] = [
  { id: "player", label: "Player", icon: Users, description: "Book and play" },
  { id: "venue", label: "Venue owner", icon: Building2, description: "Manage arenas" },
  { id: "trainer", label: "Coach", icon: GraduationCap, description: "Train athletes" },
  { id: "organizer", label: "Organiser", icon: Trophy, description: "Run events" },
];

const DEMO_ACCOUNTS = [
  { role: "player" as Role, label: "Player", email: "player@inspirq.demo", password: "Play@123" },
  { role: "venue" as Role, label: "Venue owner", email: "venue@inspirq.demo", password: "Venue@123" },
  { role: "trainer" as Role, label: "Coach", email: "coach@inspirq.demo", password: "Coach@123" },
  { role: "organizer" as Role, label: "Organiser", email: "organiser@inspirq.demo", password: "Event@123" },
];

export function AuthPage({ onLogin }: { onLogin: (role: Role) => void }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [step, setStep] = useState<OtpStep>("identify");
  const [selectedRole, setSelectedRole] = useState<Role>("player");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [demoEmail, setDemoEmail] = useState("");
  const [demoPassword, setDemoPassword] = useState("");
  const [showDemoAccess, setShowDemoAccess] = useState(false);
  const [config, setConfig] = useState<IntegrationConfig>({ google: false, facebook: false, otp: false });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth/config").then((response) => response.json()).then(setConfig).catch(() => undefined);
  }, []);

  const sendCode = async () => {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/otp/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to send code.");
      setStep("verify");
      setMessage(`A 6-digit code was sent to ${identifier}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send code.");
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async () => {
    setBusy(true);
    setMessage("");
    const { signIn } = await import("next-auth/react");
    const result = await signIn("credentials", {
      identifier,
      code,
      name,
      role: selectedRole,
      redirect: false,
    });
    setBusy(false);
    if (result?.error) {
      setMessage("That code is invalid or expired. Request a new code and try again.");
      return;
    }
    onLogin(selectedRole);
  };

  const socialLogin = async (provider: "google" | "facebook") => {
    if (!config[provider]) {
      setMessage(`${provider === "google" ? "Google" : "Facebook"} setup is ready and waiting for credentials.`);
      return;
    }
    const { signIn } = await import("next-auth/react");
    await signIn(provider, { redirectTo: "/" });
  };

  const demoLogin = () => {
    const account = DEMO_ACCOUNTS.find((item) => item.email === demoEmail.trim().toLowerCase() && item.password === demoPassword);
    if (!account) {
      setMessage("Demo email or password is incorrect. Use one of the credentials shown below.");
      return;
    }
    setMessage("");
    onLogin(account.role);
  };

  return (
    <div className="grid min-h-screen bg-[#F5F6F8] lg:grid-cols-[minmax(24rem,0.85fr)_minmax(32rem,1.15fr)]">
      <div className="relative hidden overflow-hidden bg-[#101828] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[#FFC400]/15 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#FFC400] text-[#17140A]"><Zap /></div>
            <div className="text-xl font-bold">InspirQ Sport</div>
          </div>
          <div className="mt-24 max-w-lg">
            <div className="text-5xl font-bold leading-[1.08] tracking-[-0.035em]">Your sport.<br /><span className="text-[#FFC400]">One place.</span></div>
            <div className="mt-6 max-w-md text-base leading-7 text-white/70">Book, compete, coach, and manage every part of your sporting life with one secure account.</div>
            <div className="mt-10 space-y-4">
              {["Instant access to verified venues", "A workspace tailored to your role", "Secure sign-in across every device"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="flex size-6 items-center justify-center rounded-full bg-white/10 text-[#FFC400]"><Check className="size-3.5" /></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative flex items-center gap-3 border-t border-white/10 pt-6 text-xs text-white/50">
          <ShieldCheck className="size-4 text-[#FFC400]" />
          Protected by secure sessions and provider verification
        </div>
      </div>

      <div className="flex items-center justify-center p-5 sm:p-10 xl:p-16">
        <div className="w-full max-w-lg">
          <div className="mb-10 lg:hidden">
            <div className="flex items-center gap-2 text-xl font-bold"><div className="flex size-9 items-center justify-center rounded-lg bg-[#FFC400] text-[#17140A]"><Zap className="size-5" /></div>InspirQ Sport</div>
          </div>

          <div className="rounded-3xl border border-[#D0D5DD] bg-white p-6 shadow-xl shadow-[#101828]/[0.06] sm:p-9">
            {step === "verify" ? (
              <>
                <Button variant="ghost" className="-ml-3 mb-4" onClick={() => { setStep("identify"); setCode(""); setMessage(""); }}><ArrowLeft /> Change email or mobile</Button>
                <div className="text-3xl font-bold tracking-tight text-[#101828]">Verify your code</div>
                <div className="mt-2 text-sm text-[#5F635C]">Enter the code sent to <span className="font-semibold text-[#222520]">{identifier}</span>.</div>
                <div className="mt-7 space-y-3">
                  <Label>6-digit verification code</Label>
                  <InputOTP maxLength={6} value={code} onChange={setCode}>
                    <InputOTPGroup className="w-full">
                      {[0, 1, 2, 3, 4, 5].map((index) => <InputOTPSlot key={index} index={index} className="h-12 flex-1" />)}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {message && <div className="mt-4 rounded-lg bg-[#F7F7F3] p-3 text-sm text-[#5F635C]">{message}</div>}
                <Button className="mt-6 w-full bg-[#FFC400] hover:bg-[#D9A900]" size="lg" disabled={busy || code.length !== 6} onClick={verifyCode}>{busy && <Loader2 className="animate-spin" />} Verify & continue</Button>
                <Button variant="ghost" className="mt-2 w-full text-[#755900]" disabled={busy} onClick={sendCode}>Resend code</Button>
              </>
            ) : (
              <>
                <div className="flex rounded-xl bg-[#F2F4F7] p-1">
                  <Button className="flex-1" variant={mode === "login" ? "default" : "ghost"} onClick={() => setMode("login")}>Log in</Button>
                  <Button className="flex-1" variant={mode === "signup" ? "default" : "ghost"} onClick={() => setMode("signup")}>Create account</Button>
                </div>
                <div className="mt-8 text-3xl font-bold tracking-tight text-[#101828]">{mode === "login" ? "Welcome back" : "Create your account"}</div>
                <div className="mt-2 text-sm text-[#5F635C]">{mode === "login" ? "Choose a secure sign-in method to continue." : "Create one account for playing, coaching, venues, or events."}</div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Button variant="outline" size="lg" onClick={() => socialLogin("google")}><span className="font-bold text-[#4285F4]">G</span> Continue with Google</Button>
                  <Button variant="outline" size="lg" onClick={() => socialLogin("facebook")}><span className="font-bold text-[#1877F2]">f</span> Continue with Facebook</Button>
                </div>

                <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-[#DFE0D8]" /><span className="text-xs font-medium uppercase tracking-wider text-[#7D8178]">or use OTP</span><div className="h-px flex-1 bg-[#DFE0D8]" /></div>

                {mode === "signup" && (
                  <div className="mb-5 space-y-2">
                    <Label htmlFor="auth-name">Full name</Label>
                    <Input id="auth-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="auth-identifier">Email or mobile number</Label>
                  <div className="relative">
                    {identifier.includes("@") ? <Mail className="absolute left-3 top-2.5 size-4 text-[#7D8178]" /> : <Phone className="absolute left-3 top-2.5 size-4 text-[#7D8178]" />}
                    <Input id="auth-identifier" className="pl-9" value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="name@email.com or +91 98765 43210" />
                  </div>
                  <div className="text-xs text-[#7D8178]">Use international format with country code for mobile numbers.</div>
                </div>

                {mode === "signup" && (
                  <div className="mt-5">
                    <Label>Choose your workspace</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {roles.map(({ id, label, icon: Icon, description }) => (
                        <Button key={id} variant={selectedRole === id ? "default" : "outline"} className="h-auto justify-start py-3 text-left" onClick={() => setSelectedRole(id)}>
                          <Icon className="size-4" /><span><span className="block">{label}</span><span className="block text-xs font-normal opacity-70">{description}</span></span>
                          {selectedRole === id && <CheckCircle2 className="ml-auto size-4" />}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {message && <div className="mt-4 rounded-lg bg-[#F7F7F3] p-3 text-sm text-[#5F635C]">{message}</div>}
                <Button className="mt-6 w-full bg-[#FFC400] hover:bg-[#D9A900]" size="lg" disabled={busy || !identifier.trim() || (mode === "signup" && !name.trim())} onClick={sendCode}>{busy && <Loader2 className="animate-spin" />} Send verification code</Button>

                {!config.google && !config.facebook && !config.otp && (
                  <div className="mt-5 rounded-lg border border-dashed border-[#C9CBC2] bg-[#F7F7F3] p-3 text-center text-xs text-[#5F635C]">Authentication template ready. Provider credentials can be connected when the app is ready.</div>
                )}
              </>
            )}
          </div>

          {mode === "login" && step === "identify" && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#D0D5DD] bg-white">
              <Button variant="ghost" className="h-14 w-full justify-between rounded-none px-5 text-[#344054]" onClick={() => setShowDemoAccess(value => !value)} aria-expanded={showDemoAccess}>
                <span className="flex items-center gap-2"><KeyRound className="size-4 text-[#755900]" /> Preview a demo workspace</span>
                <ChevronDown className={`size-4 transition-transform ${showDemoAccess ? "rotate-180" : ""}`} />
              </Button>
              {showDemoAccess && (
                <div className="border-t border-[#EAECF0] bg-[#F9FAFB] p-5">
                  <p className="text-xs leading-5 text-[#667085]">Choose a role to fill the preview credentials, then open its workspace.</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {DEMO_ACCOUNTS.map((account) => (
                      <Button key={account.email} variant="outline" className="h-auto justify-start bg-white px-3 py-2.5 text-left" onClick={() => { setDemoEmail(account.email); setDemoPassword(account.password); }}>
                        <span><span className="block text-xs font-semibold">{account.label}</span><span className="block max-w-36 truncate text-xs font-normal text-[#667085]">{account.email}</span></span>
                      </Button>
                    ))}
                  </div>
                  {(demoEmail || demoPassword) && (
                    <div className="mt-3 rounded-xl border border-[#D0D5DD] bg-white p-3">
                      <div className="truncate text-xs font-medium text-[#344054]">{demoEmail}</div>
                      <Button className="mt-3 w-full bg-[#FFC400] hover:bg-[#D9A900]" disabled={!demoEmail || !demoPassword} onClick={demoLogin}>Open demo workspace</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="mt-5 text-center text-xs text-[#667085]">Secure sign-in · Role-based access · No shared passwords</div>
        </div>
      </div>
    </div>
  );
}
