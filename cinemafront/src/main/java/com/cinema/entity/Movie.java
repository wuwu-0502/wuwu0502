package com.cinema.entity;

import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

/**
 * @program: cinemamanage
 * @create: 2019-08-16 19:38
 * @author: hou
 * @description:
 **/
@Repository
public class Movie {
    private int m_id;
    private String m_name;
    private String m_director;
    private String m_player;
    private String m_tip;
    private String m_sort;
    private String m_address;
    private String m_languge;
    private int m_time;
    private int m_flag;
    private String m_img;
    private MultipartFile file;
    private String c_score;

    public Movie(){}

    public int getM_id() {
        return m_id;
    }

    public void setM_id(int m_id) {
        this.m_id = m_id;
    }

    public String getM_name() {
        return m_name;
    }

    public void setM_name(String m_name) {
        this.m_name = m_name;
    }

    public String getM_director() {
        return m_director;
    }

    public void setM_director(String m_director) {
        this.m_director = m_director;
    }

    public String getM_player() {
        return m_player;
    }

    public void setM_player(String m_player) {
        this.m_player = m_player;
    }

    public String getM_tip() {
        return m_tip;
    }

    public void setM_tip(String m_tip) {
        this.m_tip = m_tip;
    }

    public String getM_sort() {
        return m_sort;
    }

    public void setM_sort(String m_sort) {
        this.m_sort = m_sort;
    }

    public String getM_address() {
        return m_address;
    }

    public void setM_address(String m_address) {
        this.m_address = m_address;
    }

    public String getM_languge() {
        return m_languge;
    }

    public void setM_languge(String m_languge) {
        this.m_languge = m_languge;
    }

    public int getM_time() {
        return m_time;
    }

    public void setM_time(int m_time) {
        this.m_time = m_time;
    }

    public int getM_flag() {
        return m_flag;
    }

    public void setM_flag(int m_flag) {
        this.m_flag = m_flag;
    }

    public String getM_img() {
        return m_img;
    }

    public void setM_img(String m_img) {
        this.m_img = m_img;
    }

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }

    public String getC_score() {
        return c_score;
    }

    public void setC_score(String c_score) {
        this.c_score = c_score;
    }

    @Override
    public String toString() {
        return "Movie{" +
                "m_id=" + m_id +
                ", m_name='" + m_name + '\'' +
                ", m_director='" + m_director + '\'' +
                ", m_player='" + m_player + '\'' +
                ", m_tip='" + m_tip + '\'' +
                ", m_sort='" + m_sort + '\'' +
                ", m_address='" + m_address + '\'' +
                ", m_languge='" + m_languge + '\'' +
                ", m_time=" + m_time +
                ", m_flag=" + m_flag +
                ", m_img='" + m_img + '\'' +
                ", file=" + file +
                ", c_score='" + c_score + '\'' +
                '}';
    }
}
