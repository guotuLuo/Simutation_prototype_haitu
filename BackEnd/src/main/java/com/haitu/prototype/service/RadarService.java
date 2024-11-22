package com.haitu.prototype.service;

import com.haitu.prototype.dao.entity.Airplane;
import com.haitu.prototype.dto.request.FormSettingReqDTO;
import com.haitu.prototype.dto.response.FormDataRespDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RadarService {
    List<Airplane> coordinatesForRadar();

    void remove(String uuid);

    String uploadData(MultipartFile file);

    FormDataRespDTO receiveData(FormSettingReqDTO formSettingParam);

    void refuseData();
}
