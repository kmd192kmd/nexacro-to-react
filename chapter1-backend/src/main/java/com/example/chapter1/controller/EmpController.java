package com.example.chapter1.controller;

import com.example.chapter1.domain.Emp;
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
    public PageResponse<Emp> findAll(@RequestParam int page, @RequestParam int size) {
        return empService.findAll(page, size);
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

        emp.setEmpId(empId);

        empService.update(emp);
    }

    // 삭제
    @DeleteMapping("/{empId}")
    public void delete(@PathVariable String empId) {
        empService.delete(empId);
    }
}