import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Anchor,
  Shield,
  Award,
  Users,
  Clock,
  MapPin,
  Fish,
  Phone,
} from "lucide-react";
import Link from "next/link";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: `${t("title")} | Amvrakikos Fishing Trips`,
    description: t("subtitle"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations();
  const locale = "en"; // Will be replaced with actual locale

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-blue-900 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              {t("about.title")}
            </h1>
            <p className="text-xl text-blue-100">{t("about.subtitle")}</p>
          </div>
        </div>
      </section>

      {/* Captain Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Captain Image */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-200">
                <Image
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80"
                  alt="Captain Nikos"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Experience Badge */}
              <div className="absolute -bottom-6 -right-6 bg-amber-400 text-blue-900 rounded-2xl p-6 shadow-lg">
                <p className="text-4xl font-bold">20+</p>
                <p className="text-sm font-medium">Years Experience</p>
              </div>
            </div>

            {/* Captain Info */}
            <div className="lg:pl-8">
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <Anchor className="w-5 h-5" />
                <span className="font-medium">{t("about.captain")}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6">
                Captain Nikos
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                With over 20 years of experience fishing in the pristine waters of Amvrakikos Bay, 
                Captain Nikos has become one of the most respected fishing guides in the region. 
                His intimate knowledge of local waters, fish behavior, and weather patterns ensures 
                every trip is both safe and successful.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Born and raised in Preveza, Captain Nikos learned to fish from his father and 
                grandfather before him. Today, he shares his passion with visitors from around 
                the world, creating unforgettable fishing memories while preserving the rich 
                maritime traditions of the Amvrakikos Gulf.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-900">5000+</p>
                  <p className="text-slate-600 text-sm">Happy Guests</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-900">20+</p>
                  <p className="text-slate-600 text-sm">Years Experience</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-900">100%</p>
                  <p className="text-slate-600 text-sm">Safety Record</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Boat Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
              <Fish className="w-5 h-5" />
              <span className="font-medium">{t("about.boat")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
              Our Vessel
            </h2>
            <p className="text-lg text-slate-600">
              {t("about.boatSpecs")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Boat Specs */}
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <Users className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-semibold text-slate-900 mb-1">Capacity</h3>
                    <p className="text-slate-600">Up to 6 guests</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <Shield className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-semibold text-slate-900 mb-1">Safety</h3>
                    <p className="text-slate-600">Full safety equipment</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <MapPin className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-semibold text-slate-900 mb-1">GPS</h3>
                    <p className="text-slate-600">Modern navigation</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <Clock className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-semibold text-slate-900 mb-1">Comfort</h3>
                    <p className="text-slate-600">Seating & shade</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Boat Image */}
            <div className="order-1 lg:order-2">
              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-200">
                <Image
                  src="https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&q=80"
                  alt="Our fishing boat"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Certifications */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
              <Award className="w-5 h-5" />
              <span className="font-medium">{t("about.safety")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
              Certified & Insured
            </h2>
            <p className="text-lg text-slate-600">
              {t("about.safetyDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Safety First
                </h3>
                <p className="text-slate-600">
                  Fully equipped with life jackets, first aid kits, fire extinguishers, 
                  and emergency communication devices.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Licensed Captain
                </h3>
                <p className="text-slate-600">
                  Captain Nikos holds all required maritime certifications and regularly 
                  undergoes safety training updates.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Anchor className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Insured Vessel
                </h3>
                <p className="text-slate-600">
                  Our boat is fully insured and undergoes regular maintenance and safety 
                  inspections.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & History */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                To provide unforgettable fishing experiences while preserving the natural 
                beauty and marine ecosystem of Amvrakikos Bay. We believe in sustainable 
                fishing practices and educating our guests about the importance of 
                conservation.
              </p>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Every trip with us is more than just fishing – it&apos;s an opportunity to 
                connect with nature, learn about local culture, and create lasting memories 
                with family and friends.
              </p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Our History
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="text-amber-400 font-bold text-lg">2005</div>
                  <p className="text-blue-100">
                    Started with a single boat and a passion for fishing
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-amber-400 font-bold text-lg">2010</div>
                  <p className="text-blue-100">
                    Expanded fleet and introduced premium experiences
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-amber-400 font-bold text-lg">2015</div>
                  <p className="text-blue-100">
                    Awarded Best Fishing Charter in Western Greece
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-amber-400 font-bold text-lg">2023</div>
                  <p className="text-blue-100">
                    Celebrated 5000+ happy guests from around the world
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-amber-400 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 mb-4">
              Ready to Experience the Best Fishing Trip?
            </h2>
            <p className="text-lg text-blue-800 mb-8 max-w-2xl mx-auto">
              Join Captain Nikos for an unforgettable adventure in Amvrakikos Bay. 
              Book your trip today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/booking`}>
                <Button size="lg" className="bg-blue-900 hover:bg-blue-800 text-white px-8">
                  <Phone className="w-5 h-5 mr-2" />
                  {t("navigation.bookNow")}
                </Button>
              </Link>
              <Link href={`/${locale}/trips`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white px-8"
                >
                  {t("hero.ctaSecondary")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
