import { Outlet } from "react-router-dom";
import Login from "../pages/Login";

// questa funzione restituisce un oggetto json a seconda che vi sia o meno un token
// dato che viene utilizzata dall'hook 'useSession' la dobbiamo esportare
export const isAuth = () => {
    // i dati che abbiamo nel localStorage sono in formato stringa,
    // ovvero abbiamo un oggetto json dentro un'unica stringa
    // quindi per trasformarlo in oggetto JSON dobbiamo usare JSON.parse()
    return JSON.parse(localStorage.getItem('loggedInUser'))
}

// qui interviene il custom hook useSession che abbiamo
// separato all'interno di una cartella 'hooks'.
// useSession provvede a decodificare il token, controlla
// se quest'ultimo è ancora valido, reindirizza l'utente
// alla pagina di Login in caso di token non valido e
// restituisce tutti i dati dell'utente

// questo middleware controlla se l'utente è autorizzato e
// in caso affermativo restituisce il componente speciale <Outlet />
// ovvero qualsiasi componente figlio di ProtectedRoutes,
// altrimenti invoca la pagina di Login
const ProtectedRoutes = () => {
    const auth = isAuth()

    return auth ? <Outlet /> : <Login />
}

export default ProtectedRoutes;

