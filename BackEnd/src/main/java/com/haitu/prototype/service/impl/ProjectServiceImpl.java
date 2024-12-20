package com.haitu.prototype.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.haitu.prototype.dao.entity.ProjectDO;
import com.haitu.prototype.dao.mapper.ProjectMapper;
import com.haitu.prototype.dto.request.ProjectReqDTO;
import com.haitu.prototype.dto.response.ProjectRespDTO;
import com.haitu.prototype.service.ProjectService;
import org.springframework.stereotype.Service;

@Service
public class ProjectServiceImpl extends ServiceImpl<ProjectMapper, ProjectDO> implements ProjectService{
    @Override
    public void storeProjectXML(ProjectReqDTO projectDTO) {
        ProjectDO groupDO = ProjectDO
                .builder()
                .id(projectDTO.getId())
                .name(projectDTO.getName())
                .xmlString(projectDTO.getXmlString())
                .build();
        baseMapper.insert(groupDO);
    }


    @Override
    public ProjectRespDTO queryProjectXML(String id) {
        // 查询所有项目
        LambdaQueryWrapper<ProjectDO> queryWrapper = Wrappers.lambdaQuery(ProjectDO.class)
                .eq(ProjectDO::getId, id);
        ProjectDO projectDO = baseMapper.selectOne(queryWrapper);

        // 将每个 ProjectDO 转换为 ProjectRespDTO 并返回
        return BeanUtil.toBean(projectDO, ProjectRespDTO.class);
    }
}
