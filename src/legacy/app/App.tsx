import { useEffect, useState } from "react";
import type { Role, Page } from "./data";
import { NOTIFICATIONS_DATA, CITIES, VENUES, TRAINERS, TOURNAMENTS, OPEN_GAMES } from "./data";
import { Sidebar, NotificationsPanel, Toast } from "./components";
import { LandingPage } from "./pages/Landing";
import { AuthPage } from "./pages/Auth";
import {
  PlayerHome, PlayerBookings, PlayerProfile,
  PlayerWallet, PlayerScorecard, PlayerAchievements,
  PlayerSearch, PlayerInvoices, PlayerBookmarks
} from "./pages/PlayerPages";
import {
  PlayerVenues, PlayerTournaments, PlayerGames, PlayerTraining
} from "./pages/BrowsePages";
import {
  VenueDashboard, VenueBookings, VenueSlots, VenueEquipment,
  VenueRevenue, VenueAnalytics, VenueCustomers, VenuePreBooking,
  VenueCheckIn, VenueBulkBooking
} from "./pages/VenuePages";
import {
  TrainerSchedule, TrainerAttendance, TrainerProfile, TrainerEquipment
} from "./pages/TrainerPages";
import { VenueExpenses, VenueSubscriptions, VenueDataSettings } from "./pages/VenueManagement";
import { TrainerExpenses, TrainerSubscriptions, TrainerDataSettings } from "./pages/TrainerManagement";
import { VenueCommerce, CoachCommerce, OrganizerCommerce } from "./pages/CommerceWorkspace";
import { VenueListWorkflow, TournamentListWorkflow, TrainerSessionsWorkflow } from "./pages/OperationalWorkflows";
import { VenueRevenueAnalyticsPage, TrainerRevenueAnalyticsPage, OrganizerRevenueAnalyticsPage, AdminRevenueAnalyticsPage } from "./pages/RevenueAnalytics";
import { CoachStudentsTable, OrganizerResultsTable, AdminListingsTable, AdminSubscriptionsTable, AdminKYCTable, CoachEnquiriesTable, OrganizerOperationsTable, AdminDisputesTable } from "./pages/RoleTableModules";
import { CoachCommandCenter, CoachProgramsWorkspace } from "./pages/CoachOperations";
import { PlayerSettings } from "./pages/PlayerSettings";
import { CheckoutPage } from "./pages/CheckoutPages";
import {
  OrganizerDashboard, OrganizerRegistrations,
  OrganizerBrackets
} from "./pages/OrganizerPages";
import {
  AdminDashboard, AdminUsers,
  AdminSettings, AdminAttributes, AdminPricing
} from "./pages/AdminPages";
import { WhatsAppMarketing, SupportPage, NotificationsPage, PrivacyPolicyPage, TermsPage, AccountSettings, PaymentBilling, AboutUsPage, HelpCenterPage, CookiePolicyPage, DesignSystemPage } from "./pages/SharedPages";
import { VenueDetailPage, TournamentDetailPage, GameDetailPage, CoachDetailPage } from "./pages/DetailPages";
import { VenueInvoice, TrainerInvoice, OrganizerInvoice } from "./pages/InvoicePages";
import { VenueCodeManagement, CoachCodeManagement, OrganizerCodeManagement, AdminCodeManagement } from "./pages/CodeManagement";
import { CoachOperationsHub, OrganizerOperationsHub } from "./pages/RoleOperationsHub";
import {
  LogOut, Zap, ChevronDown, Menu, Bell,
  LayoutDashboard, Calendar, WalletMinimal as Wallet, User, Settings, CreditCard, Users, Headphones, Bookmark
} from "lucide-react";
import { GlobalHeader, type GlobalHeaderProfileItem } from "./components";

// ─── Shared app-wide state types ───────────────────────────────────────────────
import type { VenueItem, TrainerItem, TournamentItem, GameItem } from "./data";
export type { VenueItem, TrainerItem, TournamentItem, GameItem };

