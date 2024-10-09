// logs.js

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

function displayLogsModal(logs) {
  const modal = document.getElementById('logs-modal');
  const modalContent = document.getElementById('logs-modal-content');
  modalContent.innerHTML = `<pre class="whitespace-pre-wrap">${logs}</pre>`;
  modal.classList.remove('hidden');
}

export function closeLogsModal() {
  const modal = document.getElementById('logs-modal');
  modal.classList.add('hidden');
}
