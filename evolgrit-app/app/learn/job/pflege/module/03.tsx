import React, { useEffect } from "react";
import { useRouter } from "expo-router";

export default function PflegeModule03Screen() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/learn/job/pflege/03");
  }, [router]);

  return null;
}
