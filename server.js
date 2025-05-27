import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { tasks, nextTaskId, nextDocId } from './tasksData.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const API_KEY = process.env.VITE_GOOGLE_CLOUD_API_KEY;
if (!API_KEY) {
  throw new Error('Google Cloud API key is not defined in environment variables');
}
const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = 'gemini-1.5-flash';

// CRUD de tarefas
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body;
  const task = { id: nextTaskId++, title, description, documents: [] };
  tasks.push(task);
  res.status(201).json(task);
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const task = tasks.find(t => t.id == id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.title = title;
  task.description = description;
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const idx = tasks.findIndex(t => t.id == id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks.splice(idx, 1);
  res.status(204).end();
});

// Adicionar documento manual (texto)
app.post('/api/tasks/:id/docs', (req, res) => {
  const { id } = req.params;
  const { name, content } = req.body;
  const task = tasks.find(t => t.id == id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const doc = { id: nextDocId++, name, content, type: 'manual' };
  task.documents.push(doc);
  res.status(201).json(doc);
});

// Upload de arquivo
app.post('/api/tasks/:id/upload', upload.single('file'), (req, res) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id == id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const file = req.file;
  const doc = { id: nextDocId++, name: file.originalname, path: file.path, type: 'file' };
  task.documents.push(doc);
  res.status(201).json(doc);
});

// Listar documentos de uma tarefa
app.get('/api/tasks/:id/docs', (req, res) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id == id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task.documents);
});

// Remover documento
app.delete('/api/tasks/:taskId/docs/:docId', (req, res) => {
  const { taskId, docId } = req.params;
  const task = tasks.find(t => t.id == taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const idx = task.documents.findIndex(d => d.id == docId);
  if (idx === -1) return res.status(404).json({ error: 'Document not found' });
  const [removed] = task.documents.splice(idx, 1);
  // Remove arquivo físico se for do tipo file
  if (removed.type === 'file' && removed.path) {
    fs.unlink(removed.path, () => {});
  }
  res.status(204).end();
});

// Rota principal do chat
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt, history = [], taskId } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    // Busca documentos da tarefa e monta contexto
    let context = '';
    if (taskId) {
      const task = tasks.find(t => t.id == taskId);
      if (task) {
        for (const doc of task.documents) {
          if (doc.type === 'manual') context += `\n${doc.name}: ${doc.content}`;
          if (doc.type === 'file' && doc.path) {
            try {
              const fileContent = fs.readFileSync(doc.path, 'utf-8');
              context += `\n${doc.name}: ${fileContent}`;
            } catch {}
          }
        }
      }
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const formattedHistory = history.map(item => ({
      role: item.isUser ? 'user' : 'model',
      parts: [{ text: item.content }]
    }));
    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(`${context}\nPergunta: ${prompt}`);
    const responseText = result.response.text();
    res.json({ text: responseText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Erro interno no servidor' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend Gemini rodando na porta ${PORT}`));