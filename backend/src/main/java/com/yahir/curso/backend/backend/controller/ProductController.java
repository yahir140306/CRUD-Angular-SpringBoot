package com.yahir.curso.backend.backend.controller;

import com.yahir.curso.backend.backend.model.Product;
import com.yahir.curso.backend.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService service;

    @GetMapping
    public List<Product> listAll() {
        return service.listAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> findById(@PathVariable Long id) {
        return service.findById(id)
                .map(product -> ResponseEntity.ok(product))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product create(@RequestBody Product product) throws Exception {
        return service.save(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(
            @PathVariable Long id,
            @RequestBody Product newData
    ) {
        return service.findById(id)
                .map(productExist -> {
                    productExist.setName(newData.getName());
                    productExist.setPrice(newData.getPrice());
                    productExist.setQuantity(newData.getQuantity());

                    Product update = null;
                    try {
                        update = service.save(productExist);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                    return ResponseEntity.ok(update);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete (@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}
