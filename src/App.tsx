import { useState, useEffect } from "react";
import "./App.css";

function generateClientId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function App() {
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clientId] = useState(() => {
    const stored = localStorage.getItem("cornClientId");
    if (stored) return stored;

    const newId = generateClientId();
    localStorage.setItem("cornClientId", newId);
    return newId;
  });

  useEffect(() => {
    fetchPurchaseCount();
  }, []);

  const fetchPurchaseCount = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/purchases/${clientId}`
      );
      const data = await response.json();
      if ("purchases" in data) {
        setPurchaseCount(data.purchases);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching purchase count:", error.message);
      }
    }
  };

  const buyCorn = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/buy-corn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientId }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage("🌽 Success! Enjoy your corn!");
        setPurchaseCount(data.purchases);
      } else if (response.status === 429) {
        setMessage("⚠️ Please wait one minute between purchases!");
      } else {
        setMessage(data.error || "❌ Something went wrong!");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error buying corn:", error.message);
      }
      setMessage("❌ Error connecting to server!");
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-yellow-800 mb-8">
        Bob's Corn Shop 🌽
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <p className="text-lg text-gray-600">
            Your Corn Count:{" "}
            <span className="font-bold text-yellow-600">{purchaseCount}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Client ID: {clientId.substring(0, 8)}...
          </p>
        </div>

        <button
          onClick={buyCorn}
          disabled={isLoading}
          className={`w-full py-3 px-6 text-white rounded-lg text-lg font-semibold transition
            ${
              isLoading
                ? "bg-yellow-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700"
            }`}
        >
          {isLoading ? "Purchasing..." : "Buy Corn 🌽"}
        </button>

        {message && (
          <div className="mt-4 p-3 rounded text-center text-sm">{message}</div>
        )}
      </div>
    </div>
  );
}

export default App;
