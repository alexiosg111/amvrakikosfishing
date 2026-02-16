export const emailStyles = {
  container: `
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
  `,
  header: `
    background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%);
    padding: 40px 30px;
    text-align: center;
  `,
  logo: `
    color: #ffffff;
    font-size: 28px;
    font-weight: bold;
    margin: 0;
    font-family: Georgia, serif;
  `,
  tagline: `
    color: #90cdf4;
    font-size: 14px;
    margin-top: 8px;
  `,
  content: `
    padding: 40px 30px;
    color: #2d3748;
    line-height: 1.6;
  `,
  heading: `
    color: #1a365d;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  `,
  greeting: `
    font-size: 18px;
    margin-bottom: 16px;
    color: #2d3748;
  `,
  detailsBox: `
    background: #f7fafc;
    border-left: 4px solid #2c5282;
    padding: 24px;
    border-radius: 8px;
    margin: 24px 0;
  `,
  detailRow: `
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #e2e8f0;
  `,
  detailLabel: `
    color: #718096;
    font-weight: 500;
  `,
  detailValue: `
    color: #2d3748;
    font-weight: 600;
  `,
  totalRow: `
    display: flex;
    justify-content: space-between;
    padding: 16px 0 0 0;
    margin-top: 12px;
    border-top: 2px solid #2c5282;
  `,
  totalLabel: `
    color: #1a365d;
    font-size: 18px;
    font-weight: bold;
  `,
  totalValue: `
    color: #2c5282;
    font-size: 20px;
    font-weight: bold;
  `,
  button: `
    display: inline-block;
    background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%);
    color: #ffffff;
    padding: 14px 32px;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    margin: 24px 0;
  `,
  footer: `
    background: #f7fafc;
    padding: 30px;
    text-align: center;
    border-top: 1px solid #e2e8f0;
  `,
  footerText: `
    color: #718096;
    font-size: 14px;
    margin: 4px 0;
  `,
  highlight: `
    background: #c6f6d5;
    color: #22543d;
    padding: 16px;
    border-radius: 8px;
    margin: 20px 0;
    text-align: center;
  `,
  info: `
    background: #bee3f8;
    color: #2a4365;
    padding: 16px;
    border-radius: 8px;
    margin: 20px 0;
  `,
};

export function createEmailLayout(content: string, title: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #edf2f7;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding: 20px 10px;">
            <div style="${emailStyles.container}">
              <div style="${emailStyles.header}">
                <h1 style="${emailStyles.logo}">🎣 Amvrakikos Fishing</h1>
                <p style="${emailStyles.tagline}">Unforgettable Fishing Adventures</p>
              </div>
              ${content}
              <div style="${emailStyles.footer}">
                <p style="${emailStyles.footerText}">Amvrakikos Bay, Preveza, Greece</p>
                <p style="${emailStyles.footerText}">
                  <a href="mailto:bookings@amvrakikosfishing.com" style="color: #2c5282; text-decoration: none;">
                    bookings@amvrakikosfishing.com
                  </a>
                </p>
                <p style="${emailStyles.footerText}">© ${new Date().getFullYear()} Amvrakikos Fishing Trips. All rights reserved.</p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
