package com.cinema.dao;

import com.cinema.entity.Order;
import com.cinema.entity.Orderdetail;
import com.cinema.entity.User;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;


/**
 * @program: cinemafront
 * @description:
 * @author: Sea
 * @create: 2019-08-20 14:21
 **/
@Repository
public interface UserMapper {

    User selectStatic();

    User selectPwd(@Param("u_name")String username);

    boolean insertUser(User user);

    boolean updateStatic(@Param("u_static")int ustatic, @Param("u_name")String username);

    User selectUser(@Param("u_name")String username);

    boolean insertOrder(Order order);

    boolean insertOrderDetail(Orderdetail orderdetail);

    boolean updateScheduleSeat(@Param("s_id")int s_id, @Param("s_seatuse")String s_seatuse);

    boolean updateStatus(Order order);
}
