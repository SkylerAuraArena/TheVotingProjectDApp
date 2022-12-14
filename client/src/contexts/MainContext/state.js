const actions = {
  reset: "RESET",
  update: "UPDATE",
  turnOnLedger: 'TURNONLEDGER',
};

const profiles = {
  admin: "Admin",
  voter: "Voter",
  all: "Show winning proposal id",
}

const functionsModes = {
  send: "send",
  call: "call",
}

const eventsList = {
  voterRegistered: "VoterRegistered",
  workflowStatusChange: "WorkflowStatusChange",
  proposalRegistered: "ProposalRegistered",
  voted: "Voted",
  winnerElected: "WinnerElected",
  noWinnerElected: "NoWinnerElected",
  campaignReset: "CampaignReset",
}

const solidityFunctionsList = {
  admin: {
    addVoter: "addVoter",
    startProposalsRegistering: "startProposalsRegistering",
    endProposalsRegistering: "endProposalsRegistering",
    startVotingSession: "startVotingSession",
    endVotingSession: "endVotingSession",
    tallyVotes: "tallyVotes",
    resetCampaign: "resetCampaign",
  },
  voter: {
    getVotersList: "getVotersList",
    getVoter: "getVoter",
    getVotersVotes: "getVotersVotes",
    getProposalsList: "getProposalsList",
    getOneProposal: "getOneProposal",
    addProposal: "addProposal",
    setVote: "setVote",
    winningProposalID: "winningProposalID",
  },
  all: {
    getWinningProposal: "getWinningProposal",
  }
}

const workflowStatus = {
  registeringVoters: "registeringVoters", // Indicates who can vote
  proposalsRegistrationStarted: "proposalsRegistrationStarted", // Indicates when people can submit proposals
  proposalsRegistrationEnded: "proposalsRegistrationEnded", // Indicates when proposal submission is over
  votingSessionStarted: "votingSessionStarted", // Indicates when voting campaign is opened
  votingSessionEnded: "votingSessionEnded", // Indicates when voting campaign is closed
  votesTallied: "votesTallied", // Indicates when the votes are tallied
}

const votingDeviceStates = {
  hub: "hub",
  admin: {
    adminHub: "adminHub",
    addVoter: "addVoter",
  },
  voter: {
    voterHub: "voterHub",
    getVoter: "getVoter",
    getVotersVotes: "getVotersVotes",
    getOneProposal: "getOneProposal",
    addProposal: "addProposal",
    setVote: "setVote",
  },
  all: {
    getWinningProposal: "getWinningProposal",
  }

}

const votingScreenTextArray = {
  outOfOrder: "Out of order",
  init: "Welcome, please connect your ledger",
  onlyVoters: "Only registered voters may vote",
  chooseMode: "Choose your job",
  winnerElected: "The winning proposal is n??",
  winnerNotElected: "There is no winner elected for now",
  hub: {
    admin: {
      welcome: "Welcome admin, select one option",
      sendAddress: "Enter the address you want to register",
      addressSent: "Voter registered",
      addressNotSent: "Invalid registration, please try again",
    },
    voter: {
      welcome: "Welcome voter, select one option",
      getVoter: "Enter an address you want to check",
      getVotersVotes: "Enter an address to check the linked vote",
      voterGotten: "The address is a registered voter",
      voterNotGotten: "The address is not a registered voter",
      getProposal: "Enter the proposal's id you want to get information of",
      addProposal: "Desribre the proposal you wish to register",
      proposalAdded: "Proposal registration complete",
      proposalNotAdded: "Proposal registration failed, please try again",
      setVote: "Enter the proposal's id you want to vote for",
      voteSet: "Voted ! (The choosen proposal has been set to the n??",
      voteNotSet: "Vote failed",
    },
  },
}

const ledgerScreenTextArray = {
  null: "",
  pending: "Pending...",
  disconnected: "Connect ?",
  connected: "Logged in",
  fullfield: "Trx fullfield",
  rejected: "Trx rejected",
}

