import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  initializeFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  FIR,
  CrimeRecord,
  CriminalProfile,
  Victim,
  Witness,
  EvidenceItem,
  InvestigationNote,
  PatternAlert,
  User,
  AuditLog,
  FirStatus,
} from '../types';
import {
  INITIAL_FIRS,
  INITIAL_CRIME_RECORDS,
  INITIAL_CRIMINALS,
  INITIAL_VICTIMS,
  INITIAL_WITNESSES,
  INITIAL_EVIDENCE,
  INITIAL_INVESTIGATION_NOTES,
  INITIAL_PATTERN_ALERTS,
  INITIAL_USERS,
  INITIAL_AUDIT_LOGS,
} from '../data/seedData';

// Initialize Firebase App
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore DB with long polling enabled for sandbox compatibility
export const db: Firestore = initializeFirestore(
  app,
  {
    experimentalForceLongPolling: true,
  },
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Cloud Database Collection Names
const COLLECTIONS = {
  FIRS: 'firs',
  CRIMES: 'crimes',
  CRIMINALS: 'criminals',
  VICTIMS: 'victims',
  WITNESSES: 'witnesses',
  EVIDENCE: 'evidence',
  NOTES: 'investigation_notes',
  ALERTS: 'pattern_alerts',
  USERS: 'users',
  AUDIT_LOGS: 'audit_logs',
};

// Seeding and schema sync helper for Cloud Firestore
async function seedCollectionIfEmpty<T extends { id: string }>(
  collectionName: string,
  initialData: T[]
) {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    if (initialData.length > 0) {
      const batch = writeBatch(db);
      initialData.forEach((item) => {
        const docRef = doc(db, collectionName, item.id);
        batch.set(docRef, item, { merge: true });
      });
      await batch.commit();
      console.log(`[Cloud Firestore] Synced ${initialData.length} initial records with photos into '${collectionName}'`);
    }
  } catch (error: any) {
    console.warn(`[Cloud Firestore] Seeding notice for ${collectionName}:`, error?.message || error);
  }
}

// Initialize and Seed All Collections
export async function seedCloudDatabase() {
  try {
    await Promise.all([
      seedCollectionIfEmpty(COLLECTIONS.FIRS, INITIAL_FIRS),
      seedCollectionIfEmpty(COLLECTIONS.CRIMES, INITIAL_CRIME_RECORDS),
      seedCollectionIfEmpty(COLLECTIONS.CRIMINALS, INITIAL_CRIMINALS),
      seedCollectionIfEmpty(COLLECTIONS.VICTIMS, INITIAL_VICTIMS),
      seedCollectionIfEmpty(COLLECTIONS.WITNESSES, INITIAL_WITNESSES),
      seedCollectionIfEmpty(COLLECTIONS.EVIDENCE, INITIAL_EVIDENCE),
      seedCollectionIfEmpty(COLLECTIONS.NOTES, INITIAL_INVESTIGATION_NOTES),
      seedCollectionIfEmpty(COLLECTIONS.ALERTS, INITIAL_PATTERN_ALERTS),
      seedCollectionIfEmpty(COLLECTIONS.USERS, INITIAL_USERS),
      seedCollectionIfEmpty(COLLECTIONS.AUDIT_LOGS, INITIAL_AUDIT_LOGS),
    ]);
  } catch (err: any) {
    console.warn('[Cloud Firestore] Seeding process operating in offline/sync mode:', err?.message);
  }
}

// Real-time Subscriptions with Error Handling & Photo Enrichment
export function subscribeToFirs(callback: (firs: FIR[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.FIRS),
    (snapshot) => {
      const data = snapshot.docs.map((docSnap) => {
        const item = docSnap.data() as FIR;
        const seedMatch = INITIAL_FIRS.find((f) => f.id === item.id);
        return {
          ...seedMatch,
          ...item,
          complainantPhotoUrl: item.complainantPhotoUrl || seedMatch?.complainantPhotoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
        };
      });
      if (data.length > 0) callback(data);
    },
    (err) => console.warn('[Firestore] FIRs sync notice:', err.message)
  );
}

