import admin from "firebase-admin";
interface FirebaseAdminParams {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

function formatPrivateKey(privateKey: string) {
  return privateKey.replace(/\\n/g, "\n");
}

export function createFirebaseAdmin(params: FirebaseAdminParams) {
  const privateKey = formatPrivateKey(params.privateKey);

  if (admin.apps.length > 0) return admin.app();

  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey: privateKey,
  });

  const result = admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
  });

  return result;
}

export async function initAdmin() {
  const params: FirebaseAdminParams = {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
    clientEmail: process.env.NEXT_PUBLIC_CLIENT_EMAIL || "",
    privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY || "",
  };

  return createFirebaseAdmin(params);
}
