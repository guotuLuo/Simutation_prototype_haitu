package com.haitu.prototype.dao.entity;
import lombok.Data;

@Data
public class xmlParser {
    private short 脉冲标志码;
    private short 脉冲幅度;
    private int 射频值;
    private int 带宽;
    private int 脉宽;
    private short 方位;
    private short 俯仰;
    private long 到达时间;
}
