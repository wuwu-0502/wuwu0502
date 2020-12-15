package com.cinema.dao;

import com.cinema.entity.Movie;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @program: cinemafront
 * @create: 2019-08-20 14:45
 * @author: hou
 * @description:
 **/
@Repository
public interface MovieMapper {

    //得到电影排行列表
    List<Movie> getSort();

    //得到电影即将上映列表
    List<Movie> getUp();

    //按名称搜索
    List<Movie> search(@Param("m_name") String m_name);

    //详情电影
    Movie detail(@Param("m_id")int m_id);
}
