package com.ecommerce.config;

import com.ecommerce.entity.Category;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(CategoryRepository categoryRepository, ProductRepository productRepository) {
        return args -> {
            // Check if data exists
            if (categoryRepository.count() == 0) {
                // Create Categories
                Category veg = new Category("Vegetables", "🥦");
                Category fruits = new Category("Fruits", "🍎");
                Category dairy = new Category("Dairy", "🥛");
                Category bakery = new Category("Bakery", "🍞");

                categoryRepository.saveAll(Arrays.asList(veg, fruits, dairy, bakery));

                // Create Products for Dairy
                productRepository.save(new Product("Fresh Milk", 30.0, "🥛", "8 mins", dairy));
                productRepository.save(new Product("Curd", 25.0, "🥣", "9 mins", dairy));
                productRepository.save(new Product("Paneer", 85.0, "🧀", "11 mins", dairy));
                productRepository.save(new Product("Butter", 56.0, "🧈", "15 mins", dairy));

                // Create Products for Bakery
                productRepository.save(new Product("Brown Bread", 45.0, "🍞", "12 mins", bakery));
                productRepository.save(new Product("White Bread", 40.0, "🍞", "10 mins", bakery));
                productRepository.save(new Product("Eggs (6 pcs)", 42.0, "🥚", "10 mins", dairy)); // Eggs often grouped
                                                                                                   // with dairy

                // Create Products for Veg/Fruits
                productRepository.save(new Product("Tomato", 20.0, "🍅", "12 mins", veg));
                productRepository.save(new Product("Potato", 15.0, "🥔", "15 mins", veg));
                productRepository.save(new Product("Apple", 120.0, "🍎", "10 mins", fruits));
                productRepository.save(new Product("Banana", 40.0, "🍌", "8 mins", fruits));

                System.out.println("Sample data loaded!");
            }
        };
    }
}
