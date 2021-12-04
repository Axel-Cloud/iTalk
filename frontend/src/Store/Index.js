import { createStore, combineReducers } from "redux";
import SelectedConversation from "./SelectedConversation/reducer";
import StatusAsideMenu from "./AsideMenuStatus/reducer";
import ConversationMessages from "./ConversationMessages/reducer";

const Reducers = combineReducers({
    SelectedConversation,
    StatusAsideMenu,
    ConversationMessages,
});

const Store = createStore(Reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default Store;