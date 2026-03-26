import { loginSchemaType } from "@/schema/auth.schema"

export async function loginUser(formData:loginSchemaType) {
    const response = fetch("https://ecommerce.routemisr.com/api/v1/auth/signin",{
        method:"POST",
        body: JSON.stringify(formData),
        headers:{
            "Content-Type":"application/json"
        }
    })
    const data = (await response).json()
    return data
}