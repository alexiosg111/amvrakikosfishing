# Amvrakikos Fishing Trip Website

A modern, full-featured fishing trip booking website built with Next.js 16, Prisma, and Tailwind CSS.

## 🚀 Features

- **Multi-step booking flow** with real-time price calculation
- **Trip browsing** with detailed information and images
- **Add-on selection** for enhanced experiences
- **Voucher code system** for discounts
- **Contact form** with email notifications
- **Photo gallery** with category filtering
- **Customer testimonials** and reviews
- **FAQ section** with accordion
- **Multi-language support** (English, Greek, German)
- **Responsive design** for all devices
- **Dark mode support**
- **Smooth animations** with Framer Motion

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Database:** Prisma + SQLite
- **Forms:** React Hook Form + Zod
- **Animations:** Framer Motion
- **Email:** Resend
- **Internationalization:** next-intl

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## 🚦 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration (minimum required):

```env
DATABASE_URL="file:./dev.db"
```

### 3. Set Up the Database

Generate Prisma Client:

```bash
npx prisma generate
```

Seed the database with sample data:

```bash
npm run db:seed
```

This will create:
- 5 fishing trips
- 5 add-ons
- 3 voucher codes
- 5 sample reviews
- 4 gallery images

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── [locale]/          # Internationalized pages
│   │   │   ├── about/         # About page
│   │   │   ├── booking/       # Booking flow
│   │   │   ├── contact/       # Contact page
│   │   │   ├── faq/           # FAQ page
│   │   │   ├── gallery/       # Photo gallery
│   │   │   ├── testimonials/  # Customer reviews
│   │   │   ├── trips/         # Trip listing & details
│   │   │   └── page.tsx       # Home page
│   │   └── globals.css        # Global styles
│   ├── actions/               # Server actions
│   ├── components/            # React components
│   │   ├── addons/           # Add-on components
│   │   ├── booking/          # Booking components
│   │   ├── layout/           # Navbar & Footer
│   │   ├── sections/         # Page sections
│   │   ├── trips/            # Trip components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── vouchers/         # Voucher components
│   │   └── language/         # Language switcher
│   ├── i18n/                 # Internationalization
│   ├── lib/                  # Utilities
│   └── types/                # TypeScript types
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed.ts               # Seed script
│   └── migrations/           # Database migrations
└── messages/                 # Translation files
    ├── en.json              # English
    ├── de.json              # German
    └── el.json              # Greek
```

## 🗄️ Database Schema

The application uses the following main models:

- **Trip** - Fishing trip information
- **Booking** - Booking records
- **AddOn** - Additional services
- **Availability** - Trip availability
- **Voucher** - Discount codes
- **Review** - Customer reviews
- **GalleryImage** - Photo gallery
- **ContactMessage** - Contact form submissions

## 🌐 Available Pages

- `/` - Home page with hero and featured trips
- `/trips` - Browse all fishing trips
- `/trips/[id]` - Individual trip details
- `/booking` - Multi-step booking flow
- `/booking/success` - Booking confirmation
- `/contact` - Contact form and information
- `/about` - About captain and boat
- `/faq` - Frequently asked questions
- `/gallery` - Photo gallery
- `/testimonials` - Customer reviews

## 📧 Email Configuration (Optional)

To enable email notifications:

1. Sign up at [Resend.com](https://resend.com)
2. Get your API key
3. Add to `.env`:
   ```
   RESEND_API_KEY="your_api_key"
   RESEND_FROM_EMAIL="bookings@yourdomain.com"
   ```

## 🌍 Adding New Languages

1. Create a new translation file in `messages/`:
   ```
   messages/xx.json
   ```

2. Add the locale to `src/i18n/routing.ts`:
   ```typescript
   locales: ['en', 'el', 'de', 'xx']
   ```

3. Copy the content from `messages/en.json` and translate

## 🎨 Customization

### Colors

Edit `src/app/globals.css` to customize the color scheme:

```css
:root {
  --primary: oklch(0.205 0 0);  /* Primary blue */
  --secondary: oklch(0.97 0 0); /* Secondary color */
  /* ... */
}
```

### Fonts

The project uses:
- **Playfair Display** for headings
- **Inter** for body text

Edit `src/app/[locale]/layout.tsx` to change fonts.

## 🚀 Building for Production

```bash
npm run build
npm start
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed the database

## 🔧 Prisma Commands

```bash
npx prisma generate       # Generate Prisma Client
npx prisma db push        # Push schema to database
npx prisma db seed        # Seed the database
npx prisma studio         # Open Prisma Studio
npx prisma migrate dev    # Create migration
```

## 📱 Responsive Design

The website is fully responsive and works on:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktops (1024px+)

## 🌙 Dark Mode

Dark mode is supported via CSS variables. The website uses a light theme by default with dark mode colors defined in the CSS.

## 🔐 Security

- All forms use Zod validation
- Server actions for mutations
- Protected API routes
- SQL injection prevention via Prisma

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙋 Support

For support and questions:
- Email: info@amvrakikosfishing.com
- Phone: +30 268 202 1234

## 🗺️ Location

Amvrakikos Bay, Preveza, Greece

---

Built with ❤️ using Next.js and modern web technologies.
