import { HashRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/main/index.js";
import Home from './views/home/index.js';
import Punk from "./views/punk/index.js";
import Punks from "./views/punks/index.js";

function App() {
  return (

    <HashRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="punks" element={<Punks />} />
          <Route path="punks/:tokenId" element={<Punk />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
}

export default App;
