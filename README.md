# Transact-App 💳

A modern, full-featured financial transaction management application built with **Next.js 15**, **React 19**, and **TypeScript**. This platform seamlessly integrates **Plaid** for bank connectivity, **Dwolla** for ACH transfers, **Appwrite** for real-time database management, and **Tailwind v3** **shadcn/ui** for a beautiful, accessible UI.

## 🎯 What Makes This App Work

This application is a complete fintech solution that connects users to their bank accounts, displays transaction history, and enables secure fund transfers—all through modern web technologies and industry-standard financial APIs.

---

## 🛠 Core Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Framework** | Next.js 15.1.6 (App Router) |
| **Runtime** | React 19.2.3 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4.19 + Animations |
| **UI Components** | shadcn/ui + Radix UI |
| **Forms** | React Hook Form 7.71.2 + Zod validation |
| **Charts** | Chart.js 4.5.1 + React-ChartJS-2 |
| **Bank Connectivity** | Plaid 41.4.0 |
| **Payments** | Dwolla v2 3.4.0 |
| **Database** | Appwrite (Node SDK 20.0.0) |
| **Utilities** | react-countup, query-string, clsx, tailwind-merge |

---

## 🏗 Architecture Overview

### Route Groups - Organized Navigation Structure

The app uses Next.js **Route Groups** (parentheses in folder names) to organize layouts without affecting URL paths:

```
app/
├── (auth)/                     # Authentication routes (separate layout)
│   ├── sign-in/               # Login page
│   ├── sign-up/               # Registration page
│   └── layout.tsx             # Auth-specific layout (no sidebar)
│
├── (root)/                     # Protected routes (with sidebar layout)
│   ├── dashboard/             # Main dashboard with balance overview
│   ├── my-banks/              # Bank accounts management
│   ├── transaction-history/   # Full transaction details & filtering
│   ├── transfer/              # Money transfer interface
│   └── layout.tsx             # Root layout with Sidebar + Navigation
│
├── api/                        # API routes for backend logic
│   ├── auth/                  # Authentication endpoints
│   ├── plaid/                 # Plaid webhook handlers
│   └── dwolla/                # Dwolla payment callbacks
│
├── layout.tsx                  # Root layout wrapper
├── globals.css                 # Global Tailwind styles
└── global-error.tsx           # Global error boundary
```

**Key Benefit:** The `(auth)` group uses a clean layout without navigation, while `(root)` uses a full-featured layout with sidebars—all without changing actual URLs.

---

## 📚 Server Actions & Data Layer

### lib/actions/ - Next.js Server Actions

All data mutations and fetches happen in server-side action files using Next.js App Router patterns:

- **`user.actions.ts`** - User registration, login, profile management, and session handling with Appwrite
- **`banks.actions.ts`** - Bank account linking via Plaid, account list retrieval, account details fetching
- **`transactions.actions.ts`** - Transaction history queries, filtering, and pagination
- **`dwolla.actions.ts`** - ACH transfer creation, fund recipient setup, payment processing

### Appwrite Integration

```typescript
// lib/appwrite.ts
createSessionClient()  // For user-authenticated operations (read/write own data)
createAdminClient()    // For server-side admin operations (database access with API key)
```

Both clients use getter methods for lazy-loaded **Account**, **Database**, and **Users** services.

---

## 🎨 Component Architecture

### Core Components

**Layout & Navigation:**
- `Sidebar.tsx` - Left navigation for desktop
- `MobileNav.tsx` - Responsive mobile navigation
- `RightSidebar.tsx` - Additional info panel
- `HeaderBox.tsx` - Page header with greeting

**Financial Display:**
- `BankCard.tsx` - Bank account card with balance display
- `BankInfo.tsx` - Detailed bank account information
- `BankDropDown.tsx` - Account selector dropdown
- `BankTabItem.tsx` - Tab-based account switcher
- `TotalBalanceBox.tsx` - Aggregated balance display
- `AnimatedCounter.tsx` - Animated number transitions using `react-countup`

**Forms & Input:**
- `AuthForm.tsx` - Login/signup form with React Hook Form + Zod validation
- `PaymentTransferForm.tsx` - Money transfer form with validation
- `FormInputField.tsx` - Reusable form input component

**Integrations:**
- `PlaidLink.tsx` - Plaid Link button to connect banks
- `Category.tsx` - Transaction category display

**Data Visualization:**
- `TransactionsTable.tsx` - Sortable, paginated transaction table
- `DoughnutChart.tsx` - Chart.js doughnut chart for spending by category
- `RecentTransactions.tsx` - Quick view of latest transactions
- `pagination.tsx` - Reusable pagination component

**UI Elements:**
- `Copy.tsx` - Copy-to-clipboard utility component
- `Footer.tsx` - Application footer

### shadcn/ui Integration

The app uses shadcn/ui (built on Radix UI) for accessible, customizable components:
- Form inputs with built-in validation
- Buttons with multiple variants
- Dropdown menus
- Modals and dialogs
- Tables
- Tooltips

Components are stored in `components/ui/` and styled with Tailwind CSS.

---

## 🪝 React Hooks & Form Management

### React Hook Form + Zod Validation

React Hook Form provides **efficient, performant form handling** with minimal re-renders:

