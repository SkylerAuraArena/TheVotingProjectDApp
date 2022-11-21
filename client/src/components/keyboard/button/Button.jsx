import useEth from "../../../contexts/EthContext/useEth";
import useMainContext from "../../../contexts/MainContext/useMainContext"

export const Button = ({ title, color, func, args = false }) => {

  const { mainContextState, profiles, handleKeyboardBtnClick, solidityFunctionsList, updateVotingScreen } = useMainContext()
  const { state: { contract, accounts } } = useEth();

  const css = `w-36 p-2 border-2 rounded-2xl text-white text-center text-base font-medium shadow-shadowBox hover:shadow-shadowBoxHover ${color}`

  const handleClick = async e => {
    const txt = e.target.title
    let returnValue;
    if(func && !args) {
      func();
    } else if(func && args){
      if (func.mode === "send") {
        try {
          returnValue = await contract.methods[func.name]().send({ from: accounts[0] });
          switch (func.name) {
            case solidityFunctionsList.admin.startProposalsRegistering:
                console.log("fsdfjskldfjs",returnValue);
                // updateVotingScreen(returnValue[0] ? "This address is registered as a voter" : "This address is not registered as a voter")
                break;
            default:
                break;
          }
        } catch (error) {
          console.log(mainContextState.profile, profiles.admin, func.name);
          if(mainContextState.profile === profiles.admin){
            switch (func.name) {
              case solidityFunctionsList.admin.addVoter:
                  updateVotingScreen("Impossible to add new voters now.")
                  break;
              case solidityFunctionsList.admin.startProposalsRegistering:
                  updateVotingScreen("Impossible : no voter registered or session already started / over.")
                  break;
              case solidityFunctionsList.admin.endProposalsRegistering:
                  updateVotingScreen("Impossible de end the proposal registration now.")
                  break;
              case solidityFunctionsList.admin.startVotingSession:
                  updateVotingScreen("Impossible de start the voting session now.")
                  break;
              case solidityFunctionsList.admin.endVotingSession:
                  updateVotingScreen("Impossible de end the voting session now.")
                  break;
              case solidityFunctionsList.admin.tallyVotes:
                  updateVotingScreen("Impossible to tally votes now.")
                  break;
              default:
                  updateVotingScreen("Invalid action")
                  break;
            }
          } else {
            switch (func.name) {
              case solidityFunctionsList.voter.getVotersList:
                  updateVotingScreen("You may not get the voters list.")
                  break;
              case solidityFunctionsList.voter.getVoter:
                  updateVotingScreen("")
                  break;
              case solidityFunctionsList.voter.getVotersVotes:
                  updateVotingScreen("Impossible de end the proposal registration now.")
                  break;
              case solidityFunctionsList.voter.getProposalsList:
                  updateVotingScreen("Impossible de start the voting session now.")
                  break;
              case solidityFunctionsList.voter.getOneProposal:
                  updateVotingScreen("Impossible de end the voting session now.")
                  break;
              case solidityFunctionsList.voter.addProposal:
                  updateVotingScreen("Impossible to tally votes now.")
                  break;
              case solidityFunctionsList.voter.setVote:
                  updateVotingScreen("Impossible de end the voting session now.")
                  break;
              case solidityFunctionsList.voter.winningProposalID:
                  updateVotingScreen("Impossible to tally votes now.")
                  break;
              default:
                  updateVotingScreen("Invalid action")
                  break;
            }
          }
        }
        // returnValue = await contract.methods[func.name]().send({ from: accounts[0] });
        // await contract.methods[func.name]().send({ from: accounts[0] });
      } else if (func.mode === "call") {
        returnValue = await contract.methods[func.name]().call({ from: accounts[0] });   
        // await contract.methods[func.name]().call({ from: accounts[0] });   
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