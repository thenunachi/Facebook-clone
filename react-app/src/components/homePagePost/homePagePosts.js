import { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory,Link } from "react-router-dom";
import "./homepage.css"
import { getAllPostsThunk } from '../../store/postReducer'

import { loadPostCommentsThunk, loadUserComments,getAllCommentsThunk } from '../../store/commentReducer'
function AllPosts() {
    const dispatch = useDispatch()
    const history = useHistory();



    const postArr = useSelector(state => Object.values(state.postState))
const commentArr = useSelector(state=> Object.values(state.commentState))
console.log(commentArr,"CommentArr")
    //const postArr = Object.values(postObj.allPosts)
    //console.log("POSTARR", postArr)
    // console.log("postObj",postObj)
    const user = useSelector(state => state.session.user)
    //console.log("postObj",postObj.allPosts)
    useEffect(async() => {
       const {posts} = await dispatch(getAllPostsThunk())
       console.log(posts,"")
       posts.forEach((e)=> dispatch(getAllCommentsThunk(e.id)))

    }, [dispatch])

    return (
        <div>
            <div className="postdiv">
                {
                    postArr.map((post, idx) => {
                        // console.log(post, "INside the forEach post method")
                        // console.log(post.longText, "Longtext")
                        return (
                            <div className="singlepost">
                                 {/* <div className="perPost">{post.longText} */}
                                <div className="perPost">
                                {/* {post.longText} */}
                                <Link to={`/users/${user.id}/posts`}>{post.longText}</Link>

                                    {/* <Link key={post.longText} to={`/users/${user.id}/posts`}/> */}
                               
                                </div>
                            {/* {dispatch(loadPostCommentsThunk(post.id))} */}
                            <div className="singleComment"> {commentArr.map((comment)=>{
                               console.log(comment,"comment insided nested func")
                               return(<div className="perComment">{comment.commentText}</div>)
                                    
                                
                            })
                                }</div>
                            </div>
                            
                        )


                    })}

            </div>

        </div>
    )



}
export default AllPosts