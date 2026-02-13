import React from 'react';
import './Cart.css';

const Cart = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, user, onCheckout }) => {
    const totalAmount = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    if (!isOpen) return null;

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-drawer" onClick={e => e.stopPropagation()}>
                <div className="cart-header">
                    <h2>My Cart</h2>
                    <button className="close-cart" onClick={onClose}>&times;</button>
                </div>

                <div className="cart-content">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <div className="empty-cart-icon">🛒</div>
                            <p>Your cart is empty</p>
                            <button className="start-shopping" onClick={onClose}>Start Shopping</button>
                        </div>
                    ) : (
                        <div className="cart-items-list">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item-image">{item.product.imageUrl}</div>
                                    <div className="cart-item-details">
                                        <h4>{item.product.name}</h4>
                                        <p className="item-price">₹{item.product.price}</p>
                                        <div className="quantity-controls">
                                            {/* We can implement quantity updates later if needed */}
                                            <span>Quantity: {item.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="cart-item-total">
                                        ₹{item.product.price * item.quantity}
                                        <button className="remove-item" onClick={() => onRemoveItem(item.id)}>&times;</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="total-row">
                            <span>Total</span>
                            <span className="grand-total">₹{totalAmount}</span>
                        </div>
                        <button className="checkout-btn" onClick={() => {
                            onCheckout();
                            onClose();
                        }}>Checkout</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
