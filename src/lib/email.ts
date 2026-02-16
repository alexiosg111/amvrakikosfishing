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
