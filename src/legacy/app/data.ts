export type Role = "guest" | "player" | "venue" | "trainer" | "organizer" | "admin";
export type Page =
  | "landing" | "auth" | "player-home" | "player-venues" | "player-bookings"
  | "player-games" | "player-tournaments" | "player-training" | "player-scorecard"
  | "player-wallet" | "player-profile" | "player-achievements" | "player-search"
  | "player-my-games" | "player-bookmarks"
  | "venue-dashboard" | "venue-list" | "venue-bookings" | "venue-slots"
  | "venue-equipment" | "venue-revenue" | "venue-analytics" | "venue-customers"
  | "venue-prebooking" | "venue-whatsapp" | "venue-checkin" | "venue-bulk"
  | "venue-invoice"
  | "venue-codes"
  | "trainer-dashboard" | "trainer-sessions" | "trainer-students" | "trainer-schedule"
  | "trainer-revenue" | "trainer-attendance" | "trainer-profile" | "trainer-whatsapp"
  | "trainer-invoice"
  | "trainer-codes"
  | "organizer-dashboard" | "organizer-tournaments" | "organizer-registrations"
  | "organizer-brackets" | "organizer-revenue" | "organizer-analytics" | "organizer-whatsapp"
  | "organizer-scorecard" | "organizer-invoice" | "organizer-pos"
  | "organizer-codes"
  | "admin-dashboard" | "admin-users" | "admin-venues" | "admin-revenue"
  | "admin-subscriptions" | "admin-settings" | "admin-kyc" | "admin-attributes" | "admin-pricing"
  | "admin-codes"
  | "support" | "notifications" | "privacy-policy" | "terms"
  | "account-settings" | "payment-billing"
  | "about-us" | "help-center" | "cookie-policy"
  | "venue-detail" | "tournament-detail" | "game-detail" | "coach-detail"
  | "venue-pos" | "venue-expenses" | "venue-subscriptions" | "venue-ai-insights" | "venue-data-settings" | "venue-corporate" | "venue-recurring"
  | "trainer-pos" | "trainer-expenses" | "trainer-subscriptions" | "trainer-ai-insights" | "trainer-data-settings" | "trainer-equipment" | "trainer-sessions-list"
  | "trainer-leads" | "trainer-programs" | "organizer-operations" | "admin-disputes"
  | "player-settings" | "player-checkout"
  | "player-invoices"
  | "support-tickets"
  | "prd"
  | "design-system"
  | "checkout"
  | "venue-analytics-combined";

export const SPORTS = [
  { id: "badminton", label: "Badminton", icon: "🏸" },
  { id: "football", label: "Football", icon: "⚽" },
  { id: "cricket", label: "Cricket", icon: "🏏" },
  { id: "basketball", label: "Basketball", icon: "🏀" },
  { id: "tennis", label: "Tennis", icon: "🎾" },
  { id: "squash", label: "Squash", icon: "🏸" },
  { id: "volleyball", label: "Volleyball", icon: "🏐" },
  { id: "swimming", label: "Swimming", icon: "🏊" },
  { id: "boxing", label: "Boxing", icon: "🥊" },
  { id: "yoga", label: "Yoga", icon: "🧘" },
  { id: "skating", label: "Skating", icon: "⛸️" },
  { id: "cycling", label: "Cycling", icon: "🚴" },
];

export const CITIES = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad"];

export type ListingStatus = "active" | "draft" | "pending_review" | "suspended";

