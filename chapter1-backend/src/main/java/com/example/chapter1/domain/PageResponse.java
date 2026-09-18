package com.example.chapter1.domain;

import java.util.List;

public class PageResponse<T> {
    
    private List<T> content;
    private boolean hasMore;

    public PageResponse(List<T> content, boolean hasMore) {
        this.content = content;
        this.hasMore = hasMore;
    }

    public List<T> getContent() {
        return content;
    }

    public boolean isHasMore() {
        return hasMore;
    }
}
