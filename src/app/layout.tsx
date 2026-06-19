import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "./components/ConditionalLayout";

export const metadata: Metadata = {
  title: "LUXURY FIXTURES | Exceptional Hardware & Lighting Systems",
  description: "Bespoke architectural lighting arrays and structural hardware.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0b0d] text-[#f4ebd9] antialiased min-h-screen flex flex-col justify-between">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}