import React from "react";

import "./Error.css";

export default function Error() {
  return (
    <div className="error">
      <h1 className="error__title">Something went wrong...</h1>
      <p className="error__descrip">
        It appears that our servers are down at the moment. We have been made
        aware of this and are working on fixing it right now. Thank you for your
        patience.
      </p>
    </div>
  );
}
