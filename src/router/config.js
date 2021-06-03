import Home from "../page/home";
import Login from "../page/login";
const route = [{
    path:"/home",
    component:Home,
    isLogin:true,
},{
    path:"/login",
    component:Login,
},{
    from:"/",
    to:"/login",
}]
export default route;