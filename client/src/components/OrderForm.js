import React from 'react';


const OrderForm = ({ userInfo, setUserInfo, handleFormSubmit, setShowForm , setShowSummary }) => {
  return (
    <div className="order-form">
      <h3>Enter Your Information</h3>
      <label>
        Name:
        <input type="text" value={userInfo.name} onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} />
      </label>
      <label>
        Email:
        <input type="email" value={userInfo.email} onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} />
      </label>
      <label>
        Phone:
        <input type="tel" value={userInfo.phone} onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })} />
      </label>
      <label>
        Address:
        <input type="text" value={userInfo.address} onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })} />
      </label>
      <button onClick={handleFormSubmit}>Submit</button>
      <button onClick={() => {
        setShowForm(false);
        setShowSummary(true); // Show Order Summary after cancellation
      }}>Cancel</button>
    </div>
  );
};

export default OrderForm;
