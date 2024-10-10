// volumes.js

// Function to list Docker volumes
export async function listVolumes() {
  try {
    const response = await fetch('http://localhost:3000/volumes');
    if (!response.ok) throw new Error(`Error fetching volumes: ${response.statusText}`);
    const data = await response.json();
    renderVolumes(data.volumes);
  } catch (error) {
    console.error('Error fetching volumes:', error);
  }
}

// Function to create a new Docker volume
export async function createVolume() {
  const volumeName = document.getElementById('volume-name').value;
  if (!volumeName) return alert('Please enter a volume name.');

  try {
    const response = await fetch('http://localhost:3000/volumes/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ volumeName })
    });
    if (!response.ok) throw new Error(`Error creating volume: ${response.statusText}`);
    const data = await response.json();
    alert(data.message);
    listVolumes();  // Refresh the volume list after creating a new one
  } catch (error) {
    console.error('Error creating volume:', error);
  }
}

// Function to remove a Docker volume
export async function removeVolume(name) {
  if (!confirm(`Are you sure you want to remove the volume "${name}"?`)) return;

  try {
    const response = await fetch(`http://localhost:3000/volumes/${name}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Error removing volume: ${response.statusText}`);
    alert('Volume removed successfully.');
    listVolumes();  // Refresh the volume list after removing one
  } catch (error) {
    console.error('Error removing volume:', error);
  }
}

// Function to prune unused Docker volumes
export async function pruneVolumes() {
  if (!confirm('Are you sure you want to prune all unused volumes?')) return;

  try {
    const response = await fetch('http://localhost:3000/volumes/prune', { method: 'DELETE' });
    if (!response.ok) throw new Error(`Error pruning volumes: ${response.statusText}`);
    const data = await response.json();
    alert('Unused volumes pruned successfully.');
    listVolumes();  // Refresh the volume list after pruning
  } catch (error) {
    console.error('Error pruning volumes:', error);
  }
}

// Function to inspect a Docker volume
export async function inspectVolume(name) {
  try {
    const response = await fetch(`http://localhost:3000/volumes/${name}/inspect`);
    if (!response.ok) throw new Error(`Error fetching volume details: ${response.statusText}`);
    const volumeDetails = await response.json();
    displayVolumeDetails(volumeDetails);
  } catch (error) {
    console.error('Error fetching volume details:', error);
  }
}

// Function to display volume details in a modal or section
function displayVolumeDetails(volume) {
  const modal = document.getElementById('inspect-modal');
  const modalContent = document.getElementById('inspect-modal-content');

  modalContent.innerHTML = `
    <h2 class="text-lg font-bold">Volume: ${volume.Name}</h2>
    <p><strong>Driver:</strong> ${volume.Driver}</p>
    <p><strong>Mountpoint:</strong> ${volume.Mountpoint}</p>
    <p><strong>Created At:</strong> ${new Date(volume.CreatedAt).toLocaleString()}</p>
    <pre class="whitespace-pre-wrap break-words"><strong>Labels:</strong> ${JSON.stringify(volume.Labels, null, 2) || 'None'}</pre>
  `;

  modal.classList.remove('hidden');
}

// Function to render Docker volumes in the UI
function renderVolumes(volumes) {
  const output = document.getElementById('volumes-output');
  if (!volumes || volumes.length === 0) {
    output.innerHTML = '<p class="text-red-500">No volumes found.</p>';
    return;
  }

  const volumeRows = volumes.map(volume => `
    <div class="bg-white shadow-md rounded-lg mb-4 p-4">
      <h2 class="text-lg font-bold">${volume.Name}</h2>
      <p><strong>Mountpoint:</strong> ${volume.Mountpoint}</p>
      <div class="mt-2">
        <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded" onclick="inspectVolume('${volume.Name}')">Inspect</button>
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mt-2" onclick="removeVolume('${volume.Name}')">Remove</button>
      </div>
    </div>
  `).join('');

  output.innerHTML = volumeRows;
}
