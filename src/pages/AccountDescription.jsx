import React, { Fragment } from "react";
import { useLocation } from "react-router-dom";
import { ProtocolsTable } from "../components/ProtocolsTable.jsx";
import { MarketsTable } from "../components/MarketsTable.jsx";

export function AccountDescription() {

  const location = useLocation();
  const accId = location.state;

  return (
    <Fragment>
      <div className="account-description-page flex column">
        <header className="account-description-header">
          <div className="account-title">
            <h1>Account:</h1>
            <p className="acc-id-title">{accId}</p>
          </div>
        </header>
        <section className="table-description-section flex column">
            <div className="protocol-table"><ProtocolsTable width={"100%"} accId={accId} /></div>
            <div className="market-table"><MarketsTable width={"100%"} accId={accId} /></div>
        </section>
      </div>
    </Fragment>
  );
}
