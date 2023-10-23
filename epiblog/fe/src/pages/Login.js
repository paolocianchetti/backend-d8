import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [loginData, setLoginData] = useState({})
    const [login, setLogin] = useState(null)

    console.log(login)

    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setLoginData({
            ...loginData,
            [name]: value
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        // andiamo a contattare la nostra API
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/login`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'POST',
                body: JSON.stringify(loginData)
            })
            const data = await response.json()

            // salviamoci i dati che otteniamo in risposta dal server nel localStorage
            // ma solo se viene restituito effettivamente
            if (data.token) {
                localStorage.setItem('loggedInUser', JSON.stringify(data.token))
                navigate('/home')
            }

            // salviamo la risposta ottenuta dal server nello state login del componente
            setLogin(data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-3 flex justify-center align-items-center h-screen">
           <form
               onSubmit={onSubmit}
               className="flex flex-col gap-2 p-3 bg-slate-900 text-white rounded min-w-[400px]">
               <h1>Login</h1>
               <input
                   className="p-2 bg-zinc-100 text-black rounded"
                   type="text"
                   name="email"
                   required
                   onChange={handleInputChange}
               />
               <input
                   className="p-2 bg-zinc-100 text-black rounded"
                   type="password"
                   name="password"
                   required
                   onChange={handleInputChange}
               />
               <button
                   type="submit"
                   className="bg-green-600 p-2 rounded mt-5">
                   Login
               </button>
           </form>
        </div>
    );
};

export default Login;