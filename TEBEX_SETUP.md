# Tebex Headless API Setup Guide

This guide will help you configure the HavenRP store with Tebex Headless API.

## Prerequisites

1. A Tebex account with a configured webstore
2. Products and categories set up in your Tebex dashboard

## Step 1: Get Your Tebex Webstore Identifier

⚠️ **Important:** The Headless API uses your **Webstore Identifier** (not a secret key).

1. Go to [Tebex Creator Dashboard](https://creator.tebex.io/)
2. Look at your webstore URL - it's in the format: `your-store.tebex.io`
3. The **identifier** is the part before `.tebex.io` (e.g., `havenrp`)
4. This identifier is used in API calls and is public-facing

**Note:** The webstore identifier is public and safe to use. There's no secret key needed for the Headless API - it only allows reading public store information.

## Step 2: Configure Environment Variables

### Local Development
Add to your `.env.local` file:

```env
TEBEX_SECRET_KEY=your-store-identifier
```

Example: If your store is `havenrp.tebex.io`, use `havenrp`.

### Vercel Deployment
Add the environment variable in Vercel:

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Add the variable:
   - **Name:** `TEBEX_SECRET_KEY`
   - **Value:** Your webstore identifier (e.g., `havenrp`)
   - **Environments:** Check all three boxes (Production, Preview, Development)
5. Click **Save**
6. **Important:** Redeploy your project:
   - Go to **Deployments** tab
   - Click the three dots (...) on latest deployment
   - Select **Redeploy**
   - OR push a new commit to trigger automatic redeployment

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
Tebex API calls are proxied through Vercel serverless functions:

- `api/tebex/information.ts` - Fetches `https://{store}.tebex.io/api/information`
- `api/tebex/categories.ts` - Fetches `https://{store}.tebex.io/api/categories`
- `api/tebex/category/[id].ts` - Fetches `https://{store}.tebex.io/api/categories/{id}`
- `api/tebex/package/[id].ts` - Fetches `https://{store}.tebex.io/api/packages/{id}`

### Frontend (`src/hooks/useTebex.ts`)
React hooks call the backend API routes:

- `useTebexWebstore()` - Fetches store information
- `useTebexCategories()` - Gets all categories
- `useTebexCategoryPackages(id)` - Fetches packages for category
- `useTebexPackage(id)` - Gets single package

## Features Included

### ✅ What Works
- ✅ Fetches all categories and packages from Tebex public API
- ✅ Displays packages with images, descriptions, prices
- ✅ Shows sale/discount badges
- ✅ Tabbed navigation between categories
- ✅ Responsive design matching HavenRP theme
- ✅ Direct checkout links to Tebex
- ✅ Currency display from your Tebex account
- ✅ Loading states and error handling
- ✅ Disabled packages shown but not purchasable
- ✅ Response caching (5-10 minutes)

### 📦 API Flow
```
Frontend → Vercel API Routes → Tebex Store API → Response
```

This architecture ensures:
- Clean API proxying
- Response caching
- Better error handling
- Consistent data flow

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

### "Error loading store" or 403 errors
- Check if `TEBEX_SECRET_KEY` is set correctly in Vercel
- Verify you're using the **Secret Key** (starts with `sk-`), not Public Token
- Make sure you redeployed after adding the environment variable
- Check Vercel function logs for detailed error messages

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

ℹ️ **Note:**
- **Webstore Identifier** is public and safe (part of your store URL)
- Headless API only provides read access to public store data
- No sensitive keys are exposed
- API calls are still proxied through backend for consistency
- Users can't modify store data, only view and checkout

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

