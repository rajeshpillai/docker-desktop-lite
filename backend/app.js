const express = require('express');
const Docker = require('dockerode');
const cors = require('cors');

const app = express();
const docker = new Docker();

app.use(cors());
app.use(express.json());

// Route to get container stats
app.get('/containers/:id/stats', async (req, res) => {
  const { id } = req.params;
  try {
    const container = docker.getContainer(id);
    const statsStream = await container.stats({ stream: false });
    res.json(statsStream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to list Docker networks
app.get('/networks', async (req, res) => {
  try {
    const networks = await docker.listNetworks();
    res.json({ networks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to create a Docker network
app.post('/networks/create', async (req, res) => {
  const { name, driver } = req.body;
  try {
    const network = await docker.createNetwork({ Name: name, Driver: driver });
    res.json({ message: `Network ${name} created successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to remove a Docker network
app.delete('/networks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const network = docker.getNetwork(id);
    await network.remove();
    res.json({ message: `Network ${id} removed successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Inspect a Docker volume by name
app.get('/volumes/:name/inspect', async (req, res) => {
  const { name } = req.params;
  try {
    const volume = docker.getVolume(name);
    const volumeInfo = await volume.inspect();
    res.json(volumeInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Prune unused Docker volumes
app.delete('/volumes/prune', async (req, res) => {
  try {
    const result = await docker.pruneVolumes();
    res.json({ message: 'Unused volumes pruned successfully', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// List all Docker volumes
app.get('/volumes', async (req, res) => {
  try {
    const volumes = await docker.listVolumes();
    res.json({ volumes: volumes.Volumes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new Docker volume
app.post('/volumes/create', async (req, res) => {
  const { volumeName } = req.body;
  try {
    const volume = await docker.createVolume({ Name: volumeName });
    res.json({ message: `Volume ${volumeName} created successfully`, volume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a Docker volume
app.delete('/volumes/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const volume = docker.getVolume(name);
    await volume.remove();
    res.json({ message: `Volume ${name} removed successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// List all images
app.get('/images', async (req, res) => {
  try {
    const images = await docker.listImages();
    res.json({ images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pull a Docker image
app.post('/images/pull', async (req, res) => {
  const { imageName } = req.body;
  try {
    await docker.pull(imageName, {}, (err, stream) => {
      if (err) return res.status(500).json({ error: err.message });

      docker.modem.followProgress(stream, onFinished, onProgress);

      function onFinished(err, output) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `Image ${imageName} pulled successfully.` });
      }

      function onProgress(event) {
        console.log(event);
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a Docker image
app.delete('/images/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await docker.getImage(id).remove();
    res.json({ message: 'Image removed successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// List all containers (running and stopped)
app.get('/containers', async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });  // Add { all: true }
    res.json({ containers });
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

// Get container logs
app.get('/containers/:id/logs', async (req, res) => {
  const { id } = req.params;
  try {
    const container = docker.getContainer(id);
    const logs = await container.logs({
      stdout: true,
      stderr: true,
      follow: false,  // Set to true if you want to follow the logs in real-time
      tail: 100       // Fetch the last 100 lines
    });
    res.send(logs.toString());
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
// Stop a Docker container
app.post('/containers/:id/stop', async (req, res) => {
  const { id } = req.params;
  try {
    const container = docker.getContainer(id);
    const containerInfo = await container.inspect();

    // Check if the container is already stopped or exited
    if (containerInfo.State.Status === 'exited' || containerInfo.State.Status === 'stopped') {
      res.status(304).json({ message: `Container ${id} is already stopped.` });
    } else {
      await container.stop();
      res.json({ message: `Container ${id} stopped successfully` });
    }
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

