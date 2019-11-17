import { combineReducers, createStore } from 'redux'
import accountReducer from '../reducers/accountReducer';
import researchReducer from '../reducers/researchReducer';
import helperReducer from '../reducers/helperReducer';


// Use ES6 object literal shorthand syntax to define the object shape
const rootReducer = combineReducers({
    account: accountReducer,
    research: researchReducer,
    helper: helperReducer,
})

const store = createStore(rootReducer)
export default store;
