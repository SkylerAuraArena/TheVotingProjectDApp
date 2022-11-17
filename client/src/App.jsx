import Booth from "./components/booth/Booth";
import Demo from "./components/Demo";
import Voting from "./components/voting/Voting";
import { EthProvider } from "./contexts/EthContext";
import MainContextProvider from "./contexts/MainContext";

function App() {
  return (
    <MainContextProvider>
        <EthProvider>
          {/* <div id="App" >
            <div className="container">
              <Demo />
            </div>
          </div> */}
          <div>
            <Voting />
          </div>
          {/* <div className="w-100 h-screen flexJIC">
            <Booth />
          </div> */}
        </EthProvider>
    </MainContextProvider>
  );
}

export default App;