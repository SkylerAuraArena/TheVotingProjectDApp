import { useEffect, useMemo, useReducer, useState } from "react"
import useEth from "../EthContext/useEth";
import MainContext from "./MainContext";
import { reducer, actions, profile, votingDeviceStates, eventsList, votingScreenTextArray, ledgerScreenTextArray, initialState, keyboardBtnTextArray } from "./state";
import { formatETHAddress } from "../../helpers/functionsHelpers";

const MainContextProvider = ({ children }) => {
  const { state: { contract } } = useEth();
  const [mainContextState, mainContextDispatch] = useReducer(reducer, initialState);
  const [oldEvents, setOldEvents] = useState();

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
    let displayKeyboardBtn = true;
    let displayKeyboardForm = false;
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
      } else {
        if(btnTxt === keyboardBtnTextArray.profile.global.back.txt){
          if(mainContextState.currentState === votingDeviceStates.admin.adminHub || mainContextState.currentState === votingDeviceStates.voter.voterHub) {
            newTxt = votingScreenTextArray.chooseMode;
            newProfile = null;
            newVotingDeviceState = votingDeviceStates.hub;
            displayKeyboardBtn = true;
            displayKeyboardForm = false;
          } else {
            if(mainContextState.profile === profile.admin) {
              newTxt = votingScreenTextArray.hub.admin.welcome;
              newProfile = profile.admin;
              newVotingDeviceState = votingDeviceStates.admin.adminHub;
              displayKeyboardBtn = true;
              displayKeyboardForm = false;
            } else if (mainContextState.profile === profile.voter) {
              newTxt = votingScreenTextArray.hub.admin.welcome;
              newProfile = profile.voter;
              newVotingDeviceState = votingDeviceStates.voter.voterHub;
              displayKeyboardBtn = true;
              displayKeyboardForm = false;
            }
          }
        }
      } 
      mainContextDispatch({
        type: actions.update,
        data: { 
          votingDeviceScreenTxt: newTxt,
          profile: newProfile,
          currentState: newVotingDeviceState,
          displayKeyboardBtn: displayKeyboardBtn,
          displayKeyboardForm: displayKeyboardForm,
        }
      });
    }
  }

  const updateVotingScreen = (newScreenTxt = "") => {
    mainContextDispatch({
      type: actions.update,
      data: { 
        votingDeviceScreenTxt: newScreenTxt,
      }
    });
  }

  useEffect(() => {
    (async function () {
      if(contract){
        let oldEvents= await contract.getPastEvents('VoterRegistered','WorkflowStatusChange', 'ProposalRegistered', 'Voted', 'WinnerElected', 'NoWinnerElected', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        let oldies=[];
        oldEvents.forEach(event => {
            oldies.push({
              eventType: event.event,
              eventData: event.returnValues
            });
        });
        setOldEvents(oldies);

        await contract.events.VoterRegistered({fromBlock:'earliest'})
        .on('data', event => {
          switch (event.event) {
            case eventsList.voterRegistered:
              const formattedAddress = formatETHAddress(event.returnValues.voterAddress)
              updateVotingScreen(`"${formattedAddress}" registration successful`);
              break;
            default:
              break;
          }
        })          
        .on('changed', changed => console.log(changed))
        .on('error', err => console.log(err))
        .on('connected', str => console.log(str))
      }
    })(); 
  }, [contract])

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

export default MainContextProvider;