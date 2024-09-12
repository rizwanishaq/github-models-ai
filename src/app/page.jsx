"use client";
import { useState, useRef, useEffect } from "react";
import { fetchChatCompletion } from "@/actions/openai_api";
import { FaRobot, FaUser, FaSpinner } from "react-icons/fa"; // Importing icons from react-icons

export default function Home() {
  const [response, setResponse] = useState(""); // Holds the latest response
  const [question, setQuestion] = useState(""); // Holds the current question input
  const [loading, setLoading] = useState(false); // Loading state during API call
  const [chatHistory, setChatHistory] = useState([]); // Stores the history of questions and responses
  const chatContainerRef = useRef(null); // Ref for the chat container to manage scroll

  // Scroll to the bottom of the chat container whenever chatHistory updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth", // Ensures smooth scrolling on mobile
      });
    }
  }, [chatHistory]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (question.trim() === "") return; // Prevent submitting empty questions

    setLoading(true); // Show loading state while fetching response
    const { response } = await fetchChatCompletion(question);

    // Add the new question and response to chat history
    setChatHistory((prev) => [...prev, { question, response }]);

    setResponse(response); // Update the latest response
    setQuestion(""); // Clear the input field after submission
    setLoading(false); // Hide loading state after response is received
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white font-sans">
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-blue-400">
          Chat with AI
        </h1>

        {/* Chat container */}
        <div
          ref={chatContainerRef}
          className="flex flex-col space-y-4 p-4 bg-gray-700 rounded-lg h-72 sm:h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600"
        >
          {/* Displaying the chat history */}
          {chatHistory.length > 0 ? (
            chatHistory.map((chat, index) => (
              <div key={index} className="text-gray-200">
                <div className="flex items-start space-x-2 mb-2">
                  <FaUser className="text-blue-400 text-xl" />
                  <div className="flex flex-col">
                    <div className="font-bold text-blue-400 text-sm sm:text-base">
                      {chat.question}
                    </div>
                  </div>
                </div>
                {/* Response */}
                <div className="flex items-start space-x-2">
                  <FaRobot className="text-green-400 text-xl" />
                  <div className="flex flex-col">
                    <div className="text-gray-300 text-sm sm:text-base">
                      {chat.response}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400">Ask anything!</div>
          )}

          {/* Show loading state while fetching response */}
          {loading && (
            <div className="flex items-center justify-center text-gray-400 space-x-2">
              <FaSpinner className="animate-spin text-blue-400 text-xl" />
            </div>
          )}
        </div>

        {/* Form for submitting the question */}
        <form onSubmit={handleSubmit} className="mt-6 w-full">
          <div className="flex">
            <input
              type="text"
              className="flex-grow p-3 sm:p-4 rounded-l-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Type your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)} // Update question state
              required
            />
            <button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 sm:py-4 px-5 sm:px-6 rounded-r-lg focus:outline-none transition-all duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
