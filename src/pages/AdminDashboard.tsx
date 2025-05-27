import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Task {
  id: number;
  title: string;
  description: string;
  documents: Document[];
}

interface Document {
  id: number;
  name: string;
  content?: string;
  type: 'manual' | 'file';
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [docName, setDocName] = useState('');
  const [docContent, setDocContent] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // Fetch tasks
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(setTasks);
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setTitle('');
    setDescription('');
  };

  const handleDeleteTask = async (id: number) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(t => t.id !== id));
    setSelectedTask(null);
  };

  const handleSelectTask = (task: Task) => setSelectedTask(task);

  const handleAddManualDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    const res = await fetch(`/api/tasks/${selectedTask.id}/docs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: docName, content: docContent })
    });
    const newDoc = await res.json();
    setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, documents: [...t.documents, newDoc] } : t));
    setDocName('');
    setDocContent('');
  };

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`/api/tasks/${selectedTask.id}/upload`, {
      method: 'POST',
      body: formData
    });
    const newDoc = await res.json();
    setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, documents: [...t.documents, newDoc] } : t));
    setFile(null);
  };

  const handleDeleteDoc = async (docId: number) => {
    if (!selectedTask) return;
    await fetch(`/api/tasks/${selectedTask.id}/docs/${docId}`, { method: 'DELETE' });
    setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, documents: t.documents.filter(d => d.id !== docId) } : t));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Painel do Admin</h1>
        <p className="mb-4">Bem-vindo, {user?.email}!</p>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded mb-6">Sair</button>
        <form onSubmit={handleCreateTask} className="mb-6 flex gap-2">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título da tarefa" className="p-2 border rounded w-1/3" required />
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Descrição" className="p-2 border rounded w-1/2" required />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Criar</button>
        </form>
        <div className="flex gap-8">
          <div className="w-1/2">
            <h2 className="font-semibold mb-2">Tarefas</h2>
            <ul>
              {tasks.map(task => (
                <li key={task.id} className={`mb-2 p-2 rounded cursor-pointer ${selectedTask?.id === task.id ? 'bg-orange-100' : 'bg-white'}`}
                  onClick={() => handleSelectTask(task)}>
                  <div className="flex justify-between items-center">
                    <span>{task.title}</span>
                    <button onClick={e => { e.stopPropagation(); handleDeleteTask(task.id); }} className="text-red-500 ml-2">Remover</button>
                  </div>
                  <div className="text-xs text-gray-500">{task.description}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-1/2">
            {selectedTask && (
              <div>
                <h2 className="font-semibold mb-2">Documentos da tarefa</h2>
                <form onSubmit={handleAddManualDoc} className="mb-2 flex gap-2">
                  <input value={docName} onChange={e => setDocName(e.target.value)} placeholder="Nome do documento" className="p-2 border rounded w-1/3" required />
                  <input value={docContent} onChange={e => setDocContent(e.target.value)} placeholder="Conteúdo" className="p-2 border rounded w-1/2" required />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Adicionar</button>
                </form>
                <form onSubmit={handleUploadFile} className="mb-2 flex gap-2">
                  <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="p-2 border rounded w-2/3" />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
                </form>
                <ul>
                  {selectedTask.documents.map(doc => (
                    <li key={doc.id} className="mb-1 flex justify-between items-center bg-white p-2 rounded">
                      <span>{doc.name} ({doc.type})</span>
                      <button onClick={() => handleDeleteDoc(doc.id)} className="text-red-500">Remover</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 