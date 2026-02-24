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
            script.onload = () => { resolve(true); };
            script.onerror = () => { resolve(false); };
            document.body.appendChild(script);
        });
    };

    const processPayment = async (
        amount: number,
        currency: string = 'INR',
        description: string = 'SOP License',
        sopId?: string,
        sopTitle?: string
    ) => {
        setIsProcessing(true);

        const isLoaded = await loadRazorpayScript();

        if (!isLoaded) {
            alert('Razorpay SDK failed to load. Please check your connection.');
            setIsProcessing(false);
            return;
        }

        try {
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

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
                amount: amountInSubunits.toString(),
                currency: currency,
                name: 'Sark Pharma Tech Services',
                description: description,
                order_id: data.orderId,
                handler: function (response: any) {
                    // Save purchase to localStorage for profile page
                    try {
                        const existing = JSON.parse(localStorage.getItem('pharma_purchases') || '[]');
                        const purchase = {
                            id: sopId || data.orderId,
                            title: sopTitle || description,
                            amount,
                            currency,
                            paymentId: response.razorpay_payment_id,
                            date: new Date().toISOString().split('T')[0],
                        };
                        localStorage.setItem('pharma_purchases', JSON.stringify([purchase, ...existing]));

                        // Push a bell notification
                        const notifs = JSON.parse(localStorage.getItem('pharma_notifications') || '[]');
                        notifs.unshift({
                            id: response.razorpay_payment_id,
                            text: `Purchase confirmed: ${sopTitle || description}`,
                            time: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
                        });
                        localStorage.setItem('pharma_notifications', JSON.stringify(notifs.slice(0, 20)));
                    } catch (_) { }
                    alert(`✅ Payment successful! Payment ID: ${response.razorpay_payment_id}`);
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
