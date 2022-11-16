import Booth from "./components/booth/Booth";
import { EthProvider } from "./contexts/EthContext";
import MainContextProvider from "./contexts/MainContext";

function App() {
  return (
    <MainContextProvider>
        <EthProvider>
          {/* <div id="App" >
            <div className="container">
              <Intro />
              <hr />
              <Setup />
              <hr />
              <Demo />
              <hr />
              <Footer />
            </div>
          </div> */}
          <div className="w-100 h-screen flexJIC">
            <Booth />
          </div>
        </EthProvider>
    </MainContextProvider>
  );
}

export default App;