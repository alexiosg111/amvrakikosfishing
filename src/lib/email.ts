import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');
const fromEmail = process.env.RESEND_FROM_EMAIL || 'bookings@amvrakikosfishing.com';

interface BaseEmailParams {
  to: string;
  name: string;
  locale?: string;
}

interface BookingEmailParams extends BaseEmailParams {
  bookingId: string;
  tripName: string;
  date: Date;
  participants: number;
  totalPrice: number;
  addOns?: { name: string; quantity: number; price: number }[];
  meetingPoint?: string;
  startTime?: string;
}

interface PaymentEmailParams extends BaseEmailParams {
  bookingId: string;
  amount: number;
  receiptUrl?: string;
}

interface ReminderEmailParams extends BaseEmailParams {
  bookingId: string;
  tripName: string;
  date: Date;
  startTime?: string;
  meetingPoint?: string;
}

interface ReviewRequestParams extends BaseEmailParams {
  bookingId: string;
  tripName: string;
  reviewUrl: string;
}

interface CancellationEmailParams extends BaseEmailParams {
  bookingId: string;
  tripName: string;
  date: Date;
  refundAmount?: number;
  refundStatus?: 'processing' | 'completed' | 'pending';
}

function getEmailTranslations(locale: string = 'en') {
  const translations: Record<string, Record<string, string>> = {
    en: {
      greeting: 'Hello',
      farewell: 'We look forward to seeing you!',
      signature: 'Best regards,<br/>Captain Nikos<br/>Amvrakikos Fishing Trips',
      bookingConfirmation: 'Booking Confirmation',
      yourBookingConfirmed: 'Your booking has been confirmed!',
      bookingDetails: 'Booking Details',
      trip: 'Trip',
      date: 'Date',
      participants: 'Participants',
      totalPrice: 'Total Price',
      addOns: 'Add-ons',
      paymentReceipt: 'Payment Receipt',
      paymentReceived: 'Your payment has been received successfully.',
      amountPaid: 'Amount Paid',
      receiptNumber: 'Receipt Number',
      paymentFailed: 'Payment Failed',
      paymentFailedMessage: 'Unfortunately, your payment could not be processed.',
      retryPayment: 'Retry Payment',
      bookingReminder: 'Trip Reminder',
      reminderMessage: 'This is a friendly reminder about your upcoming fishing trip tomorrow.',
      meetingPoint: 'Meeting Point',
      time: 'Time',
      whatToBring: 'What to Bring',
      whatToBringList: 'Sunscreen, Hat, Sunglasses, Comfortable clothing, Camera, Water bottle',
      weatherNote: 'Weather Note',
      weatherMessage: 'Please check the weather forecast and dress accordingly.',
      reviewRequest: 'How was your trip?',
      reviewMessage: 'We hope you enjoyed your fishing adventure! Please take a moment to share your experience.',
      leaveReview: 'Leave a Review',
      cancellation: 'Booking Cancelled',
      cancellationMessage: 'Your booking has been cancelled as requested.',
      refundInfo: 'Refund Information',
      refundAmount: 'Refund Amount',
      refundStatus: 'Refund Status',
      refundProcessing: 'Your refund is being processed and should appear in 5-10 business days.',
      copyright: '© 2024 Amvrakikos Fishing Trips. All rights reserved.',
      unsubscribe: 'You received this email because you booked a trip with us.',
      viewBooking: 'View Booking',
      downloadReceipt: 'Download Receipt',
    },
    el: {
      greeting: 'Γεια σας',
      farewell: 'Σας περιμένουμε!',
      signature: 'Με εκτίμηση,<br/>Καπετάνιος Νίκος<br/>Amvrakikos Fishing Trips',
      bookingConfirmation: 'Επιβεβαίωση Κράτησης',
      yourBookingConfirmed: 'Η κράτησή σας έχει επιβεβαιωθεί!',
      bookingDetails: 'Λεπτομέρειες Κράτησης',
      trip: 'Εκδρομή',
      date: 'Ημερομηνία',
      participants: 'Συμμετέχοντες',
      totalPrice: 'Συνολική Τιμή',
      addOns: 'Extras',
      paymentReceipt: 'Απόδειξη Πληρωμής',
      paymentReceived: 'Η πληρωμή σας έχει ληφθεί επιτυχώς.',
      amountPaid: 'Ποσό Πληρωμής',
      receiptNumber: 'Αριθμός Απόδειξης',
      paymentFailed: 'Αποτυχία Πληρωμής',
      paymentFailedMessage: 'Δυστυχώς, η πληρωμή σας δεν μπόρεσε να ολοκληρωθεί.',
      retryPayment: 'Δοκιμή Ξανά',
      bookingReminder: 'Υπόμνηση Εκδρομής',
      reminderMessage: 'Αυτή είναι μια φιλική υπενθύμιση για την επερχόμενη εκδρομή ψαρέματος αύριο.',
      meetingPoint: 'Σημείο Συνάντησης',
      time: 'Ώρα',
      whatToBring: 'Τι να Φέρετε',
      whatToBringList: 'Αντηλιακό, Καπέλο, Γυαλιά Ηλίου, Άνετα ρούχα, Κάμερα, Μπουκάλι νερό',
      weatherNote: 'Σημείωση Καιρού',
      weatherMessage: 'Παρακαλώ ελέγξτε την πρόγνωση καιρού και ντυθείτε ανάλογα.',
      reviewRequest: 'Πώς ήταν η εκδρομή;',
      reviewMessage: 'Ελπίζουμε να απολαύσατε την περιπέτεια ψαρέματός σας! Παρακαλώ αφιερώστε λίγο χρόνο για να μοιραστείτε την εμπειρία σας.',
      leaveReview: 'Αφήστε Κριτική',
      cancellation: 'Ακύρωση Κράτησης',
      cancellationMessage: 'Η κράτησή σας έχει ακυρωθεί όπως ζητήθηκε.',
      refundInfo: 'Πληροφορίες Επιστροφής',
      refundAmount: 'Ποσό Επιστροφής',
      refundStatus: 'Κατάσταση Επιστροφής',
      refundProcessing: 'Η επιστροφή σας επεξεργάζεται και θα εμφανιστεί σε 5-10 εργάσιμες ημέρες.',
      copyright: '© 2024 Amvrakikos Fishing Trips. Με επιφύλαξη παντός δικαιώματος.',
      unsubscribe: 'Λάβατε αυτό το email επειδή κάνατε κράτηση μαζί μας.',
      viewBooking: 'Δείτε την Κράτηση',
      downloadReceipt: 'Λήψη Απόδειξης',
    },
    de: {
      greeting: 'Hallo',
      farewell: 'Wir freuen uns auf Sie!',
      signature: 'Mit freundlichen Grüßen,<br/>Kapitän Nikos<br/>Amvrakikos Fishing Trips',
      bookingConfirmation: 'Buchungsbestätigung',
      yourBookingConfirmed: 'Ihre Buchung wurde bestätigt!',
      bookingDetails: 'Buchungsdetails',
      trip: 'Ausflug',
      date: 'Datum',
      participants: 'Teilnehmer',
      totalPrice: 'Gesamtpreis',
      addOns: 'Zusätze',
      paymentReceipt: 'Zahlungsbeleg',
      paymentReceived: 'Ihre Zahlung wurde erfolgreich erhalten.',
      amountPaid: 'Gezahlter Betrag',
      receiptNumber: 'Belegnummer',
      paymentFailed: 'Zahlung fehlgeschlagen',
      paymentFailedMessage: 'Leider konnte Ihre Zahlung nicht verarbeitet werden.',
      retryPayment: 'Erneut versuchen',
      bookingReminder: 'Ausflugserinnerung',
      reminderMessage: 'Dies ist eine freundliche Erinnerung an Ihren bevorstehenden Angelausflug morgen.',
      meetingPoint: 'Treffpunkt',
      time: 'Zeit',
      whatToBring: 'Mitbringen',
      whatToBringList: 'Sonnencreme, Hut, Sonnenbrille, Bequeme Kleidung, Kamera, Wasserflasche',
      weatherNote: 'Wetterhinweis',
      weatherMessage: 'Bitte überprüfen Sie die Wettervorhersage und kleiden Sie sich entsprechend.',
      reviewRequest: 'Wie war Ihr Ausflug?',
      reviewMessage: 'Wir hoffen, Sie haben Ihr Angelausflug genossen! Bitte nehmen Sie sich einen Moment Zeit, um Ihre Erfahrung zu teilen.',
      leaveReview: 'Bewertung abgeben',
      cancellation: 'Buchung storniert',
      cancellationMessage: 'Ihre Buchung wurde wie gewünscht storniert.',
      refundInfo: 'Rückerstattungsinformationen',
      refundAmount: 'Rückerstattungsbetrag',
      refundStatus: 'Rückerstattungsstatus',
      refundProcessing: 'Ihre Rückerstattung wird bearbeitet und sollte in 5-10 Werktagen erscheinen.',
      copyright: '© 2024 Amvrakikos Fishing Trips. Alle Rechte vorbehalten.',
      unsubscribe: 'Sie haben diese E-Mail erhalten, weil Sie bei uns gebucht haben.',
      viewBooking: 'Buchung ansehen',
      downloadReceipt: 'Beleg herunterladen',
    },
  };

  return translations[locale] || translations.en;
}

