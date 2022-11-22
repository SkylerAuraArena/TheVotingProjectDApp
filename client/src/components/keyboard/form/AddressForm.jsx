import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Button } from "../button/Button";
import useEth from "../../../contexts/EthContext/useEth";
import useMainContext from "../../../contexts/MainContext/useMainContext";

const re = new RegExp(/0x[a-fA-F0-9]{40}/);

const schema = yup.object({
    addressInput: yup.string("You must provide a string formatted as an address").length(42,"The provided address's length must be 42 caracters.").matches(re,"Invalid address, need an 0x format").required("An address is required"),
  }).required()

const AddressForm = ({ elt }) => {

    const { updateVotingScreen, solidityFunctionsList } = useMainContext()
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })
    const addressInputRef = useRef(null)
    const onSubmit = data => handleFormSubmission(data)
    const { ref, ...rest } = register('addressInput')
    const { state: { contract, accounts } } = useEth();
    
    const handleFormSubmission = async (data) => {
        const trimmedData = data.addressInput.trim();
        let returnValue;
        try {
            if(elt.func.mode === "send"){
                // !errors.addressInput?.message && await contract.methods[elt.func.name](trimmedData).send({ from: accounts[0] });
                returnValue = !errors.addressInput?.message && await contract.methods[elt.func.name](trimmedData ?? trimmedData).send({ from: accounts[0] });
            } else {
                // await contract.methods[elt.func.name](trimmedData ?? trimmedData).call({ from: accounts[0] });   
                returnValue = !errors.addressInput?.message && await contract.methods[elt.func.name](trimmedData ?? trimmedData).call({ from: accounts[0] });   
                switch (elt.func.name) {
                    case solidityFunctionsList.voter.getVoter:
                        updateVotingScreen(returnValue[0] ? "This address is registered as a voter" : "This address is not registered as a voter", true)
                        break;
                    case solidityFunctionsList.voter.getVotersVotes:
                        updateVotingScreen(`This voter's vote has been set on proposition n°${returnValue} (id n°${returnValue - 1})`, true)
                        break;
                    default:
                        break;
                }
            }
            // returnValue && console.log(returnValue);   
        } catch (error) {
            switch (elt.func.name) {
                case solidityFunctionsList.voter.getVoter:
                    updateVotingScreen("Invalid address or voter already registered", false);
                    break;
                case solidityFunctionsList.voter.getVotersVotes:
                    updateVotingScreen("Invalid address or not a registered voter", false);
                    break;
                default:
                    break;
            }
        }
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
                    <span className="w-36 h-12 mt-4 mb-6 flex justify-start items-center">
                        <p className="w-full text-sm text-red-500">{errors.addressInput?.message && errors.addressInput?.message}</p>
                    </span>
                </>
            }
            <Button title={elt.txt} color={elt.css} func={handleSubmit(onSubmit)} />
        </>
    )
}

export default AddressForm