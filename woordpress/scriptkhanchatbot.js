const messages = [
  {
    text: 'سلام، من خان هستم!',
    icons: `
      <div class="flex items-center gap-1">
        <svg class="h-5 w-5 animate-bounce text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v6M12 16v6M2 12h6M16 12h6"/>
        </svg>
        <svg class="h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <circle cx="12" cy="12" r="2"/>
          <line x1="12" y1="8" x2="12" y2="10"/>
          <line x1="12" y1="14" x2="12" y2="16"/>
        </svg>
      </div>
    `,
  },
  {
    text: 'دستیار هوش مصنوعی ساتیا',
    icons: `
      <div class="flex items-center gap-1">
        <svg class="h-5 w-5 animate-bounce text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v6M12 16v6M2 12h6M16 12h6"/>
        </svg>
        <svg class="h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <circle cx="12" cy="12" r="2"/>
          <line x1="12" y1="8" x2="12" y2="10"/>
          <line x1="12" y1="14" x2="12" y2="16"/>
        </svg>
      </div>
    `,
  },
  {
    text: 'برای شروع فقط سوالتو بپرس!',
    icons: `
      <svg class="h-5 w-5 text-emerald-400 animate-bounce" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 14h.01M16 10h.01M21 21l-6-6M3 12a9 9 0 1118 0 9 9 0 01-18 0z"/>
      </svg>
    `,
  },
  {
    text: 'من همیشه اینجام تا کمک کنم ✨',
    icons: `
      <div class="flex items-center gap-1">
        <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L13.09 8.26L19 8.27L14.14 11.97L15.45 18L12 14.77L8.55 18L9.86 11.97L5 8.27L10.91 8.26L12 2Z"/>
        </svg>
        <svg class="h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <circle cx="12" cy="12" r="2"/>
          <line x1="12" y1="8" x2="12" y2="10"/>
          <line x1="12" y1="14" x2="12" y2="16"/>
        </svg>
      </div>
    `,
  },
  {
    text: 'چه کمکی ازم برمیاد؟',
    icons: `
      <svg class="h-5 w-5 text-emerald-400 animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v.01"/>
        <path d="M12 8a4 4 0 0 1 0 8"/>
      </svg>
    `,
  }
];

function showMessages() {
  const messageContainer = document.getElementById('welcome-message-container');
  let currentMessageIndex = 0;
  let showMessage = true;

  function updateMessage() {
    if (!showMessage) {
      messageContainer.innerHTML = '';
      return;
    }

    const message = messages[currentMessageIndex];
    messageContainer.innerHTML = `
      <div class="flex items-center gap-2 animate-fade-in-up">
        ${message.icons}
        <span class="text-sm font-medium text-gray-800">${message.text}</span>
        <div class="triangle"></div>
      </div>
    `;
  }

  updateMessage();

  setInterval(() => {
    showMessage = false;
    updateMessage();

    setTimeout(() => {
      currentMessageIndex = (currentMessageIndex + 1) % messages.length;
      showMessage = true;
      updateMessage();
    }, 1000);
  }, 6000);
}

document.addEventListener('DOMContentLoaded', () => {
  const chatButton = document.getElementById('chat-button');
  const fullscreenButton = document.getElementById('fullscreen-button');
  const closeButton = document.getElementById('close-button');
  const chatFrame = document.getElementById('chatbot-frame');
  const messageContainer = document.getElementById('welcome-message-container');

  let isOpen = false;
  let isFullscreen = false;

  chatButton.addEventListener('click', () => {
    isOpen = !isOpen;
    chatFrame.style.display = isOpen ? 'block' : 'none';
    chatButton.style.display = isOpen ? 'none' : 'block';
    fullscreenButton.style.display = isOpen ? 'block' : 'none';
    closeButton.style.display = isOpen ? 'block' : 'none';
    messageContainer.style.display = isOpen ? 'none' : 'block';
  });

  fullscreenButton.addEventListener('click', () => {
    if (!isFullscreen) {
      chatFrame.style.width = '100vw';
      chatFrame.style.height = '100vh';
      chatFrame.style.top = '0';
      chatFrame.style.left = '0';
      chatFrame.style.right = '0';
      chatFrame.style.bottom = '0';
      chatFrame.style.borderRadius = '0';
      isFullscreen = true;
      fullscreenButton.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5" />';
    } else {
      chatFrame.style.width = '400px';
      chatFrame.style.height = '600px';
      chatFrame.style.top = 'auto';
      chatFrame.style.left = 'auto';
      chatFrame.style.right = '20px';
      chatFrame.style.bottom = '70px';
      chatFrame.style.borderRadius = '12px';
      isFullscreen = false;
      fullscreenButton.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />';
    }
  });

  closeButton.addEventListener('click', () => {
    isOpen = false;
    chatFrame.style.display = 'none';
    chatButton.style.display = 'block';
    fullscreenButton.style.display = 'none';
    closeButton.style.display = 'none';
    messageContainer.style.display = 'block';
    isFullscreen = false;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      isOpen = false;
      chatFrame.style.display = 'none';
      chatButton.style.display = 'block';
      fullscreenButton.style.display = 'none';
      closeButton.style.display = 'none';
      messageContainer.style.display = 'block';
      isFullscreen = false;
    }
  });

  showMessages();
});