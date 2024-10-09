// containers.js

export async function fetchContainers() {
  try {
    const response = await fetch('http://localhost:3000/containers');
    if (!response.ok) throw new Error(`Error fetching containers: ${response.statusText}`);
    const data = await response.json();
    renderContainers(data.containers);
  } catch (error) {
    console.error('Error fetching containers:', error);
  }
}

export async function startContainer(id) {
  try {
    const response = await fetch(`http://localhost:3000/containers/${id}/start`, { method: 'POST' });
    if (!response.ok) throw new Error(`Error starting container: ${response.statusText}`);
    alert('Container started successfully.');
    fetchContainers();
  } catch (error) {
    console.error('Error starting container:', error);
  }
}

export async function stopContainer(id) {
  try {
    const response = await fetch(`http://localhost:3000/containers/${id}/stop`, { method: 'POST' });
    if (response.status === 304) {
      alert('Container is already stopped.');
    } else if (!response.ok) {
      throw new Error(`Error stopping container: ${response.statusText}`);
    } else {
      alert('Container stopped successfully.');
    }
    fetchContainers();
  } catch (error) {
    console.error('Error stopping container:', error);
  }
}

async function renderContainers(containers) {
  const output = document.getElementById('output');
  if (!containers || containers.length === 0) {
    output.innerHTML = '<p class="text-red-500">No containers found.</p>';
    return;
  }

  const containerRows = await Promise.all(containers.map(async (container) => {
    const isRunning = container.State === 'running';
    const buttonLabel = isRunning ? 'Stop' : 'Start';
    const buttonAction = isRunning ? `stopContainer('${container.Id}')` : `startContainer('${container.Id}')`;

    // Fetch health status for each container
    const healthStatus = await fetchHealthStatus(container.Id);

    return `
      <div class="bg-white shadow-md rounded-lg mb-4 p-4">
        <h2 class="text-lg font-bold">${container.Names[0]}</h2>
        <p><strong>Container ID:</strong> ${container.Id.substring(0, 12)}</p>
        <p><strong>Status:</strong> ${isRunning ? 'Running' : 'Stopped'}</p>
        <p><strong>Health Status:</strong> ${healthStatus}</p>
        <button class="text-white bg-${isRunning ? 'red' : 'blue'}-500 hover:bg-${isRunning ? 'red' : 'blue'}-700 py-1 px-3 rounded" onclick="${buttonAction}">${buttonLabel}</button>
      </div>
    `;
  }));

  output.innerHTML = containerRows.join('');
}
