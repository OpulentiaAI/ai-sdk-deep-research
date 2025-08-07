'use client';

import { invalidateRouterCache } from '@/app/actions';
import { ChatMessage } from '@/lib/ai/types';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef } from 'react';
import ChatInput from './chat-input';
import Message from './message';

export default function ChatComponent({
  chatData,
  isNewChat = false,
  resume = false,
}: {
  chatData: { id: string; messages: ChatMessage[] };
  isNewChat?: boolean;
  resume?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { status, sendMessage, messages } = useChat({
    id: chatData.id,
    messages: chatData.messages,
    resume,
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => {
        switch (trigger) {
          case 'regenerate-message':
            // omit messages data transfer, only send the messageId:
            return {
              body: {
                trigger: 'regenerate-message',
                id,
                messageId,
              },  
            };

          case 'submit-message':
            // only send the last message to the server to limit the request size:
            return {
              body: {
                trigger: 'submit-message',
                id,
                message: messages[messages.length - 1],
                messageId,
              },
            };
        }
      },
    }),
    onFinish() {
      // for new chats, the router cache needs to be invalidated so
      // navigation to the previous page triggers SSR correctly
      if (isNewChat) {
        invalidateRouterCache();
      }

      // focus the input field again after the response is finished
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    },
  });

  // activate the input field
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col py-24 mx-auto w-full max-w-3xl stretch">
      {messages.map(message => (
        <Message
          key={message.id}
          message={message}
        />
      ))}
      <ChatInput
        status={status}
        onSubmit={text => {
          sendMessage({ text, metadata: { createdAt: Date.now() } });

          if (isNewChat) {
            window.history.pushState(null, '', `/chat/${chatData.id}`);
          }
        }}
        inputRef={inputRef}
      />
    </div>
  );
}
