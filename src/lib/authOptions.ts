import {NextAuthOptions} from "next-auth"
import Credentials from "next-auth/providers/credentials"

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
                    const user = await response.json();
                    if(response.ok && user){
                        return user;
                    }
                    return null;
                 }
        })
    ]
}