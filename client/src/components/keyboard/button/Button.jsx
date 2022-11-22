import useEth from "../../../contexts/EthContext/useEth";
import useMainContext from "../../../contexts/MainContext/useMainContext"

export const Button = ({ title, color, func, args = false }) => {

  const { mainContextState, profiles, handleKeyboardBtnClick, solidityFunctionsList, updateVotingScreen, workflowStatusChangeEventCheck } = useMainContext()
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
          workflowStatusChangeEventCheck();
        } catch (error) {
          if(mainContextState.profile === profiles.admin){
            switch (func.name) {
              case solidityFunctionsList.admin.addVoter:
                  updateVotingScreen("Trx rejected or impossible to add new voters now", false)
                  break;
              case solidityFunctionsList.admin.startProposalsRegistering:
                  updateVotingScreen("Trx rejected, no voter registered or session already started / over", false)
                  break;
              case solidityFunctionsList.admin.endProposalsRegistering:
                  updateVotingScreen("Trx rejected or impossible to end the proposal registration now", false)
                  break;
              case solidityFunctionsList.admin.startVotingSession:
                  updateVotingScreen("Trx rejected or impossible to start the voting session now", false)
                  break;
              case solidityFunctionsList.admin.endVotingSession:
                  updateVotingScreen("Trx rejected or impossible to end the voting session now", false)
                  break;
              case solidityFunctionsList.admin.tallyVotes:
                  updateVotingScreen("Trx rejected or impossible to tally votes now", false)
                  break;
              default:
                  updateVotingScreen("Invalid action", false)
                  break;
            }
          } else {
            switch (func.name) {
              case solidityFunctionsList.voter.getVotersList:
                  updateVotingScreen("You may not get the voters list : you're not a voter or no list available", false)
                  break;
              case solidityFunctionsList.voter.getVoter:
                  updateVotingScreen("You may not get the voters informations : you're not a voter or no list available", false)
                  break;
              case solidityFunctionsList.voter.getVotersVotes:
                  updateVotingScreen("Trx rejected or impossible to end the proposal registration now", false)
                  break;
              case solidityFunctionsList.voter.getProposalsList:
                  updateVotingScreen("Trx rejected or impossible to start the voting session now", false)
                  break;
              case solidityFunctionsList.voter.getOneProposal:
                  updateVotingScreen("Trx rejected or impossible to end the voting session now", false)
                  break;
              case solidityFunctionsList.voter.addProposal:
                  updateVotingScreen("Trx rejected or impossible to tally votes now", false)
                  break;
              case solidityFunctionsList.voter.setVote:
                  updateVotingScreen("Trx rejected or impossible to end the voting session now", false)
                  break;
              case solidityFunctionsList.voter.winningProposalID:
                  updateVotingScreen("Trx rejected or impossible to tally votes now", false)
                  break;
              default:
                  updateVotingScreen("Invalid action", false)
                  break;
            }
          }
        }
        // returnValue = await contract.methods[func.name]().send({ from: accounts[0] });
        // await contract.methods[func.name]().send({ from: accounts[0] });
      } else if (func.mode === "call") {
        try {
          returnValue = await contract.methods[func.name]().call({ from: accounts[0] });  
          console.log("fsdfjskldfjs",returnValue); 
          switch (func.name) {
            case solidityFunctionsList.voter.getVotersList:
                // const addressesList = returnValue.map((addr, index) => index === 0 ? `Enlisted voters : ${formatETHAddress(addr)}` : ` ${formatETHAddress(addr)}`);
                const addressesList = returnValue.map((addr, index) => index === 0 ? `Enlisted voters : ${addr}` : ` ${addr}`);
                updateVotingScreen(addressesList, true)
                break;
            case solidityFunctionsList.voter.getProposalsList:
                const proposalsList = returnValue.map((prop, index) => index === 0 ? `Registered proposals : n°${index} -> ${prop.description} : ${prop.voteCount} votes` : ` n°${index} -> ${prop.description} : ${prop.voteCount} votes`);
                updateVotingScreen(proposalsList, true)
                break;
            default:
                break;
          }
        } catch (error) {
          if(mainContextState.profile === profiles.voter){
            switch (func.name) {
              case solidityFunctionsList.voter.getVotersList:
                  updateVotingScreen("Trx rejected or impossible to get the voters list : not registered or no list available", false)
                  break;
              case solidityFunctionsList.voter.startProposalsRegistering:
                  updateVotingScreen("Trx rejected or no voter registered or session already started / over", false)
                  break;
              case solidityFunctionsList.voter.endProposalsRegistering:
                  updateVotingScreen("Trx rejected or impossible to end the proposal registration now", false)
                  break;
              case solidityFunctionsList.voter.startVotingSession:
                  updateVotingScreen("Trx rejected or impossible to start the voting session now", false)
                  break;
              case solidityFunctionsList.voter.endVotingSession:
                  updateVotingScreen("Trx rejected or impossible to end the voting session now", false)
                  break;
              case solidityFunctionsList.voter.tallyVotes:
                  updateVotingScreen("Trx rejected or impossible to tally votes now", false)
                  break;
              default:
                  updateVotingScreen("Invalid action", false)
                  break;
            }
          }
        }
        // returnValue = await contract.methods[func.name]().call({ from: accounts[0] });   
        // await contract.methods[func.name]().call({ from: accounts[0] });   
      }
    } else {
      handleKeyboardBtnClick(txt)
    }
    returnValue && console.log("Terminado",returnValue);
  }

  return (
    <button className={css} title={title} onClick={(e) => handleClick(e)}>{title}</button>
  )
}