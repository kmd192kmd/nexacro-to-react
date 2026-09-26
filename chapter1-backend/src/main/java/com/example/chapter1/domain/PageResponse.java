package com.example.chapter1.domain;

import java.util.List;

public class PageResponse<T> {
    
    private List<T> content;
    private boolean hasMore;
    private int totalCount;

    public PageResponse(List<T> content, boolean hasMore, int totalCount) {
        this.content = content;
        this.hasMore = hasMore;
        this.totalCount = totalCount;
    }

    public List<T> getContent() {
        return content;
    }

    public boolean isHasMore() {
        return hasMore;
    }

    public int getTotalCount() {
        return totalCount;
    }
}
