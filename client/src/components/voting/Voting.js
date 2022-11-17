import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Voting() {
  const { state: { contract, accounts } } = useEth();
  const [inputText, setInputText] = useState("");

  const getStatus = async () => {
    const text = await contract.methods.workflowStatus().call({ from: accounts[0] });
    setInputText(text);
  };
  const changeStatus = async () => {
    const text = await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
    console.log(text);
  };

  // const setGreet = async e => {
    // if (e.target.tagName === "INPUT") {
    //   return;
    // }
    // if (inputText === "") {
    //   alert("Please enter a value to write.");
    //   return;
    // }
    // const newText = inputText;
    // await contract.methods.setGreet(newText).send({ from: accounts[0] });
  // };

  return (
    <div className="flexJIC flex-col gap-24 mt-12">
        <button className="cursor-pointer" onClick={changeStatus}>
            changeStatus
        </button>
        <button className="cursor-pointer" onClick={getStatus}>
            getStatus
        </button>
        <div>Voting : {inputText}</div>
    </div>
  )
}

export default Voting