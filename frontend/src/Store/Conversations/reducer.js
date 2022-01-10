const initialState = {
    Conversations: []
};

const UpdateConversationsReducer = (state = initialState, {type, Conversations}) => {
    switch(type){
        case "UPDATE_CONVERSATIONS":
            return {
                ...state,
                Conversations
            }
        default:
            return state
    }
};

export default UpdateConversationsReducer;