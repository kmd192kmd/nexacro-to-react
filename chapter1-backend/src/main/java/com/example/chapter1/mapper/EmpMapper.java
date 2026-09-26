package com.example.chapter1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.chapter1.domain.Emp;
import com.example.chapter1.domain.EmpSearchRequest;

@Mapper 
public interface EmpMapper {

    List<Emp> findAll(
        @Param("request") EmpSearchRequest request,
        @Param("offset") int offset,
        @Param("size") int size
    );

    int countAll(@Param("request") EmpSearchRequest request);

    Emp findById(String empId);

    int insert(Emp emp);

    int update(Emp emp);

    int delete(String empId);

    int getSalaryAvg();

}
