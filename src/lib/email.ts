import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

const translations = {
  en: {
    bookingConfirmation: 'Booking Confirmation',
    paymentReceipt: 'Payment Receipt',
    hello: 'Hello',
    yourBookingConfirmed: 'Your booking has been confirmed!',
    yourPaymentReceived: 'Your payment has been received successfully.',
    bookingDetails: 'Booking Details',
    paymentDetails: 'Payment Details',
    bookingRef: 'Booking Reference',
    trip: 'Trip',
    date: 'Date',
    participants: 'Participants',
    addOns: 'Add-ons',
    totalPrice: 'Total Price',
    amountPaid: 'Amount Paid',
    paymentDate: 'Payment Date',
    thankYou: 'Thank you for your booking!',
    nextSteps: 'What\'s Next?',
    nextStepsText: 'Your booking is registered. After completing the payment, you will receive a payment receipt.',
    nextStepsInstructions: [
      'Check your email for confirmation details',
      'Arrive at the harbor 15 minutes early',
      'Bring your booking reference number'
    ],
    youAreReady: 'You\'re all set!',
    readyText: 'Get ready for an amazing fishing adventure. We look forward to seeing you!',
    questions: 'Questions?',
    contactUs: 'Contact us at',
    allRightsReserved: 'All rights reserved.',
    newBooking: 'New Booking Received',
    newContactForm: 'New Contact Form Submission',
  },
  de: {
    bookingConfirmation: 'Buchungsbestätigung',
    paymentReceipt: 'Zahlungsbestätigung',
    hello: 'Hallo',
    yourBookingConfirmed: 'Ihre Buchung wurde bestätigt!',
    yourPaymentReceived: 'Ihre Zahlung wurde erfolgreich empfangen.',
    bookingDetails: 'Buchungsdetails',
    paymentDetails: 'Zahlungsdetails',
    bookingRef: 'Buchungsreferenz',
    trip: 'Ausflug',
    date: 'Datum',
    participants: 'Teilnehmer',
    addOns: 'Extras',
    totalPrice: 'Gesamtpreis',
    amountPaid: 'Bezahlter Betrag',
    paymentDate: 'Zahlungsdatum',
    thankYou: 'Vielen Dank für Ihre Buchung!',
    nextSteps: 'Was kommt als Nächstes?',
    nextStepsText: 'Ihre Buchung ist registriert. Nach Abschluss der Zahlung erhalten Sie eine Zahlungsbestätigung.',
    nextStepsInstructions: [
      'Überprüfen Sie Ihre E-Mail für Bestätigungsdetails',
      'Kommen Sie 15 Minuten früher zum Hafen',
      'Bringen Sie Ihre Buchungsreferenznummer mit'
    ],
    youAreReady: 'Sie sind bereit!',
    readyText: 'Bereiten Sie sich auf ein fantastisches Angelausflugsabenteuer vor. Wir freuen uns auf Sie!',
    questions: 'Fragen?',
    contactUs: 'Kontaktieren Sie uns unter',
    allRightsReserved: 'Alle Rechte vorbehalten.',
    newBooking: 'Neue Buchung eingegangen',
    newContactForm: 'Neue Kontaktformular-Einreichung',
  },
  el: {
    bookingConfirmation: 'Επιβεβαίωση Κράτησης',
    paymentReceipt: 'Απόδειξη Πληρωμής',
    hello: 'Γεια σας',
    yourBookingConfirmed: 'Η κράτησή σας έχει επιβεβαιωθεί!',
    yourPaymentReceived: 'Η πληρωμή σας έχει ληφθεί επιτυχώς.',
    bookingDetails: 'Στοιχεία Κράτησης',
    paymentDetails: 'Στοιχεία Πληρωμής',
    bookingRef: 'Αριθμός Κράτησης',
    trip: 'Εκδρομή',
    date: 'Ημερομηνία',
    participants: 'Συμμετέχοντες',
    addOns: 'Πρόσθετα',
    totalPrice: 'Συνολική Τιμή',
    amountPaid: 'Ποσό που Πληρώθηκε',
    paymentDate: 'Ημερομηνία Πληρωμής',
    thankYou: 'Ευχαριστούμε για την κράτησή σας!',
    nextSteps: 'Τι Ακολουθεί;',
    nextStepsText: 'Η κράτησή σας είναι καταχωρημένη. Μετά την ολοκλήρωση της πληρωμής, θα λάβετε μια απόδειξη πληρωμής.',
    nextStepsInstructions: [
      'Ελέγξτε το email σας για λεπτομέρειες επιβεβαίωσης',
      'Φτάστε στο λιμάνι 15 λεπτά νωρίτερα',
      'Φέρτε τον αριθμό κράτησής σας'
    ],
    youAreReady: 'Είστε έτοιμοι!',
    readyText: 'Προετοιμαστείτε για μια εκπληκτική εμπειρία ψαρέματος. Ανυπομονούμε να σας δούμε!',
    questions: 'Ερωτήσεις;',
    contactUs: 'Επικοινωνήστε μαζί μας στο',
    allRightsReserved: 'Με επιφύλαξη κάθε δικαιώματος.',
    newBooking: 'Νέα Κράτηση',
    newContactForm: 'Νέα Υποβολή Φόρμας Επικοινωνίας',
  }
};

