package com.cinema.service;

import com.cinema.entity.Movie;

import java.util.List;

/**
 * @program: cinemafront
 * @create: 2019-08-20 15:04
 * @author: hou
 * @description:
 **/
public interface MovieService {

    List<Movie> getMovieSort();

    List<Movie> getUpMovie();

    List<Movie> searchMovie(String m_name);

    Movie detaileMovie(int m_id);
}
