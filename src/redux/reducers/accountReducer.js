import { SET_ACCOUNTSTATE, CONNECT, SET_NEW_BET, SET_BET_SELECTED, SET_BET_INACTIVE, SET_WINNER, SET_FRIENDSSTATE, GET_USERBETS, GET_USERFRIENDS, RESET_ACCOUNTSTATE, GET_USERWITNESSOF, UPDATE_WITNESSOF, ACCEPT_BET  } from "../constants/action-types";

const initialState = {
  connectedRedux:false,

  accountStateRedux:{
    currentBet: {
    id : "78337",
    title:"je gagne tous mes paris",
    issue:"1 kebab",
    expiration:"10/12/2015",
    creation:"10/12/2015",
    players1:["515313"],
    players2:["65161", "51651"],
    win: true,
    current:false,
    witness:"5646846"
    },
    account:{
      id:2000,
      userName:"yolan",
      email:"",
      imageProfile:"",
      bets:[1,2,3,4,5,6,7,8,9,10],
      witnessOf:[1225,1325,326],
      friends:[],
    },
    friends:[
      {name : "Hippo", numnberOfBet:10, id:10253},
      {name : "gab", numnberOfBet:10, id:10253,},
      {name : "bertrand", numnberOfBet:10, id:10253,},
      {name : "Mickael", numnberOfBet:10, id:10253,},
      {name : "MC Solar", id:10253},
      {name : "MC Solard", id:10253},
      {name : "MC ListOfItemsslar", numnberOfBet:10, id:10253,},
      {name : "MC solidlar", numnberOfBet:10, id:10253,},
      {name : "MC Sodlar", numnberOfBet:10, id:10253,},
      {name : "MC Sodlar", numnberOfBet:10, id:10253,},
      {name : "MC Szeolar", numnberOfBet:10, id:10253,},
    ],
    witnessOf:[
      {
      id : "78337",
      title:"je gagne tous mes paris",
      issue:"1 kebab",
      expiration:"10/12/2015",
      creation:"10/12/2015",
      players1:["515313"],
      players2:["65161", "51651"],
      win: true,
      current:false,
      witness:"5646846"
      },
      {
      id : "78337",
      title:"je gagne tous mes paris",
      issue:"1 kebab",
      expiration:"10/12/2015",
      creation:"10/12/2015",
      players1:["515313"],
      players2:["65161", "51651"],
      win: true,
      current:false,
      witness:"5646846"
      },
      {
      id : "78337",
      title:"je gagne tous mes paris",
      issue:"1 kebab",
      expiration:"10/12/2015",
      creation:"10/12/2015",
      players1:["515313"],
      players2:["65161", "51651"],
      win: true,
      current:false,
      witness:"5646846"
      },
    ],
    bets:[
        {bet:{
        id : "78337",
        title:"je gagne tous mes paris",
        issue:"1 kebab",
        expiration:"10/12/2015",
        creation:"10/12/2015",
        players1:[{id:"515313", accepted:undefined}],
        players2:["65161", "51651"],
        win: true,
        current:false,
        witness:"5646846"
      },accepted:true},
        {bet:{
        id : "51351",
        title:"je gagne tous mes paris",
        issue:"1 kebab",
        expiration:"10/12/2015",
        creation:"10/12/2015",
        players1:["515313"],
        players2:["65161", "51651"],
        win: true,
        current:true,
        witness:"5646846"
        },accepted:true},
        {bet:{
        id : "511",
        title:"je gagne tous mes paris",
        issue:"1 kebab",
        expiration:"10/12/2015",
        creation:"10/12/2015",
        players1:["515313"],
        players2:["65161", "51651"],
        win: true,
        current:false,
        witness:"5646846"
        },accepted:true},
        {bet:{
        id : "897",
        title:"je gagne tous mes paris",
        issue:"1 kebab",
        expiration:"10/12/2015",
        creation:"10/12/2015",
        players1:["515313"],
        players2:["65161", "51651"],
        win: false,
        current:true,
        witness:"5646846"
        },accepted:true},
        {bet:{
        id : "5661",
        title:"je gagne tous mes paris",
        issue:"1 kebab",
        expiration:"10/12/2015",
        creation:"10/12/2015",
        players1:["515313"],
        players2:["65161", "51651"],
        win: true,
        current:false,
        witness:"5646846"
        },accepted:true},
      ]
    }
}


