"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function POSSidebar() {
  const pathname = usePathname();
  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Selling", href: "/selling" },
    { name: "Stocking", href: "/stocking" },
  ];

  return (
    <div className="w-64 bg-[#0a0b0d] border-r border-white/10 h-screen p-6 flex flex-col">
      <h2 className="text-white font-bold text-xl mb-10 tracking-widest">POS SYSTEM</h2>
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.name}
            href={`/${link.href.replace('/', '')}`} // Adjust based on your route nesting
            className={`p-3 rounded transition-colors ${
              pathname === link.href ? "bg-[#d99b62] text-black" : "text-neutral-400 hover:text-white"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}