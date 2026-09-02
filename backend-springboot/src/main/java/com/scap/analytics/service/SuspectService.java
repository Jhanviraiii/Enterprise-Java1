package com.scap.analytics.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.scap.analytics.model.SuspectEntity;
import com.scap.analytics.repository.SuspectJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
@Slf4j
public class SuspectService {

    private final Firestore firestore;
    private final SuspectJpaRepository suspectJpaRepository;
    private static final String FIRESTORE_COLLECTION = "suspects";

    public SuspectEntity saveSuspect(SuspectEntity suspect) throws ExecutionException, InterruptedException {
        if (suspect.getId() == null || suspect.getId().isEmpty()) {
            suspect.setId("susp-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (suspect.getCreatedAt() == null) {
            suspect.setCreatedAt(LocalDateTime.now());
        }

        DocumentReference docRef = firestore.collection(FIRESTORE_COLLECTION).document(suspect.getId());
        ApiFuture<WriteResult> future = docRef.set(suspect);
        log.info("Persisted Suspect Dossier [{}] to Firestore at: {}", suspect.getFullName(), future.get().getUpdateTime());

        try {
            suspectJpaRepository.save(suspect);
        } catch (Exception e) {
            log.warn("PostgreSQL JPA sync for suspect bypassed: {}", e.getMessage());
        }

        return suspect;
    }

    public List<SuspectEntity> getAllSuspects() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = firestore.collection(FIRESTORE_COLLECTION).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<SuspectEntity> suspects = new ArrayList<>();
        for (QueryDocumentSnapshot doc : documents) {
            suspects.add(doc.toObject(SuspectEntity.class));
        }
        return suspects;
    }

    public Optional<SuspectEntity> getSuspectById(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(FIRESTORE_COLLECTION).document(id);
        DocumentSnapshot snapshot = docRef.get().get();
        if (snapshot.exists()) {
            return Optional.ofNullable(snapshot.toObject(SuspectEntity.class));
        }
        return Optional.empty();
    }
}
