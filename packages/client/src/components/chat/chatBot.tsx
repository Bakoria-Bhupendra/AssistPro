import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import TypingIndicator from './TypingIndicator';
import type { message } from './ChatMessages';
import ChatMessages from './ChatMessages';
import ChatInput, { type ChatFormData } from './ChatInput';

type ChatResponse = {
   message: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<message[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');

   const conversationId = useRef(crypto.randomUUID());

   const onSubmit = async ({ prompt }: ChatFormData) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsLoading(true);
         setError('');
         const { data } = await axios.post<ChatResponse>('/api/chat', {
            prompt,
            conversationId: conversationId.current,
         });
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
      } catch (error) {
         console.error('Error sending message:', error);
         setError('An error occurred while sending the message.');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto  ">
            <ChatMessages messages={messages} />{' '}
            {/* Display the chat messages */}
            {isLoading && <TypingIndicator />}{' '}
            {/* Show typing indicator when loading */}
            {error && <p className="text-red-500">{error}</p>}{' '}
            {/* Show error message if there's an error */}
         </div>
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};

export default ChatBot;