// Derived item types — defined here so any file can import them without creating circular deps
export type VenueItem = {
  id: number; name: string; sport: string; location: string; price: number;
  rating: number; reviews: number; image: string; amenities: string[];
  verified: boolean; available: boolean; slots: string[]; owner: string;
  description: string; listingStatus: ListingStatus; published: boolean; featured: boolean;
};
export type TrainerItem = {
  id: number; name: string; sport: string; experience: string; rating: number;
  students: number; fee: number; location: string; cert: string; image: string;
  verified: boolean; bio: string; specializations: string[];
  coachingModes?: string[]; levels?: string[]; languages?: string[]; ageGroups?: string[];
  responseTime?: string; trialAvailable?: boolean; groupFee?: number; onlineFee?: number;
  homeVenue?: string; availability?: string[]; achievements?: string[];
  methodology?: string; reviewCount?: number;
  listingStatus: ListingStatus; published: boolean;
};
export type TournamentItem = {
  id: number; name: string; sport: string; date: string; venue: string;
  prize: string; slots: number; filled: number; fee: number; status: string;
  organizer: string; image: string; description: string;
  format?: string; level?: string; categories?: string[]; ageGroup?: string;
  registrationDeadline?: string; checkInTime?: string; rules?: string[];
  inclusions?: string[]; contact?: string; refundPolicy?: string;
  organizerVerified?: boolean; organizerEvents?: number; organizerRating?: number;
  listingStatus: ListingStatus; published: boolean; createdBy: string;
};
export type GameItem = {
  id: number; sport: string; venue: string; date: string; time: string;
  slots: number; filled: number; level: string; fee: number; host: string;
  icon: string; listingStatus: ListingStatus; published: boolean; createdBy: string;
};
export type CoachSessionItem = {
  id: number; name: string; sport: string; date: string; time: string;
  venue: string; maxStudents: number; enrolled: number; price: number;
  level: string; status: "upcoming" | "completed" | "cancelled";
  published: boolean; image: string; description: string;
};

export const COACH_SESSIONS_STORAGE_KEY = "inspirq-coach-sessions-v1";
export const COACH_SESSIONS: CoachSessionItem[] = [
  { id: 1, name: "Advanced Footwork Clinic", sport: "Badminton", date: "2026-07-19", time: "07:00–09:00", venue: "Court Masters Arena", maxStudents: 10, enrolled: 8, price: 1200, level: "Advanced", status: "upcoming", published: true, image: "/inspirq-media/badminton.png", description: "Intensive footwork, recovery movement, and match-positioning drills." },
  { id: 2, name: "Tennis Serve Masterclass", sport: "Tennis", date: "2026-07-20", time: "17:00–19:00", venue: "Ace Tennis Academy", maxStudents: 8, enrolled: 5, price: 1500, level: "Intermediate", status: "upcoming", published: true, image: "/inspirq-media/tennis.png", description: "Serve technique with video feedback and individual correction." },
  { id: 3, name: "Beginner Badminton Batch", sport: "Badminton", date: "2026-07-14", time: "06:00–07:30", venue: "Court Masters Arena", maxStudents: 12, enrolled: 10, price: 800, level: "Beginner", status: "completed", published: true, image: "/inspirq-media/badminton.png", description: "Foundational grip, stance, movement, and rally skills." },
  { id: 4, name: "Group Conditioning", sport: "Fitness", date: "2026-07-21", time: "06:00–07:00", venue: "Court Masters Arena", maxStudents: 15, enrolled: 6, price: 600, level: "All Levels", status: "upcoming", published: false, image: "/inspirq-media/tennis.png", description: "Sports-specific conditioning and injury-prevention training." },
];

