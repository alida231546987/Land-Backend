import { useEffect, useState } from "react"

export default function useUser(){
    const [user, setUser] = useState(null)
    useEffect(()=>{
        let data = sessionStorage.getItem('fragmark_user');
       
        if(data){
            data = JSON.parse(data);
            setUser({...data})
        }
    },[])

   return {
    ...user ?? null
   }
}