package com.example.chapter1.domain;

import java.util.List;

public class EmpSaveRequest {
  private List<Emp> createdList;
  private List<Emp> updatedList;

  public List<Emp> getCreatedList() {
    return createdList;
  }

  public List<Emp> getUpdatedList() {
    return updatedList;
  }

}