export const VENUES: VenueItem[] = [
  { id: 1, name: "Green Valley Sports Complex", sport: "Football", location: "Koramangala, Bangalore", price: 2200, rating: 4.8, reviews: 124, image: "/inspirq-media/football.png", amenities: ["Restroom", "Parking", "Changing Room", "Floodlights"], verified: true, available: true, slots: ["06:00", "08:00", "10:00", "16:00", "18:00", "20:00"], owner: "Rajesh Kumar", description: "Premium football complex with floodlit synthetic turf. Perfect for 5-a-side and 7-a-side games.", listingStatus: "active" as ListingStatus, published: true, featured: true },
  { id: 2, name: "Court Masters Indoor Arena", sport: "Badminton", location: "Indiranagar, Bangalore", price: 800, rating: 4.6, reviews: 89, image: "/inspirq-media/badminton.png", amenities: ["AC", "Restroom", "Changing Room", "Shower", "Café"], verified: true, available: true, slots: ["06:00", "07:00", "08:00", "17:00", "18:00", "19:00", "20:00"], owner: "Priya Nair", description: "Fully air-conditioned indoor arena with 4 professional badminton courts. Best facility in Indiranagar.", listingStatus: "active" as ListingStatus, published: true, featured: false },
  { id: 3, name: "Sunset Football Turf", sport: "Football", location: "West End, Bangalore", price: 3200, rating: 4.5, reviews: 67, image: "/inspirq-media/football.png", amenities: ["Restroom", "Parking", "Floodlights", "Equipment Rental"], verified: true, available: false, slots: ["16:00", "18:00", "20:00"], owner: "Amit Singh", description: "Outdoor football turf with floodlights. Equipment rental available. Great for evening games.", listingStatus: "active" as ListingStatus, published: true, featured: false },
  { id: 4, name: "Ace Tennis Academy", sport: "Tennis", location: "Jayanagar, Bangalore", price: 1500, rating: 4.9, reviews: 201, image: "/inspirq-media/tennis.png", amenities: ["Restroom", "Changing Room", "Shower", "Gym", "Café"], verified: true, available: true, slots: ["06:00", "07:00", "08:00", "10:00", "16:00", "17:00", "18:00"], owner: "Deepa Menon", description: "Two ITF-standard clay courts with a strength gym and café. Bangalore's top tennis facility.", listingStatus: "active" as ListingStatus, published: true, featured: true },
  { id: 5, name: "BasketBall Zone", sport: "Basketball", location: "HSR Layout, Bangalore", price: 1200, rating: 4.3, reviews: 45, image: "/inspirq-media/football.png", amenities: ["AC", "Restroom", "Parking"], verified: false, available: true, slots: ["08:00", "10:00", "16:00", "18:00", "20:00"], owner: "Vikram Rao", description: "Indoor basketball court with full-size court markings, AC, and spectator seating.", listingStatus: "pending_review" as ListingStatus, published: false, featured: false },
  { id: 6, name: "Cricket Ground Pro", sport: "Cricket", location: "Whitefield, Bangalore", price: 5000, rating: 4.7, reviews: 88, image: "/inspirq-media/football.png", amenities: ["Pitch", "Nets", "Restroom", "Parking", "Scoreboard"], verified: true, available: true, slots: ["06:00", "09:00", "14:00", "17:00"], owner: "Suresh Patel", description: "Full-size turf cricket ground with electronic scoreboard, practice nets, and changing rooms.", listingStatus: "active" as ListingStatus, published: true, featured: false },
];

export const BOOKINGS = [
  { id: "BK001", venue: "Court Masters Indoor Arena", sport: "Badminton", date: "2026-07-12", time: "07:00", duration: "1hr", amount: 800, status: "confirmed", players: 4 },
  { id: "BK002", venue: "Green Valley Sports Complex", sport: "Football", date: "2026-07-14", time: "18:00", duration: "1hr", amount: 2200, status: "confirmed", players: 10 },
  { id: "BK003", venue: "Ace Tennis Academy", sport: "Tennis", date: "2026-07-08", time: "06:00", duration: "1hr", amount: 1500, status: "completed", players: 2 },
  { id: "BK004", venue: "Sunset Football Turf", sport: "Football", date: "2026-07-05", time: "20:00", duration: "1hr", amount: 3200, status: "cancelled", players: 10 },
];