export interface AppData {
  venues: VenueItem[];
  trainers: TrainerItem[];
  tournaments: TournamentItem[];
  games: GameItem[];
  onUpdateVenue: (v: VenueItem) => void;
  onDeleteVenue: (id: number) => void;
  onAddVenue: (v: VenueItem) => void;
  onUpdateTrainer: (t: TrainerItem) => void;
  onUpdateTournament: (t: TournamentItem) => void;
  onDeleteTournament: (id: number) => void;
  onAddTournament: (t: TournamentItem) => void;
  onUpdateGame: (g: GameItem) => void;
  onAddGame: (g: GameItem) => void;
  onDeleteGame: (id: number) => void;
  onAdminUpdateVenue: (v: VenueItem) => void;
  onAdminUpdateTrainer: (t: TrainerItem) => void;
  onAdminUpdateTournament: (t: TournamentItem) => void;
}

const defaultPages: Record<Role, Page> = {
  player: "landing",
  venue: "venue-dashboard",
  trainer: "trainer-dashboard",
  organizer: "organizer-dashboard",
  admin: "admin-dashboard",
  guest: "landing",
};

const playerPages = new Set<Page>([
  "landing", "player-home", "player-search", "player-venues", "player-bookings", "player-tournaments",
  "player-profile", "player-wallet", "player-games", "player-training", "player-scorecard",
  "player-achievements", "player-bookmarks", "player-my-games", "player-invoices", "player-settings",
  "player-checkout", "checkout", "venue-detail", "tournament-detail", "game-detail", "coach-detail",
  "support", "support-tickets", "notifications", "privacy-policy", "terms", "about-us",
  "help-center", "cookie-policy", "account-settings", "payment-billing", "design-system",
]);

const roleLabels: Record<Role, string> = {
  player: "Arjun Mehta", venue: "Court Masters", trainer: "Coach Rajesh",
  organizer: "SportsFest", admin: "Super Admin", guest: "Guest",
};

