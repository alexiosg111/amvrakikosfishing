'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { routing } from '@/i18n/routing';
import { Languages } from 'lucide-react';

export function LocaleSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  const localeNames: Record<string, string> = {
    en: 'English',
    el: 'Ελληνικά',
    de: 'Deutsch',
  };

  return (
    <div className="flex items-center gap-2">
      <Languages className="w-4 h-4 text-slate-600" />
      <div className="flex gap-1">
        {routing.locales.map((lang) => (
          <Button
            key={lang}
            variant={locale === lang ? 'default' : 'ghost'}
            size="sm"
            onClick={() => switchLocale(lang)}
            className={
              locale === lang
                ? 'bg-blue-900 text-white hover:bg-blue-800'
                : 'text-slate-600 hover:text-slate-900'
            }
          >
            {lang.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  );
}
