package com.haitu.prototype.dto.response;
import lombok.Data;

@Data
public class FormDataRespDTO {
    private long batchId; 
    private short pulseMarkCode;
    private short pulseAmplitude;
    private int radioFrequency;
    private int bandWidth;
    private int pulseWidth;
    private short orientation;
    private short tilt;
    private long arriveTime;
}
