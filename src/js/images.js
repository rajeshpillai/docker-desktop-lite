// images.js

// Function to list Docker images
export async function listImages() {
  try {
    const response = await fetch('http://localhost:3000/images');
    if (!response.ok) throw new Error(`Error fetching images: ${response.statusText}`);
    const data = await response.json();
    renderImages(data.images);
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

// Function to pull a Docker image
export async function pullImage() {
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
    listImages(); // Refresh the list of images after pulling a new one
  } catch (error) {
    console.error('Error pulling image:', error);
  }
}

// Function to render Docker images in the UI
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

// Function to remove a Docker image
export async function removeImage(id) {
  if (!confirm('Are you sure you want to remove this image?')) return;

  try {
    const response = await fetch(`http://localhost:3000/images/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Error removing image: ${response.statusText}`);
    alert('Image removed successfully.');
    listImages(); // Refresh the list of images after removing one
  } catch (error) {
    console.error('Error removing image:', error);
  }
}
