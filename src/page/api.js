
export const askQuestion = (question, sessionId, onMessage, onError, onClose) => {
  const PYTHON_CHAT_DATA_SOURCE = `ws://192.168.171.6:8000/ws/ask?session_id=${sessionId}`;
  console.log('Connecting to WebSocket:', PYTHON_CHAT_DATA_SOURCE);
  const ws = new WebSocket(PYTHON_CHAT_DATA_SOURCE);

  ws.onopen = () => {
    console.log('WebSocket connection opened');
    console.log('Sending question:', question);
    ws.send(JSON.stringify({ question }));
  };

  ws.onmessage = (event) => {
    console.log('Received raw message:', event.data);
    onMessage(event.data);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    onError(new Error('خطا در اتصال به سرور'));
  };

  ws.onclose = (event) => {
    console.log('WebSocket connection closed:', event.code, event.reason);
    onClose();
  };

  return {
    close: () => {
      console.log('Closing WebSocket connection');
      ws.close();
    },
  };
};

export const fetchChatHistory = async (sessionId, offset = 0, limit = 10) => {
  try {
    const response = await fetch(
        `http://192.168.171.6:8000/chat/history/${sessionId}?offset=${offset}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error('خطا در دریافت تاریخچه چت');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

export const fetchWizards = async () => {
  try {
    const response = await fetch('http://192.168.171.6:8000/wizards');
    if (!response.ok) {
      throw new Error('خطا در دریافت لیست ویزارد‌ها');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching wizards:', error);
    throw error;
  }
};