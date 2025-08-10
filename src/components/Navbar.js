import React from 'react';

function Navbar({ loggedIn, onLogout }) {
  return (
    <div className="bg-gray-800 text-white px-4 py-2 flex justify-between">
      <h1>JWT Auth</h1>
      {loggedIn && (
        <button onClick={onLogout} className="text-sm bg-red-500 px-2 py-1 rounded">Logout</button>
      )}
    </div>
  );
}

export default Navbar;
