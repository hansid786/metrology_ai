/**
 * WhatsApp Business Notification Service
 * Generates instant deep links for order confirmation, technician dispatch, and receipts
 */

export function sendCustomerBookingWhatsApp(booking) {
  const message = 
    `*Booking Confirmed!* (Ref: ${booking.bookingRef})\n\n` +
    `*Service:* ${booking.serviceTitle}\n` +
    `*Technician:* ${booking.workerName} (${booking.workerPhone})\n` +
    `*Slot:* ${booking.scheduledDate}, ${booking.scheduledSlot}\n` +
    `*Address:* ${booking.addressText}\n` +
    `*Amount:* INR ${booking.finalAmount}\n\n` +
    `Track your technician live on Doorstep Services App!`;

  const text = encodeURIComponent(message);
  const cleanPhone = (booking.customerPhone || '9845077123').replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${text}`;
  window.open(url, '_blank');
}

export function sendWorkerDispatchWhatsApp(booking) {
  const message = 
    `*NEW JOB ASSIGNED!* (Ref: ${booking.bookingRef})\n\n` +
    `*Service:* ${booking.serviceTitle}\n` +
    `*Customer:* ${booking.customerName}\n` +
    `*Slot:* ${booking.scheduledDate}, ${booking.scheduledSlot}\n` +
    `*Location:* ${booking.addressText}\n` +
    `*Payout Amount:* INR ${booking.finalAmount}\n\n` +
    `Please open the app to accept and navigate to customer location.`;

  const text = encodeURIComponent(message);
  const cleanPhone = (booking.workerPhone || '9845021984').replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${text}`;
  window.open(url, '_blank');
}
