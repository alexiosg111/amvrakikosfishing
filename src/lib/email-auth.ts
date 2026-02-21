import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function sendVerificationEmail({
  to,
  name,
  token,
  locale = "en",
}: {
  to: string;
  name: string;
  token: string;
  locale?: string;
}) {
  const verifyUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/${locale}/verify-email?token=${token}`;

  const content = {
    en: {
      subject: "Verify your email address",
      greeting: `Hello ${name},`,
      body: "Thank you for registering! Please verify your email address by clicking the button below:",
      buttonText: "Verify Email",
      alternativeText: "Or copy and paste this link into your browser:",
      closing: "If you didn't create an account, you can safely ignore this email.",
    },
    el: {
      subject: "Επαλήθευση της διεύθυνσης email σας",
      greeting: `Γεια σας ${name},`,
      body: "Ευχαριστούμε που εγγραφήκατε! Παρακαλώ επαληθεύστε τη διεύθυνση email σας κάνοντας κλικ στο παρακάτω κουμπί:",
      buttonText: "Επαλήθευση Email",
      alternativeText: "Ή αντιγράψτε και επικολλήστε αυτόν τον σύνδεσμο στον browser σας:",
      closing: "Αν δεν δημιουργήσατε λογαριασμό, μπορείτε να αγνοήσετε αυτό το email.",
    },
    de: {
      subject: "Bestätigen Sie Ihre E-Mail-Adresse",
      greeting: `Hallo ${name},`,
      body: "Vielen Dank für Ihre Registrierung! Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf die Schaltfläche unten klicken:",
      buttonText: "E-Mail bestätigen",
      alternativeText: "Oder kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:",
      closing: "Wenn Sie kein Konto erstellt haben, können Sie diese E-Mail ignorieren.",
    },
  };

  const t = content[locale as keyof typeof content] || content.en;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "noreply@amvrakikosfishing.com",
    to,
    subject: t.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a365d;">Amvrakikos Fishing Trips</h1>
        <p style="font-size: 16px;">${t.greeting}</p>
        <p style="font-size: 16px;">${t.body}</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #1a365d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
            ${t.buttonText}
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666;">${t.alternativeText}</p>
        <p style="font-size: 12px; color: #666; word-break: break-all;">${verifyUrl}</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        
        <p style="font-size: 14px; color: #666;">${t.closing}</p>
      </div>
    `,
  });

  if (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }

  return data;
}

export async function sendPasswordResetEmail({
  to,
  name,
  token,
  locale = "en",
}: {
  to: string;
  name: string;
  token: string;
  locale?: string;
}) {
  const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/${locale}/reset-password?token=${token}`;

  const content = {
    en: {
      subject: "Reset your password",
      greeting: `Hello ${name},`,
      body: "We received a request to reset your password. Click the button below to create a new password:",
      buttonText: "Reset Password",
      alternativeText: "Or copy and paste this link into your browser:",
      warning: "This link will expire in 1 hour.",
      closing: "If you didn't request a password reset, you can safely ignore this email.",
    },
    el: {
      subject: "Επαναφορά του κωδικού σας",
      greeting: `Γεια σας ${name},`,
      body: "Λάβαμε αίτημα για επαναφορά του κωδικού σας. Κάντε κλικ στο παρακάτω κουμπί για να δημιουργήσετε νέο κωδικό:",
      buttonText: "Επαναφορά Κωδικού",
      alternativeText: "Ή αντιγράψτε και επικολλήστε αυτόν τον σύνδεσμο στον browser σας:",
      warning: "Αυτός ο σύνδεσμος θα λήξει σε 1 ώρα.",
      closing: "Αν δεν ζητήσατε επαναφορά κωδικού, μπορείτε να αγνοήσετε αυτό το email.",
    },
    de: {
      subject: "Passwort zurücksetzen",
      greeting: `Hallo ${name},`,
      body: "Wir haben eine Anfrage zum Zurücksetzen Ihres Passworts erhalten. Klicken Sie auf die Schaltfläche unten, um ein neues Passwort zu erstellen:",
      buttonText: "Passwort zurücksetzen",
      alternativeText: "Oder kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:",
      warning: "Dieser Link läuft in 1 Stunde ab.",
      closing: "Wenn Sie keine Passwortzurücksetzung angefordert haben, können Sie diese E-Mail ignorieren.",
    },
  };

  const t = content[locale as keyof typeof content] || content.en;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "noreply@amvrakikosfishing.com",
    to,
    subject: t.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a365d;">Amvrakikos Fishing Trips</h1>
        <p style="font-size: 16px;">${t.greeting}</p>
        <p style="font-size: 16px;">${t.body}</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #1a365d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
            ${t.buttonText}
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666;">${t.alternativeText}</p>
        <p style="font-size: 12px; color: #666; word-break: break-all;">${resetUrl}</p>
        
        <p style="font-size: 14px; color: #dc2626; margin-top: 20px;">
          ⚠️ ${t.warning}
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        
        <p style="font-size: 14px; color: #666;">${t.closing}</p>
      </div>
    `,
  });

  if (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }

  return data;
}
