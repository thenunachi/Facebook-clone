import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

import { deleteCommentThunk, loadPostCommentsThunk, updateCommentThunk, createCommentThunk } from '../../store/commentReducer'
import { getAllPostsThunk, getPostsByUserIdThunk, removePostThunk, updatePostThunk, createPostThunk } from "../../store/postReducer";

import './userPostdetail.css'
import AddPostModal from "./createPostModal";
import UpdatePostModal from "./updatePostModal";

export const UserSpotDetail = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  let { userId } = useParams();


  let allPosts = useSelector(state => {
    //console.log("$$$$$$$$$$$$$$$$$$$", state.postState)
    return Object.values(state.postState)
  });
  //console.log("$$$$$$$$$$$$$$$$$$$", allPosts)

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
          {/* <i class="fa-solid fa-user"></i> */}
          <div className="innerDiv">

            {<AddPostModal />}
          </div>
        </div>
        <div className="allposts">{
          allPosts.map((element) => {

            console.log(element, "%%%%%%%%%%%%%%%%%%%ELEMENT OF ALLPOST MAP FUNC")
            return (
              <div className="eachPost">{element.longText

              }

                {
                  <button className="deletePostButton" onClick={async (event) => {
                    event.preventDefault()
                    console.log(event, "Event &&&&&&&")
                    console.log(element.id, "ID of element &&&&ID&&&&&")
                    await dispatch(removePostThunk(element.id))
                    //await dispatch(dispatch(loadPostCommentsThunk(postId)))
                  }}>
                    Delete Post

                  </button>}

                {
                  <button className="editPostButton" onClick={async (event) => {
                     event.preventDefault()
                    await dispatch(updatePostThunk(element))
                  }}>{<UpdatePostModal />}
                  
                  </button>
                }
                {
                  <button className="createPostButton" onClick={async (event) => {
                    event.preventDefault()
                    await dispatch(createPostThunk(element))
                  }}>Create Post</button>
                }
                <div className="commentsDiv">{
                  allComments.map((element) => {
                    console.log(element, "dfdsagfdgfdafdsfdsafdsfasdfdsfdasf")
                    return (
                      <div className="eachcomment">
                        <div className="trashbuttons">
                          {<span className="common-button">
                            <button className="deleteCommentButton" onClick={async (event) => {
                              event.preventDefault()
                              await dispatch(deleteCommentThunk(element.id))
                              //await dispatch(dispatch(loadPostCommentsThunk(postId)))
                            }}>
                              <i class="fa-solid fa-trash"></i>

                            </button>
                          </span>}

                          <div className="editEachcomment">
                            {<span>
                              <button className="editCommentButton" onClick={async (event) => {
                                // event.preventDefault()
                                await dispatch(updateCommentThunk(element))
                              }}><i class="fa-solid fa-pen-to-square"></i>

                                {/* 
                                */}
                              </button>
                            </span>
                            }

                          </div>
                        </div>
                        <div>{element.commentText}</div>



                      </div>


                    )
                  })
                }

                  <span className="editComment">{
                    allComments.map((element) => {
                      console.log(element, "INSIDE EDITCOMMENT ELEMENT")

                      // return (

                      //   <div className="editEachcomment">
                      //     {
                      //       <button className="editCommentButton" onClick={async (event) => {
                      //         // event.preventDefault()
                      //         await dispatch(updateCommentThunk(element))
                      //       }}><i class="fa-solid fa-pen-to-square"></i>

                      //         {/* 
                      //                     */}
                      //       </button>
                      //     }

                      //   </div>
                      // )
                    })
                  }


                  </span>
                  {/* <span className="createComment">{
                    allComments.map((element) => {
                      return (
                        <div className="createEachcomment"> Write a comment...
                          {
                            <button className="createCommentButton" onClick={async (event) => {
                              event.preventDefault()
                              await dispatch(createCommentThunk(element))
                            }}>





                              <i class="fa-regular fa-send-backward"></i>
                            </button>
                          }

                        </div>
                      )
                    })
                  }
                  </span> */}
                </div>
                <div className="createComment">{
                  // allComments.map((element) => {
                  // return (
                  <div className="createEachcomment"> Write a comment...
                    {
                      <button className="createCommentButton" onClick={async (event) => {
                        event.preventDefault()
                        await dispatch(createCommentThunk(element))
                      }}>





                        {/* <i class="fa fa-envelope" aria-hidden="true"></i> */}
                        <i class="fa-solid fa-paper-plane"></i>
                      </button>
                    }

                  </div>
                  // )
                  // })
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