function accountReducer(state = initialState, action) {
  let nextState
  let newBets
  let newAccountState

  switch (action.type) {

    case CONNECT:
          nextState = {
            ...state,
            connectedRedux: action.connected
          }
        return nextState || state
    break;

    case SET_ACCOUNTSTATE:
          newAccountState =  state.accountStateRedux;
          newAccountState.account = action.account;
          nextState = {
            ...state,
            accountStateRedux: newAccountState,
          }
        return nextState || state
    break;

    case RESET_ACCOUNTSTATE:
          newAccountState =  state.accountStateRedux;
          newAccountState.bets = [];
          newAccountState.friends = [];
          newAccountState.account = {};
          nextState = {
            ...state,
            accountStateRedux: newAccountState,
          }
          console.log(action.account)
        return nextState || state
    break;

    case GET_USERFRIENDS:
          newAccountState =  state.accountStateRedux;
          newAccountState.friends = action.tabOfFriends;
          nextState = {
            ...state,
            accountStateRedux: newAccountState,
          }
        return nextState || state
    break;

    case SET_FRIENDSSTATE:
          newAccountState =  state.accountStateRedux;
          newAccountState.friends = action.friends;
          nextState = {
            ...state,
            accountStateRedux: newAccountState,
          }
        return nextState || state
    break;

    case SET_NEW_BET:

          newAccountState = state.accountStateRedux
          newAccountState.bets.push(action.newBet)
          nextState = {
            ...state,
            accountState: newAccountState
          }
        return nextState || state
    break;

    case GET_USERBETS:
          newAccountState = state.accountStateRedux
          newAccountState.bets = action.tabOfBets
          nextState = {
            ...state,
            accountState: newAccountState
          }
          //console.log(action.tabOfBets)
        return nextState || state
    break;

    case GET_USERWITNESSOF:
        newAccountState = state.accountStateRedux
        newAccountState.witnessOf = action.tabOfWitnessOf
        nextState = {
          ...state,
          accountState: newAccountState
        }
        //console.log(newAccountState.witnessOf)
      return nextState || state
    break;


    case SET_BET_SELECTED:
          newAccountState = state.accountStateRedux
          newAccountState.currentBet = action.bet
          nextState = {
            ...state,
            currentBet: newAccountState
          }
        return nextState || state
    break;

    case SET_BET_INACTIVE:
          newAccountState = state.accountStateRedux
          newAccountState.bets[action.betID].statusCurrent = false;
          nextState = {
            ...state,
            myBets: newBets
          }
        return nextState || state
    break;

    case SET_WINNER:
          newAccountState = state.accountStateRedux
          newAccountState.bets[action.betID].winners.push({id:action.accountID});
          nextState = {
            ...state,
            accountStateRedux: newAccountState
          }
        return nextState || state
    break;

    case ACCEPT_BET:
          newAccountState = state.accountStateRedux

          newAccountState.account = action.newAccount
          for (var i = 0; i < newAccountState.bets.length; i++) {
            if(newAccountState.bets[i].id === action.newBet.id){
              newAccountState.bets[i] = action.newBet
            }
          }
          nextState = {
            ...state,
            accountStateRedux: newAccountState
          }
          console.log(newAccountState)
        return nextState || state
    break;

    case UPDATE_WITNESSOF:
    newAccountState = state.accountStateRedux
    for (var i = 0; i < newAccountState.witnessOf.length; i++) {
      if(newAccountState.witnessOf[i].id === action.bet.id){
        newAccountState.witnessOf[i] = action.bet
      }
    }
    nextState = {
      ...state,
      accountStateRedux: newAccountState
    }
    console.log(newAccountState)
  return nextState || state
break;

    default:;

  }
  return state;
}
export default accountReducer;
