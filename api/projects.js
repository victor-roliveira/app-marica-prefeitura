import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
  // Configuração de CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

    if (!privateKey || !serviceEmail) {
      throw new Error('Variáveis de ambiente do Google não encontradas.');
    }

    // --- PASSO 1: Tenta decodificar Base64 (se necessário) ---
    if (!privateKey.includes("-----BEGIN PRIVATE KEY-----") && !privateKey.trim().startsWith("{")) {
      try {
        const decoded = Buffer.from(privateKey, 'base64').toString('utf-8');
        privateKey = decoded;
        console.log("Base64 decodificado.");
      } catch (e) {
        // Ignora falha, segue como string normal
      }
    }

    // --- PASSO 2: Verifica se é o JSON completo e extrai a chave ---
    try {
        // Tenta ler como JSON
        if (privateKey.trim().startsWith("{")) {
            const keyJson = JSON.parse(privateKey);
            if (keyJson.private_key) {
                console.log("Arquivo JSON detectado. Extraindo a propriedade 'private_key'...");
                privateKey = keyJson.private_key;
            }
        }
    } catch (e) {
        // Não é um JSON, segue a vida
    }

    // --- PASSO 3: Limpeza final (Quebras de linha e Aspas) ---
    privateKey = privateKey
      .replace(/\\n/g, '\n')
      .replace(/^"|"$/g, '');

    // --- DEBUG FINAL ---
    console.log(">>> DEBUG CHAVE PROCESSADA <<<");
    // Agora deve mostrar o cabeçalho correto
    console.log("Início:", privateKey.substring(0, 30) + "..."); 

    if (!privateKey.includes("BEGIN PRIVATE KEY")) {
        throw new Error("A chave privada extraída é inválida.");
    }

    const serviceAccountAuth = new JWT({
      email: serviceEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    // Tenta achar a aba
    const sheet = doc.sheetsByTitle['Contrato MRK01'];
    if (!sheet) throw new Error("Aba 'Contrato MRK01' não encontrada.");

    const rows = await sheet.getRows();
    const rawData = rows.map(row => row.toObject());

    res.status(200).json(rawData);

  } catch (error) {
    console.error('Erro na API:', error);
    res.status(500).json({ error: error.message });
  }
}