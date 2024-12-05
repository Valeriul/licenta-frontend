import React from 'react';
import Navbar from '../../components/navbar/Navbar';

function Home() {
  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: "var(--warm-beige)", height:"100vh",justifyContent:"center",display:"flexColumn",alignItems:"center",textAlign:"center"}}>
        <h1>Welcome to the Home Page!</h1>
        <p>Here will be pp presentation!</p>
      </div>
    </>
  );
}

export default Home;
