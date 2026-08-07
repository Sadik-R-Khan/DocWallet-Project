package com.docwallet.project.service;

import com.docwallet.project.dto.DocumentResponse;
import com.docwallet.project.model.Document;
import com.docwallet.project.model.User;
import com.docwallet.project.repository.DocumentRepository;
import com.docwallet.project.repository.UserRepository;
import com.docwallet.project.util.EncryptionUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final EncryptionUtil encryptionUtil;

    public Document uploadDocument(MultipartFile file, String userEmail) throws Exception {
        User owner = userRepository.findByEmail(userEmail).orElseThrow(()-> new IllegalArgumentException("User does not exist"));

        byte[] encryptedData = encryptionUtil.encrypt(file.getBytes());

        Document document = Document.builder()
                .filename(file.getOriginalFilename())
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .uploadTimestamp(LocalDateTime.now())
                .encryptedData(encryptedData)
                .owner(owner)
                .build();

        return documentRepository.save(document);
    }

    public List<Document> getUserDocuments(String userEmail){
        User user = userRepository.findByEmail(userEmail).orElseThrow(()-> new RuntimeException("User not found"));

        return documentRepository.findByOwnerId(user.getId());
    }

    public List<DocumentResponse> getUserDocumentResponses(String userEmail){
        User user = userRepository.findByEmail(userEmail).orElseThrow(()-> new RuntimeException("User not found"));

        return documentRepository.findDocumentResponsesByOwnerId(user.getId());
    }

    @Override
    public byte[] downloadDocument(Long documentId, String userEmail) throws Exception{
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        if(!doc.getOwner().getEmail().equals(userEmail)){
            throw new RuntimeException("Document not found");
        }

        return encryptionUtil.decrypt(doc.getEncryptedData());
    }

    public Document getDocumentMetaData(Long documentId, String userEmail){
        Document doc= documentRepository.findById(documentId)
                .orElseThrow(()->new RuntimeException("Document not found"));

        if(!doc.getOwner().getEmail().equals(userEmail)){
            throw new RuntimeException("Document not found");
        }

        return doc;
    }

    public void deleteDocument(Long documentId, String userEmail){
        Document doc = documentRepository.findById(documentId).orElseThrow(()-> new RuntimeException("Document not found"));

        if(!doc.getOwner().getEmail().equals(userEmail)){
            throw new RuntimeException("Document not found");
        }

        documentRepository.delete(doc);
    }

}
