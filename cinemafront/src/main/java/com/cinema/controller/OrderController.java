package com.cinema.controller;


import com.cinema.entity.Order;
import com.cinema.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.util.List;

@Controller
@RequestMapping("/odr")
public class OrderController {

    @Autowired
    private OrderService orderService;


    @RequestMapping("/getallOrder")
    public ModelAndView all(HttpSession session,int u_id){
        List<Order> orders = orderService.all(u_id);
        ModelAndView mav=new ModelAndView();
        session.setAttribute("orders",orders);
        mav.setViewName("redirect:../list.jsp");

        return mav;

    }
}

