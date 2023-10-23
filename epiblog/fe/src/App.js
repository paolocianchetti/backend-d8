import "./app.scss"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoutes from "./middlewares/ProtectedRoutes";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Login />} />
                {/* vogliamo proteggere la rotta Home*/}
                <Route element={<ProtectedRoutes />}>
                    {/* qualsiasi rotta presente qui all'interno verrà
                        processata secondo la logica del middleware
                        ProtectedRoutes */}
                    <Route path="/home" element={<Home />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
