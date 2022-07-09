import React from "react";
import "./styles/App.scss";
import { Accounts } from "./pages/Accounts.jsx";
import { AccountDescription } from "./pages/AccountDescription.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Accounts />} />
          <Route path="account" element={<AccountDescription />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
