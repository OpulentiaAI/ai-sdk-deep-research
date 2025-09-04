'use client';

import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowRight, Square, Sparkles, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SimpleModelSelector } from './SimpleModelSelector';

export type AdaptedPromptFormProps = {
  status: string;
  onSubmit: (text: string, metadata?: { model?: string }) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  placeholder?: string;
  showModelSelector?: boolean;
  showKeyboardHint?: boolean;
};

export function AdaptedPromptForm({
  status,
  onSubmit,
  inputRef,
  placeholder = 'Ask AI or @mention a model',
  showModelSelector = true,
  showKeyboardHint = true,
}: AdaptedPromptFormProps) {
  const [value, setValue] = React.useState('');
  const [selectedModel, setSelectedModel] = React.useState('gpt-4o');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const disabled = status !== 'ready';
  const isLoading = status === 'loading';

  // Forward the ref to the textarea since the original expects HTMLInputElement
  // but we're using a textarea for better UX
  React.useImperativeHandle(inputRef, () => textareaRef.current as any, []);

  const handleSubmit = (e?: React.FormEvent | KeyboardEvent) => {
    e?.preventDefault?.();
    const text = value.trim();
    if (!text || disabled) return;
    onSubmit(text, { model: selectedModel });
    setValue('');
    // Focus back after send
    textareaRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e.nativeEvent as unknown as KeyboardEvent);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        className={cn(
          'bg-background border-border relative w-full rounded border p-1.5 shadow-lg',
          'transition-all duration-200',
          disabled && 'opacity-75'
        )}
      >
        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'text-[16px] placeholder:text-[16px] md:text-[16px]',
            'min-h-[44px] max-h-48 resize-none border-0 bg-transparent p-2',
            'focus-visible:ring-0 focus-visible:ring-offset-0',
            'placeholder:text-muted-foreground/60'
          )}
        />

        {/* Actions Bar */}
        <div className="flex h-10 items-center justify-between gap-2">
          {/* Left Actions */}
          <div className="flex items-center gap-x-1.5">
            {showModelSelector && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <SimpleModelSelector
                      value={selectedModel}
                      onValueChange={setSelectedModel}
                      disabled={disabled}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Select AI model
                </TooltipContent>
              </Tooltip>
            )}

            {showKeyboardHint && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'ring-offset-background hover:bg-muted hover:text-muted-foreground',
                      'flex h-8 w-auto items-center justify-center gap-1.5 rounded',
                      'bg-transparent px-2 py-0 text-[12px] font-normal text-[hsl(240_5%_65%)]',
                      'transition-colors [&_svg]:size-4'
                    )}
                    disabled={disabled}
                  >
                    <HelpCircle />
                    <span className="hidden sm:inline">Help</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <div className="space-y-1">
                    <div><kbd className="px-1 py-0.5 text-xs bg-muted rounded">Enter</kbd> to send</div>
                    <div><kbd className="px-1 py-0.5 text-xs bg-muted rounded">Shift</kbd> + <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Enter</kbd> for new line</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-x-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  disabled={disabled || !value.trim()}
                  className={cn(
                    'h-10 w-10 rounded-none p-1',
                    'bg-[hsl(26_100%_92%)] text-[hsl(25_95%_53%)]',
                    'hover:bg-[hsl(26_100%_92%)] hover:text-[hsl(25_95%_53%)]',
                    '[&_svg]:size-5 [&_svg]:text-[hsl(25_95%_53%)]',
                    '[&_svg]:hover:text-[hsl(25_95%_53%)]',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  {isLoading ? (
                    <Square className="fill-[hsl(25_95%_53%)]" />
                  ) : (
                    <ArrowRight />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {isLoading ? 'Stop generation' : 'Send message'}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </form>
    </div>
  );
}