package com.smartcrime.portal.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "evidence_items")
public class EvidenceItem {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", length = 255)
    private String id;

    @Column(name = "case_id", length = 255)
    private String caseId;

    @Column(name = "case_number", length = 100)
    private String caseNumber;

    @Column(name = "evidence_code", unique = true, nullable = false, length = 100)
    private String evidenceCode; // e.g. EVD-2026-901

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "type", length = 100)
    private String type; // CCTV_VIDEO | FINGERPRINT | DIGITAL_FORENSIC | AUDIO_RECORDING | WEAPON_LOG | DOCUMENT

    @Column(name = "file_size", length = 50)
    private String fileSize;

    @Column(name = "file_format", length = 100)
    private String fileFormat;

    @Column(name = "sha256_hash", length = 100)
    private String sha256Hash;

    @Column(name = "collected_by")
    private String collectedBy;

    @Column(name = "collection_date")
    private String collectionDate;

    @Column(name = "storage_location", columnDefinition = "TEXT")
    private String storageLocation;

    @Column(name = "is_verified_integrity")
    private boolean isVerifiedIntegrity;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "custody_chain", columnDefinition = "jsonb")
    private List<ChainOfCustodyEntry> custodyChain = new ArrayList<>();

    @PrePersist
    public void ensureId() {
        if (this.id == null || this.id.trim().isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }

    public EvidenceItem() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCaseId() {
        return caseId;
    }

    public void setCaseId(String caseId) {
        this.caseId = caseId;
    }

    public String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
    }

    public String getEvidenceCode() {
        return evidenceCode;
    }

    public void setEvidenceCode(String evidenceCode) {
        this.evidenceCode = evidenceCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFileSize() {
        return fileSize;
    }

    public void setFileSize(String fileSize) {
        this.fileSize = fileSize;
    }

    public String getFileFormat() {
        return fileFormat;
    }

    public void setFileFormat(String fileFormat) {
        this.fileFormat = fileFormat;
    }

    public String getSha256Hash() {
        return sha256Hash;
    }

    public void setSha256Hash(String sha256Hash) {
        this.sha256Hash = sha256Hash;
    }

    public String getCollectedBy() {
        return collectedBy;
    }

    public void setCollectedBy(String collectedBy) {
        this.collectedBy = collectedBy;
    }

    public String getCollectionDate() {
        return collectionDate;
    }

    public void setCollectionDate(String collectionDate) {
        this.collectionDate = collectionDate;
    }

    public String getStorageLocation() {
        return storageLocation;
    }

    public void setStorageLocation(String storageLocation) {
        this.storageLocation = storageLocation;
    }

    public boolean isVerifiedIntegrity() {
        return isVerifiedIntegrity;
    }

    public void setVerifiedIntegrity(boolean verifiedIntegrity) {
        isVerifiedIntegrity = verifiedIntegrity;
    }

    public List<ChainOfCustodyEntry> getCustodyChain() {
        return custodyChain;
    }

    public void setCustodyChain(List<ChainOfCustodyEntry> custodyChain) {
        this.custodyChain = custodyChain;
    }
}
