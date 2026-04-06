import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setLoading(true);
    const { error } = await supabase.from("enquiries").insert({
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      destination: formData.get("subject") as string,
      message: formData.get("message") as string,
    });
    setLoading(false);
    if (error) toast.error("Something went wrong.");
    else { toast.success("Message sent! We'll get back to you soon."); form.reset(); }
  };

  return (
    <div className="pt-16">
      <section className="bg-primary py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary-foreground">Contact Us</h1>
          <p className="text-primary-foreground/80 mt-2">We'd love to hear from you</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-card rounded-2xl shadow-card p-8">
              <h2 className="text-2xl font-bold text-foreground">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
                <Input name="name" placeholder="Your Name" required />
                <Input name="email" placeholder="Email Address" type="email" required />
                <Input name="phone" placeholder="Phone Number" type="tel" required />
                <Input name="subject" placeholder="Subject" required />
                <Textarea name="message" placeholder="Your Message" rows={5} required />
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground">Get in Touch</h2>
              <p className="text-muted-foreground mt-2">Reach out to us for any travel enquiries or assistance.</p>
              <div className="flex flex-col gap-6 mt-8">
                <a href="tel:+919876543210" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Phone</h4>
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">+91 98765 43210</p>
                  </div>
                </a>
                <a href="mailto:info@sandistours.com" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Email</h4>
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">info@sandistours.com</p>
                  </div>
                </a>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Address</h4>
                    <p className="text-sm text-muted-foreground">123 Travel Street, Mumbai, Maharashtra 400001</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 rounded-2xl overflow-hidden shadow-card h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995!3d19.08219865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  title="Sandis Tours Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
