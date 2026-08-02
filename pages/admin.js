import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Admin() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    setStatus('⏳ Sedang mengeruk data Samehadaku...');
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ samehadakuUrl: url })
      });
      const result = await res.json();

      if (result.success) {
        // Simpan ke Supabase
        const { error } = await supabase
          .from('episodes')
          .insert([{ title: result.data.title, iframe_url: result.data.iframeUrl }]);

        if (error) throw error;
        setStatus(`✅ Berhasil Ditambahkan: ${result.data.title}`);
        setUrl('');
      } else {
        setStatus('❌ Gagal: ' + result.message);
      }
    } catch (err) {
      setStatus('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold mb-4 text-red-500">Admin - Auto Upload Episode</h1>
        <input 
          type="url" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste Link Episode Samehadaku..." 
          className="w-full p-3 bg-gray-700 rounded mb-4 text-sm outline-none"
        />
        <button onClick={handleUpload} className="w-full bg-red-600 hover:bg-red-700 p-3 rounded font-bold">
          🚀 Proses & Upload
        </button>
        <p className="mt-4 text-sm text-gray-300">{status}</p>
      </div>
    </div>
  );
}