const GET_ALL_MESSAGES = "Chat/getAllMessages"
const CREATE_A_MESSAGE = "Chat/createAMessage"



const getAllMessages = (msg) => {
    return {
        type: GET_ALL_MESSAGES,
        msg
    }
}

const createAMessage = (msg) => {
    return {
        type: CREATE_A_MESSAGE,
        msg
    }
}

export const allMessages = (senderId, receiverId) => async dispatch => {
    const url = `/chat?sender_id=${senderId}&receiver_id=${receiverId}`;
    const response = await fetch(url)
    // const response = await fetch('/chat')
    if (response.ok) {
        const data = await response.json()
        dispatch(getAllMessages(data.chat))
        return { ...data }
    }
}

export const createNewMessage = (msgdata) => async dispatch => {
    console.log(msgdata, "inside thunk of chat")
    const response = await fetch(`/chat/${msgdata.receiver_Id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgdata)
    });
    console.log(response, "response")
    if (response.ok) {
        const newmsg = await response.json();
        dispatch(createAMessage(newmsg))
        return newmsg
    }

}

const chatReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ALL_MESSAGES: {
            console.log(action.msg, "action.msg")
            const newState = {}
            action.msg.forEach((e) => {
                newState[e.id] = e
            })
            return { ...state, ...newState}
        }
        case CREATE_A_MESSAGE: {
            const newState = {};
            newState[action.msg.id] = action.msg
            const newchat = { ...state, ...newState }
            return newchat
        }
        default: {
            return state
        }
    }
}
export default chatReducer