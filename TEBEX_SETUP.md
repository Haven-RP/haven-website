# Tebex Headless API Setup Guide

This guide will walk you through integrating the [Tebex Headless API](https://docs.tebex.io/developers/headless-api/overview) into your HavenRP website.

## What is the Headless API?

The Tebex Headless API allows you to integrate your store directly into your own frontend. The API is **public** and can be called directly from the browser—no backend proxy or authentication required!

## Prerequisites

1. A Tebex account with a configured webstore
2. Products and categories set up in your Tebex dashboard
3. Your webstore token

## Step 1: Get Your Webstore Token

Your webstore token is a unique identifier for your Tebex store.

### Finding Your Token:

1. Go to [Tebex Creator Dashboard](https://creator.tebex.io/)
2. Select your webstore
3. The token is in your webstore URL or settings
4. Format: `t66x-xxxxxxxxxxxxx` (starts with a short code, followed by a long alphanumeric string)

**Example:** `t66x-7cd928b1e9312709e6810edac6dc1fd1eefc57cb`

⚠️ **Note:** This token is **public** and safe to use in frontend code. It only allows read-only access to your public store data.

## Step 2: Configure the Token

Update `src/config/site.ts`:

```typescript
// Tebex Store
tebexWebstoreToken: "t66x-YOUR_TOKEN_HERE", // Your Tebex webstore token
tebexStorefrontUrl: "store.haven-rp.com", // Custom domain for checkout
```

- **`tebexWebstoreToken`**: Your Headless API token (public, read-only)
- **`tebexStorefrontUrl`**: Your custom domain or `yourstore.tebex.io`

**That's it!** No environment variables, no secrets, no backend configuration needed.

## Step 3: Configure Your Tebex Store

### Categories

1. Go to your Tebex dashboard
2. Navigate to **Webstore** → **Categories**
3. Create categories (e.g., "VIP Packages", "Vehicles", "Currency")
4. Set the display order

### Packages

1. Navigate to **Webstore** → **Packages**
2. Create packages with:
   - **Name**: Display name
   - **Price**: Set in your currency
   - **Description**: HTML supported
   - **Image**: Optional, recommended (400x200px or larger)
   - **Category**: Assign to a category
   - **Type**: Single or Subscription

### Example Package Setup

- **VIP Bronze** - $4.99/month subscription
- **VIP Silver** - $9.99/month subscription
- **VIP Gold** - $19.99/month subscription
- **Vehicle Pack** - $9.99 one-time purchase
- **Currency Pack** - $4.99 one-time purchase

## Architecture

### Direct Browser API Calls

The frontend (`src/hooks/useTebex.ts`) calls the Tebex Headless API directly:

- `GET https://headless.tebex.io/api/accounts/{token}/categories?includePackages=1`
- `GET https://headless.tebex.io/api/accounts/{token}/categories/{id}`
- `GET https://headless.tebex.io/api/accounts/{token}/packages/{id}`

### API Flow

```
Frontend (React) → Headless API → Response
                 (headless.tebex.io)
```

**Benefits:**
- ✅ No backend proxy needed
- ✅ No CORS issues (API supports CORS)
- ✅ No secrets or authentication
- ✅ Public API is safe and read-only
- ✅ Browser-side caching via TanStack Query
- ✅ Fast and simple

## Features Included

### ✅ What Works

- ✅ Fetches all categories and packages from Tebex
- ✅ Displays packages with images, descriptions, prices
- ✅ Shows discount badges
- ✅ Tabbed navigation between categories
- ✅ Responsive design matching HavenRP theme
- ✅ Direct checkout links to your custom domain
- ✅ Currency display from package data
- ✅ Loading states and error handling
- ✅ Subscription badges
- ✅ Client-side caching (5-10 minutes)

### Package Display

Each package card shows:
- Image (if provided)
- Name and description (HTML supported)
- Original price (if discounted)
- Final price with currency
- Discount badge (if applicable)
- Subscription badge (if applicable)
- Purchase button

## Checkout Flow

### Embedded Checkout with Tebex.js

The store uses **Tebex.js** for a fully embedded checkout experience. Users never leave your website!

**Flow:**
1. User clicks "Purchase" button
2. System creates a new basket via Headless API
3. Package is added to the basket
4. Tebex.js modal opens on your site (dark theme with neon cyan accents)
5. User completes payment in the embedded checkout
6. Purchase confirmation shown via toast notification
7. Commands are executed on your FiveM server automatically

**Benefits:**
- ✅ Users never leave your website
- ✅ Seamless, branded experience
- ✅ Dark theme matches your site design
- ✅ Real-time checkout events
- ✅ Better conversion rates

### Technical Implementation

The checkout integration uses:
- **Tebex.js** (`https://js.tebex.io/v/1.4.0/`) - Loaded in `index.html`
- **Headless API** - Creates baskets and adds packages
- **Event Handlers** - Listens for checkout completion, closure, and errors
- **Toast Notifications** - Provides user feedback

**Code Flow:**
```typescript
// 1. Create basket
const basket = await createBasket();

// 2. Add package
await addPackageToBasket(basket.ident, packageId, 1);

// 3. Launch embedded checkout
window.Tebex.checkout.init({
  ident: basket.ident,
  theme: 'dark',
  colors: { primary: '#00D9FF' }
});
window.Tebex.checkout.launch();
```

## Local Development

To run locally:

1. Update `tebexWebstoreToken` in `src/config/site.ts`
2. Start the development server:

```bash
npm run dev
```

3. Navigate to: `http://localhost:8080/store`

## Security Notes

✅ **Public & Safe:**
- Webstore token is **public** and safe to use in frontend code
- Headless API only provides **read-only** access to public store data
- No API keys or secrets needed
- Users can only view packages and checkout—they cannot modify your store

## Troubleshooting

### "Failed to fetch" or Network Errors

- Verify your webstore token is correct in `src/config/site.ts`
- Check your browser console for specific error messages
- Ensure your Tebex store is active and published

### Store loads but shows no packages

- Verify packages are published in your Tebex dashboard
- Check packages are assigned to categories
- Ensure categories are visible/active
- Try adding `?includePackages=1` to the API URL in browser to test

### Custom Domain Not Working

- Verify your custom domain is configured in Tebex dashboard
- Use the original `yourstore.tebex.io` format if custom domain isn't set up
- Custom domain is only for checkout—API always uses `headless.tebex.io`

### Currency Not Displaying Correctly

- Ensure at least one package exists in your store
- Check browser console for API response data
- Currency is derived from package data

## API Reference

### Get Categories with Packages

```
GET https://headless.tebex.io/api/accounts/{token}/categories?includePackages=1
```

**Response:**
```json
{
  "data": [
    {
      "id": 123,
      "name": "VIP Packages",
      "description": "...",
      "packages": [
        {
          "id": 456,
          "name": "VIP Gold",
          "description": "<p>...</p>",
          "image": "https://...",
          "type": "subscription",
          "base_price": 19.99,
          "total_price": 19.99,
          "currency": "USD",
          "discount": 0
        }
      ]
    }
  ]
}
```

### Get Single Category

```
GET https://headless.tebex.io/api/accounts/{token}/categories/{id}
```

### Get Single Package

```
GET https://headless.tebex.io/api/accounts/{token}/packages/{id}
```

## Support

For Tebex API issues:
- [Tebex Headless API Documentation](https://docs.tebex.io/developers/headless-api/overview)
- [Tebex Documentation](https://docs.tebex.io/)
- [Tebex Support](https://www.tebex.io/contact/support)

For integration issues:
- Check browser console for errors
- Verify token is correct
- Test API endpoints directly in browser
