import nodemailer from 'nodemailer';
import { getConfig, getOwnerEmail } from './db';

const SMTP_CONFIG = {
  host: 'smtp-harunabdullah.alwaysdata.net',
  port: 587,
  secure: false,
  auth: {
    user: 'harunabdullah',
    pass: 'iamrakin'
  },
  tls: {
    rejectUnauthorized: false
  }
};

const transporter = nodemailer.createTransport(SMTP_CONFIG);

export async function sendContactFormEmail(formData: {
  username: string;
  email: string;
  message: string;
  [key: string]: string;
}) {
  const config = getConfig();
  const ownerName = config.profile.name;
  
  const ownerEmail = getOwnerEmail();
  
  let emailBody = `New message from: ${formData.username} (${formData.email})\n\n`;
  
  emailBody += `Message:\n${formData.message}\n\n`;
  
  Object.keys(formData).forEach(key => {
    if (!['username', 'email', 'message'].includes(key)) {
      emailBody += `${key}: ${formData[key]}\n`;
    }
  });
  
  const mailOptions = {
    from: `"Contact Form" <harunabdullah@alwaysdata.net>`,
    to: ownerEmail || config.profile.name.replace(/\s+/g, '.').toLowerCase() + '@gmail.com',
    cc: formData.email,
    subject: `New Contact Form Message from ${formData.username}`,
    text: emailBody,
  };

  try {
    console.log('CONTACT FORM SUBMISSION');
    console.log('------------------------------------------------------------');
    console.log(`From: ${formData.username} (${formData.email})`);
    console.log(`To: ${mailOptions.to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Message length: ${formData.message.length} characters`);
    console.log('------------------------------------------------------------');
      
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send email:', error);
    
    if (config.webhooks?.discord) {
      try {
        console.log('Attempting to send via Discord webhook...');
        
        await fetch(config.webhooks.discord, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: '📬 **New Contact Form Message**',
            embeds: [
              {
                title: `Message from ${formData.username}`,
                description: formData.message,
                color: 0x5865F2,
                fields: [
                  {
                    name: 'Email',
                    value: formData.email,
                    inline: true
                  }
                ]
              }
            ]
          })
        });
        
        console.log('Message sent via Discord webhook');
        
        return {
          accepted: [mailOptions.to],
          rejected: [],
          envelopeTime: 0,
          messageTime: 0,
          messageSize: emailBody.length,
          response: '250 Message sent via Discord webhook',
          envelope: { from: mailOptions.from, to: [mailOptions.to] },
          messageId: `<discord-${Date.now()}@localhost>`
        };
      } catch (webhookError) {
        console.error('Failed to send Discord webhook notification:', webhookError);
      }
    }
    
    console.log('Returning success response despite email sending failure');
    return {
      accepted: [mailOptions.to],
      rejected: [],
      envelopeTime: 0,
      messageTime: 0,
      messageSize: emailBody.length,
      response: '250 Message recorded (Email delivery may have failed)',
      envelope: { from: mailOptions.from, to: [mailOptions.to] },
      messageId: `<form-${Date.now()}@localhost>`
    };
  }
}