function renderPageContent(
  currentPage: Page,
  onNavigate: (p: Page, ctx?: any) => void,
  appData: AppData,
  isGuest?: boolean,
  navCtx?: any,
  role?: Role,
  favorites?: Set<number>,
  onToggleFavorite?: (id: number) => void,
) {
  const {
    venues, trainers, tournaments, games,
    onUpdateVenue, onDeleteVenue, onAddVenue,
    onUpdateTrainer,
    onUpdateTournament, onDeleteTournament, onAddTournament,
    onUpdateGame, onAddGame, onDeleteGame,
    onAdminUpdateVenue, onAdminUpdateTrainer, onAdminUpdateTournament,
  } = appData;

  // Only show published + active listings to B2C
  const publishedVenues = venues.filter(v => v.published && v.listingStatus === "active");
  const publishedTrainers = trainers.filter(t => t.published && t.listingStatus === "active");
  const publishedTournaments = tournaments.filter(t => t.published && t.listingStatus === "active");
  const publishedGames = games.filter(g => g.published && g.listingStatus === "active");

  switch (currentPage) {
    case "player-home":         return <PlayerHome onNavigate={onNavigate} />;
    case "player-search":       return <PlayerSearch onNavigate={onNavigate} />;
    case "player-venues":       return <PlayerVenues venues={publishedVenues} onNavigate={onNavigate} isGuest={isGuest} />;
    case "player-bookings":     return <PlayerBookings />;
    case "player-tournaments":  return <PlayerTournaments tournaments={publishedTournaments} onNavigate={onNavigate} isGuest={isGuest} />;
    case "player-profile":      return <PlayerProfile />;
    case "player-wallet":       return <PlayerWallet />;
    case "player-games":        return <PlayerGames games={publishedGames} onNavigate={onNavigate} isGuest={isGuest} onJoinGame={id => onUpdateGame({ ...games.find(g => g.id === id)!, filled: (games.find(g => g.id === id)?.filled ?? 0) + 1 })} />;
    case "player-training":     return <PlayerTraining trainers={publishedTrainers} onNavigate={onNavigate} isGuest={isGuest} />;
    case "player-scorecard":    return <PlayerScorecard />;
    case "player-achievements": return <PlayerAchievements />;
    case "player-bookmarks":    return <PlayerBookmarks onNavigate={onNavigate} />;
    case "player-my-games":     return <PlayerBookings />;
    case "player-invoices":     return <PlayerInvoices onNavigate={onNavigate} />;

    case "venue-detail":        return <VenueDetailPage venue={navCtx} onBack={() => onNavigate("player-venues")} isGuest={isGuest} onNavigate={onNavigate} isFav={favorites?.has(navCtx?.id)} onToggleFav={() => onToggleFavorite?.(navCtx?.id)} />;
    case "tournament-detail":   return <TournamentDetailPage tournament={navCtx} onBack={() => onNavigate("player-tournaments")} isGuest={isGuest} onNavigate={onNavigate} isFav={favorites?.has(navCtx?.id)} onToggleFav={() => onToggleFavorite?.(navCtx?.id)} />;
    case "game-detail":         return <GameDetailPage game={navCtx} onBack={() => onNavigate("player-games")} isGuest={isGuest} onNavigate={onNavigate} isFav={favorites?.has(navCtx?.id)} onToggleFav={() => onToggleFavorite?.(navCtx?.id)} />;
    case "coach-detail":        return <CoachDetailPage coach={navCtx} onBack={() => onNavigate("player-training")} isGuest={isGuest} onNavigate={onNavigate} isFav={favorites?.has(navCtx?.id)} onToggleFav={() => onToggleFavorite?.(navCtx?.id)} />;

    case "venue-dashboard":     return <VenueDashboard />;
    case "venue-list":          return <VenueListWorkflow venues={venues} onUpdateVenue={onUpdateVenue} onDeleteVenue={onDeleteVenue} onAddVenue={onAddVenue} />;
    case "venue-bookings":      return <VenueBookings />;
    case "venue-slots":         return <VenueSlots />;
    case "venue-equipment":
      return <VenueEquipment />;
    case "venue-revenue":
    case "venue-analytics":
    case "venue-analytics-combined": return <VenueRevenueAnalyticsPage />;
    case "venue-customers":     return <VenueCustomers />;
    case "venue-prebooking":    return <VenuePreBooking />;
    case "venue-checkin":       return <VenueCheckIn />;
    case "venue-invoice":       return <VenueInvoice />;
    case "venue-codes":         return <VenueCodeManagement />;
    case "venue-pos":           return <VenueCommerce />;
    case "venue-expenses":      return <VenueExpenses />;
    case "venue-subscriptions": return <VenueSubscriptions />;
    case "venue-data-settings": return <VenueDataSettings />;

    case "trainer-dashboard":      return <CoachOperationsHub />;
    case "trainer-sessions":       return <TrainerSessionsWorkflow />;
    case "trainer-students":       return <CoachStudentsTable />;
    case "trainer-programs":       return <CoachProgramsWorkspace />;
    case "trainer-leads":          return <CoachEnquiriesTable />;
    case "trainer-schedule":       return <TrainerSchedule />;
    case "trainer-attendance":     return <TrainerAttendance />;
    case "trainer-revenue":        return <TrainerRevenueAnalyticsPage />;
    case "trainer-profile":        return <TrainerProfile trainer={trainers[0]} onUpdateTrainer={onUpdateTrainer} />;
    case "trainer-invoice":        return <TrainerInvoice />;
    case "trainer-codes":          return <CoachCodeManagement />;
    case "trainer-equipment":      return <TrainerEquipment />;
    case "trainer-pos":            return <CoachCommerce />;
    case "trainer-expenses":       return <TrainerExpenses />;
    case "trainer-subscriptions":  return <TrainerSubscriptions />;
    case "trainer-data-settings":  return <TrainerDataSettings />;
    case "trainer-sessions-list":  return <TrainerSessionsWorkflow />;

    case "organizer-dashboard":     return <OrganizerOperationsHub />;
    case "organizer-tournaments":   return <TournamentListWorkflow tournaments={tournaments} onAddTournament={onAddTournament} onUpdateTournament={onUpdateTournament} onDeleteTournament={onDeleteTournament} />;
    case "organizer-operations":     return <OrganizerOperationsTable />;
    case "organizer-registrations": return <OrganizerRegistrations />;
    case "organizer-brackets":      return <OrganizerBrackets />;
    case "organizer-scorecard":     return <OrganizerResultsTable />;
    case "organizer-analytics":
    case "organizer-revenue":       return <OrganizerRevenueAnalyticsPage />;
    case "organizer-invoice":       return <OrganizerInvoice />;
    case "organizer-codes":         return <OrganizerCodeManagement />;
    case "organizer-pos":           return <OrganizerCommerce />;

    case "admin-dashboard":     return <AdminDashboard />;
    case "admin-users":         return <AdminUsers />;
    case "admin-venues":        return <AdminListingsTable venues={venues} trainers={trainers} tournaments={tournaments} onUpdateVenue={onAdminUpdateVenue} onUpdateTrainer={onAdminUpdateTrainer} onUpdateTournament={onAdminUpdateTournament} />;
    case "admin-revenue":       return <AdminRevenueAnalyticsPage />;
    case "admin-subscriptions": return <AdminSubscriptionsTable />;
    case "admin-kyc":           return <AdminKYCTable />;
    case "admin-disputes":      return <AdminDisputesTable />;
    case "admin-settings":      return <AdminSettings />;
    case "admin-attributes":    return <AdminAttributes />;
    case "admin-pricing":       return <AdminPricing />;
    case "admin-codes":         return <AdminCodeManagement />;

    case "player-settings":     return <PlayerSettings />;
    case "player-checkout":     return <CheckoutPage type="venue" item={navCtx} onComplete={() => onNavigate("player-bookings")} onBack={() => onNavigate("player-venues")} />;
    case "checkout":            return <CheckoutPage type={navCtx?.type || "venue"} item={navCtx?.item} onComplete={() => onNavigate("player-bookings")} onBack={() => onNavigate(navCtx?.backTo || "player-venues")} />;
    case "support":             return <SupportPage />;
    case "support-tickets":     return <SupportPage />;
    case "notifications":       return <NotificationsPage />;
    case "privacy-policy":      return <PrivacyPolicyPage />;
    case "terms":               return <TermsPage />;
    case "about-us":            return <AboutUsPage onNavigate={onNavigate} />;
    case "help-center":         return <HelpCenterPage onNavigate={onNavigate} />;
    case "cookie-policy":       return <CookiePolicyPage />;
    case "account-settings":    return <AccountSettings />;
    case "payment-billing":     return <PaymentBilling />;
    case "design-system":       return <DesignSystemPage onNavigate={onNavigate} />;
    default: return (
      <div className="flex items-center justify-center h-64 text-[#7D8178]">
        <div className="text-center"><div className="text-4xl mb-3">🚧</div><p className="font-medium">Page coming soon</p></div>
      </div>
    );
  }
}

