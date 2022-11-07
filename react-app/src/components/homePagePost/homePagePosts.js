import { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory,Link } from "react-router-dom";
import "./homepage.css"
import { getAllPostsThunk } from '../../store/postReducer'
import chat from './chat.png'
import posticon from './posticon.png'
import { loadPostCommentsThunk, loadUserComments,getAllCommentsThunk,deleteCommentThunk } from '../../store/commentReducer'
import AddPostModal from '../userPostdetails/createPostModal.js'
import AddCommentModal from "../userPostdetails/createcommentmodal";
import UpdatecommentModal from "../userPostdetails/updateCommentModal";
import '../userPostdetails/createpostmodal.css'
import '../userPostdetails/updatepostmodal.css'
function AllPosts() {
    const dispatch = useDispatch()
    const history = useHistory();



    const postArr = useSelector(state => Object.values(state.postState))
const commentArr = useSelector(state=> Object.values(state.commentState))
console.log(commentArr,"CommentArr")
  
    const user = useSelector(state => state.session.user)
    
    useEffect(async() => {
       const {posts} = await dispatch(getAllPostsThunk())
       console.log(posts,"")
       posts.forEach((e)=> dispatch(getAllCommentsThunk(e.id)))

    }, [dispatch])

    return (
        <div>
            <h1 className="title">Welcome to {user.username}'s Home Page</h1>
            <div className="createpostDiv">
            <div className="addPost">
               <div className="innerDivPost">
             
            {<span>  
                {/* <img className="posticon" src={posticon} /> */}
            <AddPostModal />
            </span>}
          </div>
          </div>
          </div>
            <div className="postdiv">
                {
                    postArr.sort((a,b)=>b.id - a.id).map((post, idx) => {
                         console.log(post, "post details to know username")
                    
                        return (
                            <div className="singlepost">
                            {/* <img className="posticon" src={posticon} /> */}
                                <div className="perPost">
                        
                                <div className="user">{post.owner.username}:</div>
                                    <div className="posttext">
                                        <span> 
                                            <img className="posticon" src={posticon} />
                                             </span>
                                   
                                        <span>{post.longText}</span></div>
                                
                               
                                </div>
                         
                            <div className="singleComment"> {
                            commentArr.sort((a,b)=>b.id - a.id).map((comment)=>{
                               //console.log(comment,"comment insided nested func")
                               return((comment.post_Id == post.id) &&
                               <div className="perComment">
                                <span className="showButton">{comment.users.username}:
                                {(comment.user_Id ==user.id)&& deleteUpdateComment (comment,dispatch,history) }
                                </span>
 
                
                                <div className="commenttext">
                                <span><img className="chat" src={chat} />  </span>
                                <span>{comment.commentText} </span>
                              </div>
                                
                                </div>)
                                    
                                
                            })
                                }</div>

<div className="comment">
                    {
                      <div>
                        <AddCommentModal postId={post.id} />
                      </div>
                    }

                  </div>
                            </div>
                            
                        )


                    })}

            </div>

        </div>
    )



}
const deleteUpdateComment =(comment,dispatch,history)=>{
    return(
        <div>
    <span className="common-button">
    <button className="deleteCommentButton" onClick={async (event) => {
      event.preventDefault()
      await dispatch(deleteCommentThunk(comment.id))
      await dispatch((loadPostCommentsThunk(comment.post_Id)))
       return history.push(`/`)
    }}>
      <i class="fa-solid fa-trash"></i>

    </button>
  </span>

  <span className="editEachcomment">
    {
      <span>
       
        <UpdatecommentModal comment={comment} />
      </span>
    }

  </span>
  </div>);
};

export default AllPosts