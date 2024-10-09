const express = require('express');
const Docker = require('dockerode');
const docker = new Docker();
const app = express();

// Middleware to parse request body as JSON if needed in the future
app.use(express.json());

// List all containers (both running and stopped)
app.get('/containers', async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });
    
    if (!containers || containers.length === 0) {
      return res.status(404).json({ error: 'No containers found' });
    }
    
    res.status(200).json({ containers });
  } catch (err) {
    console.error("Error fetching containers:", err);
    res.status(500).json({ error: 'Failed to fetch containers' });
  }
});

// Start a container by ID
app.post('/containers/:id/start', async (req, res) => {
  const containerId = req.params.id;

  // Validate the container ID
  if (!containerId || containerId.length === 0) {
    return res.status(400).json({ error: 'Container ID is required' });
  }

  try {
    const container = docker.getContainer(containerId);
    const containerInfo = await container.inspect();

    if (containerInfo.State.Running) {
      return res.status(400).json({ error: 'Container is already running' });
    }

    await container.start();
    res.status(200).json({ message: `Container ${containerId} started successfully` });
  } catch (err) {
    console.error(`Error starting container ${containerId}:`, err);
    if (err.statusCode === 404) {
      return res.status(404).json({ error: 'Container not found' });
    }
    res.status(500).json({ error: `Failed to start container ${containerId}` });
  }
});

// Stop a container by ID
app.post('/containers/:id/stop', async (req, res) => {
  const containerId = req.params.id;

  // Validate the container ID
  if (!containerId || containerId.length === 0) {
    return res.status(400).json({ error: 'Container ID is required' });
  }

  try {
    const container = docker.getContainer(containerId);
    const containerInfo = await container.inspect();

    if (!containerInfo.State.Running) {
      return res.status(400).json({ error: 'Container is not running' });
    }

    await container.stop();
    res.status(200).json({ message: `Container ${containerId} stopped successfully` });
  } catch (err) {
    console.error(`Error stopping container ${containerId}:`, err);
    if (err.statusCode === 404) {
      return res.status(404).json({ error: 'Container not found' });
    }
    res.status(500).json({ error: `Failed to stop container ${containerId}` });
  }
});

// Error handling middleware for unexpected errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

