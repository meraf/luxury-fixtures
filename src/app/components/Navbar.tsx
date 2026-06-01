"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Catalog", href: "/catalog" },
  ];

  return (
    <nav className="hidden lg:flex items-center gap-10 text-sm uppercase tracking-[0.2em] font-bold text-neutral-400">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`transition-colors duration-300 ${
              isActive ? "text-[#d99b62]" : "hover:text-white"
            }`}
          >
            {link.name}
          </Link>
        );
        
      })}
    </nav>
  );
}