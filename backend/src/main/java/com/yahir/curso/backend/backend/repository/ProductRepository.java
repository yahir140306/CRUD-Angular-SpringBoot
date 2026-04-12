package com.yahir.curso.backend.backend.repository;

import com.yahir.curso.backend.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
