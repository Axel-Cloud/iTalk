const InitialStatus = {
    Status: "Conversation"
};

export default (state = InitialStatus, {type, Status}) => {
    switch(type){
        case "CHANGE_STATUS":
            return {
                ...state,
                Status
            };
        default:
            return state;
    }
};