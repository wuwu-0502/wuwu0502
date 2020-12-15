package com.cinema.entity;

public class Order {
    private int o_id;
    private int h_id;
    private int m_id;
    private int p_id;
    private int s_id;
    private int o_status;
    private String o_subtime;
    private String o_paytime;
    private String m_name;
    private String h_name;
    private double od_price;
    private String od_seat;
    private String o_no;
    private String s_data;

    public Order() {
    }

    public Order(String o_no,int o_status, String o_subtime) {
        this.o_no = o_no;
        this.o_status = o_status;
        this.o_subtime = o_subtime;
    }

    public String getH_name() {
        return h_name;
    }

    public void setH_name(String h_name) {
        this.h_name = h_name;
    }

    public String getM_name() {
        return m_name;
    }

    public void setM_name(String m_name) {
        this.m_name = m_name;
    }

    public int getO_id() {
        return o_id;
    }

    public void setO_id(int o_id) {
        this.o_id = o_id;
    }

    public int getH_id() {
        return h_id;
    }

    public void setH_id(int h_id) {
        this.h_id = h_id;
    }

    public int getM_id() {
        return m_id;
    }

    public void setM_id(int m_id) {
        this.m_id = m_id;
    }

    public int getP_id() {
        return p_id;
    }

    public void setP_id(int p_id) {
        this.p_id = p_id;
    }

    public int getS_id() {
        return s_id;
    }

    public void setS_id(int s_id) {
        this.s_id = s_id;
    }

    public int getO_status() {
        return o_status;
    }

    public void setO_status(int o_status) {
        this.o_status = o_status;
    }

    public String getO_subtime() {
        return o_subtime;
    }

    public void setO_subtime(String o_subtime) {
        this.o_subtime = o_subtime;
    }

    public String getO_paytime() {
        return o_paytime;
    }

    public void setO_paytime(String o_paytime) {
        this.o_paytime = o_paytime;
    }

    public double getOd_price() {
        return od_price;
    }

    public void setOd_price(double od_price) {
        this.od_price = od_price;
    }

    public String getOd_seat() {
        return od_seat;
    }

    public void setOd_seat(String od_seat) {
        this.od_seat = od_seat;
    }

    public String getO_no() {
        return o_no;
    }

    public void setO_no(String o_no) {
        this.o_no = o_no;
    }

    public String getS_data() {
        return s_data;
    }

    public void setS_data(String s_data) {
        this.s_data = s_data;
    }


    @Override
    public String toString() {
        return "Order{" +
                "o_id=" + o_id +
                ", h_id=" + h_id +
                ", m_id=" + m_id +
                ", p_id=" + p_id +
                ", s_id=" + s_id +
                ", o_status=" + o_status +
                ", o_subtime='" + o_subtime + '\'' +
                ", o_paytime='" + o_paytime + '\'' +
                ", m_name='" + m_name + '\'' +
                ", h_name='" + h_name + '\'' +
                ", od_price=" + od_price +
                ", od_seat='" + od_seat + '\'' +
                ", o_no='" + o_no + '\'' +
                ", s_data='" + s_data + '\'' +
                '}';
    }
}

