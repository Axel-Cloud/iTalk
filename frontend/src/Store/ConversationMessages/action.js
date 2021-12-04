const UPDATE_CONVERSATION = "UPDATE_CONVERSATION";

const ConversationMessages = (Messages) => {
    return {
        type: UPDATE_CONVERSATION,
        Messages
    }
}

export { ConversationMessages };