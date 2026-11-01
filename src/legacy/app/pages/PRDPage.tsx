import { useState, useMemo, Fragment } from "react";
import { Search, Download, FileSpreadsheet, Filter, ChevronUp, ChevronDown, X } from "lucide-react";
import * as XLSX from "xlsx";

// ─── Types ────────────────────────────────────────────────────────────────────
type BizType = "B2C" | "B2B" | "Internal" | "B2C + B2B";
type Priority = "P0 – Critical" | "P1 – High" | "P2 – Medium" | "P3 – Low";
type Status = "Live" | "Partial" | "Planned" | "Backlog";

interface PRDRow {
  sno: number;
  pageName: string;
  module: string;
  functionality: string;
  description: string;
  bizType: BizType;
  dataModel: string;
  dataValues: string;
  edgeCases: string;
  priority: Priority;
  status: Status;
}

// ─── Colour maps ──────────────────────────────────────────────────────────────
const BIZ_COLOR: Record<BizType, string> = {
  "B2C":       "bg-sky-50 text-sky-700 border-sky-200",
  "B2B":       "bg-blue-50 text-blue-700 border-blue-200",
  "Internal":  "bg-red-50 text-red-700 border-red-200",
  "B2C + B2B": "bg-purple-50 text-purple-700 border-purple-200",
};
const PRI_COLOR: Record<Priority, string> = {
  "P0 – Critical": "bg-red-50 text-red-700 border-red-200",
  "P1 – High":     "bg-orange-50 text-orange-700 border-orange-200",
  "P2 – Medium":   "bg-yellow-50 text-yellow-700 border-yellow-200",
  "P3 – Low":      "bg-[#F7F7F3] text-[#5F635C] border-[#C9CBC2]",
};
const STA_COLOR: Record<Status, string> = {
  "Live":    "bg-sky-50 text-sky-700 border-sky-200",
  "Partial": "bg-amber-50 text-amber-700 border-amber-200",
  "Planned": "bg-blue-50 text-blue-700 border-blue-200",
  "Backlog": "bg-[#F7F7F3] text-[#5F635C] border-[#C9CBC2]",
};
const STA_DOT: Record<Status, string> = {
  "Live": "bg-sky-500", "Partial": "bg-amber-500",
  "Planned": "bg-blue-500", "Backlog": "bg-[#7D8178]",
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLAYER  (B2C)
// ═══════════════════════════════════════════════════════════════════════════════
const PLAYER_ROWS: PRDRow[] = [
  {
    sno: 1, pageName: "Auth – Login / Register", module: "Authentication", priority: "P0 – Critical", status: "Live", bizType: "B2C",
    functionality: "Email & phone login, OTP verification, role selection (Player/Venue/Trainer/Organizer), social login placeholders, password reset",
    description: "Single entry point for all users. Player selects role at registration. Supports both OTP and password flows.",
    dataModel: "User",
    dataValues: "Full Name · Email Address · Phone Number · Password / OTP · Role (dropdown) · City (dropdown) · Referral Code (optional) · Profile Photo URL · Created At",
    edgeCases: "Duplicate email → toast error; Wrong OTP → 3-retry limit then 60 s lockout; Unverified email → resend link; Expired session → redirect to login; Role mismatch token → force logout",
  },
  {
    sno: 2, pageName: "About Us", module: "Legal & Marketing", priority: "P3 – Low", status: "Live", bizType: "B2C",
    functionality: "Static company story, mission, team section, social links, contact CTA",
    description: "Informational page for brand credibility. Crawlable for SEO.",
    dataModel: "Static Content",
    dataValues: "Company Name · Mission Statement · Founded Year · Team Members (Name, Role, Photo) · Social Links · Contact Email · Office Address",
    edgeCases: "SEO meta tags required; External links open in new tab; Mobile-responsive images",
  },
  {
    sno: 3, pageName: "Achievements & Badges", module: "Gamification", priority: "P2 – Medium", status: "Live", bizType: "B2C",
    functionality: "Badge grid (earned vs locked), rarity tiers, leaderboard by city/sport, streak counter, share badge CTA",
    description: "Drives player retention via gamification. Earned badges unlock discounts and profile flair.",
    dataModel: "Badge · Leaderboard",
    dataValues: "Badge: S.No · Badge Name · Icon · Description · Rarity (Common/Uncommon/Rare/Epic/Legendary) · Earned (Y/N) · Earned Date\nLeaderboard: Rank · Player Name · City · Favourite Sport · InspirQ Coins · Badge",
    edgeCases: "Badge awarded async (background job) → confetti on next login; Tie in leaderboard → sub-rank by recency; Locked badge tooltip shows unlock condition",
  },
  {
    sno: 4, pageName: "Advanced Search", module: "Discovery", priority: "P2 – Medium", status: "Live", bizType: "B2C",
    functionality: "Cross-entity search across venues, games, coaches, tournaments. Unified result cards with type labels.",
    description: "Power-search for users who know what they want. Returns mixed entity results with relevance ranking.",
    dataModel: "VenueItem · GameItem · TournamentItem · TrainerItem",
    dataValues: "Query String · Entity Type Filter · City Filter · Sport Filter · Price Range · Date Range\nResults: Entity Type · Name · Sport · Location/Date · Rating · Price · Action (Book/Join/Register)",
    edgeCases: "Empty query → show trending; Special chars → sanitise; Non-published listings excluded; Zero results → suggest similar",
  },
  {
    sno: 5, pageName: "Checkout / Payment", module: "Payments", priority: "P0 – Critical", status: "Live", bizType: "B2C",
    functionality: "Order summary, payment method selector (UPI/Card/NetBanking/Wallet), InspirQ Coins discount, GST display, confirm & pay",
    description: "Final step of booking funnel. Must handle multiple payment methods and partial wallet usage.",
    dataModel: "BookingItem · PaymentItem",
    dataValues: "Order: Venue/Game/Tournament Name · Date · Time · Duration · Base Amount (₹) · GST (%) · Coins Discount (₹) · Total Payable (₹)\nPayment: Method (UPI/Card/NetBanking/Wallet) · UPI ID / Card Last 4 · Txn ID · Payment Status · Timestamp",
    edgeCases: "Gateway timeout → rollback booking; Slot taken between view and pay → conflict error; Partial wallet + UPI combo; International card declined → suggest domestic; GST recalculation on discount",
  },
  {
    sno: 6, pageName: "Coach Detail", module: "Training", priority: "P1 – High", status: "Live", bizType: "B2C",
    functionality: "Coach bio, certifications, specialisations, student count, ratings & reviews, available slots, book session CTA",
    description: "Deep-dive profile page for a specific trainer. Builds trust before booking.",
    dataModel: "TrainerItem · SessionItem",
    dataValues: "Trainer Name · Sport · Experience (years) · Certification · Rating · Total Students · Fee (₹/hr) · Location · Bio · Specialisations (tags) · Available Slots (Date + Time) · Reviews (Reviewer, Rating, Comment, Date)",
    edgeCases: "No available slots this week → next available week shown; Trainer pauses calendar → 'On Break' badge; Trainer unverified → no 'Verified' badge",
  },
  {
    sno: 7, pageName: "Coaches / Find Training", module: "Discovery + Training", priority: "P1 – High", status: "Live", bizType: "B2C",
    functionality: "Ranked coach directory, filter by sport/price/rating/certification, list view, book trial CTA",
    description: "Browse all certified coaches. Key player acquisition page for training upsell.",
    dataModel: "TrainerItem",
    dataValues: "S.No · Trainer Name · Sport · Rating · Experience · Certification · Fee (₹/hr) · Location · Students Count · Verified Badge · Action (View Profile / Book)",
    edgeCases: "Trainer delists mid-browse → show 'Unavailable'; Free first session offer → show 'Free Trial' chip; No trainers for sport → empty state with CTA",
  },
  {
    sno: 8, pageName: "Cookie Policy", module: "Legal", priority: "P3 – Low", status: "Live", bizType: "B2C",
    functionality: "Static page listing cookie types, retention periods, opt-out instructions",
    description: "Legal compliance page. Required for GDPR / Indian IT Act compliance.",
    dataModel: "Static Content",
    dataValues: "Cookie Name · Type (Essential/Analytics/Marketing) · Purpose · Retention Period · Third-Party Provider",
    edgeCases: "GDPR: banner must link here; Cookie preferences saved to localStorage; Page must be crawlable",
  },
  {
    sno: 9, pageName: "Dashboard / Player Home", module: "Overview", priority: "P0 – Critical", status: "Live", bizType: "B2C",
    functionality: "Personalised home: upcoming bookings, quick-access tiles (Venues/Games/Tournaments/Coaches), active open games, coin balance, streak, recent activity",
    description: "Post-login landing page. Drives daily engagement and re-booking.",
    dataModel: "BookingItem · GameItem · Badge · Notification",
    dataValues: "Player Name · InspirQ Coins · Booking Streak (days) · Upcoming Bookings (Venue, Date, Time, Status) · Active Open Games (Sport, Date, Slots Left) · Recent Badges Earned · Quick Tiles (icon, label, page)",
    edgeCases: "No upcoming bookings → CTA to browse; First login → onboarding checklist overlay; Network error → skeleton loaders; Coin balance = 0 → earn-coins CTA",
  },
  {
    sno: 10, pageName: "Find Venues", module: "Discovery + Booking", priority: "P0 – Critical", status: "Live", bizType: "B2C",
    functionality: "Filter venues by sport/city/price/availability, grid/list toggle, availability badge, rating, amenities chips, click to book",
    description: "Primary acquisition page for players. Only published + active listings shown.",
    dataModel: "VenueItem",
    dataValues: "S.No · Venue Name · Sport · Location · Price (₹/hr) · Rating · Review Count · Amenities (AC, Parking, etc.) · Available Slots (count) · Verified Badge · Featured Badge · Action (View / Book Now)",
    edgeCases: "Zero results for filter combo → empty state; Slot unavailable after filter → greyed card; Price range at max → show all; City change resets filters",
  },
  {
    sno: 11, pageName: "Game Detail", module: "Games", priority: "P1 – High", status: "Live", bizType: "B2C",
    functionality: "Full game info, map, rules, joined players list, seat dots, join flow with payment",
    description: "Detailed view of a specific open game. Social discovery feature.",
    dataModel: "GameItem · GamePlayer",
    dataValues: "Sport · Venue Name · Date · Time · Skill Level · Fee (₹) · Slots Total · Slots Filled · Slots Available · Host Name · Rules/Notes · Players List (Name, Joined At, Paid Y/N) · Action (Join / Full)",
    edgeCases: "Game full → show Full badge, disable Join; Joins while viewing → live seat count update; Player joins own game → block with error; Payment fails → not counted as joined",
  },
  {
    sno: 12, pageName: "Help Center", module: "Support", priority: "P2 – Medium", status: "Live", bizType: "B2C",
    functionality: "FAQ accordion by category, article search, contact support CTA, WhatsApp helpline link",
    description: "Self-service support hub to reduce ticket volume.",
    dataModel: "FAQ",
    dataValues: "Category (Booking/Payment/KYC/Games/Tournaments/General) · Question · Answer · Related Articles · Contact Options (Email/WhatsApp/Ticket)",
    edgeCases: "Search returns no results → show top 5 FAQs; WhatsApp link mobile-only; FAQ content must be CMS-editable",
  },
  {
    sno: 13, pageName: "Invoices", module: "Finance", priority: "P1 – High", status: "Live", bizType: "B2C",
    functionality: "List of booking and game-hosting invoices, filter by type/status/date, invoice detail modal, download PDF",
    description: "Financial records for players. Key for corporate employees needing reimbursement.",
    dataModel: "Invoice",
    dataValues: "S.No · Invoice ID · Invoice Date · Type (Booking / Game Hosting) · Venue / Game Name · Sport · Amount (₹) · GST (₹) · Total (₹) · Payment Method · Status (Paid/Refunded/Pending) · Action (Download PDF / View)",
    edgeCases: "PDF generation delay → show 'Processing' state; Cancelled booking invoice → 'Refunded' status; GST invoice with GSTIN for business users; Bulk download not yet supported",
  },
  {
    sno: 14, pageName: "My Bookings", module: "Booking", priority: "P0 – Critical", status: "Live", bizType: "B2C",
    functionality: "Tab view (Upcoming / Completed / Cancelled), booking details, cancel with refund policy, reschedule CTA, download invoice",
    description: "Central booking management for players. Refund policy enforced at cancellation.",
    dataModel: "BookingItem",
    dataValues: "S.No · Booking ID · Venue Name · Sport · Court/Court Type · Date · Time · Duration · Players Count · Amount Paid (₹) · Coins Used · Status (Confirmed/Completed/Cancelled) · Last Updated · Action (Cancel / Invoice / Rebook)",
    edgeCases: "Cancel within 2 hrs → no refund + confirmation dialog; Venue cancels → auto-refund + notification; Past booking not cancellable; Rebook same slot if available",
  },
  {
    sno: 15, pageName: "My Hosted Games", module: "Games", priority: "P1 – High", status: "Live", bizType: "B2C",
    functionality: "Create/manage player-hosted open games, view joined players, collect payments, generate QR invite, change game status (open/full/cancelled)",
    description: "Enables players to act as informal game organizers. Social feature driving community.",
    dataModel: "GameItem · GamePlayer",
    dataValues: "Games List — S.No · Game ID · Sport · Venue · Date · Time · Slots (Total / Joined) · Fee (₹) · Status (Open/Full/Cancelled) · Action (Manage / Delete)\nPlayers Panel — S.No · Player Name · Phone · Joined Date · Paid (Y/N) · Txn ID · Action (Mark Paid / Remove)",
    edgeCases: "Delete game with paid joiners → mandatory refund flow; QR link expires after game date; Duplicate join attempt → idempotent; Host cannot join own game as player",
  },
  {
    sno: 16, pageName: "Notifications", module: "Engagement", priority: "P1 – High", status: "Live", bizType: "B2C",
    functionality: "In-app notification centre, read/unread state, notification types (booking/payment/tournament/reward/message), mark all read",
    description: "Real-time activity feed keeping players informed about their bookings and activity.",
    dataModel: "Notification",
    dataValues: "S.No · Notification ID · Title · Body/Message · Type (Booking/Payment/Tournament/Message/Review/Reward) · Timestamp · Read Status (Y/N) · Deep Link (target page)",
    edgeCases: "Max 100 notifications per user → archive older; Push notification permission denied → in-app only; Notification for deleted entity → graceful 404 handling",
  },
  {
    sno: 17, pageName: "Open Games", module: "Games", priority: "P0 – Critical", status: "Live", bizType: "B2C",
    functionality: "Browse joinable open games, filter by sport/level/date/fee, ticket-style cards with seat dots, join CTA",
    description: "Social play feature. Lets players find pickup games near them.",
    dataModel: "GameItem",
    dataValues: "S.No · Sport · Venue Name · Location · Date · Time · Skill Level · Fee (₹) · Slots Total · Slots Filled · Slots Left · Host Name · Action (Join / Full / View Details)",
    edgeCases: "Game at 100% → 'Full' badge, disable Join; Game start time passed → auto-expire; Guest tries to join → redirect to auth; Fee = 0 → 'Free to Join' chip",
  },
  {
    sno: 18, pageName: "Player Profile / KYC", module: "Identity & Compliance", priority: "P0 – Critical", status: "Live", bizType: "B2C",
    functionality: "4-tab editor: Personal Info / Sports Preferences / Emergency Contact / KYC Document Upload. View verification status.",
    description: "Identity management. KYC required for withdrawals and tournament registrations.",
    dataModel: "User · KYCDocument",
    dataValues: "Personal: Full Name · DOB · Gender · Email · Phone · City · Profile Photo\nSports: Favourite Sports (multi-select) · Skill Level per Sport · Preferred Time\nEmergency: Contact Name · Relationship · Phone\nKYC: Document Type (Aadhaar/PAN/Passport) · Document Number · Front Image · Back Image · Selfie · Submission Date · Status (Pending/Approved/Rejected) · Rejection Reason",
    edgeCases: "KYC rejected → allow re-upload with reason shown; Name/phone change post-KYC → re-KYC required; Minor users → guardian consent; Expired ID → reject with reason",
  },
  {
    sno: 19, pageName: "Privacy Policy", module: "Legal", priority: "P2 – Medium", status: "Live", bizType: "B2C",
    functionality: "Static legal page detailing data collection, usage, retention, user rights",
    description: "GDPR + Indian IT Act 2000 compliance. Must be up-to-date.",
    dataModel: "Static Content",
    dataValues: "Section Heading · Policy Content · Effective Date · Last Updated · Contact for Data Requests (Email)",
    edgeCases: "Version history required; 'Last Updated' date must auto-update on edits; Must link from registration flow",
  },
  {
    sno: 20, pageName: "Scorecard", module: "Performance Tracking", priority: "P2 – Medium", status: "Live", bizType: "B2C",
    functionality: "Match history list, W/L/Draw record per sport, partner and opponent tracking, match duration, venue",
    description: "Performance dashboard for competitive players. Organizers can submit verified scores.",
    dataModel: "ScorecardEntry",
    dataValues: "S.No · Match Type (Singles/Doubles/5v5/etc.) · Sport · Partner · Opponent(s) · Venue · Date · Result (W/L/D) · Score (My Score vs Opponent) · Duration (min) · Verified (Y/N by Organizer)",
    edgeCases: "Manual entry vs organizer-submitted → different trust badges; Disputed scores → flag for review; Stats filter by sport/date range; W/L percentage shown in summary",
  },
  {
    sno: 21, pageName: "Settings", module: "Account", priority: "P2 – Medium", status: "Live", bizType: "B2C",
    functionality: "Notification preferences (push/email/SMS), privacy controls, language, linked accounts, 2FA toggle, delete account",
    description: "User control panel for account and communication preferences.",
    dataModel: "UserSettings",
    dataValues: "Notification Preferences (Booking/Payment/Games/Marketing – ON/OFF per channel)\nPrivacy (Show Profile – Public/Friends/Private) · Language · Linked Accounts (Google/Apple) · 2FA Status · Last Login · Device Sessions (Device, Last Active, Revoke)",
    edgeCases: "Delete account with active bookings → must cancel first; 2FA setup → show backup codes; Revoke all sessions on password change; Marketing opt-out must persist across reinstalls",
  },
  {
    sno: 22, pageName: "Support / Tickets", module: "Support", priority: "P1 – High", status: "Live", bizType: "B2C",
    functionality: "Raise support ticket (category + description + attachment), view existing tickets, chat thread, status tracking",
    description: "Player-facing customer support portal.",
    dataModel: "SupportTicket",
    dataValues: "S.No · Ticket ID · Category (Booking Issue/Payment/Venue Complaint/Bug/Refund/KYC/Other) · Subject · Description · Attachment URL · Status (Open/In Progress/Resolved/Closed) · Created At · Last Updated · Agent Name · Resolution Note",
    edgeCases: "Auto-close after 7 days if no response; Duplicate ticket detection (same category + user within 24 hrs); Attachment max 5 MB; Escalation path for P0 issues",
  },
  {
    sno: 23, pageName: "Terms of Service", module: "Legal", priority: "P2 – Medium", status: "Live", bizType: "B2C",
    functionality: "Static legal terms for platform usage, booking policy, refund policy, code of conduct",
    description: "Binding agreement accepted at registration.",
    dataModel: "Static Content",
    dataValues: "Section Heading · Terms Content · Effective Date · Last Updated · Governing Law",
    edgeCases: "User must accept on register; Version bump → re-acceptance required at next login; Archived versions accessible",
  },
  {
    sno: 24, pageName: "Tournament Detail", module: "Tournaments", priority: "P0 – Critical", status: "Live", bizType: "B2C",
    functionality: "Full tournament info, rules, schedule, prize breakdown, bracket preview, registration CTA with payment",
    description: "Conversion page for tournament registrations. Prize display drives urgency.",
    dataModel: "TournamentItem · Registration",
    dataValues: "Tournament Name · Sport · Date · Venue · Organizer · Prize Pool · Prize Breakdown (1st/2nd/3rd) · Fee (₹) · Slots Total · Slots Filled · Status (Open/Filling Fast/Full/Completed) · Categories (Singles/Doubles/etc.) · Description · Rules · Schedule · Registered Count · Action (Register Now / Waitlist)",
    edgeCases: "Full → waitlist CTA; Registration deadline passed → 'Closed'; Multiple category registration → separate entries; Registered user revisits → show 'Registered' badge",
  },
  {
    sno: 25, pageName: "Tournaments", module: "Discovery + Tournaments", priority: "P0 – Critical", status: "Live", bizType: "B2C",
    functionality: "Browse and filter tournaments by sport/status/date, event-poster cards with prize/slots/organizer, register CTA",
    description: "Tournament discovery page. Prize pool displayed prominently to attract competitive players.",
    dataModel: "TournamentItem",
    dataValues: "S.No · Tournament Name · Sport · Date · Venue · Organizer · Prize Pool (₹) · Entry Fee (₹) · Slots (Filled/Total) · Status (Open/Filling Fast/Full/Completed) · Action (Register / View Details)",
    edgeCases: "Past tournaments visible as 'Completed'; Multiple same-day tournaments → sorted by slots remaining; No tournaments for sport filter → empty state",
  },
  {
    sno: 26, pageName: "Venue Detail", module: "Booking", priority: "P0 – Critical", status: "Live", bizType: "B2C",
    functionality: "Venue gallery, amenities list, slot picker calendar, available time slots, booking summary, reviews, book now flow",
    description: "Primary conversion page for venue bookings. Slot picker must show real-time availability.",
    dataModel: "VenueItem · BookingItem",
    dataValues: "Venue Name · Sport · Location (map embed) · Price (₹/hr) · Rating · Review Count · Description · Amenities (tags) · Owner Name · Verified Badge\nSlot Picker: Date · Time Slot · Duration · Available/Booked indicator\nReviews: S.No · Reviewer Name · Rating · Comment · Date",
    edgeCases: "Slot taken between view and confirm → error + refresh; No slots today → next available date; Venue unverified → disclaimer shown; Multiple court types → court selector",
  },
  {
    sno: 27, pageName: "Wallet", module: "Finance", priority: "P1 – High", status: "Live", bizType: "B2C",
    functionality: "Wallet balance card, InspirQ Coins counter, top-up flow (UPI/Card), transaction history, redeem coins CTA, pending refunds",
    description: "Central financial hub for players. Coins = loyalty currency (100 coins = ₹10 off).",
    dataModel: "Wallet · Transaction",
    dataValues: "Summary: Wallet Balance (₹) · InspirQ Coins · Pending Refunds (₹)\nTransaction Table: S.No · Txn ID · Date & Time · Type (Credit/Debit/Refund/Coins Earned/Coins Redeemed) · Description · Amount (₹) · Closing Balance (₹) · Status (Success/Failed/Pending)",
    edgeCases: "Negative balance never allowed; Coins expire after 6 months → show expiry warning banner; Refund to wallet within 3–5 days; Top-up min ₹100; Failed top-up → retry option",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// VENUE OWNER  (B2B)
// ═══════════════════════════════════════════════════════════════════════════════
const VENUE_ROWS: PRDRow[] = [
  {
    sno: 1, pageName: "Auth – Login / Register", module: "Authentication", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "Business email login, OTP verification, venue owner role selection, business name + GST registration",
    description: "Separate onboarding for B2B users. GST number required for invoicing.",
    dataModel: "User · VenueOwnerProfile",
    dataValues: "Business Name · Owner Name · Email · Phone · GST Number · City · Password / OTP · Role = Venue · Referral Code (optional)",
    edgeCases: "Invalid GST number → validation error; Duplicate business email → error; KYC required before first listing goes live",
  },
  {
    sno: 2, pageName: "AI Insights", module: "Intelligence & Analytics", priority: "P2 – Medium", status: "Live", bizType: "B2B",
    functionality: "AI-generated revenue optimisation tips, peak-hour pricing recommendations, demand forecasting, churn risk for regulars",
    description: "AI advisor surfacing actionable insights from booking patterns and revenue data.",
    dataModel: "AIInsight · BookingAnalytics",
    dataValues: "Insight ID · Category (Revenue/Occupancy/Pricing/Retention) · Title · Impact Estimate (₹) · Confidence (%) · Recommended Action · Status (New/Dismissed/Applied) · Generated Date",
    edgeCases: "Insufficient data (<30 bookings) → show 'Need more data'; Suggestions non-binding; Dismissed insights archivable; Refreshed weekly",
  },
  {
    sno: 3, pageName: "Analytics / Revenue", module: "Finance & Analytics", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "Monthly revenue chart (line), breakdown bar (Bookings/Equipment/Corporate/POS), occupancy rate gauge, peak hours heatmap, export CSV",
    description: "Primary financial visibility for venue owners. Drives pricing and scheduling decisions.",
    dataModel: "MonthlyRevenue · BookingAnalytics",
    dataValues: "Period Selector (Month/Quarter/Year) · Total Revenue (₹) · Bookings Revenue (₹) · Equipment/Rental Revenue (₹) · Corporate Revenue (₹) · POS Revenue (₹) · Total Bookings Count · Occupancy Rate (%) · Avg Revenue per Booking (₹) · Peak Hour (time slot) · Chart Data (Month, Revenue by Category)",
    edgeCases: "Refunds subtracted from revenue; Date range spanning timezone midnight; Multi-venue owners → per-venue + aggregate; CSV export must include all columns",
  },
  {
    sno: 4, pageName: "Bookings Management", module: "Booking Operations", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "All bookings list with status tabs, check-in/check-out, manual walk-in booking, bulk status update, search by player name",
    description: "Day-to-day booking operations hub for venue staff.",
    dataModel: "VenueBooking",
    dataValues: "S.No · Booking ID · Player Name · Phone · Sport · Court / Space · Date · Time · Duration · Amount (₹) · Payment Method · Status (Confirmed/Checked-In/Completed/Cancelled/No-Show) · Last Updated · Action (Check-In / Cancel / View Invoice)",
    edgeCases: "Overbooking race condition → optimistic locking; Walk-in conflicts with app booking → manual override with reason log; Last-minute cancellation → notify waitlisted; No-show after 15 min → auto-flag",
  },
  {
    sno: 5, pageName: "Bulk / Corporate Booking", module: "Booking Operations", priority: "P1 – High", status: "Live", bizType: "B2B",
    functionality: "Corporate client management, bulk slot booking (multiple courts/full day), PO-linked invoicing, corporate rate pricing",
    description: "Enterprise sales module for companies booking for team events or regular sessions.",
    dataModel: "CorporateClient · BulkBooking",
    dataValues: "Corporate Table: S.No · Company Name · GSTIN · Contact Person · Phone · Email · Total Bookings · Total Revenue (₹) · Last Booking Date · Action (View / Invoice)\nBulk Booking: Date · Courts Selected · Time Range · Total Slots · Corporate Rate (₹) · PO Number · Invoice Status",
    edgeCases: "Corporate books entire venue → blackout all other bookings; PO number required for invoice generation; Prepaid vs post-paid billing toggle",
  },
  {
    sno: 6, pageName: "Check-In Management", module: "Operations", priority: "P1 – High", status: "Live", bizType: "B2B",
    functionality: "QR code scanner for player check-in, walk-in self-registration kiosk, real-time court occupancy board",
    description: "Reduces staff overhead at entry. QR scan validates booking instantly.",
    dataModel: "CheckIn · BookingItem",
    dataValues: "S.No · Booking ID · Player Name · Court · Slot Time · Check-In Method (QR/Manual) · Check-In Time · Check-Out Time · Staff ID · Duration Actual (min) · Status (Checked-In/Completed/No-Show)",
    edgeCases: "QR scan at wrong venue → error; Check-in after slot end → log as late arrival; QR reuse after check-in → already checked in message; Offline scanner → queue + sync",
  },
  {
    sno: 7, pageName: "Customers / CRM", module: "CRM", priority: "P1 – High", status: "Live", bizType: "B2B",
    functionality: "Customer directory, visit frequency, spend analysis, segmentation (Regular/New/At-Risk/Churned), contact, notes",
    description: "Lightweight CRM for venue owners to manage player relationships.",
    dataModel: "CustomerRecord",
    dataValues: "S.No · Player Name · Phone · Email · City · Total Visits · Total Spend (₹) · Last Visit Date · First Visit Date · Favourite Sport · Segment (Regular/New/At-Risk/Churned) · Notes · Action (Message / View Bookings)",
    edgeCases: "Player deletes account → anonymise PII, retain aggregated stats; GDPR export on request; Segment auto-calculated (At-Risk = no visit in 30 days)",
  },
  {
    sno: 8, pageName: "Dashboard", module: "Overview", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "KPI tiles (Today's revenue, active bookings, occupancy, new customers), upcoming bookings list, quick actions, revenue sparkline",
    description: "Business overview page. First screen after login. Drives daily decisions.",
    dataModel: "VenueBooking · MonthlyRevenue · VenueItem",
    dataValues: "Today Revenue (₹) · Today Bookings (count) · Occupancy Rate (%) · New Customers (this week) · Upcoming Bookings (Player, Court, Time, Status) · Revenue Sparkline (last 7 days) · Quick Actions (New Booking / Check-In / Add Customer)",
    edgeCases: "Multi-venue owner → venue selector dropdown; No bookings today → motivational zero state; Revenue anomaly → flag badge; Cache TTL 5 min for KPIs",
  },
  {
    sno: 9, pageName: "Data Settings", module: "Configuration", priority: "P2 – Medium", status: "Live", bizType: "B2B",
    functionality: "Export data (bookings/customers/revenue) as CSV/Excel, API key management, integration toggles (payment gateway, WhatsApp), data retention policy",
    description: "Operator control panel for data governance and integrations.",
    dataModel: "VenueConfig",
    dataValues: "API Keys: Key Name · Key (masked) · Created · Last Used · Scopes · Revoke\nIntegrations: Name · Status (Connected/Disconnected) · Last Sync\nExport: Entity Type · Date Range · Format (CSV/Excel) · Download Button",
    edgeCases: "API key rotation must not break active sessions; Export includes PII → audit log entry; Data retention: bookings kept 3 years minimum",
  },
  {
    sno: 10, pageName: "Equipment / Inventory", module: "Inventory", priority: "P1 – High", status: "Live", bizType: "B2B",
    functionality: "Equipment inventory list, rental management, condition tracking, low-stock alerts, damage logging",
    description: "Tracks venue-owned equipment available for sale or rental to players.",
    dataModel: "EquipmentItem",
    dataValues: "S.No · Item Name · Category (Racket/Ball/Shuttle/Protective Gear/Other) · Total Quantity · Available · On Rental · Damaged · Rental Price (₹/hr) · Sale Price (₹) · Condition (Good/Fair/Damaged) · Last Serviced Date · Action (Edit / Mark Damaged / Restock)",
    edgeCases: "Equipment damaged during rental → charge penalty to player; Rental not returned in 2 hrs → alert staff; Low stock threshold configurable; Damaged count affects available count",
  },
  {
    sno: 11, pageName: "Expenses", module: "Finance", priority: "P1 – High", status: "Live", bizType: "B2B",
    functionality: "Log business expenses by category, P&L view (Revenue vs Expenses), monthly trend chart, receipt upload, CSV export",
    description: "Expense tracking for venue operating costs. Feeds into P&L analysis.",
    dataModel: "Expense",
    dataValues: "S.No · Expense ID · Date · Category (Rent/Electricity/Water/Staff Salary/Equipment/Maintenance/Marketing/Insurance/Internet/Misc) · Description · Amount (₹) · GST Claimable (Y/N) · Receipt URL · Entered By · Action (Edit / Delete)\nSummary: Total Expenses (₹) · Total Revenue (₹) · Net Profit (₹) · Profit Margin (%)",
    edgeCases: "Recurring expenses auto-logged (e.g. monthly rent with reminder); Expense in foreign currency → INR conversion with exchange rate; GST input credit flag for registered businesses",
  },
  {
    sno: 12, pageName: "Invoice Generator", module: "Finance", priority: "P1 – High", status: "Live", bizType: "B2B",
    functionality: "Create custom invoices for bookings, corporate clients, equipment rentals. Line items, GST toggle, PDF download, email send",
    description: "Professional invoicing tool for B2B client billing and record-keeping.",
    dataModel: "Invoice",
    dataValues: "Invoice Number (auto-sequential) · Invoice Date · Due Date · Recipient (Name/Company/GSTIN) · Line Items (S.No, Description, Qty, Rate, Amount) · Subtotal (₹) · GST Rate (%) · GST Amount (₹) · Total (₹) · Payment Terms · Notes · Status (Draft/Sent/Paid/Overdue) · Action (Edit / Download PDF / Send Email)",
    edgeCases: "Invoice number sequence must have no gaps (legal requirement); GST invoice requires GSTIN; Sent invoices become read-only; Overdue flag triggers at due date + 1 day",
  },
  {
    sno: 13, pageName: "My Venues / Listing Management", module: "Listing Management", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "CRUD for venue listings, upload photos, set amenities, configure courts/spaces, set pricing, toggle published status, listing status display",
    description: "Core B2B module. Venue owners live and die by their listing quality.",
    dataModel: "VenueItem",
    dataValues: "S.No · Venue ID · Venue Name · Sport · Location · Price (₹/hr) · Rating · Courts/Spaces Count · Amenities (tags) · Listing Status (Active/Draft/Pending Review/Suspended) · Published (Y/N) · Featured (Y/N) · Created Date · Action (Edit / Toggle Published / Delete)",
    edgeCases: "Delete venue with future bookings → must cancel all first; Draft → Publish requires all mandatory fields; Admin suspension → owner notified, listing hidden from browse immediately; Featured toggle requires admin approval",
  },
  {
    sno: 14, pageName: "POS System", module: "Finance & Operations", priority: "P1 – High", status: "Live", bizType: "B2B",
    functionality: "Point-of-sale for walk-in sales (beverages, equipment rentals, accessories), cart management, payment, receipt generation, stock decrement",
    description: "In-venue sales terminal. Increases revenue per visit beyond booking fees.",
    dataModel: "POSItem · POSTransaction",
    dataValues: "Product Catalogue: S.No · Item Name · Category · Price (₹) · Stock Count · Action (Add to Cart)\nCart: Item · Qty · Unit Price · Line Total\nTransaction: Txn ID · Date & Time · Items (name, qty, price) · Subtotal · GST · Total · Payment Method (Cash/UPI/Card) · Staff ID",
    edgeCases: "Stock = 0 → prevent add to cart; Offline POS → queue transactions, sync on reconnect; Cash payment → manual change calculation; Day-end reconciliation report",
  },
  {
    sno: 15, pageName: "Pre-Booking / Advance Reservations", module: "Booking Operations", priority: "P2 – Medium", status: "Live", bizType: "B2B",
    functionality: "Advance seat reservation for events (tournaments/launches), waitlist management, deposit collection",
    description: "Manages demand for high-demand dates before bookings open.",
    dataModel: "PreBooking",
    dataValues: "S.No · Pre-Booking ID · Player Name · Phone · Event/Slot · Deposit Amount (₹) · Waitlist Position · Status (Reserved/Confirmed/Waitlisted/Cancelled) · Created At · Action (Confirm / Cancel / Promote from Waitlist)",
    edgeCases: "Deposit non-refundable if no-show within 24 hrs; Auto-promote from waitlist when slot opens; Max deposit ≤ full slot price; Email/SMS alert on promotion",
  },
  {
    sno: 16, pageName: "Recurring Bookings", module: "Booking Operations", priority: "P1 – High", status: "Live", bizType: "B2B",
    functionality: "Set up weekly/bi-weekly/monthly recurring slots for regular players, auto-invoice, manage/cancel series",
    description: "Drives predictable revenue from loyal regulars. Reduces booking admin.",
    dataModel: "RecurringBooking",
    dataValues: "S.No · Recurring ID · Player Name · Phone · Sport · Court · Day of Week · Start Time · Frequency (Weekly/Bi-Weekly/Monthly) · Start Date · End Date · Fee (₹) · Auto-Invoice (Y/N) · Status (Active/Paused/Cancelled) · Action (Edit / Pause / Cancel Series)",
    edgeCases: "Public holiday on recurring day → skip or reschedule; Cancel one instance vs entire series; Auto-invoice sent 24 hrs before slot; Series can't extend beyond 1 year",
  },
  {
    sno: 17, pageName: "Slot Management", module: "Booking Operations", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "Configure available time slots per court per day, set pricing per slot/time-band, block dates, holiday calendar",
    description: "Foundation of booking system. Availability shown to players is driven entirely by this configuration.",
    dataModel: "SlotConfig",
    dataValues: "Court/Space Name · Day of Week / Specific Date · Start Time · End Time · Slot Duration (30/60/90/120 min) · Price (₹) · Slot Type (Regular/Peak/Off-Peak) · Status (Available/Blocked/Maintenance) · Action (Edit / Block / Activate)",
    edgeCases: "Block slot with confirmed booking → error + prompt cancel; Peak pricing override by time band; Slot config change propagates to booking calendar immediately; Holiday list bulk import",
  },
  {
    sno: 18, pageName: "Subscriptions / Membership Plans", module: "Finance", priority: "P2 – Medium", status: "Live", bizType: "B2B",
    functionality: "Create and sell membership plans (e.g. 10-session pass, monthly unlimited), track active subscribers, manage renewals",
    description: "Recurring revenue stream. Members get priority booking and discounts.",
    dataModel: "SubscriptionPlan · Subscriber",
    dataValues: "Plans: S.No · Plan Name · Price (₹) · Duration · Sessions Included / Unlimited · Benefits (tags) · Status (Active/Paused)\nSubscribers: S.No · Player Name · Plan · Start Date · End Date · Sessions Used/Total · Status (Active/Expired/Cancelled) · Action (Extend / Cancel)",
    edgeCases: "Plan expiry auto-notification 7 days before; Subscription lapses → access downgrade; Prorate refund on early cancellation; Member booking priority window (book 48 hrs before non-members)",
  },
  {
    sno: 19, pageName: "Support", module: "Support", priority: "P2 – Medium", status: "Live", bizType: "B2B",
    functionality: "Raise and track support tickets with InspirQ platform team. Account issues, listing problems, payout queries.",
    description: "B2B support channel with SLA-backed response times.",
    dataModel: "SupportTicket",
    dataValues: "S.No · Ticket ID · Category · Subject · Description · Status · Priority (set by agent) · Created At · Last Updated · Agent Name · Resolution Note",
    edgeCases: "P0 tickets (payout blocked) → 4-hour SLA; Auto-escalation if no response in 24 hrs; Attachment max 10 MB for venue owners",
  },
  {
    sno: 20, pageName: "WhatsApp Marketing", module: "Marketing", priority: "P2 – Medium", status: "Live", bizType: "B2B",
    functionality: "Broadcast campaigns to customer segments via WhatsApp Business API, template management, campaign scheduling, delivery stats",
    description: "Low-cost marketing channel with high open rates for venue promotions.",
    dataModel: "Campaign · MessageDelivery",
    dataValues: "S.No · Campaign Name · Template Used · Segment (All/Regular/New/At-Risk) · Recipients Count · Scheduled At · Sent At · Delivered (count) · Read (count) · Failed (count) · Status (Draft/Scheduled/Sent/Failed)",
    edgeCases: "WhatsApp API rate limiting → queue with delay; Opt-out customers excluded automatically; Template requires pre-approval from Meta; Failed sends retry 3 times",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TRAINER  (B2B)
// ═══════════════════════════════════════════════════════════════════════════════
const TRAINER_ROWS: PRDRow[] = [
  {
    sno: 1, pageName: "Auth – Login / Register", module: "Authentication", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "Professional email login, OTP, trainer role selection, certification details at registration",
    description: "Trainer onboarding. Certification upload at signup triggers admin KYC review.",
    dataModel: "User · TrainerProfile",
    dataValues: "Full Name · Email · Phone · Sport(s) Coached (multi-select) · Years Experience · Certification Name · Certification Upload · City · Fee (₹/hr) · Password / OTP",
    edgeCases: "Unverified trainer can't appear in player browse; Duplicate certification document → flag for review",
  },
  {
    sno: 2, pageName: "AI Insights", module: "Intelligence", priority: "P3 – Low", status: "Live", bizType: "B2B",
    functionality: "Churn risk alerts for inactive students, optimal pricing suggestions, peak demand time recommendations",
    description: "AI-driven business advisor for independent coaches.",
    dataModel: "AIInsight · SessionAnalytics",
    dataValues: "Insight Category · Title · Description · Recommended Action · Impact Estimate · Confidence (%) · Date Generated · Status (New/Dismissed)",
    edgeCases: "Insufficient history (<20 sessions) → disable suggestions; No PII in displayed insight text",
  },
  {
    sno: 3, pageName: "Attendance", module: "Session Management", priority: "P1 – High", status: "Live", bizType: "B2B",
    functionality: "Mark attendance per session (present/absent/late), view student-wise attendance rate, export sheet, send absent notification",
    description: "Accountability tool for both coaches and students. Critical for package tracking.",
    dataModel: "AttendanceRecord",
    dataValues: "S.No · Session Date · Session Time · Sport · Type (Individual/Group) · Students Present (count/list) · Students Absent (count/list) · Late Arrivals · Attendance Rate (%) · Notes · Action (Edit / Export Session)\nStudent Attendance Summary: Student Name · Sessions Attended · Sessions Total · Attendance % · Last Present Date",
    edgeCases: "Retroactive marking > 24 hrs → requires admin override; Bulk mark present for group; Absent notification sent to student within 1 hr; Attendance < 70% → show alert to trainer",
  },
  {
    sno: 4, pageName: "Dashboard", module: "Overview", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "KPI tiles (Today's sessions, active students, earnings this month, upcoming schedule), performance chart, quick actions",
    description: "Trainer command centre. Drives daily session management.",
    dataModel: "SessionItem · Student · TrainerRevenue",
    dataValues: "Today Sessions (count) · Active Students · This Month Earnings (₹) · Avg Rating · Upcoming Sessions (Student, Sport, Time, Type) · Revenue Sparkline (7 days) · Quick Actions (Add Session / Mark Attendance / Message Student)",
    edgeCases: "No sessions today → motivational zero state; Multiple sports supported; Revenue includes packages + individual sessions",
  },
  {
    sno: 5, pageName: "Data Settings", module: "Configuration", priority: "P3 – Low", status: "Live", bizType: "B2B",
    functionality: "Export student/session data, integration settings, notification preferences, calendar sync (Google/Apple)",
    description: "Data governance and personal productivity integrations for trainers.",
    dataModel: "TrainerConfig",
    dataValues: "Export: Entity (Students/Sessions/Revenue) · Date Range · Format · Download\nCalendar Sync: Provider · Status · Last Synced\nNotifications: Session Reminder (Y/N) · Student No-Show Alert (Y/N) · Payment Alert (Y/N)",
    edgeCases: "GDPR student data export on player request; Calendar sync conflicts → manual resolution; Export includes PII → audit log",
  },
  {
    sno: 6, pageName: "Equipment", module: "Inventory", priority: "P2 – Medium", status: "Live", bizType: "B2B",
    functionality: "Personal equipment list, student equipment loans, condition tracking, loan return tracking",
    description: "Tracks coach-owned equipment shared with or loaned to students.",
    dataModel: "EquipmentItem",
    dataValues: "S.No · Item Name · Category · Qty Owned · Qty On Loan · Condition · Loaned To (Student Name) · Loan Date · Expected Return · Action (Mark Returned / Mark Damaged)",
    edgeCases: "Equipment not returned in agreed time → automated reminder; Damaged equipment → deduct from student's package",
  },
  {
    sno: 7, pageName: "Expenses", module: "Finance", priority: "P2 – Medium", status: "Live", bizType: "B2B",
    functionality: "Log professional expenses (venue rental, equipment, travel, marketing), P&L summary, receipt upload, tax export",
    description: "Business expense tracking for self-employed trainers. Supports ITR filing.",
    dataModel: "Expense",
    dataValues: "S.No · Date · Category (Venue Rent/Equipment/Travel/Marketing/Other) · Description · Amount (₹) · GST Claimable · Receipt · Action (Edit/Delete)\nSummary: Total Income (₹) · Total Expenses (₹) · Net Profit (₹)",
    edgeCases: "GST input credit for registered trainers; Annual P&L export for CA/ITR; TDS tracking for high-income trainers (>₹30,000/session)",
  },
  {
    sno: 8, pageName: "Invoice Generator", module: "Finance", priority: "P1 – High", status: "Live", bizType: "B2B",
    functionality: "Generate session invoices for students, package invoices, GST invoice toggle, PDF download, email send",
    description: "Professional invoicing for coaches billing students or corporates.",
    dataModel: "Invoice",
    dataValues: "Invoice Number · Date · Recipient (Student Name/Company) · Line Items (Session Date, Duration, Rate) · Subtotal · GST · Total · Notes · Status (Draft/Sent/Paid) · Action (Download PDF / Send Email)",
    edgeCases: "Invoice void + reissue if sent to wrong student; GST invoice requires GSTIN; Bulk invoice for all students in a month",
  },
  {
    sno: 9, pageName: "My Profile", module: "Identity & Listing", priority: "P1 – High", status: "Live", bizType: "B2B",
    functionality: "Edit public trainer profile: bio, specialisations, certifications, profile photo, fee per hour, availability, sport list",
    description: "Public-facing listing profile shown on the Coaches browse page.",
    dataModel: "TrainerItem",
    dataValues: "Profile Photo · Full Name · Sport(s) · Experience (years) · Certifications (Name, Issued By, Year) · Bio (text) · Specialisations (tags) · Fee (₹/hr) · Location · Availability (days/times) · Listing Status (Active/Draft/Suspended) · Published (Y/N)",
    edgeCases: "Profile changes while KYC pending → queue for re-review; Certification expiry date → auto-flag as unverified; Photo must be 200×200 min; Listing auto-hidden if KYC rejected",
  },
  {
    sno: 10, pageName: "Packages / Subscriptions", module: "Finance", priority: "P1 – High", status: "Live", bizType: "B2B",
    functionality: "Create session packages (e.g. 10-session pack, monthly unlimited), sell to students, track per-student consumption",
    description: "Recurring revenue model for coaches. Students buy in bulk for discount.",
    dataModel: "SessionPackage · PackageEnrollment",
    dataValues: "Packages: S.No · Package Name · Sport · Sessions Included · Price (₹) · Validity (days) · Status (Active/Archived)\nStudent Enrollments: Student Name · Package · Sessions Used · Sessions Remaining · Expiry Date · Status (Active/Expired/Cancelled) · Action (Extend / Cancel)",
    edgeCases: "Package sessions expire after validity date → notify 7 days before; Partial refund on unused sessions (configurable policy); Package can't be extended after expiry (must buy new)",
  },
  {
    sno: 11, pageName: "POS System", module: "Finance & Operations", priority: "P2 – Medium", status: "Live", bizType: "B2B",
    functionality: "Sell supplements, equipment, accessories, and session packages directly to students at point of interaction",
    description: "On-the-spot sales tool for coaches running academy-style setups.",
    dataModel: "POSItem · POSTransaction",
    dataValues: "Catalogue: Item Name · Category · Price · Stock\nCart: Items · Total\nTxn: ID · Date · Items · Total · Payment Method · Student Name",
    edgeCases: "Offline sync; Stock reconciliation at day end; Package sold via POS → auto-enroll student",
  },
  {
    sno: 12, pageName: "Revenue", module: "Finance", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "Monthly earnings chart, breakdown (Individual Sessions/Group/Packages/POS), pending vs received payments, payout schedule",
    description: "Financial overview for trainers. Platform deducts commission before payout.",
    dataModel: "TrainerRevenue",
    dataValues: "Period Selector · Total Gross Earnings (₹) · Platform Commission (₹) · Net Payout (₹) · Pending Payments (₹) · By Type: Individual Sessions / Group / Packages / POS · Monthly Chart · Payout Schedule: S.No, Date, Amount, Status (Pending/Processed/Failed)",
    edgeCases: "TDS deduction for earnings > ₹30k/session → show net; Commission rate displayed transparently; Payout held if KYC not verified; Failed payout → retry + notify",
  },
  {
    sno: 13, pageName: "Schedule / Calendar", module: "Session Management", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "Weekly/monthly calendar view, block time off, set recurring availability, drag-and-drop reschedule, colour-code by student",
    description: "Time management hub for coaches. Drives session creation and availability shown to players.",
    dataModel: "TrainerAvailability · SessionItem",
    dataValues: "Calendar View (Week/Month) · Date · Time Slot · Student Name · Sport · Session Type (Individual/Group) · Status (Scheduled/Confirmed/Completed/Cancelled) · Notes · Colour Code (per student/sport)",
    edgeCases: "Reschedule conflicts with another student session; Holiday block must propagate to recurring sessions; Calendar sync with Google/Apple; Student reschedule request → trainer approval flow",
  },
  {
    sno: 14, pageName: "Sessions", module: "Session Management", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "All sessions list with status tabs, session notes/feedback, duration tracking, attendance link, type filter (Individual/Group/Online)",
    description: "Master session log for coaches. Foundation for billing and performance tracking.",
    dataModel: "SessionItem",
    dataValues: "S.No · Session ID · Student Name · Sport · Session Type · Date · Time · Duration (min) · Fee (₹) · Status (Scheduled/Completed/Cancelled/No-Show) · Attendance (Present/Absent) · Notes · Rating (by student) · Action (Edit / Add Notes / Mark Complete)",
    edgeCases: "No-show student → still charged per cancellation policy; Session overlap → conflict detection on create; Group session: one row per session (not per student); Online session → meeting link field",
  },
  {
    sno: 15, pageName: "Students", module: "Student Management", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "Student roster with progress notes, session history, contact info, package assignment, performance tracking per sport",
    description: "CRM for coaches. Student progress notes drive personalised coaching.",
    dataModel: "Student",
    dataValues: "S.No · Student ID · Full Name · Age · Gender · Phone · Email · City · Sports (list) · Current Level (Beginner/Intermediate/Advanced) · Sessions Total · Sessions This Month · Active Package · Progress Notes (date, note, coach) · Guardian Name (if minor) · Action (View Profile / Add Note / Assign Package / Message)",
    edgeCases: "Student transfers to another trainer → history retained but no longer editable; Minor student → guardian as primary contact; Inactive > 60 days → 'Inactive' badge + re-engagement prompt",
  },
  {
    sno: 16, pageName: "Support", module: "Support", priority: "P2 – Medium", status: "Live", bizType: "B2B",
    functionality: "Raise and track tickets with InspirQ support. Issues: profile/listing, payout, student disputes.",
    description: "B2B support channel for independent coaches.",
    dataModel: "SupportTicket",
    dataValues: "Ticket ID · Category · Subject · Description · Status · Created At · Last Updated · Agent · Resolution Note",
    edgeCases: "Payout disputes → P0 priority SLA; Listing suspension appeal → dedicated queue",
  },
  {
    sno: 17, pageName: "WhatsApp Marketing", module: "Marketing", priority: "P2 – Medium", status: "Live", bizType: "B2B",
    functionality: "Send session reminders, package offers, motivational messages to students via WhatsApp Business API",
    description: "Automated outreach to reduce no-shows and drive package renewals.",
    dataModel: "Campaign · Student",
    dataValues: "Campaign Name · Template · Segment (All Students/Active/Inactive/Package Expired) · Recipients · Scheduled At · Delivered · Read · Failed · Status",
    edgeCases: "Student opts out → fallback to SMS/in-app; Rate limit: 1000 messages/day per WABA number; Template pre-approval required",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ORGANIZER  (B2B)
// ═══════════════════════════════════════════════════════════════════════════════
const ORGANIZER_ROWS: PRDRow[] = [
  {
    sno: 1, pageName: "Auth – Login / Register", module: "Authentication", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "Business email login, OTP, organizer role selection, company/event brand registration",
    description: "Organiser onboarding. Company name and contact linked to all tournaments they create.",
    dataModel: "User · OrganizerProfile",
    dataValues: "Organization / Brand Name · Contact Person · Email · Phone · City · Event Types (dropdown) · GST Number · Password / OTP",
    edgeCases: "KYC required before payout; Duplicate org name → warning (not block); Must accept organizer-specific T&C",
  },
  {
    sno: 2, pageName: "Analytics", module: "Intelligence", priority: "P1 – High", status: "Live", bizType: "B2B",
    functionality: "Registration funnel chart, revenue by tournament, player demographics (city/age/sport), repeat participant rate, event performance comparison",
    description: "Data insights to help organisers improve future event planning.",
    dataModel: "TournamentAnalytics",
    dataValues: "Period Selector · Total Tournaments · Total Registrations · Total Revenue (₹) · Avg Fill Rate (%) · Registration Funnel (Viewed → Registered → Paid) · Demographics: City Distribution, Age Range, Sport Split · Repeat Rate (%) · Best-Performing Tournament (name, revenue, fill %)",
    edgeCases: "Analytics for cancelled tournament → data marked 'Cancelled' but included in totals; Export CSV",
  },
  {
    sno: 3, pageName: "Brackets", module: "Tournament Operations", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "Auto-generate brackets from registrations (single-elim / round-robin), manual seeding drag-and-drop, update match scores, advance winners",
    description: "Core tournament operations tool. Generates the competitive structure players see.",
    dataModel: "Bracket · Match",
    dataValues: "Tournament Name · Format (Single Elim/Round Robin/Double Elim) · Total Participants · Rounds · Match Table: S.No · Round · Match ID · Player 1 · Player 2 · Score 1 · Score 2 · Winner · Status (Scheduled/In Progress/Completed/Disputed) · Court/Slot · Action (Enter Score / Flag Dispute)",
    edgeCases: "Odd participants → bye placement rules; Player withdraws mid-tournament → walkover rules; Score dispute → hold bracket progression; Live bracket visible to players in read-only view",
  },
  {
    sno: 4, pageName: "Dashboard", module: "Overview", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "Active tournaments summary, total registrations this month, pending bracket actions, revenue this month, upcoming events list",
    description: "Organiser operations HQ.",
    dataModel: "TournamentItem · Registration · OrganizerRevenue",
    dataValues: "Active Tournaments (count) · This Month Registrations · This Month Revenue (₹) · Pending Actions (bracket updates, disputes) · Upcoming Tournaments Table: Name, Date, Sport, Registrations (Filled/Total), Status · Quick Actions (Create Tournament / View Brackets / Export Registrations)",
    edgeCases: "No active tournaments → CTA to create; Multiple simultaneous tournaments → sort by soonest date; Dispute flag shows count badge",
  },
  {
    sno: 5, pageName: "Invoice Generator", module: "Finance", priority: "P1 – High", status: "Live", bizType: "B2B",
    functionality: "Generate participant invoices, sponsor invoices, prize distribution receipts, bulk invoice for all registrants",
    description: "Financial documentation for event accounting.",
    dataModel: "Invoice",
    dataValues: "Invoice Number · Date · Recipient (Player/Sponsor/Venue) · Tournament Name · Line Items (Registration Fee, GST) · Total · Status (Draft/Sent/Paid) · Action (PDF / Email / Bulk Generate)",
    edgeCases: "Bulk invoice generation for 100+ participants → async with progress bar; Cancelled participant invoice → 'Refunded' status; Sponsor invoice has different tax category",
  },
  {
    sno: 6, pageName: "Registrations", module: "Tournament Operations", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "View all registrations per tournament, player details, payment status, approve/reject, waitlist management, export list",
    description: "Registration management hub. Controls who enters the tournament.",
    dataModel: "Registration",
    dataValues: "S.No · Registration ID · Player Name · Phone · Email · City · Category (Singles/Doubles/Mixed) · Partner Name (if doubles) · Registration Date · Payment Status (Paid/Pending/Refunded) · Approval Status (Approved/Pending/Rejected/Waitlisted) · Action (Approve / Reject / Move to Waitlist / View Profile)",
    edgeCases: "Auto-approve if payment confirmed; Reject triggers refund; Waitlist auto-promotion when slot opens; Player registers for multiple categories → separate rows; Export as CSV/Excel",
  },
  {
    sno: 7, pageName: "Revenue", module: "Finance", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "Earnings per tournament, platform commission breakdown, payout schedule, refund tracking, export statement",
    description: "Financial performance view per event. Payout held until KYC verified.",
    dataModel: "OrganizerRevenue",
    dataValues: "Per Tournament: Name · Total Registrations (Paid) · Gross Revenue (₹) · Platform Commission (%) · Platform Fee (₹) · Net Payout (₹) · Refunds (₹) · Final Payout (₹) · Payout Status (Pending/Scheduled/Processed)\nPayouts Table: Payout ID · Date · Tournament · Amount (₹) · Method · Status",
    edgeCases: "Payout held if organizer KYC not verified; Commission rates vary by plan; Refund reduces net; Dispute hold shows in payout status",
  },
  {
    sno: 8, pageName: "Scorecard / Results", module: "Results Management", priority: "P1 – High", status: "Live", bizType: "B2B",
    functionality: "Live match-by-match score entry, final standings table, player stat cards (Winner/Finalist/Top Scorer), publish results to player profiles",
    description: "Post-match results entry. Published scores are visible on player scorecards.",
    dataModel: "MatchScore · Standing",
    dataValues: "Match Scores: Match ID · Round · Player 1 · Player 2 · Set/Game Scores · Duration · Winner · Submitted By · Timestamp\nFinal Standings: Rank · Player Name · City · W · L · Points · Prize Won (₹) · Award (Winner/Finalist/etc.) · Action (Publish / Edit)",
    edgeCases: "Score submission after deadline → requires admin unlock; Forfeit vs no-show scoring rules differ; Standings published → visible to all players; Results must be submitted within 24 hrs of final",
  },
  {
    sno: 9, pageName: "Support", module: "Support", priority: "P2 – Medium", status: "Live", bizType: "B2B",
    functionality: "Raise tickets for venue disputes, payout issues, registration problems, system errors",
    description: "Organiser support channel with event-context ticketing.",
    dataModel: "SupportTicket",
    dataValues: "Ticket ID · Tournament Reference · Category · Subject · Description · Status · Priority · Created At · Agent · Resolution",
    edgeCases: "Payout disputes SLA: 4 hrs; Venue unavailability disputes → escalate to admin",
  },
  {
    sno: 10, pageName: "Tournaments", module: "Tournament Management", priority: "P0 – Critical", status: "Live", bizType: "B2B",
    functionality: "CRUD for tournament listings, set sport/date/venue/prize/fee/slot count, listing status, publish/unpublish, duplicate event",
    description: "Core creation flow for tournaments that appear on the platform.",
    dataModel: "TournamentItem",
    dataValues: "S.No · Tournament ID · Tournament Name · Sport · Date · Venue · Prize Pool (₹) · Entry Fee (₹) · Slots (Total/Filled) · Categories (list) · Description · Rules · Listing Status (Active/Draft/Pending/Suspended) · Published (Y/N) · Created At · Action (Edit / Publish / Duplicate / Delete)",
    edgeCases: "Reduce slots below current registrations → block with error; Published tournament → only non-critical fields editable; Admin suspends → organizer notified; Duplicate creates draft with '(Copy)' suffix",
  },
  {
    sno: 11, pageName: "WhatsApp Marketing", module: "Marketing", priority: "P2 – Medium", status: "Live", bizType: "B2B",
    functionality: "Broadcast tournament updates, last-call registrations, bracket releases, result announcements to registered participants",
    description: "Event communication tool for participant engagement.",
    dataModel: "Campaign · Registration",
    dataValues: "Campaign Name · Tournament Reference · Template · Recipient Segment (All Registrants/Approved/Waitlisted) · Count · Status · Scheduled At · Delivered · Read · Failed",
    edgeCases: "Message to cancelled participants must include refund info; Opt-out respected; Meta template pre-approval required",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SUPER ADMIN  (Internal)
// ═══════════════════════════════════════════════════════════════════════════════
const ADMIN_ROWS: PRDRow[] = [
  {
    sno: 1, pageName: "Auth – Login (Admin)", module: "Authentication", priority: "P0 – Critical", status: "Live", bizType: "Internal",
    functionality: "Admin-only login with 2FA mandatory, IP whitelist, session audit log, role: admin",
    description: "Secure entry for platform operators. All admin sessions logged for audit.",
    dataModel: "User · AdminSession",
    dataValues: "Email · Password · 2FA Code (TOTP) · IP Address · Device Info · Session Token · Login Timestamp · Last Activity",
    edgeCases: "Wrong 2FA 3 times → 30-min lockout + email alert; Login from new IP → OTP verification; Session auto-expire after 2 hrs inactivity; Concurrent sessions limit: 3",
  },
  {
    sno: 2, pageName: "Attributes Management", module: "Platform Configuration", priority: "P2 – Medium", status: "Live", bizType: "Internal",
    functionality: "Manage master data: sports list, cities list, amenities, skill levels, equipment categories, certification types",
    description: "CMS for all dropdown/tag master data used across the platform.",
    dataModel: "Attribute",
    dataValues: "S.No · Attribute ID · Type (Sport/City/Amenity/Skill Level/Equipment Category/Cert Type) · Name · Icon/Emoji · Status (Active/Inactive) · Display Order · Created At · Action (Edit / Deactivate / Delete)",
    edgeCases: "Delete a sport used by active venues/trainers → soft delete + migration prompt; Case-insensitive duplicate detection on create; Display order drag-and-drop",
  },
  {
    sno: 3, pageName: "Dashboard", module: "Platform Overview", priority: "P0 – Critical", status: "Live", bizType: "Internal",
    functionality: "Platform KPIs (Total Users, New Users, Venues, Trainers, Organizers, GMV, MRR, ARPU), growth charts, anomaly alerts, quick access links",
    description: "Executive dashboard for platform health monitoring.",
    dataModel: "AdminStats",
    dataValues: "Total Users · New Users (this month) · Total Venues · Total Trainers · Total Organizers · Lifetime GMV (₹) · MRR (₹) · ARPU (₹) · Active Listings · KYC Pending Count · Payout Queue (₹) · Revenue Chart (monthly) · User Growth Chart · Role Distribution Pie Chart",
    edgeCases: "Real-time vs cached (5-min TTL) metrics; Revenue anomaly spike → yellow alert badge; Cache invalidation on large data changes; Export dashboard snapshot as PDF",
  },
  {
    sno: 4, pageName: "KYC Approvals", module: "Compliance", priority: "P0 – Critical", status: "Live", bizType: "Internal",
    functionality: "Review queue for all submitted KYC documents (players/venues/trainers/organizers), approve/reject with reason, request re-upload, bulk review tools",
    description: "Trust and safety compliance module. Controls who can transact on the platform.",
    dataModel: "KYCDocument",
    dataValues: "S.No · KYC ID · User Name · User Role · Document Type (Aadhaar/PAN/Passport/GST Cert/Business Reg) · Document Number · Front Image · Back Image · Selfie · Submitted At · Reviewer ID · Status (Pending/Approved/Rejected/Re-Upload Requested) · Rejection Reason · Action (Approve / Reject / Request Re-Upload / Flag Fraud)",
    edgeCases: "Expired ID → reject with expiry reason; Fraudulent document → flag + escalate + suspend user; KYC for company (Venue/Organizer) → different doc set (GST + Director ID); Auto-approve not supported (must be manual); SLA: review within 24 business hours",
  },
  {
    sno: 5, pageName: "Pricing / Commission Configuration", module: "Finance Configuration", priority: "P1 – High", status: "Live", bizType: "Internal",
    functionality: "Configure platform commission rates per entity type (Venue/Trainer/Organizer), dynamic pricing rules, create/manage promo codes",
    description: "Revenue configuration module. Rate changes are audited and versioned.",
    dataModel: "PricingRule · PromoCode",
    dataValues: "Commission Rules: S.No · Entity Type · Rate (%) · Effective From · Effective To · Created By · Status (Active/Superseded)\nPromo Codes: S.No · Code · Discount (% or ₹) · Applicable On (Venue/Game/Tournament/All) · Usage Limit · Used Count · Valid From · Valid To · Status · Action (Activate / Deactivate)",
    edgeCases: "Commission rate change must not affect existing confirmed bookings; Promo code infinite-use → require explicit 'unlimited' flag; Promo code applied by too many users → auto-deactivate at limit",
  },
  {
    sno: 6, pageName: "Revenue / Finance Dashboard", module: "Finance", priority: "P0 – Critical", status: "Live", bizType: "Internal",
    functionality: "Platform-wide GMV, commission earnings, payout ledger (pending/processed/failed), refund dashboard, entity-wise revenue breakdown, tax report export",
    description: "Finance command centre for InspirQ's own P&L and payout management.",
    dataModel: "PlatformRevenue · Payout",
    dataValues: "Period: Month/Quarter/Year · Gross GMV (₹) · Platform Commission Earned (₹) · Payouts Processed (₹) · Payouts Pending (₹) · Total Refunds (₹) · Net Platform Revenue (₹)\nPayouts Queue: S.No · Payee Name · Role · Amount (₹) · Method · Bank / UPI · Status (Queued/Processing/Completed/Failed) · Action (Process / Hold / Retry)\nRevenue Breakdown: By Role · By Sport · By City · By Month",
    edgeCases: "Revenue reconciliation mismatch → alert + hold payouts; GST filing export by quarter (GSTR-1 format); Failed payouts → retry + manual override; Bank holiday delay → batch next business day",
  },
  {
    sno: 7, pageName: "Settings / Platform Config", module: "Platform Configuration", priority: "P1 – High", status: "Live", bizType: "Internal",
    functionality: "Maintenance mode toggle, feature flags, notification template editor, email/SMS config, platform-level T&C version, app version management",
    description: "Master control panel for platform behaviour without deployments.",
    dataModel: "PlatformConfig",
    dataValues: "Maintenance Mode (Toggle) · Scheduled Maintenance Window · Feature Flags: Feature Name, Status (On/Off), Rollout % · Email SMTP Config · SMS Provider Config · Notification Templates: Type, Subject, Body, Variables · T&C Version · App Version (iOS/Android) · Force Update Flag",
    edgeCases: "Maintenance mode → shows scheduled downtime banner 30 min before; Feature flag rollback within 1 min; Template variable validation (missing variable → publish blocked); Force update must show modal to all users immediately",
  },
  {
    sno: 8, pageName: "Subscriptions Management", module: "Finance", priority: "P1 – High", status: "Live", bizType: "Internal",
    functionality: "All B2B subscription plans, active subscribers per plan, upgrade/downgrade/cancel, trial management, billing history",
    description: "Platform subscription tiers for venue/trainer/organizer accounts.",
    dataModel: "SubscriptionPlan · Subscription",
    dataValues: "Plans: Plan Name · Price (₹/mo) · Billing Cycle · Max Venues/Students · Features Included · Trial Days · Status (Active/Archived)\nSubscribers: S.No · Entity Name · Role · Plan · Status (Trial/Active/Paused/Cancelled) · Next Billing Date · Amount · Payment Method · Trial End Date · Action (Upgrade / Cancel / Extend Trial)",
    edgeCases: "Free trial end → auto-charge or downgrade to free tier (configurable); Subscription used by suspended account → pause billing; Annual plan pro-rate on upgrade; Failed billing → grace period 3 days + retry",
  },
  {
    sno: 9, pageName: "Support Management", module: "Support Operations", priority: "P1 – High", status: "Live", bizType: "Internal",
    functionality: "All platform support tickets (from all roles), assign to agents, set priority, SLA tracking, resolution notes, escalation",
    description: "Central helpdesk for InspirQ customer support team.",
    dataModel: "SupportTicket",
    dataValues: "S.No · Ticket ID · User Name · User Role · Category · Subject · Description · Attachments · Priority (P0/P1/P2/P3) · Status (Open/Assigned/In Progress/Resolved/Closed) · Assigned Agent · SLA Deadline · Created At · Last Updated · Resolution Note · Action (Assign / Escalate / Close)",
    edgeCases: "Auto-escalate P0 tickets unresponded after 2 hrs; SLA breach → red badge + manager notification; Reopen closed ticket within 7 days; Spam tickets → flag + restrict user",
  },
  {
    sno: 10, pageName: "User Management", module: "User Administration", priority: "P0 – Critical", status: "Live", bizType: "Internal",
    functionality: "Search/filter all users (by role/city/status/date), view full profiles, suspend/reactivate, impersonate (with audit), force logout, bulk export",
    description: "Platform-wide user control. Suspension cascades to all listings owned.",
    dataModel: "User",
    dataValues: "S.No · User ID · Full Name · Email · Phone · Role · City · KYC Status (Pending/Approved/Rejected) · Account Status (Active/Suspended/Deleted) · Created At · Last Login · Listings Count · Total Transactions (₹) · Action (View Profile / Suspend / Reactivate / Impersonate / Force Logout)",
    edgeCases: "Suspend venue owner → auto-suspend all their venues; Cannot delete user with pending refunds; Impersonation creates full audit trail; Bulk export includes PII → requires 2FA re-auth",
  },
  {
    sno: 11, pageName: "Venues & Listings Review", module: "Listing Governance", priority: "P0 – Critical", status: "Live", bizType: "Internal",
    functionality: "Review all venue/trainer/tournament listings, approve/reject/suspend, edit listing status, toggle featured, content moderation",
    description: "Quality control and trust management for all published listings.",
    dataModel: "VenueItem · TrainerItem · TournamentItem",
    dataValues: "S.No · Listing ID · Name · Type (Venue/Trainer/Tournament) · Owner Name · Sport · City · Listing Status (Active/Draft/Pending Review/Suspended) · Featured (Y/N) · Published (Y/N) · Reports Count · Created At · Last Reviewed · Action (Approve / Reject / Suspend / Feature / Edit)",
    edgeCases: "Auto-suspend listing with 3+ unresolved complaints; Featured toggle → visible within 5 min; Suspend cascades to all active bookings (notify players); Admin edits are audited with before/after diff",
  },
];

// ─── Role tabs definition ─────────────────────────────────────────────────────
const ROLES = [
  { key: "player",    label: "Player",       shortLabel: "Player",    color: "#FFC400", bg: "bg-sky-500", lightBg: "bg-sky-50", rows: PLAYER_ROWS,    biz: "B2C" },
  { key: "venue",     label: "Venue Owner",  shortLabel: "Venue",     color: "#3F718B", bg: "bg-blue-500",    lightBg: "bg-blue-50",    rows: VENUE_ROWS,     biz: "B2B" },
  { key: "trainer",   label: "Trainer",      shortLabel: "Trainer",   color: "#765A88", bg: "bg-violet-500",  lightBg: "bg-violet-50",  rows: TRAINER_ROWS,   biz: "B2B" },
  { key: "organizer", label: "Organizer",    shortLabel: "Organizer", color: "#C08B3E", bg: "bg-amber-500",   lightBg: "bg-amber-50",   rows: ORGANIZER_ROWS, biz: "B2B" },
  { key: "admin",     label: "Super Admin",  shortLabel: "Admin",     color: "#B84A4A", bg: "bg-red-500",     lightBg: "bg-red-50",     rows: ADMIN_ROWS,     biz: "Internal" },
];

// ─── Column definitions ───────────────────────────────────────────────────────
const COLUMNS = [
  { key: "sno",          label: "S.No",           width: "w-12",   minW: "min-w-[48px]" },
  { key: "pageName",     label: "Page Name",      width: "w-44",   minW: "min-w-[176px]" },
  { key: "module",       label: "Module",         width: "w-40",   minW: "min-w-[160px]" },
  { key: "functionality",label: "Functionality",  width: "w-64",   minW: "min-w-[256px]" },
  { key: "description",  label: "Description",    width: "w-56",   minW: "min-w-[224px]" },
  { key: "bizType",      label: "Business Type",  width: "w-28",   minW: "min-w-[112px]" },
  { key: "dataModel",    label: "Data Model",     width: "w-44",   minW: "min-w-[176px]" },
  { key: "dataValues",   label: "Data Values",    width: "w-80",   minW: "min-w-[320px]" },
  { key: "edgeCases",    label: "Edge Cases",     width: "w-64",   minW: "min-w-[256px]" },
  { key: "priority",     label: "Priority",       width: "w-28",   minW: "min-w-[112px]" },
  { key: "status",       label: "Status",         width: "w-24",   minW: "min-w-[96px]" },
];

// ─── Excel export ─────────────────────────────────────────────────────────────
function exportToExcel() {
  const wb = XLSX.utils.book_new();
  ROLES.forEach(role => {
    const headers = ["S.No","Page Name","Module","Functionality","Description","Business Type","Data Model","Data Values","Edge Cases","Priority","Status"];
    const data = role.rows.map(r => [
      r.sno, r.pageName, r.module, r.functionality, r.description,
      r.bizType, r.dataModel, r.dataValues, r.edgeCases, r.priority, r.status,
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    // Column widths
    ws["!cols"] = [6,22,20,45,38,14,22,55,45,16,12].map(w => ({ wch: w }));
    // Header style (SheetJS free tier doesn't do cell styles, but structure is correct)
    XLSX.utils.book_append_sheet(wb, ws, role.label);
  });
  XLSX.writeFile(wb, "InspirQ_PRD_Requirements.xlsx");
}

// ─── Inline cell renderer ─────────────────────────────────────────────────────
function Cell({ row, col }: { row: PRDRow; col: typeof COLUMNS[0] }) {
  const v = (row as any)[col.key];
  if (col.key === "bizType") {
    return <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-bold border ${BIZ_COLOR[v as BizType]}`}>{v}</span>;
  }
  if (col.key === "priority") {
    return <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-semibold border whitespace-nowrap ${PRI_COLOR[v as Priority]}`}>{v}</span>;
  }
  if (col.key === "status") {
    return (
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold border ${STA_COLOR[v as Status]}`}>
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STA_DOT[v as Status]}`} />{v}
      </span>
    );
  }
  if (col.key === "sno") {
    return <span className="text-xs font-mono text-[#7D8178]">{v}</span>;
  }
  return <span className="text-xs text-[#30342F] leading-relaxed whitespace-pre-line">{v}</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function PRDPage() {
  const [activeRole, setActiveRole] = useState(0);
  const [search, setSearch] = useState("");
  const [filterBiz, setFilterBiz] = useState("all");
  const [filterPri, setFilterPri] = useState("all");
  const [filterSta, setFilterSta] = useState("all");
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const role = ROLES[activeRole];

  const filtered = useMemo(() => {
    let rows = role.rows;
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        r.pageName.toLowerCase().includes(q) ||
        r.module.toLowerCase().includes(q) ||
        r.functionality.toLowerCase().includes(q) ||
        r.dataValues.toLowerCase().includes(q)
      );
    }
    if (filterBiz !== "all") rows = rows.filter(r => r.bizType === filterBiz);
    if (filterPri !== "all") rows = rows.filter(r => r.priority === filterPri);
    if (filterSta !== "all") rows = rows.filter(r => r.status === filterSta);
    if (sortCol) {
      rows = [...rows].sort((a, b) => {
        const av = String((a as any)[sortCol]);
        const bv = String((b as any)[sortCol]);
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return rows;
  }, [role, search, filterBiz, filterPri, filterSta, sortCol, sortDir]);

  const handleSort = (key: string) => {
    if (sortCol === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(key); setSortDir("asc"); }
  };

  const toggleRow = (sno: number) => {
    setExpandedRows(prev => {
      const n = new Set(prev);
      n.has(sno) ? n.delete(sno) : n.add(sno);
      return n;
    });
  };

  // Summary stats
  const liveCount = role.rows.filter(r => r.status === "Live").length;
  const p0Count   = role.rows.filter(r => r.priority === "P0 – Critical").length;

  return (
    <div className="min-h-screen bg-[#F7F7F3] flex flex-col">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-[#C9CBC2] px-6 py-4 shrink-0">
        <div className="max-w-full">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <FileSpreadsheet size={16} className="text-[#755900]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#755900]">Product Requirements Document</span>
              </div>
              <h1 className="text-xl font-bold text-[#181A1F]">InspirQ – PRD List</h1>
              <p className="text-xs text-[#5F635C] mt-0.5">
                {ROLES.reduce((s, r) => s + r.rows.length, 0)} pages across 5 roles &nbsp;·&nbsp;
                {ROLES.flatMap(r => r.rows).filter(r => r.status === "Live").length} live &nbsp;·&nbsp;
                Full A–Z page requirements with data values, edge cases & business type
              </p>
            </div>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-[#FFC400] hover:bg-[#D9A900] text-[#17140A] text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <Download size={15} /> Export as Excel (.xlsx)
            </button>
          </div>

          {/* Grand stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
            {ROLES.map(r => (
              <div key={r.key} className={`rounded-lg border-2 px-3 py-2 cursor-pointer transition-all ${activeRole === ROLES.indexOf(r) ? "border-current shadow-sm" : "border-transparent bg-white"}`}
                style={{ borderColor: activeRole === ROLES.indexOf(r) ? r.color : undefined, background: activeRole === ROLES.indexOf(r) ? r.color + "0D" : "white" }}
                onClick={() => { setActiveRole(ROLES.indexOf(r)); setSearch(""); setFilterBiz("all"); setFilterPri("all"); setFilterSta("all"); }}>
                <div className="font-['Lexend'] text-lg font-bold" style={{ color: r.color }}>{r.rows.length}</div>
                <div className="text-xs font-semibold text-[#30342F]">{r.label}</div>
                <div className="text-xs text-[#7D8178]">{r.biz}</div>
              </div>
            ))}
          </div>

          {/* Role tab bar */}
          <div className="flex gap-1 bg-[#DFE0D8] rounded-xl p-1 w-fit">
            {ROLES.map((r, i) => (
              <button key={r.key} onClick={() => { setActiveRole(i); setSearch(""); setFilterBiz("all"); setFilterPri("all"); setFilterSta("all"); setExpandedRows(new Set()); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeRole === i ? "text-white shadow-sm" : "text-[#464A45] hover:bg-white"}`}
                style={{ background: activeRole === i ? r.color : undefined }}>
                {r.shortLabel}
                <span className={`ml-1.5 text-xs px-1 rounded ${activeRole === i ? "bg-white/30 text-white" : "bg-[#C9CBC2] text-[#5F635C]"}`}>{r.rows.length}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="bg-white border-b border-[#DFE0D8] px-6 py-2.5 flex flex-wrap items-center gap-2 shrink-0">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7D8178]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search pages, modules, data…"
            className="w-full pl-7 pr-2.5 py-1.5 text-xs border border-[#C9CBC2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D6A500] bg-white" />
        </div>
        <select value={filterBiz} onChange={e => setFilterBiz(e.target.value)}
          className="text-xs border border-[#C9CBC2] rounded-lg px-2 py-1.5 bg-white focus:outline-none text-[#30342F]">
          <option value="all">All Business Types</option>
          <option value="B2C">B2C</option><option value="B2B">B2B</option>
          <option value="Internal">Internal</option><option value="B2C + B2B">B2C + B2B</option>
        </select>
        <select value={filterPri} onChange={e => setFilterPri(e.target.value)}
          className="text-xs border border-[#C9CBC2] rounded-lg px-2 py-1.5 bg-white focus:outline-none text-[#30342F]">
          <option value="all">All Priority</option>
          <option value="P0 – Critical">P0 – Critical</option><option value="P1 – High">P1 – High</option>
          <option value="P2 – Medium">P2 – Medium</option><option value="P3 – Low">P3 – Low</option>
        </select>
        <select value={filterSta} onChange={e => setFilterSta(e.target.value)}
          className="text-xs border border-[#C9CBC2] rounded-lg px-2 py-1.5 bg-white focus:outline-none text-[#30342F]">
          <option value="all">All Status</option>
          <option value="Live">Live</option><option value="Partial">Partial</option>
          <option value="Planned">Planned</option><option value="Backlog">Backlog</option>
        </select>
        {(search || filterBiz !== "all" || filterPri !== "all" || filterSta !== "all") && (
          <button onClick={() => { setSearch(""); setFilterBiz("all"); setFilterPri("all"); setFilterSta("all"); }}
            className="flex items-center gap-1 text-xs text-[#5F635C] hover:text-[#30342F] border border-[#C9CBC2] rounded-lg px-2 py-1.5">
            <X size={11} /> Clear
          </button>
        )}
        <div className="ml-auto flex items-center gap-3">
          <div className="text-xs text-[#5F635C]">
            Showing <span className="font-semibold text-[#222520]">{filtered.length}</span> of <span className="font-semibold text-[#222520]">{role.rows.length}</span> pages
            &nbsp;·&nbsp;<span className="text-sky-700 font-semibold">{liveCount} Live</span>
            &nbsp;·&nbsp;<span className="text-red-700 font-semibold">{p0Count} P0</span>
          </div>
        </div>
      </div>

      {/* ── Spreadsheet table ── */}
      <div className="flex-1 overflow-auto">
        <table className="w-max min-w-full border-collapse text-left">
          {/* Sticky header */}
          <thead className="sticky top-0 z-20">
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`${col.minW} px-3 py-2 bg-[#222520] text-[#DFE0D8] text-xs font-bold uppercase tracking-wider border-r border-[#30342F] cursor-pointer select-none whitespace-nowrap hover:bg-[#30342F] transition-colors`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortCol === col.key ? (
                      sortDir === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />
                    ) : (
                      <span className="opacity-30"><ChevronUp size={10} /></span>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-8 px-2 py-2 bg-[#222520] text-[#DFE0D8] text-xs font-bold uppercase tracking-wider" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="text-center py-20 text-[#7D8178]">
                  <div className="text-3xl mb-2">🔍</div>
                  <p className="text-sm font-medium">No pages match your filters</p>
                  <button onClick={() => { setSearch(""); setFilterBiz("all"); setFilterPri("all"); setFilterSta("all"); }}
                    className="mt-2 text-xs text-[#755900] underline">Clear filters</button>
                </td>
              </tr>
            ) : filtered.map((row, idx) => {
              const isOpen = expandedRows.has(row.sno);
              const isEven = idx % 2 === 0;
              return (
                <Fragment key={row.sno}>
                  <tr
                    className={`border-b border-[#DFE0D8] hover:bg-[#FFC400]/5 transition-colors cursor-pointer ${isEven ? "bg-white" : "bg-[#F7F7F3]/70"}`}
                    onClick={() => toggleRow(row.sno)}
                  >
                    {COLUMNS.map(col => (
                      <td key={col.key} className={`${col.minW} px-3 py-2 border-r border-[#DFE0D8] align-top`}>
                        <Cell row={row} col={col} />
                      </td>
                    ))}
                    <td className="px-2 py-2 align-top">
                      <span className="text-[#A5A89E] hover:text-[#5F635C]">
                        {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </span>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="bg-[#FFC400]/5 border-b border-[#D6A500]/20">
                      <td colSpan={COLUMNS.length + 1} className="px-6 py-4">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                          <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-[#5F635C] mb-1.5">Full Functionality</div>
                            <p className="text-[#30342F] leading-relaxed">{row.functionality}</p>
                          </div>
                          <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-[#5F635C] mb-1.5">Description</div>
                            <p className="text-[#30342F] leading-relaxed">{row.description}</p>
                          </div>
                          <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1.5">⚠ Edge Cases</div>
                            <p className="text-[#30342F] leading-relaxed whitespace-pre-line">{row.edgeCases}</p>
                          </div>
                          <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1.5">📊 Data Values</div>
                            <p className="text-[#30342F] leading-relaxed font-mono text-xs whitespace-pre-line">{row.dataValues}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div className="bg-white border-t border-[#DFE0D8] px-6 py-2.5 flex items-center justify-between shrink-0">
        <span className="text-xs text-[#7D8178]">InspirQ Platform · PRD v1.0 · {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
        <button onClick={exportToExcel}
          className="flex items-center gap-1.5 text-xs text-[#755900] font-semibold hover:underline">
          <Download size={12} /> Export Excel
        </button>
      </div>
    </div>
  );
}
