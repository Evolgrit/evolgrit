import React, { useEffect } from "react";
import { useRouter } from "expo-router";

export default function PflegeModule04Screen() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/learn/job/pflege/04");
  }, [router]);

  return null;
}
