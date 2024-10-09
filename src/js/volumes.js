// volumes.js

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
    alert('Volume created successfully.');
    listVolumes();
  } catch (error) {
    console.error('Error creating volume:', error);
  }
}

export async function removeVolume(name) {
  if (!confirm(`Are you sure you want to remove the volume "${name}"?`)) return;

  try {
    const response = await fetch(`http://localhost:3000/volumes/${name}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Error removing volume: ${response.statusText}`);
    alert('Volume removed successfully.');
    listVolumes();
  } catch (error) {
    console.error('Error removing volume:', error);
  }
}

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
      <button class="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded" onclick="removeVolume('${volume.Name}')">Remove</button>
    </div>
  `).join('');

  output.innerHTML = volumeRows;
}
