import { NextRequest, NextResponse } from 'next/server';
import { predict_risk } from '@/app/predict_health_risk';
import type { RiskFactor } from '@/app/predict_health_risk.ts';

export async function POST(request: NextRequest) {
  try {
    const input: RiskFactor = await request.json();
    const result = await predict_risk(input); // Your function uses the loaded CSV internally
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to predict risk' }, { status: 500 });
  }
}
