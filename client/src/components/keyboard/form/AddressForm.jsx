import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Button } from "../button/Button";
import useEth from "../../../contexts/EthContext/useEth";
import useMainContext from "../../../contexts/MainContext/useMainContext";

const re = new RegExp(/0x[a-fA-F0-9]{40}/);

const schema = yup.object({
    addressInput: yup.string("You must provide a string formatted as an address").matches(re,"Invalid address, need an 0x format").length(42,"The provided address is too long").required("An address is required"),
  }).required()

const Form = ({ elt }) => {

    const { updateVotingScreen } = useMainContext()
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })
    const addressInputRef = useRef(null)
    const onSubmit = data => handleFormSubmission(data)
    const { ref, ...rest } = register('addressInput')
    const { state: { contract, accounts } } = useEth();
    
    const handleFormSubmission = async (data) => {
        let returnValue;
        if(elt.func.mode === "send"){
            // !errors.addressInput?.message && await contract.methods[elt.func.name](data.addressInput).send({ from: accounts[0] });
            returnValue = !errors.addressInput?.message && await contract.methods[elt.func.name](data.addressInput).send({ from: accounts[0] });
        } else {
            // await contract.methods[elt.func.name](data?.addressInput ?? data.addressInput).call({ from: accounts[0] });   
            returnValue = !errors.addressInput?.message && await contract.methods[elt.func.name](data?.addressInput ?? data.addressInput).call({ from: accounts[0] });   
            switch (elt.func.name) {
                case "getVoter":
                    updateVotingScreen(returnValue[0] ? "This address is registered as a voter" : "This address is not registered as a voter")
                    break;
                default:
                    break;
            }
        }
        returnValue && console.log(returnValue);
        addressInputRef.current.value = "";
        addressInputRef.current.focus();
    }

    useEffect(() => {
        addressInputRef.current.focus()
    }, [])

    return (
        <>
            <form className="w-full flexJIC flex-col gap-2 mt-3" onSubmit={handleSubmit(onSubmit)}>
                <input role="presentation" autoComplete="off" {...rest} name="addressInput" id="addressInput" placeholder="Address" className="w-36 px-3 py-2 mb-3 text-lg rounded-3xl outline-none shadow-xl font-semibold text-neutral-600" ref={(e) => {
                    ref(e) 
                    addressInputRef.current = e 
                }} />
            </form>
            {
                errors.addressInput?.message && <>
                    <span className="w-36 h-12 mb-2 flex justify-start items-center">
                        <p className="w-full text-sm text-red-500">{errors.addressInput?.message && errors.addressInput?.message}</p>
                    </span>
                </>
            }
            <Button title={elt.txt} color={elt.css} func={handleSubmit(onSubmit)} />
        </>
    )
}

export default Form