package com.smartcrime.portal.service.impl;

import com.smartcrime.portal.exception.ResourceNotFoundException;
import com.smartcrime.portal.model.CriminalProfile;
import com.smartcrime.portal.repository.CriminalProfileRepository;
import com.smartcrime.portal.service.CriminalProfileService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CriminalProfileServiceImpl implements CriminalProfileService {

    private final CriminalProfileRepository criminalProfileRepository;

    public CriminalProfileServiceImpl(CriminalProfileRepository criminalProfileRepository) {
        this.criminalProfileRepository = criminalProfileRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CriminalProfile> getAllCriminalProfiles() {
        return criminalProfileRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public CriminalProfile getCriminalProfileById(String id) {
        return criminalProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Criminal profile not found with id: " + id));
    }

    @Override
    public CriminalProfile createCriminalProfile(CriminalProfile criminalProfile) {
        return criminalProfileRepository.save(criminalProfile);
    }

    @Override
    public CriminalProfile updateCriminalProfile(String id, CriminalProfile updated) {
        CriminalProfile existing = getCriminalProfileById(id);
        if (updated.getCodeName() != null) existing.setCodeName(updated.getCodeName());
        if (updated.getLegalName() != null) existing.setLegalName(updated.getLegalName());
        if (updated.getAliases() != null) existing.setAliases(updated.getAliases());
        if (updated.getPhotoUrl() != null) existing.setPhotoUrl(updated.getPhotoUrl());
        if (updated.getDateOfBirth() != null) existing.setDateOfBirth(updated.getDateOfBirth());
        if (updated.getGender() != null) existing.setGender(updated.getGender());
        if (updated.getHeight() != null) existing.setHeight(updated.getHeight());
        if (updated.getBuild() != null) existing.setBuild(updated.getBuild());
        if (updated.getScarsOrTattoos() != null) existing.setScarsOrTattoos(updated.getScarsOrTattoos());
        if (updated.getThreatLevel() != null) existing.setThreatLevel(updated.getThreatLevel());
        if (updated.getModusOperandi() != null) existing.setModusOperandi(updated.getModusOperandi());
        if (updated.getPastConvictions() != null) existing.setPastConvictions(updated.getPastConvictions());
        if (updated.getKnownAssociates() != null) existing.setKnownAssociates(updated.getKnownAssociates());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
        if (updated.getLinkedCaseIds() != null) existing.setLinkedCaseIds(updated.getLinkedCaseIds());

        return criminalProfileRepository.save(existing);
    }
}
