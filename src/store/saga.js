import {takeEvery} from "redux-saga/effects";
import {login} from "../page/login/model";

function* rootSaga(){
    yield takeEvery('add_user_info',login)  //监听页面action 监听执行函数
}


export default rootSaga;