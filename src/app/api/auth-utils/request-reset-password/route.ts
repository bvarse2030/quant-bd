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
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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
    const { email, token } = await req.json();
    if (!email || typeof email !== 'string') {
      const response = formatResponse(null, 'Invalid email provided.', 400);
      return NextResponse.json(response, { status: response.status });
    }

    const resetUrl = `${BASE_URL}/reset-password?token=${encodeURIComponent(token)}`;

    const mailOptions = {
      from: GMAIL_USER,
      to: email,
      subject: 'Reset Your Password',
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request</title>
    </head>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background:linear-gradient(135deg,#8b5cf6 0%,#ec4899 50%,#d946ef 100%);min-height:100vh;">
      <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
        <tr>
          <td align="center" style="padding:40px 20px;">
            <table role="presentation" style="width:100%;max-width:600px;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.3);overflow:hidden;">
              
              <!-- Header with animated gradient -->
              <tr>
                <td style="padding:0;">
                  <div style="background:linear-gradient(135deg,#8b5cf6 0%,#ec4899 50%,#d946ef 100%);padding:50px 30px;text-align:center;position:relative;">
                    <!-- Glassmorphic icon container -->
                    <div style="background:rgba(255,255,255,0.25);width:100px;height:100px;margin:0 auto 24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);border:2px solid rgba(255,255,255,0.3);box-shadow:0 8px 32px rgba(0,0,0,0.1);">
                      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm9 13H6v-8h12v8z" fill="white"/>
                        <circle cx="12" cy="16" r="1.5" fill="white"/>
                        <path d="M12 17.5v2" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                    </div>
                    <h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:700;letter-spacing:-0.5px;text-shadow:0 2px 10px rgba(0,0,0,0.2);">Password Reset</h1>
                    <p style="margin:12px 0 0;color:rgba(255,255,255,0.95);font-size:16px;font-weight:500;">Secure your account in just one click</p>
                  </div>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding:45px 35px;">
                  <p style="margin:0 0 16px;color:#1f2937;font-size:18px;line-height:1.6;font-weight:600;">
                    Hello there! 👋
                  </p>
                  <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.7;">
                    We received a request to reset your password. Don't worry, we've got you covered! Click the button below to create a new password and regain access to your account.
                  </p>
                  
                  <!-- Stylish Button with hover effect -->
                  <div style="text-align:center;margin:40px 0;">
                    <a href="${resetUrl}" style="display:inline-block;padding:18px 50px;background:linear-gradient(135deg,#8b5cf6 0%,#ec4899 50%,#d946ef 100%);color:#ffffff;text-decoration:none;border-radius:50px;font-weight:700;font-size:17px;box-shadow:0 10px 30px rgba(139,92,246,0.4);letter-spacing:0.5px;text-transform:uppercase;transition:all 0.3s ease;">
                      🔐 Reset Password Now
                    </a>
                  </div>
                  
                  <p style="margin:35px 0 0;color:#9ca3af;font-size:14px;line-height:1.6;text-align:center;font-weight:500;">
                    Or copy and paste this link in your browser:
                  </p>
                  <div style="margin:12px 0;padding:16px;background:linear-gradient(135deg,#f3f4f6 0%,#e5e7eb 100%);border-radius:12px;border:1px solid #d1d5db;">
                    <p style="margin:0;color:#8b5cf6;font-size:13px;line-height:1.6;text-align:center;word-break:break-all;font-family:monospace;">
                      ${resetUrl}
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Security Warning Box -->
              <tr>
                <td style="padding:0 35px 40px;">
                  <div style="background:linear-gradient(135deg,#fef3c7 0%,#fde68a 100%);border-left:5px solid #f59e0b;padding:20px 24px;border-radius:12px;box-shadow:0 4px 15px rgba(245,158,11,0.2);">
                    <p style="margin:0 0 8px;color:#92400e;font-size:15px;line-height:1.6;font-weight:700;">
                      ⚡ Important Security Notice
                    </p>
                    <p style="margin:0;color:#78350f;font-size:14px;line-height:1.6;">
                      This password reset link will expire in <strong>1 hour</strong> for your security. If you didn't request this reset, please ignore this email or contact support immediately.
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Additional Info -->
              <tr>
                <td style="padding:0 35px 40px;">
                  <div style="background:linear-gradient(135deg,#e0e7ff 0%,#ddd6fe 100%);padding:20px 24px;border-radius:12px;border:1px solid #c7d2fe;">
                    <p style="margin:0 0 12px;color:#4c1d95;font-size:14px;line-height:1.6;font-weight:600;">
                      💡 Password Tips:
                    </p>
                    <ul style="margin:0;padding-left:20px;color:#5b21b6;font-size:13px;line-height:1.8;">
                      <li>Use at least 8 characters</li>
                      <li>Include uppercase and lowercase letters</li>
                      <li>Add numbers and special characters</li>
                      <li>Avoid common words or personal information</li>
                    </ul>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding:35px 35px;background:linear-gradient(135deg,#f9fafb 0%,#f3f4f6 100%);border-top:2px solid #e5e7eb;">
                  <p style="margin:0 0 12px;color:#6b7280;font-size:14px;line-height:1.6;text-align:center;font-weight:500;">
                    Need help? We're here for you!
                  </p>
                  <p style="margin:0 0 20px;color:#9ca3af;font-size:13px;line-height:1.6;text-align:center;">
                    If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
                  </p>
                  <div style="text-align:center;margin:20px 0 0;">
                    <p style="margin:0 0 8px;color:#8b5cf6;font-size:20px;font-weight:700;">
                      Your Company
                    </p>
                    <p style="margin:0;color:#d1d5db;font-size:12px;line-height:1.6;">
                      © ${new Date().getFullYear()} Your Company. All rights reserved.
                    </p>
                  </div>
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

    const response = formatResponse(null, 'Password reset email sent successfully.', 200);
    return NextResponse.json(response, { status: response.status });
  } catch (error: unknown) {
    console.error('Error sending password reset email:', error);

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
