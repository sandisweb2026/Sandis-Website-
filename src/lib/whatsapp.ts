export const WHATSAPP_PHONE_NUMBER = "919890711155";
export const WHATSAPP_CHAT_URL = `https://wa.me/${WHATSAPP_PHONE_NUMBER}`;

export const WHATSAPP_PREFILLED_MESSAGE = `🌍✈️ Welcome To Sandi's International Tours & Travels
Your Trusted Travel Partner With 30+ Years Of Experience In Creating Unforgettable Journeys!

✨ Who We Are
We Are A Pune-Based Travel Company Offering 'COMPLETE TRAVEL SOLUTIONS' Under One Roof - From Planning To Execution, We Handle Everything With Care And Professionalism.

💼 Our Key Services
✔️ Mumbai Airport Pickup n Drop from Pune City
✔️ Domestic & International Tour Packages
✔️ Flight Ticket Booking
✔️ Visa Assistance
✔️ Passport Services
✔️ Hotel Reservations
✔️ Vehicle Rentals (4 To 50 Seater)
✔️ Customized Tour Package
✔️ Corporate & Group Tours

⭐ Why Choose SANDIS?
🔹 30+ Years Of Trusted Experience
🔹 Well-Trained & Professional Team
🔹 24x7 Customer Support
🔹 Affordable & Customized Packages
🔹 Reliable Pune-Based Brand

📍 Serving Across India & Worldwide

"Your Journey Begins With SANDIS"

Contact Us Today & Start Your Next Adventure!

#SandisTravels #TravelWithTrust #PuneTravelAgency #InternationalTours #HolidayPackages #VisaServices #TravelExperts #travelwithsandis`;

export const getWhatsAppUrl = (message = WHATSAPP_PREFILLED_MESSAGE) =>
  `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
