const express = require('express');
const cors = require('cors');
const ytdlp = require('yt-dlp-exec');

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

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