function getEmailStyles() {
  return `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center; }
      .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
      .content { background: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; }
      .details-box { background: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
      .details-row { display: flex; justify-content: space-between; margin: 10px 0; }
      .details-label { color: #64748b; font-weight: 500; }
      .details-value { color: #1e293b; font-weight: 600; }
      .button { display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
      .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
      .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
      .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
      .error { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
      .list-item { padding: 5px 0; }
      .divider { border-top: 1px solid #e2e8f0; margin: 20px 0; }
    </style>
  `;
}

function formatPrice(price: number): string {
  return `€${price}`;
}

function formatDate(date: Date, locale: string = 'en'): string {
  return date.toLocaleDateString(locale === 'el' ? 'el-GR' : locale === 'de' ? 'de-DE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function sendBookingConfirmation(params: BookingEmailParams) {
  const t = getEmailTranslations(params.locale);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const localePath = params.locale || 'en';

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: params.to,
    subject: `${t.bookingConfirmation} #${params.bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        ${getEmailStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎣 ${t.bookingConfirmation}</h1>
          </div>
          <div class="content">
            <p>${t.greeting} ${params.name},</p>
            <div class="success">
              <p style="margin:0;">✅ ${t.yourBookingConfirmed}</p>
            </div>
            
            <div class="details-box">
              <h3 style="margin-top:0;">${t.bookingDetails}</h3>
              <div class="divider"></div>
              <div class="details-row">
                <span class="details-label">${t.trip}</span>
                <span class="details-value">${params.tripName}</span>
              </div>
              <div class="details-row">
                <span class="details-label">${t.date}</span>
                <span class="details-value">${formatDate(params.date, params.locale)}</span>
              </div>
              <div class="details-row">
                <span class="details-label">${t.participants}</span>
                <span class="details-value">${params.participants}</span>
              </div>
              ${params.addOns && params.addOns.length > 0 ? `
                <div class="details-row">
                  <span class="details-label">${t.addOns}</span>
                  <span class="details-value">${params.addOns.map(a => `${a.name} x${a.quantity}`).join(', ')}</span>
                </div>
              ` : ''}
              <div class="divider"></div>
              <div class="details-row">
                <span class="details-label" style="font-size: 18px;">${t.totalPrice}</span>
                <span class="details-value" style="font-size: 18px; color: #2563eb;">${formatPrice(params.totalPrice)}</span>
              </div>
            </div>

            ${params.meetingPoint ? `
              <div class="details-box">
                <h4 style="margin-top:0;">${t.meetingPoint}</h4>
                <p>${params.meetingPoint}</p>
                ${params.startTime ? `<p><strong>${t.time}:</strong> ${params.startTime}</p>` : ''}
              </div>
            ` : ''}

            <div class="details-box">
              <h4 style="margin-top:0;">${t.whatToBring}</h4>
              <p>${t.whatToBringList}</p>
            </div>

            <div class="warning">
              <p style="margin:0;"><strong>${t.weatherNote}:</strong> ${t.weatherMessage}</p>
            </div>

            <a href="${appUrl}/${localePath}/booking?id=${params.bookingId}" class="button">${t.viewBooking}</a>

            <p>${t.farewell}</p>
            <p>${t.signature}</p>
          </div>
          <div class="footer">
            <p>${t.copyright}</p>
            <p>${t.unsubscribe}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error('Error sending booking confirmation:', error);
    throw error;
  }

  return data;
}

export async function sendPaymentReceipt(params: PaymentEmailParams) {
  const t = getEmailTranslations(params.locale);
  const receiptNumber = `RCP-${params.bookingId}-${Date.now().toString(36).toUpperCase()}`;

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: params.to,
    subject: `${t.paymentReceipt} #${params.bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        ${getEmailStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💳 ${t.paymentReceipt}</h1>
          </div>
          <div class="content">
            <p>${t.greeting} ${params.name},</p>
            <div class="success">
              <p style="margin:0;">✅ ${t.paymentReceived}</p>
            </div>
            
            <div class="details-box">
              <h3 style="margin-top:0;">${t.paymentReceipt}</h3>
              <div class="divider"></div>
              <div class="details-row">
                <span class="details-label">${t.receiptNumber}</span>
                <span class="details-value">${receiptNumber}</span>
              </div>
              <div class="details-row">
                <span class="details-label">${t.amountPaid}</span>
                <span class="details-value" style="color: #10b981;">${formatPrice(params.amount)}</span>
              </div>
              <div class="details-row">
                <span class="details-label">${t.date}</span>
                <span class="details-value">${formatDate(new Date(), params.locale)}</span>
              </div>
            </div>

            ${params.receiptUrl ? `
              <a href="${params.receiptUrl}" class="button">${t.downloadReceipt}</a>
            ` : ''}

            <p>${t.signature}</p>
          </div>
          <div class="footer">
            <p>${t.copyright}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error('Error sending payment receipt:', error);
    throw error;
  }

  return data;
}

