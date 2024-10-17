import React from 'react';

const OrderSummary = ({ order, calculateTotalOrderPrice, handleDeleteOrder, handleGoToForm  }) => {
  return (
    <div className="order-section">
      <h2>Your Order</h2>
      {order.map((book) => (
        <div key={`${book._id}-${book.quantity}`} className="order-book">
          <h3>{book.name}</h3>
          <p><strong>Quantity: </strong>{book.quantity}</p>
          <p><strong>Total Price: </strong>${book.totalPrice}</p>
          <button onClick={() => handleDeleteOrder(book._id)}>Delete from Order</button>
        </div>
      ))}
      <h3><strong>Total Order Price: </strong>${calculateTotalOrderPrice()}</h3>
      <button onClick={handleGoToForm }>Go to form</button>
    </div>
  );
};

export default OrderSummary;
