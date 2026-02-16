import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

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

  // Create sample reviews with varied ratings
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
    {
      tripId: tripMap.get('Night Fishing Adventure') || '',
      userName: 'Alex Chen',
      rating: 4,
      comment: 'Unique experience fishing under the stars. The bioluminescence was magical. Fishing was a bit slow but the atmosphere made up for it.',
      isVerified: true,
    },
    {
      tripId: tripMap.get('Full Day Deep Sea Expedition') || '',
      userName: 'Emma Wilson',
      rating: 3,
      comment: 'Good trip overall but we had some rough seas in the afternoon. Captain was professional and safety was prioritized. Would try a calmer day next time.',
      isVerified: true,
    },
    {
      tripId: tripMap.get('Sunset Fishing & Dinner Cruise') || '',
      userName: 'Marco Rossi',
      rating: 5,
      comment: 'Bellissimo! The Greek hospitality was incredible. Fresh seafood dinner was the best I\'ve ever had. Grazie Captain Nikos!',
      isVerified: true,
    },
    {
      tripId: tripMap.get('Half Day Fishing Adventure') || '',
      userName: 'Sophie Laurent',
      rating: 4,
      comment: 'Beautiful scenery and a peaceful morning on the water. Caught a nice variety of fish. Perfect for a relaxing half day activity.',
      isVerified: true,
    },
    {
      tripId: tripMap.get('Private Charter Experience') || '',
      userName: 'Robert & Team',
      rating: 5,
      comment: 'Corporate team building event that exceeded all expectations. Captain Nikos tailored the experience perfectly for our group. Highly professional.',
      isVerified: true,
    },
    {
      tripId: tripMap.get('Night Fishing Adventure') || '',
      userName: 'Lisa Thompson',
      rating: 5,
      comment: 'Absolutely thrilling! Caught the biggest fish of my life. The specialized night equipment was impressive. Will definitely do this again!',
      isVerified: true,
    },
    {
      tripId: tripMap.get('Half Day Fishing Adventure') || '',
      userName: 'Michael Brown',
      rating: 2,
      comment: 'Weather was not great and fish weren\'t biting much. Captain tried different spots but it just wasn\'t our day. Maybe better luck next time.',
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
    {
      title: 'Trophy Red Snapper',
      description: 'An impressive red snapper caught on our deep sea expedition',
      imageUrl: 'https://images.unsplash.com/photo-1516575334481-f85287c2c82d?auto=format&fit=crop&q=80',
      category: 'catches',
      isActive: true,
    },
    {
      title: 'Fishing Equipment',
      description: 'Top-of-the-line fishing rods and reels for our guests',
      imageUrl: 'https://images.unsplash.com/photo-1516967124798-10656f7dca28?auto=format&fit=crop&q=80',
      category: 'boat',
      isActive: true,
    },
    {
      title: 'Golden Hour',
      description: 'Beautiful sunset colors reflecting on calm waters',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80',
      category: 'scenery',
      isActive: true,
    },
    {
      title: 'Morning Group',
      description: 'A group of friends ready for their fishing adventure',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&q=80',
      category: 'guests',
      isActive: true,
    },
    {
      title: 'Fresh Catch Variety',
      description: 'A diverse catch from a successful day on the water',
      imageUrl: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80',
      category: 'catches',
      isActive: true,
    },
    {
      title: 'Navigation Station',
      description: 'Modern GPS and fish finder equipment',
      imageUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80',
      category: 'boat',
      isActive: true,
    },
    {
      title: 'Coastal Mountains',
      description: 'The dramatic coastline surrounding Amvrakikos Bay',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80',
      category: 'scenery',
      isActive: true,
    },
    {
      title: 'Kids First Catch',
      description: 'Young angler with their first fish',
      imageUrl: 'https://images.unsplash.com/photo-1605218427368-35b0168dc3e6?auto=format&fit=crop&q=80',
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
