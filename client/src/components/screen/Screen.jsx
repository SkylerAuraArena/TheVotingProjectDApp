import { useEffect, useRef } from 'react'
import useMainContext from '../../contexts/MainContext/useMainContext'

const Screen = () => {
    const { mainContextState } = useMainContext()
    const screenRef = useRef(null)

    useEffect(() => {
        screenRef.current.innerText = mainContextState.votingDeviceScreenTxt
    }, [mainContextState.votingDeviceScreenTxt]);
    

    return (
        <div className="h-2/6 w-52 flex justify-center items-start p-2 bg-black text-matrixGreen shadow-2xl overflow-y-auto">
            <div ref={screenRef} className="flexJIC text-xl cursor-default"></div>
        </div>
    )
}

export default Screen