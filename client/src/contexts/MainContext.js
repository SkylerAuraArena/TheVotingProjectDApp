import { createContext, useContext, useMemo, useReducer } from "react"

const MainContext = createContext(null)

const reducer = (state, action) => ({...state, ...action})

const mode = {
  admin: "Admin",
  voter: "Voter",
}

const votingScreenTextArray = [
  "Welcome, please connect your ledger",
  "Choose your job",
  ["Welcome new admin","Welcome new voter",],
]
const ledgerScreenTextArray = [
  "Connect ?",
  "Connected",
]
// const keyboardBtnTextArray2 = [
//   [
//     [mode.admin,"bg-red-500"],
//     [mode.voter,"bg-emerald-500"],
//   ],
//   [
//     //Admin options
//     [
//       ["Get voters addresses list","bg-blue-500"],
//       ["Register new voter","bg-red-500"],
//       ["Start proposals registration","bg-red-500"],
//       ["Get proposals list","bg-blue-500"],
//       ["End proposals registration","bg-red-500"],
//       ["Start voting session","bg-red-500"],
//       ["End voting session","bg-red-500"],
//       ["Tally votes","bg-amber-400"],
//     ],
//     //Voters options
//     [
//       ["Get voters' addresses list","bg-blue-500"],
//       ["Get one voter's vote","bg-slate-400"],
//       ["Get proposals list","bg-blue-500"],
//       ["Get proposal informations","bg-blue-500"],
//       ["Register proposal","bg-red-500"],
//       ["Vote","bg-amber-400"],
//       ["Check winner","bg-amber-400"],
//     ]
//   ],
// ]
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

const MainContextProvider = ({ children }) => {
  const [mainContextState, mainContextDispatch] = useReducer(reducer, {
    mode: null,
    displayKeyboardBtn: false,
    displayKeyboardForm: false,
    votingDeviceScreenTxt: votingScreenTextArray[0],
    ledgerScreenTxt: ledgerScreenTextArray[0],
    keyboardBtnTxt: keyboardBtnTextArray,
  })

  const handleLedgerBtnClick = (btnNum = 0) => {
    let btnHandle
    //In the btnNum array, the first one is to display the keyboard buttons if true
    //The second on is to reset the mode.
    if(btnNum === 1) {
      btnHandle = [true, mainContextState.mode]
    } else {
      btnHandle = [false, null]
    }
    const newState = [
      votingScreenTextArray[btnNum],
      ledgerScreenTextArray[btnNum],
      btnHandle[0],
      btnHandle[1],
    ]
    mainContextDispatch({
      votingDeviceScreenTxt: newState[0],
      ledgerScreenTxt: newState[1],
      displayKeyboardBtn: newState[2],
      mode: newState[3],
    })
  }

  const handleKeyboardBtnClick = (btnTxt = "") => {
    let newTxt = ""
    let newMode = null
    if(btnTxt !== ""){
      if(!mainContextState.mode){
        if(btnTxt === mode.admin){
          newTxt = votingScreenTextArray[2][0]
          newMode = mode.admin
        } else {
          newTxt = votingScreenTextArray[2][1]
          newMode = mode.voter
        }
      }
      mainContextDispatch({
        votingDeviceScreenTxt: newTxt,
        mode: newMode
      })
    }
  }

  const contextValues = useMemo(
    () => ({
      mainContextState,
      mainContextDispatch,
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


export const useMainContext = () => {
  const context = useContext(MainContext)
  if (!context) {
    throw new Error(
      "useMainContext doit être utilisé dans le context adéquat"
    )
  }

  return context
}