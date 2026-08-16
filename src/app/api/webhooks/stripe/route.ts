import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  if (event.type === "checkout.session.completed") {
    // Example: update user's subscription
    const customerId = session.customer as string;
    const userEmail = session.customer_details?.email;
    
    if (userEmail) {
      await connectToDatabase();
      await User.findOneAndUpdate(
        { email: userEmail },
        { 
          $set: { 
            "settings.subscription": "Pro",
            "settings.stripeCustomerId": customerId 
          } 
        }
      );
    }
  }

  return new NextResponse("OK", { status: 200 });
}
