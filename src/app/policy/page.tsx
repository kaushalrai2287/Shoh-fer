'use client';

import { useEffect, useState } from 'react';
import PolicyEditor from '../../../components/PolicyEditor';
import { getPolicyFromSupabase, savePolicyToSupabase } from '../../../lib/policyService';

export default function PolicyPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const title = 'privacy_policy'; // or 'terms_conditions'

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const existing = await getPolicyFromSupabase(title);
        setContent(existing);
      } catch (err) {
        console.error(err);
        alert('Failed to load policy');
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, []);

  const handleSave = async (newContent: string) => {
    try {
      await savePolicyToSupabase(newContent, title); // use title, not id
      alert('Policy saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save policy');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy Editor</h1>
      <PolicyEditor initialValue={content} onSave={handleSave} />
    </div>
  );
}
