import React from "react";

import AppNav from "./App";

import { CheersProvider } from "./context/CheersContext";

export default function App() {
  return (
    <CheersProvider>
      <AppNav />
    </CheersProvider>
  );
}
