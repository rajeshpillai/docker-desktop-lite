// Function to fetch and list containers using Fetch API
async function fetchContainers() {
  try {
    const response = await fetch('http://localhost:3000/containers');
    if (!response.ok) throw new Error(`Error fetching containers: ${response.statusText}`);
    const data = await response.json();
    renderContainers(data.containers);
  } catch (error) {
    console.error('Error fetching containers:', error);
  }
}

// Function to render containers
function renderContainers(containers) {
  const output = document.getElementById('output');
  if (!containers || containers.length === 0) {
    output.innerHTML = '<p class="text-red-500">No containers found.</p>';
    return;
  }

  const containerRows = containers.map(container => `
    <div class="bg-white shadow-md rounded-lg mb-4 p-4">
      <h2 class="text-lg font-bold">${container.Names[0]}</h2>
      <p><strong>Container ID:</strong> ${container.Id.substring(0, 12)}</p>
      <p><strong>Status:</strong> ${container.State === 'running' ? 'Running' : 'Stopped'}</p>
      <div class="mt-2">
        <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded" onclick="inspectContainer('${container.Id}')">Inspect</button>
        <button class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded" onclick="viewLogs('${container.Id}')">View Logs</button>
        ${container.State !== 'running' ? 
          `<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded" onclick="startContainer('${container.Id}')">Start</button>` :
          `<button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded" onclick="stopContainer('${container.Id}')">Stop</button>`
        }
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded" onclick="removeContainer('${container.Id}')">Remove</button>
      </div>
    </div>
  `).join('');

  output.innerHTML = containerRows;
}

// Function to view container logs
async function viewLogs(id) {
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
    <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded mt-4" onclick="closeLogsModal()">Close</button>
  `;

  modal.classList.remove('hidden');
}

// Function to close logs modal
function closeLogsModal() {
  const modal = document.getElementById('logs-modal');
  modal.classList.add('hidden');
}

// Function to inspect container details
async function inspectContainer(id) {
  try {
    const response = await fetch(`http://localhost:3000/containers/${id}/inspect`);
    if (!response.ok) throw new Error(`Error inspecting container: ${response.statusText}`);
    const data = await response.json();
    displayInspectModal(data);
  } catch (error) {
    console.error('Error inspecting container:', error);
  }
}

// Function to display inspect modal
function displayInspectModal(containerInfo) {
  const modal = document.getElementById('inspect-modal');
  const modalContent = document.getElementById('inspect-modal-content');

  modalContent.innerHTML = `
    <h2 class="text-xl font-bold mb-2">Container: ${containerInfo.Name}</h2>
    <p><strong>ID:</strong> ${containerInfo.Id}</p>
    <p><strong>Image:</strong> ${containerInfo.Config.Image}</p>
    <p><strong>State:</strong> ${containerInfo.State.Status}</p>
    <p><strong>Created:</strong> ${new Date(containerInfo.Created).toLocaleString()}</p>
    <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded mt-4" onclick="closeModal()">Close</button>
  `;

  modal.classList.remove('hidden');
}

// Function to close inspect modal
function closeModal() {
  const modal = document.getElementById('inspect-modal');
  modal.classList.add('hidden');
}

// Function to switch sections (Containers vs Images)
function switchSection(section) {
  const containersSection = document.getElementById('containers-section');
  const imagesSection = document.getElementById('images-section');

  if (section === 'containers') {
    containersSection.classList.remove('hidden');
    imagesSection.classList.add('hidden');
  } else if (section === 'images') {
    containersSection.classList.add('hidden');
    imagesSection.classList.remove('hidden');
  }
}

// Function to list Docker images
async function listImages() {
  try {
    const response = await fetch('http://localhost:3000/images');
    if (!response.ok) throw new Error(`Error fetching images: ${response.statusText}`);
    const data = await response.json();
    renderImages(data.images);
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

// Function to render Docker images
function renderImages(images) {
  const output = document.getElementById('images-output');
  if (!images || images.length === 0) {
    output.innerHTML = '<p class="text-red-500">No images found.</p>';
    return;
  }

  const imageRows = images.map(image => `
    <div class="bg-white shadow-md rounded-lg mb-4 p-4">
      <h2 class="text-lg font-bold">${image.RepoTags ? image.RepoTags.join(', ') : 'Unnamed Image'}</h2>
      <p><strong>Image ID:</strong> ${image.Id.substring(0, 12)}</p>
      <p><strong>Size:</strong> ${Math.round(image.Size / 1024 / 1024)} MB</p>
      <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mt-2" onclick="removeImage('${image.Id}')">Remove</button>
    </div>
  `).join('');

  output.innerHTML = imageRows;
}

// Function to pull a Docker image
async function pullImage() {
  const imageName = document.getElementById('image-name').value;
  if (!imageName) return alert('Please enter an image name.');

  try {
    const response = await fetch('http://localhost:3000/images/pull', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageName })
    });
    if (!response.ok) throw new Error(`Error pulling image: ${response.statusText}`);
    const data = await response.json();
    alert(data.message);
    listImages();
  } catch (error) {
    console.error('Error pulling image:', error);
  }
}

// Function to remove a Docker image
async function removeImage(id) {
  if (!confirm('Are you sure you want to remove this image?')) return;

  try {
    const response = await fetch(`http://localhost:3000/images/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Error removing image: ${response.statusText}`);
    alert('Image removed successfully.');
    listImages();
  } catch (error) {
    console.error('Error removing image:', error);
  }
}

// Event listeners for navigation and actions
document.getElementById('list-containers').addEventListener('click', fetchContainers);
document.getElementById('list-images').addEventListener('click', listImages);
document.getElementById('pull-image').addEventListener('click', pullImage);

document.querySelector('a[href="#containers-section"]').addEventListener('click', (e) => {
  e.preventDefault();
  switchSection('containers');
});

document.querySelector('a[href="#images-section"]').addEventListener('click', (e) => {
  e.preventDefault();
  switchSection('images');
});
