const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); // Allow requests from React Native
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:8081'],
}));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
