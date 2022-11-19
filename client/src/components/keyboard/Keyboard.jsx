import useMainContext from '../../contexts/MainContext/useMainContext'
import { Button } from './button/Button';
import AddressForm from "./form/AddressForm";
import StringForm from './form/StringForm';
import UintForm from './form/UintForm';

const Keyboard = () => {

  const { mainContextState, displayForm } = useMainContext()

  const chooseModeBtnArray = <>
    <Button title={mainContextState.keyboardBtnTxt.profile.admin.txt} color={mainContextState.keyboardBtnTxt.profile.admin.css} />
    <Button title={mainContextState.keyboardBtnTxt.profile.voter.txt} color={mainContextState.keyboardBtnTxt.profile.voter.css} />
  </>

  const adminModeControlBtnArray = mainContextState.keyboardBtnTxt.mainOptions.admin.map((elt, index) => {
    if(elt.func.params) {
      const newForm = <div key={index} className="w-full flexJIC flex-col gap-2">
          { (elt.func.name === "addVoter") ? <AddressForm elt={elt} /> : null }
      </div>
      const newFunc =  () => displayForm(elt.func.name, true, newForm);
      return <Button key={index} title={elt.txt} color={elt.css} func={newFunc}/>
    } else {
      return <Button key={index} title={elt.txt} color={elt.css} func={elt.func} arg={null}/>
    }
  })

  const voterModeControlBtnArray = mainContextState.keyboardBtnTxt.mainOptions.voter.map((elt, index) => {
    if(elt.func.params) {
      const newForm = <div key={index} className="w-full flexJIC flex-col gap-2">
            { (elt.func.name === "getVoter" || elt.func.name === "getVotersVotes") ? <AddressForm elt={elt} /> : 
            (elt.func.name === "getOneProposal" || elt.func.name === "setVote") ? <UintForm elt={elt} /> :
            (elt.func.name === "addProposal") ? <StringForm elt={elt} /> : null }
      </div>
      const newFunc =  () => displayForm(elt.func.name, true, newForm);
      return <Button key={index} title={elt.txt} color={elt.css} func={newFunc}/>
    } else {
      return <Button key={index} title={elt.txt} color={elt.css} func={elt.func} arg={null}/>
    }
  })

  return (
    <div className="h-[250px] w-52 bg-neutral-100 text-black flexJIC flex-col shadow-xl border-8 border-double border-slate-300 text-2xl ">
      {
        mainContextState.displayKeyboardForm && <>
          { mainContextState.form }
        </>
      }
      <div className="w-100 flex justify-start items-center flex-col py-3 px-4 gap-3 cursor-pointer overflow-y-auto">
        {
          mainContextState.displayKeyboardBtn && <>
            {
              !mainContextState.profile && chooseModeBtnArray
            }
            {
              mainContextState.profile === "Admin" && adminModeControlBtnArray
            }
            {
              mainContextState.profile === "Voter" && voterModeControlBtnArray
            }
          </>
        }
      </div>
    </div>
  )
}

export default Keyboard