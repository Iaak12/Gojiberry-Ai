import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const superAdminEmail = process.env.SUPERADMIN_EMAIL || 'superadmin@gojiberry.ai';
    if (email.toLowerCase() !== superAdminEmail.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();

    // 1. Total users
    const totalUsers = await User.countDocuments();

    // 2. Recent users (last 10)
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email role createdAt');

    // 3. System status
    const systemStatus = {
      mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      geminiKey: process.env.GEMINI_API_KEY ? 'Set' : 'Missing',
    };

    return NextResponse.json({
      totalUsers,
      recentUsers,
      systemStatus,
    });
  } catch (error) {
    console.error('Superadmin API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
