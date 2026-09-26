package com.example.chapter1.service;

import com.example.chapter1.domain.Emp;
import com.example.chapter1.domain.EmpSaveRequest;
import com.example.chapter1.domain.EmpSearchRequest;
import com.example.chapter1.domain.PageResponse;
import com.example.chapter1.mapper.EmpMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmpServiceImpl implements EmpService {

    private final EmpMapper empMapper;

    public EmpServiceImpl(EmpMapper empMapper) {
        this.empMapper = empMapper;
    }

    @Override
    public PageResponse<Emp> findAll(EmpSearchRequest request) {
        int page = request.getPage();
        int size = request.getSize();
        int offset = page * size;

        List<Emp> employees = empMapper.findAll(request, offset, size + 1);

        boolean hasMore = employees.size() > size;

        if(hasMore) {
            employees.remove(size);
        }

        int totalCount = empMapper.countAll(request);

        return new PageResponse<>(employees, hasMore, totalCount);
    }

    @Override
    public Emp findById(String empId) {
        return empMapper.findById(empId);
    }

    @Override
    public void insert(Emp emp) {
        empMapper.insert(emp);
    }

    @Override
    public void update(Emp emp) {
        empMapper.update(emp);
    }

    @Override
    public void delete(String empId) {
        empMapper.delete(empId);
    }

    @Override 
    public int getSalaryAvg() {
        return empMapper.getSalaryAvg();
    }

    @Override 
    @Transactional 
    public void saveAll(EmpSaveRequest request) {
        if(request.getCreatedList() != null) {
            for(Emp emp : request.getCreatedList()) {
                empMapper.insert(emp);
            }
        }
        if(request.getUpdatedList() != null) {
            for(Emp emp : request.getUpdatedList()) {
                empMapper.update(emp);
            } 
        }
    }
}