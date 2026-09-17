package com.example.chapter1.domain;

import java.time.LocalDate;

public class Emp {

    private String empId;
    private String empName;
    private String deptCode;
    private String position;
    private LocalDate hireDate;
    private int salary;
    private String gender;
    private String married;
    private String skill;
    private String hobby;
    private String memo;

    @Override
    public String toString() {
        return "Emp [empId=" + empId + ", empName=" + empName + ", deptCode=" + deptCode + ", position=" + position
                + ", hireDate=" + hireDate + ", salary=" + salary + ", gender=" + gender + ", married=" + married
                + ", skill=" + skill + ", hobby=" + hobby + ", memo=" + memo + "]";
    }
    public void setEmpId(String empId) {
        this.empId = empId;
    }
    public void setEmpName(String empName) {
        this.empName = empName;
    }
    public void setDeptCode(String deptCode) {
        this.deptCode = deptCode;
    }
    public void setPosition(String position) {
        this.position = position;
    }
    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }
    public void setSalary(int salary) {
        this.salary = salary;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }
    public void setMarried(String married) {
        this.married = married;
    }
    public void setSkill(String skill) {
        this.skill = skill;
    }
    public void setHobby(String hobby) {
        this.hobby = hobby;
    }
    public void setMemo(String memo) {
        this.memo = memo;
    }
    public String getEmpId() {
        return empId;
    }
    public String getEmpName() {
        return empName;
    }
    public String getDeptCode() {
        return deptCode;
    }
    public String getPosition() {
        return position;
    }
    public LocalDate getHireDate() {
        return hireDate;
    }
    public int getSalary() {
        return salary;
    }
    public String getGender() {
        return gender;
    }
    public String getMarried() {
        return married;
    }
    public String getSkill() {
        return skill;
    }
    public String getHobby() {
        return hobby;
    }
    public String getMemo() {
        return memo;
    }

    
}
