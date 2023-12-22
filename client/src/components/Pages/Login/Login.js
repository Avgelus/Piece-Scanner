import React, {useState} from "react"
import {useFormik} from "formik"
import * as yup from "yup";

import {useOutletContext } from "react-router-dom";

import {Button, FormControl, Input, InputLabel, TextField} from "@mui/material"




function Login() {
    const [signup, setSignup] = useState(true)
    const {setUser, navigate} = useOutletContext()
    const signupSchema = yup.object().shape({
        username: yup.string().min(5, "Too Short!").max(15, "Too Long!").required("Required!"),
        email: yup.string().email("Invalid email!"),
        password: yup.string().min(5, "Too Short!").max(15, "Too Long!").required("Required!")
    })

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: ""
        },
        validationSchema: signupSchema,
        onSubmit: (values) => {
            const endpoint = signup ? "/signup" : "/login"
            fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(values)
            }).then((resp) => {
                if (resp.ok) {
                    resp.json().then((user) => {setUser(user); navigate("/Homepage")});
                } else {
                    console.log("errors? handle them")
                }
            })
        }

    })
console.log(formik.errors)

function toggleSignup() {
    setSignup((currentSignup) => !currentSignup)
}

return (
    <>
        <Button onClick={toggleSignup}>{signup ? "Login" : "Register to create an account"}</Button>
        <form onSubmit={formik.handleSubmit}>
            {signup && <TextField
                id="firstName"
                label="First Name"
                variant="outlined"
                required
                value={formik.values.firstName}
                onChange={formik.handleChange}
            />}
            {signup && <TextField
                id="lastName"
                label="Last Name"
                variant="outlined"
                required
                value={formik.values.lastName}
                onChange={formik.handleChange}
            />}
            <TextField
                id="username"
                label="Username"
                variant="outlined"
                required
                value={formik.values.username}
                onChange={formik.handleChange}
            />
            {signup && <TextField
                id="email"
                label="Email"
                variant="outlined"
                required
                value={formik.values.email}
                onChange={formik.handleChange}
            />}
            <TextField
                 id="password"
                 label="Password"
                 type="password"
                 variant="outlined"
                 required
                 value={formik.values.password}
                 onChange={formik.handleChange}
            />
            <Button variant="contained" type="submit">Submit</Button>
        </form>
    </>
);
}

export default Login