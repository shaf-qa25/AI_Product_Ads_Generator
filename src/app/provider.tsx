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
        try {
            const result = await axios.post('/api/user', {});
            setUserDetail(result?.data);
        } catch (error: any) {
            // Auth or DB may not be configured yet — continue without blocking the UI
            console.warn("Provider: /api/user failed —", error?.response?.data?.error || error.message);
        }
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
