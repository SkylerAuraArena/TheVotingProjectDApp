import { createContext, useContext, useMemo, useReducer } from "react"

const MainContext = createContext(null)

const reducer = (state, action) => ({...state, ...action})

const votingScreenTextArray = [
  "Welcome, please connect your ledger",
  "Choose your job",
  ["Welcome new admin","Welcome new voter",],
]
const ledgerScreenTextArray = [
  "Connect ?",
  "Connected",
]
const keyboardBtnTextArray = [
  [
    ["Admin","bg-red-500"],
    ["Voter","bg-emerald-500"],
  ],
]

const MainContextProvider = ({ children }) => {
  const [mainContextState, mainContextDispatch] = useReducer(reducer, {
    displayKeyboardBtn: false,
    displayKeyboardForm: false,
    votingDeviceScreenTxt: votingScreenTextArray[0],
    ledgerScreenTxt: ledgerScreenTextArray[0],
    keyboardBtnTxt: keyboardBtnTextArray[0],
  })

  const handleLedgerBtnClick = (btnNub = 0) => {
    const newState = [
      votingScreenTextArray[btnNub],
      ledgerScreenTextArray[btnNub],
      btnNub === 1 ? true : false,
    ]
    mainContextDispatch({
      votingDeviceScreenTxt: newState[0],
      ledgerScreenTxt: newState[1],
      displayKeyboardBtn: newState[2],
    })
  }

  const handleKeyboardBtnClick = (btnTxt = "") => {
    let newTxt = ""
    if(btnTxt !== ""){
      if(mainContextState.votingDeviceScreenTxt === "Choose your job"){
        newTxt = btnTxt === "Admin" ? votingScreenTextArray[2][0] : votingScreenTextArray[2][1]
      }
      mainContextDispatch({
        votingDeviceScreenTxt: newTxt,
        displayKeyboardBtn: false,
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