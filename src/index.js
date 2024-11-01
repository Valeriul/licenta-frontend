import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/data") // Ensure this is your actual API endpoint
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>Data from .NET API</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>
            {item.name} - {item.age}
          </li>
        ))}
      </ul>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
