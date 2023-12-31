import { Injectable, Logger } from '@nestjs/common';
import { SendMailOptions, Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private logger = new Logger('EmailService');

  constructor() {
    this.transporter = createTransport({
      // Configure the SMTP settings for your email provider
      // For example, for Gmail:
      service: 'gmail',
      auth: {
        user: 'zerowaste.control@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendOtpForEmailVerification(
    to: string,
    otp: string,
    username: string,
  ): Promise<void> {
    const mailOptions: SendMailOptions = {
      from: 'zerowaste.control@gmail.com',
      to,
      subject: 'ONE TIME PASSWORD',
      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Zero Waste</a>
          </div>
          <p style="font-size:1.1em">Hi, ${username}.</p>
          <p>Thank you for choosing Zero-Waste. Use the following OTP to complete your Sign Up procedures. OTP is valid
              for 5 minutes.</p>
          <h2
              style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
              ${otp}</h2>
          <p style="font-size:0.9em;">Regards,<br />Zero Waste.</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          </div>
      </div>
  </div>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.error(error.message);
    }
  }
  async sendOtpForPasswordReset(
    to: string,
    otp: string,
    username: string,
  ): Promise<void> {
    const mailOptions: SendMailOptions = {
      from: 'zerowaste.control@gmail.com',
      to,
      subject: 'PASSWORD RESET.',
      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Zero Waste</a>
          </div>
          <p style="font-size:1.1em">Hi, ${username}.</p>
          <p>Thank you for choosing Zero-Waste. Use the following OTP to complete your Password Reset Procedure. OTP is valid
              for 5 minutes.</p>
          <h2
              style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
              ${otp}</h2>
          <p style="font-size:0.9em;">Regards,<br />Zero Waste.</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          </div>
      </div>
  </div>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}

// <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
//       <div style="margin:50px auto;width:70%;padding:20px 0">ƒ
//         <div style="border-bottom:1px solid #eee">
//           <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Zero Waste</a>
//         </div>
//         <p style="font-size:1.1em">Hi,</p>
//         <p>Thank you for choosing Zero-Waste. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
//         <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
//         <p style="font-size:0.9em;">Regards,<br />Zero Waste</p>
//         <hr style="border:none;border-top:1px solid #eee" />
//         <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
//         </div>
//       </div>
//     </div>