const PROFILE_MENU: GlobalHeaderProfileItem[] = [
  { label: "Dashboard",        page: "player-home"        as Page, icon: LayoutDashboard },
  { label: "My Bookings",      page: "player-bookings"    as Page, icon: Calendar },
  { label: "Bookmarks",        page: "player-bookmarks"   as Page, icon: Bookmark },
  { label: "Wallet",           page: "player-wallet"      as Page, icon: Wallet },
  { label: "Profile",          page: "player-profile"     as Page, icon: User },
  { label: "Settings",         page: "player-settings"    as Page, icon: Settings },
  { label: "Support",          page: "support-tickets"    as Page, icon: Headphones },
];

function PlayerShell({
  currentPage, onNavigate, onLogout, navCtx, appData, favorites, onToggleFavorite,
}: {
  currentPage: Page; onNavigate: (p: Page, ctx?: any) => void; onLogout: () => void; navCtx?: any; appData: AppData;
  favorites: Set<number>; onToggleFavorite: (id: number) => void;
}) {
  const unreadCount = NOTIFICATIONS_DATA.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F7F7F3]">
      <GlobalHeader
        currentPage={currentPage}
        onNavigate={onNavigate}
        isLoggedIn={true}
        onLogout={onLogout}
        userName="Arjun Mehta"
        userEmail="arjun@example.com"
        userInitial="A"
        unreadNotifications={unreadCount}
        profileMenuItems={PROFILE_MENU}
        coinBalance={1240}
      />
      <main className="app-workspace w-full">{renderPageContent(currentPage, onNavigate, appData, false, navCtx, "player", favorites, onToggleFavorite)}</main>
    </div>
  );
}

