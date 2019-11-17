import { DISPLAY_LOADING, SELECT_SHEETMENU  } from "../constants/action-types";

const initialState = {
  displayLoadingRedux:false,
  sheetSelected:"home",
};


function accountReducer(state = initialState, action) {
  let nextState
  switch (action.type) {

    case DISPLAY_LOADING:
          nextState = {
            ...state,
            displayLoadingRedux: action.displayLoading
          }
          console.log(action.displayLoading)
        return nextState || state
    break;

    case SELECT_SHEETMENU:
          nextState = {
            ...state,
            sheetSelected: action.sheetSelected
          }
        return nextState || state
    break;

    default:;

  }
  return state;
}
export default accountReducer;