export function subscribeToCrimes(callback: (crimes: CrimeRecord[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.CRIMES),
    (snapshot) => {
      const data = snapshot.docs.map((docSnap) => {
        const item = docSnap.data() as CrimeRecord;
        const seedMatch = INITIAL_CRIME_RECORDS.find((c) => c.id === item.id);
        return {
          ...seedMatch,
          ...item,
          imageUrl: item.imageUrl || seedMatch?.imageUrl || 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=600&auto=format&fit=crop&q=80',
        };
      });
      if (data.length > 0) callback(data);
    },
    (err) => console.warn('[Firestore] Crimes sync notice:', err.message)
  );
}

export function subscribeToCriminals(callback: (criminals: CriminalProfile[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.CRIMINALS),
    (snapshot) => {
      const data = snapshot.docs.map((docSnap) => {
        const item = docSnap.data() as CriminalProfile;
        const seedMatch = INITIAL_CRIMINALS.find((c) => c.id === item.id);
        return {
          ...seedMatch,
          ...item,
          photoUrl: item.photoUrl || seedMatch?.photoUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
        };
      });
      if (data.length > 0) callback(data);
    },
    (err) => console.warn('[Firestore] Criminals sync notice:', err.message)
  );
}

export function subscribeToVictims(callback: (victims: Victim[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.VICTIMS),
    (snapshot) => {
      const data = snapshot.docs.map((docSnap) => {
        const item = docSnap.data() as Victim;
        const seedMatch = INITIAL_VICTIMS.find((v) => v.id === item.id);
        return {
          ...seedMatch,
          ...item,
          photoUrl: item.photoUrl || seedMatch?.photoUrl || 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
        };
      });
      if (data.length > 0) callback(data);
    },
    (err) => console.warn('[Firestore] Victims sync notice:', err.message)
  );
}

export function subscribeToWitnesses(callback: (witnesses: Witness[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.WITNESSES),
    (snapshot) => {
      const data = snapshot.docs.map((docSnap) => {
        const item = docSnap.data() as Witness;
        const seedMatch = INITIAL_WITNESSES.find((w) => w.id === item.id);
        return {
          ...seedMatch,
          ...item,
          photoUrl: item.photoUrl || seedMatch?.photoUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        };
      });
      if (data.length > 0) callback(data);
    },
    (err) => console.warn('[Firestore] Witnesses sync notice:', err.message)
  );
}

export function subscribeToEvidence(callback: (evidence: EvidenceItem[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.EVIDENCE),
    (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as EvidenceItem);
      if (data.length > 0) callback(data);
    },
    (err) => console.warn('[Firestore] Evidence sync notice:', err.message)
  );
}

export function subscribeToNotes(callback: (notes: InvestigationNote[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.NOTES),
    (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as InvestigationNote);
      if (data.length > 0) callback(data);
    },
    (err) => console.warn('[Firestore] Notes sync notice:', err.message)
  );
}

export function subscribeToAlerts(callback: (alerts: PatternAlert[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.ALERTS),
    (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as PatternAlert);
      if (data.length > 0) callback(data);
    },
    (err) => console.warn('[Firestore] Alerts sync notice:', err.message)
  );
}

export function subscribeToUsers(callback: (users: User[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.USERS),
    (snapshot) => {
      const data = snapshot.docs.map((docSnap) => {
        const item = docSnap.data() as User;
        const seedMatch = INITIAL_USERS.find((u) => u.id === item.id);
        return {
          ...seedMatch,
          ...item,
          avatarUrl: item.avatarUrl || seedMatch?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        };
      });
      if (data.length > 0) callback(data);
    },
    (err) => console.warn('[Firestore] Users sync notice:', err.message)
  );
}

export function subscribeToAuditLogs(callback: (logs: AuditLog[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.AUDIT_LOGS),
    (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as AuditLog);
      if (data.length > 0) {
        data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        callback(data);
      }
    },
    (err) => console.warn('[Firestore] Audit logs sync notice:', err.message)
  );
}

