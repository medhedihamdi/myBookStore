import React from 'react';

const OrderDetails = ({ orderDetails, user }) => {
  return (
    <div className="order-box">
      <h2 style={{ color: "gray" }}>Order Details</h2>
      {orderDetails
        .filter(order => order.username === user.username) // تصفية الطلبات حسب المستخدم الحالي
        .map((order, index) => (
          <div key={index}>
            <p><strong>Order ID: </strong>{order._id}</p> {/* عرض معرف الطلب */}
            <p><strong>Name: </strong>{order.name}</p>
            <p><strong>Email: </strong>{order.email}</p>
            <p><strong>Phone: </strong>{order.phone}</p>
            <p><strong>Address: </strong>{order.address}</p>
            <p><strong>Order Send Date: </strong>{order.sendDate}</p>
            <p>{order.orderMessage}</p>
            <p>For any inquiries, please contact: <strong>{order.adminEmail}</strong></p>

            <h3>Books in Order</h3>
            {order.books.map((book) => (
              <div key={book._id}>
                <p><strong>Book: </strong>{book.name}</p>
                <p><strong>Quantity: </strong>{book.quantity}</p>
                <p><strong>Total Price: </strong>${book.totalPrice}</p>
              </div>
            ))}
            <p><strong style={{ color: "blue" }}>Total Order Price: </strong>${order.totalOrderPrice}</p>
            <p><strong style={{ color: "blue" }}>Ordered by: </strong>{order.username}</p>
            <hr />
          </div>
        ))
      }
    </div>
  );
};

export default OrderDetails;
