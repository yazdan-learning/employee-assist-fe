import { combineReducers } from "redux";

// Front
// import LayoutReducer from "./layouts/reducer";
import LayoutReducer from "./layouts/reducer";
import LoginReducer from "./auth/login/reducer";
import ProfileReducer from "./auth/profile/reducer";
import ForgotPasswordReducer from "./auth/forgetpwd/reducer";
import AccountReducer from "./auth/register/reducer";
import ChatsReducer from "./chats/reducer";
import CustomerReducer from "./customers/reducer";
// import productReducer from "./products/reducer";

const rootReducer = combineReducers({
    Layout: LayoutReducer,
    Login: LoginReducer,
    Profile: ProfileReducer,
    ForgetPassword: ForgotPasswordReducer,
    Account: AccountReducer,
    chats: ChatsReducer,
    customer: CustomerReducer,
    // product: productReducer,
});

export default rootReducer;