// Cloud Mutation Operations
export async function addFirToCloud(fir: FIR) {
  try {
    await setDoc(doc(db, COLLECTIONS.FIRS, fir.id), fir);
  } catch (err) {
    console.error('Error saving FIR to cloud:', err);
  }
}

export async function updateFirStatusInCloud(firId: string, status: FirStatus, historyEntry: FIR['history'][0]) {
  try {
    const firRef = doc(db, COLLECTIONS.FIRS, firId);
    // Fetch existing doc to append to history
    const snap = await getDocs(collection(db, COLLECTIONS.FIRS));
    const targetDoc = snap.docs.find((d) => d.id === firId);
    if (targetDoc) {
      const existingHistory = (targetDoc.data() as FIR).history || [];
      await updateDoc(firRef, {
        status,
        history: [historyEntry, ...existingHistory],
      });
    }
  } catch (err) {
    console.error('Error updating FIR status in cloud:', err);
  }
}

export async function updateCrimeStatusInCloud(crimeId: string, status: CrimeRecord['status']) {
  try {
    await updateDoc(doc(db, COLLECTIONS.CRIMES, crimeId), { status });
  } catch (err) {
    console.error('Error updating crime status in cloud:', err);
  }
}

export async function updatePatternAlertInCloud(alert: PatternAlert) {
  try {
    await setDoc(doc(db, COLLECTIONS.ALERTS, alert.id), alert);
  } catch (err) {
    console.error('Error updating pattern alert in cloud:', err);
  }
}

export async function addEvidenceToCloud(evidence: EvidenceItem) {
  try {
    await setDoc(doc(db, COLLECTIONS.EVIDENCE, evidence.id), evidence);
  } catch (err) {
    console.error('Error adding evidence to cloud:', err);
  }
}

export async function updateCustodyChainInCloud(evidenceId: string, custodyEntry: EvidenceItem['custodyChain'][0]) {
  try {
    const docRef = doc(db, COLLECTIONS.EVIDENCE, evidenceId);
    const snap = await getDocs(collection(db, COLLECTIONS.EVIDENCE));
    const targetDoc = snap.docs.find((d) => d.id === evidenceId);
    if (targetDoc) {
      const existingChain = (targetDoc.data() as EvidenceItem).custodyChain || [];
      await updateDoc(docRef, {
        custodyChain: [custodyEntry, ...existingChain],
      });
    }
  } catch (err) {
    console.error('Error updating custody chain in cloud:', err);
  }
}

export async function addInvestigationNoteToCloud(note: InvestigationNote) {
  try {
    await setDoc(doc(db, COLLECTIONS.NOTES, note.id), note);
  } catch (err) {
    console.error('Error adding investigation note to cloud:', err);
  }
}

export async function addCriminalToCloud(criminal: CriminalProfile) {
  try {
    await setDoc(doc(db, COLLECTIONS.CRIMINALS, criminal.id), criminal);
  } catch (err) {
    console.error('Error adding criminal to cloud:', err);
  }
}

export async function addVictimToCloud(victim: Victim) {
  try {
    await setDoc(doc(db, COLLECTIONS.VICTIMS, victim.id), victim);
  } catch (err) {
    console.error('Error adding victim to cloud:', err);
  }
}

export async function addWitnessToCloud(witness: Witness) {
  try {
    await setDoc(doc(db, COLLECTIONS.WITNESSES, witness.id), witness);
  } catch (err) {
    console.error('Error adding witness to cloud:', err);
  }
}

export async function addUserToCloud(user: User) {
  try {
    await setDoc(doc(db, COLLECTIONS.USERS, user.id), user);
  } catch (err) {
    console.error('Error adding user to cloud:', err);
  }
}

export async function updateUserStatusInCloud(userId: string, newStatus: User['status']) {
  try {
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), { status: newStatus });
  } catch (err) {
    console.error('Error updating user status in cloud:', err);
  }
}

export async function addAuditLogToCloud(log: AuditLog) {
  try {
    await setDoc(doc(db, COLLECTIONS.AUDIT_LOGS, log.id), log);
  } catch (err) {
    console.error('Error adding audit log to cloud:', err);
  }
}
