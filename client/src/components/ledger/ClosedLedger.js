const ClosedLedger = () => {

  return (
    <div className="relative">
      <div className="flexJIC flex-col h-80 w-14 -top-[25.5rem] left-[19rem]
       gap-0 absolute">
        <div className="flexJIC flex-row-reverse gap-4 h-48 w-14 bg-zinc-300 [writing-mode:vertical-rl] text-base z-20">
          <div className="h-8 w-8 -mb-[5.3rem] bg-white border-2 border-solid border-black rounded-full"></div>
          <div className="text-zinc-500 cursor-default">LEDGER</div>
        </div>
      </div>
      <div className="flexJIC flex-col gap-14 absolute text-red-600 -top-[19.1rem] left-[22.458rem]">
        <div className="w-1.5 h-4 bg-slate-600 rounded-sm"></div>
        <div className="w-1.5 h-4 bg-slate-600 rounded-sm"></div>
      </div>
      <div className="h-6 w-14 bg-zinc-300 absolute -top-[9.5rem] rotate-180 left-[19REM]
       rounded-t-full z-10"></div>
      <div className="h-6 w-14 bg-black absolute -top-[9.5rem] rotate-180 left-[19REM] z-0"></div>
    </div>
  )
}

export default ClosedLedger