export const TOURNAMENTS: TournamentItem[] = [
  { id: 1, name: "Weekend Warriors Badminton Cup", sport: "Badminton", date: "2026-07-19", venue: "Court Masters Indoor Arena", prize: "₹15,000", slots: 16, filled: 12, fee: 500, status: "open", organizer: "Sports Hub Events", image: "/inspirq-media/badminton.png", description: "An exciting singles and doubles knockout tournament for intermediate community players.", format: "Single elimination", level: "Intermediate", categories: ["Men's Singles", "Women's Singles", "Open Doubles"], ageGroup: "16+", registrationDeadline: "2026-07-17", checkInTime: "07:00", rules: ["BWF rules apply", "Best of 3 games to 21", "Report 30 minutes before first match"], inclusions: ["Match shuttles", "Hydration", "Digital certificates"], contact: "+91 98765 44001", refundPolicy: "Full refund until 72 hours before the event", organizerVerified: true, organizerEvents: 28, organizerRating: 4.8, listingStatus: "active" as ListingStatus, published: true, createdBy: "organizer" },
  { id: 2, name: "Premier Football League S3", sport: "Football", date: "2026-07-26", venue: "Green Valley Sports Complex", prize: "₹50,000", slots: 8, filled: 6, fee: 2000, status: "open", organizer: "Bangalore Football Club", image: "/inspirq-media/football.png", description: "Season 3 of Bangalore's popular 7-a-side league with round-robin groups and knockouts.", format: "League + knockout", level: "Open", categories: ["7v7 Team"], ageGroup: "18+", registrationDeadline: "2026-07-22", checkInTime: "06:30", rules: ["Maximum 10-player squad", "Rolling substitutions", "Studs required"], inclusions: ["Referees", "Match recording", "Player analytics"], contact: "+91 98765 44002", refundPolicy: "Team refund until fixture publication", organizerVerified: true, organizerEvents: 16, organizerRating: 4.7, listingStatus: "active" as ListingStatus, published: true, createdBy: "organizer" },
  { id: 3, name: "Summer Smash Tennis Open", sport: "Tennis", date: "2026-08-02", venue: "Ace Tennis Academy", prize: "₹25,000", slots: 32, filled: 28, fee: 800, status: "filling_fast", organizer: "ACE Tennis Academy", image: "/inspirq-media/tennis.png", description: "A competitive tennis open with singles and mixed doubles categories.", format: "Knockout", level: "Intermediate–Advanced", categories: ["Men's Singles", "Women's Singles", "Mixed Doubles"], ageGroup: "14+", registrationDeadline: "2026-07-29", checkInTime: "06:00", rules: ["AITA rules", "Best of 3 short sets"], inclusions: ["ITF balls", "Umpires", "Recovery station"], contact: "+91 98765 44003", refundPolicy: "80% refund until 5 days before event", organizerVerified: true, organizerEvents: 34, organizerRating: 4.9, listingStatus: "active" as ListingStatus, published: true, createdBy: "organizer" },
  { id: 4, name: "Corporate Cricket T10", sport: "Cricket", date: "2026-08-09", venue: "Cricket Ground Pro", prize: "₹1,00,000", slots: 12, filled: 12, fee: 3000, status: "full", organizer: "CricStar Events", image: "/inspirq-media/football.png", description: "A professionally produced T10 corporate cricket league.", format: "Groups + knockout", level: "Corporate", categories: ["T10 Team"], ageGroup: "18+", registrationDeadline: "2026-08-01", checkInTime: "06:00", rules: ["Company ID required", "15-player squad"], inclusions: ["Officials", "Live scoring", "Team photos"], contact: "+91 98765 44004", refundPolicy: "Non-refundable after draw publication", organizerVerified: true, organizerEvents: 21, organizerRating: 4.6, listingStatus: "active" as ListingStatus, published: true, createdBy: "organizer" },
];

