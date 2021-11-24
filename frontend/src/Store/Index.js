import { createStore, combineReducers } from "redux";
import SelectedConversationReducer from "./SelectedConversation/reducer";
import StatusAsideMenu from "./AsideMenuStatus/reducer";

const Reducers = combineReducers({
    SelectedConversationReducer,
    StatusAsideMenu,
});

const Store = createStore(Reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default Store;