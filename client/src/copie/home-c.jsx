import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = ({ books }) => {
  return (
    <div className="home">
      <h1 className="text-center mb-5">Book Collection</h1>
      <div className="row">
        {books.map(book => (
          <div key={book._id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-lg">
              <img 
                src={book.imageUrl} 
                alt={`Image of ${book.name}`} 
                className="card-img-top img-fluid" 
                style={{ height: '55%', objectFit: 'cover' }} 
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// مكون لإظهار وإخفاء الوصف
const Description = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-auto">
      <button 
        className="btn btn-link p-0" 
        onClick={() => setIsExpanded(!isExpanded)} 
        aria-expanded={isExpanded}
        style={{ color: '#007bff', fontWeight: 'bold' , background:"white"}}
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



export default Home;
