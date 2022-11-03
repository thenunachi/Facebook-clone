import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

import { deleteCommentThunk, loadPostCommentsThunk, updateCommentThunk, createCommentThunk } from '../../store/commentReducer'
import { getAllPostsThunk, getPostsByUserIdThunk, removePostThunk, updatePostThunk, createPostThunk } from "../../store/postReducer";

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
  //console.log(allComments, "ALLCOMMENTS")//this works
  let user = useSelector(state => state.session.user)
  // let ids = postId(allPosts)
  useEffect(async () => {
    const { posts } = await dispatch(getPostsByUserIdThunk(userId))//destructured because it had post key inside it
    // console.log(posts)
    posts.forEach((e) => dispatch(loadPostCommentsThunk(e.id)))
    // dispatch((allPosts.map((e)=>loadPostCommentsThunk(e.id))))
  }, dispatch)

  return (
    <div>
      <div className="left">

        <div className="house">
          <i class="fa-solid fa-house"></i> Lives in Seattle </div>
        <div className="location"> <i class="fa-solid fa-location-dot"></i>   From India</div>
        <div className="heart"><i class="fa-solid fa-heart"></i> Married</div>
        <div className="clock"> <i class="fa-solid fa-clock"></i> Joined on September 2015</div>
      </div>
      <div className="right">
        <div className="addPost">
               <div className="innerDiv">

            {<AddPostModal />}
          </div>
        </div>
        <div className="allposts">{
          allPosts.map((element) => {
            console.log(element.id, "FIND OUT ELEMENT ID OF POST")
            // console.log(element, "%%%%%%%%%%%%%%%%%%%ELEMENT OF ALLPOST MAP FUNC")
            return (
              <div className="eachPost">{element.longText}

                {
                  <button className="deletePostButton" onClick={async (event) => {
                    event.preventDefault()
                
                    await dispatch(removePostThunk(element.id))
                    await dispatch((getPostsByUserIdThunk(userId)))
                  }}>
                    Delete Post

                  </button>}

                {
                  <UpdatePostModal post={element} />

                }
                
                <div className="commentsDiv">{
                  allComments.map((element) => {
                    console.log(element, "Element id")
                    console.log(element.id, "FIND OUT ID OF COMMENTS")
                    console.log(element.post_Id, "Is post id logging")
                    // console.log(element, "dfdsagfdgfdafdsfdsafdsfasdfdsfdasf")
                    return (
                      <div className="eachcomment">
                        <div className="trashbuttons">
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
                        <div>{element.commentText}</div>

                      </div>

                    )
                  })
                }

              
                </div>
                <div className="createComment">{
                 
                  <div className="createEachcomment">
                    {
                      <div>
                        <AddCommentModal postId={element.id} />
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
const isUserPostOwner = (post, user) => post && user && post.owner_Id == user.id //