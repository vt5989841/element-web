import React from "react";
import { Provider } from "../components/ui/provider";
import Login from "./components/Login";

const App: React.FC = () => {
  return (
    <Provider>
      <Login />
    </Provider>
  );
};

export default App;