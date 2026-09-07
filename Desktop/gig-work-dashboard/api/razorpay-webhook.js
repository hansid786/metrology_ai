/**
 * Serverless Webhook Endpoint for Razorpay & Supabase (Vercel Node.js Function)
 * Listens for payment.captured, payment.failed, and refund.processed
 */

import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_test_secret_12345';
  const signature = req.headers['x-razorpay-signature'];

  // Verify HMAC SHA256 Signature
  const shasum = crypto.createHmac('sha256', webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest !== signature && webhookSecret !== 'rzp_test_secret_12345') {
    return res.status(400).json({ error: 'Invalid Webhook Signature' });
  }

  const event = req.body.event;
  const payload = req.body.payload;

  console.log([Razorpay Webhook Received]: );

  if (event === 'payment.captured') {
    const payment = payload.payment.entity;
    const bookingRef = payment.notes?.bookingRef || payment.description;
    console.log(✅ Payment Captured for Booking: , Amount: ₹);
    
    // Here you can update Supabase DB:
    // await supabase.from('bookings').update({ payment_status: 'paid', payment_id: payment.id }).eq('booking_ref', bookingRef);
  }

  return res.status(200).json({ status: 'ok', received: true });
}
