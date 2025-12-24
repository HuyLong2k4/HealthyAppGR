import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

// Gemini API endpoint
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const BACKEND_API_URL = process.env.EXPO_PUBLIC_API_URL;

export const ChatProvider = ({ children }) => {
  const { user, token } = useAuth();
  const userId = user?._id || 'guest';
  
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history from backend when user changes
  useEffect(() => {
    // Reset state when user changes
    setMessages([]);
    
    const loadChatHistory = async () => {
      console.log('Loading chat for userId:', userId);
      
      if (userId === 'guest' || !token) {
        // Guest mode - use AsyncStorage
        try {
          const key = `chat_history_${userId}`;
          const savedChat = await AsyncStorage.getItem(key);
          
          if (savedChat) {
            setMessages(JSON.parse(savedChat));
          } else {
            setMessages([]);
          }
        } catch (error) {
          console.error('Error loading guest chat:', error);
        }
        return;
      }

      // Logged in user - load from backend
      try {
        const response = await fetch(`${BACKEND_API_URL}/messages/recent`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Loaded messages:', data.length, 'messages for user:', userId);
          
          if (data.length === 0) {
            // No chat history - show welcome message
            const welcomeMessage = [{
              id: 'welcome-1',
              text: 'Xin chào! Tôi là trợ lý AI sức khỏe. Tôi có thể giúp gì cho bạn?',
              sender: 'ai',
              timestamp: new Date().toISOString(),
            }];
            setMessages(welcomeMessage);
          } else {
            // Transform backend format to frontend format
            const formattedMessages = data.map(msg => ({
              id: msg._id,
              text: msg.content,
              sender: msg.role === 'user' ? 'user' : 'ai',
              timestamp: msg.createdAt,
            }));
            setMessages(formattedMessages);
          }
        } else {
          console.error('Failed to load chat history from backend');
          setMessages([]);
        }
      } catch (error) {
        console.error('Error loading chat history from backend:', error);
        setMessages([]);
      }
    };

    loadChatHistory();
  }, [userId, token]);

  // Send message to Gemini AI
  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    // Add user message
    const newUserMessage = {
      id: Date.now().toString(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Build context from conversation history
      const conversationHistory = messages
        .slice(-3) // Last 3 messages for context
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n');

      // System prompt for health assistant
      const systemPrompt = `Bạn là một trợ lý AI chuyên về sức khỏe và chăm sóc sức khỏe. 
Lịch sử hội thoại:
${conversationHistory}
User: ${userMessage}
Assistant:`;
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4000,
            topP: 0.8,
            topK: 10,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error:', errorData);
        throw new Error('Không thể kết nối với AI. Vui lòng thử lại.');
      }

      const data = await response.json();
      
      // Debug: Log full response to see structure
      console.log('Gemini API Response:', JSON.stringify(data, null, 2));
      
      // Extract AI response - try multiple paths
      let aiResponse = '';
      
      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        
        // Try different response structures
        if (candidate.content?.parts?.[0]?.text) {
          aiResponse = candidate.content.parts[0].text;
        } else if (candidate.text) {
          aiResponse = candidate.text;
        } else if (candidate.output) {
          aiResponse = candidate.output;
        } else {
          console.log('Unexpected response structure:', candidate);
          aiResponse = 'Xin lỗi, tôi không thể trả lời câu hỏi này.';
        }
      } else {
        console.log('No candidates in response:', data);
        aiResponse = 'Xin lỗi, tôi không thể trả lời câu hỏi này.';
      }

      // Add AI message
      const newAiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, newAiMessage]);
      
      // Save to backend if logged in
      if (userId !== 'guest' && token) {
        try {
          const response = await fetch(`${BACKEND_API_URL}/messages/chat`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userMessage: userMessage,
              aiResponse: aiResponse,
              metadata: data,
            }),
          });

          if (response.ok) {
            console.log('Chat saved to backend');
          } else {
            console.error('Failed to save chat to backend');
          }
        } catch (error) {
          console.error('Error saving to backend:', error);
        }
      } else {
        // Guest mode - save to AsyncStorage
        const updatedMessages = [...messages, newUserMessage, newAiMessage];
        await AsyncStorage.setItem(`chat_history_${userId}`, JSON.stringify(updatedMessages));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessage]);
      
      // Save error to AsyncStorage for guest only
      if (userId === 'guest') {
        const updatedMessages = [...messages, newUserMessage, errorMessage];
        await AsyncStorage.setItem(`chat_history_${userId}`, JSON.stringify(updatedMessages));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearChat = async () => {
    setMessages([]);
    
    // Clear from backend if logged in
    if (userId !== 'guest' && token) {
      try {
        await fetch(`${BACKEND_API_URL}/messages/all`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Error clearing chat from backend:', error);
      }
    } else {
      // Guest mode - clear AsyncStorage
      try {
        await AsyncStorage.removeItem(`chat_history_${userId}`);
      } catch (error) {
        console.error('Error clearing guest chat:', error);
      }
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
