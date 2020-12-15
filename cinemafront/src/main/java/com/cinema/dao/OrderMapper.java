package com.cinema.dao;

import com.cinema.entity.Order;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface OrderMapper {

    List<Order> getAll(int u_id);


}
