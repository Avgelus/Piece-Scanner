import React, {useState} from "react"
import {useFormik} from "formik"
import * as yup from "yup";

import {Button, FormControl, Input, InputLabel, TextField} from "@mui/material"




function Login() {

    const signupSchema = yup.object().shape({
        username: yup.string().min(5, "Too Short!").max(15, "Too Long!").required("Required!"),
        email: yup.string().email("Invalid email!").required("Required"),
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
            fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(values)
            }).then((resp) => {
                if (resp.ok) {
                    resp.json().then((data) => console.log(data))
                } else {
                    console.log("errors? handle them")
                }
            })
        }

    })

    return(
        <form onSubmit={formik.handleSubmit}>
            <TextField
                id="firstName"
                label="firstName"
                variant="outlined"
                required
                value={formik.values.firstName}
                onChange={formik.handleChange}
            />
            <TextField
                id="lastName"
                label="lastName"
                variant="outlined"
                required
                value={formik.values.lastName}
                onChange={formik.handleChange}
            />
            <TextField
                id="username"
                label="username"
                variant="outlined"
                required
                value={formik.values.username}
                onChange={formik.handleChange}
            />
            <TextField
                id="email"
                label="email"
                variant="outlined"
                required
                value={formik.values.email}
                onChange={formik.handleChange}
                />
            <TextField
                 id="password"
                 label="password"
                 type="password"
                variant="outlined"
                required
                value={formik.values.password}
                onChange={formik.handleChange}
                />
            <Button variant="contained" type="submit">Submit</Button>
        </form>
    )
}

export default Login