package com.ecommerce.controller;

import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCart(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(cartRepository.findByUser(user.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestParam Long userId, @RequestParam Long productId,
            @RequestParam Integer quantity) {
        System.out
                .println("Cart addition request - User: " + userId + ", Product: " + productId + ", Qty: " + quantity);

        Optional<User> user = userRepository.findById(userId);
        Optional<Product> product = productRepository.findById(productId);

        if (user.isPresent() && product.isPresent()) {
            System.out.println(
                    "Processing cart for user: " + user.get().getName() + " and product: " + product.get().getName());
            Optional<CartItem> existingItem = cartRepository.findByUserAndProduct_Id(user.get(), productId);
            if (existingItem.isPresent()) {
                CartItem item = existingItem.get();
                item.setQuantity(item.getQuantity() + quantity);
                item = cartRepository.save(item);
                System.out.println("Updated existing cart item quantity to: " + item.getQuantity());
                return ResponseEntity.ok(item);
            } else {
                CartItem newItem = new CartItem(user.get(), product.get(), quantity);
                newItem = cartRepository.save(newItem);
                System.out.println("Created new cart item with ID: " + newItem.getId());
                return ResponseEntity.ok(newItem);
            }
        }

        System.err.println(
                "Cart addition failed - User found: " + user.isPresent() + ", Product found: " + product.isPresent());
        return ResponseEntity.badRequest().body("User or Product not found");
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long cartItemId) {
        cartRepository.deleteById(cartItemId);
        return ResponseEntity.ok().build();
    }
}
