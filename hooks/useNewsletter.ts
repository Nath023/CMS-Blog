import { useState } from 'react';
import { subscribeToNewsletter } from '@/lib/database';

export function useNewsletter() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    const formData = new FormData(e.currentTarget);
    const result = await subscribeToNewsletter(formData);
    
    if (result.error) {
      setMessage({ text: result.error, type: 'error' });
    } else if (result.success) {
      setMessage({ text: result.success, type: 'success' });
      (e.target as HTMLFormElement).reset();
    }
    
    setLoading(false);
  };

  return { loading, message, handleSubmit };
}
