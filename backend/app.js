const express = require('express');
const Docker = require('dockerode');
const cors = require('cors');

const app = express();
const docker = new Docker();

app.use(cors());
app.use(express.json());

// List all containers
app.get('/containers', async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });
    res.json({ containers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start a container
app.post('/containers/:id/start', async (req, res) => {
  const { id } = req.params;
  try {
    const container = docker.getContainer(id);
    await container.start();
    res.json({ message: 'Container started' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stop a container
app.post('/containers/:id/stop', async (req, res) => {
  const { id } = req.params;
  try {
    const container = docker.getContainer(id);
    await container.stop();
    res.json({ message: 'Container stopped' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inspect a container (Detailed info)
app.get('/containers/:id/inspect', async (req, res) => {
  const { id } = req.params;
  try {
    const container = docker.getContainer(id);
    const data = await container.inspect();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a container
app.delete('/containers/:id/remove', async (req, res) => {
  const { id } = req.params;
  try {
    const container = docker.getContainer(id);
    await container.remove({ force: true });
    res.json({ message: 'Container removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

