import React from 'react';

const CartBooks = ({ cartBooks, quantities, handleQuantityChange, addToOrder, handleDeleteFromCart }) => {
  return (
    <div className="cart-books">
      {cartBooks.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartBooks.map((book, index) => (
          <div key={`${book._id}-${index}`} className="cart-book">
            <div id="cart-book-info">
              <h3 style={{ color: "red" }}>{book.name}</h3>
              <p><strong>Author: </strong>{book.author}</p>
            </div>
            <div id="cart-book-price">
              <p><strong>Price: </strong> ${book.price}</p>
              <strong style={{ paddingRight: "5px" }}>quantity:</strong>
              <input
                type="number"
                value={quantities[book._id] || 1}
                onChange={(e) => handleQuantityChange(book._id, Number(e.target.value))}
                min="1"
              />
              <p><strong style={{ color: "blue" }}>Total Price: </strong>${book.price * (quantities[book._id] || 1)}</p>
            </div>
            <div id="cart-book-pay">
              <button onClick={() => addToOrder(book)}>Add to Order</button>
              <button onClick={() => handleDeleteFromCart(book._id)}>Delete from Cart</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CartBooks;
