import React, { useEffect, useState } from 'react';
import './Categories.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8081/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Error fetching categories:", err));
    }, []);

    return (
        <section className="categories-section container">
            {categories.map((cat) => (
                <div key={cat.id} className="category-item">
                    <div className="category-icon">{cat.icon}</div>
                    <span className="category-name">{cat.name}</span>
                </div>
            ))}
        </section>
    );
};

export default Categories;
