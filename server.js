const express = require('express');
const cors = require('cors');
const ytdlp = require('yt-dlp-exec');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const TMP_DIR = `${process.env.HOME}/tmp`;
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR);
}

const app = express();
app.use(cors());

app.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).send('No query');

    let result;
    try {
      result = await ytdlp(`ytsearch6:${q}`, {
        dumpSingleJson: true,
        noWarning: true,
        ignoreErrors: true,
      });
    } catch (err) {
      if (err.stdout) {
        try {
          result = JSON.parse(err.stdout);
        } catch {
          return res.status(500).send('Search failed');
        }
      } else {
        return res.status(500).send('Search failed');
      }
    }

    if (!result?.entries) {
      return res.status(500).send('No entries found');
    }

    const entries = result.entries.filter((entry) => entry !== null);

    if (entries.length === 0) {
      return res.status(500).send('No entries found');
    }

    res.json(entries);
  } catch (err) {
    console.error('YT-DLP SEARCH ERROR:', err);
    res.status(500).send(err.message || 'Search failed');
  }
});

app.get('/download', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('No URL');
  }

  const tmpFile = `${process.env.HOME}/tmp/audio_${Date.now()}.webm`;

  try {
    await ytdlp(url, {
      format: 'bestaudio',
      output: tmpFile,
    });

    res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
    res.sendFile(tmpFile, { root: '/' }, (err) => {
      fs.unlink(tmpFile, () => {});
    });
  } catch (err) {
    console.error('Download Error: ', err);
    if (!res.headersSent) {
      res.status(500).send(err.message);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
