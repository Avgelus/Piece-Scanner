import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Review from "../../Review";
import "./Showcase.css";

function Showcase() {
    const [piece, setPiece] = useState(null);
    const [reviews, setReviews] = useState([]);
    const { id } = useParams();

    const fetchReviews = () => {
        fetch(`/reviews?clothes_id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setReviews(data);
                } else {
                    console.error('Fetched data is not an array:', data);
                }
            })
            .catch(error => console.error('Error fetching reviews:', error));
    };

    useEffect(() => {
        fetch(`/clothes/${id}`)
            .then(response => response.json())
            .then(data => setPiece(data))
            .catch(error => console.error('Error:', error));

        fetchReviews();
    }, [id]);

    const addNewReview = (newReview) => {
        setReviews(prevReviews => [...prevReviews, newReview]);
        fetchReviews();
    };

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
                        <p>{review.information}</p>
                    </div>
                ))}
            </div>

            <Review clothingId={id} onReviewSubmit={addNewReview} />
        </div>
    );
}

export default Showcase;
