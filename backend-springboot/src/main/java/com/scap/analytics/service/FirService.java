package com.scap.analytics.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.scap.analytics.model.FirEntity;
import com.scap.analytics.repository.FirJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
@Slf4j
public class FirService {

    private final Firestore firestore;
    private final FirJpaRepository firJpaRepository;
    private static final String FIRESTORE_COLLECTION = "firs";

    /**
     * Create or Sync FIR in Cloud Database (Firestore + PostgreSQL)
     */
    public FirEntity saveFir(FirEntity fir) throws ExecutionException, InterruptedException {
        if (fir.getId() == null || fir.getId().isEmpty()) {
            fir.setId("fir-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (fir.getCreatedAt() == null) {
            fir.setCreatedAt(LocalDateTime.now());
        }

        // 1. Persist to Cloud Firestore
        DocumentReference docRef = firestore.collection(FIRESTORE_COLLECTION).document(fir.getId());
        ApiFuture<WriteResult> future = docRef.set(fir);
        log.info("Persisted FIR [{}] to Cloud Firestore at: {}", fir.getFirNumber(), future.get().getUpdateTime());

        // 2. Persist to Relational PostgreSQL DB (if available)
        try {
            firJpaRepository.save(fir);
        } catch (Exception e) {
            log.warn("PostgreSQL JPA sync bypassed: {}", e.getMessage());
        }

        return fir;
    }

    /**
     * Retrieve all active FIRs from Cloud Firestore
     */
    public List<FirEntity> getAllFirs() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = firestore.collection(FIRESTORE_COLLECTION).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<FirEntity> firList = new ArrayList<>();
        for (QueryDocumentSnapshot doc : documents) {
            FirEntity entity = doc.toObject(FirEntity.class);
            firList.add(entity);
        }
        return firList;
    }

    /**
     * Retrieve FIR by ID
     */
    public Optional<FirEntity> getFirById(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(FIRESTORE_COLLECTION).document(id);
        DocumentSnapshot snapshot = docRef.get().get();

        if (snapshot.exists()) {
            return Optional.ofNullable(snapshot.toObject(FirEntity.class));
        }
        return Optional.empty();
    }
}
