package com.smartcrime.portal.service.impl;

import com.smartcrime.portal.exception.ResourceNotFoundException;
import com.smartcrime.portal.model.Victim;
import com.smartcrime.portal.repository.VictimRepository;
import com.smartcrime.portal.service.VictimService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class VictimServiceImpl implements VictimService {

    private final VictimRepository victimRepository;

    public VictimServiceImpl(VictimRepository victimRepository) {
        this.victimRepository = victimRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Victim> getAllVictims() {
        return victimRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Victim getVictimById(String id) {
        return victimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Victim record not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Victim> getVictimsByCaseId(String caseId) {
        return victimRepository.findByCaseId(caseId);
    }

    @Override
    public Victim createVictim(Victim victim) {
        return victimRepository.save(victim);
    }

    @Override
    public Victim updateVictim(String id, Victim updated) {
        Victim existing = getVictimById(id);
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getAge() > 0) existing.setAge(updated.getAge());
        if (updated.getContactNumber() != null) existing.setContactNumber(updated.getContactNumber());
        if (updated.getAddress() != null) existing.setAddress(updated.getAddress());
        if (updated.getStatement() != null) existing.setStatement(updated.getStatement());
        if (updated.getProtectionStatus() != null) existing.setProtectionStatus(updated.getProtectionStatus());
        existing.setConfidential(updated.isConfidential());

        return victimRepository.save(existing);
    }

    @Override
    public void deleteVictim(String id) {
        if (!victimRepository.existsById(id)) {
            throw new ResourceNotFoundException("Victim record not found with id: " + id);
        }
        victimRepository.deleteById(id);
    }
}
