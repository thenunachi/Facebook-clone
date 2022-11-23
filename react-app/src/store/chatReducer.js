const GET_ALL_MESSAGES =    "Chat/getAllMessages"
const CREATE_A_MESSAGE = "Chat/createAMessage"



const getAllMessages = (msg)=>{
    return{
        type:GET_ALL_MESSAGES,
        msg
    }
}

const createAMessage = (msg)=>{
    return{
        type:CREATE_A_MESSAGE,
        msg
    }
}

export const allMessages = ()=>async dispatch =>{
    const response = await fetch("/chat")
    if(response.ok){
        const data = await response.json()
        dispatch(getAllMessages(data.chat))
        return {...data}
    }
}

export const createNewMessage =(msgdata)=>async dispatch =>{
    console.log(msgdata,"inside thunk of chat")
    const response = await fetch(`/chat/${msgdata.receiver_Id}`,{
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(msgdata)
    });
    if(response.ok){
        const newmsg = await response.json();
        dispatch(createAMessage(newmsg))
        return newmsg
    }
    
}

const chatReducer =(state={},action)=>{
    switch(action.type){
        case GET_ALL_MESSAGES:{
            const newState={}
action.msg.forEach((e)=>{
newState[e.id]=e
})
return newState
        }
        case CREATE_A_MESSAGE:{
            const newState={};
            newState[action.msg.id] = action.msg
            const newchat={...state,...newState}
            return newchat
        }
        default:{
            return state
        }
    }
}
export default chatReducer