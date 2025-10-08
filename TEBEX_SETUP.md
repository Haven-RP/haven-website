# Tebex Headless API Setup Guide

This guide will help you configure the HavenRP store with Tebex Headless API.

## Prerequisites

1. A Tebex account with a configured webstore
2. Products and categories set up in your Tebex dashboard

## Step 1: Get Your Tebex Public Token

1. Go to [Tebex Creator Dashboard](https://creator.tebex.io/)
2. Navigate to **Integrations** → **API Keys**
3. Create a new **Public Token** (not Secret Key)
4. Copy the token - it should look like: `xxxx-xxxxxxxxxxxxxxxx`

## Step 2: Configure Environment Variables

### Local Development
Add to your `.env.local` file:

```env
VITE_TEBEX_PUBLIC_TOKEN=your-tebex-public-token-here
```

### Vercel Deployment
Add the environment variable in Vercel:

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add **TWO** variables (serverless functions will try both):
   - Name: `TEBEX_PUBLIC_TOKEN` (preferred for serverless)
   - Value: your-tebex-public-token
   - Environments: Production, Preview, Development
   
   AND
   
   - Name: `VITE_TEBEX_PUBLIC_TOKEN` (for Vite client if needed)
   - Value: your-tebex-public-token  
   - Environments: Production, Preview, Development
4. Click **Save** for each
5. **Important:** Go to **Deployments** and click "Redeploy" on the latest deployment
   - Or push a new commit to trigger redeployment

## Step 3: Update Site Configuration

In `src/config/site.ts`, update the Tebex webstore identifier:

```typescript
// Tebex Store
tebexWebstoreIdentifier: "your-store.tebex.io",
```

Replace `your-store.tebex.io` with your actual Tebex webstore URL.

## Step 4: Configure Your Tebex Store

### Categories
1. Go to your Tebex dashboard
2. Navigate to **Webstore** → **Categories**
3. Create categories (e.g., "VIP Packages", "Vehicles", "Currency")
4. Set the order for how they appear

### Packages
1. Navigate to **Webstore** → **Packages**
2. Create packages with:
   - **Name**: Display name
   - **Price**: Set in your currency
   - **Description**: HTML supported
   - **Image**: Optional, but recommended (use CDN URLs)
   - **Category**: Assign to a category
   - **Commands**: FiveM commands to execute on purchase

### Example FiveM Commands
```
give {player} vip_30days
addvehicle {player} adder
givemoney {player} 1000000
```

## Architecture

### Backend Proxy (Vercel Serverless Functions)
To avoid CORS issues, Tebex API calls are proxied through Vercel serverless functions:

- `api/tebex/information.ts` - Webstore details
- `api/tebex/categories.ts` - All categories  
- `api/tebex/category/[id].ts` - Packages in category
- `api/tebex/package/[id].ts` - Single package details

### Frontend (`src/hooks/useTebex.ts`)
React hooks call the backend API routes instead of Tebex directly:

- `useTebexWebstore()` - Fetches store information
- `useTebexCategories()` - Gets all categories
- `useTebexCategoryPackages(id)` - Fetches packages for category
- `useTebexPackage(id)` - Gets single package

## Features Included

### ✅ What Works
- ✅ Fetches all categories from Tebex via serverless functions
- ✅ Displays packages with images, descriptions, prices
- ✅ Shows sale/discount badges
- ✅ Tabbed navigation between categories
- ✅ Responsive design matching HavenRP theme
- ✅ Direct checkout links to Tebex
- ✅ Currency display from your Tebex account
- ✅ Loading states and error handling
- ✅ Disabled packages shown but not purchasable
- ✅ CORS-free (requests go through backend)
- ✅ Response caching (5-10 minutes)

### 📦 API Flow
```
Frontend → Vercel API Routes → Tebex API → Response
```

This architecture ensures:
- No CORS issues
- Secure token storage (server-side only)
- Response caching
- Better error handling

## Checkout Flow

When a user clicks "Purchase":
1. Opens Tebex checkout in new window
2. User completes payment on Tebex
3. Tebex executes configured commands on your FiveM server
4. User receives items/perks automatically

## Customization

### Styling
The store inherits the HavenRP neon theme:
- Primary color: Neon Cyan
- Secondary: Electric Magenta
- Cards use glassmorphism
- Hover effects with neon glow

### Package Cards
Edit `src/pages/Store.tsx` → `renderPackage()` function to customize:
- Card layout
- Information displayed
- Button behavior
- Image handling

### Add Custom Badges
For special package types, add badges in the `renderPackage` function:

```typescript
{pkg.type === "special" && (
  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
    <Sparkles className="w-3 h-3 mr-1" />
    Limited Edition
  </Badge>
)}
```

## Troubleshooting

### "Error loading store"
- Check if `VITE_TEBEX_PUBLIC_TOKEN` is set correctly
- Verify you're using the **Public Token**, not Secret Key
- Check browser console for detailed error messages

### Packages not showing
- Ensure packages are assigned to categories
- Check that categories have `only_subcategories: false`
- Verify packages are not disabled in Tebex dashboard

### Images not loading
- Use HTTPS URLs for images
- Host images on a CDN (Imgur, Cloudinary, etc.)
- Check CORS settings if using custom domain

### Checkout not working
- Verify `tebexWebstoreIdentifier` is correct in `site.ts`
- Ensure your Tebex webstore is published (not in draft mode)
- Check popup blockers

## Testing

### Test Mode
To test without real purchases:
1. In Tebex dashboard, enable **Test Mode**
2. Use test card: `4242 4242 4242 4242`
3. Any expiry date in future, any CVC

### Development
```bash
npm run dev
```
Navigate to: `http://localhost:8080/store`

## Security Notes

⚠️ **Important:**
- **Public Token** is stored server-side in Vercel
- **Never** commit `.env.local` to git
- **Never** use Secret Key anywhere
- Public Token can only **read** data, not modify
- All API calls are proxied through secure backend
- Frontend never directly contacts Tebex API

## Support

For Tebex API issues:
- [Tebex Documentation](https://docs.tebex.io/)
- [Tebex Support](https://tebex.io/contact)

For HavenRP integration issues:
- Check browser console for errors
- Review `src/hooks/useTebex.ts` for API calls
- Contact development team

---

**Built with ❤️ for HavenRP Community**

