# My Characters Feature Documentation

This document describes the new "My Characters" feature that allows authenticated users to view their FiveM characters and inventory.

## Overview

The My Characters page displays all characters associated with the logged-in user's Discord account, showing detailed information about each character including their stats, money, job, gang, and inventory.

## New Files Created

### Hooks

#### `src/hooks/useFivemCharacters.ts`
- Fetches all characters for a Discord user
- API: `GET /api/fivem/user/discord:{discordId}/characters`
- Parses JSON strings in response (money, charinfo, job, gang)
- Returns array of `ParsedCharacter` objects
- Caches for 2 minutes

#### `src/hooks/useFivemCharacter.ts`
- Fetches detailed character data by citizen ID
- API: `GET /api/fivem/character/{citizenid}`
- Parses inventory from JSON string
- Returns `ParsedCharacterDetail` with full character data
- Caches for 1 minute

### Components

#### `src/components/CharacterInventoryModal.tsx`
- Modal component that displays character inventory
- Shows character stats summary (Cash, Bank, Health, Armor)
- Displays inventory items in a grid
- Shows item metadata (durability, ammo, serial number, registered owner)
- Formats weapon names nicely (removes WEAPON_ prefix, capitalizes)

### Pages

#### `src/pages/MyCharacters.tsx`
- Main character listing page at `/my-characters`
- Requires authentication (redirects to `/auth` if not logged in)
- Displays character cards in a responsive grid
- Each card shows:
  - Character name (firstname + lastname)
  - Citizen ID
  - Phone number
  - Money breakdown (Cash, Bank, Crypto)
  - Health and Armor stats
  - Current Job and Gang
  - "Show Inventory" button

## API Integration

### Characters List Endpoint
```
GET https://api.haven-rp.com/api/fivem/user/{discordId}/characters
Headers:
  - accept: application/json
  - X-API-Key: {VITE_HAVEN_API_KEY}
```

**Response Structure:**
```json
{
  "success": true,
  "message": "Retrieved X character(s)",
  "data": {
    "discord_id": "123456789",
    "character_count": 2,
    "characters": [...]
  }
}
```

### Character Detail Endpoint
```
GET https://api.haven-rp.com/api/fivem/character/{citizenid}
Headers:
  - accept: application/json
  - X-API-Key: {VITE_HAVEN_API_KEY}
```

**Response Structure:**
```json
{
  "success": true,
  "message": "Character found",
  "data": {
    "id": 12345,
    "citizenid": "ABC123",
    "name": "John Doe",
    "inventory": "[{...}]",  // JSON string
    "money": "{...}",        // JSON string
    "charinfo": "{...}",     // JSON string
    ...
  }
}
```

## Features

### Character Cards
- **Name Display**: Extracts firstname and lastname from `charinfo`
- **Phone Number**: Shows phone from `charinfo`
- **Money Breakdown**: Displays Cash, Bank, and Crypto with proper formatting
- **Stats**: Shows Health and Armor with colored icons
- **Job & Gang**: Displays current job title/grade and gang affiliation
- **Citizen ID**: Shows unique character identifier

### Inventory Modal
- **Automatic Loading**: Fetches inventory when modal opens
- **Item Grid**: Responsive grid layout for inventory items
- **Item Details**: Shows count, slot number, and metadata
- **Weapon Info**: Special formatting for weapons (durability, ammo, serial, registration)
- **Scrollable**: Handles large inventories with scroll area
- **Stats Summary**: Quick overview of character's money and health at top

### Navigation Integration
- Added "My Characters" link to navigation (only visible when logged in)
- Shows in both desktop and mobile navigation
- Highlighted in secondary color to distinguish from public pages
- Added to Dashboard as a quick access card

## User Flow

1. User logs in with Discord OAuth
2. Discord ID is extracted from Supabase session
3. User navigates to "My Characters" page
4. System fetches all characters for that Discord ID
5. Character cards are displayed in a grid
6. User clicks "Show Inventory" on a character
7. Modal opens and fetches detailed character data
8. Inventory items are parsed and displayed

## Styling

- **Character Cards**: Glass morphism with neon border accents
- **Money Display**: Color-coded (Cash = accent, Bank = primary, Crypto = secondary)
- **Stats Icons**: Health = red, Armor = blue, Job = secondary badge
- **Inventory Modal**: Dark backdrop with glassmorphic content
- **Item Cards**: Hover effects with border color transitions
- **Responsive**: Mobile-friendly grid layouts

## Error Handling

- **No Characters**: Shows friendly empty state with icon
- **API Errors**: Displays error messages with details
- **Loading States**: Shows spinners during data fetch
- **Auth Required**: Redirects to login if not authenticated
- **Missing Data**: Gracefully handles missing fields with defaults

## Environment Variables

Required in Supabase or `.env.local`:
- `VITE_HAVEN_API_KEY` - API key for HavenRP backend
- `VITE_DISCORD_ROLES_API_URL` - Base API URL (optional, has default)

## Testing Checklist

- [ ] Login redirects work correctly
- [ ] Characters load for authenticated users
- [ ] Money values display with proper formatting
- [ ] Inventory modal opens and closes
- [ ] Inventory items show correct metadata
- [ ] Empty inventory shows appropriate message
- [ ] No characters shows friendly empty state
- [ ] Navigation links work on desktop and mobile
- [ ] Error states display helpful messages
- [ ] Page is responsive on all screen sizes

## Future Enhancements

Potential improvements:
- Add character refresh button
- Show last login timestamp
- Filter/search characters
- Sort characters by various criteria
- Export inventory to CSV
- Character comparison view
- Show character skills/stats
- Display bought furniture and properties

