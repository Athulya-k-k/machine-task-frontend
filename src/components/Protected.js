import React, { useEffect, useState } from 'react';
import api from '../api';

function Protected() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('protected/')
      .then(res => setMessage(res.data.message))
      .catch(err => setMessage("Not Authorized"));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Protected API Response:</h1>
      <p>{message}</p>
    </div>
  );
}

export default Protected;
