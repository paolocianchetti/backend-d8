import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAuth } from "../middlewares/ProtectedRoutes";

const useSession = () => {
    // preleviamo l'oggetto session con il token da isAuth() del
    // middleware ProtectedRoutes
    const session = isAuth()
    // se esiste allora decodifichiamo il token e quindi avremo
    // i dati dell'utente in 'decodedSession'
    const decodedSession = session ? jwtDecode(session) : null;

    const navigate = useNavigate()

    // controlliamo se il token è ancora valido, confrontando
    // la data di expiration del token con quella odierna
    const checkTokenExpirationTime = () => {
        const convertUnixDateToMillisecond = decodedSession.exp * 1000
        const expirationDate = new Date(convertUnixDateToMillisecond)
        const currentDate = new Date()

        // se la data odierna supera quella di expire del token
        // significa che il token non è più valido e allora
        // cancelliamo tutto quello che c'è nel localStorage
        if (expirationDate < currentDate) {
            localStorage.clear()
        }
    }

    useEffect(() => {
        if (!session) {
            // se non c'è una sessione valida reindirizziamo l'utente
            // sulla pagina di login. Con replace settato a true
            // impediamo all'utente di tornare indietro e cancelliamo
            // la cronologia automaticamente
            navigate('/', { replace: true })
        }
        checkTokenExpirationTime()
    }, [navigate, session]);  // riesegue il controllo della session e della
                              // validità temporale del token ogni volta che
                              // si viene reindirizzati alla pagina di Login
                              // e ogni volta che si preleva la session dal
                              // localStorage
    // restituisce i dati dell'utente presi dal token decodificato
    return decodedSession;
}

export default useSession;