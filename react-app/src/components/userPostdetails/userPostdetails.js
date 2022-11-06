import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

import { deleteCommentThunk,getAllCommentsThunk, loadPostCommentsThunk, updateCommentThunk, createCommentThunk } from '../../store/commentReducer'
import { getAllPostsThunk, getPostsByUserIdThunk, removePostThunk, updatePostThunk, createPostThunk } from "../../store/postReducer";

import chat from './chat.png'
import posticon from './posticon.png'
import './userPostdetail.css'
import AddPostModal from "./createPostModal";
import UpdatePostModal from "./updatePostModal";
import AddCommentModal from "./createcommentmodal";
import UpdatecommentModal from './updateCommentModal'
export const UserSpotDetail = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  let { userId } = useParams();


  let allPosts = useSelector(state => {
    //console.log("$$$$$$$$$$$$$$$$$$$", state.postState)
    return Object.values(state.postState)
  });


  // console.log(postIdKeys,"POSTIDKEYS")
  let allComments = useSelector(state => Object.values(state.commentState))
  console.log(allComments, "ALLCOMMENTS")//this works
 
  let user = useSelector(state => state.session.user)
  // let ids = postId(allPosts)
  useEffect(async () => {
    const { posts } = await dispatch(getPostsByUserIdThunk(userId))//destructured because it had post key inside it
    // console.log(posts)
    posts.forEach((e) => dispatch(getAllCommentsThunk(e.id)))
    // dispatch((allPosts.map((e)=>loadPostCommentsThunk(e.id))))
  }, dispatch)

  return (
    <div>
      <h1 className="personal">Welcome to {user.username}'s profile page </h1>
      {/* <div className="left">

        <div className="house">
          <i class="fa-solid fa-house"></i> Lives in Seattle </div>
        <div className="location"> <i class="fa-solid fa-location-dot"></i>   From India</div>
        <div className="heart"><i class="fa-solid fa-heart"></i> Married</div>
        <div className="clock"> <i class="fa-solid fa-clock"></i> Joined on September 2015</div>
      </div> */}
      <div className="right">
        <div className="addPost">
               <div className="innerDiv">

            {<AddPostModal />}
          </div>
        </div>
        <div className="allposts">{
          allPosts.map((post) => {
            console.log(post, "post details")
            // console.log(element, "%%%%%%%%%%%%%%%%%%%ELEMENT OF ALLPOST MAP FUNC")
            return (
              <div className="eachPost"> 
              <span className="separateDiv">
              {post.owner.username}:
              {isUserPostOwner(post,user)&&
                  <button className="deletePostButton" onClick={async (event) => {
                    event.preventDefault()
                
                    await dispatch(removePostThunk(post.id))
                    await dispatch((getPostsByUserIdThunk(userId)))
                  }}>
                    Delete Post

                  </button>}

                {isUserPostOwner(post,user)&&
                  <UpdatePostModal post={post} />

                }
              </span>
              
              <img className="posticon" src={posticon} /> {post.longText}
               {/* <div>{post.owner.username}</div> */}
                
                
                <div className="commentsDiv">{
                  allComments.map((element) => {
                    
                   console.log(element,"details of comments")
                    return ((element.post_Id == post.id)&&
                      <div className="eachcomment">
                        <div className="trashbuttons">
                          <span className="commentUser">
                        {element.users.username}:
                        </span>
                          {<span className="common-button">
                            <button className="deleteCommentButton" onClick={async (event) => {
                              event.preventDefault()
                              await dispatch(deleteCommentThunk(element.id))
                              await dispatch((loadPostCommentsThunk(element.post_Id)))
                              //  return history.push(`/posts`)
                            }}>
                              <i class="fa-solid fa-trash"></i>

                            </button>
                          </span>}

                          <div className="editEachcomment">
                            {
                              <span>
                               
                                <UpdatecommentModal comment={element} />
                              </span>
                            }

                          </div>
                        </div>
                        <div className="tab">
                          <span><img className="chat" src={chat} /></span>
                          <span>
                            {/* <i class="fa-brands fa-rocketchat"></i> */}
                            {element.commentText}</span>
                          </div>

                      </div>

                    )
                  })
                }

              
                </div>
                <div className="createComment">{
                 
                  <div className="createEachcomment">
                    {
                      <div>
                        <AddCommentModal postId={post.id} />
                      </div>
                    }

                  </div>
                  
                }
                </div>
              </div>
            )

          })

        }

        </div>


      </div>
    </div >
  )





}
const isUserPostOwner = (post, user) => post && user && post.owner_Id == user.id 
const isUserCommentOwner = (comment,user) => comment && user && comment.user_Id == user.id
// const commentsPerPost = (comment,post)=> post  && comment.post_Id == post.id