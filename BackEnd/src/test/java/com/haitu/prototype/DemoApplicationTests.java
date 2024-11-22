package com.haitu.prototype;

import com.haitu.prototype.dao.entity.XMLParam;
import com.haitu.prototype.dto.response.FormDataRespDTO;
import com.haitu.prototype.toolkit.XmlMessageHandler;
import com.haitu.prototype.toolkit.XmlParamGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.KafkaTemplate;

import java.util.List;
import java.util.concurrent.ExecutionException;

@SpringBootTest
@RequiredArgsConstructor
@Slf4j
class DemoApplicationTests {
    @Autowired
    private KafkaTemplate<Object, byte[]> kafkaTemplate;

    @Test
    void testKafkaProducer() throws ExecutionException, InterruptedException {
        // 发送消息
        // TODO 这里尝试替换成生成的二进制代码
//        String testMessage = "Hello Kafka from Test!";
        // 定义参数，按 XML 顺序组织
        List<XMLParam> params = XmlParamGenerator.generateParamsFromClass(FormDataRespDTO.class);
        long[][] data = new long[][]{
                {12121221L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {1212145561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L},
                {12121414L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {12114245561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L},
                {12122721L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {12122627561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L},
                {1212756321L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {121722561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L},
                {121272721L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {1822145561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L},
                {12782221L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {1277145561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L},
                {127521L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {122638561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L},
                {38963821L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {389375145561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L},
                {12137821L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {1238935561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L},
                {189321L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {386345561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L},
                {1286386321L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {12638638561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L},
                {138638221L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {1212145561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L},
                {12121221L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {1212145561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L},
                {12121221L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {1212145561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L},
                {12121221L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {1212145561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L},
                {12121221L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {1212145561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L},
                {12121221L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {1212145561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L},
                {12121221L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L},
                {1212145561L, 155, 757, 27, 25, 7, 42, -757, 1234564513123456789L}
        };

        int length = data.length;
        int n = XmlMessageHandler.generateMessage(params, data[0]).length;
        System.out.println(n * length);
//        System.out.println("Generated Message (Hex): " + XmlMessageHandler.bytesToHex(message));
        byte[] combinedMessage = new byte[n * length];
        for (int i = 1; i <= length; i++) {
            System.arraycopy(XmlMessageHandler.generateMessage(params, data[i - 1]), 0, combinedMessage, (i - 1) * n, n);
        }

        String topicName = "test-topic";
        RecordMetadata metadata = kafkaTemplate
                .send(topicName, combinedMessage)
                .get()
                .getRecordMetadata();

        System.out.printf("Message sent to topic %s, partition %d, offset %d%n",
                metadata.topic(), metadata.partition(), metadata.offset());
    }
}
