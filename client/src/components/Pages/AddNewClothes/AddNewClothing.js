import React, { useState } from "react";
import Input from '@mui/material/Input';
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./AddNewClothes.css";

function AddNewClothes() {
    const [clothes, setClothes] = useState([]);
    const navigate = useNavigate();

    const formikSchema = yup.object().shape({
        designer_name: yup.string().required("Designer name is required"),
        name: yup.string().required("Name is required"),
        description: yup.string().required("Description is required"),
        showcase: yup.string(),
        price: yup.number().typeError("Price must be a number"),
        owner_id: yup.number().typeError("Owner ID must be a number"),
    });

    const formik = useFormik({
        initialValues: {
            designer_name: "",
            name: "",
            description: "",
            showcase: "",
            price: "",
            owner_id: "",
            image_url: "",
        },
        validationSchema: formikSchema,
        onSubmit: (values, { resetForm }) => {
            fetch("/clothes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to add new clothes item');
                }
            })
            .then((newItem) => {
                setClothes([...clothes, newItem]);
                resetForm();
                navigate('/Homepage');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        },
    });

    const goToHomepage = () => {
        navigate('/Homepage')
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="designerName">Designer Name:</label>
            <Input 
                id="designerName" 
                name="designer_name" 
                value={formik.values.designer_name} 
                onChange={formik.handleChange}
                type="text" 
            />

            <label htmlFor="name">Name:</label>
            <Input 
                id="name" 
                name="name" 
                value={formik.values.name} 
                onChange={formik.handleChange}
                type="text" 
            />

            <label htmlFor="description">Description:</label>
            <Input 
                id="description" 
                name="description" 
                value={formik.values.description} 
                onChange={formik.handleChange}
                type="text" 
            />

            <label htmlFor="showcase">Showcase:</label>
            <Input 
                id="showcase" 
                name="showcase" 
                value={formik.values.showcase} 
                onChange={formik.handleChange}
                type="text" 
            />

            <label htmlFor="price">Price:</label>
            <Input 
                id="price" 
                name="price" 
                value={formik.values.price} 
                onChange={formik.handleChange}
                type="number" 
            />

            <label htmlFor="ownerId">Owner ID:</label>
            <Input 
                id="ownerId" 
                name="owner_id" 
                value={formik.values.owner_id} 
                onChange={formik.handleChange}
                type="number" 
            />

            <label htmlFor="imageURL">Image URL:</label>
            <Input 
                id="imageURL" 
                name="image_url" 
                value={formik.values.image_url} 
                onChange={formik.handleChange}
                type="text"
                placeholder="Image URL"
            />

            <Button type="submit">Create Clothes</Button>
            <Button onClick={goToHomepage}>Go to Homepage</Button>
        </form>
    );
}

export default AddNewClothes;
