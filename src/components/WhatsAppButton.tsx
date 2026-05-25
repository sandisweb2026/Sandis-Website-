import { MessageCircle } from "lucide-react";

import { getWhatsAppUrl } from "@/lib/whatsapp";

const WhatsAppButton = () => (
  <a
    href={getWhatsAppUrl()}
    target="_blank"
    rel="noreferrer"
    className="fixed bottom-4 right-4 z-50 rounded-full bg-[hsl(142,70%,45%)] p-3 text-[hsl(0,0%,100%)] shadow-[0_18px_44px_rgba(0,0,0,0.22),0_0_0_10px_rgba(34,197,94,0.18),0_0_34px_rgba(34,197,94,0.38)] ring-4 ring-[hsla(142,70%,45%,0.22)] transition-transform hover:scale-110 hover:bg-[hsl(142,70%,40%)] animate-float-pop sm:bottom-6 sm:right-6 sm:p-4"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="h-5 w-5 sm:h-7 sm:w-7" />
  </a>
);

export default WhatsAppButton;