type TranslationKey = keyof typeof translations.en;

const getTranslation = (locale: string) => {
  const lang = locale as TranslationKey;
  return translations[lang] || translations.en;
};

const emailStyles = `
  <style>
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f7fafc; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; }
    .header-icon { font-size: 40px; margin-bottom: 10px; }
    .content { padding: 30px; }
    .greeting { font-size: 18px; color: #1a365d; margin-bottom: 20px; }
    .info-box { background: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #64748b; font-size: 14px; }
    .info-value { color: #1a365d; font-weight: bold; font-size: 14px; }
    .success-badge { background: #dcfce7; color: #166534; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
    .success-badge h2 { margin: 0 0 5px 0; font-size: 20px; }
    .success-badge p { margin: 0; font-size: 14px; }
    .next-steps { margin-top: 30px; }
    .next-steps h3 { color: #1a365d; margin-bottom: 15px; }
    .next-steps ul { padding-left: 20px; color: #64748b; }
    .next-steps li { margin-bottom: 10px; }
    .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
  </style>
`;

function formatDate(date: Date, locale: string): string {
  return new Date(date).toLocaleDateString(locale === 'el' ? 'el-GR' : locale === 'de' ? 'de-DE' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export async function sendBookingConfirmation({
  to,
  bookingId,
  tripName,
  date,
  participants,
  totalPrice,
  name,
  addOns,
  locale = 'en',
}: {
  to: string;
  bookingId: string;
  tripName: string;
  date: Date;
  participants: number;
  totalPrice: number;
  name: string;
  addOns?: { name: string; quantity: number; price: number }[];
  locale?: string;
}) {
  const t = getTranslation(locale);

  const addOnsHtml = addOns && addOns.length > 0
    ? addOns.map(addOn => `
        <div class="info-row">
          <span class="info-label">${addOn.name} ×${addOn.quantity}</span>
          <span class="info-value">€${addOn.price * addOn.quantity}</span>
        </div>
      `).join('')
    : '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${emailStyles}
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="header-icon">⚓</div>
      <h1>Amvrakikos Fishing</h1>
    </div>
    
    <div class="content">
      <p class="greeting">${t.hello} ${name},</p>
      <p>${t.yourBookingConfirmed}</p>
      
      <div class="info-box">
        <h3 style="color: #1a365d; margin: 0 0 15px 0; font-size: 16px;">${t.bookingDetails}</h3>
        
        <div class="info-row">
          <span class="info-label">${t.bookingRef}</span>
          <span class="info-value">#${bookingId}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">${t.trip}</span>
          <span class="info-value">${tripName}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">${t.date}</span>
          <span class="info-value">${formatDate(date, locale)}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">${t.participants}</span>
          <span class="info-value">${participants}</span>
        </div>
        
        ${addOnsHtml}
        
        <div class="info-row">
          <span class="info-label" style="font-weight: bold;">${t.totalPrice}</span>
          <span class="info-value" style="font-size: 18px;">€${totalPrice}</span>
        </div>
      </div>
      
      <div class="next-steps">
        <h3>${t.nextSteps}</h3>
        <p style="color: #64748b;">${t.nextStepsInstructions[0]}</p>
        <p style="color: #64748b;">${t.nextStepsInstructions[1]}</p>
        <p style="color: #64748b;">${t.nextStepsInstructions[2]}</p>
      </div>
      
      <p style="margin-top: 30px; color: #64748b;">${t.questions} <a href="mailto:bookings@amvrakikosfishing.com" style="color: #2c5282;">bookings@amvrakikosfishing.com</a></p>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} Amvrakikos Fishing. ${t.allRightsReserved}</p>
    </div>
  </div>
</body>
</html>
`;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'bookings@amvrakikosfishing.com',
    to,
    subject: locale === 'el' 
      ? `Επιβεβαίωση Κράτησης #${bookingId}` 
      : locale === 'de'
      ? `Buchungsbestätigung #${bookingId}`
      : `Booking Confirmation #${bookingId}`,
    html,
  });

  if (error) {
    console.error('Error sending booking confirmation email:', error);
    throw error;
  }

  return data;
}

