import { ADD_CATEGORY, ADD_KEYWORD, RESET_CATEGORY, RESET_KEYWORD  } from "../constants/action-types";

const initialState = {
  categorySelectedRedux: [],
  keyWordSelectedRedux: [],
};


function reasearchReducer(state = initialState, action) {
  let nextState
  switch (action.type) {
    case ADD_CATEGORY:
        var alreadyExistingCategory = false
        for(var i = 0; i< state.categorySelectedRedux.length;i++){
          if(state.categorySelectedRedux[i] === Object.values(action.category)[0]){
            alreadyExistingCategory = true;
            let newCategorySelected = state.categorySelected
            newCategorySelected.splice(i, 1)
            nextState = {
              ...state,
              categorySelectedRedux: newCategorySelected
            }
          }
        }
        if(alreadyExistingCategory === false){
          let newCategorySelected = state.categorySelectedRedux
          newCategorySelected.push(Object.values(action.category)[0]);
          nextState = {
            ...state,
            categorySelectedRedux: newCategorySelected
          }
        }
        return nextState || state
    break;

    case RESET_CATEGORY:
          nextState = {
            ...state,
            categorySelectedRedux: []
          }
        return nextState || state
    break;

    case RESET_KEYWORD:
          nextState = {
            ...state,
            keyWordSelectedRedux: []
          }
        return nextState || state
    break;

    case ADD_KEYWORD:
        var alreadyExistingKeyword = false
        for(var i = 0; i< state.keyWordSelectedRedux.length;i++){
          if(state.keyWordSelectedRedux[i] === Object.values(action.keyWord)[0]){
            alreadyExistingKeyword = true;
            let newkeyWordSelected = state.keyWordSelectedRedux
            newkeyWordSelected.splice(i, 1)
            nextState = {
              ...state,
              keyWordSelectedRedux: newkeyWordSelected
            }
          }
        }
        if(alreadyExistingKeyword === false){
          let newkeyWordSelected = state.keyWordSelectedRedux
          newkeyWordSelected.push(Object.values(action.keyWord)[0]);
          nextState = {
            ...state,
            keyWordSelectedRedux: newkeyWordSelected
          }
        }
        return nextState || state
    break;

    default:;

  }
  return state;
}
export default reasearchReducer;
