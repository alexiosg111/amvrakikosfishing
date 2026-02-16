import { Resend } from 'resend';
import { emailStyles, createEmailLayout } from './templates';

const resend = new Resend(process.env.RESEND_API_KEY || '');

const fromEmail = process.env.RESEND_FROM_EMAIL || 'bookings@amvrakikosfishing.com';

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
  const isGreek = locale === 'el';
  
  const content = `
    <div style="${emailStyles.content}">
      <h2 style="${emailStyles.heading}">
        ${isGreek ? 'Η Κράτησή Σας Επιβεβαιώθηκε!' : 'Your Booking is Confirmed!'}
      </h2>
      
      <p style="${emailStyles.greeting}">
        ${isGreek ? 'Γειά σας' : 'Hello'} ${name},
      </p>
      
      <p style="color: #4a5568; margin-bottom: 20px;">
        ${isGreek 
          ? `Είμαστε ενθουσιασμένοι που θα σας υποδεχτούμε για μια αξέχαστη εμπειρία ψαρέματος! Η κράτησή σας έχει επιβεβαιωθεί.` 
          : `We're excited to welcome you for an unforgettable fishing experience! Your booking has been confirmed.`}
      </p>
      
      <div style="${emailStyles.detailsBox}">
        <h3 style="color: #1a365d; margin-top: 0; margin-bottom: 16px; font-size: 18px;">
          ${isGreek ? 'Στοιχεία Κράτησης' : 'Booking Details'}
        </h3>
        
        <div style="${emailStyles.detailRow}">
          <span style="${emailStyles.detailLabel}">${isGreek ? 'Κωδικός Κράτησης' : 'Booking ID'}</span>
          <span style="${emailStyles.detailValue}">#${bookingId.slice(-8).toUpperCase()}</span>
        </div>
        
        <div style="${emailStyles.detailRow}">
          <span style="${emailStyles.detailLabel}">${isGreek ? 'Εκδρομή' : 'Trip'}</span>
          <span style="${emailStyles.detailValue}">${tripName}</span>
        </div>
        
        <div style="${emailStyles.detailRow}">
          <span style="${emailStyles.detailLabel}">${isGreek ? 'Ημερομηνία' : 'Date'}</span>
          <span style="${emailStyles.detailValue}">${date.toLocaleDateString(isGreek ? 'el-GR' : 'en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
        
        <div style="${emailStyles.detailRow}">
          <span style="${emailStyles.detailLabel}">${isGreek ? 'Συμμετέχοντες' : 'Participants'}</span>
          <span style="${emailStyles.detailValue}">${participants} ${isGreek ? 'άτομα' : 'people'}</span>
        </div>
        
        <div style="${emailStyles.totalRow}">
          <span style="${emailStyles.totalLabel}">${isGreek ? 'Σύνολο' : 'Total'}</span>
          <span style="${emailStyles.totalValue}">€${totalPrice}</span>
        </div>
      </div>
      
      <div style="${emailStyles.info}">
        <strong>📍 ${isGreek ? 'Σημείο Συνάντησης' : 'Meeting Point'}</strong><br>
        ${isGreek 
          ? 'Λιμάνι Μενιδίου, Αμβρακικός Κόλπος, Πρέβεζα. Παρακαλούμε φτάστε 15 λεπτά πριν την ώρα αναχώρησης.' 
          : 'Menidi Port, Amvrakikos Bay, Preveza. Please arrive 15 minutes before departure time.'}
      </div>
      
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/booking/success?id=${bookingId}" style="${emailStyles.button}">
          ${isGreek ? 'Προβολή Κράτησης' : 'View Booking'}
        </a>
      </div>
      
      <p style="color: #718096; font-size: 14px; margin-top: 24px;">
        ${isGreek 
          ? 'Αν έχετε οποιεσδήποτε ερωτήσεις, μη διστάσετε να επικοινωνήσετε μαζί μας.' 
          : 'If you have any questions, please don\'t hesitate to contact us.'}
      </p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject: isGreek 
      ? `🎣 Επιβεβαίωση Κράτησης #${bookingId.slice(-8).toUpperCase()}` 
      : `🎣 Booking Confirmation #${bookingId.slice(-8).toUpperCase()}`,
    html: createEmailLayout(content, isGreek ? 'Επιβεβαίωση Κράτησης' : 'Booking Confirmation'),
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
  const isGreek = locale === 'el';
  
  const content = `
    <div style="${emailStyles.content}">
      <h2 style="${emailStyles.heading}">
        ${isGreek ? 'Η Πληρωμή Σας Ολοκληρώθηκε!' : 'Payment Received!'}
      </h2>
      
      <p style="${emailStyles.greeting}">
        ${isGreek ? 'Γειά σας' : 'Hello'} ${name},
      </p>
      
      <p style="color: #4a5568; margin-bottom: 20px;">
        ${isGreek 
          ? 'Σας ευχαριστούμε για την πληρωμή σας. Η απόδειξή σας είναι συνημμένη παρακάτω.' 
          : 'Thank you for your payment. Your receipt is attached below.'}
      </p>
      
      <div style="${emailStyles.highlight}">
        <strong style="font-size: 18px;">✓ ${isGreek ? 'Πληρωμή Επιτυχής' : 'Payment Successful'}</strong>
      </div>
      
      <div style="${emailStyles.detailsBox}">
        <h3 style="color: #1a365d; margin-top: 0; margin-bottom: 16px; font-size: 18px;">
          ${isGreek ? 'Στοιχεία Πληρωμής' : 'Payment Details'}
        </h3>
        
        <div style="${emailStyles.detailRow}">
          <span style="${emailStyles.detailLabel}">${isGreek ? 'Κωδικός Κράτησης' : 'Booking ID'}</span>
          <span style="${emailStyles.detailValue}">#${bookingId.slice(-8).toUpperCase()}</span>
        </div>
        
        <div style="${emailStyles.detailRow}">
          <span style="${emailStyles.detailLabel}">${isGreek ? 'Ποσό' : 'Amount'}</span>
          <span style="${emailStyles.detailValue}">€${amount}</span>
        </div>
        
        <div style="${emailStyles.detailRow}">
          <span style="${emailStyles.detailLabel}">${isGreek ? 'Ημερομηνία' : 'Date'}</span>
          <span style="${emailStyles.detailValue}">${new Date().toLocaleDateString(isGreek ? 'el-GR' : 'en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
        
        <div style="${emailStyles.detailRow}">
          <span style="${emailStyles.detailLabel}">${isGreek ? 'Μέθοδος' : 'Method'}</span>
          <span style="${emailStyles.detailValue}">Credit Card (Stripe)</span>
        </div>
      </div>
      
      <div style="${emailStyles.info}">
        <strong>🎣 ${isGreek ? 'Τι Συμβαίνει Τώρα;' : 'What Happens Next?'}</strong><br>
        ${isGreek 
          ? 'Θα λάβετε ένα email με οδηγίες και λεπτομέρειες συνάντησης 24 ώρες πριν την εκδρομή σας.' 
          : 'You will receive an email with instructions and meeting details 24 hours before your trip.'}
      </div>
      
      <p style="color: #718096; font-size: 14px; margin-top: 24px;">
        ${isGreek 
          ? 'Αν χρειάζεστε απόδειξη ή έχετε ερωτήσεις, επικοινωνήστε μαζί μας.' 
          : 'If you need an invoice or have any questions, please contact us.'}
      </p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject: isGreek 
      ? `🧾 Απόδειξη Πληρωμής #${bookingId.slice(-8).toUpperCase()}` 
      : `🧾 Payment Receipt #${bookingId.slice(-8).toUpperCase()}`,
    html: createEmailLayout(content, isGreek ? 'Απόδειξη Πληρωμής' : 'Payment Receipt'),
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
  const content = `
    <div style="${emailStyles.content}">
      <h2 style="${emailStyles.heading}">New Contact Form Submission</h2>
      
      <div style="${emailStyles.detailsBox}">
        <div style="${emailStyles.detailRow}">
          <span style="${emailStyles.detailLabel}">Name</span>
          <span style="${emailStyles.detailValue}">${name}</span>
        </div>
        
        <div style="${emailStyles.detailRow}">
          <span style="${emailStyles.detailLabel}">Email</span>
          <span style="${emailStyles.detailValue}">${email}</span>
        </div>
        
        <div style="${emailStyles.detailRow}">
          <span style="${emailStyles.detailLabel}">Phone</span>
          <span style="${emailStyles.detailValue}">${phone || 'N/A'}</span>
        </div>
        
        <div style="${emailStyles.detailRow}">
          <span style="${emailStyles.detailLabel}">Date</span>
          <span style="${emailStyles.detailValue}">${new Date().toLocaleString()}</span>
        </div>
      </div>
      
      <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4 style="color: #1a365d; margin-top: 0;">Message:</h4>
        <p style="white-space: pre-wrap; color: #4a5568; margin: 0;">${message}</p>
      </div>
      
      <div style="text-align: center;">
        <a href="mailto:${email}" style="${emailStyles.button}">
          Reply to ${name}
        </a>
      </div>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: fromEmail,
    subject: `📧 New Contact Form: ${name}`,
    html: createEmailLayout(content, 'Contact Form Submission'),
    replyTo: email,
  });

  if (error) {
    console.error('Error sending email:', error);
    throw error;
  }

  return data;
}

export async function sendBookingReminder({
  to,
  bookingId,
  tripName,
  date,
  name,
}: {
  to: string;
  bookingId: string;
  tripName: string;
  date: Date;
  name: string;
}) {
  const content = `
    <div style="${emailStyles.content}">
      <h2 style="${emailStyles.heading}">🎣 Your Fishing Trip is Tomorrow!</h2>
      
      <p style="${emailStyles.greeting}">Hello ${name},</p>
      
      <p style="color: #4a5568; margin-bottom: 20px;">
        Just a friendly reminder that your fishing adventure is scheduled for tomorrow! We're excited to have you on board.
      </p>
      
      <div style="${emailStyles.detailsBox}">
        <h3 style="color: #1a365d; margin-top: 0; margin-bottom: 16px; font-size: 18px;">
          Trip Details
        </h3>
        
        <div style="${emailStyles.detailRow}">
          <span style="${emailStyles.detailLabel}">Trip</span>
          <span style="${emailStyles.detailValue}">${tripName}</span>
        </div>
        
        <div style="${emailStyles.detailRow}">
          <span style="${emailStyles.detailLabel}">Date</span>
          <span style="${emailStyles.detailValue}">${date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>
      
      <div style="${emailStyles.info}">
        <strong>📍 Meeting Point</strong><br>
        Menidi Port, Amvrakikos Bay, Preveza<br>
        <strong>Please arrive 15 minutes early</strong>
      </div>
      
      <div style="${emailStyles.highlight}">
        <strong>What to Bring:</strong><br>
        • Sunscreen and hat<br>
        • Comfortable clothing<br>
        • Camera for photos<br>
        • Your excitement! 🎣
      </div>
      
      <p style="color: #718096; font-size: 14px; margin-top: 24px;">
        Questions? Reply to this email or call us at +30 26810 XXXXX
      </p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject: `🎣 Reminder: Your Fishing Trip Tomorrow!`,
    html: createEmailLayout(content, 'Booking Reminder'),
  });

  if (error) {
    console.error('Error sending email:', error);
    throw error;
  }

  return data;
}

