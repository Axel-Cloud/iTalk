const UPDATE_CONVERSATIONS = "UPDATE_CONVERSATIONS";

const UpdateConversations = (Conversations) => {
    return {
        type: UPDATE_CONVERSATIONS,
        Conversations
    }
};

export { UpdateConversations };