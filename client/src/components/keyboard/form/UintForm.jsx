import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Button } from "../button/Button";
import useEth from "../../../contexts/EthContext/useEth";

const schema = yup.object({
    idInput: yup.number("The provided id must be a number").integer("The provided id must be an integer").required("An id is required"),
  }).required()

const UintForm = ({ elt }) => {

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })
    const idInputRef = useRef(null)
    const onSubmit = data => handleFormSubmission(data)
    const { ref, ...rest } = register('idInput')
    const { state: { contract, accounts } } = useEth();
    
    const handleFormSubmission = async (data) => {
        const returnValue = !errors.idInput?.message && await contract.methods[elt.func.name](data.idInput).send({ from: accounts[0] });
        returnValue && console.log(returnValue);
    }

    useEffect(() => {
        idInputRef.current.focus()
    }, [])

    return (
        <>
            <form className="w-full flexJIC flex-col gap-2 mt-8" onSubmit={handleSubmit(onSubmit)}>
                <input role="presentation" autoComplete="off" {...rest} name="idInput" id="idInput" placeholder="ID" className="w-36 px-3 py-2 mb-3 text-lg rounded-3xl outline-none shadow-xl font-semibold text-neutral-400" ref={(e) => {
                    ref(e) 
                    idInputRef.current = e 
                }} />
            </form>
            <Button title={elt.txt} color={elt.css} func={handleSubmit(onSubmit)} />
            <span className="w-36 h-12 flex justify-start items-center">
                <p className="w-full text-sm text-red-500">{errors.idInput?.message && errors.idInput?.message}</p>
            </span>
        </>
    )
}

export default UintForm