import { Phone } from "lucide-react";

const CallButton = () => (
  <a
    href="tel:+919876543210"
    className="fixed bottom-6 left-6 z-50 rounded-full bg-[linear-gradient(180deg,#e56d74_0%,#cc4f58_100%)] p-4 text-white shadow-[0_18px_44px_rgba(0,0,0,0.22),0_0_0_10px_rgba(229,109,116,0.18),0_0_34px_rgba(229,109,116,0.35)] ring-4 ring-[hsla(352,70%,60%,0.22)] transition-transform hover:scale-110 animate-float-pop"
    aria-label="Call Sandis Tours"
  >
    <Phone size={28} />
  </a>
);

export default CallButton;
