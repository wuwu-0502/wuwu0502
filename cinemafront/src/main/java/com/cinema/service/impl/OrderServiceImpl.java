package com.cinema.service.impl;

import com.cinema.dao.OrderMapper;
import com.cinema.entity.Order;
import com.cinema.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderMapper orderMapper;
    public List<Order> all(int u_id){
        return orderMapper.getAll(u_id);
    }
}
