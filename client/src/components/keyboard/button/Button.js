import useEth from "../../../contexts/EthContext/useEth";
import useMainContext from "../../../contexts/MainContext/useMainContext"

export const Button = ({ title, color, func, setter }) => {

  const { handleKeyboardBtnClick } = useMainContext()
  const { state: { contract, accounts } } = useEth();

  const css = `w-36 p-3 border-2 rounded-2xl text-white text-center text-base font-medium shadow-shadowBox hover:shadow-shadowBoxHover ${color}`

  const handleClick = async e => {
    const txt = e.target.title
    let value;
    const addr = "0x6708b0B189cffa3E00D7170021C53c27384689D1"
    if(func) {
      switch (func.name) {
        case "addVoter":
          value = await contract.methods.addVoter(addr).send({ from: accounts[0] });
          break;
        case "startProposalsRegistering":
          value = await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
          break;
        case "endProposalsRegistering":
          value = await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
          break;
        case "startVotingSession":
          value = await contract.methods.startVotingSession().send({ from: accounts[0] });
          break;
        case "endVotingSession":
          value = await contract.methods.endVotingSession().send({ from: accounts[0] });
          break;
        case "tallyVotes":
          value = await contract.methods.endVotingSession().send({ from: accounts[0] });
          break;
        case "getVotersList":
          value = await contract.methods.getVotersList.call();
          break;
        case "getVoter":
          value = await contract.methods.getVoter.call();
          break;
        case "getVotersVotes":
          value = await contract.methods.getVotersVotes.call();
          break;
        case "getProposalsList":
          value = await contract.methods.getProposalsList.call();
          break;
        case "getOneProposal":
          value = await contract.methods.getOneProposal.call();
          break;
        case "addProposal":
          value = await contract.methods.addProposal.send({ from: accounts[0] });
          break;
        case "setVote":
          value = await contract.methods.setVote.send({ from: accounts[0] });
          break;
        case "winningProposalID":
          value = await contract.methods.winningProposalID.send({ from: accounts[0] });
          break;
        default:
          break;
      }
    } else {
      handleKeyboardBtnClick(txt)
    }
    console.log(value);
    // setter && setter([`Entraînement : ${title}`, title])
  }

  // value = await contract.methods.addVoter("0xc54b6C801ba82A17885E605F1aAfa3efd84eD3E1").send({ from: accounts[0] });
  // value = await contract.methods.getVotersList().call({ from: accounts[0] });

  return (
    <button className={css} title={title} onClick={(e) => handleClick(e)}>{title}</button>
  )
}