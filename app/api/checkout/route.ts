import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json();
    const authorization = request.headers.get("authorization");
    const idToken = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

    if (!idToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    let decodedToken;

    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired authentication token" },
        { status: 401 },
      );
    }

    const firebaseUid = decodedToken.uid;

    if (plan !== "monthly" && plan !== "yearly") {
      return NextResponse.json(
        { error: "Invalid subscription plan" },
        { status: 400 },
      );
    }

    const priceId =
      plan === "yearly"
        ? process.env.STRIPE_YEARLY_PRICE_ID
        : process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!priceId) {
      throw new Error("Stripe price ID is missing");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: firebaseUid,
      success_url: `${request.nextUrl.origin}/for-you?checkout=success`,
      cancel_url: `${request.nextUrl.origin}/choose-plan?canceled=true`,
      ...(plan === "yearly" && {
        subscription_data: {
          trial_period_days: 7,
        },
      }),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout error:", error);

    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 },
    );
  }
}
