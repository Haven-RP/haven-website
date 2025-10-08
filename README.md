# HavenRP Website

> **Serious Stories. Serious Fun.**

Modern, futuristic website for HavenRP - a FiveM roleplay server. Built with React, TypeScript, and a cyberpunk-inspired neon design system.

![HavenRP](public/havenrp-logo.png)

## 🚀 Features

### Public Pages
- **Homepage** - Hero section with live server stats, feature showcase, and call-to-action buttons
- **Rules** - Comprehensive server rules with search functionality and sidebar navigation
- **About** - Server story, values, and feature highlights
- **Staff** - Team showcase with roles, bios, and avatars
- **Join/Apply** - Server requirements and joining instructions
- **Wiki** - Embedded Notion documentation

### Authenticated Features
- **Discord OAuth** - One-click authentication via Supabase
- **Dashboard** - Member area with Discord role-based content gating
- **My Characters** - View FiveM characters with detailed stats and inventory
  - Character cards with money, health, job, and gang info
  - Click-to-copy phone numbers and citizen IDs
  - Full inventory modal with item metadata
- **Account Dropdown** - Streamlined user menu in navigation

### Real-Time Integrations
- **Live Server Stats** - FiveM player count and server status
- **Discord Members** - Real-time Discord online member count
- **Discord Roles** - Automatic role fetching and display
- **Character Data** - Live FiveM character and inventory sync

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with custom neon theme
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Routing:** React Router v6
- **State Management:** TanStack Query (React Query)
- **Authentication:** Supabase (Discord OAuth)
- **Icons:** Lucide React + React Icons

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/haven-website.git
cd haven-website

# Install dependencies
npm install
# or
bun install

# Set up environment variables (see below)
cp .env.example .env.local

# Start development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_KEY=your-supabase-anon-key

# HavenRP API
VITE_DISCORD_ROLES_API_URL=https://api.haven-rp.com/api/discord/roles
VITE_HAVEN_API_KEY=your-havenrp-api-key
```

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Enable Discord OAuth in Authentication > Providers
3. Add your Discord app credentials
4. Set redirect URL to `https://yourdomain.com/`
5. Add `VITE_HAVEN_API_KEY` to Supabase Secrets

## 📁 Project Structure

```
haven-website/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Navigation.tsx  # Site navigation with auth
│   │   ├── Footer.tsx      # Site footer
│   │   ├── StatsStrip.tsx  # Live server stats
│   │   └── ...
│   ├── pages/              # Route pages
│   │   ├── Index.tsx       # Homepage
│   │   ├── Dashboard.tsx   # Member dashboard
│   │   ├── MyCharacters.tsx # FiveM characters
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useDiscordRoles.ts
│   │   ├── useFivemCharacters.ts
│   │   ├── useFivemStats.ts
│   │   └── ...
│   ├── config/             # Site configuration
│   │   └── site.ts         # Centralized config
│   ├── integrations/       # Third-party integrations
│   │   └── supabase/       # Supabase client
│   ├── lib/                # Utility functions
│   └── assets/             # Images and static files
├── public/                 # Public static files
└── ...
```

## 🎨 Design System

### Color Palette
- **Primary (Neon Cyan):** `#00D9FF` - Main accents, links
- **Secondary (Electric Magenta):** `#FF00FF` - Secondary accents
- **Accent (Deep Purple):** `hsl(271 76% 53%)` - Tertiary accents
- **Blue Accent:** `#0099FF` - Additional highlights
- **Background:** Pure black with glass morphism overlays

### Typography
- **Headings:** Poppins / Montserrat (bold, -2% letter spacing)
- **Body:** Inter (400-600 weight)

### Effects
- Neon glows on hover
- Glass morphism cards
- Floating animations
- Smooth scrolling ticker

## 🔌 API Integration

### HavenRP Backend API

The website integrates with a custom HavenRP backend API:

#### Discord Roles
```
GET https://api.haven-rp.com/api/discord/roles/{discordId}
Headers: X-API-Key: {VITE_HAVEN_API_KEY}
```

#### User Characters
```
GET https://api.haven-rp.com/api/fivem/user/{discordId}/characters
Headers: X-API-Key: {VITE_HAVEN_API_KEY}
```

#### Character Details
```
GET https://api.haven-rp.com/api/fivem/character/{citizenid}
Headers: X-API-Key: {VITE_HAVEN_API_KEY}
```

### FiveM Server API
```
GET https://servers-frontend.fivem.net/api/servers/single/{serverCode}
```

### Discord Widget API
```
GET https://discord.com/api/guilds/{guildId}/widget.json
```

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server (port 8080)

# Build
npm run build        # Production build
npm run build:dev    # Development build

# Preview
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Build
```bash
npm run build
# Upload dist/ folder to your hosting
```

## 🎯 Configuration

Edit `src/config/site.ts` to customize:

```typescript
export const siteConfig = {
  // FiveM Server
  cfxCode: "kbv7mv",
  fivemConnect: "cfx.re/join/kbv7mv",
  
  // Discord
  discordInvite: "https://discord.gg/havenrp",
  discordGuildId: "1381585365466611732",
  
  // Server Info
  serverName: "HavenRP",
  serverTagline: "Serious Stories. Serious Fun.",
  maxPlayers: 256,
  
  // Social Links
  reddit: "https://www.reddit.com/r/HavenRP/",
  tiktok: "https://www.tiktok.com/@_haven_rp_",
  youtube: "https://www.youtube.com/@Haven-City",
  medal: "https://medal.tv/...",
  
  // News Ticker
  newsTicker: [
    { date: "2025-10-19T00:00:00Z", event: "Flying High Race" }
  ],
};
```

## 🔒 Authentication Flow

1. User clicks "Sign In" button
2. Supabase initiates Discord OAuth
3. User authorizes on Discord
4. Redirected back to homepage
5. Discord ID extracted from session
6. API calls fetch roles and characters
7. Dashboard and My Characters pages populate

## 🎮 Features in Detail

### Role-Based Content Gating
Dashboard shows different content based on Discord roles:
- **Staff/Admin** - Staff resources and tools
- **VIP/Supporter** - Exclusive perks section
- **All Members** - General resources

### Character Management
- View all characters linked to Discord account
- See real-time stats (money, health, armor)
- Browse complete inventory with weapon details
- Copy phone numbers and citizen IDs with one click

### Live Stats
- Real-time FiveM server player count
- Discord online members
- Server status indicator
- Auto-refresh every 60 seconds

## 📚 Documentation

- [My Characters Feature](./MY_CHARACTERS_FEATURE.md)
- [Discord Roles Setup](./DISCORD_ROLES_SETUP.md)

## 🤝 Contributing

This is a private project for HavenRP. For issues or feature requests, contact the development team.

## 📄 License

Private & Confidential - © 2025 HavenRP. All rights reserved.

---

**Built with ❤️ for the HavenRP Community**
