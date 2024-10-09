// common.js

export function formatBytes(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export function switchSection(section) {
  const sections = ['containers', 'images', 'volumes', 'networks', 'compose'];
  sections.forEach(s => {
    document.getElementById(`${s}-section`).classList.add('hidden');
  });
  document.getElementById(`${section}-section`).classList.remove('hidden');
}
