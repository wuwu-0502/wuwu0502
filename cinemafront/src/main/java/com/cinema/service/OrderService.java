package com.cinema.service;

import com.cinema.entity.Order;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface OrderService {
    List<Order> all(int u_id);




}

