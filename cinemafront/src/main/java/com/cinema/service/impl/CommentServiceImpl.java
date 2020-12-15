package com.cinema.service.impl;

import com.cinema.dao.CommentMapper;
import com.cinema.entity.Comment;
import com.cinema.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author:YTZ
 * @date:2019/8/19 10:39
 * @description:
 */

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentMapper cm;

    @Override
    public List<Comment> getAllComments(int m_id) {

        return cm.getAllComments(m_id);
    }

    @Override
    public boolean addCommet(Comment comment) {
        return cm.addComment(comment);
    }

}
