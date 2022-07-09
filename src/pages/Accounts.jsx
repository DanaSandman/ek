import React from "react";
import { AccountsTable } from "../components/AccountsTable.jsx";

export function Accounts() {

  return (
    <div className="accounts-page">
      <h1>Ekonomia Challenge</h1>
      <AccountsTable width={"100%"}/>
    </div>
  );
}
