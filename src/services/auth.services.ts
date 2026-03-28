import { loginSchemaType } from "@/schema/auth.schema"

export async function loginUser(formData:loginSchemaType) {
    const response = fetch("http://localhost:3000/auth/login",{
        method:"POST",
        body: JSON.stringify(formData),
        headers:{
            "Content-Type":"application/json"
        }
    })
    const data = (await response).json()
    return data
}