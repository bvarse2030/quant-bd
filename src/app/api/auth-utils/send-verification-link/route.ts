/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

import { formatResponse, IResponse } from '@/app/api/utils/utils';

const GMAIL_USER = process.env.GMAIL_USER!;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD!;
const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET!;

if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !EMAIL_TOKEN_SECRET) {
  throw new Error('Missing env vars: GMAIL_USER, GMAIL_APP_PASSWORD, EMAIL_TOKEN_SECRET');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request): Promise<NextResponse<IResponse>> {
  try {
    const { email, verificationUrl } = await req.json();
    if (!email || typeof email !== 'string') {
      const response = formatResponse(null, 'Invalid email provided.', 400);
      return NextResponse.json(response, { status: response.status });
    }

    const mailOptions = {
      from: GMAIL_USER,
      to: email,
      subject: 'Verify your email address',
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
    </head>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;">
      <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
        <tr>
          <td align="center" style="padding:40px 20px;">
            <table role="presentation" style="width:100%;max-width:600px;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.15);overflow:hidden;">
              
              <!-- Header with gradient -->
              <tr>
                <td style="padding:0;">
                  <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 30px;text-align:center;">
                    <div style="background:rgba(255,255,255,0.2);width:80px;height:80px;margin:0 auto 20px;border-radius:50%;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="white"/>
                      </svg>
                    </div>
                    <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:600;letter-spacing:-0.5px;">Verify Your Email</h1>
                  </div>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding:40px 30px;">
                  <p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.6;">
                    Hey there! 👋
                  </p>
                  <p style="margin:0 0 30px;color:#6b7280;font-size:15px;line-height:1.6;">
                    We're excited to have you on board! Just one more step to get started. Click the button below to verify your email address and activate your account.
                  </p>
                  
                  <!-- Button -->
                  <div style="text-align:center;margin:40px 0;">
                    <a href="${verificationUrl}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;text-decoration:none;border-radius:50px;font-weight:600;font-size:16px;box-shadow:0 4px 15px rgba(102,126,234,0.4);transition:all 0.3s ease;">
                      ✨ Verify Email Address
                    </a>
                  </div>
                  
                  <p style="margin:30px 0 0;color:#9ca3af;font-size:13px;line-height:1.6;text-align:center;">
                    Or copy and paste this link in your browser:
                  </p>
                  <p style="margin:8px 0 0;color:#667eea;font-size:13px;line-height:1.6;text-align:center;word-break:break-all;">
                    ${verificationUrl}
                  </p>
                </td>
              </tr>
              
              <!-- Info Box -->
              <tr>
                <td style="padding:0 30px 40px;">
                  <div style="background:linear-gradient(135deg,#fef3c7 0%,#fde68a 100%);border-left:4px solid #f59e0b;padding:16px 20px;border-radius:8px;">
                    <p style="margin:0;color:#92400e;font-size:14px;line-height:1.5;">
                      ⏰ <strong>Quick heads up:</strong> This verification link will expire in 1 hour for security reasons.
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding:30px;background:#f9fafb;border-top:1px solid #e5e7eb;">
                  <p style="margin:0 0 10px;color:#9ca3af;font-size:13px;line-height:1.6;text-align:center;">
                    If you didn't create an account, you can safely ignore this email.
                  </p>
                  <p style="margin:0;color:#d1d5db;font-size:12px;line-height:1.6;text-align:center;">
                    © ${new Date().getFullYear()} Your Company. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
    };

    await transporter.sendMail(mailOptions);

    const response = formatResponse(null, 'Verification email sent successfully.', 200);
    return NextResponse.json(response, { status: response.status });
  } catch (error: unknown) {
    console.error('Error sending verification email:', error);

    const err = error as { code?: string; message?: string; keyValue?: Record<string, unknown> };

    let response: IResponse;

    if (err.code === 'EENVELOPE') {
      response = formatResponse(null, `Email delivery failed: ${err.message || 'Check recipient/sender.'}`, 400);
    } else if (err.code === 'EAUTH') {
      response = formatResponse(null, `Email server authentication failed. Please check GMAIL_APP_PASSWORD.`, 500);
    } else if (err.keyValue) {
      response = formatResponse(null, `Failed to send email due to a data conflict: ${JSON.stringify(err.keyValue)}`, 500);
    } else {
      response = formatResponse(null, 'An unexpected internal server error occurred.', 500);
    }

    return NextResponse.json(response, { status: response.status });
  }
}
