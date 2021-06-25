import {createStore} from 'redux';
import reducer from './reducer'

// we us redux to store the valuable that we will use cross the different components
// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() is for redux develop tools. You can search 'Redux DevTools' in Chrome Extention
const store = createStore(reducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;