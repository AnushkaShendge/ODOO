import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

const otpConfig = {
  upperCaseAlphabets: false,
  specialChars: false,
  lowerCaseAlphabets: false,
};

// Mock transport for email
const mailTransport = nodemailer.createTransport({
  // ... your email config ...
});
// Mock client for Twilio
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export const generateOTP = () => {
  return otpGenerator.generate(6, otpConfig);
};

export const sendOTP = async (otp, contact) => {
  try {
    // Send email (if email is present)
    if (contact.email) {
      await mailTransport.sendMail({
        from: process.env.EMAIL_USER,
        to: contact.email,
        subject: 'SOS Alert OTP',
        text: `Your OTP to resolve the SOS alert is: ${otp}`
      });
    }
    // Send SMS (if phone is present)
    if (contact.phone) {
      await twilioClient.messages.create({
        body: `Your OTP to resolve the SOS alert is: ${otp}`,
        from: process.env.TWILIO_NUMBER,
        to: contact.phone
      });
    }
    return true;
  } catch (err) {
    // Log error
    return false;
  }
};

export const verifyOTP = (inputOTP, storedOTP) => {
  return inputOTP === storedOTP;
}; 