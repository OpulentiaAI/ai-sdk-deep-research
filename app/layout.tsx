import { ArtifactProvider } from '@/components/use-artifact';
import './globals.css';
import { DataStreamProvider } from '@/components/data-stream-provider';

export const metadata = {
  title: 'AI SDK - Next.js OpenAI Examples',
  description: 'Examples of using the AI SDK with Next.js and OpenAI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DataStreamProvider>
          <ArtifactProvider>{children}</ArtifactProvider>
        </DataStreamProvider>
      </body>
    </html>
  );
}