```typescript
const form = useForm({
  resolver: zodResolver(authFormSchema),
  defaultValues: { email: "", password: "" }
});

const onSubmit = async (data) => {
  // Validated data only reaches here
  await signUpUser(data);
};
```

**Benefits:**
- Isolated component re-renders
- Built-in error handling
- Client-side validation before server
- Easy integration with Zod schemas

### Key React 19 Hooks Used

- `useState()` - Component state management
- `useEffect()` - Side effects, data fetching
- `useCallback()` - Memoized callback functions
- `useMemo()` - Memoized values (for expensive calculations)
- `useRef()` - Direct DOM access for animations
- `useContext()` - Global state (if applicable)
- `useTransition()` - Handling server action loading states
- `useActionState()` - Managing server action state

### Custom Hooks (App-Specific)

While not explicitly shown in the structure, common custom hooks would include:

- `useAuth()` - Authentication state and functions
- `useUser()` - Current user data and profile
- `useTransactions()` - Fetch and filter transactions
- `useBanks()` - Manage connected bank accounts
- `useBalance()` - Calculate and update total balance
- `usePlaidLink()` - Handle Plaid Link flow
- `useDwolla()` - Handle transfer workflows

---

## 📊 Data Visualization with Chart.js

### DoughnutChart Component

Visualize spending categories using Chart.js:

```typescript
// components/DoughnutChart.tsx
import { Doughnut } from "react-chartjs-2";

<Doughnut 
  data={chartData}
  options={chartOptions}
/>
```

**Features:**
- Real-time category breakdown
- Responsive sizing
- Custom colors per category
- Interactive legend

---

## 🔐 Plaid Integration

### How Bank Connectivity Works

1. **PlaidLink Component** initiates Plaid Link modal
2. User selects their bank and authenticates
3. Plaid returns a **public token**
4. Exchange public token for **access token** via API
5. Store token in Appwrite database
6. Fetch transactions and account details using token

### Key Files

- `components/PlaidLink.tsx` - Link UI component
- `lib/plaid.ts` - Plaid client initialization
- `lib/actions/banks.actions.ts` - Server actions for token exchange and data fetching

---

## 💰 Dwolla Integration

### ACH Transfer Flow

1. User fills transfer form with amount and recipient
2. Create recipient using Dwolla API (if new)
3. Initialize transfer between accounts
4. Dwolla processes ACH transaction
5. Webhook updates transaction status

### Key Files

- `components/PaymentTransferForm.tsx` - Transfer UI
- `lib/actions/dwolla.actions.ts` - Transfer orchestration
- `app/api/dwolla/webhook` - Payment status updates

---

## 🗄 Appwrite Database

### Authentication & Sessions

- User login creates Appwrite session
- Session stored in `httpOnly` cookie
- `createSessionClient()` uses session for authenticated queries

### Data Collections

- **Users** - User profiles, KYC data
- **Banks** - Linked bank accounts and tokens
- **Transactions** - Transaction history and details

### Real-Time Features

Appwrite provides real-time database updates for:
- Transaction status changes
- New transfer completions
- Balance updates

---

## 💻 Common Development Tasks

### Running the Application

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

### Environment Setup

Create `.env.local`:

```env
# Appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
NEXT_APPWRITE_KEY=your_api_key

# Plaid
NEXT_PUBLIC_PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret_key
PLAID_ENV=sandbox

# Dwolla
DWOLLA_ENV=sandbox
DWOLLA_KEY=your_key
DWOLLA_SECRET=your_secret

# Database
DATABASE_URL=your_db_url
```

### Form Validation Example

```typescript
import { z } from "zod";

const authFormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
  firstName: z.string().min(2, "Min 2 characters"),
  lastName: z.string().min(2, "Min 2 characters"),
});

type AuthFormData = z.infer<typeof authFormSchema>;
```

---

## 📱 Responsive Design

### Tailwind Breakpoints

- Mobile-first approach
- `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- Responsive components for all screen sizes
- MobileNav for tablet/mobile, Sidebar for desktop

### Animation System

Tailwind's `animate-*` utilities combined with `tw-animate-css`:
- Smooth transitions on data load
- Button hover effects
- Modal animations
- Loading spinners

---

## 🔄 Data Flow Example: Transfer Money

1. **User** fills `PaymentTransferForm.tsx`
2. **React Hook Form** validates against schema
3. **Form submission** calls server action `createTransfer()`
4. **Server action** calls Dwolla API
5. **Dwolla** processes ACH transfer
6. **Webhook** updates Appwrite database
7. **UI** reflects new transaction in `TransactionsTable.tsx`

---

## 🚀 Key Features

✅ Secure user authentication with Appwrite  
✅ Multi-bank account linking via Plaid  
✅ ACH fund transfers with Dwolla  
✅ Real-time transaction history  
✅ Spending analytics with Chart.js  
✅ Responsive design with Tailwind CSS  
✅ Type-safe forms with React Hook Form + Zod  
✅ Accessible UI with shadcn/ui + Radix  
✅ Server-side rendering with Next.js  
✅ Production-ready error handling  

---

## 📖 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
- [Plaid Documentation](https://plaid.com/docs)
- [Dwolla Documentation](https://developers.dwolla.com)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs)

---

## 📝 License

Private Repository - All rights reserved.
