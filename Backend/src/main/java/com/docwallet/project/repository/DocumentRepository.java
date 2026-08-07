package com.docwallet.project.repository;



import com.docwallet.project.dto.DocumentResponse;
import com.docwallet.project.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByOwnerId(Long ownerId);

    @Query("""
            select new com.docwallet.project.dto.DocumentResponse(
                d.id,
                d.filename,
                d.contentType,
                d.fileSize,
                d.uploadTimestamp
            )
            from Document d
            where d.owner.id = :ownerId
            order by d.uploadTimestamp desc
            """)
    List<DocumentResponse> findDocumentResponsesByOwnerId(@Param("ownerId") Long ownerId);
}
