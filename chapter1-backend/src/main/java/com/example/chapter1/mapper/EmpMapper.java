package com.example.chapter1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.chapter1.domain.Emp;

@Mapper 
public interface EmpMapper {

    List<Emp> findAll(int offset, int size);

    Emp findById(String empId);

    int insert(Emp emp);

    int update(Emp emp);

    int delete(String empId);

    int getSalaryAvg();

}
