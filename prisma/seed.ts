import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@amvrakikosfishing.com' },
    update: {},
    create: {
      email: 'admin@amvrakikosfishing.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', adminUser.email);

  // Create trips
  const tripsData = [
    {
      name: 'Half Day Fishing Adventure',
      description: 'Perfect for beginners and families, this 4-hour trip takes you to the best fishing spots in Amvrakikos Bay. Catch sea bass, mullet, and more with expert guidance from Captain Nikos.',
      duration: '4',
      basePrice: 80,
      maxParticipants: 6,
      images: JSON.stringify(['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80']),
      highlights: JSON.stringify([
        'Professional fishing equipment provided',
        'Perfect for beginners and families',
        'Beautiful views of Amvrakikos Bay',
        'Fresh fish cleaning and packaging'
      ]),
      isPremium: false,
      isActive: true,
    },
    {
      name: 'Full Day Deep Sea Expedition',
      description: 'Experience the ultimate fishing adventure with our full-day expedition. Target larger species in deeper waters with top-of-the-line equipment and expert guidance.',
      duration: '8',
      basePrice: 150,
      maxParticipants: 4,
      images: JSON.stringify(['https://images.unsplash.com/photo-1516575334481-f85287c2c82d?auto=format&fit=crop&q=80']),
      highlights: JSON.stringify([
        'Deep sea fishing techniques',
        'High-end fishing equipment',
        'Lunch included',
        'Chance to catch trophy fish'
      ]),
      isPremium: true,
      isActive: true,
    },
    {
      name: 'Sunset Fishing & Dinner Cruise',
      description: 'Combine fishing with romance on our sunset cruise. Fish during golden hour, then enjoy a delicious dinner on board as the sun sets over the bay.',
      duration: '6',
      basePrice: 120,
      maxParticipants: 4,
      images: JSON.stringify(['https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&q=80']),
      highlights: JSON.stringify([
        'Stunning sunset views',
        'Gourmet dinner on board',
        'Romantic atmosphere',
        'Perfect for couples'
      ]),
      isPremium: true,
      isActive: true,
    },
    {
      name: 'Night Fishing Adventure',
      description: 'Experience the thrill of night fishing. Target nocturnal species and enjoy the peaceful atmosphere of Amvrakikos Bay under the stars.',
      duration: '5',
      basePrice: 100,
      maxParticipants: 4,
      images: JSON.stringify(['https://images.unsplash.com/photo-1546514355-7fdc90ccbd03?auto=format&fit=crop&q=80']),
      highlights: JSON.stringify([
        'Unique night fishing experience',
        'Specialized night equipment',
        'Stargazing opportunities',
        'Midnight snack included'
      ]),
      isPremium: false,
      isActive: true,
    },
    {
      name: 'Private Charter Experience',
      description: 'The ultimate exclusive fishing experience. Charter our boat privately for your group with a customized itinerary and premium services.',
      duration: '8',
      basePrice: 500,
      maxParticipants: 6,
      images: JSON.stringify(['https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80']),
      highlights: JSON.stringify([
        'Exclusive private charter',
        'Customizable itinerary',
        'Premium catering options',
        'Dedicated crew service'
      ]),
      isPremium: true,
      isActive: true,
    },
  ];

  for (const trip of tripsData) {
    await prisma.trip.create({
      data: trip,
    });
  }

  console.log('Created trips');

  // Create add-ons
  const addOnsData = [
    {
      name: 'Lunch Package',
      description: 'Fresh local seafood lunch with drinks and appetizers',
      price: 25,
      category: 'FOOD',
      isActive: true,
    },
    {
      name: 'Photo Package',
      description: 'Professional photos of your catch and fishing experience',
      price: 35,
      category: 'PHOTO',
      isActive: true,
    },
    {
      name: 'Transfer Service',
      description: 'Hotel pickup and drop-off included',
      price: 30,
      category: 'TRANSPORT',
      isActive: true,
    },
    {
      name: 'Premium Equipment',
      description: 'Upgrade to professional-grade fishing gear',
      price: 20,
      category: 'EQUIPMENT',
      isActive: true,
    },
    {
      name: 'Sunset Extension',
      description: 'Extend your trip to enjoy the beautiful sunset',
      price: 40,
      category: 'PREMIUM',
      isActive: true,
    },
  ];

  for (const addOn of addOnsData) {
    await prisma.addOn.create({
      data: addOn,
    });
  }

  console.log('Created add-ons');

  // Create vouchers
  const vouchersData = [
    {
      code: 'WELCOME10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minPurchase: 0,
      maxUses: -1,
      usedCount: 0,
      isActive: true,
    },
    {
      code: 'SUMMER25',
      discountType: 'PERCENTAGE',
      discountValue: 25,
      minPurchase: 200,
      maxUses: 100,
      usedCount: 0,
      isActive: true,
    },
    {
      code: 'FAMILY50',
      discountType: 'FIXED',
      discountValue: 50,
      minPurchase: 300,
      maxUses: 50,
      usedCount: 0,
      isActive: true,
    },
  ];

  for (const voucher of vouchersData) {
    await prisma.voucher.create({
      data: voucher,
    });
  }

  console.log('Created vouchers');

  // Get trip IDs for reviews
  const trips = await prisma.trip.findMany();
  const tripMap = new Map(trips.map(t => [t.name, t.id]));

  // Create sample reviews
  const reviewsData = [
    {
      tripId: tripMap.get('Half Day Fishing Adventure') || '',
      userName: 'John Smith',
      rating: 5,
      comment: 'Amazing experience! Captain Nikos was incredibly knowledgeable and patient. We caught so many fish and learned so much. Highly recommend!',
      isVerified: true,
    },
    {
      tripId: tripMap.get('Full Day Deep Sea Expedition') || '',
      userName: 'Maria Garcia',
      rating: 5,
      comment: 'The full day trip was worth every penny. We caught some impressive fish and the lunch was delicious. Will definitely book again!',
      isVerified: true,
    },
    {
      tripId: tripMap.get('Sunset Fishing & Dinner Cruise') || '',
      userName: 'David & Sarah',
      rating: 5,
      comment: 'Perfect romantic evening! The sunset was breathtaking and the dinner was amazing. A unique experience we will never forget.',
      isVerified: true,
    },
    {
      tripId: tripMap.get('Half Day Fishing Adventure') || '',
      userName: 'Thomas Mueller',
      rating: 4,
      comment: 'Great trip with the family. Kids loved it and caught their first fish. Equipment was top quality.',
      isVerified: true,
    },
    {
      tripId: tripMap.get('Private Charter Experience') || '',
      userName: 'The Johnson Family',
      rating: 5,
      comment: 'We chartered the boat for a family reunion and it was absolutely perfect. Everything was taken care of and we had an incredible day.',
      isVerified: true,
    },
  ];

  for (const review of reviewsData) {
    if (review.tripId) {
      await prisma.review.create({
        data: review,
      });
    }
  }

  console.log('Created reviews');

  // Create gallery images
  const galleryImagesData = [
    {
      title: 'Big Catch of the Day',
      description: 'A beautiful sea bass caught during our morning trip',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80',
      category: 'catches',
      isActive: true,
    },
    {
      title: 'Our Boat at Sunset',
      description: 'The perfect end to a perfect day of fishing',
      imageUrl: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&q=80',
      category: 'boat',
      isActive: true,
    },
    {
      title: 'Amvrakikos Bay',
      description: 'The stunning scenery of Amvrakikos Gulf',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80',
      category: 'scenery',
      isActive: true,
    },
    {
      title: 'Happy Anglers',
      description: 'A family enjoying their fishing adventure',
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80',
      category: 'guests',
      isActive: true,
    },
  ];

  for (const image of galleryImagesData) {
    await prisma.galleryImage.create({
      data: image,
    });
  }

  console.log('Created gallery images');
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
