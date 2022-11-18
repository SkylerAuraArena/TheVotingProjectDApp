import { useMemo, useReducer } from "react"
import MainContext from "./MainContext";
import { reducer, actions, mode, votingScreenTextArray, ledgerScreenTextArray, initialState } from "./state";

const MainContextProvider = ({ children }) => {
  const [mainContextState, mainContextDispatch] = useReducer(reducer, initialState);

  const enableLedger = (power = false) => {
    mainContextDispatch({
      type: actions.turnOnLedger,
      data: power,
    });
  }

  const handleLedgerBtnClick = (btnNum = 0) => {
    if(mainContextState.isLedgerEnabled){
      let displayDashboardKeyboard;
      let disconnect;
      let newVotingScreenTxt;
      let newLedgerScreenTxt;
      let newLedgerStatus;
      if(mainContextState.mode){

      } else {
        if(btnNum === 1){
          displayDashboardKeyboard = true;
          newVotingScreenTxt = votingScreenTextArray.chooseMode;
          newLedgerScreenTxt = ledgerScreenTextArray.connected;
          newLedgerStatus = false;
          mainContextDispatch({
            type: actions.update,
            data: { 
              votingDeviceScreenTxt: newVotingScreenTxt,
              ledgerScreenTxt: newLedgerScreenTxt,
              displayKeyboardBtn: displayDashboardKeyboard,
              isLedgerEnabled: newLedgerStatus, 
            }
          });
        }
      }
    }
  }
  // const handleLedgerBtnClick = (btnNum = 0) => {
  //   if(mainContextState.isLedgerEnabled){
  //     let displayDashboardKeyboard;
  //     let disconnect;
  //     let newVotingScreenTxt;
  //     let newLedgerScreenTxt;
  //     displayDashboardKeyboard = btnNum === 1 ? true : false
  //     if(!mainContextState.mode){
  //       newVotingScreenTxt = votingScreenTextArray.chooseMode;
  //       newLedgerScreenTxt = ledgerScreenTextArray.disconnected
  //     } else {
  //       newVotingScreenTxt = mainContextState.mode === mode.admin ? votingScreenTextArray.welcome.admin : votingScreenTextArray.welcome.voter;
  //       newLedgerScreenTxt = ledgerScreenTextArray.connected
  //     }
  //     mainContextDispatch({
  //       type: actions.init,
  //       data: { 
  //         votingDeviceScreenTxt: newVotingScreenTxt,
  //         ledgerScreenTxt: newLedgerScreenTxt,
  //         displayKeyboardBtn: displayDashboardKeyboard,
  //         mode: disconnect, 
  //       }
  //     });
  //   }
  // }

  const handleKeyboardBtnClick = (btnTxt = "") => {
    let newTxt = ""
    let newMode = null
    if(btnTxt !== ""){
      if(!mainContextState.mode){
        if(btnTxt === mode.admin){
          newTxt = votingScreenTextArray.welcome.admin;
          newMode = mode.admin
        } else {
          newTxt = votingScreenTextArray.welcome.voter;
          newMode = mode.voter
        }
      }
      mainContextDispatch({
        type: actions.update,
        data: { 
          votingDeviceScreenTxt: newTxt,
          mode: newMode
        }
      });
    }
  }

  const contextValues = useMemo(
    () => ({
      mainContextState,
      mainContextDispatch,
      enableLedger,
      handleLedgerBtnClick,
      handleKeyboardBtnClick,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      mainContextState,
    ]
  )

  return <MainContext.Provider value={contextValues}>{children}</MainContext.Provider>
}

export default MainContextProvider