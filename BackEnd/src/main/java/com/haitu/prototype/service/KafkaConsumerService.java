package com.haitu.prototype.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.haitu.prototype.dao.entity.XMLParam;
import com.haitu.prototype.dto.request.FormSettingReqDTO;
import com.haitu.prototype.dto.response.FormDataRespDTO;
import com.haitu.prototype.toolkit.XmlMessageHandler;
import com.haitu.prototype.toolkit.XmlParamGenerator;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.ByteArrayDeserializer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class KafkaConsumerService {
    private final List<WebSocketSession> sessions = new ArrayList<>();
    private KafkaConsumer<String, byte[]> kafkaConsumer;
    private final AtomicBoolean isConsuming = new AtomicBoolean(false); // 消费状态控制

    public KafkaConsumerService() {
        // 初始化 KafkaConsumer 配置
        Properties props = new Properties();
        props.put("bootstrap.servers", "121.36.206.19:9094"); // Kafka 集群地址
        props.put("group.id", "websocket-group");
        props.put("key.deserializer", StringDeserializer.class.getName());
        props.put("value.deserializer", ByteArrayDeserializer.class.getName());
        props.put("enable.auto.commit", "false"); // 手动提交 Offset
        props.put("auto.offset.reset", "latest"); // 从最新的消息开始
        kafkaConsumer = new KafkaConsumer<>(props);

        // 订阅主题
        kafkaConsumer.subscribe(List.of("test-topic"));
    }

    /**
     * 开启消费
     */
    public void startConsuming(FormSettingReqDTO formSettingParam) {
        if (isConsuming.get()) {
            System.out.println("消费已经在运行中...");
            return;
        }

        // 根据 FormDataRespDTO 生成 XML 参数列表
        List<XMLParam> params = XmlParamGenerator.generateParamsFromClass(FormDataRespDTO.class);

        isConsuming.set(true);
        new Thread(() -> {
            System.out.println("开始消费 Kafka 消息...");
            while (isConsuming.get()) {
                try {
                    // 使用 String 和 byte[] 类型的 Kafka 消费者
                    ConsumerRecords<String, byte[]> records = kafkaConsumer.poll(Duration.ofMillis(1000));
                    for (ConsumerRecord<String, byte[]> record : records) {
                        // 解析消息
                        byte[] message = record.value();
                        System.out.println("Parsed Fields:");
                        // TODO 传输包头和结构体大小还是需要自己改一下
                        // TODO 前端传参到底怎么传
                        List<Map<String, Object>> parsedDataList = XmlMessageHandler.parseMessageToList(params, message, 0, formSettingParam.getStructSize() + 8);

                        // 格式化为标准 JSON
                        String standardizedMessage = new ObjectMapper().writeValueAsString(parsedDataList);

                        // 返回标准化消息到前端
                        broadcastToWebSocketClients(standardizedMessage);
                        System.out.printf("Consumed message: %s, offset: %d%n", standardizedMessage, record.offset());
                    }

                    // 手动提交 Offset
                    kafkaConsumer.commitSync();
                } catch (Exception e) {
                    System.err.println("消费过程中出现错误：" + e.getMessage());
                }
            }
            System.out.println("消费已停止...");
        }).start();
    }

    /**
     * 停止消费
     */
    public void stopConsuming() {
        if (!isConsuming.get()) {
            System.out.println("消费已经停止...");
            return;
        }

        isConsuming.set(false);
        if (kafkaConsumer != null) {
            kafkaConsumer.close(); // 确保资源释放
            kafkaConsumer = null;  // 防止重复使用旧的 KafkaConsumer 实例
        }
    }

    /**
     * 广播消息到 WebSocket 客户端
     */
    private void broadcastToWebSocketClients(String message) {
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(new TextMessage(message));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 添加 WebSocket 客户端会话
     */
    public void addSession(WebSocketSession session) {
        sessions.add(session);
    }

    /**
     * 移除 WebSocket 客户端会话
     */
    public void removeSession(WebSocketSession session) {
        sessions.remove(session);
    }
}
