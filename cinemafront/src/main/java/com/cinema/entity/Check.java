package com.cinema.entity;

/**
 * @program: cinemafront
 * @description:
 * @author: Sea
 * @create: 2019-08-23 13:51
 **/
public class Check {
    private String o_no;
    private String od_seat;
    private Double od_price;
    private String s_seatuse;
    private String thisuse;

    public Check() {
    }

    public Check(String o_no, String od_seat, Double od_price, String s_seatuse, String thisuse) {
        this.o_no = o_no;
        this.od_seat = od_seat;
        this.od_price = od_price;
        this.s_seatuse = s_seatuse;
        this.thisuse = thisuse;
    }

    public String getO_no() {
        return o_no;
    }

    public void setO_no(String o_no) {
        this.o_no = o_no;
    }

    public String getOd_seat() {
        return od_seat;
    }

    public void setOd_seat(String od_seat) {
        this.od_seat = od_seat;
    }

    public Double getOd_price() {
        return od_price;
    }

    public void setOd_price(Double od_price) {
        this.od_price = od_price;
    }

    public String getS_seatuse() {
        return s_seatuse;
    }

    public void setS_seatuse(String s_seatuse) {
        this.s_seatuse = s_seatuse;
    }

    public String getThisuse() {
        return thisuse;
    }

    public void setThisuse(String thisuse) {
        this.thisuse = thisuse;
    }

    @Override
    public String toString() {
        return "Check{" +
                "o_no='" + o_no + '\'' +
                ", od_seat='" + od_seat + '\'' +
                ", od_price=" + od_price +
                ", s_seatuse='" + s_seatuse + '\'' +
                ", thisuse='" + thisuse + '\'' +
                '}';
    }
}
