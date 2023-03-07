import "./App.css";
import NavBar from "./Components/NavBar";
import Index from "./Pages/Home/Home";
import { Login } from "./Pages/Home/Login";
import { Signup } from "./Pages/Home/Signup";

function App() {
  return (
    <div>
      <NavBar />
      <Index />
      {/* <Login /> */}
      {/* <Signup /> */}
    </div>
  );
}

export default App;
