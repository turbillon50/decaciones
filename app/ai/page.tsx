"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AIPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/"); }, [router]);
  return null;
}
