import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCallback } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';

const formSchema = z.object({
  message: z.string().min(1, 'Please enter a message'),
});

export type ChatFormData = z.infer<typeof formSchema>;

interface UseChatFormProps {
  onSubmit: (message: string) => Promise<void>;
}

export function useChatForm({ onSubmit }: UseChatFormProps) {
  const form = useForm<ChatFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
    mode: 'onChange',
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = useCallback(async (data: ChatFormData) => {
    if (!data.message.trim()) {
      form.setError('message', {
        type: 'manual',
        message: 'Please enter a message'
      });
      return;
    }

    try {
      await onSubmit(data.message);
      form.reset();
    } catch (error) {
      form.setError('message', {
        type: 'manual',
        message: 'Failed to send message. Please try again.'
      });
    }
  }, [form, onSubmit]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(handleSubmit)();
    }
  }, [form, handleSubmit]);

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    form.setValue('message', value, { 
      shouldValidate: true,
      shouldDirty: true 
    });
    
    // Clear validation errors when user starts typing
    if (value.trim()) {
      form.clearErrors('message');
    }
  }, [form]);

  return {
    form,
    isSubmitting,
    handleSubmit,
    handleKeyDown,
    handleChange,
  };
}
