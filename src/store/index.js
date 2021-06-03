// import {createStore,applyMiddleware} from "redux";
// import reducer from "./reducer";
// import rootSaga from "./saga";
// const createSaga = require('redux-saga');
// const saga = createSaga();
// const store = createStore(reducer,applyMiddleware(saga));
// saga.run(rootSaga); //执行generator入口文件
// export default store;

import { createStore, applyMiddleware } from "redux";
import reducer from "./reducer";
import createSaga from "redux-saga";
import rootSaga from "./saga"
const saga = createSaga() //创建saga对象
const store = createStore(reducer, applyMiddleware(saga));
/// run方法必须要等store创建出来
saga.run(rootSaga); // 执行Generator 入口文件  
export default store
