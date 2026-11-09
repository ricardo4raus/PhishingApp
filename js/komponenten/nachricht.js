import { erstelleSms } from "./sms.js";
import { erstelleEmail } from "./email.js";
import { erstelleWhatsapp } from "./whatsapp.js";
import { erstelleInstagram } from "./instagram.js";

const NACHRICHT_PRO_KANAL = {
  "SMS": erstelleSms,
  "E-Mail": erstelleEmail,
  "WhatsApp": erstelleWhatsapp,
  "Instagram": erstelleInstagram,
};

export function erstelleNachricht(situation) {
  const erstelleNachrichtDesKanals = NACHRICHT_PRO_KANAL[situation.kanal];
  return erstelleNachrichtDesKanals(situation);
}
