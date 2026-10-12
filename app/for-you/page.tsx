"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function ForYouPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (!currentUser) {
        router.replace("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (authLoading || !user) {
  return <p>Loading...</p>;
}

  return (
    <main>
      <h1>For You</h1>
      <p>Welcome to your Summarist book recommendations!</p>
    </main>
  );
}
