package com.cinema.dao;


import com.cinema.entity.Order;
import com.cinema.entity.Schedule;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleMapper {

    List<Schedule> getAllSchedules(@Param("date") String date, @Param("m_id") int m_id);
    Schedule passSchedule(@Param("s_id") int s_id);

    boolean updateSeatuse(@Param("s_id")int s_id, @Param("s_seatuse")String s_seatuse);

    boolean delOrder(@Param("o_no")String o_no);

    boolean delOrderDetail(@Param("o_id")int o_id);

    Order selectOid(@Param("o_no")String o_no);
}
