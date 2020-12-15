package com.cinema.entity;

/**
 * @program: cinemafront
 * @description:
 * @author: Sea
 * @create: 2019-08-23 16:37
 **/
public class Orderdetail {
    private int od_id;
    private int h_id;
    private int m_id;
    private int u_id;
    private int s_id;
    private Double od_price;
    private String od_seat;

    public Orderdetail() {
    }

    public Orderdetail(int h_id, int m_id, int u_id, int s_id, Double od_price, String od_seat) {
        this.h_id = h_id;
        this.m_id = m_id;
        this.u_id = u_id;
        this.s_id = s_id;
        this.od_price = od_price;
        this.od_seat = od_seat;
    }

    public int getOd_id() {
        return od_id;
    }

    public void setOd_id(int od_id) {
        this.od_id = od_id;
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

    public int getU_id() {
        return u_id;
    }

    public void setU_id(int u_id) {
        this.u_id = u_id;
    }

    public int getS_id() {
        return s_id;
    }

    public void setS_id(int s_id) {
        this.s_id = s_id;
    }

    public Double getOd_price() {
        return od_price;
    }

    public void setOd_price(Double od_price) {
        this.od_price = od_price;
    }

    public String getOd_seat() {
        return od_seat;
    }

    public void setOd_seat(String od_seat) {
        this.od_seat = od_seat;
    }

    @Override
    public String toString() {
        return "Orderdetail{" +
                "od_id=" + od_id +
                ", h_id=" + h_id +
                ", m_id=" + m_id +
                ", u_id=" + u_id +
                ", s_id=" + s_id +
                ", od_price=" + od_price +
                ", od_seat='" + od_seat + '\'' +
                '}';
    }
}
