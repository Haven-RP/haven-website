# Discord Roles API Integration Setup

This document explains how to configure the Discord roles API integration for the HavenRP website.

## Overview

After a user logs in via Discord OAuth through Supabase, the website automatically fetches their Discord roles from your custom API endpoint.

## Environment Variables

You need to set up the following environment variables:

### In Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Secrets**
3. Add the following secret:
   - **Key**: `VITE_HAVEN_API_KEY`
   - **Value**: Your HavenRP API key

### In Your Local `.env.local` file

Create a `.env.local` file in the project root with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://cvxageyyiyyccuqcgbgu.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# HavenRP Discord Roles API
VITE_DISCORD_ROLES_API_URL=http://192.99.168.114:8080/api/discord/roles
VITE_HAVEN_API_KEY=your-api-key-here
```

## API Endpoint

The integration calls:
```
GET http://192.99.168.114:8080/api/discord/roles/{discordUserId}
Headers:
  - accept: application/json
  - X-API-Key: {VITE_HAVEN_API_KEY}
```

## Expected API Response

The API should return a JSON response in this format:

```json
{
  "roles": [
    {
      "id": "1234567890",
      "name": "Admin",
      "color": 16711680,
      "position": 10
    },
    {
      "id": "0987654321",
      "name": "Staff",
      "color": 3447003,
      "position": 5
    }
  ]
}
```

## How It Works

1. User logs in with Discord OAuth via Supabase
2. Supabase returns user session with Discord provider metadata
3. The website extracts the Discord User ID from the session
4. The `useDiscordRoles` hook automatically fetches roles from your API
5. Roles are cached for 5 minutes
6. The Dashboard displays roles as badges and enables role-based content gating

## Files Modified

- **`src/hooks/useDiscordRoles.ts`** - New hook to fetch Discord roles
- **`src/pages/Dashboard.tsx`** - Updated to use the hook and display roles
- **`.env.example`** - Example environment configuration

## Testing

1. Make sure `VITE_HAVEN_API_KEY` is set in Supabase secrets or local `.env.local`
2. Log in with Discord
3. Navigate to `/dashboard`
4. You should see your Discord roles displayed as badges
5. Role-based content (Staff, Admin, VIP sections) will show/hide based on your roles

## Troubleshooting

**Roles not loading?**
- Check browser console for API errors
- Verify `VITE_HAVEN_API_KEY` is set correctly
- Ensure the API endpoint is accessible
- Check that Discord User ID is being extracted correctly (displayed in the info box)

**API returns 401/403?**
- Verify the API key is correct
- Check that the API endpoint expects the key in `X-API-Key` header

**No Discord ID found?**
- Check Supabase Discord OAuth configuration
- Verify the Discord provider is enabled in Supabase
- Check browser console for the session object structure

