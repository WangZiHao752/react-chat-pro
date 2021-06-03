import axios from "axios";
import {call,put} from "redux-saga/effects";

export function* login(){
    const res = yield axios.post('/api/login',{});
    yield put({
        type:"USERINFO",
        payload:{
            a:12
        }
    })
}