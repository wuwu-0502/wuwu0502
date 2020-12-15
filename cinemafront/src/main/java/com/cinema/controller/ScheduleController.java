package com.cinema.controller;

import com.cinema.entity.Order;
import com.cinema.entity.Schedule;
import com.cinema.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * @author:YTZ
 * @date:2019/8/16 16:51
 * @description:
 */
@Controller
@RequestMapping("/sc")
public class ScheduleController {

    @Autowired
    private ScheduleService ss;


    @RequestMapping("/getallss")
    @ResponseBody
    public List<Schedule> getAllSchedules(String date,int m_id){

        List<Schedule> schedules=ss.getAllSchedules(date,m_id);

        return schedules;
    }

    @RequestMapping("/pass")
    public ModelAndView passSchedule(Integer s_id, HttpSession session){

        Schedule schedule=ss.passSchedule(s_id);
        session.setAttribute("schedule",schedule);
        System.out.println(schedule);
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("redirect:../check.jsp");
        return  modelAndView;
    }

    @RequestMapping("/backseat")
    @ResponseBody
    public boolean backseat(int s_id,String o_no,String s_seatuse,String thisuse ,HttpSession session){
        s_seatuse=s_seatuse.replace(thisuse,"");
        Order order=ss.getOid(o_no);
        boolean reSeatOK=ss.reSeat(s_id,s_seatuse);
        boolean delOderOK=ss.removeOrder(o_no);
        boolean delOderDetailOK=ss.removeOrderDetail(order.getO_id());
        if(reSeatOK&&delOderOK&&delOderDetailOK)return true;
        else return false;
    }

}