export async function sendPaymentReceipt({
  to,
  bookingId,
  amount,
  name,
  tripName,
  date,
  participants,
  locale = 'en',
}: {
  to: string;
  bookingId: string;
  amount: number;
  name: string;
  tripName?: string;
  date?: Date;
  participants?: number;
  locale?: string;
}) {
  const t = getTranslation(locale);

  const tripDetailsHtml = tripName ? `
    <div class="info-row">
      <span class="info-label">${t.trip}</span>
      <span class="info-value">${tripName}</span>
    </div>
    <div class="info-row">
      <span class="info-label">${t.date}</span>
      <span class="info-value">${date ? formatDate(date, locale) : '-'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">${t.participants}</span>
      <span class="info-value">${participants}</span>
    </div>
  ` : '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${emailStyles}
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="header-icon">⚓</div>
      <h1>Amvrakikos Fishing</h1>
    </div>
    
    <div class="content">
      <div class="success-badge">
        <h2>✓ ${t.youAreReady}</h2>
        <p>${t.yourPaymentReceived}</p>
      </div>
      
      <p class="greeting">${t.hello} ${name},</p>
      <p>${t.thankYou}</p>
      
      <div class="info-box">
        <h3 style="color: #1a365d; margin: 0 0 15px 0; font-size: 16px;">${t.paymentDetails}</h3>
        
        <div class="info-row">
          <span class="info-label">${t.bookingRef}</span>
          <span class="info-value">#${bookingId}</span>
        </div>
        
        ${tripDetailsHtml}
        
        <div class="info-row">
          <span class="info-label" style="font-weight: bold;">${t.amountPaid}</span>
          <span class="info-value" style="font-size: 18px; color: #166534;">€${amount}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">${t.paymentDate}</span>
          <span class="info-value">${formatDate(new Date(), locale)}</span>
        </div>
      </div>
      
      <p style="margin-top: 20px; color: #64748b;">${t.readyText}</p>
      
      <p style="margin-top: 30px; color: #64748b;">${t.questions} <a href="mailto:bookings@amvrakikosfishing.com" style="color: #2c5282;">bookings@amvrakikosfishing.com</a></p>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} Amvrakikos Fishing. ${t.allRightsReserved}</p>
    </div>
  </div>
</body>
</html>
`;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'bookings@amvrakikosfishing.com',
    to,
    subject: locale === 'el' 
      ? `Απόδειξη Πληρωμής #${bookingId}` 
      : locale === 'de'
      ? `Zahlungsbestätigung #${bookingId}`
      : `Payment Receipt #${bookingId}`,
    html,
  });

  if (error) {
    console.error('Error sending payment receipt email:', error);
    throw error;
  }

  return data;
}

