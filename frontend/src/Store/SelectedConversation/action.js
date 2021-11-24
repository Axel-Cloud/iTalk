const CHANGE_CONVERSATION = "CHANGE_CONVERSATION";

const SelectedConversation = ({_id: ID, Name, Lastname, Online, ProfileImage}) => {
    return {
        type: CHANGE_CONVERSATION,
        ID,
        Name,
        Lastname,
        Online,
        ProfileImage
    }
}

export { SelectedConversation };