const initialState = {
    Messages: []
}

const ConversationMessagesReducer = (state = initialState, {type, Messages}) => {
    switch(type){
        case "UPDATE_CONVERSATION":
            return {
                ...state, 
                Messages
            }
        default:
            return state;
    }
}

export default ConversationMessagesReducer;