export async function sendAdminBookingNotification({
  bookingId,
  tripName,
  date,
  participants,
  totalPrice,
  contactName,
  contactEmail,
  contactPhone,
  notes,
}: {
  bookingId: string;
  tripName: string;
  date: Date;
  participants: number;
  totalPrice: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes?: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL || 'admin@amvrakikosfishing.com';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${emailStyles}
</head>
<body>
  <div class="email-container">
    <div class="header" style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);">
      <div class="header-icon">🔔</div>
      <h1>Amvrakikos Fishing - Admin</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #1a365d;"><strong>New Booking Received!</strong></p>
      
      <div class="info-box">
        <h3 style="color: #1a365d; margin: 0 0 15px 0; font-size: 16px;">Booking Information</h3>
        
        <div class="info-row">
          <span class="info-label">Booking Reference</span>
          <span class="info-value">#${bookingId}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">Trip</span>
          <span class="info-value">${tripName}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">Date</span>
          <span class="info-value">${formatDate(date, 'en')}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">Participants</span>
          <span class="info-value">${participants}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label" style="font-weight: bold;">Total Price</span>
          <span class="info-value" style="font-size: 18px;">€${totalPrice}</span>
        </div>
      </div>
      
      <div class="info-box">
        <h3 style="color: #1a365d; margin: 0 0 15px 0; font-size: 16px;">Contact Information</h3>
        
        <div class="info-row">
          <span class="info-label">Name</span>
          <span class="info-value">${contactName}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-value"><a href="mailto:${contactEmail}">${contactEmail}</a></span>
        </div>
        
        <div class="info-row">
          <span class="info-label">Phone</span>
          <span class="info-value">${contactPhone}</span>
        </div>
        
        ${notes ? `
        <div class="info-row">
          <span class="info-label">Notes</span>
          <span class="info-value">${notes}</span>
        </div>
        ` : ''}
      </div>
      
      <p style="margin-top: 20px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" style="display: inline-block; background: #1a365d; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View in Admin Panel</a>
      </p>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} Amvrakikos Fishing - Admin Notification</p>
    </div>
  </div>
</body>
</html>
`;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'bookings@amvrakikosfishing.com',
    to: adminEmail,
    subject: `🔔 New Booking #${bookingId} - ${tripName} - €${totalPrice}`,
    html,
  });

  if (error) {
    console.error('Error sending admin notification email:', error);
    throw error;
  }

  return data;
}

export async function sendContactFormNotification({
  name,
  email,
  phone,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL || 'admin@amvrakikosfishing.com';

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'contact@amvrakikosfishing.com',
    to: adminEmail,
    subject: `New Contact Form Submission from ${name}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${emailStyles}
</head>
<body>
  <div class="email-container">
    <div class="header" style="background: linear-gradient(135deg, #059669 0%, #047857 100%);">
      <div class="header-icon">✉️</div>
      <h1>Amvrakikos Fishing</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #1a365d;"><strong>New Contact Form Submission</strong></p>
      
      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Name</span>
          <span class="info-value">${name}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-value"><a href="mailto:${email}">${email}</a></span>
        </div>
        
        <div class="info-row">
          <span class="info-label">Phone</span>
          <span class="info-value">${phone || 'N/A'}</span>
        </div>
      </div>
      
      <div class="info-box">
        <h3 style="color: #1a365d; margin: 0 0 15px 0; font-size: 16px;">Message</h3>
        <p style="white-space: pre-wrap; color: #64748b;">${message}</p>
      </div>
      
      <p style="margin-top: 20px;">
        <a href="mailto:${email}" style="display: inline-block; background: #1a365d; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reply to ${name}</a>
      </p>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} Amvrakikos Fishing - Contact Form</p>
    </div>
  </div>
</body>
</html>
    `,
  });

  if (error) {
    console.error('Error sending contact form notification:', error);
    throw error;
  }

  return data;
}
