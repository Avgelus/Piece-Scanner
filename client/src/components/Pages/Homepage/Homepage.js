import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import "./Homepage.css";
import Cards from "../../Cards";

function Homepage() {
    const [pieces, setPieces] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/clothes')
            .then(response => response.json())
            .then(data => setPieces(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const deleteClothing = (id) => {
        fetch(`/clothes/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setPieces(prevPieces => prevPieces.filter(piece => piece.id !== id));
                } else {
                    console.error('Failed to delete the item');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const navigateToShowcase = (id) => {
        navigate(`/Showcase/${id}`);
    };

    const filteredPieces = pieces.filter(piece => 
        piece.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div id="search">
                <TextField 
                    label="Search Clothes" 
                    variant="outlined" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Link to="/AddNewClothes">CREATE</Link>
            </div>
            
            <div id="cards">
                {filteredPieces.map((piece, i) => (
                    <React.Fragment key={piece.id}>
                        {i % 4 === 0 && i !== 0 && <div id="flex-basis"></div>}
                        <div onClick={() => navigateToShowcase(piece.id)}>
                            <Cards image={piece.image_url} />
                        </div>
                        <Button onClick={() => deleteClothing(piece.id)}>Delete</Button>
                    </React.Fragment>
                ))}
            </div> 
        </>
    );
}

export default Homepage;