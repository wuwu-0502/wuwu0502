package com.cinema.service;

import com.cinema.entity.Order;
import com.cinema.entity.Schedule;
import org.springframework.stereotype.Service;

import java.util.List;


public interface ScheduleService {

    List<Schedule> getAllSchedules(String date, int m_id);
    Schedule passSchedule(int s_id);


    boolean reSeat(int s_id, String s_seatuse);

    boolean removeOrder(String o_no);

    boolean removeOrderDetail(int o_id);

    Order getOid(String o_no);
}
