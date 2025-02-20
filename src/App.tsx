import React from "react";
import { Login } from "./pages/Login/Login.tsx";
import { PoolsShow } from "./pages/Pools/PoolsShow.tsx";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


const App: React.FC = () => {
    return (
                <Router>
                        <Routes>
                            <Route path="/Login" element={<Login/>}></Route>
                            <Route path="/" element={<PoolsShow/>}></Route>
                        </Routes>
                </Router>
    );
};

export default App;
