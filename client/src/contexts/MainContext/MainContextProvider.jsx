import { useMemo, useReducer } from "react"
import MainContext from "./MainContext";
import { reducer, actions, profile, votingDeviceStates, votingScreenTextArray, ledgerScreenTextArray, initialState } from "./state";

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

  const displayForm = (funcName = votingDeviceStates.hub, display = false, form = null) => {
    let newTxt;
    let newProfile;
    let newVotingDeviceState;
    if(funcName === votingDeviceStates.admin.addVoter){
        newTxt = votingScreenTextArray.hub.admin.sendAddress;
        newProfile = profile.admin
        newVotingDeviceState = votingDeviceStates.admin.addVoter;
    } else if(funcName === votingDeviceStates.voter.getVoter){
      newTxt = votingScreenTextArray.hub.voter.getVoter;
      newProfile = profile.voter
      newVotingDeviceState = votingDeviceStates.voter.getVoter;
    } else if(funcName === votingDeviceStates.voter.addProposal){
      newTxt = votingScreenTextArray.hub.voter.addProposal;
      newProfile = profile.voter
      newVotingDeviceState = votingDeviceStates.voter.addProposal;
    } else if(funcName === votingDeviceStates.voter.setVote){
      newTxt = votingScreenTextArray.hub.voter.setVote;
      newProfile = profile.voter
      newVotingDeviceState = votingDeviceStates.voter.setVote;
    }
    mainContextDispatch({
      type: actions.update,
      data: {
        displayKeyboardBtn: !display,
        displayKeyboardForm: display,
        form: form,
        votingDeviceScreenTxt: newTxt,
        profile: newProfile,
        currentState: newVotingDeviceState,
      },
    });
  }
  
  const handleLedgerBtnClick = (btnNum = 0) => {
    if(mainContextState.isLedgerEnabled){
      let displayDashboardKeyboard;
      let newVotingScreenTxt;
      let newLedgerScreenTxt;
      let newLedgerStatus;
      if(mainContextState.profile){

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
    let newTxt = "";
    let newProfile = null;
    let newVotingDeviceState = votingDeviceStates.hub;
    console.log(mainContextState.profile);
    if(btnTxt !== ""){
      if(!mainContextState.profile){
        if(btnTxt === profile.admin){
          newTxt = votingScreenTextArray.hub.admin.welcome;
          newProfile = profile.admin
          newVotingDeviceState = votingDeviceStates.admin.adminHub;
        } else {
          newTxt = votingScreenTextArray.hub.voter.welcome;
          newProfile = profile.voter
          newVotingDeviceState = votingDeviceStates.voter.voterHub;
        }
      } else if(mainContextState.profile === profile.admin){
        if(btnTxt === "Register new voter"){
          newTxt = votingScreenTextArray.hub.admin.sendAddress;
          newProfile = profile.admin
          newVotingDeviceState = votingDeviceStates.admin.registerVoter;
        }
      } else if(mainContextState.profile === profile.voter){
        
      }
      mainContextDispatch({
        type: actions.update,
        data: { 
          votingDeviceScreenTxt: newTxt,
          profile: newProfile,
          currentState: newVotingDeviceState,
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