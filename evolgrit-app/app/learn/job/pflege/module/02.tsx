import React, { useEffect } from "react";
import { useRouter } from "expo-router";

export default function PflegeModule02Screen() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/learn/job/pflege/02");
  }, [router]);

  return null;
}
