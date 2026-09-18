import '@/app/global.css';
import { i18n } from '@/lib/i18n';
import { Translations } from 'fumadocs-ui/i18n';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';

const cn: Partial<Translations> = {
  'Search(search dialog)': '搜索文档',
  'Search(search trigger)': '搜索文档',
};
// available languages that will be displayed on UI
// make sure `locale` is consistent with your i18n config
const locales = [
  {
    name: 'English',
    locale: 'en',
  },
  {
    name: 'Chinese',
    locale: 'cn',
  },
];

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const lang = (await params).lang;
  return (
    <html lang={lang} suppressHydrationWarning>
      <body>
        <RootProvider
          i18n={{
            defaultLanguage: i18n.defaultLanguage,
            hideLocale: i18n.hideLocale,
            locale: lang,
            locales,
            translations: { cn }[lang],
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
