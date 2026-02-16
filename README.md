# Amvrakikos Fishing Trips

A modern web application for booking fishing trips in Amvrakikos Bay, Greece. Built with Next.js, React, TypeScript, Prisma, and Tailwind CSS.

## Features

### Phase 1: Core Booking System ✓
- Trip browsing and selection
- Date picker with availability management
- Add-ons and extras
- Voucher/discount system
- Multi-step booking form

### Phase 2: Content & Reviews ✓
- Trip gallery and highlights
- Customer testimonials
- About section with captain profile
- FAQ section
- Contact form

### Phase 3: Localization & Theming ✓
- Multi-language support (English, Greek, German)
- Responsive design
- Dark/light mode
- SEO optimization

### Phase 4: Payment & Email Automation ✓
- **Stripe Integration**: Secure payment processing with checkout sessions
- **Email Templates**: Beautiful HTML emails for bookings, payments, and notifications
- **Admin Dashboard**: Full-featured admin panel for managing bookings, trips, and content

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui + Radix UI
- **Database**: SQLite with Prisma ORM
- **Payments**: Stripe
- **Emails**: Resend
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Internationalization**: next-intl

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite database file path | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `RESEND_API_KEY` | Resend API key for emails | Yes |
| `RESEND_FROM_EMAIL` | Default from email address | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |

## Admin Dashboard

Access the admin dashboard at `/admin` (any locale). Features include:

- **Dashboard Overview**: Stats, recent bookings, and quick insights
- **Bookings Management**: View, confirm, cancel, and filter bookings
- **Trips Management**: Add, edit, and manage fishing trips
- **Add-ons Management**: Manage trip extras and packages
- **Vouchers**: Create and manage discount codes
- **Messages**: View and respond to contact form submissions
- **Gallery**: Manage photo gallery
- **Settings**: Configure email, payment, and notification settings

## Stripe Integration

### Webhook Setup

1. Install the Stripe CLI for local development:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

2. Copy the webhook signing secret to your `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. For production, configure the webhook URL in your Stripe dashboard:
```
https://yourdomain.com/api/webhook
```

### Payment Flow

1. Customer completes the booking form
2. Booking is created with `PENDING` status
3. Customer is redirected to Stripe Checkout
4. After payment, Stripe sends webhook event
5. Booking status is updated to `PAID`
6. Confirmation and receipt emails are sent

## Email Templates

The application includes several email templates:

- **Booking Confirmation**: Sent when a booking is created
- **Payment Receipt**: Sent after successful payment
- **Booking Reminder**: Sent 24 hours before the trip
- **Booking Cancellation**: Sent when a booking is cancelled
- **Contact Form Notification**: Sent to admin on form submission

All emails feature a responsive, branded design with Greek language support.

## Deployment

### Build

```bash
npm run build
```

### Production Checklist

- [ ] Set production environment variables
- [ ] Configure Stripe production keys
- [ ] Set up Resend production domain
- [ ] Configure Stripe webhooks for production URL
- [ ] Run database migrations
- [ ] Verify all admin features work correctly

### Recommended Platforms

- [Vercel](https://vercel.com) - Optimized for Next.js
- [Railway](https://railway.app) - Easy database + app hosting
- [Render](https://render.com) - Full-stack hosting

## Project Structure

```
├── src/
│   ├── actions/          # Server actions for data fetching/mutation
│   ├── app/             # Next.js app router
│   │   ├── [locale]/    # Internationalized routes
│   │   │   ├── admin/   # Admin dashboard pages
│   │   │   ├── booking/ # Booking flow pages
│   │   │   └── ...      # Other pages
│   │   └── api/         # API routes (webhooks)
│   ├── components/      # React components
│   │   ├── ui/         # shadcn/ui components
│   │   └── ...         # Feature components
│   ├── lib/            # Utility functions
│   │   ├── email/      # Email templates and sending
│   │   ├── db.ts       # Prisma client
│   │   ├── stripe.ts   # Stripe configuration
│   │   └── ...
│   ├── types/          # TypeScript types
│   └── i18n/           # Internationalization config
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Database seed data
├── messages/           # Translation files
│   ├── en.json
│   ├── el.json
│   └── de.json
└── public/             # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and confidential.

## Support

For support, email bookings@amvrakikosfishing.com or open an issue in the repository.
