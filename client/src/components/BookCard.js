import React, { useState } from "react";

const BookCard = ({ book, showAddToCart, addToCart }) => {
  return (
    <div  className="col-md-4 mb-4">
      <div className="card h-100 shadow-lg">
        <img
          src={book.imageUrl}
          alt={book.name}
          className="card-img-top img-fluid"
          style={{ height: "55%", objectFit: "cover" }}
        />
        <div className="card-body d-flex flex-column">
          <h5
            className="card-title text-center mb-3"
            style={{ color: "#007bff", fontSize: "1.5rem", fontWeight: "bold" }}
          >
            {book.name}
          </h5>
          <p className="card-text">
            <strong>Author:</strong> {book.author}
          </p>
          <p className="card-text">
            <strong>Genre:</strong> {book.genre}
          </p>
          <p className="card-text">
            <strong>Price:</strong> ${book.price}
          </p>
          <p className="card-text">
            <strong>Pages:</strong> {book.pages}
          </p>
          <p className="card-text">
            <strong>Volumes:</strong> {book.volumes}
          </p>

          <Description description={book.description} />

          {showAddToCart && (
            <button onClick={() => addToCart(book._id)}>Add to Cart</button>
          )}
        </div>
      </div>
    </div>
  );
};

// Component to handle description expansion
const Description = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-auto" style={{maxHeight:'40%'}}>
      <button
        className="btn btn-link p-0"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        style={{ color: "#007bff", fontWeight: "bold", background: "white" }}
      >
        {isExpanded ? "Hide Description" : "Show Description +"}
      </button>
      {isExpanded && (
        <div
          className="mt-2 p-2"
          style={{
            border: "1px solid #007bff",
            borderRadius: "5px",
            maxHeight: "100%",
            overflowY: "auto",
            backgroundColor: "#f8f9fa",
          }}
        >
          <p className="card-text">{description}</p>
        </div>
      )}
    </div>
  );
};

export default BookCard;
