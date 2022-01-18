const InitialStatus = {
    URL: "https://italk-api.herokuapp.com"
    //URL: "localhost:3001"
};

const ApiURLReducer = (state = InitialStatus, {type, URL}) => {
    switch(type){
        case "CHANGE_URL":
            return {
                ...state,
                URL
            };
        default:
            return state;
    }
};

export default ApiURLReducer;