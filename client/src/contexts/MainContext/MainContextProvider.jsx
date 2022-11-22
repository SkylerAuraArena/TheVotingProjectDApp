import { useEffect, useMemo, useReducer } from "react"
import useEth from "../EthContext/useEth";
import MainContext from "./MainContext";
import { reducer, actions, profiles, votingDeviceStates, workflowStatus, solidityFunctionsList, votingScreenTextArray, ledgerScreenTextArray, initialState, keyboardBtnTextArray } from "./state";
import { formatETHAddress } from "../../helpers/functionsHelpers";

const MainContextProvider = ({ children }) => {
  const { state: { contract, accounts } } = useEth();
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
    let newLedgerScreenTxt = ledgerScreenTextArray.pending;
    if(funcName === votingDeviceStates.admin.addVoter){
      newTxt = votingScreenTextArray.hub.admin.sendAddress;
      newProfile = profiles.admin
      newVotingDeviceState = votingDeviceStates.admin.addVoter;
    } else if(funcName === votingDeviceStates.voter.getVoter){
      newTxt = votingScreenTextArray.hub.voter.getVoter;
      newProfile = profiles.voter
      newVotingDeviceState = votingDeviceStates.voter.getVoter;
    } else if(funcName === votingDeviceStates.voter.getVotersVotes){
      newTxt = votingScreenTextArray.hub.voter.getVotersVotes;
      newProfile = profiles.voter
      newVotingDeviceState = votingDeviceStates.voter.getVotersVotes;
    } else if(funcName === votingDeviceStates.voter.getOneProposal){
      newTxt = votingScreenTextArray.hub.voter.getProposal;
      newProfile = profiles.voter
      newVotingDeviceState = votingDeviceStates.voter.getOneProposal;
    } else if(funcName === votingDeviceStates.voter.addProposal){
      newTxt = votingScreenTextArray.hub.voter.addProposal;
      newProfile = profiles.voter
      newVotingDeviceState = votingDeviceStates.voter.addProposal;
    } else if(funcName === votingDeviceStates.voter.setVote){
      newTxt = votingScreenTextArray.hub.voter.setVote;
      newProfile = profiles.voter
      newVotingDeviceState = votingDeviceStates.voter.setVote;
    }
    mainContextDispatch({
      type: actions.update,
      data: {
        displayKeyboardBtn: !display,
        displayKeyboardForm: display,
        ledgerScreenTxt: newLedgerScreenTxt,
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
        // This part is to use the ledger a a validation device
        // It is not available as it now.
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

  const handleKeyboardBtnClick = async (btnTxt = "") => {
    let newTxt = "";
    let newProfile = null;
    let newVotingDeviceState = votingDeviceStates.hub;
    let newLedgerScreenTxt = mainContextState.null;
    let displayKeyboardBtn = true;
    let displayKeyboardForm = false;
    if(btnTxt !== ""){
      if(!mainContextState.profile){
        if(btnTxt === profiles.admin){
          newTxt = votingScreenTextArray.hub.admin.welcome;
          newProfile = profiles.admin
          newVotingDeviceState = votingDeviceStates.admin.adminHub;
        } else {
          try {
            const isVoter = await contract.methods.getVoter(accounts[0]).call({ from: accounts[0] });
            if(isVoter) {
              newTxt = votingScreenTextArray.hub.voter.welcome;
              newProfile = profiles.voter
              newVotingDeviceState = votingDeviceStates.voter.voterHub;
              newLedgerScreenTxt = ledgerScreenTextArray.connected;
            } else {
              newTxt = votingScreenTextArray.onlyVoters;
              newLedgerScreenTxt = ledgerScreenTextArray.rejected;
            } 
          } catch (error) {
            newTxt = votingScreenTextArray.onlyVoters;
            newLedgerScreenTxt = ledgerScreenTextArray.rejected;
          }
        }
      } else {
        if(btnTxt === keyboardBtnTextArray.profile.global.back.txt){
          newLedgerScreenTxt = ledgerScreenTextArray.null;
          if(mainContextState.currentState === votingDeviceStates.admin.adminHub || mainContextState.currentState === votingDeviceStates.voter.voterHub) {
            newTxt = votingScreenTextArray.chooseMode;
            newProfile = null;
            newVotingDeviceState = votingDeviceStates.hub;
            displayKeyboardBtn = true;
            displayKeyboardForm = false;
          } else {
            if(mainContextState.profile === profiles.admin) {
              newTxt = votingScreenTextArray.hub.admin.welcome;
              newProfile = profiles.admin;
              newVotingDeviceState = votingDeviceStates.admin.adminHub;
              displayKeyboardBtn = true;
              displayKeyboardForm = false;
            } else if (mainContextState.profile === profiles.voter) {
              newTxt = votingScreenTextArray.hub.admin.welcome;
              newProfile = profiles.voter;
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
          ledgerScreenTxt: newLedgerScreenTxt,
          profile: newProfile,
          currentState: newVotingDeviceState,
          displayKeyboardBtn: displayKeyboardBtn,
          displayKeyboardForm: displayKeyboardForm,
        }
      });
    }
  }

  const updateVotingScreen = (newScreenTxt = "", fullfield = null) => {
    mainContextDispatch({
      type: actions.update,
      data: { 
        votingDeviceScreenTxt: newScreenTxt,
        ledgerScreenTxt: fullfield === null ? mainContextState.ledgerScreenTxt : fullfield ? ledgerScreenTextArray.fullfield : ledgerScreenTextArray.rejected,
      }
    });
  }

  const voterRegistrationEventCheck = async () => {
    if(contract){
      // let oldEvents= await contract.getPastEvents(eventsList.voterRegistered, {
      //   fromBlock: 0,
      //   toBlock: 'latest'
      // });
      // let oldies=[];
      // oldEvents.forEach(event => {
      //     oldies.push({
      //       eventType: event.event,
      //       eventData: event.returnValues
      //     });
      // });

      await contract.events.VoterRegistered({fromBlock:'earliest'})
      .on('data', event => {
          const formattedAddress = formatETHAddress(event.returnValues.voterAddress)
          updateVotingScreen(`"${formattedAddress}" registration successful`, true);
        })          
      // .on('changed', changed => console.log(changed))
      // .on('error', err => console.log(err))
      // .on('connected', str => console.log(str))
    }
  }
  const votesEventCheck = async () => {
    if(contract){
      // let oldEvents= await contract.getPastEvents(eventsList.voterRegistered, {
      //   fromBlock: 0,
      //   toBlock: 'latest'
      // });
      // let oldies=[];
      // oldEvents.forEach(event => {
      //     oldies.push({
      //       eventType: event.event,
      //       eventData: event.returnValues
      //     });
      // });

      await contract.events.Voted({fromBlock:'earliest'})
      .on('data', event => {
          updateVotingScreen(`${votingScreenTextArray.hub.voter.voteSet}${event.returnValues[1]})`, true);
        })          
      // .on('changed', changed => console.log(changed))
      // .on('error', err => console.log(err))
      // .on('connected', str => console.log(str))
    }
  }
  const proposalRegistrationEventCheck = async () => {
    if(contract){
      // let oldEvents= await contract.getPastEvents(eventsList.voterRegistered, {
      //   fromBlock: 0,
      //   toBlock: 'latest'
      // });
      // let oldies=[];
      // oldEvents.forEach(event => {
      //     oldies.push({
      //       eventType: event.event,
      //       eventData: event.returnValues
      //     });
      // });

      await contract.events.ProposalRegistered({fromBlock:'earliest'})
      .on('data', event => {
          updateVotingScreen(`Proposal registration successful (id n°${event.returnValues[0]})`, true);
        })          
      // .on('changed', changed => console.log(changed))
      // .on('error', err => console.log(err))
      // .on('connected', str => console.log(str))
    }
  }
  const workflowStatusChangeEventCheck = async () => {
    if(contract){
      let oldEvents= await contract.getPastEvents('WorkflowStatusChange', {
        fromBlock: 0,
        toBlock: 'latest'
      });
      let oldies = [];
      oldEvents.forEach(event => {
          oldies.push({
            // eventType: event.event,
            // eventData: event.returnValues
            lastCurrentStatus: event.returnValues[1],
          });
      });
      if(oldies.length > 0){
        mainContextDispatch({
          type: actions.update,
          data: {
            workflowStatusChangedPastEvents: oldies,
          },
        }) 
      }

      // let newWorkflowStatus = await contract.methods.workflowStatus().call({ from: accounts[0] }); 
      // console.log("WFS", newWorkflowStatus);
      let newWorkflowStatus = mainContextState.currentWorkflowStatus;
      await contract.events.WorkflowStatusChange({fromBlock:'earliest'})
      .on('data', event => {
          if(event.returnValues[0] === "0" && event.returnValues[1] === "1") {
              newWorkflowStatus = workflowStatus.proposalsRegistrationStarted;
              updateVotingScreen(`Voters registration over, proposals registration started`, true);
          } else if(event.returnValues[0] === "1" && event.returnValues[1] === "2") {
              newWorkflowStatus = workflowStatus.proposalsRegistrationEnded;
              updateVotingScreen(`Proposals registration over`, true);
          } else if(event.returnValues[0] === "2" && event.returnValues[1] === "3") {
              newWorkflowStatus = workflowStatus.votingSessionStarted;
              updateVotingScreen(`Voting session started`, true);
          } else if(event.returnValues[0] === "3" && event.returnValues[1] === "4") {
              newWorkflowStatus = workflowStatus.votingSessionEnded;
              updateVotingScreen(`Voting session over`, true);
          } else if(event.returnValues[0] === "4" && event.returnValues[1] === "5") {
              newWorkflowStatus = workflowStatus.votesTallied;
              updateVotingScreen(`Votes counting started`, true);
          } else if(event.returnValues[1] === "0") {
              newWorkflowStatus = workflowStatus.registeringVoters;
              updateVotingScreen(`Voting process restarted`, true);
          }
          mainContextDispatch({
            type: actions.update,
            data: {
              currentWorkflowStatus: newWorkflowStatus,
            },
          }) 
      })       
      // .on('changed', changed => console.log(changed))
      // .on('error', err => console.log(err))
      // .on('connected', str => console.log(str))
    }
  }

  useEffect(() => {
    voterRegistrationEventCheck();
    proposalRegistrationEventCheck();
    votesEventCheck();
    workflowStatusChangeEventCheck();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, mainContextState.WorkflowStatusChange])

  useEffect(() => {
    (async function () {
      if (contract) {
        const owner = await contract.methods.owner().call({ from: accounts[0] });
        const isOwner = owner === accounts[0] ? true : false;
        mainContextDispatch({
          type: actions.update,
          data: { 
            isContractAvailable: true,
            isOwner: isOwner,
            isLedgerEnabled: true,
            ledgerScreenTxt: ledgerScreenTextArray.disconnected,
            votingDeviceScreenTxt: votingScreenTextArray.init,
          }
        });
      } else {
        mainContextDispatch({
          type: actions.update,
          data: { 
            isContractAvailable: false,
            isLedgerEnabled: false,
            ledgerScreenTxt: ledgerScreenTextArray.null,
            displayKeyboardBtn: false,
            displayKeyboardForm: false,
            votingDeviceScreenTxt: votingScreenTextArray.outOfOrder,
          }
        });
      }
    })();
  }, [contract, accounts]);

  useEffect(() => {
    accounts && resetDAppDisplay();
  }, [accounts])
  
  const contextValues = useMemo(
    () => ({
      mainContextState,
      mainContextDispatch,
      solidityFunctionsList,
      profiles,
      workflowStatus,
      resetDAppDisplay,
      enableLedger,
      displayForm,
      handleLedgerBtnClick,
      handleKeyboardBtnClick,
      updateVotingScreen,
      workflowStatusChangeEventCheck,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      mainContextState,
    ]
  )

  return <MainContext.Provider value={contextValues}>{children}</MainContext.Provider>
}

export default MainContextProvider;