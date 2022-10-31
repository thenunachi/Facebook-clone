import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

import { deleteCommentThunk, loadPostCommentsThunk, updateCommentThunk, createCommentThunk } from '../../store/commentReducer'
import { getAllPostsThunk, getPostsByUserIdThunk, removePostThunk, updatePostThunk,createPostThunk } from "../../store/postReducer";



export const UserSpotDetail = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  let { userId } = useParams();


  let allPosts = useSelector(state => {
    console.log("$$$$$$$$$$$$$$$$$$$", state.postState)
    return Object.values(state.postState)
  });
  console.log("$$$$$$$$$$$$$$$$$$$", allPosts)

  // console.log(postIdKeys,"POSTIDKEYS")
  let allComments = useSelector(state => Object.values(state.commentState))
  console.log(allComments, "ALLCOMMENTS")//this works
  let user = useSelector(state => state.session.user)
  // let ids = postId(allPosts)
  useEffect(async () => {
    const { posts } = await dispatch(getPostsByUserIdThunk(userId))//destructured because it had post key inside it
    console.log(posts)
    posts.forEach((e) => dispatch(loadPostCommentsThunk(e.id)))
    // dispatch((allPosts.map((e)=>loadPostCommentsThunk(e.id))))
  }, dispatch)

  return (
    <div>
      <div className="allposts">{
        allPosts.map((element) => {

          console.log(element, "%%%%%%%%%%%%%%%%%%%ELEMENT OF ALLPOST MAP FUNC")
          return (
            <div>{element.longText
            
            }
           
              {
                <button className="deletePostButton" onClick={async (event) => {
                event.preventDefault()
                console.log(event,"Event &&&&&&&")
                console.log(element.id,"ID of element &&&&ID&&&&&")
                await dispatch(removePostThunk(element.id))
                //await dispatch(dispatch(loadPostCommentsThunk(postId)))
              }}>
                Delete Post

              </button>}

              {
                <button className="editPostButton" onClick={async (event) => {
                  // event.preventDefault()
                  await dispatch(updatePostThunk(element))
                }}>Edit Post
                  {/* 
                                */}
                </button>
              }
              {
                  <button className="createPostButton" onClick={async (event) => {
                    event.preventDefault()
                    await dispatch(createPostThunk(element))
                  }}>Create Post</button>
                }

            </div>


          )
        })
      }




      </div>
      <div className="commentsDiv">{
        allComments.map((element) => {
          console.log(element, "dfdsagfdgfdafdsfdsafdsfasdfdsfdasf")
          return (
            <div className="eachcomment">
              {element.commentText}
              {<button className="deleteCommentButton" onClick={async (event) => {
                event.preventDefault()
                await dispatch(deleteCommentThunk(element.id))
                //await dispatch(dispatch(loadPostCommentsThunk(postId)))
              }}>
                Delete Comment

              </button>}
            </div>




          )
        })
      }

        <span className="editComment">{
          allComments.map((element) => {
            console.log(element, "INSIDE EDITCOMMENT ELEMENT")

            return (

              <div className="editEachcomment">
                {
                  <button className="editCommentButton" onClick={async (event) => {
                    // event.preventDefault()
                    await dispatch(updateCommentThunk(element))
                  }}>Edit Comment
                    {/* 
                                */}
                  </button>
                }

              </div>
            )
          })
        }


        </span>
        <span className="createComment">{
          allComments.map((element) => {
            return (
              <div className="createEachcomment">
                {
                  <button className="createCommentButton" onClick={async (event) => {
                    event.preventDefault()
                    await dispatch(createCommentThunk(element))
                  }}>Create Comment</button>
                }

              </div>
            )
          })
        }
        </span>
      </div>


    </div>
  )





}