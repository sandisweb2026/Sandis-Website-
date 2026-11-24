import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const WEB3FORMS_ACCESS_KEY = "8d3dfc04-3764-4bc4-b7de-1304ab4c09bf";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

type EnquiryFormProps = {
  subject?: string;
  initialMessage?: string;
  onSuccess?: () => void;
};

export const getEnquiryUrl = (subject: string, message: string) =>
  `/contact?${new URLSearchParams({ subject, message })}`;

export default function EnquiryForm({
  subject = "New Sandis Tours enquiry",
  initialMessage = "",
  onSuccess,
}: EnquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const sending = useRef(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending.current) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("access_key", WEB3FORMS_ACCESS_KEY);
    formData.set("subject", subject);
    formData.set("from_name", "Sandis Tours website");

    sending.current = true;
    setLoading(true);
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || result?.success !== true) {
        throw new Error("Web3Forms did not accept the enquiry.");
      }

      form.reset();
      toast.success("Thank you! We'll contact you soon.");
      onSuccess?.();
    } catch {
      toast.error("Could not send your enquiry. Please try again.");
    } finally {
      sending.current = false;
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
      <Input name="name" aria-label="Full name" placeholder="Full Name*" autoComplete="name" required className="h-12 rounded border-slate-300 bg-white text-base" />
      <Input name="email" aria-label="Email address" placeholder="Email Address*" type="email" autoComplete="email" required className="h-12 rounded border-slate-300 bg-white text-base" />
      <Input
        name="phone"
        aria-label="Phone number"
        placeholder="10-digit Phone Number*"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        pattern="[0-9]{10}"
        title="Enter exactly 10 digits."
        required
        className="h-12 rounded border-slate-300 bg-white text-base"
      />
      <Textarea name="message" aria-label="Your message" placeholder="Your message / requirements" defaultValue={initialMessage} className="min-h-[130px] rounded border-slate-300 bg-white text-base" />
      <input type="checkbox" name="botcheck" hidden />
      <Button
        type="submit"
        className="mt-2 h-12 w-fit rounded bg-orange-500 px-8 text-base font-bold text-white hover:bg-orange-600"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Send Enquiry"}
      </Button>
    </form>
  );
}