const keyboardBtnTextArray = {
  profile: {
    global: {
      back: {
        txt: "<<",
        css: "bg-zinc-500",
      }
    },
    admin: {
      txt: profiles.admin,
      css: "bg-red-500",
    },
    voter: {
      txt: profiles.voter,
      css: "bg-emerald-500",
    },
    all: {
      txt: profiles.all,
      css: "bg-amber-400",
    },
  },
  mainOptions: {
    admin: [
      {txt: "Register new voter", css:"bg-blue-500", func: {mode: functionsModes.send, name: solidityFunctionsList.admin.addVoter, params: true}},
      {txt: "Start proposals registration", css:"bg-orange-400", func: {mode: functionsModes.send, name: solidityFunctionsList.admin.startProposalsRegistering, params: false}},
      {txt: "End proposals registration", css:"bg-orange-400", func: {mode: functionsModes.send, name: solidityFunctionsList.admin.endProposalsRegistering, params: false}},
      {txt: "Start voting session", css:"bg-orange-400", func: {mode: functionsModes.send, name: solidityFunctionsList.admin.startVotingSession, params: false}},
      {txt: "End voting session", css:"bg-orange-400", func: {mode: functionsModes.send, name: solidityFunctionsList.admin.endVotingSession, params: false}},
      {txt: "Tally votes", css:"bg-amber-400", func: {mode: functionsModes.send, name: solidityFunctionsList.admin.tallyVotes, params: false}},
      // {txt: "Reset campaign", css:"bg-red-500", func: {mode: functionsModes.send, name: solidityFunctionsList.admin.resetCampaign, params: false}},
    ],
    voter: [
      {txt:"Get voters' addresses list", css:"bg-emerald-500", func: {mode: functionsModes.call, name: solidityFunctionsList.voter.getVotersList, params: false}},
      {txt:"Check voter's registration", css:"bg-blue-500", func: {mode: functionsModes.call, name: solidityFunctionsList.voter.getVoter, params: true}},
      {txt:"Get one voter's vote", css:"bg-blue-500", func: {mode: functionsModes.call, name: solidityFunctionsList.voter.getVotersVotes, params: true}},
      {txt:"Get proposals list", css:"bg-emerald-500", func: {mode: functionsModes.call, name: solidityFunctionsList.voter.getProposalsList, params: false}},
      {txt:"Get proposal informations", css:"bg-emerald-500", func: {mode: functionsModes.call, name: solidityFunctionsList.voter.getOneProposal, params: true}},
      {txt:"Register proposal", css:"bg-blue-500", func: {mode: functionsModes.send, name: solidityFunctionsList.voter.addProposal, params: true}},
      {txt:"Vote", css:"bg-blue-500", func: {mode: functionsModes.send, name: solidityFunctionsList.voter.setVote, params: true}},
      {txt:"Check winner", css:"bg-amber-400", func: {mode: functionsModes.call, name: solidityFunctionsList.all.getWinningProposal, params: false}},
    ],
  },
}

const initialState = {
  isContractAvailable: false,
  isOwner: false,
  profile: null,
  currentState: votingDeviceStates.hub,
  currentWorkflowStatus: workflowStatus.registeringVoters,
  isLedgerEnabled: false,
  displayKeyboardBtn: false,
  displayKeyboardForm: false,
  form: null,
  votingDeviceScreenTxt: votingScreenTextArray.init,
  ledgerScreenTxt: ledgerScreenTextArray.disconnected,
  keyboardBtnTxt: keyboardBtnTextArray,
  workflowStatusChangedPastEvents: [],
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.reset:
      return { ...state, ...initialState };
    case actions.update:
      return { ...state, ...data };
    case actions.turnOnLedger:
      return {...state, isLedgerEnabled: data};
    default:
      throw new Error("Undefined reducer action type");
  }
};

export {
  actions,
  profiles,
  votingDeviceStates,
  eventsList,
  solidityFunctionsList,
  workflowStatus,
  votingScreenTextArray,
  ledgerScreenTextArray,
  keyboardBtnTextArray,
  initialState,
  reducer
};
