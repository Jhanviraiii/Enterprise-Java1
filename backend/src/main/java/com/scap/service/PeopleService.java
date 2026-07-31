package com.scap.service;

import com.scap.dto.VictimDto;
import com.scap.dto.WitnessDto;
import java.util.List;

public interface PeopleService {
    List<VictimDto> getVictimsByCase(String caseId);
    VictimDto addVictim(VictimDto victimDto);
    List<WitnessDto> getWitnessesByCase(String caseId);
    WitnessDto addWitness(WitnessDto witnessDto);
}
