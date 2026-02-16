import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function sendBookingConfirmation({
  to,
  bookingId,
  tripName,
  date,
  participants,
  totalPrice,
  name,
  locale = 'en',
}: {
  to: string;
  bookingId: string;
  tripName: string;
  date: Date;
  participants: number;
  totalPrice: number;
  name: string;
  locale?: string;
}) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'bookings@amvrakikosfishing.com',
    to,
    subject: locale === 'el'
      ? `Επιβεβαίωση Κράτησης #${bookingId}`
      : `Booking Confirmation #${bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a365d;">${locale === 'el' ? 'Επιβεβαίωση Κράτησης' : 'Booking Confirmation'}</h1>
        <p>Hello ${name},</p>
        <p>${locale === 'el'
          ? 'Η κράτησή σας έχει επιβεβαιωθεί!'
          : 'Your booking has been confirmed!'}</p>
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Trip:</strong> ${tripName}</p>
          <p><strong>Date:</strong> ${date.toLocaleDateString()}</p>
          <p><strong>Participants:</strong> ${participants}</p>
          <p><strong>Total Price:</strong> €${totalPrice}</p>
        </div>
        <p>We look forward to seeing you!</p>
      </div>
    `,
  });

  if (error) {
    console.error('Error sending email:', error);
    throw error;
  }

  return data;
}

export async function sendPaymentReceipt({
  to,
  bookingId,
  amount,
  name,
  locale = 'en',
}: {
  to: string;
  bookingId: string;
  amount: number;
  name: string;
  locale?: string;
}) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'bookings@amvrakikosfishing.com',
    to,
    subject: locale === 'el'
      ? `Απόδειξη Πληρωμής #${bookingId}`
      : `Payment Receipt #${bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a365d;">${locale === 'el' ? 'Απόδειξη Πληρωμής' : 'Payment Receipt'}</h1>
        <p>Hello ${name},</p>
        <p>${locale === 'el'
          ? 'Η πληρωμή σας έχει ληφθεί επιτυχώς.'
          : 'Your payment has been received successfully.'}</p>
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Amount Paid:</strong> €${amount}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p>Thank you for your booking!</p>
      </div>
    `,
  });

  if (error) {
    console.error('Error sending email:', error);
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
    from: process.env.RESEND_FROM_EMAIL || 'contact@amvrakikosfishing.com',
    to: process.env.RESEND_FROM_EMAIL || 'bookings@amvrakikosfishing.com',
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a365d;">New Contact Form Submission</h1>
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('Error sending email:', error);
    throw error;
  }

  return data;
}

export async function sendUpsellEmail({
  to,
  name,
  bookingId,
  tripName,
  tripDate,
  locale = 'en',
  discountCode = 'EXTRA10',
}: {
  to: string;
  name: string;
  bookingId: string;
  tripName: string;
  tripDate: Date;
  locale?: string;
  discountCode?: string;
}) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'bookings@amvrakikosfishing.com',
    to,
    subject: locale === 'el'
      ? '✨ Αναβαθμίστε την εμπειρία σας!'
      : '✨ Enhance Your Experience!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">✨ ${locale === 'el' ? 'Αναβαθμίστε την εμπειρία σας!' : 'Enhance Your Experience!'}</h1>
        </div>

        <div style="padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 10px 10px;">
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
            ${locale === 'el'
              ? `Γεια σου ${name}!`
              : `Hello ${name}!`}
          </p>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-top: 15px;">
            ${locale === 'el'
              ? `Είμαστε ενθουσιασμένοι που επιλέξατε το <strong>${tripName}</strong> για τις ${tripDate.toLocaleDateString()}.`
              : `We're excited that you've chosen the <strong>${tripName}</strong> for ${tripDate.toLocaleDateString()}.`}
          </p>

          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
            <h2 style="color: #1a365d; margin: 0 0 10px 0; font-size: 18px;">
              📸 ${locale === 'el' ? 'Απαθανίστε τις αναμνήσεις σας' : 'Capture Your Memories'}
            </h2>
            <p style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 0;">
              ${locale === 'el'
                ? 'Το 85% των επισκεπτών μας επιλέγουν το Πακέτο Φωτογραφιών για να καταγράψουν τις αγαπημένες στιγμές τους!'
                : '85% of our guests choose the Photo Package to capture their favorite moments!'}
            </p>
          </div>

          <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h2 style="color: #1a365d; margin: 0 0 10px 0; font-size: 18px;">
              🍽️ ${locale === 'el' ? 'Γεύση της Ελλάδας' : 'Taste of Greece'}
            </h2>
            <p style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 0;">
              ${locale === 'el'
                ? 'Απολαύστε ντόπια delicacies και φρέσκα θαλασσινά με το Πακέτο Γεύματος μας!'
                : 'Enjoy local delicacies and fresh seafood with our Lunch Package!'}
            </p>
          </div>

          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
            <h2 style="color: #1a365d; margin: 0 0 10px 0; font-size: 18px;">
              🌅 ${locale === 'el' ? 'Εκταση ηλιοβασιλέματος' : 'Sunset Extension'}
            </h2>
            <p style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 0;">
              ${locale === 'el'
                ? 'Εκτείνετε το ταξίδι σας κατά 2 ώρες και απολαύστε τα πανέμορφα ηλιοβασιλέματα του Αμβρακικού!'
                : 'Extend your trip by 2 hours and enjoy Amvrakikos\' stunning sunsets!'}
            </p>
          </div>

          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <p style="color: white; font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">
              🎁 ${locale === 'el' ? 'Εξαιρετική Προσφορά!' : 'Special Offer!'}
            </p>
            <p style="color: white; font-size: 14px; margin: 0;">
              ${locale === 'el'
                ? `Χρησιμοποιήστε τον κωδικό <strong>${discountCode}</strong> για 10% έκπτωση σε όλα τα πρόσθετα!`
                : `Use code <strong>${discountCode}</strong> for 10% off all add-ons!`}
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://amvrakikosfishing.com/booking?booking=${bookingId}" style="background: #1a365d; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
              ${locale === 'el' ? 'Προσθήκη Προσθέτων' : 'Add Add-ons Now'}
            </a>
          </div>

          <p style="color: #718096; font-size: 12px; text-align: center; margin-top: 30px;">
            ${locale === 'el'
              ? 'Μπορείτε να προσθέσετε extras μέχρι 24 ώρες πριν το ταξίδι σας.'
              : 'You can add extras up to 24 hours before your trip.'}
          </p>
        </div>

        <div style="background: #f7fafc; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 12px; margin: 0;">
            ${locale === 'el'
              ? 'Αν έχετε ερωτήσεις, απαντήστε σε αυτό το email ή επικοινωνήστε μαζί μας.'
              : 'If you have any questions, reply to this email or contact us.'}
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('Error sending upsell email:', error);
    throw error;
  }

  return data;
}
