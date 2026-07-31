package com.scap.controller;

import com.scap.dto.VictimDto;
import com.scap.dto.WitnessDto;
import com.scap.service.PeopleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/people")
@RequiredArgsConstructor
public class PeopleController {

    private final PeopleService peopleService;

    @GetMapping("/victims/case/{caseId}")
    public ResponseEntity<List<VictimDto>> getVictimsByCase(@PathVariable String caseId) {
        return ResponseEntity.ok(peopleService.getVictimsByCase(caseId));
    }

    @PostMapping("/victims")
    public ResponseEntity<VictimDto> addVictim(@Valid @RequestBody VictimDto victimDto) {
        return new ResponseEntity<>(peopleService.addVictim(victimDto), HttpStatus.CREATED);
    }

    @GetMapping("/witnesses/case/{caseId}")
    public ResponseEntity<List<WitnessDto>> getWitnessesByCase(@PathVariable String caseId) {
        return ResponseEntity.ok(peopleService.getWitnessesByCase(caseId));
    }

    @PostMapping("/witnesses")
    public ResponseEntity<WitnessDto> addWitness(@Valid @RequestBody WitnessDto witnessDto) {
        return new ResponseEntity<>(peopleService.addWitness(witnessDto), HttpStatus.CREATED);
    }
}
