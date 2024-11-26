package com.haitu.prototype.service;

import com.haitu.prototype.dto.request.AirplaneReqDTO;

public interface AirPlaneService {

    void uploadAirplaneCoordinates(AirplaneReqDTO airplaneReqDTO);

    void remove(String uuid);

    void setSpeed(AirplaneReqDTO airplaneReqDTO);

    void editName(AirplaneReqDTO airplaneReqDTO);

    void deleteTrackPoint(String uuid);

    void deleteAllTrackPoint();
}
