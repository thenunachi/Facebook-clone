/*******************************************TYPE*************************************************************************************** */
const GET_USER_COMMENTS = "Comments/getUserComment"
export const GET_POST_COMMENTS = "Comments/getPostComment"
export const CREATE_ONE = "Comments/createComment";
export const REMOVE_ONE = 'Comments/removeComment';
export const EDIT_COMMENT = "Comments/editComment";//updating a comment
export const GET_ALL_COMMENTS_PER_POST = "Comments/GET_ALL_COMMENTS_PER_POST"

/**********************************************ACTION************************************************************************************ */

 const getUserComment = (comments) => {
    return {
        type: GET_USER_COMMENTS,
        comments
    }
}


const getPostComment = (comments) => {
    return {
        type: GET_POST_COMMENTS,
        comments
    }
}
const createComment = (comment) => ({
    type: CREATE_ONE,
    comment
});
const removeComment = (id) => ({
    type: REMOVE_ONE,
    id
})
const editComment = (comment) => ({
    type: EDIT_COMMENT,
    comment
});

const getAllCommentforPost = (comment)=>({
    type:GET_ALL_COMMENTS_PER_POST,
    comment
})



/*********************************************************THUNK************************************************************************* */

//get all user's comments
export const loadUserComments = ()=>async dispatch =>{
    const response = await fetch("/api/comments/user")
    if (response.ok) {
        const data = await response.json()
        dispatch(getUserComment(data.Comments))
        return { ...data }
    }
}
//get all Post Thunk
export const loadPostCommentsThunk =(postId) =>async dispatch=>{
    const response = await fetch(`/api/posts/${postId}/comments`);
    if(response.ok){
        const data = await response.json();//promise coming from fetch and hold data from backend which is a list with dict in it
        dispatch(getPostComment(data.Comments))
        return {...data};
    }
  
}

//getallcommentsperpost
export const getAllCommentsThunk =(postId) =>async dispatch=>{
    const response = await fetch(`/api/posts/${postId}/comments`);
    if(response.ok){
        const data = await response.json();//promise coming from fetch and hold data from backend which is a list with dict in it
        dispatch(getAllCommentforPost(data.Comments))
        return {...data};
    }
  
}
//create a comment

export const createCommentThunk = (data)=>async dispatch =>{
// const {postId} = data
console.log(data.id,"DATA inside create thunk")
const response = await fetch(`/api/posts/${data.id}/comments`,{
    method:'POST',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify(data)
});
console.log(response,"response")
if(response.ok){
    const newComment = await response.json();
    dispatch(createComment(newComment))
    return newComment
}

}

//delete a comment

export const deleteCommentThunk = (commentId)=>async dispatch=>{
    const  response = await fetch(`/api/comments/${commentId}`,{
        method:'DELETE',

    });
    if (response.ok){
        //const {id} = await response.json();//destructuring only id from response
        dispatch(removeComment(commentId));
    }
}

//update a comment
export const updateCommentThunk = (data)=>async dispatch =>{
    console.log(data,"data of updatethunk")
    const {id} = data //3
    console.log("id inside update thunk",id)
    const response = await fetch(`/api/comments/${id}`,{
        method:'PUT',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    console.log(response,"response")
    if(response.ok){
        const updateComment = await response.json();
        console.log(updateComment,"UPDATECOMMENT")
        dispatch(editComment(updateComment))
        return updateComment
    }
    
    }



/**********************************************REDUCER************************************************************************************ */

const commentReducer =(state={},action) =>{
    console.log("ACTION",action)
switch (action.type){
    case GET_USER_COMMENTS:{
        const allCommnets ={}
        action.comments.forEach((comment)=>{
        allCommnets[comment.id] = comment //comment.id is the key and value is the whole comment obj
        })
        const  newState ={...state,allCommnets}
        return newState
    }
    case GET_POST_COMMENTS:{
        const newState ={};
     console.log("comments shape",action.comments)
        action.comments.forEach((comment)=>(newState[comment.id]=comment))
        console.log(newState,"newstate of comments")
        return {...state,...newState};
 
    }

    case GET_ALL_COMMENTS_PER_POST:{
        const newState ={};
        
           action.comment.forEach((comment)=>(newState[comment.id]=comment))
          
           return {...state,...newState};
    }
    case CREATE_ONE:{
        const newState={};
        newState[action.comment.id] = action.comment
        const newPostForm ={...state,...newState}
        return newPostForm
    }
    case REMOVE_ONE:
            const newState = { ...state };
            delete newState[action.id];
            return newState;
            
    case EDIT_COMMENT:{
             const newState={...state}
             
            newState[action.comment.id] = action.comment;//issue here
         
             return newState;
             }
            // if (!state[action.comment.id]) {
            //     const newState = { ...state,[action.comment.id]: action.comment
            //     }
            //     console.log("NEWSTATE INSIDE REDUCER OF EDIT",newState)
            //     return newState;
            // }
            // return {
            //     ...state,
            //     [action.comment.id]: {...state[action.comment.id],...action.comment
            //     }
            // };
        // }
    default: {
                return state
            }
}
}
export default commentReducer























/********************************************************************************************************************************** */