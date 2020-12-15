package com.cinema.controller;

import com.cinema.entity.Movie;
import com.cinema.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.UnsupportedEncodingException;
import java.util.List;

/**
 * @program: cinemafront
 * @create: 2019-08-20 13:38
 * @author: hou
 * @description:
 **/
@Controller
@RequestMapping("/movie")
public class MovieController {

    @Autowired
    private MovieService ms;

    //得到電影的排行列表
//    @RequestMapping("/sort")
//    @ResponseBody
//    public List<Movie> getSort(){
//
//        List<Movie> movieSort = ms.getMovieSort();
//        if (movieSort != null) return movieSort;
//        return null;
//    }

    @RequestMapping("/sort")
    @ResponseBody
    public List<Movie> getSort(){

        List<Movie> movieSort = ms.getMovieSort();
        if (movieSort != null) return movieSort;
        return null;
    }

    //得到電影的即将上映的列表
    @RequestMapping("/upcome1")
    @ResponseBody
    public List<Movie> getupcome(){

        List<Movie> movieSort = ms.getUpMovie();
        if (movieSort != null) return movieSort;
        return null;
    }

    //搜索电影列表
    @RequestMapping("/search")
    public ModelAndView search(HttpServletRequest request, HttpSession session)  {
        String s = request.getParameter("mvTopSearch");
        ModelAndView mav = new ModelAndView();

        List<Movie> movieSort = ms.searchMovie(s);

        session.setAttribute("searchMovie",movieSort);
        mav.setViewName("redirect:../search.jsp");
        return mav;
    }

    @RequestMapping("/detail")
    public ModelAndView detail(int mvId, HttpSession session)  {
        ModelAndView mav = new ModelAndView();

        Movie movieSort = ms.detaileMovie(mvId);

        session.setAttribute("detailMovie",movieSort);
        mav.setViewName("redirect:../detail.jsp");
        return mav;
    }
}
