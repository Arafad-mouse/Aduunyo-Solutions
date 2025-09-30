import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { to, message } = await request.json();

    // Validate required fields
    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to and message' },
        { status: 400 }
      );
    }

    // WhatsApp Business API implementation
    // Replace with your actual WhatsApp Business API credentials
    const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages';
    const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!WHATSAPP_ACCESS_TOKEN) {
      console.error('❌ WhatsApp Access Token not configured');
      return NextResponse.json(
        { error: 'WhatsApp API not configured' },
        { status: 500 }
      );
    }

    // Send WhatsApp message using Facebook Graph API
    const whatsappResponse = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to.replace(/[^0-9]/g, ''), // Remove non-numeric characters
        type: 'text',
        text: {
          body: message
        }
      })
    });

    const responseData = await whatsappResponse.json();

    if (whatsappResponse.ok) {
      console.log('✅ WhatsApp message sent successfully:', responseData);
      return NextResponse.json({
        success: true,
        message: 'WhatsApp notification sent successfully',
        data: responseData
      });
    } else {
      console.error('❌ WhatsApp API error:', responseData);
      return NextResponse.json(
        { error: 'Failed to send WhatsApp message', details: responseData },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ WhatsApp API endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// Alternative implementation using Twilio WhatsApp API
export async function sendWhatsAppViaTwilio(to, message) {
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER) {
    throw new Error('Twilio credentials not configured');
  }

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  
  const response = await fetch(twilioUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      From: TWILIO_WHATSAPP_NUMBER,
      To: `whatsapp:${to}`,
      Body: message
    })
  });

  return response.json();
}
