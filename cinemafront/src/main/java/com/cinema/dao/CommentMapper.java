package com.cinema.dao;


import com.cinema.entity.Comment;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentMapper {

    List<Comment> getAllComments(@Param("m_id") int m_id);
    boolean addComment(@Param("comment") Comment comment);

}
