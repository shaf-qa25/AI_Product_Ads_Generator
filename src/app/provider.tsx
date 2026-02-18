"use client"
import { UserDetailContext } from '@/context/UserDetailContext';
import axios from 'axios'
import { useEffect, useState } from 'react';

function Provider({ children }: { children: React.ReactNode }) {


    const [userDetail, setUserDetail] = useState(null)

    useEffect(() => {
        CreateNewUser();
    }, [])

    const CreateNewUser = async () => {
        const result = await axios.post('/api/user', {});
        console.log(result.data);
        setUserDetail(result?.data);
    }

    return (
        <div>
            <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
                {children}

            </UserDetailContext.Provider>
        </div>
    )
}

export default Provider