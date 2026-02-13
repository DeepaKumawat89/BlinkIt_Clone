import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero-section container">
            <div className="hero-banner">
                <div className="banner-content">
                    <h1>Express Delivery</h1>
                    <p>Get your groceries in minutes</p>
                    <button className="cta-btn">Shop Now</button>
                </div>
                <div className="banner-image">
                    {/* Placeholder for banner image */}
                    <div className="placeholder-img">🥦 🍎 🍞</div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