export async function sendPaymentFailed(params: PaymentEmailParams & { retryUrl: string }) {
  const t = getEmailTranslations(params.locale);

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: params.to,
    subject: `${t.paymentFailed} - Booking #${params.bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        ${getEmailStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header" style="background: linear-gradient(135deg, #991b1b 0%, #b91c1c 100%);">
            <h1>❌ ${t.paymentFailed}</h1>
          </div>
          <div class="content">
            <p>${t.greeting} ${params.name},</p>
            <div class="error">
              <p style="margin:0;">⚠️ ${t.paymentFailedMessage}</p>
            </div>
            
            <div class="details-box">
              <div class="details-row">
                <span class="details-label">Booking ID</span>
                <span class="details-value">#${params.bookingId}</span>
              </div>
              <div class="details-row">
                <span class="details-label">${t.amountPaid}</span>
                <span class="details-value">${formatPrice(params.amount)}</span>
              </div>
            </div>

            <a href="${params.retryUrl}" class="button">${t.retryPayment}</a>

            <p>${t.signature}</p>
          </div>
          <div class="footer">
            <p>${t.copyright}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error('Error sending payment failed email:', error);
    throw error;
  }

  return data;
}

export async function sendBookingReminder(params: ReminderEmailParams) {
  const t = getEmailTranslations(params.locale);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const localePath = params.locale || 'en';

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: params.to,
    subject: `🎣 ${t.bookingReminder} - ${params.tripName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        ${getEmailStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ ${t.bookingReminder}</h1>
          </div>
          <div class="content">
            <p>${t.greeting} ${params.name},</p>
            <div class="warning">
              <p style="margin:0;">📅 ${t.reminderMessage}</p>
            </div>
            
            <div class="details-box">
              <h3 style="margin-top:0;">${t.bookingDetails}</h3>
              <div class="divider"></div>
              <div class="details-row">
                <span class="details-label">${t.trip}</span>
                <span class="details-value">${params.tripName}</span>
              </div>
              <div class="details-row">
                <span class="details-label">${t.date}</span>
                <span class="details-value">${formatDate(params.date, params.locale)}</span>
              </div>
              ${params.startTime ? `
                <div class="details-row">
                  <span class="details-label">${t.time}</span>
                  <span class="details-value">${params.startTime}</span>
                </div>
              ` : ''}
              ${params.meetingPoint ? `
                <div class="details-row">
                  <span class="details-label">${t.meetingPoint}</span>
                  <span class="details-value">${params.meetingPoint}</span>
                </div>
              ` : ''}
            </div>

            <div class="details-box">
              <h4 style="margin-top:0;">${t.whatToBring}</h4>
              <p>${t.whatToBringList}</p>
            </div>

            <div class="warning">
              <p style="margin:0;"><strong>${t.weatherNote}:</strong> ${t.weatherMessage}</p>
            </div>

            <a href="${appUrl}/${localePath}/booking?id=${params.bookingId}" class="button">${t.viewBooking}</a>

            <p>${t.farewell}</p>
            <p>${t.signature}</p>
          </div>
          <div class="footer">
            <p>${t.copyright}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error('Error sending booking reminder:', error);
    throw error;
  }

  return data;
}

export async function sendReviewRequest(params: ReviewRequestParams) {
  const t = getEmailTranslations(params.locale);

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: params.to,
    subject: `⭐ ${t.reviewRequest}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        ${getEmailStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⭐ ${t.reviewRequest}</h1>
          </div>
          <div class="content">
            <p>${t.greeting} ${params.name},</p>
            <p>${t.reviewMessage}</p>
            
            <div class="details-box">
              <div class="details-row">
                <span class="details-label">${t.trip}</span>
                <span class="details-value">${params.tripName}</span>
              </div>
            </div>

            <a href="${params.reviewUrl}" class="button">${t.leaveReview}</a>

            <p>${t.signature}</p>
          </div>
          <div class="footer">
            <p>${t.copyright}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error('Error sending review request:', error);
    throw error;
  }

  return data;
}

export async function sendCancellationEmail(params: CancellationEmailParams) {
  const t = getEmailTranslations(params.locale);

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: params.to,
    subject: `${t.cancellation} - Booking #${params.bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        ${getEmailStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header" style="background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);">
            <h1>📋 ${t.cancellation}</h1>
          </div>
          <div class="content">
            <p>${t.greeting} ${params.name},</p>
            <div class="warning">
              <p style="margin:0;">${t.cancellationMessage}</p>
            </div>
            
            <div class="details-box">
              <h3 style="margin-top:0;">${t.bookingDetails}</h3>
              <div class="divider"></div>
              <div class="details-row">
                <span class="details-label">Booking ID</span>
                <span class="details-value">#${params.bookingId}</span>
              </div>
              <div class="details-row">
                <span class="details-label">${t.trip}</span>
                <span class="details-value">${params.tripName}</span>
              </div>
              <div class="details-row">
                <span class="details-label">${t.date}</span>
                <span class="details-value">${formatDate(params.date, params.locale)}</span>
              </div>
            </div>

            ${params.refundAmount ? `
              <div class="details-box">
                <h4 style="margin-top:0;">${t.refundInfo}</h4>
                <div class="divider"></div>
                <div class="details-row">
                  <span class="details-label">${t.refundAmount}</span>
                  <span class="details-value">${formatPrice(params.refundAmount)}</span>
                </div>
                ${params.refundStatus ? `
                  <div class="details-row">
                    <span class="details-label">${t.refundStatus}</span>
                    <span class="details-value" style="text-transform: capitalize;">${params.refundStatus}</span>
                  </div>
                ` : ''}
                <p>${t.refundProcessing}</p>
              </div>
            ` : ''}

            <p>${t.signature}</p>
          </div>
          <div class="footer">
            <p>${t.copyright}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error('Error sending cancellation email:', error);
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
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: process.env.RESEND_FROM_EMAIL || fromEmail,
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        ${getEmailStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="details-box">
              <div class="details-row">
                <span class="details-label">Name</span>
                <span class="details-value">${name}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Email</span>
                <span class="details-value">${email}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Phone</span>
                <span class="details-value">${phone || 'N/A'}</span>
              </div>
              <div class="divider"></div>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error('Error sending contact notification:', error);
    throw error;
  }

  return data;
}