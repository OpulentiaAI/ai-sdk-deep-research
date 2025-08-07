import { ResearchUpdateAnnotations } from '@/components/message-annotations';
import { ChatMessage } from '@/lib/ai/types';
import { Artifact, artifactDefinitions } from '@/components/artifact';
import type { ArtifactKind } from '@/lib/artifacts/artifact-kind';
import { Markdown } from '@/components/markdown';

export default function Message({
  message,

}: {
  message: ChatMessage;
 
}) {
  const date = message.metadata?.createdAt
    ? new Date(message.metadata.createdAt).toLocaleString()
    : '';
  const isUser = message.role === 'user';

  return (
    <div
      className={`whitespace-pre-wrap my-2 p-3 rounded-lg shadow
        ${isUser ? 'bg-blue-100 text-right ml-10' : 'bg-gray-100 text-left mr-10'}`}
    >
      <div className="mb-1 text-xs text-gray-500">{date}</div>
      <div className="font-semibold">{isUser ? 'User:' : 'AI:'}</div>
      
      <ResearchUpdateAnnotations
          parts={message.parts}
          key={`research-update-annotations-${message.id}`}
        />

      <div>
        <Markdown>
          {message.parts
            .map(part => (part.type === 'text' ? part.text : ''))
            .join('')}
        </Markdown>
      </div>
      
      {/* Display artifact if present */}
      <Artifact
    parts = {message.parts}
      />
      
    </div>
  );
}
