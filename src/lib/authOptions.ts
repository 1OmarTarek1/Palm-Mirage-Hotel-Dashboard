import {NextAuthOptions} from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { jwtDecode } from "jwt-decode";

export const authOptions: NextAuthOptions ={
    providers :[
        Credentials({
            name:"Credentials",
            credentials : {
                email:{label:"Email" , type:"text" , placeholder:"Please Enter Your Email"},
                password:{label:"Password" , type:"password",placeholder:"******"}
                },
                authorize :async (credentials)=>{
                    const response = await fetch("http://localhost:5000/auth/login",{
                        method:"POST",
                        body:JSON.stringify(credentials),
                        headers:{
                            "Content-Type":"application/json"
                        }
                    })
                    const data = await response.json();
                    if(data.message == "Done"){
                        const decodedToken:{id:string} = jwtDecode(data.token)
                        return {
                            id:decodedToken.id,
                            user:data.user,
                            token:data.token
                        }
                    }
                    else{
                        throw new Error (data.message || "Wrong Credintials")
                    }
                }
        }
    )
    ]
}