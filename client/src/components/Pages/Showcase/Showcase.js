import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Review from "../../Review";
import "./Showcase.css";

function Showcase() {
    const [piece, setPiece] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [editingReview, setEditingReview] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchReviews = () => {
        fetch(`/reviews?clothes_id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setReviews(data);
                    setEditingReview(null);
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

    const addOrUpdateReview = (reviewData) => {
        if (editingReview) {
            setReviews(prevReviews => prevReviews.map(review => 
                review.id === reviewData.id ? reviewData : review
            ));
        } else {
            setReviews(prevReviews => [...prevReviews, reviewData]);
        }
        fetchReviews();
    };

    const goToHomepage = () => {
        navigate('/Homepage');
    };

    if (!piece) {
        return <p>Loading clothing item...</p>;
    }

    return (
        <div className="showcase-container">
            <button onClick={goToHomepage} className="go-home-button">Go to Homepage</button>

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
                        <button onClick={() => setEditingReview(review)}>Edit</button>
                    </div>
                ))}
            </div>

            {editingReview ? (
                <Review 
                    reviewData={editingReview} 
                    onUpdate={addOrUpdateReview} 
                />
            ) : (
                <Review 
                    clothingId={id} 
                    onReviewSubmit={addOrUpdateReview} 
                />
            )}
        </div>
    );
}

export default Showcase;