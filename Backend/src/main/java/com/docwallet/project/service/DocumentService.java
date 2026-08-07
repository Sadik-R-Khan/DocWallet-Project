package com.docwallet.project.service;

import com.docwallet.project.dto.DocumentResponse;
import com.docwallet.project.model.Document;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {
    Document uploadDocument(MultipartFile file, String userEmail) throws Exception;
    List<Document> getUserDocuments(String userEmail);
    List<DocumentResponse> getUserDocumentResponses(String userEmail);
    byte[] downloadDocument(Long documentId, String userEmail) throws Exception;

    Document getDocumentMetaData(Long documentId, String userEmail);

    void deleteDocument(Long documentId, String userEmail);
}
