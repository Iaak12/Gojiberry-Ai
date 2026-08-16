import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId } = await req.json();
    
    // Fallback to env var if client didn't send one
    const targetPriceId = priceId || process.env.STRIPE_PRICE_ID;

    if (!targetPriceId) {
      return NextResponse.json({ error: "Missing Stripe Price ID. Please set STRIPE_PRICE_ID in your .env" }, { status: 400 });
    }

    const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: session.user.email,
      line_items: [
        {
          price: targetPriceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/settings?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/settings?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
