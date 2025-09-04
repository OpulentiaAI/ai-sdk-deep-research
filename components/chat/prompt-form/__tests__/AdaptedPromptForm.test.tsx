import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdaptedPromptForm } from '../AdaptedPromptForm';
import { TooltipProvider } from '@/components/ui/tooltip';
import * as React from 'react';

// Mock the UI components
jest.mock('@/components/ui/textarea', () => ({
  Textarea: React.forwardRef<HTMLTextAreaElement, any>(({ ...props }, ref) => (
    <textarea ref={ref} {...props} />
  )),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

jest.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ children }: any) => <div>{children}</div>,
  PopoverContent: ({ children }: any) => <div>{children}</div>,
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <TooltipProvider>
      {component}
    </TooltipProvider>
  );
};

describe('AdaptedPromptForm', () => {
  const mockOnSubmit = jest.fn();
  const mockInputRef = React.createRef<HTMLInputElement>();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders with default props', () => {
    renderWithProviders(
      <AdaptedPromptForm
        status="ready"
        onSubmit={mockOnSubmit}
        inputRef={mockInputRef}
      />
    );

    expect(screen.getByPlaceholderText('Type your message…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted', async () => {
    renderWithProviders(
      <AdaptedPromptForm
        status="ready"
        onSubmit={mockOnSubmit}
        inputRef={mockInputRef}
      />
    );

    const textarea = screen.getByPlaceholderText('Type your message…');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('Test message', { model: 'gpt-4o' });
    });
  });

  it('submits on Enter key press', async () => {
    renderWithProviders(
      <AdaptedPromptForm
        status="ready"
        onSubmit={mockOnSubmit}
        inputRef={mockInputRef}
      />
    );

    const textarea = screen.getByPlaceholderText('Type your message…');

    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('Test message', { model: 'gpt-4o' });
    });
  });

  it('does not submit on Shift+Enter', () => {
    renderWithProviders(
      <AdaptedPromptForm
        status="ready"
        onSubmit={mockOnSubmit}
        inputRef={mockInputRef}
      />
    );

    const textarea = screen.getByPlaceholderText('Type your message…');

    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('disables input when status is not ready', () => {
    renderWithProviders(
      <AdaptedPromptForm
        status="loading"
        onSubmit={mockOnSubmit}
        inputRef={mockInputRef}
      />
    );

    const textarea = screen.getByPlaceholderText('Type your message…');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    expect(textarea).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('clears input after successful submission', async () => {
    renderWithProviders(
      <AdaptedPromptForm
        status="ready"
        onSubmit={mockOnSubmit}
        inputRef={mockInputRef}
      />
    );

    const textarea = screen.getByPlaceholderText('Type your message…') as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(textarea, { target: { value: 'Test message' } });
    expect(textarea.value).toBe('Test message');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(textarea.value).toBe('');
    });
  });

  it('does not submit empty messages', () => {
    renderWithProviders(
      <AdaptedPromptForm
        status="ready"
        onSubmit={mockOnSubmit}
        inputRef={mockInputRef}
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});