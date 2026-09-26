package com.example.chapter1.domain;

public class EmpSearchRequest {
  private int page = 0;
  private int size = 50;
  private String deptCode;
  private String name;
  private String gender;
  
  public int getPage() {
    return page;
  }
  public void setPage(int page) {
    this.page = page;
  }
  public int getSize() {
    return size;
  }
  public void setSize(int size) {
    this.size = size;
  }
  public String getDeptCode() {
    return deptCode;
  }
  public void setDeptCode(String deptCode) {
    this.deptCode = deptCode;
  }
  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  public String getGender() {
    return gender;
  }
  public void setGender(String gender) {
    this.gender = gender;
  }
  
  
}
