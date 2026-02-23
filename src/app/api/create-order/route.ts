import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, currency = "INR", receipt = "receipt#1" } = body;

        // Initialize Razorpay
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error("Razorpay keys are missing from environment variables.");
            return NextResponse.json(
                { error: 'Payment gateway configuration error.' },
                { status: 500 }
            );
        }

        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: currency,
            receipt: receipt,
            payment_capture: 1 // Auto capture
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({ orderId: order.id }, { status: 200 });

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json(
            { error: 'Failed to create payment order.' },
            { status: 500 }
        );
    }
}
