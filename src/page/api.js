const PYTHON_CHAT_DATA_SOURCE = 'ws://192.168.171.6:8000/ws/ask';

// ارسال سوال به سرور از طریق WebSocket
export const askQuestion = (question, onMessage, onError, onClose) => {
  console.log('Connecting to WebSocket:', PYTHON_CHAT_DATA_SOURCE);
  const ws = new WebSocket(PYTHON_CHAT_DATA_SOURCE);

  ws.onopen = () => {
    console.log('WebSocket connection opened');
    console.log('Sending question:', question);
    ws.send(JSON.stringify({ question }));
  };

  ws.onmessage = (event) => {
    console.log('Received raw message:', event.data);
    // ارسال پیام خام بدون پارس کردن
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