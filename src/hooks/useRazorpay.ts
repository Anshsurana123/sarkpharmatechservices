import { useState } from 'react';

// Extend the Window interface to include Razorpay
declare global {
    interface Window {
        Razorpay: any;
    }
}

export const useRazorpay = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const processPayment = async (amount: number, currency: string = 'INR', description: string = 'SOP License') => {
        setIsProcessing(true);

        const isLoaded = await loadRazorpayScript();

        if (!isLoaded) {
            alert('Razorpay SDK failed to load. Please check your connection.');
            setIsProcessing(false);
            return;
        }

        try {
            // 1. Create the order on the backend
            // Note: Amount passed to backend is for server verification logic, 
            // but for Razorpay API it needs to be in subunits (Paise for INR, 1 INR = 100 Paise)
            const amountInSubunits = amount * 100;

            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amountInSubunits, currency })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create order');
            }

            // 2. Open Razorpay Checkot
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '', // We need to expose this to the client
                amount: amountInSubunits.toString(),
                currency: currency,
                name: 'Sark Pharma Tech Services',
                description: description,
                order_id: data.orderId,
                handler: function (response: any) {
                    // Success! 
                    // To be fully secure, you would pass response.razorpay_signature back to your server to verify
                    alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                    console.log("Success Response:", response);
                },
                prefill: {
                    name: 'Guest User',
                    email: 'guest@example.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#0f172a' // Primary color matched to Shadcn
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response: any) {
                alert(`Payment Failed. Reason: ${response.error.description}`);
                console.error("Payment Failed", response.error);
            });

            paymentObject.open();

        } catch (error) {
            console.error(error);
            alert('An error occurred during payment processing.');
        } finally {
            setIsProcessing(false);
        }
    };

    return { processPayment, isProcessing };
};
