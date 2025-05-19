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
      <div class="animate-fade-in-up flex items-center gap-2 rounded-xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
        ${message.icons}
        <span class="text-sm font-medium text-gray-800">
          ${message.text}
        </span>
        <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-3 w-3 rotate-45 bg-white/90"></div>
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
    }, 1000); //  محو شدن پیام
  }, 6000); // هر پیام 5 ثانیه نمایش داده می‌شود + 1 ثانیه تأخیر
}

document.getElementById('chat-button').addEventListener('click', () => {
  const chatFrame = document.getElementById('chatbot-frame');
  if (chatFrame.style.display === 'none') {
    chatFrame.style.display = 'block';
  } else {
    chatFrame.style.display = 'none';
  }
});


document.addEventListener('DOMContentLoaded', showMessages);