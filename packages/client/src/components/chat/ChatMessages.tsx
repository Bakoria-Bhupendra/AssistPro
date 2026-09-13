import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export type message = {
   content: string;
   role: 'user' | 'bot';
};

type props = {
   messages: message[];
};

const ChatMessages = ({ messages }: props) => {
   const lastMessageRef = useRef<HTMLDivElement | null>(null);
   const onCopyMessage = (
      e: import('react').ClipboardEvent<HTMLParagraphElement>
   ): void => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };

   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   return (
      <div className="flex flex-col flex-1 gap-3 ">
         {messages.map((message, index) => (
            <div
               key={index}
               onCopy={onCopyMessage}
               ref={index === messages.length - 1 ? lastMessageRef : null}
               className={`px-3 py-1 ${
                  message.role === 'user'
                     ? 'bg-blue-500 text-white self-end rounded-l-3xl rounded-tr-3xl'
                     : 'bg-gray-200 self-start rounded-r-3xl rounded-tl-3xl'
               }`}
            >
               <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
         ))}
      </div>
   );
};

export default ChatMessages;
