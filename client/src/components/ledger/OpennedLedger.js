import useMainContext from "../../contexts/MainContext/useMainContext"

const OpennedLedger = () => {

  const { mainContextState, handleLedgerBtnClick } = useMainContext()

  return (
    <div className="relative">
      <div className="flexJIC flex-col h-80 w-14 top-48 left-8
       gap-0 absolute">
        <div className="flexJIC h-48 w-14 py-3 bg-black text-base z-0">
          <div className="w-3/6 h-5/6 bg-slate-400 [writing-mode:vertical-rl] rotate-180">
            { mainContextState.ledgerScreenTxt }
          </div>
        </div>
        <div className="flexJIC flex-row-reverse gap-4 h-48 w-14 bg-zinc-300 [writing-mode:vertical-rl] rotate-180 text-base z-20">
          <div className="h-8 w-8 -mb-12 bg-white border-2 border-solid border-black rounded-full"></div>
          <div className="text-zinc-500 cursor-default">LEDGER</div>
        </div>
      </div>
      <div className="flexJIC flex-col gap-14 absolute text-red-600 top-[14.4rem] left-[5.48rem]">
        <div className="w-1.5 h-4 bg-slate-600 rounded-sm cursor-pointer" onClick={() => handleLedgerBtnClick(1)}></div>
        <div className="w-1.5 h-4 bg-slate-600 rounded-sm cursor-pointer" onClick={() => handleLedgerBtnClick(0)}></div>
      </div>
      <div className="h-6 w-14 bg-zinc-300 absolute top-[21.25rem] left-8
       rounded-t-full z-10"></div>
    </div>
  )
}

export default OpennedLedger