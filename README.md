# Comaket — Repository Map

> Staff Engineering Reference: Architecture, conventions, and module map for the Comaket codebase.

---

## Tech Stack

| Concern | Library |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| UI | Ant Design 5 + Tailwind CSS + SCSS |
| Icons | iconsax-react + lucide-react |
| Server State | Redux Toolkit + RTK Query |
| Client State | React Context (AppContext) |
| Persistence | redux-persist (localStorage) |
| Auth | JWT (Bearer) + Google OAuth (`@react-oauth/google`) |
| Payments | Paystack (`react-paystack`) |
| Font | Nunito (Google Fonts) |
| Animation | framer-motion |
| Path Alias | `@grc/` → `src/` |

---

## Key Directories

```
src/
├── _shared/            # Shared utilities, types, and base components
├── app/                # Next.js App Router (routing, layouts, pages)
├── app-context/        # React Context (global UI + cart state)
├── components/         # Feature-level UI components
├── hooks/              # Custom hooks (data access layer for components)
├── providers/          # Standalone React providers
├── redux/              # Redux store, slices, selectors
├── services/           # RTK Query API services
├── styles/             # Global CSS/SCSS
└── utils/              # Pure utility functions
```

---

## Routing Structure (Next.js App Router)

```
src/app/
├── layout.tsx                          # ROOT — ThemeProvider, font (Nunito), metadata
├── nav.tsx                             # App navigation config (NavItem[])
├── (ui)/
│   ├── layout.tsx                      # SHELL — Redux Provider, PersistGate, AntD ConfigProvider,
│   │                                   #         GoogleOAuthProvider, AppProvider
│   ├── (apps)/
│   │   ├── layout.tsx                  # APP LAYOUT — SideNav/MobileNav shell + all global modals
│   │   ├── (home)/page.tsx             # / (marketplace home)
│   │   ├── cart/page.tsx
│   │   ├── checkout/
│   │   │   ├── page.tsx
│   │   │   └── verify/page.tsx
│   │   ├── product/[id]/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── sell-item/page.tsx
│   │   ├── saved/page.tsx
│   │   ├── explore/page.tsx
│   │   ├── chats/page.tsx
│   │   ├── creators/page.tsx
│   │   ├── creators/[id]/page.tsx
│   │   ├── stores/[id]/page.tsx
│   │   └── payment/
│   ├── (my-store)/
│   │   ├── layout.tsx                  # Store dashboard shell
│   │   └── my-store/[storeId]/
│   │       ├── page.tsx                # Dashboard
│   │       ├── orders/page.tsx
│   │       ├── products/page.tsx
│   │       ├── reviews/page.tsx
│   │       ├── settings/page.tsx
│   │       └── notifications/page.tsx
│   ├── creator-account/setup/page.tsx
│   ├── creator-store/setup/page.tsx
│   └── reset-password/page.tsx
└── pages/_document.tsx                 # Legacy pages dir (only _document)
```

---

## Core Architectural Modules

### Provider Stack (outermost → innermost)

| Layer | File | Responsibility |
|---|---|---|
| `ThemeProvider` | `_shared/components/theme-provider` | `next-themes` dark/light mode |
| `Redux Provider` | `(ui)/layout.tsx` | Redux store injection |
| `PersistGate` | `(ui)/layout.tsx` | Waits for redux-persist rehydration |
| `ConfigProvider` | `(ui)/layout.tsx` | Ant Design theme (light/dark) |
| `GoogleOAuthProvider` | `(ui)/layout.tsx` | Google OAuth client ID |
| `AppProvider` | `app-context/index.tsx` | UI state + cart state |
| `AuthProvider` | `providers/authProvider.tsx` | JWT expiry check (currently commented out) |

---

## State Management

### Redux Store — `src/redux/store.ts`

```
store
├── auth          (persisted)     ← authData, sessionToken, isAuthenticated
├── ui            (not persisted) ← pagination map (keyed by endpointName)
└── api           (RTK Query)     ← all server cache
```

**Persist config**: key `giro`, storage `localStorage`, whitelist `['auth']`

**Middleware chain**: `defaultMiddleware` → `api.middleware` → `redux-logger` → `appMiddleware` → `logoutMiddleware`

