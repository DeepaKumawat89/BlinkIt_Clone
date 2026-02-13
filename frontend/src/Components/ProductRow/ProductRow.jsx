import React, { useEffect, useState } from 'react';
import './ProductRow.css';

const ProductRow = ({ title, categoryId, onAddToCart }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // If categoryId is provided, fetch by category
        const url = categoryId
            ? `http://localhost:8081/api/products/category/${categoryId}`
            : 'http://localhost:8081/api/products';

        fetch(url)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Error fetching products:", err));
    }, [categoryId]);

    if (products.length === 0) return null;

    return (
        <section className="product-row-section container">
            <div className="row-header">
                <h2>{title}</h2>
                <a href="#" className="see-all">See All</a>
            </div>
            <div className="products-container">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="product-image">
                            <span className="emoji-img">{product.imageUrl}</span>
                            <span className="delivery-time">⏱ {product.deliveryTime}</span>
                        </div>
                        <div className="product-details">
                            <h3 className="product-name">{product.name}</h3>
                            <div className="product-footer">
                                <span className="product-price">₹{product.price}</span>
                                <button
                                    className="add-btn"
                                    onClick={() => onAddToCart(product)}
                                >
                                    ADD
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProductRow;
