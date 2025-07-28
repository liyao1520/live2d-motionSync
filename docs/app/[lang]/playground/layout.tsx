import { cn } from "fumadocs-ui/utils/cn";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
});

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const lang = (await params).lang;
  return (
    <html
      lang={lang}
      className={cn(inter.className, "size-full")}
      suppressHydrationWarning
    >
      <head></head>
      <body>
        <div className="flex justify-center items-center">
          <div className="w-[1000px] h-[800px] overflow-hidden">{children}</div>
        </div>
      </body>
    </html>
  );
}