### Auth Slice — `src/redux/slices/auth/index.ts`

- `extraReducers` listen to: `signIn`, `signUp`, `verifyOtp`, `googleAuth`, `getUserProfile` fulfilled matchers
- `logoutMiddleware` — on `logout` action: clears cookie → `persistor.purge()` → `window.location.reload()`

### UI Slice — `src/redux/slices/ui/index.ts`

- Single reducer: `paginate(state, action)` — stores pagination data keyed by RTK Query `endpointName`

### AppContext — `src/app-context/index.tsx`

Global React context (not Redux) for:
- Modal/drawer open states (`isAuthModalOpen`, `isSellItemModalOpen`, `isCreateStoreModalOpen`, `isChatsModalOpen`, all drawers)
- Cart state (persisted in `localStorage` under key `comaket_cart`)
- `shopItems` (mock `MarketItem[]`, replaced by API data)

---

## API / Query Utilities

### Base API — `src/services/api/index.ts`

Single `createApi` instance. All services call `api.injectEndpoints(...)`.

**Auth headers**: `Authorization: Bearer <sessionToken>` + `x-api-key`

**Response interception**: extracts `meta.token` → calls `AppCookie()` to set cookie

### App Middleware — `src/services/ui/index.ts`

RTK Query middleware that:
- Shows `message.error()` on rejected mutations
- Shows `message.success(options.successMessage)` on fulfilled mutations
- Dispatches `paginate()` to UI slice when a response contains `meta.pagination`

### Services (all inject into `api`)

| Service | File | Key Endpoints |
|---|---|---|
| `authApi` | `services/auth` | login, register, verify-email, google, logout, forgot/reset-password |
| `usersApi` | `services/users` | getUserProfile, updateProfile |
| `storesApi` | `services/stores` | CRUD, browse, toggleVisibility, getBySlug |
| `listingsApi` | `services/listings` | CRUD, browse, getByStore, getByCreator |
| `creatorsApi` | `services/creators` | browse, getById |
| `ordersApi` | `services/orders` | getOrders, getById, updateStatus |
| `cartApi` | `services/cart` | getCart, addItem, removeItem, clearCart |
| `reviewsApi` | `services/reviews` | getReviews, createReview |
| `categoriesApi` | `services/categories` | getCategories |
| `mediaApi` | `services/media` | uploadMedia |
| `paymentsApi` | `services/payments` | initiate, verify |
| `savedProductApi` | `services/saved-product` | getSaved, save, unsave |
| `shippingAddressesApi` | `services/shipping-addresses` | CRUD |
| `followsApi` | `services/follows` | follow, unfollow, getFollowers |
| `adminApi` | `services/admin` | admin ops |
| `featuredWorksApi` | `services/featured-works` | getFeaturedWorks |

### Cache Tags — `src/services/tags.ts`

`Account`, `User`, `Creator`, `Store`, `Listing`, `Order`, `Category`, `Review`, `Admin`, `Cart`, `SavedProduct`, `ShippingAddress`

---

## Custom Hooks (Data Access Layer)

All hooks follow the same pattern:

```ts
export const useXxx = ({ fetchXxx = false, xxxId, ... }: UseXxxProps = {}) => {
  // 1. usePagination (if paginated)
  // 2. RTK Query hooks (lazy queries + mutations)
  // 3. useEffect to trigger lazy queries based on props
  // 4. Handler functions (async wrappers over .unwrap())
  // 5. return { data, handlers, isLoading, isSuccess, error, ... }
}
```

| Hook | File |
|---|---|
| `useAuth` | `hooks/useAuth` |
| `useUsers` | `hooks/useUser` |
| `useStores` | `hooks/useStores` |
| `useListings` | `hooks/useListings` |
| `useCreators` | `hooks/useCreators` |
| `useOrders` | `hooks/useOrders` |
| `useCart` | `hooks/useCart` |
| `useReviews` | `hooks/useReviews` |
| `useCategories` | `hooks/useCategories` |
| `useMedia` | `hooks/useMedia` |
| `usePayments` | `hooks/usePayments` |
| `useSavedProducts` | `hooks/useSavedProducts` |
| `useShippingAddresses` | `hooks/useShippingAddresses` |
| `useFollows` | `hooks/useFollows` |
| `useAdmin` | `hooks/useAdmin` |
| `useFeaturedWorks` | `hooks/useFeaturedWorks` |
| `usePagination` | `hooks/usePagination` |
| `useSearch` | `hooks/useSearch` |

