"use client";

import Image from "next/image";
import { FaFileAlt, FaSeedling, FaHandshake } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ChoosePlanPage() {
  const [selectedPlan, setSelectedPlan] = useState<"yearly" | "monthly">(
    "yearly",
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleCheckout = async () => {
    if (isCheckingOut) return;

    if (!user) {
      alert("Please log in before subscribing.");
      return;
    }

    setIsCheckingOut(true);

    try {
      const idToken = await user.getIdToken();
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      if (!response.ok) {
        throw new Error("Unable to start checkout");
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error("Stripe did not return a checkout URL");
      }

      window.location.assign(data.url);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Unable to start checkout. Please try again.");
      setIsCheckingOut(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const benefits = document.getElementById("plan-benefits");
      const originalButton = document.getElementById("original-plan-button");

      if (!benefits || !originalButton) return;

      const benefitsTop = benefits.getBoundingClientRect().top;
      const originalButtonTop = originalButton.getBoundingClientRect().top;

      setShowFloatingButton(
        benefitsTop <= window.innerHeight - 100 &&
          originalButtonTop > window.innerHeight - 100,
      );
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-white text-[#032b41]">
      <Link
        href="/for-you"
        className="absolute left-6 top-6 z-10 rounded px-3 py-2 text-sm font-semibold text-white transition hover:underline"
      >
        ← Back to For You
      </Link>

      <section className="relative rounded-b-[200px] bg-[#032b41] px-6 pb-80 pt-12 text-center text-white md:rounded-b-[250px]">
        <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
          Get unlimited access to many amazing books to read
        </h1>

        <p className="mx-auto mt-10 text-lg">
          Turn ordinary moments into amazing learning opportunities
        </p>

        <div className="absolute bottom-16 left-1/2 w-[340px] -translate-x-1/2 translate-y-1/4 overflow-hidden rounded-t-full">
          <Image
            src="/assets/pricing-top.png"
            alt="Unlimited learning illustration"
            width={340}
            height={340}
            className="h-auto w-full"
          />
        </div>
      </section>

      <section
        id="plan-benefits"
        className="mx-auto max-w-4xl px-6 pb-12 pt-24 text-[#032b41]"
      >
        <div className="grid gap-10 text-center md:grid-cols-3">
          <div className="flex flex-col items-center">
            <FaFileAlt className="mb-4 text-5xl" />
            <p className="text-base leading-6">
              <span className="font-bold">Key ideas in few min</span> with many
              books to read
            </p>
          </div>

          <div className="flex flex-col items-center">
            <FaSeedling className="mb-4 text-5xl" />
            <p className="text-base leading-6">
              <span className="font-bold">3 million</span> people growing with
              Summarist everyday
            </p>
          </div>

          <div className="flex flex-col items-center">
            <FaHandshake className="mb-4 text-5xl" />
            <p className="text-base leading-6">
              <span className="font-bold">Precise recommendations</span>{" "}
              collections curated by experts
            </p>
          </div>
        </div>
      </section>

      <section
        id="plan-faq"
        className="mx-auto max-w-3xl px-6 py-16 text-[#032b41]"
      >
        <h2 className="mb-8 text-center text-3xl font-bold">
          Choose the plan that fits you
        </h2>
        <button
          type="button"
          onClick={() => setSelectedPlan("yearly")}
          className={`flex w-full items-start gap-6 rounded border-[3px] bg-[#f1f6f4] p-6 text-left ${
            selectedPlan === "yearly" ? "border-[#2bd67b]" : "border-[#bac8ce]"
          }`}
        >
          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-black">
            {selectedPlan === "yearly" && (
              <span className="h-3 w-3 rounded-full bg-black" />
            )}
          </span>

          <div>
            <h3 className="text-lg font-bold">Premium Plus Yearly</h3>
            <p className="mt-1 text-2xl font-bold">$99.99/year</p>
            <p className="mt-1 text-sm text-gray-500">
              7-day free trial included
            </p>
          </div>
        </button>
        <div className="my-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <span className="h-px w-24 bg-gray-300" />
          or
          <span className="h-px w-24 bg-gray-300" />
        </div>
        <button
          type="button"
          onClick={() => setSelectedPlan("monthly")}
          className={`flex w-full items-start gap-6 rounded border-[3px] bg-[#f1f6f4] p-6 text-left ${
            selectedPlan === "monthly" ? "border-[#2bd67b]" : "border-[#bac8ce]"
          }`}
        >
          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-black">
            {selectedPlan === "monthly" && (
              <span className="h-3 w-3 rounded-full bg-black" />
            )}
          </span>

          <div>
            <h3 className="text-lg font-bold">Premium Monthly</h3>
            <p className="mt-1 text-2xl font-bold">$9.99/month</p>
          </div>
        </button>
        <div
          id="original-plan-button"
          className="mt-8 flex flex-col items-center"
        >
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full max-w-[300px] rounded bg-[#2bd67b] px-6 py-3 text-center text-black transition hover:bg-[#25c46f]"
          >
            {selectedPlan === "yearly"
              ? "Start your free 7-day trial"
              : "Start your first month"}
          </button>

          {selectedPlan === "yearly" && (
            <p className="mt-3 text-center text-xs text-gray-500">
              Cancel your trial at any time before it ends, and you won&apos;t
              be charged.
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-[#032b41]">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Frequently asked questions
        </h2>

        {[
          {
            question: "How does the free 7-day trial work?",
            answer:
              "You can enjoy unlimited access to Summarist for 7 days. If you cancel before the trial ends, you won't be charged.",
          },
          {
            question: "Can I cancel my subscription at any time?",
            answer:
              "Yes! You can cancel your subscription whenever you want. Your access will continue until the end of your billing period.",
          },
          {
            question: "What do I get with a Premium subscription?",
            answer:
              "Premium gives you unlimited access to book summaries, audio summaries, and personalized recommendations.",
          },
          {
            question: "Can I switch between monthly and yearly plans?",
            answer:
              "Yes, you can change your subscription plan through your account settings.",
          },
        ].map((faq, index) => (
          <div key={index} className="border-b border-gray-200">
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              aria-expanded={openFaq === index}
              className="flex w-full items-center justify-between py-5 text-left font-semibold"
            >
              <span>{faq.question}</span>
              <FiChevronDown
                className={`ml-4 shrink-0 text-xl transition-transform duration-200 ${
                  openFaq === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {openFaq === index && (
              <p className="pb-5 text-sm leading-7 text-gray-600">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </section>

      {showFloatingButton && (
        <div className="fixed bottom-0 left-0 z-50 w-full bg-white px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
          <div className="mx-auto flex max-w-[680px] flex-col items-center">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full max-w-[300px] rounded bg-[#2bd67b] px-6 py-3 text-center text-black transition hover:bg-[#25c46f]"
            >
              {selectedPlan === "yearly"
                ? "Start your free 7-day trial"
                : "Start your first month"}
            </button>

            {selectedPlan === "yearly" && (
              <p className="mt-2 text-center text-xs text-gray-500">
                Cancel your trial at any time before it ends, and you won&apos;t
                be charged.
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
