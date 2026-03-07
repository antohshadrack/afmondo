import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, email, fullName, items, total, date } = body;

    // 1. Validate inputs
    if (!email || !orderId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required order information" },
        { status: 400 }
      );
    }

    // 2. Setup Nodemailer Transporter
    // Make sure these are set in your .env.local
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.mailtrap.io",
      port: Number(process.env.SMTP_PORT) || 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 3. Build HTML Email Template
    const itemsHtml = items.map(
      (item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br/>
          <span style="color: #666; font-size: 13px;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
          ${(item.price * item.quantity).toLocaleString("fr-SN")} CFA
        </td>
      </tr>
    `
    ).join("");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; padding: 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://res.cloudinary.com/dgxkd69kq/image/upload/v1772914864/afmondo/assets/afmondo_logo.png" alt="Afmondo" style="max-height: 50px; width: auto;" />
          <p style="color: #666; font-size: 16px; margin-top: 15px;">Order Confirmation</p>
        </div>

        <!-- Greeting -->
        <p style="font-size: 16px;">Hello <strong>${fullName || 'Customer'}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.5;">
          Thank you for shopping with Afmondo! Your order has been successfully placed. 
          Our team will contact you within <strong>2 hours</strong> to confirm your items, arrange delivery, and discuss payment.
        </p>

        <!-- Order details box -->
        <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 30px 0;">
          <h3 style="margin-top: 0; border-bottom: 2px solid #f5a623; padding-bottom: 10px;">
            Order Summary (#${orderId})
          </h3>
          <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
            Placed on: ${new Date(date).toLocaleString()}
          </p>

          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              ${itemsHtml}
              <tr>
                <td style="padding: 15px 10px 0; text-align: right; font-size: 14px; color: #666;">
                  Delivery:
                </td>
                <td style="padding: 15px 10px 0; text-align: right; font-size: 14px; color: #666;">
                  Calculated on confirmation
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; text-align: right; font-size: 18px; font-weight: bold;">
                  Total Estimate:
                </td>
                <td style="padding: 10px; text-align: right; font-size: 18px; font-weight: bold; color: #f5a623;">
                  ${Number(total).toLocaleString("fr-SN")} CFA
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <p style="font-size: 14px; color: #888; text-align: center; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
          If you have any questions, please reply to this email or contact us via WhatsApp.<br><br>
          &copy; ${new Date().getFullYear()} Afmondo. All rights reserved.
        </p>
      </div>
    `;

    // 4. Send Email
    const info = await transporter.sendMail({
      from: `"Afmondo Orders" <${process.env.SMTP_FROM || "orders@afmondo.com"}>`,
      to: email,
      subject: `Order Confirmation #${orderId} - Afmondo`,
      html: emailHtml,
    });

    console.log("Message sent: %s", info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("Error sending order confirmation email:", error);
    return NextResponse.json(
      { error: "Failed to send email confirmation" },
      { status: 500 }
    );
  }
}
