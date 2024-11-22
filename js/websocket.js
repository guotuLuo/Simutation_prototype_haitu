// websocket.js
class WebSocketManager {
    constructor(url) {
        this.url = url;
        this.socket = null;
    }

    connect(onMessage, onOpen, onClose, onError) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.warn('WebSocket is already connected');
            return;
        }

        this.socket = new WebSocket(this.url);
        // 设置心跳机制，每隔 9 分钟发送一个心跳包，避免超时
        const heartbeatInterval = setInterval(() => {
            if (this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ type: "ping" }));
            }
        }, 3 * 60 * 1000); // 9 分钟

        this.socket.onopen = () => {
            console.log('WebSocket connection established');
            if (onOpen){
                onOpen();
            }
        };

        this.socket.onmessage = (event) => {
            console.log('Message received:', event.data);
            if (onMessage) onMessage(event.data);
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket connection closed');
            if (onClose) onClose(event);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            if (onError) onError(error);
        };
    }

    sendMessage(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.error('WebSocket is not open. Cannot send message.');
        }
    }

    close() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

