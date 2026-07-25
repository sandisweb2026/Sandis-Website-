export const CONTACT_PHONE_NUMBER = "9890711155";
export const CONTACT_PHONE_DISPLAY = CONTACT_PHONE_NUMBER;
export const CONTACT_PHONE_E164 = `+91${CONTACT_PHONE_NUMBER}`;
export const CONTACT_PHONE_TEL = `tel:${CONTACT_PHONE_E164}`;

export const CONTACT_EMAIL_ADDRESS = "sandis@sandis.com";
export const CONTACT_EMAIL_DISPLAY = CONTACT_EMAIL_ADDRESS;
export const CONTACT_EMAIL_MAILTO = `mailto:${CONTACT_EMAIL_ADDRESS}`;

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
