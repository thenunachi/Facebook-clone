/*******************************************TYPE*************************************************************************************** */
const GET_USER_COMMENTS = "Comments/getUserComment"
export const GET_POST_COMMENTS = "Comments/getPostComment"
export const CREATE_ONE = "Comments/createComment";
export const REMOVE_ONE = 'Comments/removeComment';
export const EDIT_COMMENT = "spots/editComment";//updating a comment


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
        const data = await response.json();
        dispatch(getPostComment(data.Comments))
    }
    return response;
}
//create a comment

export const createCommentThunk = (data)=>async dispatch =>{
const {postId} = data
const response = await fetch(`/api/posts/${postId}/comments`,{
    method:'POST',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify(data)
});
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
        const {id} = await response.json();//destructuring only id from response
        dispatch(removeComment(id));
    }
}

//update a comment
export const updateCommentThunk = (data)=>async dispatch =>{
    const {commentId} = data
    const response = await fetch(`/api/comments/${commentId}`,{
        method:'PUT',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    if(response.ok){
        const updateComment = await response.json();
        dispatch(editComment(updateComment))
        return updateComment
    }
    
    }



/**********************************************REDUCER************************************************************************************ */

const commentReducer =(state={},action) =>{
switch (action.type){
    case GET_USER_COMMENTS:{
        const allCommnets ={}
        action.comment.forEach((comment)=>{
        allCommnets[comment.id] = comment
        })
        const  newState ={...state,allCommnets}
        return newState
    }
    case GET_POST_COMMENTS:{
        const newState ={};
        action.comments.forEach((comment)=>(newState[comment.id]=comment))
        return newState;
    }
    case CREATE_ONE:{
        const newState={};
        newState[action.payload.id] = action.payload
        const newPostForm ={...state,...newState}
        return newPostForm
    }
    case REMOVE_ONE:
            const newState = { ...state };
            delete newState[action.commentId];
            return newState;
    case EDIT_COMMENT:{
             const newState={...state}
            newState[action.payload.id] = action.payload;
             return newState;
             }
    default: {
                return state
            }
}
}
export default commentReducer























/********************************************************************************************************************************** */