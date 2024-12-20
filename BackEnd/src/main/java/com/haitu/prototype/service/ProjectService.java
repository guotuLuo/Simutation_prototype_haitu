package com.haitu.prototype.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.haitu.prototype.dao.entity.ProjectDO;
import com.haitu.prototype.dto.request.ProjectReqDTO;
import com.haitu.prototype.dto.response.ProjectRespDTO;

import java.util.List;

public interface ProjectService extends IService<ProjectDO> {

    void storeProjectXML(ProjectReqDTO projectDTO);

    ProjectRespDTO queryProjectXML(String id);

    List<String> getProjectXMLIds();
}
