package com.cinema.entity;

import java.sql.Date;

/**
 * @program: cinemafront
 * @description:
 * @author: Sea
 * @create: 2019-08-20 14:20
 **/
public class User {
    private int u_id;
    private String u_name;
    private String u_pwd;
    private String u_sex;
    private String u_phone;
    private String u_email;
    private String u_qus;
    private String u_anw;
    private Date u_time;
    private int u_role;
    private int u_static;

    public User() {
    }

    public User(String u_name, String u_pwd, String u_sex, String u_phone, String u_email, String u_qus, String u_anw, Date u_time) {
        this.u_name = u_name;
        this.u_pwd = u_pwd;
        this.u_sex = u_sex;
        this.u_phone = u_phone;
        this.u_email = u_email;
        this.u_qus = u_qus;
        this.u_anw = u_anw;
        this.u_time = u_time;
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

    public String getU_pwd() {
        return u_pwd;
    }

    public void setU_pwd(String u_pwd) {
        this.u_pwd = u_pwd;
    }

    public String getU_sex() {
        return u_sex;
    }

    public void setU_sex(String u_sex) {
        this.u_sex = u_sex;
    }

    public String getU_phone() {
        return u_phone;
    }

    public void setU_phone(String u_phone) {
        this.u_phone = u_phone;
    }

    public String getU_email() {
        return u_email;
    }

    public void setU_email(String u_email) {
        this.u_email = u_email;
    }

    public String getU_qus() {
        return u_qus;
    }

    public void setU_qus(String u_qus) {
        this.u_qus = u_qus;
    }

    public String getU_anw() {
        return u_anw;
    }

    public void setU_anw(String u_anw) {
        this.u_anw = u_anw;
    }

    public Date getU_time() {
        return u_time;
    }

    public void setU_time(Date u_time) {
        this.u_time = u_time;
    }

    public int getU_role() {
        return u_role;
    }

    public void setU_role(int u_role) {
        this.u_role = u_role;
    }

    public int getU_static() {
        return u_static;
    }

    public void setU_static(int u_static) {
        this.u_static = u_static;
    }

    @Override
    public String toString() {
        return "User{" +
                "u_id=" + u_id +
                ", u_name='" + u_name + '\'' +
                ", u_pwd='" + u_pwd + '\'' +
                ", u_sex='" + u_sex + '\'' +
                ", u_phone='" + u_phone + '\'' +
                ", u_email='" + u_email + '\'' +
                ", u_qus='" + u_qus + '\'' +
                ", u_anw='" + u_anw + '\'' +
                ", u_time=" + u_time +
                ", u_role=" + u_role +
                ", u_static=" + u_static +
                '}';
    }
}
