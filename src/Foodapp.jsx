import React, { useState } from "react";
import "./Foodapp.css"; // Importing CSS file

const Foodapp = () => {
  const API_Url = "https://trackapi.nutritionix.com/v2/natural/nutrients";
  const API_ID = "e28331cf";
  const API_KEY = "d578d9ba935d991b939fae6f0969dedf";
  const API_USER_ID = "manoharv";

  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
  const [noData, setNoData] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const data_fetching = async () => {
    setIsVisible(!isVisible);
    try {
      const response = await fetch(API_Url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-id": API_ID,
          "x-app-key": API_KEY,
          "x-remote-user-id": API_USER_ID,
        },
        body: JSON.stringify({ query: input }),
      });

      const result = await response.json();
      console.log(result);

      // Check if the message indicates no matching foods
      if (result.message && result.message.includes("couldn't match")) {
        setNoData(true);
        setOutput([]); // Clear output if no data
        return;
      }

      const filteredOutput = result.foods
        .map((food) => {
          const {
            food_name,
            brand_name,
            serving_qty,
            serving_unit,
            nf_calories,
            nf_total_fat,
            nf_protein,
          } = food;

          return {
            food_name,
            brand_name,
            serving_qty,
            serving_unit,
            nf_calories,
            nf_total_fat,
            nf_protein,
          };
        })
        .filter((food) => food.food_name && food.serving_qty !== null);

      if (filteredOutput.length === 0) {
        setNoData(true);
      } else {
        setNoData(false);
      }

      setOutput(filteredOutput);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-heading">Food Nutrition</h1> <br />
      <input
        type="text"
        className="input-field"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter food item..."
      />
      <button className="fetch-button" onClick={data_fetching}>
        Fetch Data
      </button>
      <br />
      <div
        className="output-container"
        style={{ display: isVisible ? "block" : "none" }}
      >
        {noData ? (
          <div className="no-data">No data available</div>
        ) : (
          <ul className="output-list">
            {output.map((food, index) => (
              <li key={index} className="output-item">
                <div>
                  <strong>Food Name:</strong> {food.food_name}
                </div>
                {food.brand_name && (
                  <div>
                    <strong>Brand Name:</strong> {food.brand_name}
                  </div>
                )}
                <div>
                  <strong>Serving Size:</strong> {food.serving_qty}{" "}
                  {food.serving_unit}
                </div>
                <div>
                  <strong>Calories:</strong> {food.nf_calories}
                </div>
                <div>
                  <strong>Total Fat:</strong> {food.nf_total_fat}g
                </div>
                <div>
                  <strong>Protein:</strong> {food.nf_protein}g
                </div>
                <hr />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Foodapp;
