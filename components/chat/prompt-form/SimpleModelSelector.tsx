import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const AVAILABLE_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', provider: 'Anthropic' },
];

export type SimpleModelSelectorProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
};

export function SimpleModelSelector({
  value = 'gpt-4o',
  onValueChange,
  disabled = false,
}: SimpleModelSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const selectedModel = AVAILABLE_MODELS.find(m => m.id === value) || AVAILABLE_MODELS[0];

  const handleSelect = (modelId: string) => {
    onValueChange?.(modelId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className={cn(
            'ring-offset-background hover:bg-muted hover:text-muted-foreground',
            'flex h-8 w-auto items-center justify-center gap-1.5 rounded',
            'bg-transparent px-2 py-0 text-[12px] font-normal text-[hsl(240_5%_65%)]',
            'transition-colors [&_svg]:size-4'
          )}
        >
          <Sparkles />
          <span className="hidden sm:inline">{selectedModel.name}</span>
          <span className="sm:hidden">{selectedModel.name.split(' ')[0]}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-1">
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Select Model
          </div>
          {AVAILABLE_MODELS.map((model) => (
            <Button
              key={model.id}
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-2 h-8 px-2 text-xs",
                value === model.id && "bg-accent text-accent-foreground"
              )}
              onClick={() => handleSelect(model.id)}
            >
              <Sparkles className="size-3" />
              <div className="flex flex-col items-start">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-muted-foreground">{model.provider}</span>
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}