// containers.js

// Function to list Docker containers
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

// Function to render Docker containers
export async function renderContainers(containers) {
  const output = document.getElementById('output');
  output.innerHTML = ''; // Clear previous output

  if (!containers || containers.length === 0) {
    output.innerHTML = '<p class="text-red-500">No containers found.</p>';
    return;
  }

  const containerRows = await Promise.all(containers.map(async (container) => {
    const isRunning = container.State === 'running';
    const buttonLabel = isRunning ? 'Stop' : 'Start';

    // Fetch health status for each container (if implemented)
    const healthStatus = await fetchHealthStatus(container.Id);

    const containerElement = document.createElement('div');
    containerElement.classList.add('bg-white', 'shadow-md', 'rounded-lg', 'mb-4', 'p-4');

    containerElement.innerHTML = `
      <h2 class="text-lg font-bold">${container.Names[0]}</h2>
      <p><strong>Container ID:</strong> ${container.Id.substring(0, 12)}</p>
      <p><strong>Status:</strong> ${isRunning ? 'Running' : 'Stopped'}</p>
      <p><strong>Health Status:</strong> ${healthStatus}</p>
    `;

    // Create Start/Stop button
    const actionButton = document.createElement('button');
    actionButton.classList.add('bg', isRunning ? 'bg-red-500' : 'bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-1', 'px-3', 'rounded');
    actionButton.textContent = buttonLabel;

    // Add event listener for start/stop action
    actionButton.addEventListener('click', () => {
      if (isRunning) {
        stopContainer(container.Id);
      } else {
        startContainer(container.Id);
      }
    });

    // Add button to container element
    containerElement.appendChild(actionButton);

    // Add additional buttons for inspect, logs, stats
    const inspectButton = document.createElement('button');
    inspectButton.classList.add('bg-yellow-500', 'hover:bg-yellow-700', 'text-white', 'font-bold', 'py-1', 'px-3', 'rounded', 'ml-2');
    inspectButton.textContent = 'Inspect';
    inspectButton.addEventListener('click', () => inspectContainer(container.Id));

    const logsButton = document.createElement('button');
    logsButton.classList.add('bg-gray-500', 'hover:bg-gray-700', 'text-white', 'font-bold', 'py-1', 'px-3', 'rounded', 'ml-2');
    logsButton.textContent = 'Logs';
    logsButton.addEventListener('click', () => viewLogs(container.Id));

    const statsButton = document.createElement('button');
    statsButton.classList.add('bg-green-500', 'hover:bg-green-700', 'text-white', 'font-bold', 'py-1', 'px-3', 'rounded', 'ml-2');
    statsButton.textContent = 'Stats';
    statsButton.addEventListener('click', () => viewStats(container.Id));

    // Append additional buttons to container element
    containerElement.appendChild(inspectButton);
    containerElement.appendChild(logsButton);
    containerElement.appendChild(statsButton);

    return containerElement;
  }));

  // Append all container elements to the output
  containerRows.forEach(containerElement => output.appendChild(containerElement));
}

// Function to start a Docker container
export async function startContainer(id) {
  try {
    const response = await fetch(`http://localhost:3000/containers/${id}/start`, { method: 'POST' });
    if (!response.ok) throw new Error(`Error starting container: ${response.statusText}`);
    alert('Container started successfully.');
    fetchContainers();  // Refresh the container list
  } catch (error) {
    console.error('Error starting container:', error);
  }
}

// Function to stop a Docker container
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
    fetchContainers();  // Refresh the container list
  } catch (error) {
    console.error('Error stopping container:', error);
  }
}

// Function to fetch and display container health status (if applicable)
export async function fetchHealthStatus(id) {
  try {
    const response = await fetch(`http://localhost:3000/containers/${id}/health`);
    if (!response.ok) throw new Error(`Error fetching health status: ${response.statusText}`);
    const data = await response.json();
    return data.health;
  } catch (error) {
    console.error('Error fetching health status:', error);
    return 'Error';
  }
}

