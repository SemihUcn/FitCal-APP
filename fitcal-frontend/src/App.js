import React from "react";
import LoginScreen from "./components/LoginScreen";
import { UserProvider } from './context/UserContext';


function App() {
  return (
    <div className="App">
       <UserProvider>
       <LoginScreen />
       </UserProvider>
    </div>
  );
}

export default App;
