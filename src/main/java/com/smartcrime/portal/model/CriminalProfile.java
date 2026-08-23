package com.smartcrime.portal.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "criminal_profiles")
public class CriminalProfile {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", length = 255)
    private String id;

    @Column(name = "code_name")
    private String codeName;

    @Column(name = "legal_name", nullable = false)
    private String legalName;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "aliases", columnDefinition = "text[]")
    private List<String> aliases = new ArrayList<>();

    @Column(name = "photo_url", columnDefinition = "TEXT")
    private String photoUrl;

    @Column(name = "date_of_birth")
    private String dateOfBirth;

    @Column(name = "gender", length = 50)
    private String gender;

    @Column(name = "height", length = 50)
    private String height;

    @Column(name = "build", length = 50)
    private String build;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "scars_or_tattoos", columnDefinition = "text[]")
    private List<String> scarsOrTattoos = new ArrayList<>();

    @Column(name = "threat_level", length = 50)
    private String threatLevel; // LOW | MEDIUM | HIGH | EXTREME

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "modus_operandi", columnDefinition = "text[]")
    private List<String> modusOperandi = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "past_convictions", columnDefinition = "text[]")
    private List<String> pastConvictions = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "known_associates", columnDefinition = "text[]")
    private List<String> knownAssociates = new ArrayList<>();

    @Column(name = "status", length = 50)
    private String status; // WANTED | IN_CUSTODY | UNDER_SURVEILLANCE | CLEARED

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "linked_case_ids", columnDefinition = "text[]")
    private List<String> linkedCaseIds = new ArrayList<>();

    @PrePersist
    public void ensureId() {
        if (this.id == null || this.id.trim().isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }

    public CriminalProfile() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public String getLegalName() {
        return legalName;
    }

    public void setLegalName(String legalName) {
        this.legalName = legalName;
    }

    public List<String> getAliases() {
        return aliases;
    }

    public void setAliases(List<String> aliases) {
        this.aliases = aliases;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public String getBuild() {
        return build;
    }

    public void setBuild(String build) {
        this.build = build;
    }

    public List<String> getScarsOrTattoos() {
        return scarsOrTattoos;
    }

    public void setScarsOrTattoos(List<String> scarsOrTattoos) {
        this.scarsOrTattoos = scarsOrTattoos;
    }

    public String getThreatLevel() {
        return threatLevel;
    }

    public void setThreatLevel(String threatLevel) {
        this.threatLevel = threatLevel;
    }

    public List<String> getModusOperandi() {
        return modusOperandi;
    }

    public void setModusOperandi(List<String> modusOperandi) {
        this.modusOperandi = modusOperandi;
    }

    public List<String> getPastConvictions() {
        return pastConvictions;
    }

    public void setPastConvictions(List<String> pastConvictions) {
        this.pastConvictions = pastConvictions;
    }

    public List<String> getKnownAssociates() {
        return knownAssociates;
    }

    public void setKnownAssociates(List<String> knownAssociates) {
        this.knownAssociates = knownAssociates;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getLinkedCaseIds() {
        return linkedCaseIds;
    }

    public void setLinkedCaseIds(List<String> linkedCaseIds) {
        this.linkedCaseIds = linkedCaseIds;
    }
}
