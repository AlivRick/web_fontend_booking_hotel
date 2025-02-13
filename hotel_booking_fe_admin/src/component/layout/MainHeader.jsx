import React from "react";

const MainHeader = () => {
  return (
    <header className="header-banner">
      <div className="overlay"></div>
      <div className="animated-texts overlay-content">
        <h1>
          Welcome to <span className="hotel-color">Booking Hotel</span>
        </h1>
        <h4>Experience luxury and comfort like never before.</h4>
      </div>
    </header>
  );
};

export default MainHeader;
