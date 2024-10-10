// stats.js

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

// Function to display stats in a modal
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
    <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4" onclick="closeStatsModal()">Close</button>
  `;

  modal.classList.remove('hidden');
}

// Utility functions to calculate CPU and Memory usage
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

function calculateMemoryUsage(stats) {
  if (
    stats.memory_stats &&
    stats.memory_stats.usage &&
    stats.memory_stats.limit &&
    stats.memory_stats.stats
  ) {
    const usedMemory = stats.memory_stats.usage - (stats.memory_stats.stats.cache || 0);
    const availableMemory =
