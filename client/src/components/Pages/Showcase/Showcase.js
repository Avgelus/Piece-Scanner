import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./Showcase.css"; 

function Showcase() {
    const [piece, setPiece] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetch(`/clothes/${id}`)
            .then(response => response.json())
            .then(data => setPiece(data))
            .catch(error => console.error('Error:', error));
    }, [id]);

    if (!piece) {
        return <p>Loading clothing item...</p>;
    }

    return (
        <div>
            <img src={piece.image_url} alt={piece.name} className="showcase-image" />
            <h2>{piece.designer_name}</h2>
            <p>{piece.name}</p>
            <p>{piece.description}</p>
            <p>Price: ${piece.price}</p>
        </div>
    );
}

export default Showcase;