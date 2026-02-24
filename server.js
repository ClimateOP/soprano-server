const express = require('express');
const cors = require('cors');
const ytdlp = require('yt-dlp-exec');

const PORT = process.env.PORT || 8080;

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
    if (!q) {
      return res.status(400).send('No query');
    }

    const result = await ytdlp(`ytsearch1:${q}`, {
      dumpSingleJson: true,
      noWarning: true,
    });

    res.json(result.entries);
  } catch (e) {
    console.log(e);
    res.status(500).send('Search failed');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
