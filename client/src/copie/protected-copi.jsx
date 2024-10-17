import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // قم بإزالة الأقواس من الاستيراد
import axios from 'axios';

const ProtectedSection = ({ books }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const user = jwtDecode(token);

  useEffect(() => {
    if (!token) {
      return <p>Please log in to access this page</p>;
    }

    // Fetch cart items when the component mounts
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:4000/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(response.data); // Assuming the response is an array of book IDs
      } catch (error) {
        console.error('Error fetching cart items', error);
      }
    };

    if (token) {
      fetchCartItems();
    }
  }, [token]);

  const addToCart = async (bookId) => {
    // Check if the book is already in the cart
    if (cartItems.some(item => item._id === bookId)) {
      alert('This book is already in your cart!');
      return;
    }

    try {
      await axios.post('http://localhost:4000/cart', { bookId }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Book added to cart!');
      setCartItems([...cartItems, { _id: bookId }]); // Update the cart items state
    } catch (error) {
      console.error('Error adding to cart', error);
    }
  };

  const goToCart = () => {
    navigate('/cart');
  };

  const goToAdminDashboard = () => {
    navigate('/admin');
  };

  return (
    <div  id='protected'  style={{margin:"10px"}}>
      <div id='head-protectContainer' style={{display:"flex" , justifyContent:"space-between", margin:"20px"}}>
      <h2 style={{color:"brown"}}  >Welcome, <span style={{color:"gold"}}> {user.username} </span></h2>    <button   onClick={goToCart}>Go to Cart</button>
      {user.role === 'admin' && (
        <div>
          <button onClick={goToAdminDashboard} style={{margin:"20px"}}>Go to Admin Dashboard</button>
        </div>
      )}
      </div>
     
      <div className="row">
        {books.map(book => (
          <div key={book._id} className="col-md-4 mb-4" >
            <div className="card h-100 shadow-lg">
              <img 
                src={book.imageUrl} 
                alt={`Image of ${book.name}`} 
                className="card-img-top img-fluid" 
                style={{height:'55%', objectFit: 'cover' }} 
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-center mb-3" style={{ color: '#007bff', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {book.name}
                </h5>
                <p className="card-text"><strong>Author:</strong> {book.author}</p>
                <p className="card-text"><strong>Genre:</strong> {book.genre}</p>
                <p className="card-text"><strong>Price:</strong> ${book.price}</p>
                <p className="card-text"><strong>Pages:</strong> {book.pages}</p>
                <p className="card-text"><strong>Volumes:</strong> {book.volumes}</p>

                {/* زر عرض الوصف مع القدرة على التوسيع */}
                <Description description={book.description} />
                <button   onClick={() => addToCart(book._id)}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
     
    </div>
  );
};

const Description = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-auto">
      <button 
        className="btn btn-link p-0" 
        onClick={() => setIsExpanded(!isExpanded)} 
        aria-expanded={isExpanded}
        style={{ color: '#007bff', fontWeight: 'bold', background:'white' }}
      >
        {isExpanded ? 'Hide Description' : 'Show Description +'}
      </button>
      {isExpanded && (
        <div 
          className="mt-2 p-2" 
          style={{ 
            border: '1px solid #007bff', 
            borderRadius: '5px', 
            maxHeight: '20%', 
            overflowY: 'auto', 
            backgroundColor: '#f8f9fa' 
          }}
        >
          <p className="card-text">{description}</p>
        </div>
      )}
    </div>
  );
};




export default ProtectedSection;



