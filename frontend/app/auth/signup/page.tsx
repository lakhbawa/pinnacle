'use client'
import {useState} from "react";
import fetchWrapper from "@/utils/fetchWrapper";

export default function SignUpPage() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        company: ""
    })
    const onChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const signUp = async (e: any) => {
        e.preventDefault();
        console.log('sign in attempted')
        console.log(formData)
        const res = await fetchWrapper.post("/auth/signup", formData).then((res) => {
            alert("Sign up successful")
            console.log(res)
        }).catch((err) => {
            alert(err.message)
        })

    }
    return (
        <>
            <h2>Sign Up</h2>
        <form onSubmit={signUp}>
            <input type="text" name="name" placeholder="Name"  onChange={onChange} />
            <input type="text" name="company" placeholder="Company"  onChange={onChange} />

            <input type="text" name="email" placeholder="Email"  onChange={onChange} />
            <input type="password" name="password" placeholder="Password" onChange={onChange} />
            <input type="submit" value="Sign Up" />
        </form>
        </>
    )
}