---

## Shared Components — `src/_shared/components/`

| Component | Path |
|---|---|
| `AppLoader` | `_shared/components/app-loader` |
| `CustomButton` | `_shared/components/custom-button` |
| `CustomModal` | `_shared/components/custom-modal` |
| `CustomTooltip` | `_shared/components/custom-tooltip` |
| `NetworkDetector` | `_shared/components/network-detector` |
| `ThemeProvider` | `_shared/components/theme-provider` |
| `PasswordStrengthIndicator` | `_shared/components/password-strength-indicator` |
| `ReactCodeInput` | `_shared/components/react-code-input` |
| `Responsiveness` / `useMediaQuery` | `_shared/components/responsiveness` |
| `SearchableSelect` | `_shared/components/searchable-select` |
| `PhoneInput` | `_shared/components/phone-input` |
| `TableSkeleton` | `_shared/components/table-skeleton` |
| `TruncatedDescription` | `_shared/components/truncated-description` |
| `TransactionReceipt` | `_shared/components/transaction-receipt` |
| `WithAppLoader` | `_shared/components/with-app-loder` |

---

## Global Configuration Files

| File | Purpose |
|---|---|
| `src/app/layout.tsx` | Root HTML shell, font, metadata, ThemeProvider |
| `src/app/(ui)/layout.tsx` | All providers (Redux, AntD, Google OAuth, AppContext) |
| `src/app/(ui)/(apps)/layout.tsx` | App shell (navigation, global modals) |
| `src/app/nav.tsx` | Navigation item definitions |
| `src/redux/store.ts` | Redux store, persistor, typed hooks |
| `src/redux/slices/index.tsx` | Root reducer combining all slices |
| `src/services/api/index.ts` | RTK Query base api |
| `src/services/tags.ts` | Cache tag constants |
| `src/services/ui/index.ts` | `appMiddleware` (toasts + pagination) |
| `src/app-context/index.tsx` | AppContext + AppProvider |
| `src/_shared/helpers/index.ts` | `AppCookie`, `numberFormat`, `truncate`, etc. |
| `src/_shared/constant/index.ts` | URL constants, token key, mock data |
| `src/_shared/namespace/index.d.ts` | Core TypeScript types |
| `src/utils/auth.ts` | `isTokenExpired` JWT utility |
| `src/providers/authProvider.tsx` | JWT expiry watcher |

---

## Namespace / Types — `src/_shared/namespace/`

| Type | Description |
|---|---|
| `MarketItem` | Marketplace listing shape |
| `AppObject` | Base `_id`, `id`, `publicId`, `createdAt` |
| `Meta` | Pagination wrapper from API responses |
| `OptionType` | `{ successMessage, noSuccessMessage, errMessage, noErrMessage }` |
| `QueryArgs` | Standard `page`, `limit`, `search`, `category`, `sort` |
| `Pagination` | Ant Design pagination props |
| `MediaItem` | `{ url, type, thumbnail }` |
| `ListingType` | `'self-listing' \| 'consignment' \| 'direct-purchase'` |

---

## User Roles

| Role | Capabilities |
|---|---|
| `user` | Browse, buy, cart, save, review, follow |
| `creator` | All user capabilities + own stores + list products for sale |

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_APP_BASE_URL` | API base URL |
| `NEXT_PUBLIC_APP_API_KEY` | API key sent as `x-api-key` header |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `NEXT_PUBLIC_TOKEN_STORAGE_KEY` | Cookie key for auth token |
| `NEXT_PUBLIC_COUNTRY_API_KEY` | Country/State/City API key |

---

## Running the Project

```bash
# Development
yarn dev

# Build (staging)
yarn build:stg

# Build (production)
yarn build:prod

# Start (staging)
yarn start:stg

# Start (production)
yarn start:prod
```
