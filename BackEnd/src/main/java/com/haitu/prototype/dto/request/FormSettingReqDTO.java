package com.haitu.prototype.dto.request;

import lombok.Data;

@Data
public class FormSettingReqDTO {
    /**
     * 批号有效
     * */
    private boolean isBatchValid;
    /**
     * 数据积累
     * */
    private boolean isDataStore;
    /**
     * 数据包头大小
     */
    private int headSize;
    /**
     * 结构体大小
     * */
    private int structSize;
}
