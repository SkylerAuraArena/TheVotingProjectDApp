import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Button } from "../button/Button";
import useEth from "../../../contexts/EthContext/useEth";

const schema = yup.object({
    addressInput: yup.string("The description must be a string").required("A description is required"),
  }).required()

const Form = ({ elt }) => {

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })
    const addressInputRef = useRef(null)
    const onSubmit = data => handleFormSubmission(data)
    const { ref, ...rest } = register('addressInput')
    const { state: { contract, accounts } } = useEth();
    
    const handleFormSubmission = async (data) => {
        const returnValue = !errors.addressInput?.message && await contract.methods[elt.func.name](data.addressInput).send({ from: accounts[0] });
        returnValue && console.log(returnValue);
    }

    useEffect(() => {
        addressInputRef.current.focus()
    }, [])

    return (
        <>
            <form className="w-full flexJIC flex-col gap-2 mt-8" onSubmit={handleSubmit(onSubmit)}>
                <input role="presentation" autoComplete="off" {...rest} name="addressInput" id="addressInput" placeholder="Address" className="w-36 px-3 py-2 mb-3 text-lg rounded-3xl outline-none shadow-xl font-semibold text-neutral-400" ref={(e) => {
                    ref(e) 
                    addressInputRef.current = e 
                }} />
            </form>
            <Button title={elt.txt} color={elt.css} func={handleSubmit(onSubmit)} />
            <span className="w-36 h-12 flex justify-start items-center">
                <p className="w-full text-sm text-red-500">{errors.addressInput?.message && errors.addressInput?.message}</p>
            </span>
        </>
    )
}

export default Form