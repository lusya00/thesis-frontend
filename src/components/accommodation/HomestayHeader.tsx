
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const HomestayHeader = () => {
  // Function to open the chatbot directly with a homestay query
  const openChatWithQuery = () => {
    // Find the existing chat component in the DOM
    const chatbotElement = document.querySelector('.ChatBot');
    
    // Simulate a click on the chat button if found
    if (chatbotElement) {
      const chatButton = chatbotElement.querySelector('button');
      if (chatButton && chatButton instanceof HTMLElement) {
        chatButton.click();
        
        // Give the chat a moment to open, then set the query
        setTimeout(() => {
          const inputField = document.querySelector('.ChatBot input');
          if (inputField instanceof HTMLInputElement) {
            inputField.value = "I'm looking for a homestay";
            
            // Trigger the send button
            const sendButton = inputField.parentElement?.querySelector('button[aria-label="Send message"]');
            if (sendButton && sendButton instanceof HTMLElement) {
              sendButton.click();
            }
          }
        }, 500);
      }
    }
  };

  return (
    <div className="text-center mb-12 relative">
      <h1 className="text-3xl font-bold text-ocean-dark mb-4">Available Homestays</h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Discover our selection of comfortable homestays on Untung Jawa Island, each offering unique experiences and local hospitality.
      </p>
      
      <div className="mt-6 flex justify-center">
        <Button 
          onClick={openChatWithQuery}
          variant="outline" 
          className="flex items-center gap-2 border-blue-300 hover:bg-blue-50 text-blue-600"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Ask Pulau Pal for recommendations</span>
        </Button>
      </div>
    </div>
  );
};

export default HomestayHeader;
