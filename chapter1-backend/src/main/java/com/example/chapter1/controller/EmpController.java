package com.example.chapter1.controller;

import com.example.chapter1.domain.Emp;
import com.example.chapter1.domain.EmpSaveRequest;
import com.example.chapter1.domain.EmpSearchRequest;
import com.example.chapter1.domain.PageResponse;
import com.example.chapter1.service.EmpService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emp")
public class EmpController {

    private final EmpService empService;

    public EmpController(EmpService empService) {
        this.empService = empService;
    }

    // 전체 조회
    @GetMapping
    public PageResponse<Emp> findAll(EmpSearchRequest request) {
        return empService.findAll(request);
    }

    // 상세 조회
    @GetMapping("/{empId}")
    public Emp findById(@PathVariable String empId) {
        return empService.findById(empId);
    }

    // 등록
    @PostMapping
    public void insert(@RequestBody Emp emp) {
        empService.insert(emp);
    }

    // 수정
    @PutMapping("/{empId}")
    public void update(
            @PathVariable String empId,
            @RequestBody Emp emp
    ) {
        empService.update(emp);
    }

    // 삭제
    @DeleteMapping("/{empId}")
    public void delete(@PathVariable String empId) {
        empService.delete(empId);
    }

    // salary avg
    @GetMapping("/salary/avg")
    public int getSalaryAvg() {
        return empService.getSalaryAvg();
    }

    @PostMapping("/save")
    public void saveAll(@RequestBody EmpSaveRequest request) {
        empService.saveAll(request);
    }

}