package com.haitu.prototype.service;

import com.haitu.prototype.dto.request.PointReqDTO;

public interface AirPlaneService {

    void uploadCoordinates(PointReqDTO pointRequest);

    void remove(String uuid);
}