const PUBLIC_BROWSE_PAGES: Page[] = ["player-venues", "player-training", "player-tournaments"];

function GuestBrowseShell({ currentPage, onNavigate, navCtx, isGuest, appData, favorites, onToggleFavorite }: {
  currentPage: Page; onNavigate: (p: Page, ctx?: any) => void; navCtx?: any; isGuest?: boolean; appData: AppData;
  favorites?: Set<number>; onToggleFavorite?: (id: number) => void;
}) {
  return (
    <div className="min-h-screen bg-[#F7F7F3]">
      <GlobalHeader currentPage={currentPage} onNavigate={onNavigate} isLoggedIn={false} />
      {isGuest && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 text-center">
          <span className="text-xs text-amber-800">
            You&apos;re browsing as a guest.{" "}
            <button onClick={() => onNavigate("auth")} className="font-bold text-[#755900] underline underline-offset-2 hover:no-underline">Sign up free</button>
            {" "}to book, join games &amp; earn rewards!
          </span>
        </div>
      )}
      <main className="app-workspace w-full">{renderPageContent(currentPage, onNavigate, appData, isGuest ?? true, navCtx, "guest", favorites, onToggleFavorite)}</main>
    </div>
  );
}

function DashboardShell({
  role, currentPage, onNavigate, onLogout, navCtx, appData, favorites, onToggleFavorite,
}: {
  role: Role; currentPage: Page; onNavigate: (p: Page, ctx?: any) => void; onLogout: () => void; navCtx?: any; appData: AppData;
  favorites?: Set<number>; onToggleFavorite?: (id: number) => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const unreadCount = NOTIFICATIONS_DATA.filter(n => !n.read).length;

  const roleProfilePages: Record<Role, Page> = {
    venue: "venue-list", trainer: "trainer-profile",
    organizer: "organizer-dashboard", admin: "admin-settings",
    player: "player-profile", guest: "landing",
  };
  const roleEmails: Record<Role, string> = {
    venue: "hello@courtmasters.com", trainer: "coach.rajesh@gmail.com",
    organizer: "events@sportsfest.in", admin: "admin@inspirq.com",
    player: "arjun@example.com", guest: "",
  };
  const currentLabel = currentPage
    .replace(`${role}-`, "")
    .replaceAll("-", " ")
    .replace(/\b\w/g, character => character.toUpperCase());

  const handleNavigate = (page: Page, ctx?: any) => {
    onNavigate(page, ctx);
    setSidebarOpen(false);
    setShowNotifications(false);
    setProfileOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#F7F7F3] overflow-hidden">
      <div className="hidden lg:flex h-full shrink-0">
        <Sidebar role={role} currentPage={currentPage} onNavigate={handleNavigate} onLogout={onLogout} />
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative h-full shadow-xl">
            <Sidebar role={role} currentPage={currentPage} onNavigate={handleNavigate} onLogout={onLogout} />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-[4.5rem] bg-white/95 backdrop-blur-xl border-b border-[#DFE0D8] px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
          <button aria-label="Open navigation" onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-[#5F635C] hover:bg-[#FFF9D6] rounded-lg"><Menu size={20} /></button>
          <div className="hidden sm:block">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-[#7D8178]">{role === "trainer" ? "Coach" : role === "organizer" ? "Organiser" : role} workspace</div>
            <div className="font-['Lexend'] text-base font-semibold text-[#181A1F]">{currentLabel}</div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <button aria-label="Open notifications" aria-expanded={showNotifications} onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-[#5F635C] hover:bg-[#DFE0D8] rounded-md transition-colors">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">{unreadCount}</span>
                )}
              </button>
              {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}
            </div>
            <div className="relative">
              <button aria-label="Open profile menu" aria-expanded={profileOpen} onClick={() => { setProfileOpen(v => !v); setShowNotifications(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#DFE0D8] transition-colors">
                <div className="w-7 h-7 bg-[#FFC400]/20 rounded-full flex items-center justify-center text-[#755900] text-sm font-bold">{roleLabels[role][0]}</div>
                <span className="hidden sm:block text-sm font-medium text-[#30342F] max-w-[110px] truncate">{roleLabels[role]}</span>
                <ChevronDown size={13} className={`hidden sm:block text-[#7D8178] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-md shadow-lg border border-[#DFE0D8] py-1 z-50">
                  <div className="px-4 py-2.5 border-b border-[#F7F7F3]">
                    <div className="text-sm font-semibold text-[#181A1F]">{roleLabels[role]}</div>
                    <div className="text-xs text-[#7D8178]">{roleEmails[role]}</div>
                  </div>
                  <button onClick={() => handleNavigate(roleProfilePages[role])}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#30342F] hover:bg-[#F7F7F3] transition-colors text-left">
                    <User size={15} className="text-[#7D8178]" /> My Profile
                  </button>
                  {role === "venue" && (
                    <button onClick={() => handleNavigate("venue-expenses")}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#30342F] hover:bg-[#F7F7F3] transition-colors text-left">
                      <Wallet size={15} className="text-[#7D8178]" /> Wallet & Expenses
                    </button>
                  )}
                  {role === "trainer" && (
                    <button onClick={() => handleNavigate("trainer-expenses")}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#30342F] hover:bg-[#F7F7F3] transition-colors text-left">
                      <Wallet size={15} className="text-[#7D8178]" /> Wallet & Expenses
                    </button>
                  )}
                  <button onClick={() => handleNavigate("account-settings")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#30342F] hover:bg-[#F7F7F3] transition-colors text-left">
                    <Settings size={15} className="text-[#7D8178]" /> Settings
                  </button>
                  <button onClick={() => handleNavigate("payment-billing")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#30342F] hover:bg-[#F7F7F3] transition-colors text-left">
                    <CreditCard size={15} className="text-[#7D8178]" /> Payment &amp; Billing
                  </button>
                  <button onClick={() => handleNavigate("support-tickets")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#30342F] hover:bg-[#F7F7F3] transition-colors text-left">
                    <Headphones size={15} className="text-[#7D8178]" /> Support
                  </button>
                  <div className="border-t border-[#DFE0D8] mt-1 pt-1">
                    <button onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="app-workspace flex-1 overflow-y-auto">
          {renderPageContent(currentPage, handleNavigate, appData, false, navCtx, role, favorites, onToggleFavorite)}
        </main>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState<Role>("guest");
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [navCtx, setNavCtx] = useState<any>(null);

  // ─── Shared mutable data state ─────────────────────────────────────────────
  const [venues, setVenues] = useState(VENUES);
  const [trainers, setTrainers] = useState(TRAINERS);
  const [tournaments, setTournaments] = useState(TOURNAMENTS);
  const [games, setGames] = useState(OPEN_GAMES);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const onToggleFavorite = (id: number) => setFavorites(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const appData: AppData = {
    venues,
    trainers,
    tournaments,
    games,
    onUpdateVenue: (v) => setVenues(prev => prev.map(x => x.id === v.id ? v : x)),
    onDeleteVenue: (id) => setVenues(prev => prev.filter(x => x.id !== id)),
    onAddVenue: (v) => setVenues(prev => [...prev, v]),
    onUpdateTrainer: (t) => setTrainers(prev => prev.map(x => x.id === t.id ? t : x)),
    onUpdateTournament: (t) => setTournaments(prev => prev.map(x => x.id === t.id ? t : x)),
    onDeleteTournament: (id) => setTournaments(prev => prev.filter(x => x.id !== id)),
    onAddTournament: (t) => setTournaments(prev => [...prev, t]),
    onUpdateGame: (g) => setGames(prev => prev.map(x => x.id === g.id ? g : x)),
    onAddGame: (g) => setGames(prev => [...prev, g]),
    onDeleteGame: (id) => setGames(prev => prev.filter(x => x.id !== id)),
    // Admin can update any entity's listingStatus / featured
    onAdminUpdateVenue: (v) => setVenues(prev => prev.map(x => x.id === v.id ? v : x)),
    onAdminUpdateTrainer: (t) => setTrainers(prev => prev.map(x => x.id === t.id ? t : x)),
    onAdminUpdateTournament: (t) => setTournaments(prev => prev.map(x => x.id === t.id ? t : x)),
  };

  const handleLogin = (r: Role) => { setRole(r); setCurrentPage(defaultPages[r]); setNavCtx(null); };
  const handleLogout = () => { void import("next-auth/react").then(({ signOut }) => signOut({ redirect: false })); setRole("guest"); setCurrentPage("landing"); setNavCtx(null); };
  const handleNavigate = (page: Page, ctx?: any) => { setCurrentPage(page); setNavCtx(ctx ?? null); };

  useEffect(() => {
    void import("next-auth/react")
      .then(({ getSession }) => getSession())
      .then((session) => {
        const sessionRole = (session as { user?: { role?: Role } } | null)?.user?.role;
        if (sessionRole) handleLogin(sessionRole);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (role === "player" && !playerPages.has(currentPage)) {
      setCurrentPage("player-home");
      setNavCtx(null);
    }
  }, [currentPage, role]);

  const DETAIL_PAGES: Page[] = ["venue-detail", "tournament-detail", "game-detail", "coach-detail"];

  if (role === "guest") {
    if (currentPage === "auth") return <AuthPage onLogin={handleLogin} />;
    if (PUBLIC_BROWSE_PAGES.includes(currentPage) || DETAIL_PAGES.includes(currentPage)) {
      return <GuestBrowseShell currentPage={currentPage} onNavigate={handleNavigate} navCtx={navCtx} isGuest={true} appData={appData} favorites={favorites} onToggleFavorite={onToggleFavorite} />;
    }
    if (["about-us", "help-center", "cookie-policy", "privacy-policy", "terms", "design-system", "support", "support-tickets", "notifications"].includes(currentPage)) {
      return <GuestBrowseShell currentPage={currentPage} onNavigate={handleNavigate} navCtx={navCtx} isGuest={false} appData={appData} favorites={favorites} onToggleFavorite={onToggleFavorite} />;
    }
    return <LandingPage onNavigate={handleNavigate} />;
  }

  if (role === "player") {
    if (currentPage === "landing") {
      return <LandingPage onNavigate={handleNavigate} isLoggedIn onLogout={handleLogout} profileMenuItems={PROFILE_MENU} />;
    }
    return <PlayerShell currentPage={currentPage} onNavigate={handleNavigate} onLogout={handleLogout} navCtx={navCtx} appData={appData} favorites={favorites} onToggleFavorite={onToggleFavorite} />;
  }

  return (
    <DashboardShell role={role} currentPage={currentPage} onNavigate={handleNavigate} onLogout={handleLogout} navCtx={navCtx} appData={appData} favorites={favorites} onToggleFavorite={onToggleFavorite} />
  );
}