export async function sendBookingCancellation({
  to,
  bookingId,
  tripName,
  name,
  refundAmount,
}: {
  to: string;
  bookingId: string;
  tripName: string;
  name: string;
  refundAmount?: number;
}) {
  const content = `
    <div style="${emailStyles.content}">
      <h2 style="${emailStyles.heading}">Booking Cancelled</h2>
      
      <p style="${emailStyles.greeting}">Hello ${name},</p>
      
      <p style="color: #4a5568; margin-bottom: 20px;">
        We're writing to confirm that your booking has been cancelled as requested.
      </p>
      
      <div style="${emailStyles.detailsBox}">
        <h3 style="color: #1a365d; margin-top: 0; margin-bottom: 16px; font-size: 18px;">
          Cancelled Booking Details
        </h3>
        
        <div style="${emailStyles.detailRow}">
          <span style="${emailStyles.detailLabel}">Booking ID</span>
          <span style="${emailStyles.detailValue}">#${bookingId.slice(-8).toUpperCase()}</span>
        </div>
        
        <div style="${emailStyles.detailRow}">
          <span style="${emailStyles.detailLabel}">Trip</span>
          <span style="${emailStyles.detailValue}">${tripName}</span>
        </div>
        
        ${refundAmount ? `
        <div style="${emailStyles.totalRow}">
          <span style="${emailStyles.totalLabel}">Refund Amount</span>
          <span style="${emailStyles.totalValue}">€${refundAmount}</span>
        </div>
        ` : ''}
      </div>
      
      ${refundAmount ? `
      <div style="${emailStyles.info}">
        Your refund of €${refundAmount} will be processed within 5-7 business days to your original payment method.
      </div>
      ` : ''}
      
      <p style="color: #718096; font-size: 14px; margin-top: 24px;">
        We hope to welcome you on board in the future. If you have any questions, please don't hesitate to contact us.
      </p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject: `Booking Cancellation Confirmation #${bookingId.slice(-8).toUpperCase()}`,
    html: createEmailLayout(content, 'Booking Cancelled'),
  });

  if (error) {
    console.error('Error sending email:', error);
    throw error;
  }

  return data;
}
