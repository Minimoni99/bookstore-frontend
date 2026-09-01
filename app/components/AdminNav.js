"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/books", label: "Books" },
  { href: "/admin/site", label: "Site" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/users", label: "Users" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="admin-nav">
      {links.map((l) => (
        <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
