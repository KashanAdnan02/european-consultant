const APPOINTMENT_NOTIFY_EMAIL = "manartanveer@gmail.com";

export type AppointmentNotification = {
  name: string;
  email: string;
  whatsapp: string;
  date: string;
  time: string;
  message: string;
  priceId: string;
  amount: string;
  currency: string;
  fee: string;
  paymentId: string;
  paymentStatus: string;
};

export async function sendAppointmentNotification(
  appointment: AppointmentNotification
) {
  const response = await fetch(
    `https://formsubmit.co/ajax/${APPOINTMENT_NOTIFY_EMAIL}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: `New paid appointment booking — ${appointment.name}`,
        _template: "table",
        _captcha: "false",
        _replyto: appointment.email,
        name: appointment.name,
        email: appointment.email,
        whatsapp: appointment.whatsapp,
        appointment_date: appointment.date,
        appointment_time: appointment.time,
        message: appointment.message,
        price_id: appointment.priceId,
        amount: appointment.amount,
        currency: appointment.currency,
        fee: appointment.fee,
        payment_id: appointment.paymentId,
        payment_status: appointment.paymentStatus,
      }),
    }
  );

  const body = await response.text();

  if (!response.ok) {
    throw new Error(
      `Appointment email failed with status ${response.status}: ${body}`
    );
  }
}
