const express = require('express');
const cors = require('cors');
const ytdlp = require('yt-dlp-exec').default;

const PORT = process.env.PORT || 10000;

const app = express();
app.use(cors());

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
});

app.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).send('No query');

    const result = await ytdlp(`ytsearch1:${q}`, {
      dumpSingleJson: true,
      noWarning: true,
    });

    res.json(result.entries);
  } catch (e) {
    console.error('YT-DLP ERROR:', e);
    res.status(500).send(e.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
