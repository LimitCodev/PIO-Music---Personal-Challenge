// laptop-downloader/server.js
const express = require('express');
const ytdl = require('ytdl-core');
const youtubeSr = require('youtube-sr').default;

const app = express();
const PORT = 3000;

// Búsqueda
app.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const results = await youtubeSr.search(query, { limit: 20, type: 'video' });
    
    const formatted = results.map(video => ({
      id: video.id,
      title: video.title,
      artist: video.channel.name,
      thumbnail: video.thumbnail.url,
      duration: video.duration,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener URL de audio directo
app.get('/audio/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const info = await ytdl.getInfo(videoId);
    
    // Obtener mejor calidad de audio
    const format = ytdl.chooseFormat(info.formats, { 
      quality: 'highestaudio',
      filter: 'audioonly' 
    });

    res.json({
      url: format.url,
      title: info.videoDetails.title,
      artist: info.videoDetails.author.name,
      thumbnail: info.videoDetails.thumbnails[0].url,
      duration: parseInt(info.videoDetails.lengthSeconds),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Descargar MP3 (para guardar localmente)
app.get('/download/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    
    res.header('Content-Disposition', `attachment; filename="${videoId}.mp3"`);
    
    ytdl(videoId, {
      quality: 'highestaudio',
      filter: 'audioonly',
    }).pipe(res);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎵 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📱 Conéctate desde tu celular a: http://TU_IP_LAPTOP:${PORT}`);
});