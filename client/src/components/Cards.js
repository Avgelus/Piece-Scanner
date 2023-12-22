import "./Cards.css";

function Cards({ image, onClick }) {
    return (
        <div onClick={onClick}>
            <img id="image" src={image} alt="" />
        </div>
    );
}

export default Cards;