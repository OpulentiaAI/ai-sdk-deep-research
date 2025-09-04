import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

// Simple model types for ai-sdk-deep-research
type ModelType = string;

interface ModelInfo {
  id: string;
  name: string;
  provider: string;
}

// Available models for ai-sdk-deep-research
const AVAILABLE_MODELS: ModelInfo[] = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai' },
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'anthropic' },
  { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', provider: 'anthropic' },
];

export function ModelSelector({
  selectedModel,
  handleSelectModel,
}: {
  selectedModel: string;
  handleSelectModel: (model: string) => void;
}) {
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "." && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsModelSelectorOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const selectedModelInfo = AVAILABLE_MODELS.find(m => m.id === selectedModel);

  return (
    <Popover open={isModelSelectorOpen} onOpenChange={setIsModelSelectorOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:bg-accent px-2 font-normal"
            >
              <span>
                {selectedModelInfo?.name || selectedModel || "GPT-4o"}
              </span>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        {!isModelSelectorOpen && (
          <TooltipContent side="top" align="start" shortcut="⌘.">
            Model Selector
          </TooltipContent>
        )}
      </Tooltip>
      <PopoverContent
        align="start"
        className="flex flex-col gap-0.5 overflow-hidden rounded-lg p-0"
      >
        <div className="flex flex-col gap-0.5 rounded-lg p-1.5">
          {AVAILABLE_MODELS.map((model) => (
            <Button
              key={model.id}
              size="sm"
              variant="ghost"
              className="hover:bg-accent justify-start font-normal"
              onClick={() => {
                handleSelectModel(model.id);
                setIsModelSelectorOpen(false);
              }}
            >
              <span>{model.name}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
