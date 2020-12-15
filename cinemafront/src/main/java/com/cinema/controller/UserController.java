package com.cinema.controller;

import com.cinema.entity.Check;
import com.cinema.entity.Order;
import com.cinema.entity.Orderdetail;
import com.cinema.entity.User;
import com.cinema.service.UserService;
import com.cinema.util.MD5;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.Date;


/**
 * @program: cinemafront
 * @description:
 * @author: Sea
 * @create: 2019-08-20 14:11
 **/
@Controller
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService us ;

    @RequestMapping("/getstatic")
    public ModelAndView getstatic(HttpServletRequest request, HttpSession session){
        User rememberStatic = us.getRememberStatic();
        ModelAndView mav = new ModelAndView();
        mav.setViewName("redirect:../home.jsp");
//        mav.addObject("user",rememberStatic);//resquestScope
//        request.setAttribute("user",rememberStatic);
        //Session获取
        //１）=通过request获取session
        //request.getSession();
        //2) 方法形参声明HttpSession对象
        session.setAttribute("user",rememberStatic);
        System.out.println(rememberStatic);
        return mav;
    }

    @RequestMapping("/login")
    @ResponseBody
    public User getPwd(@Param("username") String username){
        User userPwd=us.getUserPwd(username);
        userPwd.setU_pwd(MD5.JM(userPwd.getU_pwd()));
        return userPwd;
    }

    @RequestMapping("/create")
    @ResponseBody
    public boolean createUser(String username,String password,String sex,String phone,String email,String question,String answer){
        String passwordByMd5 = MD5.KL(password);
        User createUser=new User(username,passwordByMd5,sex,phone,email,question,answer,new java.sql.Date(System.currentTimeMillis()));
        System.out.println(createUser);
        boolean createOk=us.createNewUser(createUser);
        return createOk;
    }

    @RequestMapping("/changeStatic")
    @ResponseBody
    public boolean changeStatic(int ustatic,String username,HttpSession session){
        boolean changeOk=us.changeTheStatic(ustatic,username);
        User user=us.getUser(username);
        if (user!=null)session.setAttribute("user",user);
        return changeOk;
    }

    @RequestMapping("/logout")
    public ModelAndView logout(String username,HttpServletRequest request, HttpSession session){
        us.changeTheStatic(0,username);
        User logout = us.getUser(username);
        ModelAndView mav = new ModelAndView();
        mav.setViewName("redirect:../home.jsp");
        session.removeAttribute("user");
        System.out.println(logout);
        return mav;
    }

    @RequestMapping("/check")
    @ResponseBody
    public boolean getCheck(int h_id,int m_id,int u_id,int s_id,String o_no,String od_seat,Double od_price,String s_seatuse,String thisuse ,HttpSession session){
        Check check = new Check(o_no, od_seat, od_price, s_seatuse, thisuse);
        session.setAttribute("check",check);

        Date date = new Date();
        SimpleDateFormat sdformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//24小时制
        String LgTime = sdformat.format(date);

        Order order = new Order(o_no, 0, LgTime);
        Orderdetail orderdetail = new Orderdetail(h_id, m_id, u_id, s_id, od_price, od_seat);
        boolean orderOK=us.createOrder(order);
        boolean orderDetailOk=us.createOrderDetail(orderdetail);
        boolean scheduleSeatOk=us.changeScheduleSeat(s_id,s_seatuse);
        System.out.println(check);
        if (orderOK&&orderDetailOk&&scheduleSeatOk)return true;
        else return false;
    }

    @RequestMapping("/pay")
    @ResponseBody
    public boolean payTicket(String o_no){
        Date date = new Date();
        SimpleDateFormat sdformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//24小时制
        String LgTime = sdformat.format(date);
        Order order=new Order(o_no,1,LgTime);
        boolean oderpay=us.buyTicket(order);
        return oderpay;
    }

}
