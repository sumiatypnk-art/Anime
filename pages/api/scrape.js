import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { samehadakuUrl } = req.body;

  try {
    const { data } = await axios.get(samehadakuUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    const $ = cheerio.load(data);
    const title = $('h1.entry-title').text().trim() || 'Episode Anime';
    let iframeUrl = $('#embed_holder iframe').attr('src') || $('iframe').first().attr('src');

    if (!iframeUrl) return res.status(404).json({ success: false, message: 'Iframe tidak ditemukan!' });
    if (iframeUrl.startsWith('//')) iframeUrl = 'https:' + iframeUrl;

    return res.status(200).json({ success: true, data: { title, iframeUrl } });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}