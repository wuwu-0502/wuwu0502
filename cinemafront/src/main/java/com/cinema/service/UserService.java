package com.cinema.service;

import com.cinema.entity.Order;
import com.cinema.entity.Orderdetail;
import com.cinema.entity.User;

/**
 * @program: cinemafront
 * @description:
 * @author: Sea
 * @create: 2019-08-20 14:19
 **/
public interface UserService {
    User getRememberStatic();

    User getUserPwd(String username);

    boolean createNewUser(User user);

    boolean changeTheStatic(int ustatic, String username);

    User getUser(String username);

    boolean createOrder(Order order);

    boolean createOrderDetail(Orderdetail orderdetail);

    boolean changeScheduleSeat(int s_id,String s_seatuse);

    boolean buyTicket(Order order);
}
