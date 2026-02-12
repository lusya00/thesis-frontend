import { homestayService, Homestay } from './homestayService';

// Knowledge base about Untung Jawa
const untungJawaInfo = {
  location: "Untung Jawa is a small island located in the Thousand Islands archipelago, north of Jakarta, Indonesia.",
  transportation: "Visitors can reach Untung Jawa by boat from Muara Angke or Marina Ancol ports in Jakarta.",
  attractions: [
    "Beautiful beaches with clear water",
    "Mangrove forests",
    "Snorkeling and diving spots",
    "Local seafood restaurants",
    "Cultural performances"
  ],
  activities: [
    "Swimming",
    "Snorkeling",
    "Island hopping",
    "Kayaking",
    "Cycling around the island",
    "Beach camping"
  ],
  bestTimeToVisit: "The best time to visit is during the dry season from April to October.",
  accommodations: "Various homestays are available on the island, ranging from basic to more comfortable options."
};

// FAQ data
const faqData = [
  {
    question: "How do I get to Untung Jawa?",
    answer: "You can take a boat from either Muara Angke or Marina Ancol ports in Jakarta. The journey takes approximately 30-45 minutes."
  },
  {
    question: "What activities can I do on Untung Jawa?",
    answer: "You can enjoy swimming, snorkeling, island hopping, kayaking, cycling around the island, and beach camping."
  },
  {
    question: "How do I book a homestay?",
    answer: "You can book a homestay through our website by navigating to the Homestays page, selecting your preferred accommodation, and following the booking process."
  },
  {
    question: "What is the best time to visit?",
    answer: "The best time to visit is during the dry season from April to October when the weather is more predictable and the sea is calmer."
  },
  {
    question: "Are there restaurants on the island?",
    answer: "Yes, there are several local seafood restaurants and small eateries on the island offering fresh seafood and Indonesian cuisine."
  }
];

export const knowledgeService = {
  // Get general information about Untung Jawa
  getUntungJawaInfo: () => {
    return untungJawaInfo;
  },
  
  // Get FAQ data
  getFAQs: () => {
    return faqData;
  },
  
  // Get current homestay listings
  getCurrentHomestays: async () => {
    try {
      const homestays = await homestayService.getAllHomestays();
      return homestays;
    } catch (error) {
      console.error('Error fetching homestay data for knowledge base:', error);
      return [];
    }
  },
  
  // Generate context for the AI based on the current state of the app
  generateAIContext: async () => {
    try {
      const homestays = await homestayService.getAllHomestays();
      
      // Format homestay information in a concise way
      const homestayInfo = homestays.map((homestay: Homestay) => ({
        id: homestay.id,
        title: homestay.title,
        price: homestay.base_price,
        location: homestay.location,
        maxGuests: homestay.max_guests
      }));
      
      // Combine all knowledge
      return {
        generalInfo: untungJawaInfo,
        faqs: faqData,
        availableHomestays: homestayInfo
      };
    } catch (error) {
      console.error('Error generating AI context:', error);
      return {
        generalInfo: untungJawaInfo,
        faqs: faqData,
        availableHomestays: []
      };
    }
  }
}; 