import express from 'express';
import cors from 'cors';
import analyzeRoutes from './routes/analyze';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use('/api', analyzeRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});