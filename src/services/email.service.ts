import { Resend } from "resend";
import env from "@/config/env";

const resend = new Resend(env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  /**
   * Send an email using Resend
   */
  static async sendEmail(options: EmailOptions): Promise<void> {
    try {
      if (!env.RESEND_API_KEY) {
        console.log("📧 Email would be sent:", options);
        return;
      }

      await resend.emails.send({
        from: env.FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      console.log(`📧 Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      throw new Error("Failed to send email");
    }
  }

  /**
   * Send email verification email
   */
  static async sendVerificationEmail(
    email: string,
    verificationUrl: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #3B82F6; }
            .button { display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">💰 Pennylogs</div>
            </div>

            <h1>Verify Your Email Address</h1>

            <p>Welcome to Pennylogs! Please verify your email address to complete your account setup.</p>

            <p>
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>

            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="${verificationUrl}">${verificationUrl}</a></p>

            <div class="footer">
              <p>If you didn't create a Pennylogs account, you can safely ignore this email.</p>
              <p>© ${new Date().getFullYear()} Pennylogs. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Welcome to Pennylogs!

      Please verify your email address by clicking the link below:
      ${verificationUrl}

      If you didn't create a Pennylogs account, you can safely ignore this email.
    `;

    await this.sendEmail({
      to: email,
      subject: "Verify your Pennylogs account",
      html,
      text,
    });
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(
    email: string,
    resetUrl: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #3B82F6; }
            .button { display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">💰 Pennylogs</div>
            </div>

            <h1>Reset Your Password</h1>

            <p>You requested to reset your password for your Pennylogs account.</p>

            <p>
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>

            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>

            <p><strong>This link will expire in 1 hour for security reasons.</strong></p>

            <div class="footer">
              <p>If you didn't request a password reset, you can safely ignore this email.</p>
              <p>© ${new Date().getFullYear()} Pennylogs. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Reset Your Password

      You requested to reset your password for your Pennylogs account.

      Click the link below to reset your password:
      ${resetUrl}

      This link will expire in 1 hour for security reasons.

      If you didn't request a password reset, you can safely ignore this email.
    `;

    await this.sendEmail({
      to: email,
      subject: "Reset your Pennylogs password",
      html,
      text,
    });
  }

  /**
   * Send welcome email
   */
  static async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Pennylogs</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #3B82F6; }
            .button { display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
            .feature { margin: 15px 0; padding: 15px; background: #f8fafc; border-radius: 6px; }
            .feature-icon { font-size: 20px; margin-right: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">💰 Pennylogs</div>
            </div>

            <h1>Welcome to Pennylogs, ${name}! 🎉</h1>

            <p>We're excited to have you on board! Pennylogs is your comprehensive financial tracking companion, designed to help you take control of your finances.</p>

            <h2>What you can do with Pennylogs:</h2>

            <div class="feature">
              <span class="feature-icon">📊</span>
              <strong>Track Expenses:</strong> Monitor your spending across multiple accounts and categories
            </div>

            <div class="feature">
              <span class="feature-icon">💳</span>
              <strong>Manage Accounts:</strong> Connect your bank accounts, credit cards, and investments
            </div>

            <div class="feature">
              <span class="feature-icon">🎯</span>
              <strong>Set Goals:</strong> Create savings goals and budgets to achieve your financial objectives
            </div>

            <div class="feature">
              <span class="feature-icon">📈</span>
              <strong>Generate Reports:</strong> Get insights with detailed financial reports and analytics
            </div>

            <div class="feature">
              <span class="feature-icon">👥</span>
              <strong>Split Expenses:</strong> Share expenses with friends and family in groups
            </div>

            <p>
              <a href="${
                env.CORS_ORIGIN
              }" class="button">Start Managing Your Finances</a>
            </p>

            <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>

            <div class="footer">
              <p>Happy budgeting!</p>
              <p>The Pennylogs Team</p>
              <p>© ${new Date().getFullYear()} Pennylogs. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Welcome to Pennylogs, ${name}!

      We're excited to have you on board! Pennylogs is your comprehensive financial tracking companion.

      What you can do with Pennylogs:
      📊 Track Expenses: Monitor your spending across multiple accounts and categories
      💳 Manage Accounts: Connect your bank accounts, credit cards, and investments
      🎯 Set Goals: Create savings goals and budgets to achieve your financial objectives
      📈 Generate Reports: Get insights with detailed financial reports and analytics
      👥 Split Expenses: Share expenses with friends and family in groups

      Start managing your finances: ${env.CORS_ORIGIN}

      If you have any questions, reach out to our support team.

      Happy budgeting!
      The Pennylogs Team
    `;

    await this.sendEmail({
      to: email,
      subject: "Welcome to Pennylogs! 🎉",
      html,
      text,
    });
  }

  /**
   * Send organization invitation email
   */
  static async sendOrganizationInvitation(options: {
    email: string;
    invitedByUsername: string;
    invitedByEmail: string;
    teamName: string;
    inviteLink: string;
  }): Promise<void> {
    const { email, invitedByUsername, invitedByEmail, teamName, inviteLink } =
      options;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Organization Invitation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏢 Organization Invitation</h1>
            </div>
            <div class="content">
              <h2>You're invited to join ${teamName}!</h2>

              <p>Hi there!</p>

              <p><strong>${invitedByUsername}</strong> (${invitedByEmail}) has invited you to join the <strong>${teamName}</strong> organization on Pennylogs.</p>

              <p>By joining this organization, you'll be able to:</p>
              <ul>
                <li>🔗 Collaborate on shared financial goals</li>
                <li>💰 Track group expenses and split costs</li>
                <li>📊 View organization financial reports</li>
                <li>🎯 Work together on budgets and savings goals</li>
              </ul>

              <div style="text-align: center;">
                <a href="${inviteLink}" class="button">Accept Invitation</a>
              </div>

              <p>If you don't have a Pennylogs account yet, you'll be prompted to create one when you click the link above.</p>

              <p>This invitation link will expire in 7 days for security reasons.</p>

              <p>If you have any questions, feel free to reach out to ${invitedByUsername} or our support team.</p>

              <div class="footer">
                <p>Best regards,<br>The Pennylogs Team</p>
                <p><small>If you didn't expect this invitation, you can safely ignore this email.</small></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Organization Invitation - ${teamName}

      Hi there!

      ${invitedByUsername} (${invitedByEmail}) has invited you to join the ${teamName} organization on Pennylogs.

      By joining this organization, you'll be able to:
      - Collaborate on shared financial goals
      - Track group expenses and split costs
      - View organization financial reports
      - Work together on budgets and savings goals

      Accept invitation: ${inviteLink}

      If you don't have a Pennylogs account yet, you'll be prompted to create one when you click the link above.

      This invitation link will expire in 7 days for security reasons.

      If you have any questions, feel free to reach out to ${invitedByUsername} or our support team.

      Best regards,
      The Pennylogs Team

      If you didn't expect this invitation, you can safely ignore this email.
    `;

    await this.sendEmail({
      to: email,
      subject: `You're invited to join ${teamName} on Pennylogs`,
      html,
      text,
    });
  }
}
