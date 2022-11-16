import { useMainContext } from '../../contexts/MainContext'
import { useRef } from "react"
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Button } from './button/Button';

const schema = yup.object({
  panelInput: yup.number().required("Il faut soumettre une réponse"),
}).required()

const Keyboard = () => {

  const { mainContextState } = useMainContext()
  const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: yupResolver(schema)
  })
  const mathsAnwserInputRef = useRef(null)
  const onSubmit = data => handleClick(data.panelInput)
  const { ref, ...rest } = register('panelInput')

  const handleClick = (btnTxt) => {
      // if(parentState.target !== null){
      //     if (btnTxt.toString() === parentState.target.toString()) {
      //         setSpanMsg(parentState, parentDispatch, 1)
      //     } else {
      //         setSpanMsg(parentState, parentDispatch, 0)
      //     }  
      // }
  }

  return (
    <div className="h-[250px] w-52 bg-white text-black flexJIC flex-col shadow-xl border-8 border-double border-slate-300 text-2xl">
      {
        mainContextState.displayKeyboardForm && <form className="w-full flexJIC flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <input role="presentation" autoComplete="off" {...rest} name="mathsAnswerInput" id="mathsAnswerInput" placeholder="Votre réponse ?" className="w-full p-4 text-2xl rounded-3xl outline-none shadow-xl font-semibold text-neutral-400" ref={(e) => {
              ref(e) 
              mathsAnwserInputRef.current = e 
          }} />
          <span className="w-full flex justify-start items-center">
              <p className="w-full ml-4 text-2xl text-red-500">{errors.mathsAnswerInput && "Votre réponse doit être un nombre."}</p>
          </span>
      </form>
      }
      <div className="w-100 flex justify-around items-center flex-col gap-6 cursor-pointer">
        {
          mainContextState.displayKeyboardBtn && <>
            <Button title={mainContextState.keyboardBtnTxt[0][0]} color={mainContextState.keyboardBtnTxt[0][1]} />
            <Button title={mainContextState.keyboardBtnTxt[1][0]} color={mainContextState.keyboardBtnTxt[1][1]} />
          </>
        }
      </div>
    </div>
  )
}

export default Keyboard