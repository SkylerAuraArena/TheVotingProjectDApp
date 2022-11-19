const actions = {
  reset: "RESET",
  update: "UPDATE",
  turnOnLedger: 'TURNONLEDGER',
};

const mode = {
  admin: "Admin",
  voter: "Voter",
}

const functionsModes = {
  send: "send",
  call: "call",
}

const votingScreenTextArray = {
  init: "Welcome, please connect your ledger",
  chooseMode: "Choose your job",
  welcome: {
    admin: "Welcome admin",
    voter: "Welcome voter",
  },
}

const ledgerScreenTextArray = {
  disconnected: "Connect ?",
  connected: "Connected",
}

const keyboardBtnTextArray = {
  mode: {
    admin: {
      txt: mode.admin,
      css: "bg-red-500",
    },
    voter: {
      txt: mode.voter,
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
      {txt:"Get one voter's vote", css:"bg-emerald-500", func: {mode: functionsModes.call, name: "getVotersVotes", params: true}},
      {txt:"Get proposals list", css:"bg-emerald-500", func: {mode: functionsModes.call, name: "getProposalsList", params: false}},
      {txt:"Get proposal informations", css:"bg-emerald-500", func: {mode: functionsModes.call, name: "getOneProposal", params: true}},
      {txt:"Register proposal", css:"bg-blue-500", func: {mode: functionsModes.send, name: "addProposal", params: true}},
      {txt:"Vote", css:"bg-blue-500", func: {mode: functionsModes.send, name: "setVote", params: true}},
      {txt:"Check winner", css:"bg-amber-400", func: {mode: functionsModes.call, name: "winningProposalID", params: false}},
    ],
  },
}

const initialState = {
  mode: null,
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
  mode,
  votingScreenTextArray,
  ledgerScreenTextArray,
  keyboardBtnTextArray,
  initialState,
  reducer
};
