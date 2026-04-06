/**
 * Migração: coleção "bonecos" → "itens" no Firestore
 *
 * Pré-requisitos:
 *   1. Tenha o Node.js instalado
 *   2. Instale as dependências:
 *        npm install firebase-admin
 *   3. Gere uma Service Account no Firebase Console:
 *        Firebase Console → Configurações do projeto → Contas de serviço → Gerar nova chave privada
 *        Salve o arquivo JSON como "serviceAccountKey.json" nesta pasta (scripts/)
 *   4. Execute:
 *        node scripts/migrate-bonecos-to-itens.js
 *
 * O script:
 *   - Copia todos os documentos de "bonecos" para "itens" (preservando IDs e dados)
 *   - NÃO apaga a coleção original (você pode fazer isso manualmente depois de confirmar)
 */

const admin = require("firebase-admin");
const path = require("path");

// ─── Configuração ────────────────────────────────────────────────────────────

const SERVICE_ACCOUNT_PATH = path.join(__dirname, "serviceAccountKey.json");

let serviceAccount;
try {
  serviceAccount = require(SERVICE_ACCOUNT_PATH);
} catch {
  console.error(
    '\n[ERRO] Arquivo "serviceAccountKey.json" não encontrado em scripts/\n' +
    "Gere a chave em: Firebase Console → Configurações do projeto → Contas de serviço\n"
  );
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "unimaginext",
});

const db = admin.firestore();

// ─── Migração ────────────────────────────────────────────────────────────────

async function migrar() {
  console.log('Lendo coleção "bonecos"...');

  const snapshot = await db.collection("bonecos").get();

  if (snapshot.empty) {
    console.log('Nenhum documento encontrado em "bonecos". Nada a migrar.');
    return;
  }

  console.log(`Encontrados ${snapshot.size} documento(s). Iniciando migração...`);

  const BATCH_SIZE = 400; // Firestore permite até 500 operações por batch
  let batches = [];
  let currentBatch = db.batch();
  let operacoes = 0;
  let total = 0;

  for (const docOld of snapshot.docs) {
    const destRef = db.collection("itens").doc(docOld.id);
    currentBatch.set(destRef, docOld.data());
    operacoes++;
    total++;

    if (operacoes === BATCH_SIZE) {
      batches.push(currentBatch);
      currentBatch = db.batch();
      operacoes = 0;
    }
  }

  if (operacoes > 0) {
    batches.push(currentBatch);
  }

  console.log(`Enviando ${batches.length} batch(es) para o Firestore...`);

  for (let i = 0; i < batches.length; i++) {
    await batches[i].commit();
    console.log(`  Batch ${i + 1}/${batches.length} concluído.`);
  }

  console.log(`\n✓ Migração concluída! ${total} documento(s) copiados para "itens".`);
  console.log('\nPróximo passo: verifique os dados no Firebase Console e, se estiver');
  console.log('tudo certo, apague manualmente a coleção "bonecos".');
}

migrar().catch((err) => {
  console.error("\n[ERRO] Falha na migração:", err.message);
  process.exit(1);
});
