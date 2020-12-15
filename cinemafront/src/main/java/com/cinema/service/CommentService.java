package com.cinema.service;


import com.cinema.entity.Comment;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;

import java.util.List;


public interface CommentService {

    List<Comment> getAllComments(int m_id);

    boolean addCommet(@Param("comment") Comment comment);

}
