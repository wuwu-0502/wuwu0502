package com.cinema.service.impl;

import com.cinema.dao.MovieMapper;
import com.cinema.entity.Movie;
import com.cinema.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @program: cinemafront
 * @create: 2019-08-20 15:05
 * @author: hou
 * @description:
 **/
@Service
public class MovieServiceImpl implements MovieService {

    @Autowired
    private MovieMapper mm;

    //得到排序的所有電影集合
    @Override
    public List<Movie> getMovieSort() {
        return mm.getSort();
    }

    //得到電影的即将上映的列表
    @Override
    public List<Movie> getUpMovie() {
        return mm.getUp();
    }

    //搜索
    @Override
    public List<Movie> searchMovie(String m_name) {
        return mm.search(m_name);
    }

    //获取全部电影信息，详情
    @Override
    public Movie detaileMovie(int m_id) {
        return mm.detail(m_id);
    }

}
