import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

type message = {
   content: string;
   role: 'user' | 'bot';
};

const ChatBot = () => {
   const [messages, setMessages] = useState<message[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const conversationId = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsLoading(true);
      reset();
      const { data } = await axios.post<ChatResponse>('/api/chat', {
         prompt,
         conversationId: conversationId.current,
      });
      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
      setIsLoading(false);
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <div>
         <div className="flex flex-col gap-3 mb-10   ">
            {messages.map((message, index) => (
               <p
                  key={index}
                  className={`px-3 py-1 ${
                     message.role === 'user'
                        ? 'bg-blue-500 text-white self-end rounded-l-3xl rounded-tr-3xl'
                        : 'bg-gray-200 self-start rounded-r-3xl rounded-tl-3xl'
                  }`}
               >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
               </p>
            ))}

            {isLoading && (
               <div className="flex self-start gap-2 px-3 py-3 bg-gray-200  rounded-xl">
                  <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse [animation-delay:0.25s]"></div>
                  <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse [animation-delay:0.5s]"></div>
               </div>
            )}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (data) => data.trim().length > 0,
               })}
               className="w-full border-0 focus:outline-0 resize-none"
               placeholder="Ask anything..."
               maxLength={1000}
            />
            <button
               disabled={!formState.isValid}
               className="rounded-full p-2 bg-black text-white flex items-center"
            >
               <FaArrowUp />
            </button>
         </form>
      </div>
   );
};

export default ChatBot;
