package com.example.chapter1.service;

import java.util.List;

import com.example.chapter1.domain.Emp;

public interface EmpService {

    List<Emp> findAll();

    Emp findById(String empId);

    void insert(Emp emp);

    void update(Emp emp);

    void delete(String empId);

}
