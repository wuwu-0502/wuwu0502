package com.cinema.service.impl;

import com.cinema.dao.UserMapper;
import com.cinema.entity.Order;
import com.cinema.entity.Orderdetail;
import com.cinema.entity.User;
import com.cinema.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @program: cinemafront
 * @description:
 * @author: Sea
 * @create: 2019-08-20 14:20
 **/
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public User getRememberStatic() {
        return userMapper.selectStatic();
    }

    @Override
    public User getUserPwd(String username) {
        return userMapper.selectPwd(username);
    }

    @Override
    public boolean createNewUser(User user) {
        return userMapper.insertUser(user);
    }

    @Override
    public boolean changeTheStatic(int ustatic, String username) {
        return userMapper.updateStatic(ustatic,username);
    }

    @Override
    public User getUser(String username) {
        return userMapper.selectUser(username);
    }

    @Override
    public boolean createOrder(Order order) {
        return userMapper.insertOrder(order);
    }

    @Override
    public boolean createOrderDetail(Orderdetail orderdetail) {
        return userMapper.insertOrderDetail(orderdetail);
    }

    @Override
    public boolean changeScheduleSeat(int s_id,String s_seatuse) {
        return userMapper.updateScheduleSeat(s_id,s_seatuse);
    }

    @Override
    public boolean buyTicket(Order order) {
        return userMapper.updateStatus(order);
    }
}
