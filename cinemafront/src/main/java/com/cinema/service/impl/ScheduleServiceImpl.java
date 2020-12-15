package com.cinema.service.impl;

import com.cinema.dao.ScheduleMapper;
import com.cinema.entity.Order;
import com.cinema.entity.Schedule;
import com.cinema.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author:YTZ
 * @date:2019/8/16 17:03
 * @description:
 */

@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    private ScheduleMapper sm;


    @Override
    public List<Schedule> getAllSchedules(String date,int m_id) {
        return sm.getAllSchedules(date,m_id);
    }

    @Override
    public Schedule passSchedule(int s_id) {
        return sm.passSchedule(s_id);
    }

    @Override
    public boolean reSeat(int s_id, String s_seatuse) {
        return sm.updateSeatuse(s_id,s_seatuse);
    }

    @Override
    public boolean removeOrder(String o_no) {
        return sm.delOrder(o_no);
    }

    @Override
    public boolean removeOrderDetail(int o_id) {
        return sm.delOrderDetail(o_id);
    }

    @Override
    public Order getOid(String o_no) {
        return sm.selectOid(o_no);
    }
}
