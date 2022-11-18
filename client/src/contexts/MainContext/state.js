const actions = {
  reset: "RESET",
  update: "UPDATE",
  turnOnLedger: 'TURNONLEDGER',
};

const mode = {
  admin: "Admin",
  voter: "Voter",
}

const votingScreenTextArray = {
  init: "Welcome, please connect your ledger",
  chooseMode: "Choose your job",
  welcome: {
    admin: "Welcome new admin",
    voter: "Welcome new voter",
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
      {txt: "Get voters addresses list", css:"bg-blue-500"},
      {txt: "Register new voter", css:"bg-red-500"},
      {txt: "Start proposals registration", css:"bg-red-500"},
      {txt: "Get proposals list", css:"bg-blue-500"},
      {txt: "End proposals registration", css:"bg-red-500"},
      {txt: "Start voting session", css:"bg-red-500"},
      {txt: "End voting session", css:"bg-red-500"},
      {txt: "Tally votes", css:"bg-amber-400"},
    ],
    voter: [
      {txt:"Get voters' addresses list", css:"bg-blue-500"},
      {txt:"Get one voter's vote", css:"bg-slate-400"},
      {txt:"Get proposals list", css:"bg-blue-500"},
      {txt:"Get proposal informations", css:"bg-blue-500"},
      {txt:"Register proposal", css:"bg-red-500"},
      {txt:"Vote", css:"bg-amber-400"},
      {txt:"Check winner", css:"bg-amber-400"},
    ],
  },
}

// css:'border-blue-500',
// css:'border-blue-500',
// css:'border-red-500 text-red-500',
// css:'border-amber-400 text-amber-500',
// css:'border-emerald-500 text-emerald-500',
// css:'border-red-300 bg-red-500 text-white',

const initialState = {
  mode: null,
  isLedgerEnabled: false,
  displayKeyboardBtn: false,
  displayKeyboardForm: false,
  votingDeviceScreenTxt: votingScreenTextArray.init,
  ledgerScreenTxt: ledgerScreenTextArray.disconnected,
  keyboardBtnTxt: keyboardBtnTextArray,
};

// const reducer = (state, action) => ({...state, ...action})

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
