const FIREBASE_API_KEY =
  process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
  'AIzaSyB1QCEXGibHF5XOHzoaEP7ofWyUNj6oQhE';

export const FIREBASE_CONFIG = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "lingualeap-ffa46.firebaseapp.com",
  projectId: "lingualeap-ffa46",
  storageBucket: "lingualeap-ffa46.firebasestorage.app",
  messagingSenderId: "1047590377319",
  appId: "1:1047590377319:web:9b3945b2b7a6e9233b81c2",
};

const AUTH_BASE = 'https://identitytoolkit.googleapis.com/v1';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents`;

// ============ AUTH ============

export async function signUp(email: string, password: string) {
  const res = await fetch(`${AUTH_BASE}/accounts:signUp?key=${FIREBASE_CONFIG.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return { uid: data.localId, email: data.email, idToken: data.idToken, refreshToken: data.refreshToken };
}

export async function signIn(email: string, password: string) {
  const res = await fetch(`${AUTH_BASE}/accounts:signInWithPassword?key=${FIREBASE_CONFIG.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return { uid: data.localId, email: data.email, idToken: data.idToken, refreshToken: data.refreshToken };
}

export async function resetPassword(email: string) {
  const res = await fetch(`${AUTH_BASE}/accounts:sendOobCode?key=${FIREBASE_CONFIG.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestType: 'PASSWORD_RESET', email }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
}

export async function refreshIdToken(refreshToken: string) {
  const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${FIREBASE_CONFIG.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grant_type: 'refresh_token', refresh_token: refreshToken }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return { idToken: data.id_token, refreshToken: data.refresh_token };
}

// ============ FIRESTORE ============

function toFirestoreValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'number') return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
  if (typeof val === 'object') {
    const fields: any = {};
    for (const [k, v] of Object.entries(val)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function fromFirestoreValue(val: any): any {
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return parseInt(val.integerValue);
  if ('doubleValue' in val) return val.doubleValue;
  if ('booleanValue' in val) return val.booleanValue;
  if ('nullValue' in val) return null;
  if ('arrayValue' in val) return (val.arrayValue.values || []).map(fromFirestoreValue);
  if ('mapValue' in val) {
    const obj: any = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      obj[k] = fromFirestoreValue(v);
    }
    return obj;
  }
  return null;
}

function toFirestoreDoc(data: Record<string, any>) {
  const fields: any = {};
  for (const [k, v] of Object.entries(data)) {
    fields[k] = toFirestoreValue(v);
  }
  return { fields };
}

function fromFirestoreDoc(doc: any): any {
  const obj: any = {};
  for (const [k, v] of Object.entries(doc.fields || {})) {
    obj[k] = fromFirestoreValue(v as any);
  }
  return obj;
}

export async function setDocument(collectionName: string, docId: string, data: any, token: string) {
  const url = `${FIRESTORE_BASE}/${collectionName}/${docId}`;
  await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(toFirestoreDoc(data)),
  });
}

export async function getDocument(collectionName: string, docId: string, token: string) {
  const url = `${FIRESTORE_BASE}/${collectionName}/${docId}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  const data = await res.json();
  if (data.error) return null;
  return fromFirestoreDoc(data);
}

export async function updateDocument(collectionName: string, docId: string, data: any, token: string) {
  const existing = await getDocument(collectionName, docId, token);
  if (!existing) return;
  const merged = { ...existing, ...data };
  await setDocument(collectionName, docId, merged, token);
}

export async function queryCollection(collectionName: string, token: string, orderField?: string, limitCount?: number) {
  const url = `${FIRESTORE_BASE}/${collectionName}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (data.error) return [];
  const docs = (data.documents || []).map((d: any) => fromFirestoreDoc(d));
  if (orderField) {
    docs.sort((a: any, b: any) => (b[orderField] || 0) - (a[orderField] || 0));
  }
  if (limitCount) return docs.slice(0, limitCount);
  return docs;
}
