package com.smartcrime.portal.service;

import com.smartcrime.portal.model.CriminalProfile;

import java.util.List;

public interface CriminalProfileService {
    List<CriminalProfile> getAllCriminalProfiles();
    CriminalProfile getCriminalProfileById(String id);
    CriminalProfile createCriminalProfile(CriminalProfile criminalProfile);
    CriminalProfile updateCriminalProfile(String id, CriminalProfile criminalProfile);
}
