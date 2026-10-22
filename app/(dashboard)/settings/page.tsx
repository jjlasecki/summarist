"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import LoginModal from "@/components/LoginModal";
import Image from "next/image";
import SettingsSkeleton from "@/components/SettingsSkeleton";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [plan, setPlan] = useState<"basic" | "premium" | "premium-plus">(
    "basic",
  );
  const [planLoading, setPlanLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setPlan("basic");
      setPlanLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchSubscription() {
      setPlanLoading(true);

      try {
        const token = await user!.getIdToken();

        const response = await fetch("/api/subscription", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to retrieve subscription");
        }

        const data = await response.json();

        if (!cancelled) {
          setPlan(data.plan);
        }
      } catch (error) {
        console.error("Subscription check failed:", error);
      } finally {
        if (!cancelled) {
          setPlanLoading(false);
        }
      }
    }

    fetchSubscription();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading) {
    return <SettingsSkeleton />;
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-5xl px-8 py-10">
        <h1 className="border-b border-gray-200 pb-4 text-2xl font-bold text-[#032b41]">
          Settings
        </h1>

        <div className="flex flex-col items-center pt-10">
          <Image
            src="/assets/login.png"
            alt="Log in to your account"
            width={320}
            height={220}
            className="h-auto"
          />

          <p className="mt-6 text-center font-semibold text-[#032b41]">
            Log in to your account to see your details.
          </p>

          <button
            onClick={() => setShowLoginModal(true)}
            className="mt-4 rounded bg-[#2bd77c] px-12 py-3 font-semibold text-[#032b41] hover:bg-[#20c96e]"
          >
            Login
          </button>
        </div>

        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <h1 className="border-b border-gray-200 pb-4 text-2xl font-bold text-[#032b41]">
        Settings
      </h1>

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-[#032b41]">
          Your Subscription plan
        </h2>

        {planLoading ? (
          <div className="animate-pulse" aria-label="Loading subscription">
            <div className="mb-3 h-5 w-24 rounded bg-gray-200" />
            <div className="h-9 w-44 rounded bg-gray-200" />
          </div>
        ) : (
          <>
            <p className="font-semibold">
              {plan === "premium-plus"
                ? "premium-plus"
                : plan === "premium"
                  ? "Premium"
                  : "Basic"}
            </p>

            {plan === "basic" && (
              <Link
                href="/choose-plan"
                className="mt-2 inline-block rounded bg-[#2bd77c] px-4 py-2 text-sm font-medium text-[#032b41] hover:bg-[#20c96e]"
              >
                Upgrade to Premium
              </Link>
            )}
          </>
        )}

        <h2 className="mb-3 mt-8 text-lg font-bold text-[#032b41]">Email</h2>
        <p>{user.email}</p>
      </div>
    </main>
  );
}
