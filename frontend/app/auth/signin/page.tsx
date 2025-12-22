'use client'
import {useState} from "react";
import fetchWrapper from "@/utils/fetchWrapper";

export default function SignInPage() {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const onChange = (e: any) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const signIn = async (e: any) => {
        e.preventDefault();
        console.log('sign in attempted')
        console.log(formData)
        const res = await fetchWrapper.post("/auth/signin", formData).then((res) => {
            alert("Sign in successful")
            console.log(res)
        }).catch((err) => {
            alert(err.message)
        })

    }
    return (
        <>
            <h2>Sign In</h2>
            <form onSubmit={signIn}>
                <input type="text" name="email" placeholder="Email" onChange={onChange}/>
                <input type="password" name="password" placeholder="Password" onChange={onChange}/>
                <input type="submit" value="SignIn"/>
            </form>
        </>
    )
}