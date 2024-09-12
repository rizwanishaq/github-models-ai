'use server'
import OpenAI from "openai";

/**
 * fetchChatCompletion
 * 
 * This function sends a user prompt to the OpenAI API (GPT-4 model) and returns the response from the assistant.
 * It includes error handling to manage various potential issues like API failures or unexpected responses.
 * 
 * @param {string} inputText - The user's input or question to send to the assistant.
 * @returns {object} - An object containing either the assistant's response or an error message.
 */
export const fetchChatCompletion = async (inputText) => {
    try {
        // Initialize OpenAI client with the API base URL and GitHub token for authentication.
        const client = new OpenAI({ 
            baseURL: "https://models.inference.ai.azure.com", 
            apiKey: process.env["GITHUB_TOKEN"]
        });

        // Make a request to the GPT-4 model with user input and system message.
        const response = await client.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant." }, // System instruction to the assistant
                { role: "user", content: inputText } // User's input text
            ],
            model: "gpt-4o", // GPT-4 model identifier
            temperature: 1.0, // Adjusts the creativity level of the model (higher = more creative)
            max_tokens: 1000, // Maximum length of the response
            top_p: 1.0 // Sampling technique (1.0 means no filtering out less likely tokens)
        });

        // Check if the response is valid and contains the assistant's message.
        if (response && response.choices && response.choices.length > 0) {
            const assistantMessage = response.choices[0].message.content;
            console.log(assistantMessage); // Log the assistant's response for debugging.
            return { 'response': assistantMessage }; // Return the assistant's message in an object.
        } else {
            throw new Error("No response received from the model."); // Throw an error if the response is invalid.
        }
    } catch (error) {
        // Catch and log any errors that occur during the API call or response parsing.
        console.error("Error fetching chat completion:", error.message || error);
        return { 'error': error.message || "An unexpected error occurred." }; // Return a descriptive error message.
    }
};
