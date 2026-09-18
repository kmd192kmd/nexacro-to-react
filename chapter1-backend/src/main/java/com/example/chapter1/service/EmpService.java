package com.example.chapter1.service;

import com.example.chapter1.domain.Emp;
import com.example.chapter1.domain.PageResponse;

public interface EmpService {

    PageResponse<Emp> findAll(int page, int size);

    Emp findById(String empId);

    void insert(Emp emp);

    void update(Emp emp);

    void delete(String empId);

}
