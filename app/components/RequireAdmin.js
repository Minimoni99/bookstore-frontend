"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, getUser } from "@/lib/api";

export default function RequireAdmin({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!getToken() || !user || user.role !== "admin") {
      router.push(`/login?next=${pathname}`);
    } else {
      setOk(true);
    }
  }, [router, pathname]);

  if (!ok) return null;
  return children;
}
