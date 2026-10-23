export const CONTACT_PHONE_NUMBER = "9890711155";
export const CONTACT_PHONE_DISPLAY = CONTACT_PHONE_NUMBER;
export const CONTACT_PHONE_E164 = `+91${CONTACT_PHONE_NUMBER}`;
export const CONTACT_PHONE_TEL = `tel:${CONTACT_PHONE_E164}`;

export const CONTACT_EMAIL_ADDRESS = "sandis@sandis.com";
export const CONTACT_EMAIL_DISPLAY = CONTACT_EMAIL_ADDRESS;
export const CONTACT_EMAIL_MAILTO = `mailto:${CONTACT_EMAIL_ADDRESS}`;
export const CONTACT_INSTAGRAM_URL =
  "https://www.instagram.com/sandistravelspune?igsh=b3RlaXhoZGdoZG9y";
export const CONTACT_FACEBOOK_URL =
  "https://www.facebook.com/share/1Eyay3xQJP/";

export const CONTACT_ADDRESS_DISPLAY =
  "5 Amit Complex, 474 Sadashiv Peth, Tilak Road, Pune - 411030";
export const CONTACT_SECONDARY_ADDRESS_DISPLAY =
  "Other Office: Dahanukar Colony, Kothrud";
export const CONTACT_MAP_BUSINESS_NAME =
  "Sandi's International Tours & Travels";

const CONTACT_MAP_QUERY = `${CONTACT_MAP_BUSINESS_NAME}, ${CONTACT_ADDRESS_DISPLAY}`;

export const CONTACT_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  CONTACT_MAP_QUERY,
)}`;
export const CONTACT_MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  CONTACT_MAP_QUERY,
)}&output=embed`;

export const getContactMailtoUrl = (subject?: string, body?: string) => {
  const params = new URLSearchParams();

  if (subject?.trim()) {
    params.set("subject", subject.trim());
  }

  if (body?.trim()) {
    params.set("body", body.trim());
  }

  const query = params.toString();
  return query
    ? `${CONTACT_EMAIL_MAILTO}?${query}`
    : CONTACT_EMAIL_MAILTO;
};
