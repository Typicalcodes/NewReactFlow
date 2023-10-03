import logo from './logo.svg';
import './App.css';
import Flow from './Components/flow';
import Dropper from './Components/Dropper';

function App() {
  return (
    <>
    <div style={{ display:"flex", justifyContent: "center",height: '100vh', alignContent: "center",border: "2px solid green"}}>
    <Flow/>
    <Dropper/>
    </div>
    </>
  );
}

export default App;
