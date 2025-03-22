const nodemailer = require('nodemailer');

const sendSOSAlert = async ({ userName, location, friendEmail, otp, recordingUri, photoUris }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    // Handle case when location is undefined
    const googleMapsUrl = location?.latitude && location?.longitude 
      ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      : null;

    const attachments = [];
    
    if (recordingUri) {
      attachments.push({
        filename: 'sos-recording.m4a',
        content: recordingUri // Use the buffer directly
      });
    }

    if (photoUris && photoUris.length > 0) {
      photoUris.forEach((buffer, index) => {
        attachments.push({
          filename: `sos-photo-${index + 1}.jpg`,
          content: buffer // Use the buffer directly
        });
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: friendEmail,
      subject: `🚨 EMERGENCY SOS Alert from ${userName}`,
      attachments,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #FF5A5F; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Emergency SOS Alert</h1>
          </div>
          
          <div style="padding: 20px;">
            <h2 style="color: #FF5A5F;">Emergency Alert from ${userName}</h2>
            <p style="font-size: 16px;">Your friend has triggered an emergency SOS alert.</p>
            
            ${googleMapsUrl ? `
              <div style="margin: 30px 0; text-align: center;">
                <a href="${googleMapsUrl}" 
                  style="background-color: #4285f4; color: white; padding: 15px 30px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
                  View Location on Google Maps
                </a>
              </div>
            ` : '<p style="color: #666;">Location information not available</p>'}

            <div style="background-color: #f8f9fa; border: 2px solid #e9ecef; 
              border-radius: 5px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 16px;">Security Code to Deactivate SOS:</p>
              <h2 style="color: #FF5A5F; font-size: 36px; margin: 10px 0; letter-spacing: 5px;">
                ${otp}
              </h2>
              <p style="margin: 0; color: #666;">
                Share this code with ${userName} to deactivate the SOS mode
              </p>
            </div>

            ${photoUris && photoUris.length > 0 ? `
              <div style="margin: 20px 0;">
                <h3>Emergency Photos Attached</h3>
                <p>Photos taken during the emergency have been attached.</p>
              </div>
            ` : ''}
            ${recordingUri ? `
              <div style="margin: 20px 0;">
                <h3>Emergency Recording Attached</h3>
                <p>Audio recording taken during the emergency has been attached.</p>
              </div>
            ` : ''}

            <p style="color: #FF5A5F; font-weight: bold; margin-top: 30px;">
              This is an emergency alert. Please take immediate action.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending SOS email:', error);
    return false;
  }
};

module.exports = { sendSOSAlert };