export const TRAINERS: TrainerItem[] = [
  { id: 1, name: "Coach Arjun Mehta", sport: "Badminton", experience: "8 years", rating: 4.9, students: 45, fee: 1200, location: "Indiranagar, Bangalore", cert: "BWF Level 2", image: "/inspirq-media/coach-avatar.svg", verified: true, bio: "BWF Level 2 coach helping committed players build efficient movement, reliable technique, and match confidence.", specializations: ["Footwork", "Smash Technique", "Match Strategy", "Tournament Prep"], coachingModes: ["Private", "Group", "Online"], levels: ["Beginner", "Intermediate", "Competitive"], languages: ["English", "Hindi", "Kannada"], ageGroups: ["10–15", "16–25", "Adults"], responseTime: "< 1 hour", trialAvailable: true, groupFee: 450, onlineFee: 700, homeVenue: "Court Masters Indoor Arena", availability: ["Mon–Fri mornings", "Tue/Thu evenings"], achievements: ["Coached 3 state medalists", "Former state doubles player"], methodology: "Assessment-led plans combining movement, technical repetitions, match scenarios, and monthly progress reviews.", reviewCount: 126, listingStatus: "active" as ListingStatus, published: true },
  { id: 2, name: "Coach Sneha Iyer", sport: "Tennis", experience: "6 years", rating: 4.8, students: 32, fee: 1500, location: "Jayanagar, Bangalore", cert: "AITA Certified", image: "/inspirq-media/coach-avatar.svg", verified: true, bio: "AITA-certified former state player specializing in serve mechanics and confident match play.", specializations: ["Serve & Return", "Net Play", "Baseline Rally", "Fitness Training"], coachingModes: ["Private", "Group"], levels: ["Beginner", "Intermediate", "Advanced"], languages: ["English", "Hindi", "Tamil"], ageGroups: ["8–14", "15–21", "Adults"], responseTime: "< 2 hours", trialAvailable: true, groupFee: 600, onlineFee: 900, homeVenue: "Ace Tennis Academy", availability: ["Weekday evenings", "Weekend mornings"], achievements: ["12 city-ranked students"], methodology: "Video-supported technique correction with tactical point construction and measurable weekly goals.", reviewCount: 94, listingStatus: "active" as ListingStatus, published: true },
  { id: 3, name: "Coach Ravi Shankar", sport: "Football", experience: "10 years", rating: 4.7, students: 60, fee: 1000, location: "Koramangala, Bangalore", cert: "AFC D License", image: "/inspirq-media/football.png", verified: true, bio: "AFC-licensed coach developing technically capable, tactically aware footballers.", specializations: ["Dribbling & Finishing", "Tactical Play", "Set Pieces", "Fitness & Conditioning"], coachingModes: ["Private", "Team", "Group"], levels: ["Foundation", "Development", "Competitive"], languages: ["English", "Hindi", "Kannada"], ageGroups: ["6–10", "11–16", "Adults"], responseTime: "< 3 hours", trialAvailable: false, groupFee: 350, onlineFee: 600, homeVenue: "Green Valley Sports Complex", availability: ["Weekday evenings", "Saturday"], achievements: ["AFC D License", "Youth league finalist coach"], methodology: "Game-based learning supported by technical stations, decision-making constraints, and player feedback.", reviewCount: 81, listingStatus: "active" as ListingStatus, published: true },
];

export const TESTIMONIALS = [
  { name: "Rohit Sharma", sport: "Badminton player", text: "InspirQ made booking so seamless! Found a court near me within 2 minutes. The verified badges give so much confidence. Love the rewards system too!", rating: 5, avatar: "RS" },
  { name: "Priya Thomas", sport: "Football enthusiast", text: "As a working professional, I love how I can book venues at odd hours. The app reminds me of my sessions and the squad feature is amazing for organising games.", rating: 5, avatar: "PT" },
  { name: "Arjun Dev", sport: "Tennis player", text: "The trainer discovery feature connected me with my current coach. My game improved drastically in 3 months. InspirQ is more than just booking - it's a community.", rating: 5, avatar: "AD" },
];

export const ADMIN_STATS = { totalUsers: 48320, newUsers: 1240, venues: 892, trainers: 345, organizers: 128, revenue: 2847500, mrr: 485000, arpu: 320 };

export const OPEN_GAMES: GameItem[] = [
  { id: 1, sport: "Badminton", venue: "Court Masters Indoor Arena", date: "2026-07-13", time: "07:00", slots: 4, filled: 2, level: "Intermediate", fee: 200, host: "Rohit S.", icon: "🏸", listingStatus: "active" as ListingStatus, published: true, createdBy: "player" },
  { id: 2, sport: "Football", venue: "Green Valley Sports Complex", date: "2026-07-13", time: "18:00", slots: 14, filled: 8, level: "All Levels", fee: 300, host: "Priya M.", icon: "⚽", listingStatus: "active" as ListingStatus, published: true, createdBy: "player" },
  { id: 3, sport: "Basketball", venue: "BasketBall Zone", date: "2026-07-14", time: "06:00", slots: 10, filled: 6, level: "Beginner", fee: 150, host: "Dev A.", icon: "🏀", listingStatus: "active" as ListingStatus, published: true, createdBy: "player" },
  { id: 4, sport: "Tennis", venue: "Ace Tennis Academy", date: "2026-07-15", time: "17:00", slots: 4, filled: 1, level: "Advanced", fee: 400, host: "Sneha I.", icon: "🎾", listingStatus: "active" as ListingStatus, published: true, createdBy: "player" },
];

