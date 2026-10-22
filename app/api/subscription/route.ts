import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { adminAuth } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization");
    const idToken = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
    });

    const userSessions = sessions.data.filter((session) => {
      if (session.client_reference_id) {
        return session.client_reference_id === decodedToken.uid;
      }

      return (
        decodedToken.email_verified === true &&
        session.customer_details?.email?.toLowerCase() ===
          decodedToken.email?.toLowerCase()
      );
    });

    for (const session of userSessions) {
      if (!session.subscription) continue;

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      if (
        subscription.status !== "active" &&
        subscription.status !== "trialing"
      ) {
        continue;
      }

      const priceId = subscription.items.data[0]?.price.id;

      if (priceId === process.env.STRIPE_YEARLY_PRICE_ID) {
        return NextResponse.json({ plan: "premium-plus" });
      }

      if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID) {
        return NextResponse.json({ plan: "premium" });
      }
    }

    return NextResponse.json({ plan: "basic" });
  } catch (error) {
    console.error("Subscription lookup error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve subscription" },
      { status: 500 },
    );
  }
}
