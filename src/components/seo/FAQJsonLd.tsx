import { getTranslations } from 'next-intl/server';

interface FAQJsonLdProps {
  locale: string;
}

export async function FAQJsonLd({ locale }: FAQJsonLdProps) {
  const t = await getTranslations({ locale, namespace: 'faq' });
  
  // FAQ questions and answers
  const faqs = [
    {
      question: t('booking'),
      answer: t('contact'), // Using contact text as a placeholder
    },
    {
      question: t('trips'),
      answer: t('contact'),
    },
    {
      question: t('safety'),
      answer: t('contact'),
    },
    {
      question: t('weather'),
      answer: t('contact'),
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
