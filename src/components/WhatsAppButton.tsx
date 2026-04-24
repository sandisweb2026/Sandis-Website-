import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/919876543210?text=Hi%2C%20I%20want%20to%20enquire%20about%20a%20tour"
    target="_blank"
    rel="noreferrer"
    className="fixed bottom-6 right-6 z-50 rounded-full bg-[hsl(142,70%,45%)] p-4 text-[hsl(0,0%,100%)] shadow-[0_18px_44px_rgba(0,0,0,0.22),0_0_0_10px_rgba(34,197,94,0.18),0_0_34px_rgba(34,197,94,0.38)] ring-4 ring-[hsla(142,70%,45%,0.22)] transition-transform hover:scale-110 hover:bg-[hsl(142,70%,40%)] animate-float-pop"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle size={28} />
  </a>
);

export default WhatsAppButton;
