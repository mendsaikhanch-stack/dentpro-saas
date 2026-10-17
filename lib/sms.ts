// MessagePro.mn SMS API integration

const MESSAGEPRO_API_URL = "https://msgapi.MessagePro.com/smsmms/v3/messages";

// Эмнэлгийн мэдээлэл
const CLINIC_NAME = "DentPro Шүдний Эмнэлэг";
const CLINIC_ADDRESS = "УБ, Сүхбаатар дүүрэг, 1-р хороо"; // TODO: Хаягаа оруулна уу
const CLINIC_MAP_URL = "https://maps.app.goo.gl/XXXXXXXXX"; // TODO: Google Maps линкээ оруулна уу

export async function sendSMS(to: string, body: string) {
  const apiKey = process.env.MESSAGEPRO_API_KEY;
  const from = process.env.MESSAGEPRO_FROM;

  if (!apiKey || !from) {
    console.log("[SMS] API key тохируулаагүй байна. SMS илгээгдсэнгүй.");
    console.log(`[SMS] To: ${to}`);
    console.log(`[SMS] Body: ${body}`);
    return;
  }

  const res = await fetch(MESSAGEPRO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: apiKey,
    },
    body: JSON.stringify({ from, to, body }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SMS илгээхэд алдаа гарлаа: ${res.status} ${text}`);
  }

  console.log(`[SMS] Амжилттай илгээгдлээ: ${to}`);
}

export async function sendAppointmentSMS(
  phone: string,
  date: string,
  time: string,
  doctorName: string
) {
  const body = [
    `DentPro эмнэлэгт таны цаг захиалга баталгаажлаа.`,
    `Огноо: ${date}`,
    `Цаг: ${time}`,
    `Эмч: ${doctorName}`,
    `Хаяг: ${CLINIC_ADDRESS}`,
    `Байршил: ${CLINIC_MAP_URL}`,
  ].join("\n");

  await sendSMS(phone, body);
}
