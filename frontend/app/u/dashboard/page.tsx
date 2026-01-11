"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/u/focus");
  }, [router]);

  return null; // or a loading spinner if you want
}
