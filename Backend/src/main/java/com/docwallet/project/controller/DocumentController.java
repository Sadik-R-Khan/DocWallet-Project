package com.docwallet.project.controller;


import com.docwallet.project.dto.DocumentResponse;
import com.docwallet.project.model.Document;
import com.docwallet.project.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<DocumentResponse> uploadFile(@RequestParam("file") MultipartFile file, Authentication authentication) throws Exception{
        if(file.isEmpty()){
            throw new RuntimeException("File is empty");
        }
        Document document = documentService.uploadDocument(file, authentication.getName());
        return ResponseEntity.ok(DocumentResponse.from(document));

    }

    @GetMapping
    public ResponseEntity<List<DocumentResponse>> getAllDocuments(Authentication authentication) throws Exception{
        return ResponseEntity.ok(documentService.getUserDocumentResponses(authentication.getName()));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> getDocument(@PathVariable Long id, Authentication authentication) throws Exception{
        String email = authentication.getName();
        Document metaData = documentService.getDocumentMetaData(id, email);
        byte[] data = documentService.downloadDocument(id, email);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metaData.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""+metaData.getFilename()+"\"")
                .body(data);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDocument(@PathVariable Long id, Authentication authentication) throws Exception{
        documentService.deleteDocument(id, authentication.getName());
        return ResponseEntity.ok("Document Deleted Successfully");
    }


}
