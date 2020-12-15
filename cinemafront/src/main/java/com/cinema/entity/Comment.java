package com.cinema.entity;

/**
 * @author:YTZ
 * @date:2019/8/19 10:39
 * @description:
 */
public class Comment {
    private int c_id;
    private int u_id;
    private int m_id;
    private String c_word;
    private double c_score;
    private String c_date;
    private String u_name;
    private String m_name;

    public int getC_id() {
        return c_id;
    }

    public void setC_id(int c_id) {
        this.c_id = c_id;
    }

    public int getM_id() {
        return m_id;
    }

    public void setM_id(int m_id) {
        this.m_id = m_id;
    }

    public String getC_word() {
        return c_word;
    }

    public void setC_word(String c_word) {
        this.c_word = c_word;
    }

    public double getC_score() {
        return c_score;
    }

    public void setC_score(double c_score) {
        this.c_score = c_score;
    }

    public String getC_date() {
        return c_date;
    }

    public void setC_date(String c_date) {
        this.c_date = c_date;
    }

    public int getU_id() {
        return u_id;
    }

    public void setU_id(int u_id) {
        this.u_id = u_id;
    }

    public String getU_name() {
        return u_name;
    }

    public void setU_name(String u_name) {
        this.u_name = u_name;
    }

    public String getM_name() {
        return m_name;
    }

    public void setM_name(String m_name) {
        this.m_name = m_name;
    }

    @Override
    public String toString() {
        return "Comment{" +
                "c_id=" + c_id +
                ", u_id=" + u_id +
                ", m_id=" + m_id +
                ", c_word='" + c_word + '\'' +
                ", c_score='" + c_score + '\'' +
                ", c_date='" + c_date + '\'' +
                ", u_name='" + u_name + '\'' +
                ", m_name='" + m_name + '\'' +
                '}';
    }
}
