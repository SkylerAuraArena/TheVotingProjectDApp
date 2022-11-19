import Keyboard from "../keyboard/Keyboard";
import Ledger from "../ledger/OpennedLedger";
import Screen from "../screen/Screen";

const VotingDevice = ({ changeCurtain }) => {

  return (
    <div className="w-100 h-maxPanel grid grid-cols-12 grid-rows-12">
        <div className="col-start-1 col-span-1 row-start-0 row-span-full">
          <img src="http://talkerscode.com/webtricks/demo/images/curtain1.jpg" className="h-90% cursor-pointer" alt='leftCurtain' onClick={()=>changeCurtain()}/>
        </div>
        <div className="w-52 flexJIC flex-col col-start-3 col-span-8 row-start-2 row-span-10 my-4 -ml-[0.4rem] gap-4">
          <Screen />
          <Keyboard />
        </div>
        <div className="col-start-12 col-span-1 row-start-0 row-span-full">
          <Ledger />
        </div>
    </div>
  )
}

export default VotingDevice