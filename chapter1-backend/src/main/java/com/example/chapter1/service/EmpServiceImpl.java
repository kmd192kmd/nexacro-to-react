package com.example.chapter1.service;

import com.example.chapter1.domain.Emp;
import com.example.chapter1.domain.PageResponse;
import com.example.chapter1.mapper.EmpMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpServiceImpl implements EmpService {

    private final EmpMapper empMapper;

    public EmpServiceImpl(EmpMapper empMapper) {
        this.empMapper = empMapper;
    }

    @Override
    public PageResponse<Emp> findAll(int page, int size) {
        int offset = page * size;

        List<Emp> employees = empMapper.findAll(offset, size + 1);

        boolean hasMore = employees.size() > size;

        if(hasMore) {
            employees.remove(size);
        }

        return new PageResponse<>(employees, hasMore);
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
}