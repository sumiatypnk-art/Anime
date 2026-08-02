import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [episodes, setEpisodes] = useState([]);
  const [activeEp, setActiveEp] = useState(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      const { data } = await supabase.from('episodes').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setEpisodes(data);
        setActiveEp(data[0]); // Episode terbaru otomatis terputar
      }
    };
    fetchEpisodes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <nav className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between">
        <h1 className="text-xl font-bold text-red-500">NontonAnime</h1>
      </nav>

      <main className="max-w-5xl mx-auto p-4">
        {activeEp ? (
          <div>
            <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden shadow-2xl">
              <iframe 
                src={activeEp.iframe_url} 
                className="absolute top-0 left-0 w-full h-full border-0" 
                allowFullScreen
              />
            </div>
            <h2 className="text-xl font-bold mt-4">{activeEp.title}</h2>
          </div>
        ) : (
          <p className="text-center py-20 text-gray-500">Belum ada episode yang diupload, Boss.</p>
        )}

        <!-- Daftar Episode -->
        <h3 className="text-lg font-bold mt-8 mb-4">Daftar Episode:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {episodes.map((ep) => (
            <button 
              key={ep.id} 
              onClick={() => setActiveEp(ep)}
              className={`p-3 rounded text-left border ${activeEp?.id === ep.id ? 'bg-red-600 border-red-500' : 'bg-gray-900 border-gray-800'}`}
            >
              {ep.title}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}