import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Store schemas in memory (replace with database in production)
let schemas = [];
let mappings = [];

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.post('/api/schemas', (req, res) => {
  const schema = req.body;
  schemas.push(schema);
  res.json(schema);
});

app.get('/api/schemas', (req, res) => {
  res.json(schemas);
});

app.post('/api/mappings', (req, res) => {
  const mapping = req.body;
  mappings.push(mapping);
  res.json(mapping);
});

app.get('/api/mappings', (req, res) => {
  res.json(mappings);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});