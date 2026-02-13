import React, { useState } from 'react';
import Navbar from './Components/Navbar/Navbar';
import Hero from './Components/Hero/Hero';
import Categories from './Components/Categories/Categories';
import ProductRow from './Components/ProductRow/ProductRow';
import Auth from './Components/Auth/Auth';
import Cart from './Components/Cart/Cart';
import Checkout from './Components/Checkout/Checkout';
import { useEffect } from 'react';
import './App.css';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [showCheckout, setShowCheckout] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  // Fetch cart items from backend
  const fetchCart = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/cart/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart(user.id);
    }
  }, [user]);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setShowAuth(false);
    fetchCart(userData.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCartItems([]);
    setShowAuth(false);
    setShowCheckout(false);
  };

  const addToCart = async (product) => {
    console.log("Add to cart clicked for product:", product);
    if (!user) {
      setShowAuth(true); // Ask to login first
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/cart/add?userId=${user.id}&productId=${product.id}&quantity=1`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchCart(user.id); // Refresh cart
        setIsCartOpen(true); // Show cart when item added
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await fetch(`http://localhost:8081/api/cart/remove/${cartItemId}`, { method: 'DELETE' });
      fetchCart(user.id);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const handleOrderSuccess = (order) => {
    setLastOrder(order);
    setShowCheckout(false);
    setCartItems([]); // Clear cart locally
    alert(`Order placed successfully! Order ID: #${order.id}`);
  };

  return (
    <div className="App">
      <Navbar
        onLoginClick={() => setShowAuth(true)}
        onHomeClick={() => {
          setShowAuth(false);
          setShowCheckout(false);
        }}
        user={user}
        onLogout={handleLogout}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
      />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        user={user}
        onCheckout={() => setShowCheckout(true)}
      />

      {showAuth ? (
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : showCheckout ? (
        <Checkout
          cartItems={cartItems}
          user={user}
          onOrderSuccess={handleOrderSuccess}
          onBack={() => setShowCheckout(false)}
        />
      ) : (
        <>
          <Hero />
          {user && (
            <div className="welcome-banner" style={{ textAlign: 'center', padding: '20px', background: '#f0f9eb' }}>
              <h2 style={{ color: '#328616', margin: 0 }}>Welcome back, {user.name}! 👋</h2>
            </div>
          )}
          {lastOrder && (
            <div className="order-success-banner" style={{ textAlign: 'center', padding: '15px', background: '#328616', color: 'white' }}>
              <p style={{ margin: 0 }}>🎉 Order <strong>#{lastOrder.id}</strong> placed successfully! Total: ₹{lastOrder.totalAmount}</p>
            </div>
          )}
          <Categories />
          {categories.map(cat => (
            <ProductRow
              key={cat.id}
              title={cat.name}
              categoryId={cat.id}
              onAddToCart={addToCart}
            />
          ))}
        </>
      )}

      <footer style={{ textAlign: 'center', padding: '40px 0', color: '#888', fontSize: '14px' }}>
        <p>&copy; 2024 Blinkit Clone. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
