// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";

/** 
 * @title Voting
 * @dev Implements voting process along with vote delegation
 */
contract Voting is Ownable {

    uint public winningProposalID;
    bool private winnerElected;
    
    struct Voter {
        bool isRegistered; // if true, that person can vote
        bool hasVoted; // if true, that person already voted
        uint votedProposalId; // index of the voted proposal
    }

    struct Proposal {
        string description; // describe what was the proposal about
        uint voteCount; // number of accumulated votes
    }

    enum  WorkflowStatus {
        RegisteringVoters, // Indicates who can vote
        ProposalsRegistrationStarted, // Indicates when people can submit proposals
        ProposalsRegistrationEnded, // Indicates when proposal submission is over
        VotingSessionStarted, // Indicates when voting campaign is opened
        VotingSessionEnded, // Indicates when voting campaign is closed
        VotesTallied // Indicates when the votes are tallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping (address => Voter) voters;
    
    //**************************************** */
    //Voir si utile
    address[] private votersAddresses;
    mapping(string => bool) proposalsDescriptions;


    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);
    event WinnerElected(uint winners);
    event NoWinnerElected(string message);
    
    /** 
     * modifier onlyVoters check whether the address is registered as a voter.
     */
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }
    
    // on peut faire un modifier pour les états

    // ::::::::::::: GETTERS ::::::::::::: //
    /** 
     * @dev Calls getVoter() function to get a boolean indicating whether the given address is registered as a voter.
     * @param _addr the address to check whether it is a registered voter's.
     * @return Voter a boolean set to true if the address is registered.
     */
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }

    /** 
     * @dev Calls getVotersList() function to get the whole registered voters addresses list.
     * @return votersList_ an coma separated list of all registered voters.
     */
    function getVotersList() external onlyVoters view returns (address[] memory votersList_) {
        votersList_ = votersAddresses;
        return votersList_;
    }   

    /** 
     * @dev Calls getVotersVotes() function to get the proposal id of a voter's vote.
     * @param _addr the address to check a voter's vote.
     * @return uint indicating the id of the choosen proposal according to the voter's address.
     */
    function getVotersVotes(address _addr) external view onlyVoters returns (uint) {
        require(uint8(workflowStatus) >= 4, "Impossible to check voter's votes since the voting session hasn't started yet.");
        require(voters[_addr].isRegistered == true, "The provided address doesn't match in the registered voters list.");
        require(voters[_addr].hasVoted == true, "The provided address hasn't voted yet.");
        return voters[_addr].votedProposalId;
    }   

    /** 
     * @dev Calls getOneProposal() function to get the one proposal informations.
     * @param _id the id to check a proposal's informations.
     * @return Proposal the whole informations of the given proposal.
     */
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }

    /** 
     * @dev Calls getProposalsList() function to get the whole proposals list.
     * @return Proposal[] an coma separated list of all registered proposals.
     */
    function getProposalsList() external onlyVoters view returns (Proposal[] memory) {
        return proposalsArray;
    } 
 
    // ::::::::::::: REGISTRATION ::::::::::::: // 
    /** 
     * @dev Calls addVoter() function anables the owner to add a voter to the voters mapping.
     * @param _addr to make an new voter linked to the address given.
     * modifier onlyOwner from Openzeppelin's contract indicating the function is only usable with the contract creator's address.
     */
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
        require(voters[_addr].isRegistered != true, 'Already registered');
    
        voters[_addr].isRegistered = true;
        votersAddresses.push(_addr);
        emit VoterRegistered(_addr);
    }

    // ::::::::::::: PROPOSAL ::::::::::::: // 
    /** 
     * @dev Calls addProposal() function to add an new proposal to the proposals list.
     * @param _desc description of the added proposal.
     */
    function addProposal(string calldata _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed yet');
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), "You cannot add en empty proposal.");
        //Here, I used a mapping over a loop to save gas fees.
        // for (uint i = 0; i < proposalsArray.length; i++) {
        //     require(keccak256(abi.encodePacked(proposalsArray[i].description)) != keccak256(abi.encodePacked(_desc)),"The provided proposition has already been registered.");
        // }
        require(proposalsDescriptions[_desc] == false,"The provided proposition has already been registered.");

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsDescriptions[_desc] = true;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1);
    }

    // ::::::::::::: VOTE ::::::::::::: //
    /** 
     * @dev Calls setVote() function anables registered voters to vote for their prefered proposal.
     * @param _id the index of the choosen proposal to vote for.
     * Only one vote per voter allowed.
     */
    function setVote(uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Voting session haven't started yet");
        require(voters[msg.sender].hasVoted != true, 'You have already voted');
        require(_id < proposalsArray.length, 'Proposal not found');

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //

    /** 
     * @dev Calls startProposalsRegistering() anables the owner to open proposals registration.
     * modifier onlyOwner form Openzeppelin's contract indicating the function is only usable with the contract creator's address.
     */
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "Registering proposals can't be started now");
        require(votersAddresses.length >= 1, "Impossible to start registering proposals because no voter is registered.");
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        
        Proposal memory proposal;
        proposal.description = "GENESIS";
        proposalsArray.push(proposal);
        
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /** 
     * @dev Calls endProposalsRegistering() anables the owner to close proposals registration.
     * modifier onlyOwner form Openzeppelin's contract indicating the function is only usable with the contract creator's address.
     */
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Registering proposals has not started yet");
        require(proposalsArray.length >= 1, "Impossible to stop proposals registration because no proposal has been registered yet.");
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /** 
     * @dev Calls startVotingSession() function anables the chairperson to open the voting session.
     * modifier onlyOwner form Openzeppelin's contract indicating the function is only usable with the contract creator's address.
     */
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /** 
     * @dev Calls endVotingSession() function anables the chairperson to close the voting session.
     * modifier onlyOwner form Openzeppelin's contract indicating the function is only usable with the contract creator's address.
     */
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Voting session has not started yet");
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /** 
     * @dev Computes the winning proposal taking all previous votes into account.
     * Then, set the winningProposalId with the winners' id.
     */
    function _countVotes() internal {
        uint winningVoteCount = 0;
        // First, the maximum vote count of the proposals list is determined.
        for (uint p = 0; p < proposalsArray.length; p++) {
            if (proposalsArray[p].voteCount > winningVoteCount) {
                winningVoteCount = proposalsArray[p].voteCount;
            }
        }
        // Then, checking is made to find the proposal with that one number.
        // If many proposals do have the same votes count, no one is elected and the vote has to start over again.
        if (winningVoteCount > 0) {
            uint winningProposalsNumber = 0;
            for (uint p = 0; p < proposalsArray.length; p++) {
                if (proposalsArray[p].voteCount == winningVoteCount) {
                    winningProposalID = p;
                    winningProposalsNumber++;
                }
            }
            if(winningProposalsNumber > 1) {
                emit NoWinnerElected("Two or more proposals have the same votes count. None is elected. The vote must start over again. Try new proposals.");
            } else {
                winnerElected = true;
                emit WinnerElected(winningProposalID);
            }
        } else {
            emit NoWinnerElected("None of the proposals has been choosen as the winning one. The vote must start over again. Try new proposals.");
        }
    }

    /** 
     * @dev Calls tallyVotes() function anables the chairperson to start the votes counting.
     * modifier onlyOwner form Openzeppelin's contract indicating the function is only usable with the contract creator's address.
     */
   function tallyVotes() external onlyOwner {
       require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
       uint _winningProposalId;
      for (uint256 p = 0; p < proposalsArray.length; p++) {
           if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
               _winningProposalId = p;
          }
       }
       winningProposalID = _winningProposalId;
       
       workflowStatus = WorkflowStatus.VotesTallied;
       emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}