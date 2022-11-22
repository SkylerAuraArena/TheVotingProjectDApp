import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Button } from "../button/Button";
import useEth from "../../../contexts/EthContext/useEth";
import useMainContext from "../../../contexts/MainContext/useMainContext";

const schema = yup.object({
    idInput: yup.number().integer("The provided id must be an integer").required("An id is required"),
  }).required()

const UintForm = ({ elt }) => {

    const { updateVotingScreen, solidityFunctionsList } = useMainContext()
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })
    const idInputRef = useRef(null)
    const onSubmit = data => handleFormSubmission(data)
    const { ref, ...rest } = register('idInput')
    const { state: { contract, accounts } } = useEth();
    
    const handleFormSubmission = async (data) => {
        const trimmedData = data.idInput.toString().trim();
        let returnValue;
        try {
            if(elt.func.mode === "send"){
                // !errors.idInput?.message && await contract.methods[elt.func.name](trimmedData).send({ from: accounts[0] });
                returnValue = !errors.idInput?.message && await contract.methods[elt.func.name](trimmedData ?? trimmedData).send({ from: accounts[0] });
            } else {
                // await contract.methods[elt.func.name](trimmedData ?? trimmedData).call({ from: accounts[0] });   
                returnValue = !errors.idInput?.message && await contract.methods[elt.func.name](trimmedData ?? trimmedData).call({ from: accounts[0] });   
                switch (elt.func.name) {
                    case solidityFunctionsList.voter.getOneProposal:
                        const proposalInformations = `Proposal n°${trimmedData} -> ${returnValue.description} : ${returnValue.voteCount} votes`;
                        updateVotingScreen(proposalInformations, true)
                        break;
                    default:
                        break;
                }
            }
            // returnValue && console.log(returnValue);   
        } catch (error) {
            switch (elt.func.name) {
                case solidityFunctionsList.voter.getOneProposal:
                    updateVotingScreen("Invalid id or proposals list empty", false);
                    break;
                case solidityFunctionsList.voter.setVote:
                    updateVotingScreen("Invalid id or already voted", false);
                    break;
                default:
                    break;
            }
        }
        idInputRef.current.value = "";
        idInputRef.current.focus();
    }

    useEffect(() => {
        idInputRef.current.focus()
    }, [])

    return (
        <>
            <form className="w-full flexJIC flex-col gap-2 mt-3" onSubmit={handleSubmit(onSubmit)}>
                <input role="presentation" autoComplete="off" {...rest} name="idInput" id="idInput" placeholder="ID" className="w-36 px-3 py-2 mb-3 text-lg rounded-3xl outline-none shadow-xl font-semibold text-neutral-600" ref={(e) => {
                    ref(e) 
                    idInputRef.current = e 
                }} />
            </form>
            {
                errors.idInput?.message && <>
                    <span className="w-36 h-12 mb-3 flex justify-start items-center">
                        <p className="w-full text-sm text-red-500">{errors.idInput?.message && errors.idInput?.message.substring(0, 26) === "idInput must be a `number`" ? "The provided id must be a number" : errors.idInput?.message}</p>
                    </span>
                </>
            }

            <Button title={elt.txt} color={elt.css} func={handleSubmit(onSubmit)} />
        </>
    )
}

export default UintForm