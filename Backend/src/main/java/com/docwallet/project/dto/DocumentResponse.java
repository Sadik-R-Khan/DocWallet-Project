package com.docwallet.project.dto;

import com.docwallet.project.model.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DocumentResponse {
    private Long id;
    private String filename;
    private String contentType;
    private Long fileSize;
    private LocalDateTime uploadTimestamp;

    public static DocumentResponse from(Document document) {
        return new DocumentResponse(
                document.getId(),
                document.getFilename(),
                document.getContentType(),
                document.getFileSize(),
                document.getUploadTimestamp()
        );
    }
}
