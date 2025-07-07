const path = require('path');
const express = require('express');

const app = express();

console.log('Starting test server...');
console.log('Current directory:', process.cwd());
console.log('Dirname:', __dirname);

const uploadsPath = path.join(__dirname, '../uploads');
console.log('Uploads path:', uploadsPath);

app.use('/uploads', express.static(uploadsPath));

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
