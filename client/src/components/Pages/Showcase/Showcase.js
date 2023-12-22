import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Review from "../../Review";
import "./Showcase.css";

function Showcase() {
    const [piece, setPiece] = useState(null);
    const [reviews, setReviews] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        fetch(`/clothes/${id}`)
            .then(response => response.json())
            .then(data => setPiece(data))
            .catch(error => console.error('Error:', error));

        fetch(`/reviews?clothes_id=${id}`)
            .then(response => response.json())
            .then(data => setReviews(data))
            .catch(error => console.error('Error fetching reviews:', error));
    }, [id]);

    if (!piece) {
        return <p>Loading clothing item...</p>;
    }

    return (
        <div className="showcase-container">
            <div className="clothing-details">
                <img src={piece.image_url} alt={piece.name} className="clothing-image" />
                <h2>{piece.designer_name}</h2>
                <p>{piece.name}</p>
                <p>{piece.description}</p>
                <p>Price: ${piece.price}</p>
            </div>

            <div className="reviews-section">
                <h3>Reviews</h3>
                {reviews.map(review => (
                    <div key={review.id} className="review">
                        <p>{review.content}</p>
                    </div>
                ))}
            </div>

            <Review clothingId={id} />
        </div>
    );
}

export default Showcase;