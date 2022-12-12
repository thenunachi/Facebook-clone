

const GET_LIKES = 'Likes/getLikes'
const SET_LIKE = 'Likes/setLikes'
const REMOVE_LIKE = 'Likes/removeLike'
const getLikes = (likes) => {
    return {
        type: GET_LIKES,
        likes
    }

}
const setLikes = (like) => {
    return {
        type: SET_LIKE,
        like
    }
}

const removeLike = (id) => {
    return {
        type: REMOVE_LIKE,
        id
    }
}

export const likesThunk = (postId) => async dispatch => {
    const response = await fetch(`/api/posts/${postId}/likes`)
    console.log(response, "response")
    if (response.ok) {
        const data = await response.json();
        console.log(data, "before data")
        dispatch(getLikes(data))
        console.log("data from get likes thunk", data)
        return { ...data }
    }
}

export const createThunk = (like) => async dispatch => {
    console.log(like, "like for creation in side thunk")
    const response = await fetch(`/api/posts/${like.post_Id}/likes`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(like)
    })
    console.log(response, "response of create thunk")
    if (response.ok) {
        const writeLike = await response.json();
        console.log(writeLike, "wriredr%%%%%%")
        dispatch(setLikes(writeLike.likes));
        return writeLike;
    }
}

export const removeThunk = (id) => async dispatch => {
    console.log(id, "inside delete thunk")
    const response = await fetch(`/api/likes/${id}`, {
        method: "DELETE",
    })
    if (response.ok) {
        dispatch(removeLike(id))
    }
}

const likeReducer = (state = {}, action) => {
    let allLikes = {}
    switch (action.type) {
        case GET_LIKES: {
            console.log("action .typoe", action.likes)
            const groupedLikes = action.likes.likes.reduce((acc, e) => {
                acc[e.post_Id] = acc[e.post_Id] || [];
                acc[e.post_Id].push(e)
                return acc;
            }, {})
            return { ...state, ...groupedLikes }
        }
        case SET_LIKE: {
            const newState = {}
            newState[action.like.id] = action.like;
            console.log(newState, "newState inside created action type")
            const newLike = { ...state, ...newState }
            console.log(newLike, "inside create like  reducer")
            return newLike
        }
        case REMOVE_LIKE: {
            const newState = { ...state }
            console.log(newState, "NewState of delete reduer")
            delete newState[action.id]
            return newState

        }
        default:
            return state;

    }
}
export default likeReducer