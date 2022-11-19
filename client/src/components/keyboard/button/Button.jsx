import useEth from "../../../contexts/EthContext/useEth";
import useMainContext from "../../../contexts/MainContext/useMainContext"

export const Button = ({ title, color, func, arg }) => {

  const { handleKeyboardBtnClick } = useMainContext()
  const { state: { contract, accounts } } = useEth();

  const css = `w-36 p-3 border-2 rounded-2xl text-white text-center text-base font-medium shadow-shadowBox hover:shadow-shadowBoxHover ${color}`

  const handleClick = async e => {
    const txt = e.target.title
    let returnValue;
    if(func && !func.params) {
      func();
    } else if(func && func.params){
      if (func.mode === "send") {
        returnValue = await contract.methods[func.name](arg).send({ from: accounts[0] });
      } else if (func.mode === "call") {
        returnValue = await contract.methods[func.name](arg).call({ from: accounts[0] });   
      }
    } else {
      handleKeyboardBtnClick(txt)
    }
    returnValue && console.log(returnValue);
  }

  return (
    <button className={css} title={title} onClick={(e) => handleClick(e)}>{title}</button>
  )
}