const InitialStatus = {
    Status: "Conversation"
};

const AsideMenuReducer = (state = InitialStatus, {type, Status}) => {
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

export default AsideMenuReducer;