export const SCORECARD_DATA = [
  { id: 1, match: "Doubles Badminton", partner: "Rohit S.", opponent: "Karan M. & Dev A.", venue: "Court Masters", date: "Jul 8, 2026", result: "W", myScore: "21-18, 21-15", duration: "45 min" },
  { id: 2, match: "Singles Badminton", partner: "—", opponent: "Arjun D.", venue: "Court Masters", date: "Jul 5, 2026", result: "L", myScore: "18-21, 19-21", duration: "38 min" },
  { id: 3, match: "Football 5v5", partner: "Team InspirQ", opponent: "Team Blasters", venue: "Green Valley", date: "Jul 3, 2026", result: "W", myScore: "3-1", duration: "90 min" },
  { id: 4, match: "Singles Tennis", partner: "—", opponent: "Sneha I.", venue: "Ace Tennis", date: "Jun 28, 2026", result: "W", myScore: "6-4, 6-3", duration: "65 min" },
];

export const VENUE_BOOKINGS_DATA = [
  { id: "VB001", player: "Rohit Sharma", sport: "Badminton", court: "Court 1", date: "2026-07-12", time: "06:00", duration: "1hr", amount: 800, status: "confirmed", phone: "+91 98765 11111" },
  { id: "VB002", player: "Priya Menon", sport: "Badminton", court: "Court 2", date: "2026-07-12", time: "07:00", duration: "1hr", amount: 800, status: "confirmed", phone: "+91 98765 22222" },
  { id: "VB003", player: "TCS Corporate", sport: "Badminton", court: "All Courts", date: "2026-07-12", time: "18:00", duration: "2hr", amount: 3200, status: "confirmed", phone: "+91 98765 33333" },
  { id: "VB004", player: "Arjun Dev", sport: "Badminton", court: "Court 1", date: "2026-07-11", time: "08:00", duration: "1hr", amount: 800, status: "completed", phone: "+91 98765 44444" },
  { id: "VB005", player: "Karan Mehta", sport: "Badminton", court: "Court 3", date: "2026-07-10", time: "19:00", duration: "1hr", amount: 800, status: "cancelled", phone: "+91 98765 55555" },
];

export const MONTHLY_REVENUE = [
  { month: "Jan", revenue: 68600, bookings: 48200, equipment: 8400, corporate: 12000 },
  { month: "Feb", revenue: 76300, bookings: 52100, equipment: 9200, corporate: 15000 },
  { month: "Mar", revenue: 90200, bookings: 61400, equipment: 10800, corporate: 18000 },
  { month: "Apr", revenue: 82100, bookings: 58300, equipment: 9800, corporate: 14000 },
  { month: "May", revenue: 101000, bookings: 67800, equipment: 11200, corporate: 22000 },
  { month: "Jun", revenue: 105600, bookings: 74200, equipment: 12400, corporate: 19000 },
  { month: "Jul", revenue: 84500, bookings: 62400, equipment: 12800, corporate: 9300 },
];

export const NOTIFICATIONS_DATA = [
  { id: 1, title: "Booking Confirmed", body: "Court Masters Arena · Jul 12 · 07:00 AM", time: "2 min ago", read: false, type: "booking" },
  { id: 2, title: "Tournament Registration Open", body: "Weekend Warriors Badminton Cup — register now!", time: "1 hr ago", read: false, type: "tournament" },
  { id: 3, title: "New Message from Coach", body: "Coach Arjun Mehta sent you a message", time: "3 hrs ago", read: false, type: "message" },
  { id: 4, title: "Payment Successful", body: "₹800 paid for Badminton slot booking", time: "Yesterday", read: true, type: "payment" },
  { id: 5, title: "Venue Review Request", body: "How was your session at Green Valley?", time: "2 days ago", read: true, type: "review" },
  { id: 6, title: "InspirQ Coins Earned", body: "You earned 50 coins for your last booking!", time: "3 days ago", read: true, type: "reward" },
];