// Function to fetch and display container logs
export async function viewLogs(id) {
  try {
    const response = await fetch(`http://localhost:3000/containers/${id}/logs`);
    if (!response.ok) throw new Error(`Error fetching logs: ${response.statusText}`);
    const logs = await response.text();
    displayLogsModal(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
  }
}

// Function to display logs in modal
function displayLogsModal(logs) {
  const modal = document.getElementById('logs-modal');
  const modalContent = document.getElementById('logs-modal-content');

  modalContent.innerHTML = `
    <pre class="whitespace-pre-wrap">${logs}</pre>
    <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded mt-4" id="close-logs-modal">Close</button>
  `;

  // Attach event listener for the close button
  document.getElementById('close-logs-modal').addEventListener('click', closeLogsModal);

  modal.classList.remove('hidden');
}

// Function to close logs modal
function closeLogsModal() {
  const modal = document.getElementById('logs-modal');
  modal.classList.add('hidden');
}

// Function to fetch and inspect Docker container details
export async function inspectContainer(id) {
  try {
    const response = await fetch(`http://localhost:3000/containers/${id}/inspect`);
    if (!response.ok) throw new Error(`Error inspecting container: ${response.statusText}`);
    const data = await response.json();
    displayInspectModal(data);
  } catch (error) {
    console.error('Error inspecting container:', error);
  }
}

// Function to display inspect modal with container details
function displayInspectModal(containerInfo) {
  const modal = document.getElementById('inspect-modal');
  const modalContent = document.getElementById('inspect-modal-content');

  modalContent.innerHTML = `
    <h2 class="text-xl font-bold mb-2">Container: ${containerInfo.Name}</h2>
    <p><strong>ID:</strong> ${containerInfo.Id}</p>
    <p><strong>Image:</strong> ${containerInfo.Config.Image}</p>
    <p><strong>State:</strong> ${containerInfo.State.Status}</p>
    <p><strong>Created:</strong> ${new Date(containerInfo.Created).toLocaleString()}</p>
    <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4" id="close-inspect-modal">Close</button>
  `;

  // Attach event listener for the close button
  document.getElementById('close-inspect-modal').addEventListener('click', closeInspectModal);

  modal.classList.remove('hidden');
}

// Function to close inspect modal
function closeInspectModal() {
  const modal = document.getElementById('inspect-modal');
  modal.classList.add('hidden');
}

// Function to close inspect modal
function closeModal() {
  const modal = document.getElementById('inspect-modal');
  modal.classList.add('hidden');
}

// Function to fetch and display container stats
export async function viewStats(id) {
  try {
    const response = await fetch(`http://localhost:3000/containers/${id}/stats`);
    if (!response.ok) throw new Error(`Error fetching stats: ${response.statusText}`);
    const stats = await response.json();
    displayStatsModal(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
}

// Function to display stats in modal
function displayStatsModal(stats) {
  const modal = document.getElementById('stats-modal');
  const modalContent = document.getElementById('stats-modal-content');

  // Format stats data
  const cpuUsage = calculateCPUUsage(stats);
  const memoryUsage = calculateMemoryUsage(stats);

  modalContent.innerHTML = `
    <h2 class="text-xl font-bold mb-4">Container Stats</h2>
    <p><strong>CPU Usage:</strong> ${cpuUsage}%</p>
    <p><strong>Memory Usage:</strong> ${memoryUsage}% (${formatBytes(stats.memory_stats.usage || 0)} / ${formatBytes(stats.memory_stats.limit || 0)})</p>
    <p><strong>Network I/O:</strong> ${formatBytes(stats.networks?.eth0?.rx_bytes || 0)} Received / ${formatBytes(stats.networks?.eth0?.tx_bytes || 0)} Transmitted</p>
    <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4" id="close-stats-modal">Close</button>
  `;

  // Attach event listener for the close button
  document.getElementById('close-stats-modal').addEventListener('click', closeStatsModal);
  modal.classList.remove('hidden');
}

// Function to close stats modal
function closeStatsModal() {
  const modal = document.getElementById('stats-modal');
  modal.classList.add('hidden');
}

// Utility functions for CPU, memory usage, and formatting bytes

// Calculate CPU usage percentage
function calculateCPUUsage(stats) {
  if (
    stats.cpu_stats &&
    stats.cpu_stats.cpu_usage &&
    stats.cpu_stats.cpu_usage.percpu_usage &&
    stats.cpu_stats.cpu_usage.percpu_usage.length > 0 &&
    stats.precpu_stats &&
    stats.precpu_stats.cpu_usage
  ) {
    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
    const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;

    if (systemDelta > 0) {
      const cpuUsage = (cpuDelta / systemDelta) * stats.cpu_stats.cpu_usage.percpu_usage.length * 100;
      return cpuUsage.toFixed(2);
    }
  }
  return 'N/A';
}

// Calculate memory usage percentage
function calculateMemoryUsage(stats) {
  if (
    stats.memory_stats &&
    stats.memory_stats.usage &&
    stats.memory_stats.limit &&
    stats.memory_stats.stats
  ) {
    const usedMemory = stats.memory_stats.usage - (stats.memory_stats.stats.cache || 0);
    const availableMemory = stats.memory_stats.limit;
    const memoryUsage = (usedMemory / availableMemory) * 100;
    return memoryUsage.toFixed(2);
  }
  return 'N/A';
}

// Utility function to format bytes
function formatBytes(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
