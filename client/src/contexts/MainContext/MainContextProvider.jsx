import { useMemo, useReducer } from "react"
import MainContext from "./MainContext";
import { reducer, actions, mode, votingScreenTextArray, ledgerScreenTextArray, initialState } from "./state";

const MainContextProvider = ({ children }) => {
  const [mainContextState, mainContextDispatch] = useReducer(reducer, initialState);

  const resetDAppDisplay = () => {
    mainContextDispatch({
      type: actions.reset,
    });
  }

  const enableLedger = (power = false) => {
    mainContextDispatch({
      type: actions.turnOnLedger,
      data: power,
    });
  }

  const displayForm = (display = false, form = null) => {
    mainContextDispatch({
      type: actions.update,
      data: {
        displayKeyboardBtn: !display,
        displayKeyboardForm: display,
        form: form,
      },
    });
  }
  
  const handleLedgerBtnClick = (btnNum = 0) => {
    if(mainContextState.isLedgerEnabled){
      let displayDashboardKeyboard;
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
      resetDAppDisplay,
      enableLedger,
      displayForm,
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