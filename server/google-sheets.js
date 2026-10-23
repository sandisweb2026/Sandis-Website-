const webhookUrl = () => process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
const webhookToken = () => process.env.GOOGLE_SHEETS_WEBHOOK_TOKEN?.trim();

export const syncEnquiryToGoogleSheet = async (enquiry, action = "upsert") => {
  const url = webhookUrl();
  const token = webhookToken();

  if (!url || !token) {
    return { skipped: true };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        action,
        enquiry,
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.ok) {
      throw new Error(result?.error || `Webhook returned HTTP ${response.status}.`);
    }

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Google Sheets enquiry sync failed: ${message}`);
    return { ok: false, error: message };
  }
};
