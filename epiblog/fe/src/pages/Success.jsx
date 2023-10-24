import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from "../layouts/MainLayout";
import useSession from '../hooks/useSession';

function Success() {
    const { token } = useParams()

    const session = useSession()
    // stampiamo i dati dell'utente ricavati dalla decodifica del token
    console.log('Success session: ', session)

    useEffect(() => {
        localStorage.setItem("loggedInUser", JSON.stringify(token))
    }, [token])

    return (
        <>
            <MainLayout>
                <div>
                    <p>Autenticazione GitHub</p>
                    <p className='token'>Il Token dell'utente: {token}</p>
                    <img className='session-avatar' src={session._json.avatar_url} />
                    <p className='session-username'>Username: {session.username}</p>
                    <p className='session-provider'>Provider: {session.provider}</p>
                    <p className='session-profile'>Profile url: {session.profileUrl}</p>
                </div>
            </MainLayout>
        </>
    );
}

export default Success;