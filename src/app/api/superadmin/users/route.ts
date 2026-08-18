import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { stripe } from '@/lib/stripe';

// Helper to authenticate superadmin
function isSuperadmin(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) return false;
  const superAdminEmail = process.env.SUPERADMIN_EMAIL || 'superadmin@gojiberry.ai';
  return email.toLowerCase() === superAdminEmail.toLowerCase();
}

export async function GET(req: NextRequest) {
  try {
    if (!isSuperadmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    
    // Fetch all users
    const users = await User.find({}).sort({ createdAt: -1 });

    // Try fetching Stripe info if they have customerId
    const usersWithStripe = await Promise.all(users.map(async (u) => {
      let totalSpent = 0;
      let subscriptionTier = 'Free';
      
      try {
        const customerId = u.settings?.stripeCustomerId;
        if (customerId) {
          // Get all charges for this customer
          const charges = await stripe.charges.list({ customer: customerId });
          totalSpent = charges.data.filter(c => c.status === 'succeeded').reduce((acc, c) => acc + c.amount, 0) / 100;
          
          // Check active subscription
          const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'active' });
          if (subscriptions.data.length > 0) {
            subscriptionTier = 'Pro';
          }
        }
      } catch (err) {
        console.error(`Stripe fetch error for user ${u.email}:`, err);
      }

      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status || 'active',
        geminiKey: u.geminiKey || '',
        apifyToken: u.apifyToken || '',
        stripeSpent: totalSpent,
        subscriptionTier,
        createdAt: u.createdAt
      };
    }));

    return NextResponse.json({ users: usersWithStripe });
  } catch (error) {
    console.error('Superadmin Users API GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!isSuperadmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId, status } = await req.json();
    if (!userId || !['active', 'banned'].includes(status)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await connectToDatabase();
    const updatedUser = await User.findByIdAndUpdate(userId, { status }, { new: true });
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Superadmin Users API PATCH Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isSuperadmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    await connectToDatabase();
    await User.findByIdAndDelete(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Superadmin Users API DELETE Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
