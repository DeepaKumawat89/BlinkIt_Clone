import React, { useState } from 'react';
import './Checkout.css';

const Checkout = ({ cartItems, user, onOrderSuccess, onBack }) => {
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState(user?.phone || '');
    const [loading, setLoading] = useState(false);

    const totalAmount = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!address || !phone) {
            alert("Please provide address and phone number");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8081/api/orders/place?userId=${user.id}&address=${encodeURIComponent(address)}&phone=${encodeURIComponent(phone)}`, {
                method: 'POST'
            });

            if (response.ok) {
                const order = await response.json();
                onOrderSuccess(order);
            } else {
                alert("Failed to place order. Please try again.");
            }
        } catch (error) {
            console.error("Order error:", error);
            alert("An error occurred. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <div className="checkout-card">
                <div className="checkout-header">
                    <button className="back-btn" onClick={onBack}>← Back</button>
                    <h2>Checkout</h2>
                </div>

                <div className="checkout-body">
                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="summary-item">
                                    <span>{item.product.name} x {item.quantity}</span>
                                    <span>₹{item.product.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-total">
                            <span>Total Amount</span>
                            <span>₹{totalAmount}</span>
                        </div>
                    </div>

                    <form className="delivery-form" onSubmit={handlePlaceOrder}>
                        <h3>Delivery Details</h3>
                        <div className="form-group">
                            <label>Delivery Address</label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your full address"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter 10-digit number"
                                required
                            />
                        </div>

                        <div className="payment-simulation">
                            <p>💳 Payment Mode: <strong>Cash on Delivery (Simulation)</strong></p>
                        </div>

                        <button
                            type="submit"
                            className="place-order-btn"
                            disabled={loading || cartItems.length === 0}
                        >
                            {loading ? "Processing..." : `Place Order (₹${totalAmount})`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
