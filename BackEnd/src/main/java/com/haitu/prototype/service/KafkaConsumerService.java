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
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class KafkaConsumerService {
    private final List<WebSocketSession> sessions = new ArrayList<>();
    private final AtomicBoolean isConsuming = new AtomicBoolean(false); // 消费状态控制
    private final ExecutorService executorService = Executors.newCachedThreadPool();

    public KafkaConsumer<String, byte[]> generatekafkaConsumer(){
        // 初始化 KafkaConsumer 配置
        Properties props = new Properties();
        props.put("bootstrap.servers", "121.36.206.19:9094"); // Kafka 集群地址
        props.put("group.id", "websocket-group");
        props.put("key.deserializer", StringDeserializer.class.getName());
        props.put("value.deserializer", ByteArrayDeserializer.class.getName());
        props.put("enable.auto.commit", "false"); // 手动提交 Offset
        props.put("auto.offset.reset", "latest"); // 从最新的消息开始
        KafkaConsumer<String, byte[]> kafkaConsumer = new KafkaConsumer<>(props);
        // 订阅主题
        kafkaConsumer.subscribe(List.of("test-topic"));
        return kafkaConsumer;
    }

    /**
     * 开启消费
     */
    public void startConsuming(FormSettingReqDTO formSettingParam) {
        if (isConsuming.get()) {
            System.out.println("消费已经在运行中...");
            return;
        }

        List<XMLParam> params = XmlParamGenerator.generateParamsFromClass(FormDataRespDTO.class);

        isConsuming.set(true);
        executorService.submit(() -> {
            System.out.println("开始消费 Kafka 消息...");
            try (KafkaConsumer<String, byte[]> threadKafkaConsumer = generatekafkaConsumer()) {
                // 每个线程独立创建自己的 KafkaConsumer 实例
                while (isConsuming.get()) {
                    try {
                        ConsumerRecords<String, byte[]> records = threadKafkaConsumer.poll(Duration.ofMillis(1000));
                        for (ConsumerRecord<String, byte[]> record : records) {
                            byte[] message = record.value();
                            System.out.println("Parsed Fields:");
                            List<Map<String, Object>> parsedDataList = XmlMessageHandler.parseMessageToList(params, message, 0, formSettingParam.getStructSize() + 8);

                            String standardizedMessage = new ObjectMapper().writeValueAsString(parsedDataList);

                            broadcastToWebSocketClients(standardizedMessage);
                            System.out.printf("Consumed message: %s, offset: %d%n", standardizedMessage, record.offset());
                        }

                        threadKafkaConsumer.commitSync();  // 手动提交 Offset
                    } catch (Exception e) {
                        System.err.println("消费过程中出现错误：" + e.getMessage());
                    }
                }
            } catch (Exception e) {
                System.err.println("线程中的 KafkaConsumer 关闭时出现错误：" + e.getMessage());
            }
            System.out.println("消费已停止...");
        });
    }

    public void stopConsuming() {
        if (!isConsuming.get()) {
            System.out.println("消费已经停止...");
            return;
        }

        isConsuming.set(false);
        System.out.println("停止消费...");
        // 这里不需要手动关闭 KafkaConsumer，因为每个线程已经独立管理自己的实例
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
