package com.cinema.controller;

import com.cinema.entity.Comment;
import com.cinema.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * @author:YTZ
 * @date:2019/8/19 10:37
 * @description:
 */

@Controller
@RequestMapping("/cc")
public class CommentController {

    @Autowired
    public CommentService cs;

    @RequestMapping("/getallcs")
    @ResponseBody
    public List<Comment> getAllComment(HttpSession session,int m_id){

        List<Comment> comments=cs.getAllComments(m_id);
        session.setAttribute("comments",comments);
        return comments;
    }

    @RequestMapping("/addco")
    @ResponseBody
    public boolean addComment(Integer u_id,Integer m_id,Double c_score,String c_date,String c_word){

        Comment comment=new Comment();
        comment.setC_date(c_date);
        comment.setC_score(c_score);
        comment.setC_word(c_word);
        comment.setM_id(m_id);
        comment.setU_id(u_id);
        boolean s=cs.addCommet(comment);
        return s;
    }


}
