import useMainContext from '../../contexts/MainContext/useMainContext'
import { Button } from './button/Button';
import AddressForm from "./form/AddressForm";
import StringForm from './form/StringForm';
import UintForm from './form/UintForm';

const Keyboard = () => {

  const { mainContextState, displayForm } = useMainContext()

  const backBtn = <Button title={mainContextState.keyboardBtnTxt.profile.global.back.txt} color={mainContextState.keyboardBtnTxt.profile.global.back.css} />;

  const chooseModeBtnArray = <>
    <Button title={mainContextState.keyboardBtnTxt.profile.admin.txt} color={mainContextState.keyboardBtnTxt.profile.admin.css} />
    <Button title={mainContextState.keyboardBtnTxt.profile.voter.txt} color={mainContextState.keyboardBtnTxt.profile.voter.css} />
  </>

  const adminModeControlBtnArray = mainContextState.keyboardBtnTxt.mainOptions.admin.map((elt, index) => {
    if(elt.func.params) {
      const newForm = <div key={index} className="w-full flexJIC flex-col">
          { (elt.func.name === "addVoter") ? <AddressForm elt={elt} /> : null }
      </div>
      const newFunc =  () => displayForm(elt.func.name, true, newForm);
      return <Button key={index} title={elt.txt} color={elt.css} func={newFunc}/>
    } else {
      return <Button key={index} title={elt.txt} color={elt.css} func={elt.func} args={true}/>
    }
  })

  const voterModeControlBtnArray = mainContextState.keyboardBtnTxt.mainOptions.voter.map((elt, index) => {
    if(elt.func.params) {
      const newForm = <div key={index} className="w-full flex justify-start items-center flex-col">
          { backBtn }
          { (elt.func.name === "getVoter" || elt.func.name === "getVotersVotes") ? <AddressForm elt={elt} /> : 
          (elt.func.name === "getOneProposal" || elt.func.name === "setVote") ? <UintForm elt={elt} /> :
          (elt.func.name === "addProposal") ? <StringForm elt={elt} /> : null }
      </div>
      const newFunc =  () => displayForm(elt.func.name, true, newForm);
      return <Button key={index} title={elt.txt} color={elt.css} func={newFunc} />
    } else {
      return <Button key={index} title={elt.txt} color={elt.css} func={elt.func} args={true}/>
    }
  })

  return (
    <div className="h-[250px] w-52 text-black flex justify-start items-center flex-col shadow-xl border-8 border-double border-slate-300 text-2xl overflow-y-scroll">
      {
        mainContextState.displayKeyboardForm && <div className="w-full flex justify-start items-center flex-col py-3 px-4">
          { backBtn }
          { mainContextState.form }
        </div>
      }
      {
        mainContextState.displayKeyboardBtn && <div className="w-100 flex justify-start items-center flex-col py-3 px-4 gap-3 cursor-pointer">
          { mainContextState.profile && backBtn }
          {
            !mainContextState.profile && chooseModeBtnArray
          }
          {
            mainContextState.profile === "Admin" && adminModeControlBtnArray
          }
          {
            mainContextState.profile === "Voter" && voterModeControlBtnArray
          }
        </div>
      }
    </div>
  )
}

export default Keyboard