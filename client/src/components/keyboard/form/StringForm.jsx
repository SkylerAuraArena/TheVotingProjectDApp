import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Button } from "../button/Button";
import useEth from "../../../contexts/EthContext/useEth";
import useMainContext from "../../../contexts/MainContext/useMainContext";

const schema = yup.object({
    stringInput: yup.string().min(3,"The proposition's description must have 3 caracters at least").required("A description is required"),
  }).required()

const StringForm = ({ elt }) => {

    const { updateVotingScreen } = useMainContext()
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })
    const stringInputRef = useRef(null)
    const onSubmit = data => handleFormSubmission(data)
    const { ref, ...rest } = register('stringInput')
    const { state: { contract, accounts } } = useEth();
    
    const handleFormSubmission = async (data) => {
        const trimmedData = data.stringInput.trim();
        // let returnValue;
        try {
            if(elt.func.mode === "send"){
                !errors.stringInput?.message && await contract.methods[elt.func.name](trimmedData).send({ from: accounts[0] });
                // returnValue = !errors.stringInput?.message && await contract.methods[elt.func.name](trimmedData ?? trimmedData).send({ from: accounts[0] });
            // } else {
            //     // await contract.methods[elt.func.name](trimmedData ?? trimmedData).call({ from: accounts[0] });   
            //     returnValue = !errors.stringInput?.message && await contract.methods[elt.func.name](trimmedData ?? trimmedData).call({ from: accounts[0] });   
            //     switch (elt.func.name) {
            //         case solidityFunctionsList.voter.getVoter:
            //             updateVotingScreen(returnValue[0] ? "This address is registered as a voter" : "This address is not registered as a voter", true)
            //             break;
            //         default:
            //             break;
            //     }
            }
            // returnValue && console.log(returnValue);   
        } catch (error) {
            updateVotingScreen("Invalid proposition or proposition already registered", false);
        }
        stringInputRef.current.value = "";
        stringInputRef.current.focus();
    }

    useEffect(() => {
        stringInputRef.current.focus()
    }, [])

    return (
        <>
            <form className="w-full flexJIC flex-col gap-2 mt-3" onSubmit={handleSubmit(onSubmit)}>
                <input role="presentation" autoComplete="off" {...rest} name="stringInput" id="stringInput" placeholder="Description" className="w-36 px-3 py-2 mb-3 text-lg rounded-3xl outline-none shadow-xl font-semibold text-neutral-600" ref={(e) => {
                    ref(e) 
                    stringInputRef.current = e 
                }} />
            </form>
            {
                errors.stringInput?.message && <>
                    <span className="w-36 h-12 mt-4 mb-6 flex justify-start items-center">
                        <p className="w-full text-sm text-red-500">{errors.stringInput?.message && errors.stringInput?.message}</p>
                    </span>
                </>
            }
            <Button title={elt.txt} color={elt.css} func={handleSubmit(onSubmit)} />
        </>
    )
}

export default StringForm