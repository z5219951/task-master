import { createStore} from 'redux';
import reducer from './reducer';
import {persistStore, persistReducer} from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';

// setting the redux-persist
const storageConfig = {
        key: 'root', 
        storage:storageSession, 
        blacklist: []  // data that need not to keep
}
const myPersistReducer = persistReducer(storageConfig, reducer);

// we us redux to store the valuable that we will use cross the different components
// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() is for redux develop tools. You can search 'Redux DevTools' in Chrome Extention
const store = createStore(myPersistReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
 
export const persistor = persistStore(store)
export default store;