const express = require('express');
const cors = require('cors');
const ytdlp = require('yt-dlp-exec').create('/opt/render/project/bin/yt-dlp');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());

app.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).send('No query');

    const result = await ytdlp(`ytsearch6:${q}`, {
      dumpSingleJson: true,
      noWarning: true,
      extractFlat: true,
      addHeader: ['user-agent: Mozilla/5.0'],
    });

    if (!result.entries) {
      return res.status(500).send('No entries found');
    }

    res.json(result.entries);
  } catch (e) {
    console.error('YT-DLP SEARCH ERROR:', e);
    res.status(500).send(e.message || 'Search failed');
  }
});

app.get('/download', (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('No URL');
  }

  res.header('Content-Disposition', 'attachment; filename="audio.mp3"');

  const proc = ytdlp.exec(url, {
    format: 'bestaudio',
    output: '-',
  });

  proc.stdout.pipe(res);

  proc.on('error', (err) => {
    console.error('Download Error:', err);
    if (!res.headersSent) {
      res.status(500).send(err.message);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