export const BADGES = [
  { id: 1, name: "First Booking", icon: "🎯", desc: "Made your first court booking", earned: true, earnedDate: "Jan 2026", rarity: "common" },
  { id: 2, name: "Hat Trick", icon: "🎩", desc: "Booked 3 sessions in a week", earned: true, earnedDate: "Feb 2026", rarity: "uncommon" },
  { id: 3, name: "Weekend Warrior", icon: "⚔️", desc: "Played every weekend for a month", earned: true, earnedDate: "Mar 2026", rarity: "rare" },
  { id: 4, name: "Social Butterfly", icon: "🦋", desc: "Joined 10 open games with strangers", earned: true, earnedDate: "Apr 2026", rarity: "uncommon" },
  { id: 5, name: "Tournament Champion", icon: "🏆", desc: "Won your first tournament", earned: true, earnedDate: "May 2026", rarity: "epic" },
  { id: 6, name: "Multi-Sport", icon: "🌟", desc: "Played 5 different sports", earned: false, earnedDate: null, rarity: "rare" },
  { id: 7, name: "Century Club", icon: "💯", desc: "Complete 100 bookings", earned: false, earnedDate: null, rarity: "legendary" },
  { id: 8, name: "Referral King", icon: "👑", desc: "Refer 10 friends who make a booking", earned: false, earnedDate: null, rarity: "epic" },
  { id: 9, name: "Streak Master", icon: "🔥", desc: "7-day booking streak", earned: false, earnedDate: null, rarity: "rare" },
];

export const LEADERBOARD = [
  { rank: 1, name: "Rohit S.", city: "Bangalore", sport: "Badminton", coins: 8420, badge: "🥇" },
  { rank: 2, name: "Priya M.", city: "Mumbai", sport: "Football", coins: 7180, badge: "🥈" },
  { rank: 3, name: "Arjun D.", city: "Bangalore", sport: "Tennis", coins: 6950, badge: "🥉" },
  { rank: 4, name: "You", city: "Bangalore", sport: "Badminton", coins: 1240, badge: "—", isMe: true },
  { rank: 5, name: "Karan M.", city: "Hyderabad", sport: "Cricket", coins: 1180, badge: "—" },
];

export const FAQS = [
  { q: "How do I cancel a booking?", a: "Go to My Bookings, select the booking, and tap Cancel. Cancellations made 4+ hours before the slot receive a full refund to your wallet." },
  { q: "How long does KYC verification take?", a: "KYC is typically verified within 24–48 working hours. You will receive an email and in-app notification once approved." },
  { q: "Can I extend my slot at the venue?", a: "Yes! If the next slot is available, you can request an extension directly at the venue or via the app. Additional charges apply." },
  { q: "How do InspirQ Coins work?", a: "You earn coins for every booking, game played, or referral. Coins can be redeemed for discounts on future bookings. 100 coins = ₹10 off." },
  { q: "What is the refund policy?", a: "Full refund if cancelled 4+ hours before. 50% refund between 2–4 hours. No refund within 2 hours of the slot start time." },
];

export const POS_ITEMS = [
  { id: 1, name: "Badminton Shuttle (tube)", category: "Equipment", price: 120, stock: 48 },
  { id: 2, name: "Grip Tape", category: "Equipment", price: 80, stock: 30 },
  { id: 3, name: "Water Bottle 500ml", category: "Beverages", price: 30, stock: 100 },
  { id: 4, name: "Energy Drink", category: "Beverages", price: 60, stock: 40 },
  { id: 5, name: "Racket Rental (per hr)", category: "Rental", price: 100, stock: 12 },
  { id: 6, name: "Sports Towel", category: "Accessories", price: 150, stock: 20 },
  { id: 7, name: "Knee Brace", category: "Accessories", price: 350, stock: 10 },
];

export const EXPENSE_CATEGORIES = ["Rent/Lease", "Electricity", "Water", "Staff Salary", "Equipment Purchase", "Maintenance & Repair", "Marketing", "Insurance", "Internet & Software", "Miscellaneous"];

export const SUPPORT_CATEGORIES = ["Booking Issue", "Payment Problem", "Venue Complaint", "Technical Bug", "Refund Request", "Account Issue", "Other"];
