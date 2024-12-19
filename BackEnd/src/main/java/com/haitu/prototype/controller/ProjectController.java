package com.haitu.prototype.controller;

import com.haitu.prototype.common.convention.result.Result;
import com.haitu.prototype.common.convention.result.Results;
import com.haitu.prototype.dto.request.ProjectReqDTO;
import com.haitu.prototype.dto.response.ProjectRespDTO;
import com.haitu.prototype.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/project")
public class ProjectController {
    public final ProjectService projectService;
    @PostMapping("/save")
    public Result<Void> storeProjectXML(@RequestBody ProjectReqDTO projectDTO){
        projectService.storeProjectXML(projectDTO);
        return Results.success();
    }

    @PostMapping("/query")
    public Result<ProjectRespDTO> getProjectXML(@RequestParam String id){
        return Results.success(projectService.queryProjectXML(id));
    }
}
