import Booth from "./components/booth/Booth";
// import Demo from "./components/Demo";
// import Voting from "./components/voting/Voting";
import { EthProvider } from "./contexts/EthContext";
import MainContextProvider from "./contexts/MainContext/MainContextProvider";

function App() {
  return (
    <EthProvider>
        <MainContextProvider>
          {/* <div id="App" >
            <div className="container">
              <Demo />
            </div>
          </div> */}
          {/* <div>
            <Voting />
          </div> */}
          <div className="w-100 h-screen flexJIC">
            <Booth />
          </div>
        </MainContextProvider>
      </EthProvider>
  );
}

export default App;