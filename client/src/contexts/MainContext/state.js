const actions = {
  reset: "RESET",
  update: "UPDATE",
  turnOnLedger: 'TURNONLEDGER',
};

const profile = {
  admin: "Admin",
  voter: "Voter",
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
    addProposal: "addProposal",
    setVote: "setVote",
  },

}

const votingScreenTextArray = {
  init: "Welcome, please connect your ledger",
  chooseMode: "Choose your job",
  hub: {
    admin: {
      welcome: "Welcome admin, select one option",
      sendAddress: "Enter the address you want to register",
      addressSent: "Voter registered",
      addressNotSent: "Invalid registration, please try again",
    },
    voter: {
      welcome: "Welcome voter, select one option",
      getVoter: "Enter the address you want to check",
      voterGotten: "The address is a registered voter",
      voterNotGotten: "The address is not a registered voter",
      addProposal: "Desribre the proposal you wish to register",
      proposalAdded: "Proposal registration complete",
      proposalNotAdded: "Proposal registration failed, please try again",
      setVote: "Enter the proposal's id you want to vote for",
      voteSet: "Voted !",
      voteNotSet: "Vote failed",
    },
  },
}

const ledgerScreenTextArray = {
  disconnected: "Connect ?",
  connected: "Connected",
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
      txt: profile.admin,
      css: "bg-red-500",
    },
    voter: {
      txt: profile.voter,
      css: "bg-emerald-500",
    },
  },
  mainOptions: {
    admin: [
      {txt: "Register new voter", css:"bg-blue-500", func: {mode: functionsModes.send, name: "addVoter", params: true}},
      {txt: "Start proposals registration", css:"bg-red-500", func: {mode: functionsModes.send, name: "startProposalsRegistering", params: false}},
      {txt: "End proposals registration", css:"bg-red-500", func: {mode: functionsModes.send, name: "endProposalsRegistering", params: false}},
      {txt: "Start voting session", css:"bg-red-500", func: {mode: functionsModes.send, name: "startVotingSession", params: false}},
      {txt: "End voting session", css:"bg-red-500", func: {mode: functionsModes.send, name: "endVotingSession", params: false}},
      {txt: "Tally votes", css:"bg-amber-400", func: {mode: functionsModes.send, name: "tallyVotes", params: false}},
    ],
    voter: [
      {txt:"Get voters' addresses list", css:"bg-emerald-500", func: {mode: functionsModes.call, name: "getVotersList", params: false}},
      {txt:"Check voter's registration", css:"bg-blue-500", func: {mode: functionsModes.call, name: "getVoter", params: true}},
      {txt:"Get one voter's vote", css:"bg-blue-500", func: {mode: functionsModes.call, name: "getVotersVotes", params: true}},
      {txt:"Get proposals list", css:"bg-emerald-500", func: {mode: functionsModes.call, name: "getProposalsList", params: false}},
      {txt:"Get proposal informations", css:"bg-emerald-500", func: {mode: functionsModes.call, name: "getOneProposal", params: true}},
      {txt:"Register proposal", css:"bg-blue-500", func: {mode: functionsModes.send, name: "addProposal", params: true}},
      {txt:"Vote", css:"bg-blue-500", func: {mode: functionsModes.send, name: "setVote", params: true}},
      {txt:"Check winner", css:"bg-amber-400", func: {mode: functionsModes.call, name: "winningProposalID", params: false}},
    ],
  },
}

const initialState = {
  profile: null,
  currentState: votingDeviceStates.hub,
  isLedgerEnabled: false,
  displayKeyboardBtn: false,
  displayKeyboardForm: false,
  form: null,
  votingDeviceScreenTxt: votingScreenTextArray.init,
  ledgerScreenTxt: ledgerScreenTextArray.disconnected,
  keyboardBtnTxt: keyboardBtnTextArray,
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
  profile,
  votingDeviceStates,
  eventsList,
  workflowStatus,
  votingScreenTextArray,
  ledgerScreenTextArray,
  keyboardBtnTextArray,
  initialState,
  reducer
};
