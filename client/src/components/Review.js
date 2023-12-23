import React, { useState, useEffect } from "react";

function Review({ clothingId, reviewData, onReviewSubmit, onUpdate }) {
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const isEditMode = reviewData !== undefined;

    useEffect(() => {
        if (isEditMode) {
            setReviewText(reviewData.information);
        }
    }, [reviewData, isEditMode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const url = isEditMode ? `/reviews/${reviewData.id}` : `/reviews`;
        const method = isEditMode ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                information: reviewText, 
                clothes_id: clothingId 
            }),
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(isEditMode ? 'Failed to update review' : 'Failed to submit review');
            }
        })
        .then(data => {
            isEditMode ? onUpdate(data) : onReviewSubmit(data);
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
            <h3>{isEditMode ? "Edit Review" : "Write a Review"}</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    disabled={submitting}
                />
                <button type="submit" disabled={submitting}>{isEditMode ? "Update Review" : "Submit Review"}</button>
            </form>
        </div>
    );
}

export default Review;