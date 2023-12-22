import React, { useState } from "react";

function Review({ clothingId, onReviewSubmit }) {
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        fetch(`/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ information: reviewText, clothes_id: clothingId }),
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to submit review');
            }
        })
        .then(data => {
            onReviewSubmit(data);
            setReviewText('');
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            setSubmitting(false);
        });
    };

    return (
        <div>
            <h3>Write a Review</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    disabled={submitting}
                />
                <button type="submit" disabled={submitting}>Submit Review</button>
            </form>
        </div>
    );
}

export default Review;