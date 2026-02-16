import { getTranslations } from "next-intl/server";
import { FAQAccordion, FAQ } from "@/components/faq/FAQAccordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

// FAQ Data
const faqsData: FAQ[] = [
  // Booking & Payment
  {
    id: "1",
    category: "booking",
    question: "How do I book a fishing trip?",
    answer:
      "Booking is easy! Simply visit our booking page, select your preferred trip, choose a date, and complete the reservation form. You'll receive a confirmation email with all the details. A deposit may be required to secure your spot.",
  },
  {
    id: "2",
    category: "booking",
    question: "What payment methods do you accept?",
    answer:
      "We accept credit/debit cards (Visa, Mastercard, American Express), PayPal, and cash payments. Online bookings can be paid securely through our website. For large groups or private charters, we also offer bank transfer options.",
  },
  {
    id: "3",
    category: "booking",
    question: "Do I need to pay a deposit?",
    answer:
      "Yes, a 30% deposit is required to secure your booking. The remaining balance is due on the day of the trip. Deposits are fully refundable if you cancel at least 48 hours before your scheduled trip.",
  },
  {
    id: "4",
    category: "booking",
    question: "Can I book a private charter?",
    answer:
      "Absolutely! We offer private charters for groups of up to 6 people. This is perfect for families, corporate events, or special occasions. Contact us for custom packages and pricing.",
  },
  // Trips & Experience
  {
    id: "5",
    category: "trips",
    question: "What should I bring on the trip?",
    answer:
      "We recommend bringing sunscreen, a hat, sunglasses, comfortable clothing, and a camera. All fishing equipment, bait, and tackle are provided. We also provide water and light snacks, but feel free to bring your own food and drinks.",
  },
  {
    id: "6",
    category: "trips",
    question: "Do I need fishing experience?",
    answer:
      "Not at all! Our trips are suitable for all skill levels, from complete beginners to experienced anglers. Captain Nikos will provide all the guidance you need and teach you the best techniques.",
  },
  {
    id: "7",
    category: "trips",
    question: "What types of fish can we catch?",
    answer:
      "Amvrakikos Bay is home to a variety of species including sea bass, mullet, bream, and occasional larger catches like tuna. The specific fish depend on the season and trip type.",
  },
  {
    id: "8",
    category: "trips",
    question: "Can I keep the fish I catch?",
    answer:
      "Yes! You can keep your catch, and we'll even clean and package it for you. However, we encourage sustainable fishing practices and respect all local regulations regarding catch limits.",
  },
  // Safety & Equipment
  {
    id: "9",
    category: "safety",
    question: "Is the boat safe for children?",
    answer:
      "Yes, our boat is safe for children of all ages. We provide life jackets in all sizes and take extra precautions when children are on board. Please let us know in advance if you're bringing children.",
  },
  {
    id: "10",
    category: "safety",
    question: "What safety equipment is on board?",
    answer:
      "Our vessel is fully equipped with life jackets for all passengers, first aid kits, fire extinguishers, flares, VHF radio, GPS navigation, and emergency communication devices. Captain Nikos is also trained in first aid and emergency procedures.",
  },
  {
    id: "11",
    category: "safety",
    question: "What happens in case of bad weather?",
    answer:
      "Your safety is our priority. If weather conditions are unsafe, we will reschedule your trip at no extra cost or provide a full refund. We monitor weather conditions closely and will notify you in advance if changes are needed.",
  },
  {
    id: "12",
    category: "safety",
    question: "Are life jackets provided?",
    answer:
      "Yes, we provide Coast Guard-approved life jackets in all sizes for every passenger. Wearing life jackets is mandatory for children and recommended for all passengers.",
  },
  // Weather & Cancellations
  {
    id: "13",
    category: "weather",
    question: "What is your cancellation policy?",
    answer:
      "Cancellations made at least 48 hours before the trip receive a full refund of the deposit. Cancellations within 48 hours may forfeit the deposit. If we cancel due to weather, you get a full refund or can reschedule.",
  },
  {
    id: "14",
    category: "weather",
    question: "Do trips run in all weather conditions?",
    answer:
      "We fish in various conditions, but safety comes first. Light rain doesn't stop us - in fact, it can be great for fishing! However, we cancel trips for thunderstorms, high winds, or rough seas.",
  },
  {
    id: "15",
    category: "weather",
    question: "What is the best season for fishing?",
    answer:
      "Fishing is great year-round in Amvrakikos Bay! Spring and fall offer excellent conditions for most species. Summer is perfect for early morning or evening trips. Winter fishing can be very productive for certain species.",
  },
];

const categories = ["booking", "trips", "safety", "weather"];

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "faq" });
  return {
    title: `${t("title")} | Amvrakikos Fishing Trips`,
    description: t("subtitle"),
  };
}

export default async function FAQPage() {
  const t = await getTranslations();
  const locale = "en";

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-blue-900 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              {t("faq.title")}
            </h1>
            <p className="text-xl text-blue-100">{t("faq.subtitle")}</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <FAQAccordion faqs={faqsData} categories={categories} />
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">
              {t("faq.contact")}
            </h2>
            <p className="text-lg text-slate-600">
              Can&apos;t find what you&apos;re looking for? We&apos;re here to help!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Call Us</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Available 9 AM - 7 PM daily
                </p>
                <a
                  href="tel:+306971234567"
                  className="text-blue-600 font-medium hover:underline"
                >
                  +30 697 123 4567
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Email Us</h3>
                <p className="text-slate-600 text-sm mb-4">
                  We reply within 24 hours
                </p>
                <a
                  href="mailto:info@amvrakikosfishing.com"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Send Email
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Contact Form</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Send us a detailed message
                </p>
                <Link href={`/${locale}/contact`}>
                  <Button variant="link" className="text-blue-600 font-medium">
                    Go to Contact Page
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
