# Setup Instructions for Amvrakikos Fishing Trip Website

## Initial Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

The minimum required variable is:
```env
DATABASE_URL="file:./dev.db"
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Seed the Database

```bash
npm run db:seed
```

Or using Prisma directly:
```bash
npx prisma db seed
```

If the above doesn't work, try:
```bash
npx tsx prisma/seed.ts
```

The seed script will create:
- 5 fishing trips (Half Day, Full Day, Sunset, Night, Private Charter)
- 5 add-ons (Lunch, Photo, Transfer, Equipment, Sunset Extension)
- 3 voucher codes (WELCOME10, SUMMER25, FAMILY50)
- 5 sample reviews
- 4 gallery images

### 5. Start the Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Troubleshooting

### Seed script issues

If the seed script fails to run, ensure:
1. Node.js 18+ is installed
2. All dependencies are installed: `npm install`
3. Prisma client is generated: `npx prisma generate`
4. The database file exists (will be created automatically)

You can also use Prisma Studio to manually add data:
```bash
npx prisma studio
```

### Font loading issues

If fonts don't load properly, check:
1. Internet connection (fonts are loaded from Google Fonts)
2. Next.js is running: `npm run dev`

### Build errors

If you encounter build errors:
1. Clear the Next.js cache: `rm -rf .next`
2. Rebuild: `npm run build`

## Database Management

### View database
```bash
npx prisma studio
```

### Reset database
```bash
npx prisma migrate reset
npm run db:seed
```

### Create new migration
```bash
npx prisma migrate dev --name your_migration_name
```

## Testing the Application

After setup:

1. Visit http://localhost:3000 to see the home page
2. Browse trips at http://localhost:3000/trips
3. Click on a trip to see details
4. Click "Book Now" to start the booking flow
5. Test the contact form at http://localhost:3000/contact
6. View the gallery at http://localhost:3000/gallery
7. Read testimonials at http://localhost:3000/testimonials
8. Check the FAQ at http://localhost:3000/faq

## Optional Features

### Email Notifications

To enable email notifications:
1. Sign up at https://resend.com
2. Get an API key
3. Add to `.env`:
   ```
   RESEND_API_KEY="your_api_key"
   RESEND_FROM_EMAIL="bookings@yourdomain.com"
   ```

### Payment Integration

Payment integration with Stripe is set up but requires:
1. Stripe account
2. API keys in `.env`:
   ```
   STRIPE_SECRET_KEY="sk_test_xxx"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
   STRIPE_WEBHOOK_SECRET="whsec_xxx"
   ```

## Production Deployment

### Build the application
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Environment Variables for Production

Make sure to set:
- `DATABASE_URL` (use a production database like PostgreSQL)
- `NEXT_PUBLIC_SITE_URL` (your production domain)
- `RESEND_API_KEY` (for email notifications)
- Stripe keys (if using payments)

## Common Issues

### Port 3000 already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### Module not found errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database locked
```bash
# Delete the database file and reseed
rm dev.db
npx prisma db push
npm run db:seed
```

## Getting Help

- Check the main README.md for feature documentation
- Review PHASE_COMPLETE.md for what was built
- Check the Next.js documentation: https://nextjs.org/docs
- Check Prisma documentation: https://www.prisma.io/docs

## Next Steps

After successfully running the MVP:

1. Customize the content (trips, prices, descriptions)
2. Update contact information
3. Add your own images to the public folder
4. Configure email notifications
5. Set up payment processing
6. Deploy to production (Vercel, Netlify, etc.)

Enjoy your fishing trip booking website! 🎣
