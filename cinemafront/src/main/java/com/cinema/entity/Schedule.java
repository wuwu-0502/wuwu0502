package com.cinema.entity;


/**
 * @author:YTZ
 * @date:2019/8/16 16:54
 * @description:
 */
public class Schedule {

    private int s_id;
    private int m_id;
    private int h_id;
    private String s_data;
    private String s_starttime;
    private String s_endtime;
    private String s_language;
    private double s_price;
    private String m_name;
    private String h_name;
    private String h_empty;
    private int h_row;
    private int h_column;
    private String s_seatuse;


    public String getM_name() {
        return m_name;
    }

    public void setM_name(String m_name) {
        this.m_name = m_name;
    }

    public String getH_name() {
        return h_name;
    }

    public void setH_name(String h_name) {
        this.h_name = h_name;
    }

    public int getS_id() {
        return s_id;
    }

    public void setS_id(int s_id) {
        this.s_id = s_id;
    }

    public int getM_id() {
        return m_id;
    }

    public void setM_id(int m_id) {
        this.m_id = m_id;
    }

    public int getH_id() {
        return h_id;
    }

    public void setH_id(int h_id) {
        this.h_id = h_id;
    }

    public String getS_data() {
        return s_data;
    }

    public void setS_data(String s_data) {
        this.s_data = s_data;
    }

    public String getS_starttime() {
        return s_starttime;
    }

    public void setS_starttime(String s_starttime) {
        this.s_starttime = s_starttime;
    }

    public String getS_endtime() {
        return s_endtime;
    }

    public void setS_endtime(String s_endtime) {
        this.s_endtime = s_endtime;
    }

    public String getS_language() {
        return s_language;
    }

    public void setS_language(String s_language) {
        this.s_language = s_language;
    }

    public double getS_price() {
        return s_price;
    }

    public void setS_price(double s_price) {
        this.s_price = s_price;
    }

    public String getH_empty() {
        return h_empty;
    }

    public void setH_empty(String h_empty) {
        this.h_empty = h_empty;
    }

    public int getH_row() {
        return h_row;
    }

    public void setH_row(int h_row) {
        this.h_row = h_row;
    }

    public int getH_column() {
        return h_column;
    }

    public void setH_column(int h_column) {
        this.h_column = h_column;
    }

    public String getS_seatuse() {
        return s_seatuse;
    }

    public void setS_seatuse(String s_seatuse) {
        this.s_seatuse = s_seatuse;
    }

    @Override
    public String toString() {
        return "Schedule{" +
                "s_id=" + s_id +
                ", m_id=" + m_id +
                ", h_id=" + h_id +
                ", s_data='" + s_data + '\'' +
                ", s_starttime='" + s_starttime + '\'' +
                ", s_endtime='" + s_endtime + '\'' +
                ", s_language='" + s_language + '\'' +
                ", s_price=" + s_price +
                ", m_name='" + m_name + '\'' +
                ", h_name='" + h_name + '\'' +
                ", h_empty='" + h_empty + '\'' +
                ", h_row=" + h_row +
                ", h_column=" + h_column +
                ", s_seatuse='" + s_seatuse + '\'' +
                '}';
    }
}
