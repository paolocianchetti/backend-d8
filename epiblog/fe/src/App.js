import "./app.scss"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Success from "./pages/Success";
import About from "./pages/About";
import Browse from "./pages/Browse";
import ProtectedRoutes from "./middlewares/ProtectedRoutes";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route element={<ProtectedRoutes />}>
                    {/* qualsiasi rotta presente qui all'interno verrà
                        processata secondo la logica del middleware
                        ProtectedRoutes */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/browse" element={<Browse />} />
                    <Route path="/success/:token" element={<Success />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
