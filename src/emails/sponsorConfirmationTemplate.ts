import path from 'path'

interface SponsorshipData {
  [key: string]: any
}

export const generateSponsorConfirmationEmail = (submissionData: SponsorshipData): string => {
  const firstName =
    submissionData.first_name ||
    submissionData.name?.split(' ')[0] ||
    submissionData.contactName?.split(' ')[0] ||
    'there'

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for your interest - TNGSS 2025</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #ffffff;
            margin: 0;
            padding: 20px;
            background-color: #000000;
          }
          .email-container {
            max-width: 768px;
            margin: 0 auto;
            background-color: #000000;
            border-radius: 12px;
            overflow: hidden;
          }
          .header-banner {
            width: 100%;
            height: auto;
            display: block;
            margin-bottom: 40px;
          }
          .content {
            padding: 0 20px;
            background-color: #000000;
          }
          .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 30px;
            letter-spacing: -0.5px;
          }
          .main-text {
            font-size: 16px;
            line-height: 1.7;
            color: #ffffff;
            margin-bottom: 24px;
            font-weight: 400;
          }
          .main-text strong {
            color: #ffffff;
            font-weight: 600;
          }
          .attachment-notice {
            background-color: #111111;
            border: 1px solid #333333;
            border-radius: 8px;
            padding: 24px;
            margin: 32px 0;
            text-align: center;
          }
          .attachment-notice h3 {
            margin: 0 0 8px 0;
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
          }
          .attachment-notice p {
            margin: 0;
            color: #cccccc;
            font-size: 14px;
            font-weight: 400;
          }
          .footer-banner {
            width: 100%;
            height: auto;
            display: block;
            margin: 40px 0 20px 0;
          }
          .signature {
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid #333333;
          }
          .signature p {
            margin: 6px 0;
            font-size: 16px;
            color: #ffffff;
          }
          .team-signature {
            color: #ffffff;
            font-weight: 600;
            font-size: 16px;
          }
          .contact-info {
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid #333333;
          }
          .contact-info p {
            margin: 4px 0;
            font-size: 14px;
            color: #cccccc;
          }
          .website-link {
            display: inline-block;
            margin-top: 24px;
            padding: 12px 32px;
            background-color: #ffffff;
            border-radius: 6px;
            color: #18bfdb;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s ease;
          }
          .website-link:hover {
            background-color: #f0f0f0;
          }
          .footer {
            background-color: #000000;
            padding: 24px 20px;
            text-align: center;
            border-top: 1px solid #333333;
            margin-top: 40px;
          }
          .footer p {
            margin: 4px 0;
            font-size: 14px;
            color: #888888;
            font-weight: 400;
          }
          .footer p:first-child {
            color: #ffffff;
            font-weight: 600;
            font-size: 16px;
          }
          .footer p:nth-child(2) {
            color: #cccccc;
            font-size: 14px;
          }
          
          @media (max-width: 640px) {
            body {
              padding: 10px;
            }
            .content {
              padding: 0 10px;
            }
            .greeting {
              font-size: 22px;
            }
            .main-text {
              font-size: 15px;
            }
            .footer {
              padding: 20px 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Header Banner -->
          <img src="cid:header-banner" alt="TNGSS 2025 Header" class="header-banner" />
          
          <div class="content">
            <div class="greeting">
              Hi ${firstName},
            </div>
            
            <div class="main-text">
              Thank you for submitting your sponsorship interest form for <strong>TNGSS 2025</strong>.
            </div>
            
            <div class="main-text">
              We're excited about the possibility of partnering with you to make this event a success.
            </div>
            
            <div class="main-text">
              Our team will review your submission and get in touch with you soon to share the next steps, sponsorship packages, and ways we can tailor the partnership to maximize value for your brand.
            </div>
            
            <div class="main-text">
              Please find our sponsorship deck attached to this email for your review.
            </div>
            
            <div class="attachment-notice">
              <h3>Attachment Included</h3>
              <p>TNGSS 2025 Sponsorship Deck - Partnership Opportunities & Benefits</p>
            </div>
            
            <div class="signature">
              <p>Best regards,</p>
              <p class="team-signature">The TNGSS 2025 Partnerships Team</p>
              <p>Tamil Nadu Global Startup Summit</p>
              <p>sivakumar@tngss.in</p>
              
              <div class="contact-info">
                <a href="https://tngss.startuptn.in" class="website-link">Visit TNGSS 2025</a>
              </div>
            </div>
          </div>
          
          <!-- Footer Banner -->
          <img src="cid:footer-banner" alt="TNGSS 2025 Footer" class="footer-banner" />
          
          <div class="footer">
            <p>Tamil Nadu Global Startup Summit 2025</p>
            <p>Building the future of innovation in Tamil Nadu</p>
            <p>This is an automated confirmation email. Please do not reply directly to this message.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export const getSponsorConfirmationEmailConfig = (submissionData: SponsorshipData) => {
  const userEmail = submissionData.email || submissionData.emailAddress
  const companyName = submissionData.company_name || submissionData.company || 'your company'

  const assetsDir = path.resolve(process.cwd(), 'src', 'assets', 'sponsorship')

  return {
    to: userEmail,
    from: process.env.FROM_MAIL || 'events@startuptn.in',
    subject: `Thank you for your interest in TNGSS 2025 Partnership - ${companyName}`,
    html: generateSponsorConfirmationEmail(submissionData),
    attachments: [
      {
        filename: 'TNGSS Sponsorship Deck.pdf',
        path: path.join(assetsDir, 'TNGSS Sponsorship Deck.pdf'),
        contentType: 'application/pdf',
      },
      {
        filename: 'header-banner.jpg',
        path: path.join(assetsDir, 'header-banner.jpg'),
        cid: 'header-banner',
      },
      {
        filename: 'footer-banner.jpg',
        path: path.join(assetsDir, 'footer-banner.jpg'),
        cid: 'footer-banner',
      },
    ],
  }
}
