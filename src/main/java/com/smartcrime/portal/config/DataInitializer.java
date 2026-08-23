package com.smartcrime.portal.config;

import com.smartcrime.portal.model.*;
import com.smartcrime.portal.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final FirRepository firRepository;
    private final CriminalProfileRepository criminalProfileRepository;
    private final CrimeRecordRepository crimeRecordRepository;
    private final EvidenceRepository evidenceRepository;
    private final VictimRepository victimRepository;
    private final WitnessRepository witnessRepository;
    private final InvestigationNoteRepository investigationNoteRepository;
    private final PatternAlertRepository patternAlertRepository;
    private final AuditLogRepository auditLogRepository;

    public DataInitializer(
            UserRepository userRepository,
            FirRepository firRepository,
            CriminalProfileRepository criminalProfileRepository,
            CrimeRecordRepository crimeRecordRepository,
            EvidenceRepository evidenceRepository,
            VictimRepository victimRepository,
            WitnessRepository witnessRepository,
            InvestigationNoteRepository investigationNoteRepository,
            PatternAlertRepository patternAlertRepository,
            AuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.firRepository = firRepository;
        this.criminalProfileRepository = criminalProfileRepository;
        this.crimeRecordRepository = crimeRecordRepository;
        this.evidenceRepository = evidenceRepository;
        this.victimRepository = victimRepository;
        this.witnessRepository = witnessRepository;
        this.investigationNoteRepository = investigationNoteRepository;
        this.patternAlertRepository = patternAlertRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Starting SCAP Supabase PostgreSQL Data Initializer...");

        seedUsers();
        seedFirs();
        seedCriminalProfiles();
        seedCrimeRecords();
        seedEvidenceItems();
        seedVictims();
        seedWitnesses();
        seedInvestigationNotes();
        seedPatternAlerts();
        seedAuditLogs();

        log.info("SCAP Supabase PostgreSQL Data Initializer completed successfully!");
    }

    private void seedUsers() {
        List<User> users = Arrays.asList(
            new User("user-admin", "BADGE-1001", "Director Marcus Vance", "admin.vance@scap.gov", "ADMIN", "Command & Operations Division", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", "ACTIVE", "2026-07-30 21:45:10"),
            new User("user-officer", "BADGE-4420", "Officer Sarah Jenkins", "s.jenkins@metropolice.gov", "POLICE_OFFICER", "Central District Patrol Unit", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", "ACTIVE", "2026-07-30 22:01:15"),
            new User("user-investigator", "BADGE-7809", "Det. Raymond Cooper", "r.cooper@detective.gov", "INVESTIGATOR", "Major Crimes & Homicide Bureau", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", "ACTIVE", "2026-07-30 21:12:44"),
            new User("user-forensic", "BADGE-9912", "Dr. Aris Thorne", "a.thorne@forensics.gov", "FORENSIC_OFFICER", "Digital Forensics & Ballistics Lab", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", "ACTIVE", "2026-07-30 20:30:00")
        );

        for (User u : users) {
            if (!userRepository.existsById(u.getId())) {
                userRepository.save(u);
                log.info("Seeded User: {}", u.getId());
            } else {
                log.info("User already exists, skipping: {}", u.getId());
            }
        }
    }

    private void seedFirs() {
        // FIR 1
        if (!firRepository.existsById("fir-1")) {
            FIR f1 = new FIR();
            f1.setId("fir-1");
            f1.setFirNumber("FIR-2026-08942");
            f1.setTitle("Armed Robbery at First National Vault");
            f1.setIncidentType("Armed Robbery");
            f1.setComplainantName("Victor Sterling (Branch Manager)");
            f1.setComplainantContact("+1 (555) 234-8901");
            f1.setDistrict("Downtown Core");
            f1.setLocationDetails("742 Financial Ave, Downtown Core, Sector 4");
            f1.setIncidentDateTime("2026-07-28 14:15:00");
            f1.setFiledDateTime("2026-07-28 15:30:00");
            f1.setPriority("CRITICAL");
            f1.setStatus("TRANSFERRED_TO_INVESTIGATION");
            f1.setDescription("Three masked individuals entered bank vault with silenced submachine guns. Stole $1.4M in cash and bearer bonds. Fled in dark blue sedan with fake plates.");
            f1.setReportingOfficerId("user-officer");
            f1.setReportingOfficerName("Officer Sarah Jenkins");
            f1.setAssignedInvestigatorId("user-investigator");
            f1.setAssignedInvestigatorName("Det. Raymond Cooper");

            FirVersion h1 = new FirVersion();
            h1.setId("h-1");
            h1.setTimestamp("2026-07-28 15:30:00");
            h1.setUpdatedBy("Officer Sarah Jenkins");
            h1.setChangesSummary("Initial FIR registered following dispatch call.");
            h1.setStatus("FILED");

            FirVersion h2 = new FirVersion();
            h2.setId("h-2");
            h2.setTimestamp("2026-07-28 17:10:00");
            h2.setUpdatedBy("Director Marcus Vance");
            h2.setChangesSummary("Upgraded priority to CRITICAL; assigned Major Crimes Squad.");
            h2.setStatus("TRANSFERRED_TO_INVESTIGATION");

            f1.setHistory(Arrays.asList(h1, h2));
            firRepository.save(f1);
            log.info("Seeded FIR: fir-1");
        }

        // FIR 2
        if (!firRepository.existsById("fir-2")) {
            FIR f2 = new FIR();
            f2.setId("fir-2");
            f2.setFirNumber("FIR-2026-08103");
            f2.setTitle("Cyber Extortion & Data Encryption at BioTech Labs");
            f2.setIncidentType("Cyber Crime");
            f2.setComplainantName("Dr. Elena Rostova");
            f2.setComplainantContact("+1 (555) 987-1122");
            f2.setDistrict("Tech District");
            f2.setLocationDetails("108 Cyber Park Way, Building B");
            f2.setIncidentDateTime("2026-07-25 03:22:00");
            f2.setFiledDateTime("2026-07-25 08:00:00");
            f2.setPriority("HIGH");
            f2.setStatus("TRANSFERRED_TO_INVESTIGATION");
            f2.setDescription("Ransomware deployment targeting clinical trial databases. Ransom demand of 50 BTC. Attack vector traces to IP 192.168.x.x via malicious USB rubber ducky left in lobby.");
            f2.setReportingOfficerId("user-officer");
            f2.setReportingOfficerName("Officer Sarah Jenkins");
            f2.setAssignedInvestigatorId("user-investigator");
            f2.setAssignedInvestigatorName("Det. Raymond Cooper");

            FirVersion h3 = new FirVersion();
            h3.setId("h-3");
            h3.setTimestamp("2026-07-25 08:00:00");
            h3.setUpdatedBy("Officer Sarah Jenkins");
            h3.setChangesSummary("FIR logged after IT Security incident submission.");
            h3.setStatus("FILED");

            f2.setHistory(Arrays.asList(h3));
            firRepository.save(f2);
            log.info("Seeded FIR: fir-2");
        }

        // FIR 3
        if (!firRepository.existsById("fir-3")) {
            FIR f3 = new FIR();
            f3.setId("fir-3");
            f3.setFirNumber("FIR-2026-07490");
            f3.setTitle("Luxury Vehicle Heist at Harbor Marina");
            f3.setIncidentType("Vehicle Theft");
            f3.setComplainantName("Harrison Forde");
            f3.setComplainantContact("+1 (555) 443-0988");
            f3.setDistrict("Harbor Bay");
            f3.setLocationDetails("Pier 14 Slip 8, Harbor Marina");
            f3.setIncidentDateTime("2026-07-22 01:45:00");
            f3.setFiledDateTime("2026-07-22 07:15:00");
            f3.setPriority("MEDIUM");
            f3.setStatus("UNDER_REVIEW");
            f3.setDescription("Custom sports coupe bypassed electronic keyless ignition via signal repeater device. Fled south toward Interstate 95.");
            f3.setReportingOfficerId("user-officer");
            f3.setReportingOfficerName("Officer Sarah Jenkins");

            FirVersion h4 = new FirVersion();
            h4.setId("h-4");
            h4.setTimestamp("2026-07-22 07:15:00");
            h4.setUpdatedBy("Officer Sarah Jenkins");
            h4.setChangesSummary("Filed report from victim complaint.");
            h4.setStatus("FILED");

            f3.setHistory(Arrays.asList(h4));
            firRepository.save(f3);
            log.info("Seeded FIR: fir-3");
        }

        // FIR 4
        if (!firRepository.existsById("fir-4")) {
            FIR f4 = new FIR();
            f4.setId("fir-4");
            f4.setFirNumber("FIR-2026-06112");
            f4.setTitle("Narcotics Distribution Ring at Old Port Warehouse");
            f4.setIncidentType("Narcotics");
            f4.setComplainantName("Anonymous Informant");
            f4.setComplainantContact("PROTECTED");
            f4.setDistrict("Harbor Bay");
            f4.setLocationDetails("Warehouse 49B, Dockside Rd");
            f4.setIncidentDateTime("2026-07-18 23:00:00");
            f4.setFiledDateTime("2026-07-19 09:30:00");
            f4.setPriority("HIGH");
            f4.setStatus("TRANSFERRED_TO_INVESTIGATION");
            f4.setDescription("Undercover surveillance observed 500kg synthetic narcotics shipment being offloaded from cargo vessel. Suspects linked to \"Vortex Syndicate\".");
            f4.setReportingOfficerId("user-officer");
            f4.setReportingOfficerName("Officer Sarah Jenkins");
            f4.setAssignedInvestigatorId("user-investigator");
            f4.setAssignedInvestigatorName("Det. Raymond Cooper");

            FirVersion h5 = new FirVersion();
            h5.setId("h-5");
            h5.setTimestamp("2026-07-19 09:30:00");
            h5.setUpdatedBy("Officer Sarah Jenkins");
            h5.setChangesSummary("Narcotics Squad raid report filed.");
            h5.setStatus("TRANSFERRED_TO_INVESTIGATION");

            f4.setHistory(Arrays.asList(h5));
            firRepository.save(f4);
            log.info("Seeded FIR: fir-4");
        }
    }

    private void seedCriminalProfiles() {
        if (!criminalProfileRepository.existsById("crim-1")) {
            CriminalProfile c1 = new CriminalProfile();
            c1.setId("crim-1");
            c1.setCodeName("The Specter");
            c1.setLegalName("Darian Vance Rostoff");
            c1.setAliases(Arrays.asList("Ghost", "Cipher", "Vance"));
            c1.setPhotoUrl("https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80");
            c1.setDateOfBirth("1988-11-14");
            c1.setGender("Male");
            c1.setHeight("6 ft 1 in");
            c1.setBuild("Athletic / Lean");
            c1.setScarsOrTattoos(Arrays.asList("Dragon Tattoo on Left Forearm", "Surgical scar right jaw"));
            c1.setThreatLevel("EXTREME");
            c1.setModusOperandi(Arrays.asList("High-Tech Heists", "Signal Jamming", "Physical Cyber Intrusion", "Dark Blue Sedan Escape"));
            c1.setPastConvictions(Arrays.asList("Armed Robbery (2018 - Served 4 yrs)", "Grand Theft Auto (2015)", "Possession of Class-A Firearms (2012)"));
            c1.setKnownAssociates(Arrays.asList("Damian Cross (\"The Hammer\")", "Kira Novak (\"Hex\")"));
            c1.setStatus("WANTED");
            c1.setLinkedCaseIds(Arrays.asList("cr-1", "cr-2"));
            criminalProfileRepository.save(c1);
            log.info("Seeded CriminalProfile: crim-1");
        }

        if (!criminalProfileRepository.existsById("crim-2")) {
            CriminalProfile c2 = new CriminalProfile();
            c2.setId("crim-2");
            c2.setCodeName("The Hammer");
            c2.setLegalName("Damian Cross");
            c2.setAliases(Arrays.asList("Sledge", "Big Red"));
            c2.setPhotoUrl("https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80");
            c2.setDateOfBirth("1984-03-29");
            c2.setGender("Male");
            c2.setHeight("6 ft 4 in");
            c2.setBuild("Heavy / Muscular");
            c2.setScarsOrTattoos(Arrays.asList("Knuckle Tattoos \"FAITH/FEAR\"", "Burn mark right neck"));
            c2.setThreatLevel("HIGH");
            c2.setModusOperandi(Arrays.asList("Vault Breaching", "Heavy Automatic Weapons", "Physical Assault"));
            c2.setPastConvictions(Arrays.asList("Aggravated Assault (2019)", "Bank Robbery accomplice (2016)"));
            c2.setKnownAssociates(Arrays.asList("Darian Vance Rostoff"));
            c2.setStatus("IN_CUSTODY");
            c2.setLinkedCaseIds(Arrays.asList("cr-1"));
            criminalProfileRepository.save(c2);
            log.info("Seeded CriminalProfile: crim-2");
        }

        if (!criminalProfileRepository.existsById("crim-3")) {
            CriminalProfile c3 = new CriminalProfile();
            c3.setId("crim-3");
            c3.setCodeName("Baron");
            c3.setLegalName("Victor Kreshnikov");
            c3.setAliases(Arrays.asList("The Tsar", "Kresh"));
            c3.setPhotoUrl("https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80");
            c3.setDateOfBirth("1979-07-02");
            c3.setGender("Male");
            c3.setHeight("5 ft 11 in");
            c3.setBuild("Stocky");
            c3.setScarsOrTattoos(Arrays.asList("Eagle Emblem chest tattoo"));
            c3.setThreatLevel("HIGH");
            c3.setModusOperandi(Arrays.asList("Container Smuggling", "Bribery", "Counterfeit Manifests"));
            c3.setPastConvictions(Arrays.asList("Narcotics Trafficking (2020)"));
            c3.setKnownAssociates(Arrays.asList("Harbor Dock Syndicate"));
            c3.setStatus("UNDER_SURVEILLANCE");
            c3.setLinkedCaseIds(Arrays.asList("cr-3"));
            criminalProfileRepository.save(c3);
            log.info("Seeded CriminalProfile: crim-3");
        }
    }

    private void seedCrimeRecords() {
        if (!crimeRecordRepository.existsById("cr-1")) {
            CrimeRecord cr1 = new CrimeRecord();
            cr1.setId("cr-1");
            cr1.setCaseNumber("CR-2026-4410");
            cr1.setFirId("fir-1");
            cr1.setFirNumber("FIR-2026-08942");
            cr1.setTitle("First National Bank Vault Heist");
            cr1.setCrimeType("Armed Robbery");
            cr1.setDistrict("Downtown Core");
            cr1.setLocationAddress("742 Financial Ave, Downtown Core");
            cr1.setCoordinates(new Coordinates(45, 35));
            cr1.setDateTimeOccurred("2026-07-28 14:15:00");
            cr1.setDescription("Armed robbery execution with military-grade tactical gear, wireless signal jamming, and dark blue escape sedan.");
            cr1.setAssignedInvestigatorId("user-investigator");
            cr1.setAssignedInvestigatorName("Det. Raymond Cooper");
            cr1.setStatus("UNDER_INVESTIGATION");
            cr1.setSeverity("CRITICAL");
            cr1.setModusOperandi(Arrays.asList("Silenced Submachine Guns", "Wireless EMP Jammer", "Dark Blue Sedan Escape", "Thermal Face Masks"));
            cr1.setVehicleDetails("2024 Dark Blue Sedan, Tinted Windows, Stolen Plate #7XYZ99");
            cr1.setSuspectPhoneNumbers(Arrays.asList("+1 555-019-8832", "+1 555-019-4410"));
            cr1.setIpAddress("198.51.100.44");
            cr1.setLinkedCriminalIds(Arrays.asList("crim-1", "crim-2"));
            cr1.setEvidenceIds(Arrays.asList("evd-1", "evd-2"));
            cr1.setVictimIds(Arrays.asList("vic-1"));
            cr1.setWitnessIds(Arrays.asList("wit-1", "wit-2"));
            crimeRecordRepository.save(cr1);
            log.info("Seeded CrimeRecord: cr-1");
        }

        if (!crimeRecordRepository.existsById("cr-2")) {
            CrimeRecord cr2 = new CrimeRecord();
            cr2.setId("cr-2");
            cr2.setCaseNumber("CR-2026-3982");
            cr2.setFirId("fir-2");
            cr2.setFirNumber("FIR-2026-08103");
            cr2.setTitle("BioTech Clinical Trial Database Extortion");
            cr2.setCrimeType("Cyber Crime");
            cr2.setDistrict("Tech District");
            cr2.setLocationAddress("108 Cyber Park Way");
            cr2.setCoordinates(new Coordinates(75, 25));
            cr2.setDateTimeOccurred("2026-07-25 03:22:00");
            cr2.setDescription("Targeted ransomware attack with physical drop of USB Rubber Ducky and custom Cobalt Strike beacon.");
            cr2.setAssignedInvestigatorId("user-investigator");
            cr2.setAssignedInvestigatorName("Det. Raymond Cooper");
            cr2.setStatus("UNDER_INVESTIGATION");
            cr2.setSeverity("SEVERE");
            cr2.setModusOperandi(Arrays.asList("Physical USB Drop", "Cobalt Strike Beacon", "Bitcoin Ransom Demand", "Dark Blue Sedan Surveillance"));
            cr2.setVehicleDetails("Dark Blue Sedan observed parked outside lab at 02:45 AM");
            cr2.setSuspectPhoneNumbers(Arrays.asList("+1 555-019-8832"));
            cr2.setIpAddress("198.51.100.44");
            cr2.setLinkedCriminalIds(Arrays.asList("crim-1"));
            cr2.setEvidenceIds(Arrays.asList("evd-3"));
            cr2.setVictimIds(Arrays.asList("vic-2"));
            cr2.setWitnessIds(Arrays.asList("wit-3"));
            crimeRecordRepository.save(cr2);
            log.info("Seeded CrimeRecord: cr-2");
        }

        if (!crimeRecordRepository.existsById("cr-3")) {
            CrimeRecord cr3 = new CrimeRecord();
            cr3.setId("cr-3");
            cr3.setCaseNumber("CR-2026-2104");
            cr3.setFirId("fir-4");
            cr3.setFirNumber("FIR-2026-06112");
            cr3.setTitle("Dockside Cargo Syndicate Trafficking");
            cr3.setCrimeType("Narcotics");
            cr3.setDistrict("Harbor Bay");
            cr3.setLocationAddress("Warehouse 49B, Dockside Rd");
            cr3.setCoordinates(new Coordinates(25, 70));
            cr3.setDateTimeOccurred("2026-07-18 23:00:00");
            cr3.setDescription("Large scale synthetic narcotics shipment distribution ring spanning harbor docks and container yards.");
            cr3.setAssignedInvestigatorId("user-investigator");
            cr3.setAssignedInvestigatorName("Det. Raymond Cooper");
            cr3.setStatus("SOLVED");
            cr3.setSeverity("SEVERE");
            cr3.setModusOperandi(Arrays.asList("Forged Shipping Manifests", "GPS Container Trackers", "Heavy Weapon Security Escort"));
            cr3.setLinkedCriminalIds(Arrays.asList("crim-3"));
            cr3.setEvidenceIds(Arrays.asList("evd-4"));
            cr3.setWitnessIds(Arrays.asList("wit-4"));
            crimeRecordRepository.save(cr3);
            log.info("Seeded CrimeRecord: cr-3");
        }
    }

    private void seedEvidenceItems() {
        if (!evidenceRepository.existsById("evd-1")) {
            EvidenceItem e1 = new EvidenceItem();
            e1.setId("evd-1");
            e1.setCaseId("cr-1");
            e1.setCaseNumber("CR-2026-4410");
            e1.setEvidenceCode("EVD-2026-901");
            e1.setTitle("Bank Vault CCTV 4K Footage (Cam #4)");
            e1.setType("CCTV_VIDEO");
            e1.setFileSize("1.42 GB");
            e1.setFileFormat("MP4 / H.264");
            e1.setSha256Hash("a8f5f167f44f4964e6c998dee827110c5cf6748280327918a5996f2a281e285d");
            e1.setCollectedBy("Det. Raymond Cooper");
            e1.setCollectionDate("2026-07-28 16:00:00");
            e1.setStorageLocation("Digital Forensics Server Alpha - Vault /evd/2026/08942/");
            e1.setVerifiedIntegrity(true);

            ChainOfCustodyEntry c1 = new ChainOfCustodyEntry();
            c1.setId("c-1");
            c1.setTimestamp("2026-07-28 16:00:00");
            c1.setHandledBy("Det. Raymond Cooper");
            c1.setBadgeNumber("BADGE-7809");
            c1.setAction("UPLOADED");
            c1.setNotes("Secured directly from bank NVR server during initial crime scene processing.");

            ChainOfCustodyEntry c2 = new ChainOfCustodyEntry();
            c2.setId("c-2");
            c2.setTimestamp("2026-07-28 18:30:00");
            c2.setHandledBy("Dr. Aris Thorne");
            c2.setBadgeNumber("BADGE-9912");
            c2.setAction("TRANSFER_TO_LAB");
            c2.setNotes("Transferred to Forensics Lab. SHA-256 hash verified successfully.");

            e1.setCustodyChain(Arrays.asList(c1, c2));
            evidenceRepository.save(e1);
            log.info("Seeded EvidenceItem: evd-1");
        }

        if (!evidenceRepository.existsById("evd-2")) {
            EvidenceItem e2 = new EvidenceItem();
            e2.setId("evd-2");
            e2.setCaseId("cr-1");
            e2.setCaseNumber("CR-2026-4410");
            e2.setEvidenceCode("EVD-2026-902");
            e2.setTitle("Latent Fingerprint Lift - Vault Keypad");
            e2.setType("FINGERPRINT");
            e2.setFileSize("48 MB");
            e2.setFileFormat("RAW / High-Res Scan");
            e2.setSha256Hash("5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
            e2.setCollectedBy("Dr. Aris Thorne");
            e2.setCollectionDate("2026-07-28 17:15:00");
            e2.setStorageLocation("Forensics Safe #3 & AFIS Database Entry #8812");
            e2.setVerifiedIntegrity(true);

            ChainOfCustodyEntry c3 = new ChainOfCustodyEntry();
            c3.setId("c-3");
            c3.setTimestamp("2026-07-28 17:15:00");
            c3.setHandledBy("Dr. Aris Thorne");
            c3.setBadgeNumber("BADGE-9912");
            c3.setAction("UPLOADED");
            c3.setNotes("Latent print lifted using silver powder from stainless steel vault handle.");

            e2.setCustodyChain(Arrays.asList(c3));
            evidenceRepository.save(e2);
            log.info("Seeded EvidenceItem: evd-2");
        }

        if (!evidenceRepository.existsById("evd-3")) {
            EvidenceItem e3 = new EvidenceItem();
            e3.setId("evd-3");
            e3.setCaseId("cr-2");
            e3.setCaseNumber("CR-2026-3982");
            e3.setEvidenceCode("EVD-2026-903");
            e3.setTitle("USB Rubber Ducky Keystroke Injector Payload");
            e3.setType("DIGITAL_FORENSIC");
            e3.setFileSize("12 KB");
            e3.setFileFormat("BIN / HEX Dump");
            e3.setSha256Hash("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
            e3.setCollectedBy("Dr. Aris Thorne");
            e3.setCollectionDate("2026-07-25 10:45:00");
            e3.setStorageLocation("Cyber Crime Vault / Node #09");
            e3.setVerifiedIntegrity(true);

            ChainOfCustodyEntry c4 = new ChainOfCustodyEntry();
            c4.setId("c-4");
            c4.setTimestamp("2026-07-25 10:45:00");
            c4.setHandledBy("Dr. Aris Thorne");
            c4.setBadgeNumber("BADGE-9912");
            c4.setAction("UPLOADED");
            c4.setNotes("Extracted from physical USB drive retrieved from BioTech lobby floor.");

            e3.setCustodyChain(Arrays.asList(c4));
            evidenceRepository.save(e3);
            log.info("Seeded EvidenceItem: evd-3");
        }

        if (!evidenceRepository.existsById("evd-4")) {
            EvidenceItem e4 = new EvidenceItem();
            e4.setId("evd-4");
            e4.setCaseId("cr-3");
            e4.setCaseNumber("CR-2026-2104");
            e4.setEvidenceCode("EVD-2026-904");
            e4.setTitle("Intercepted Encrypted Radio Frequency Audio");
            e4.setType("AUDIO_RECORDING");
            e4.setFileSize("312 MB");
            e4.setFileFormat("WAV / Uncompressed");
            e4.setSha256Hash("87734a5a2b8d87734a5a2b8d87734a5a2b8d87734a5a2b8d87734a5a2b8d8773");
            e4.setCollectedBy("Det. Raymond Cooper");
            e4.setCollectionDate("2026-07-19 02:00:00");
            e4.setStorageLocation("Audio Evidence Vault #2");
            e4.setVerifiedIntegrity(true);

            ChainOfCustodyEntry c5 = new ChainOfCustodyEntry();
            c5.setId("c-5");
            c5.setTimestamp("2026-07-19 02:00:00");
            c5.setHandledBy("Det. Raymond Cooper");
            c5.setBadgeNumber("BADGE-7809");
            c5.setAction("UPLOADED");
            c5.setNotes("Captured via wiretap warrant #2026-WT-401.");

            e4.setCustodyChain(Arrays.asList(c5));
            evidenceRepository.save(e4);
            log.info("Seeded EvidenceItem: evd-4");
        }
    }

    private void seedVictims() {
        if (!victimRepository.existsById("vic-1")) {
            Victim v1 = new Victim();
            v1.setId("vic-1");
            v1.setCaseId("cr-1");
            v1.setName("Victor Sterling");
            v1.setAge(52);
            v1.setContactNumber("+1 (555) 234-8901");
            v1.setAddress("42 Oakridge Blvd, Suburbia");
            v1.setStatement("I was forced at gunpoint to unlock vault door #2. The leader spoke with a faint European accent and communicated via earpiece.");
            v1.setProtectionStatus("REQUESTED");
            v1.setConfidential(false);
            victimRepository.save(v1);
            log.info("Seeded Victim: vic-1");
        }

        if (!victimRepository.existsById("vic-2")) {
            Victim v2 = new Victim();
            v2.setId("vic-2");
            v2.setCaseId("cr-2");
            v2.setName("Dr. Elena Rostova");
            v2.setAge(44);
            v2.setContactNumber("+1 (555) 987-1122");
            v2.setAddress("12 Innovation Way, Tech Heights");
            v2.setStatement("Our clinical trial servers were locked at 3:22 AM. The ransomware note displayed a countdown timer and demanded 50 BTC.");
            v2.setProtectionStatus("NONE");
            v2.setConfidential(true);
            victimRepository.save(v2);
            log.info("Seeded Victim: vic-2");
        }
    }

    private void seedWitnesses() {
        if (!witnessRepository.existsById("wit-1")) {
            Witness w1 = new Witness();
            w1.setId("wit-1");
            w1.setCaseId("cr-1");
            w1.setName("Marcus Brody");
            w1.setContactNumber("+1 (555) 667-0012");
            w1.setStatement("I saw a dark blue sedan with darkened windows parked in the alley for 20 minutes prior to the alarm. License plate had dirt covering last two digits.");
            w1.setCredibilityRating("HIGH");
            w1.setProtected(true);
            w1.setDepositionDate("2026-07-29 10:00:00");
            witnessRepository.save(w1);
            log.info("Seeded Witness: wit-1");
        }

        if (!witnessRepository.existsById("wit-2")) {
            Witness w2 = new Witness();
            w2.setId("wit-2");
            w2.setCaseId("cr-1");
            w2.setName("Clara Oswald");
            w2.setContactNumber("+1 (555) 332-9090");
            w2.setStatement("Heard submachine gun suppressors discharging inside lobby. Saw suspects wearing high-end tactical boots.");
            w2.setCredibilityRating("MODERATE");
            w2.setProtected(false);
            witnessRepository.save(w2);
            log.info("Seeded Witness: wit-2");
        }

        if (!witnessRepository.existsById("wit-3")) {
            Witness w3 = new Witness();
            w3.setId("wit-3");
            w3.setCaseId("cr-2");
            w3.setName("Kevin Zhang (Night Guard)");
            w3.setContactNumber("+1 (555) 881-2309");
            w3.setStatement("A tall male wearing a dark hoodie approached asking for directions to elevator around 02:30 AM before leaving a small device near reception counter.");
            w3.setCredibilityRating("HIGH");
            w3.setProtected(false);
            w3.setDepositionDate("2026-07-26 14:00:00");
            witnessRepository.save(w3);
            log.info("Seeded Witness: wit-3");
        }

        if (!witnessRepository.existsById("wit-4")) {
            Witness w4 = new Witness();
            w4.setId("wit-4");
            w4.setCaseId("cr-3");
            w4.setName("Captain Sean O'Connor");
            w4.setContactNumber("+1 (555) 770-4411");
            w4.setStatement("Observed crates marked \"Agricultural Machinery\" being transferred into unmarked refrigerated trucks.");
            w4.setCredibilityRating("HIGH");
            w4.setProtected(true);
            witnessRepository.save(w4);
            log.info("Seeded Witness: wit-4");
        }
    }

    private void seedInvestigationNotes() {
        if (!investigationNoteRepository.existsById("note-1")) {
            InvestigationNote n1 = new InvestigationNote();
            n1.setId("note-1");
            n1.setCaseId("cr-1");
            n1.setTimestamp("2026-07-28 18:00:00");
            n1.setAuthorName("Det. Raymond Cooper");
            n1.setAuthorRole("INVESTIGATOR");
            n1.setContent("Initial scene processing complete. Vault lock #2 was bypassed using an electronic bypass key paired with an insider override code. Cross-checking bank personnel database.");
            n1.setCategory("CASE_DECISION");
            investigationNoteRepository.save(n1);
            log.info("Seeded InvestigationNote: note-1");
        }

        if (!investigationNoteRepository.existsById("note-2")) {
            InvestigationNote n2 = new InvestigationNote();
            n2.setId("note-2");
            n2.setCaseId("cr-1");
            n2.setTimestamp("2026-07-29 09:30:00");
            n2.setAuthorName("Dr. Aris Thorne");
            n2.setAuthorRole("FORENSIC_OFFICER");
            n2.setContent("Partial fingerprint lift match returned 91% score with AFIS entry for Darian Vance Rostoff (\"The Specter\"). SHA-256 digital hash of CCTV corroborates physical build and dark blue sedan escape vehicle.");
            n2.setCategory("FORENSIC_UPDATE");
            investigationNoteRepository.save(n2);
            log.info("Seeded InvestigationNote: note-2");
        }

        if (!investigationNoteRepository.existsById("note-3")) {
            InvestigationNote n3 = new InvestigationNote();
            n3.setId("note-3");
            n3.setCaseId("cr-2");
            n3.setTimestamp("2026-07-26 11:15:00");
            n3.setAuthorName("Det. Raymond Cooper");
            n3.setAuthorRole("INVESTIGATOR");
            n3.setContent("Witness Kevin Zhang confirms seeing dark blue sedan parked near lab entrance prior to USB drop. IP 198.51.100.44 traces to same virtual private server used in Bank Vault robbery reconnaissance!");
            n3.setCategory("LEAD");
            investigationNoteRepository.save(n3);
            log.info("Seeded InvestigationNote: note-3");
        }
    }

    private void seedPatternAlerts() {
        if (!patternAlertRepository.existsById("alert-1")) {
            PatternAlert a1 = new PatternAlert();
            a1.setId("alert-1");
            a1.setTitle("High MO & Vehicle Match Detected: Bank Heist vs Cyber Extortion");
            a1.setSimilarityScore(94.0);
            a1.setMatchedFactors(Arrays.asList(
                "Identical Vehicle: Dark Blue Sedan w/ Tinted Windows",
                "Shared IP Subnet: 198.51.100.xx Reconnaissance",
                "Primary Suspect Link: Darian Vance Rostoff (\"The Specter\")",
                "Timing Proximity: Within 72 Hours"
            ));
            a1.setPrimaryCaseId("cr-1");
            a1.setPrimaryFirNumber("FIR-2026-08942");
            a1.setRelatedCaseId("cr-2");
            a1.setRelatedFirNumber("FIR-2026-08103");
            a1.setDetectionDate("2026-07-29 12:30:00");
            a1.setStatus("UNREVIEWED");
            a1.setSuspectId("crim-1");
            a1.setSuspectAlias("The Specter");
            patternAlertRepository.save(a1);
            log.info("Seeded PatternAlert: alert-1");
        }

        if (!patternAlertRepository.existsById("alert-2")) {
            PatternAlert a2 = new PatternAlert();
            a2.setId("alert-2");
            a2.setTitle("Hotspot Signal Pattern: Harbor Bay Cargo & Luxury Auto Theft");
            a2.setSimilarityScore(82.0);
            a2.setMatchedFactors(Arrays.asList(
                "Geographic Radius: < 1.5 km in Harbor Bay",
                "Time Window: Late Night 01:00 - 03:00 AM",
                "Signal Jamming Hardware Signature"
            ));
            a2.setPrimaryCaseId("cr-3");
            a2.setPrimaryFirNumber("FIR-2026-06112");
            a2.setRelatedCaseId("cr-3");
            a2.setRelatedFirNumber("FIR-2026-07490");
            a2.setDetectionDate("2026-07-28 04:15:00");
            a2.setStatus("CONFIRMED");
            patternAlertRepository.save(a2);
            log.info("Seeded PatternAlert: alert-2");
        }
    }

    private void seedAuditLogs() {
        if (!auditLogRepository.existsById("log-1")) {
            AuditLog l1 = new AuditLog();
            l1.setId("log-1");
            l1.setTimestamp("2026-07-30 22:01:15");
            l1.setBadgeNumber("BADGE-4420");
            l1.setUserName("Officer Sarah Jenkins");
            l1.setRole("POLICE_OFFICER");
            l1.setAction("USER_LOGIN");
            l1.setModule("AUTH");
            l1.setDetails("Authenticated successfully via JWT terminal session.");
            l1.setIpAddress("10.14.0.52");
            auditLogRepository.save(l1);
            log.info("Seeded AuditLog: log-1");
        }

        if (!auditLogRepository.existsById("log-2")) {
            AuditLog l2 = new AuditLog();
            l2.setId("log-2");
            l2.setTimestamp("2026-07-30 21:45:10");
            l2.setBadgeNumber("BADGE-1001");
            l2.setUserName("Director Marcus Vance");
            l2.setRole("ADMIN");
            l2.setAction("USER_LOGIN");
            l2.setModule("AUTH");
            l2.setDetails("Administrator session initiated with full audit privileges.");
            l2.setIpAddress("10.14.0.10");
            auditLogRepository.save(l2);
            log.info("Seeded AuditLog: log-2");
        }

        if (!auditLogRepository.existsById("log-3")) {
            AuditLog l3 = new AuditLog();
            l3.setId("log-3");
            l3.setTimestamp("2026-07-29 12:30:00");
            l3.setBadgeNumber("SYSTEM_ENGINE");
            l3.setUserName("SCAP Pattern Engine");
            l3.setRole("ADMIN");
            l3.setAction("PATTERN_ALERT_GENERATED");
            l3.setModule("CRIME");
            l3.setDetails("Cross-case pattern detection generated alert alert-1 (94% match) between FIR-2026-08942 and FIR-2026-08103.");
            l3.setIpAddress("127.0.0.1");
            auditLogRepository.save(l3);
            log.info("Seeded AuditLog: log-3");
        }

        if (!auditLogRepository.existsById("log-4")) {
            AuditLog l4 = new AuditLog();
            l4.setId("log-4");
            l4.setTimestamp("2026-07-28 17:15:00");
            l4.setBadgeNumber("BADGE-9912");
            l4.setUserName("Dr. Aris Thorne");
            l4.setRole("FORENSIC_OFFICER");
            l4.setAction("EVIDENCE_UPLOAD");
            l4.setModule("EVIDENCE");
            l4.setDetails("Uploaded evidence item EVD-2026-902 with SHA-256 verification hash: 5e884898da280471...");
            l4.setIpAddress("10.14.2.88");
            auditLogRepository.save(l4);
            log.info("Seeded AuditLog: log-4");
        }

        if (!auditLogRepository.existsById("log-5")) {
            AuditLog l5 = new AuditLog();
            l5.setId("log-5");
            l5.setBadgeNumber("BADGE-4420");
            l5.setTimestamp("2026-07-28 15:30:00");
            l5.setUserName("Officer Sarah Jenkins");
            l5.setRole("POLICE_OFFICER");
            l5.setAction("FIR_FILED");
            l5.setModule("FIR");
            l5.setDetails("Filed new FIR-2026-08942 for Armed Robbery at Downtown Core.");
            l5.setIpAddress("10.14.0.52");
            auditLogRepository.save(l5);
            log.info("Seeded AuditLog: log-5");
        }
    }
}
