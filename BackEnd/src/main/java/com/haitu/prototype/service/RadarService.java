package com.haitu.prototype.service;

import com.haitu.prototype.dto.request.FormSettingReqDTO;
import com.haitu.prototype.dto.request.RadarReqDTO;
import com.haitu.prototype.dto.response.FormDataRespDTO;
import com.haitu.prototype.dto.response.RadarScanRespDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RadarService {
    List<RadarScanRespDTO> coordinatesForRadar();

    void remove(String uuid);

    String uploadData(MultipartFile file);

    FormDataRespDTO receiveData(FormSettingReqDTO formSettingParam);

    void refuseData();

    void uploadRadarCoordinates(RadarReqDTO radarReqDTO);
}
