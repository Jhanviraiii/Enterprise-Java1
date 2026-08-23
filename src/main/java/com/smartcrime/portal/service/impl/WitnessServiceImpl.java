package com.smartcrime.portal.service.impl;

import com.smartcrime.portal.exception.ResourceNotFoundException;
import com.smartcrime.portal.model.Witness;
import com.smartcrime.portal.repository.WitnessRepository;
import com.smartcrime.portal.service.WitnessService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class WitnessServiceImpl implements WitnessService {

    private final WitnessRepository witnessRepository;

    public WitnessServiceImpl(WitnessRepository witnessRepository) {
        this.witnessRepository = witnessRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Witness> getAllWitnesses() {
        return witnessRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Witness getWitnessById(String id) {
        return witnessRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Witness record not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Witness> getWitnessesByCaseId(String caseId) {
        return witnessRepository.findByCaseId(caseId);
    }

    @Override
    public Witness createWitness(Witness witness) {
        return witnessRepository.save(witness);
    }

    @Override
    public Witness updateWitness(String id, Witness updated) {
        Witness existing = getWitnessById(id);
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getContactNumber() != null) existing.setContactNumber(updated.getContactNumber());
        if (updated.getStatement() != null) existing.setStatement(updated.getStatement());
        if (updated.getCredibilityRating() != null) existing.setCredibilityRating(updated.getCredibilityRating());
        existing.setProtected(updated.isProtected());
        if (updated.getDepositionDate() != null) existing.setDepositionDate(updated.getDepositionDate());

        return witnessRepository.save(existing);
    }

    @Override
    public void deleteWitness(String id) {
        if (!witnessRepository.existsById(id)) {
            throw new ResourceNotFoundException("Witness record not found with id: " + id);
        }
        witnessRepository.deleteById(id);
    }
}
