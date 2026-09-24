(() => {
'use strict';

/* ================= utilidades ================= */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const reduzido = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const MESES_L = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const SEMANA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const isoDe = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const hojeISO = () => isoDe(new Date());
const deISO = s => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
const diasEntre = (a, b) => Math.round((b - a) / 864e5);
const somaDias = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const fmtLongo = d => d ? `${d.getDate()} de ${MESES_L[d.getMonth()]} de ${d.getFullYear()}` : '';
const fmtCurto = d => d ? `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}` : '';
const fmtSemana = d => `${SEMANA[d.getDay()]}, ${d.getDate()} de ${MESES_L[d.getMonth()]}`;
const fmtNum = n => Number(n).toLocaleString('pt-BR');
const plural = (n, um, varios) => `${fmtNum(n)} ${n === 1 ? um : varios}`;
const suave = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const suave4 = t => t < .5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
const saida = t => 1 - Math.pow(1 - t, 3);

/* ================= constantes ================= */
const INICIO_PADRAO = '2026-09-24';
const PADRAO = { nomeDela: 'Kemelly', nomeDele: '', inicio: INICIO_PADRAO, namoro: '' };
const CHAVE_LOCAL = 'nosso-livrinho:v1';
const MARCOS = new Set([1, 30, 50, 90, 100, 150, 183, 200, 250, 300, 330, 335, 348, 350, 355, 357, 358, 359, 360, 362, 363, 364, 365]);
const NUMERADAS = new Set(['frase', 'sumario', 'abertura', 'fotos', 'desejos', 'viagens', 'surpresa', 'branco']);
const CAPS = [
  { id: 'fotos', rom: 'I', titulo: 'Nossas fotos', sub: 'pedacinhos da nossa história', cab: 'nossas fotos' },
  { id: 'desejos', rom: 'II', titulo: 'Nossos desejos', sub: 'tudo o que a gente ainda quer viver junto', cab: 'nossos desejos' },
  { id: 'viagens', rom: 'III', titulo: 'Nossas viagens', sub: 'lugares onde a gente ainda vai se perder', cab: 'nossas viagens' }
];

/* ================= desenhos ================= */
const P_COR = 'M12 20.4c-.3 0-.6-.1-.8-.3C7.6 17.1 3.3 13.5 3.3 9.2c0-2.7 2.1-4.8 4.7-4.8 1.6 0 3.1.8 4 2.1.9-1.3 2.4-2.1 4-2.1 2.6 0 4.7 2.1 4.7 4.8 0 4.3-4.3 7.9-7.9 11-.2.1-.5.2-.8.2z';
const svgCor = cls => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P_COR}"/></svg>`;
const ORN = `<svg class="orn" viewBox="0 0 140 20" aria-hidden="true"><path d="M6 10h44M90 10h44" fill="none" stroke="currentColor" stroke-width=".9" stroke-linecap="round"/><circle cx="54" cy="10" r="1.3" fill="currentColor"/><circle cx="86" cy="10" r="1.3" fill="currentColor"/><path transform="translate(61.8 1.8) scale(.68)" d="${P_COR}" fill="currentColor"/></svg>`;
const ENV = `<svg class="env" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="6" width="17" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
const PAISAGEM = `<svg viewBox="0 0 60 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="60" height="90" fill="#F3DAD6"/><circle cx="40" cy="30" r="8.5" fill="#F7E4B6"/><path d="M0 66l14-19 10 11 12-18 24 27v23H0z" fill="#E8BCB8"/><path d="M0 76l18-12 14 8 10-6 18 12v12H0z" fill="#D98C9A"/><path d="M11 24c3-2.2 6-2.2 8.5 0M18 18c2-1.4 4-1.4 5.6 0" fill="none" stroke="#B87880" stroke-width="1" stroke-linecap="round"/></svg>`;
const SELOS = {
  sonho: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17.5h10a4 4 0 0 0 .5-8 5.6 5.6 0 0 0-10.8 1.5A3.3 3.3 0 0 0 7 17.5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  planejando: `<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="16" height="14" rx="2"/><path d="M4 10.5h16M9 4v4M15 4v4"/></g><path transform="translate(8.6 11.6) scale(.29)" d="${P_COR}" fill="currentColor"/></svg>`,
  fomos: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${P_COR}" fill="currentColor"/></svg>`
};
const SETA_E = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5L8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function dentedeleao() {
  const cx = 60, cy = 42;
  let d = '';
  for (let k = 0; k < 18; k++) {
    const a = (k / 18) * Math.PI * 2 - Math.PI / 2;
    const r2 = 18 + (k % 2 ? 2.5 : 0);
    const x1 = cx + Math.cos(a) * 4, y1 = cy + Math.sin(a) * 4;
    const x2 = cx + Math.cos(a) * r2, y2 = cy + Math.sin(a) * r2;
    d += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
    for (const da of [-0.5, 0, 0.5]) {
      d += `M${x2.toFixed(1)} ${y2.toFixed(1)}L${(x2 + Math.cos(a + da) * 4.6).toFixed(1)} ${(y2 + Math.sin(a + da) * 4.6).toFixed(1)}`;
    }
  }
  let s = '';
  for (const [x, y] of [[90, 26], [99, 15], [86, 11]]) {
    s += `M${x} ${y}l-3 5M${x} ${y}l-3.2-2.6M${x} ${y}l.2-4M${x} ${y}l3.2-2.2`;
  }
  return `<svg class="ilus" viewBox="0 0 120 120" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="${d}" stroke-width="1.1"/><path d="${s}" stroke-width="1.1"/><path d="M60 46C61 70 64 90 58 114" stroke-width="1.7"/><path d="M59.6 98c-6-2.4-11.5.2-14.6 5.6 6.2 1.2 11.4-.8 14.6-5.6z" stroke-width="1.4"/></g><circle cx="60" cy="42" r="3.4" fill="currentColor"/></svg>`;
}
const ILUS = {
  fotos: `<svg class="ilus" viewBox="0 0 120 120" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="15" y="38" width="90" height="60" rx="9"/><path d="M40 38l6-11h28l6 11"/><circle cx="60" cy="68" r="19"/><circle cx="60" cy="68" r="11.5"/><path d="M54.5 63.5a7.5 7.5 0 0 1 7-3.5"/><rect x="84" y="46" width="12" height="7" rx="2"/><path d="M23 47h11"/></g><path d="M96.5 22.5c-1.4-2.3-5.4-1.7-5.4 1.2 0 2.5 3.2 4.3 5.4 5.9 2.2-1.6 5.4-3.4 5.4-5.9 0-2.9-4-3.5-5.4-1.2z" fill="none" stroke="#5E1A2B" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  desejos: dentedeleao(),
  viagens: `<svg class="ilus" viewBox="0 0 120 120" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 56l86-37-31 78-16-29z"/><path d="M61 68l47-49"/><path d="M61 68l-4 25 13-13"/></g><path d="M50 94c-8 7-21 11-28 6s-1-13 6-10-1 15-14 17" fill="none" stroke="#5E1A2B" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="1.5 4.5"/></svg>`
};

/* ================= estado ================= */
const S = {
  config: { ...PADRAO },
  fotos: [], desejos: [], viagens: [],
  podeEscrever: true, podeFoto: true, dono: false,
  modo: 'carregando',
  recentes: new Map()
};

function diaAtual() {
  const ini = deISO(S.config.inicio) || deISO(INICIO_PADRAO);
  return Math.max(1, diasEntre(ini, deISO(hojeISO())) + 1);
}
const surpresaAberta = () => diaAtual() >= 365;
const dataSurpresa = () => somaDias(deISO(S.config.inicio) || deISO(INICIO_PADRAO), 364);
function fraseDoDia() {
  const d = diaAtual();
  const ano = Math.floor((d - 1) / 365) + 1;
  let i = (d - 1) % 365;
  if (ano > 1) { let k = 0; while (MARCOS.has(i + 1) && k++ < 400) i = (i * 7 + 3) % 365; }
  const nome = S.config.nomeDela || 'meu amor';
  return { texto: FRASES[i].split('{nome}').join(nome), dia: d, diaDoAno: ((d - 1) % 365) + 1, ano };
}
function marcarRecente(id, tipo) {
  S.recentes.set(id, tipo);
  setTimeout(() => { if (S.recentes.get(id) === tipo) S.recentes.delete(id); }, 1600);
}
const recente = id => S.recentes.has(id) ? ` recente-${S.recentes.get(id)}` : '';

/* ================= modo autor fora do Claude ================= */
function modoAutorUrl() {
  try {
    const q = new URLSearchParams(location.search);
    if (q.has('autor')) localStorage.setItem('nosso-livrinho:autor', '1');
    if (q.has('sair')) localStorage.removeItem('nosso-livrinho:autor');
    return localStorage.getItem('nosso-livrinho:autor') === '1';
  } catch (e) { return false; }
}

/* ================= armazenamento ================= */
const Store = {
  db: null, assets: null, sb: null, sbUrl: '', local: {},
  async iniciar() {
    const cs = window.LIVRINHO_CONFIG || {};
    if (cs.supabaseUrl && cs.supabaseAnonKey && window.supabase && window.supabase.createClient) {
      try {
        this.sb = window.supabase.createClient(cs.supabaseUrl, cs.supabaseAnonKey);
        this.sbUrl = String(cs.supabaseUrl).replace(/\/+$/, '');
        S.modo = 'supabase'; S.dono = modoAutorUrl(); S.podeEscrever = true; S.podeFoto = true;
        await this.recarregar();
        this.ouvir();
        mostrarAutor(); reconstruir();
        return;
      } catch (e) {
        console.warn('supabase', e); this.sb = null;
        avisar('Não consegui conectar ao banco. Mostrando o que está salvo neste aparelho.');
      }
    }
    const cl = window.claude;
    const usar = n => (cl && typeof cl.use === 'function') ? Promise.resolve(cl.use(n)).catch(() => null) : Promise.resolve(null);
    const [db, user, assets] = await Promise.all([usar('db'), usar('user'), usar('assets')]);
    if (db) {
      this.db = db; this.assets = assets; S.modo = 'nuvem';
      if (user) {
        try { S.dono = !!(await user.isOwner()); } catch (e) { S.dono = false; }
        try { if ((await user.can('data.write')) === false) S.podeEscrever = false; } catch (e) { /* sem resposta: mantém */ }
      }
      S.podeFoto = !!assets && S.podeEscrever;
      this.assinarTudo();
    } else {
      S.modo = 'local'; S.dono = modoAutorUrl() || !!window.claude; S.podeEscrever = true; S.podeFoto = true;
      this.lerLocal();
    }
    mostrarAutor();
    reconstruir();
  },
  sbOk(r) { if (r && r.error) throw r.error; return r; },
  async recarregar() {
    const r = this.sbOk(await this.sb.from('livrinho').select('id,colecao,dados').neq('colecao', 'surpresa'));
    const por = { fotos: [], desejos: [], viagens: [] }; let cfg = null;
    for (const x of r.data || []) {
      if (x.colecao === 'config') cfg = x.dados;
      else if (por[x.colecao]) por[x.colecao].push({ ...(x.dados || {}), id: x.id });
    }
    S.config = { ...PADRAO, ...(cfg || {}) };
    S.fotos = por.fotos; S.desejos = por.desejos; S.viagens = por.viagens;
    agendar();
  },
  ouvir() {
    let t = 0;
    const logo = () => { clearTimeout(t); t = setTimeout(() => this.recarregar().catch(e => console.warn(e)), 300); };
    try { this.sb.channel('livrinho').on('postgres_changes', { event: '*', schema: 'public', table: 'livrinho' }, logo).subscribe(); } catch (e) { console.warn(e); }
    setInterval(logo, 30000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) logo(); });
  },
  assinarTudo() { ['config', 'fotos', 'desejos', 'viagens'].forEach(o => this.assinar(o, 0)); },
  assinar(onde, tentativas) {
    const erro = e => {
      console.warn('db', onde, e);
      const c = e && e.code;
      if (c === 'revoked') { S.podeEscrever = false; S.podeFoto = false; reconstruir(); }
      else if (c === 'unavailable' && tentativas < 3) setTimeout(() => this.assinar(onde, tentativas + 1), 3000 * (tentativas + 1));
    };
    if (onde === 'config') {
      this.db.doc('config/geral').onSnapshot(s => {
        S.config = { ...PADRAO, ...(s.exists ? s.data() : {}) };
        agendar();
      }, erro);
    } else {
      this.db.collection(onde).onSnapshot(s => {
        S[onde] = s.docs.map(d => ({ id: d.id, ...d.data() }));
        agendar();
      }, erro);
    }
  },
  async tentar(fn) {
    try { return await fn(); }
    catch (e) {
      const c = e && e.code;
      if (c === 'unavailable' || c === 'store_unavailable') { await sleep(400 + Math.random() * 600); return await fn(); }
      throw e;
    }
  },
  async adicionar(col, dados, aoTerId) {
    if (this.sb) {
      const id = 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      if (aoTerId) aoTerId(id);
      this.sbOk(await this.sb.from('livrinho').insert({ id, colecao: col, dados }));
      S[col] = [...S[col], { ...dados, id }]; agendar();
      return id;
    }
    if (this.db) {
      const ref = this.db.collection(col).doc();
      if (aoTerId) aoTerId(ref.id);
      await this.tentar(() => ref.set(dados));
      return ref.id;
    }
    const id = 'l' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    if (aoTerId) aoTerId(id);
    S[col] = [...S[col], { id, ...dados }];
    this.gravarLocal(); agendar();
    return id;
  },
  async atualizar(col, id, patch) {
    if (this.sb) {
      const atual = S[col].find(x => x.id === id) || {};
      const resto = { ...atual }; delete resto.id;
      const dados = { ...resto, ...patch };
      this.sbOk(await this.sb.from('livrinho').update({ dados }).eq('id', id));
      S[col] = S[col].map(x => x.id === id ? { ...dados, id } : x); agendar();
      return;
    }
    if (this.db) return this.tentar(() => this.db.doc(`${col}/${id}`).update(patch));
    S[col] = S[col].map(x => x.id === id ? { ...x, ...patch } : x);
    this.gravarLocal(); agendar();
  },
  async apagar(col, id) {
    if (this.sb) { this.sbOk(await this.sb.from('livrinho').delete().eq('id', id)); S[col] = S[col].filter(x => x.id !== id); agendar(); return; }
    if (this.db) return this.tentar(() => this.db.doc(`${col}/${id}`).delete());
    S[col] = S[col].filter(x => x.id !== id);
    this.gravarLocal(); agendar();
  },
  async salvarConfig(cfg) {
    if (this.sb) { this.sbOk(await this.sb.from('livrinho').upsert({ id: 'geral', colecao: 'config', dados: cfg })); S.config = { ...PADRAO, ...cfg }; agendar(); return; }
    if (this.db) return this.tentar(() => this.db.doc('config/geral').set(cfg));
    S.config = { ...PADRAO, ...cfg };
    this.gravarLocal(); agendar();
  },
  async lerSurpresa() {
    if (this.sb) { const r = this.sbOk(await this.sb.from('livrinho').select('dados').eq('id', 'carta').maybeSingle()); return r.data ? r.data.dados : null; }
    if (this.db) { const s = await this.tentar(() => this.db.doc('surpresa/carta').get()); return s.exists ? s.data() : null; }
    return this.local.surpresa || null;
  },
  async salvarSurpresa(d) {
    if (this.sb) { this.sbOk(await this.sb.from('livrinho').upsert({ id: 'carta', colecao: 'surpresa', dados: d })); return; }
    if (this.db) return this.tentar(() => this.db.doc('surpresa/carta').set(d));
    this.local.surpresa = d; this.gravarLocal();
  },
  async enviarFoto(blob) {
    if (this.sb) {
      const caminho = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10) + '.jpg';
      this.sbOk(await this.sb.storage.from('fotos').upload(caminho, blob, { contentType: 'image/jpeg', upsert: false }));
      return 'sb:' + caminho;
    }
    if (this.db) {
      if (!this.assets) throw { code: 'not_granted' };
      const r = await this.tentar(() => this.assets.upload(blob, { type: 'image/jpeg' }));
      return r.id;
    }
    return blobParaDataURL(blob);
  },
  async apagarFoto(id) {
    if (id && this.sb && String(id).startsWith('sb:')) { try { await this.sb.storage.from('fotos').remove([String(id).slice(3)]); } catch (e) { console.warn(e); } return; }
    if (!id || !this.db || !this.assets || String(id).startsWith('data:')) return;
    try { await this.assets.delete(id); } catch (e) { console.warn('asset', e); }
  },
  src(id) { if (!id) return ''; if (String(id).startsWith('sb:')) return `${this.sbUrl}/storage/v1/object/public/fotos/${String(id).slice(3)}`; return String(id).startsWith('data:') ? String(id) : '/_blob/' + id; },
  lerLocal() {
    try {
      const j = JSON.parse(localStorage.getItem(CHAVE_LOCAL) || '{}') || {};
      this.local = j;
      S.config = { ...PADRAO, ...(j.config || {}) };
      S.fotos = Array.isArray(j.fotos) ? j.fotos : [];
      S.desejos = Array.isArray(j.desejos) ? j.desejos : [];
      S.viagens = Array.isArray(j.viagens) ? j.viagens : [];
    } catch (e) { this.local = {}; }
  },
  gravarLocal() {
    this.local = { ...this.local, config: S.config, fotos: S.fotos, desejos: S.desejos, viagens: S.viagens };
    try { localStorage.setItem(CHAVE_LOCAL, JSON.stringify(this.local)); }
    catch (e) { avisar('O espaço deste aparelho acabou. Apague alguma foto para salvar mais coisas.'); }
  }
};

function blobParaDataURL(blob) {
  return new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = () => rej({ code: 'imagem' }); fr.readAsDataURL(blob); });
}
async function comprimir(file) {
  const local = S.modo === 'local';
  const max = local ? 1000 : 1600, q = local ? .72 : .86;
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej({ code: 'imagem' }); i.src = url; });
    const w0 = img.naturalWidth, h0 = img.naturalHeight;
    if (!w0 || !h0) throw { code: 'imagem' };
    const k = Math.min(1, max / Math.max(w0, h0));
    const w = Math.max(1, Math.round(w0 * k)), h = Math.max(1, Math.round(h0 * k));
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const cx = cv.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, w, h); cx.drawImage(img, 0, 0, w, h);
    const blob = await new Promise(r => cv.toBlob(r, 'image/jpeg', q));
    if (!blob) throw { code: 'imagem' };
    return { blob, ar: w / h };
  } finally { URL.revokeObjectURL(url); }
}

function msgErro(e) {
  switch (e && e.code) {
    case 'invalid_argument': return 'Não deu para salvar: seu acesso a este livrinho é só de leitura.';
    case 'quota_exceeded': return 'O livrinho chegou no limite de itens. Apague alguns para continuar.';
    case 'resource_exhausted': case 'rate_limited': return 'Muitas alterações seguidas. Espere alguns segundos e tente de novo.';
    case 'revoked': return 'O acesso a este livrinho mudou. Recarregue a página.';
    case 'too_large': return 'Essa foto é grande demais. Escolha outra.';
    case 'unsupported_type': case 'imagem': return 'Essa foto não abriu aqui. Tente uma foto em JPG ou PNG.';
    case 'quota_or_state': return 'O espaço de fotos do livrinho acabou. Apague alguma foto para colar outra.';
    case 'upstream_auth': return 'Sua sessão expirou. Recarregue a página e entre de novo.';
    case 'not_granted': case 'capability_disabled': case 'capability_removed': return 'Seu acesso não permite colar fotos aqui.';
    default: return 'Não deu para salvar agora. Tente de novo em instantes.';
  }
}
function tratarErro(e) {
  console.warn(e);
  if (e && e.code === 'invalid_argument' && S.modo === 'nuvem') { S.podeEscrever = false; S.podeFoto = false; reconstruir(); }
  avisar(msgErro(e));
}

/* ================= o livro ================= */
const palco = $('#palco'), livroEl = $('#livro'), folhasEl = $('#folhas'), sombraMesa = $('#sombraMesa'), lance = $('#lance'), elastico = $('#elastico');
const barra = $('#barra'), btnAnt = $('#btnAnt'), btnProx = $('#btnProx');
const L = { modo: '', construidoModo: '', pw: 0, ph: 0, fs: 16, phEm: 33, faces: [], folhas: [], pos: 0, animando: false, arrasto: null, aberto: false, pendente: false, pendenteMedida: false, fraseMostrada: false, brilhou: false, irPara: null, porPag: 0 };

function medir() {
  const r = palco.getBoundingClientRect();
  const estreito = r.width < 520;
  const padX = estreito ? 10 : 24, padY = estreito ? 8 : 18;
  const W = Math.max(200, r.width - padX * 2), H = Math.max(260, r.height - padY * 2);
  const duplo = W >= 700 && W / H >= 1.12;
  let pw, k;
  if (duplo) { k = .7; pw = Math.min((W - 16) / 2, H * k, 540); }
  else { k = clamp(W / H, .6, .72); pw = Math.min(W, H * k, 540); }
  pw = Math.floor(pw);
  return { modo: duplo ? 'duplo' : 'unico', pw, ph: Math.floor(pw / k) };
}
function aplicarMedidas() {
  const m = medir();
  L.modo = m.modo; L.pw = m.pw; L.ph = m.ph; L.fs = m.pw / 24; L.phEm = m.ph / L.fs;
  livroEl.style.setProperty('--pw', m.pw + 'px');
  livroEl.style.setProperty('--ph', m.ph + 'px');
  livroEl.style.setProperty('--fs', L.fs.toFixed(3) + 'px');
  livroEl.style.setProperty('--fotoH', clamp((L.phEm - 8.4) / 2 - 3.5, 8.4, 13.5).toFixed(2) + 'em');
  livroEl.classList.toggle('unico', L.modo === 'unico');
}
const porPagina = id => id === 'desejos' ? clamp(Math.floor((L.phEm - 7.6) / 6), 3, 6) : 2;
const posMax = () => L.modo === 'duplo' ? L.folhas.length : L.folhas.length - 1;

function ordenados(id) {
  const a = [...S[id]];
  if (id === 'fotos') a.sort((x, y) => String(x.data || '').localeCompare(String(y.data || '')) || (x.criadoEm || 0) - (y.criadoEm || 0));
  else a.sort((x, y) => (x.criadoEm || 0) - (y.criadoEm || 0));
  return a;
}
function montarFaces() {
  const duplo = L.modo === 'duplo';
  const F = [{ tipo: 'capa', key: 'capa' }];
  if (duplo) F.push({ tipo: 'guarda', key: 'guarda' }, { tipo: 'frase', key: 'frase' });
  else F.push({ tipo: 'frase', key: 'frase' }, { tipo: 'guarda', key: 'guarda' });
  F.push({ tipo: 'sumario', key: 'sumario' });
  for (const cap of CAPS) {
    F.push({ tipo: 'abertura', cap: cap.id, key: 'abertura-' + cap.id });
    const itens = ordenados(cap.id);
    const per = porPagina(cap.id);
    const comNovo = S.podeEscrever && (cap.id !== 'fotos' || S.podeFoto);
    const pags = Math.max(1, Math.ceil((itens.length + (comNovo ? 1 : 0)) / per));
    for (let p = 0; p < pags; p++) {
      const fatia = itens.slice(p * per, (p + 1) * per);
      F.push({ tipo: cap.id, itens: fatia, novo: comNovo && p === pags - 1 && fatia.length < per, vazio: itens.length === 0, key: cap.id + '-' + p });
    }
  }
  F.push({ tipo: 'surpresa', key: 'surpresa' });
  if (duplo) {
    if (F.length % 2 === 1) F.push({ tipo: 'branco', key: 'branco' });
    F.push({ tipo: 'guardaFim', key: 'guardaFim' });
  }
  F.push({ tipo: 'contracapa', key: 'contracapa' });
  let n = 0;
  for (const f of F) if (NUMERADAS.has(f.tipo)) f.num = ++n;
  L.porPag = porPagina('desejos');
  return F;
}
function descritores(i) {
  if (L.modo === 'duplo') return [L.faces[2 * i], L.faces[2 * i + 1]];
  return [L.faces[i], i === 0 ? { tipo: 'versoCapa', key: 'vc' } : { tipo: 'verso', key: 'v' + i }];
}
function preencherFace(faceEl, f, lado) {
  const html = htmlFace(f, lado);
  if (faceEl._html === html) return;
  faceEl._html = html;
  faceEl.dataset.key = f.key;
  faceEl.firstElementChild.innerHTML = html;
}
function construirFolhas() {
  folhasEl.textContent = '';
  L.folhas = [];
  const n = L.modo === 'duplo' ? L.faces.length / 2 : L.faces.length;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.className = 'folha';
    el.innerHTML = '<div class="face frente"><div class="conteudo"></div><div class="sombreado"></div></div><div class="face verso"><div class="conteudo"></div><div class="sombreado"></div></div>';
    const fl = { el, i, frente: el.children[0], verso: el.children[1], sf: el.children[0].lastElementChild, sv: el.children[1].lastElementChild, ang: 0 };
    const [a, b] = descritores(i);
    preencherFace(fl.frente, a, 'd');
    preencherFace(fl.verso, b, 'e');
    L.folhas.push(fl);
    frag.appendChild(el);
  }
  folhasEl.appendChild(frag);
  L.construidoModo = L.modo;
}

function angulo(fl, a) {
  fl.ang = a;
  fl.el.style.transform = `rotateY(${(-a).toFixed(3)}deg)`;
  const s = Math.sin(a * Math.PI / 180);
  fl.sf.style.opacity = a < 90 ? (s * .5).toFixed(3) : '0';
  fl.sv.style.opacity = a > 90 ? (s * .5).toFixed(3) : '0';
}
function repousar() {
  const n = L.folhas.length;
  L.folhas.forEach((fl, i) => {
    const virada = i < L.pos;
    angulo(fl, virada ? 180 : 0);
    fl.el.style.zIndex = String(virada ? 10 + i : 10 + 2 * n - i);
    const visivel = L.modo === 'duplo' ? (i === L.pos - 1 || i === L.pos) : i === L.pos;
    fl.el.style.display = (visivel || Math.abs(i - L.pos) <= 3) ? '' : 'none';
    fl.el.style.visibility = visivel ? 'visible' : 'hidden';
    fl.frente.inert = !(visivel && !virada);
    fl.verso.inert = !(visivel && virada && L.modo === 'duplo');
  });
  lance.style.opacity = '0';
  deslocar();
  atualizarBarra();
}
function mostrar(fl) { if (fl) { fl.el.style.display = ''; fl.el.style.visibility = 'visible'; } }
function deslocar() {
  const n = L.folhas.length;
  if (L.modo !== 'duplo' || !n) {
    livroEl.style.transform = '';
    sombraMesa.style.left = '0px'; sombraMesa.style.width = L.pw + 'px';
    return;
  }
  const a0 = L.folhas[0].ang, aN = L.folhas[n - 1].ang;
  const x = -L.pw / 2 * (1 - a0 / 180) + L.pw / 2 * (aN / 180);
  livroEl.style.transform = `translateX(${x.toFixed(2)}px)`;
  let esq = 0, larg = 2 * L.pw;
  if (a0 < 180) { esq = L.pw * (1 - a0 / 180); larg = L.pw * (1 + a0 / 180); }
  else if (aN > 0) { larg = L.pw * (2 - aN / 180); }
  sombraMesa.style.left = esq.toFixed(2) + 'px';
  sombraMesa.style.width = larg.toFixed(2) + 'px';
}
function sombraLance(a, i) {
  const n = L.folhas.length;
  let ok, esq = false;
  if (L.modo === 'duplo') { esq = a >= 90; ok = esq ? i - 1 >= 0 : i + 1 < n; }
  else ok = i + 1 < n;
  if (!ok) { lance.style.opacity = '0'; return; }
  lance.style.left = (L.modo === 'duplo' && !esq ? L.pw : 0) + 'px';
  lance.classList.toggle('esq', esq);
  lance.style.opacity = (Math.sin(a * Math.PI / 180) * .55).toFixed(3);
}
function animar(itens) {
  return new Promise(res => {
    itens.forEach(it => { mostrar(it.fl); it.fl.frente.inert = true; it.fl.verso.inert = true; });
    const t0 = performance.now();
    const passo = agora => {
      let pronto = true, lider = null;
      for (const it of itens) {
        const t = clamp((agora - t0 - it.atraso) / it.dur, 0, 1);
        if (t < 1) pronto = false;
        const a = it.de + (it.para - it.de) * it.ease(t);
        angulo(it.fl, a);
        it.fl.el.style.zIndex = String(a < 90 ? 3000 - it.fl.i : 2000 + it.fl.i);
        if (t > 0 && t < 1) lider = it;
      }
      if (lider) sombraLance(lider.fl.ang, lider.fl.i); else lance.style.opacity = '0';
      deslocar();
      if (pronto) res(); else requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  });
}
async function ir(alvo, op = {}) {
  alvo = clamp(alvo, 0, posMax());
  if (L.animando || L.arrasto || alvo === L.pos) return;
  L.animando = true;
  const frente = alvo > L.pos, qtd = Math.abs(alvo - L.pos);
  const dur = reduzido ? 1 : (op.dur || (qtd > 1 ? 650 : (L.modo === 'unico' ? 760 : 900)));
  const atraso = reduzido ? 0 : (qtd > 1 ? Math.min(150, 1000 / qtd) : 0);
  const ease = op.ease || suave;
  const itens = [];
  if (frente) for (let i = L.pos, k = 0; i < alvo; i++, k++) itens.push({ fl: L.folhas[i], de: 0, para: 180, atraso: k * atraso, dur, ease });
  else for (let i = L.pos - 1, k = 0; i >= alvo; i--, k++) itens.push({ fl: L.folhas[i], de: 180, para: 0, atraso: k * atraso, dur, ease });
  mostrar(frente ? L.folhas[alvo] : L.folhas[alvo - 1]);
  await animar(itens);
  L.pos = alvo;
  L.animando = false;
  repousar();
  depoisDeVirar();
}
const proxima = () => ir(L.pos + 1);
const anterior = () => ir(L.pos - 1);

function comecarArrasto(dir) {
  if (dir > 0 && L.pos >= posMax()) return false;
  if (dir < 0 && L.pos <= 0) return false;
  const i = dir > 0 ? L.pos : L.pos - 1;
  const fl = L.folhas[i];
  L.arrasto = { fl, dir, i };
  mostrar(fl); fl.frente.inert = true; fl.verso.inert = true;
  mostrar(dir > 0 ? L.folhas[i + 1] : L.folhas[i - 1]);
  return true;
}
function arrastarPara(p) {
  const { fl, dir } = L.arrasto;
  const a = dir > 0 ? p * 180 : 180 - p * 180;
  angulo(fl, a);
  fl.el.style.zIndex = String(a < 90 ? 3000 - fl.i : 2000 + fl.i);
  sombraLance(a, fl.i);
  deslocar();
}
async function terminarArrasto(completa) {
  const { fl, dir, i } = L.arrasto;
  const para = completa ? (dir > 0 ? 180 : 0) : (dir > 0 ? 0 : 180);
  L.animando = true;
  await animar([{ fl, de: fl.ang, para, atraso: 0, dur: reduzido ? 1 : Math.max(170, 640 * Math.abs(para - fl.ang) / 180), ease: saida }]);
  L.arrasto = null;
  if (completa) L.pos = dir > 0 ? i + 1 : i;
  L.animando = false;
  repousar();
  depoisDeVirar();
}

function chavesVisiveis() {
  if (L.modo === 'duplo') return [L.faces[2 * L.pos - 1], L.faces[2 * L.pos]].filter(Boolean).map(f => f.key);
  return [L.faces[L.pos]].filter(Boolean).map(f => f.key);
}
function chaveAtual() {
  if (!L.faces.length) return 'capa';
  if (L.modo === 'duplo') { const d = L.faces[2 * L.pos], e = L.faces[2 * L.pos - 1]; return (d && d.key) || (e && e.key) || 'capa'; }
  return (L.faces[L.pos] || {}).key || 'capa';
}
function posParaChave(k) {
  let idx = L.faces.findIndex(f => f.key === k);
  if (idx < 0) {
    const m = /^(fotos|desejos|viagens)-(\d+)$/.exec(k || '');
    if (m) for (let j = L.faces.length - 1; j >= 0; j--) if (L.faces[j].tipo === m[1]) { idx = j; break; }
  }
  if (idx < 0) return null;
  if (L.modo === 'duplo') return idx % 2 === 0 ? idx / 2 : (idx + 1) / 2;
  return idx;
}
function irParaChave(k) { const p = posParaChave(k); if (p != null) ir(p); }

function reconstruir(chave) {
  if (L.animando || L.arrasto) { L.pendente = true; return; }
  const k = chave || chaveAtual();
  const novas = montarFaces();
  const mesma = L.construidoModo === L.modo && novas.length === L.faces.length && novas.every((f, i) => f.key === L.faces[i].key);
  L.faces = novas;
  if (mesma) {
    L.folhas.forEach((fl, i) => { const [a, b] = descritores(i); preencherFace(fl.frente, a, 'd'); preencherFace(fl.verso, b, 'e'); });
  } else {
    construirFolhas();
  }
  let p = L.aberto ? posParaChave(k) : 0;
  if (p == null) p = L.pos;
  L.pos = clamp(p, 0, posMax());
  repousar();
  revelarFrase();
  tentarIrPara();
}
let agendado = 0;
function agendar() {
  if (agendado) return;
  agendado = requestAnimationFrame(() => { agendado = 0; reconstruir(); });
}
function revelarFrase() {
  if (L.fraseMostrada || !L.aberto || !chavesVisiveis().includes('frase')) return;
  const el = folhasEl.querySelector('.face[data-key="frase"] .pag.frase');
  if (!el) return;
  L.fraseMostrada = true;
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('revelada')));
}
function tentarIrPara() {
  const alvo = L.irPara;
  if (!alvo || L.animando || L.arrasto || !L.aberto) return;
  if (Date.now() > alvo.ate) { L.irPara = null; return; }
  const f = L.faces.find(x => x.tipo === alvo.col && x.itens && x.itens.some(y => y.id === alvo.id));
  if (!f) return;
  L.irPara = null;
  const p = posParaChave(f.key);
  if (p != null && p !== L.pos) setTimeout(() => ir(p), 120);
}
function depoisDeVirar() {
  if (L.pendenteMedida) { L.pendenteMedida = false; remedir(); }
  if (L.pendente) { L.pendente = false; reconstruir(); }
  revelarFrase();
  tentarIrPara();
}
function remedir() {
  if (L.animando || L.arrasto) { L.pendenteMedida = true; return; }
  const antes = L.modo, porAntes = L.porPag;
  aplicarMedidas();
  if (antes !== L.modo || porAntes !== porPagina('desejos')) reconstruir();
  else repousar();
}
function atualizarBarra() {
  btnAnt.disabled = L.pos <= 0;
  btnProx.disabled = L.pos >= posMax();
}

async function abrirLivro() {
  if (L.aberto || L.animando) return;
  L.aberto = true;
  barra.classList.add('aberto');
  if (!reduzido && elastico.animate) {
    elastico.animate([
      { transform: 'translateX(0) scaleY(1)', opacity: 1 },
      { transform: 'translateX(18%) scaleY(1.03)', opacity: 1, offset: .3 },
      { transform: 'translateX(320%) rotate(9deg) scaleY(1)', opacity: 0 }
    ], { duration: 640, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' });
    await sleep(420);
  }
  await ir(1, { dur: 1500, ease: suave4 });
  elastico.hidden = true;
}

/* ---------- toque, arrasto e teclado ---------- */
let gesto = null, suprimirClique = false;
palco.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  if (!livroEl.contains(e.target)) return;
  gesto = { x0: e.clientX, y0: e.clientY, id: e.pointerId, ativo: false, p: 0, xs: [[e.clientX, performance.now()]] };
});
window.addEventListener('pointermove', e => {
  if (!gesto || e.pointerId !== gesto.id) return;
  const dx = e.clientX - gesto.x0, dy = e.clientY - gesto.y0;
  if (!gesto.ativo) {
    if (Math.abs(dx) > 9 && Math.abs(dx) > Math.abs(dy) * 1.15) {
      if (!L.aberto) { gesto = null; suprimirClique = true; abrirLivro(); return; }
      const dir = dx < 0 ? 1 : -1;
      if (L.animando || !comecarArrasto(dir)) { gesto = null; return; }
      gesto.ativo = true; gesto.dir = dir;
      try { palco.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
    } else {
      if (Math.abs(dy) > 14) gesto = null;
      return;
    }
  }
  gesto.xs.push([e.clientX, performance.now()]);
  if (gesto.xs.length > 6) gesto.xs.shift();
  const base = L.modo === 'duplo' ? L.pw * 1.35 : L.pw * .95;
  gesto.p = clamp((gesto.dir > 0 ? -dx : dx) / base, 0, 1);
  arrastarPara(gesto.p);
});
function soltar(e) {
  if (!gesto || e.pointerId !== gesto.id) return;
  const g = gesto; gesto = null;
  if (!g.ativo) return;
  suprimirClique = true;
  setTimeout(() => { suprimirClique = false; }, 400);
  const a = g.xs[0], b = g.xs[g.xs.length - 1];
  const v = (b[0] - a[0]) / Math.max(1, b[1] - a[1]);
  const vDir = g.dir > 0 ? -v : v;
  const completa = e.type !== 'pointercancel' && (g.p > .3 || (vDir > .35 && g.p > .03));
  terminarArrasto(completa);
}
window.addEventListener('pointerup', soltar);
window.addEventListener('pointercancel', soltar);

palco.addEventListener('click', e => {
  if (suprimirClique) { e.preventDefault(); e.stopPropagation(); suprimirClique = false; return; }
  if (!livroEl.contains(e.target)) return;
  if (!L.aberto) { abrirLivro(); return; }
  if (L.animando) return;
  const alvo = e.target.closest('[data-acao]');
  if (alvo) { e.preventDefault(); acao(alvo.dataset.acao, alvo.dataset.id, alvo); return; }
  const irp = e.target.closest('[data-ir]');
  if (irp) { irParaChave(irp.dataset.ir); return; }
  const r = livroEl.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  if (L.modo === 'duplo') { if (x >= .5) proxima(); else anterior(); }
  else if (x > .62) proxima();
  else if (x < .3) anterior();
}, true);

window.addEventListener('keydown', e => {
  if (revelacaoAberta()) { if (e.key === 'Escape') fecharRevelacao(); return; }
  if (folhaAberta()) { if (e.key === 'Escape') fecharFolha(); return; }
  if (e.target.closest && e.target.closest('input, textarea, select')) return;
  if (!L.aberto) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); abrirLivro(); }
    return;
  }
  if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); proxima(); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); anterior(); }
});

/* ================= páginas ================= */
const num = f => f.num ? `<span class="num">${f.num}</span>` : '';
const nomesCasal = () => { const c = S.config; return c.nomeDele ? `${esc(c.nomeDela)} &amp; ${esc(c.nomeDele)}` : esc(c.nomeDela); };

function htmlFace(f, lado) {
  switch (f.tipo) {
    case 'capa': return `<div class="pag capa"><span class="dobra"></span><div class="moldura"><p class="c1 ouro">nosso</p><p class="c2 ouro${L.brilhou ? '' : ' brilho'}">livrinho</p>${svgCor('c3')}<p class="c4 ouro">${nomesCasal()}</p></div></div>`;
    case 'contracapa': return `<div class="pag capa contracapa"><span class="dobra${lado === 'e' ? ' dir' : ''}"></span><div class="cc">${svgCor('c3')}<p class="cc-t ouro">continua…</p></div></div>`;
    case 'guarda': return htmlGuarda();
    case 'guardaFim': case 'versoCapa': return '<div class="pag guarda"></div>';
    case 'verso': return '<div class="pag"></div>';
    case 'frase': return htmlFrase(f);
    case 'sumario': return htmlSumario(f);
    case 'abertura': return htmlAbertura(f);
    case 'fotos': return htmlFotos(f);
    case 'desejos': return htmlDesejos(f);
    case 'viagens': return htmlViagens(f);
    case 'surpresa': return htmlSurpresa(f);
    case 'branco': return `<div class="pag branco"><p>pra tudo o que a gente ainda vai inventar</p>${num(f)}</div>`;
    default: return '<div class="pag"></div>';
  }
}

function htmlGuarda() {
  const c = S.config;
  let linha = '';
  const nam = deISO(c.namoro);
  if (nam) {
    const d = diasEntre(nam, deISO(hojeISO()));
    if (d === 0) linha = 'juntos desde hoje';
    else if (d > 0) linha = `juntos há ${plural(d, 'dia', 'dias')}`;
  } else linha = `começado em ${fmtLongo(deISO(c.inicio) || deISO(INICIO_PADRAO))}`;
  return `<div class="pag guarda"><div class="exlibris"><p class="ex-a">este livrinho pertence a</p><p class="ex-nomes">${nomesCasal()}</p>${linha ? `<p class="ex-b">${linha}</p>` : ''}</div></div>`;
}

function htmlFrase(f) {
  const fr = fraseDoDia();
  const palavras = fr.texto.split(/\s+/).map((w, i) => `<span class="w" style="--i:${i}">${esc(w)}</span>`).join(' ');
  const n = fr.texto.length;
  const fz = n > 95 ? 1.5 : n > 72 ? 1.68 : n > 48 ? 1.92 : 2.2;
  const aberta = fr.dia >= 365, falta = 365 - fr.dia;
  const p = Math.min(1, (fr.dia - 1) / 364) * 100;
  const pe = aberta ? 'a surpresa já está na última página' : falta === 1 ? 'falta 1 dia para a surpresa' : `faltam ${fmtNum(falta)} dias para a surpresa`;
  return `<div class="pag frase${L.fraseMostrada || reduzido ? ' revelada' : ''}">
    <p class="data">${fmtSemana(deISO(hojeISO()))}</p>
    <div class="corpo">${ORN}<blockquote style="--fz:${fz}em">${palavras}</blockquote></div>
    <div class="pe">
      <p>${fr.ano > 1 ? `ano ${fr.ano}, ` : ''}frase ${fr.diaDoAno} de 365</p>
      <div class="trilho" style="--p:${p.toFixed(1)}%" aria-hidden="true"><span class="feito"></span>${svgCor('cor')}${ENV}</div>
      <p>${pe}</p>
    </div>${num(f)}</div>`;
}

function contagem(id) {
  if (id === 'fotos') { const n = S.fotos.length; return n ? plural(n, 'foto colada', 'fotos coladas') : 'nenhuma foto ainda'; }
  if (id === 'desejos') { const n = S.desejos.length, r = S.desejos.filter(x => x.feito).length; return n ? `${plural(n, 'desejo', 'desejos')}, ${plural(r, 'realizado', 'realizados')}` : 'nenhum desejo ainda'; }
  const n = S.viagens.length, v = S.viagens.filter(x => x.status === 'fomos').length;
  return n ? `${plural(n, 'lugar', 'lugares')}, ${fmtNum(v)} já ${v === 1 ? 'visitado' : 'visitados'}` : 'nenhum lugar ainda';
}
function htmlSumario(f) {
  const pg = k => (L.faces.find(x => x.key === k) || {}).num || '';
  const fr = fraseDoDia();
  const linhas = [
    { rom: '', t: 'A frase de hoje', k: 'frase', sub: `frase ${fr.diaDoAno} de 365` },
    ...CAPS.map(c => ({ rom: c.rom, t: c.titulo, k: 'abertura-' + c.id, sub: contagem(c.id) })),
    { rom: '', t: 'A surpresa', k: 'surpresa', sub: surpresaAberta() ? 'já pode abrir' : `abre em ${fmtLongo(dataSurpresa())}` }
  ];
  return `<div class="pag sumario"><h2>Sumário</h2><ol class="toc">${linhas.map(l => `<li><button data-ir="${l.k}"><span class="lin"><span class="rom">${l.rom}</span><span class="tit">${l.t}</span><span class="pont"></span><span class="pg">${pg(l.k)}</span></span><span class="sub">${esc(l.sub)}</span></button></li>`).join('')}</ol>${num(f)}</div>`;
}
function htmlAbertura(f) {
  const cap = CAPS.find(c => c.id === f.cap);
  return `<div class="pag abertura"><p class="capn">capítulo ${cap.rom}</p><h2>${cap.titulo}</h2><p class="subt">${cap.sub}</p>${ILUS[cap.id]}<p class="cont">${contagem(cap.id)}</p>${num(f)}</div>`;
}

function htmlFotos(f) {
  const slots = f.itens.map((x, i) => {
    const ar = clamp(Number(x.ar) || 1, .72, 1.45);
    const giro = typeof x.giro === 'number' ? x.giro : (i ? 2 : -2.5);
    const dt = deISO(x.data);
    return `<div class="slot"><button class="pola${recente(x.id)}" data-acao="ver-foto" data-id="${esc(x.id)}" style="--giro:${giro}deg;--ar:${ar.toFixed(3)}" aria-label="Ver foto${x.legenda ? ': ' + esc(x.legenda) : ''}"><span class="fita" style="--fg:${i ? 4 : -3}deg"></span><span class="img"><img src="${esc(Store.src(x.fotoId))}" alt="" loading="lazy" decoding="async" draggable="false"></span><span class="leg">${esc(x.legenda || '')}</span>${dt ? `<span class="dt">${fmtCurto(dt)}</span>` : ''}</button></div>`;
  });
  if (f.novo) slots.push(`<div class="slot"><button class="pola nova" data-acao="nova-foto"><span class="mais">+</span><span>colar uma foto nossa</span></button></div>`);
  let vazio = '';
  if (f.vazio) vazio = `<p class="vazio">Nenhuma foto colada ainda.${f.novo ? ' Cole a primeira.' : (S.podeEscrever && !S.podeFoto ? ' Para colar fotos, é preciso ter acesso de edição.' : '')}</p>`;
  return `<div class="pag fotos"><p class="cabeca">nossas fotos</p>${vazio}<div class="grade${slots.length <= 1 ? ' so1' : ''}">${slots.join('')}</div>${num(f)}</div>`;
}

function htmlDesejos(f) {
  const itens = f.itens.map(x => {
    const fe = deISO(x.feitoEm);
    return `<li class="dz${x.feito ? ' feito' : ''}${recente(x.id)}"><button class="coracao" data-acao="marcar-desejo" data-id="${esc(x.id)}" aria-pressed="${x.feito ? 'true' : 'false'}" aria-label="${x.feito ? 'Desmarcar' : 'Marcar como realizado'}: ${esc(x.texto)}"${S.podeEscrever ? '' : ' disabled'}>${svgCor('')}</button><button class="txt" data-acao="ver-desejo" data-id="${esc(x.id)}"><span class="t">${esc(x.texto)}</span>${x.nota ? `<span class="nota">${esc(x.nota)}</span>` : ''}</button>${x.feito ? `<span class="carimbo">realizado${fe ? ' em ' + fmtCurto(fe) : ''}</span>` : ''}</li>`;
  }).join('');
  const vazio = f.vazio ? '<li class="vazio-l">Ainda não tem nenhum desejo escrito.</li>' : '';
  const novo = f.novo ? '<li class="dz novo"><button data-acao="novo-desejo">+ escrever um desejo</button></li>' : '';
  return `<div class="pag caderno desejos"><p class="cabeca">nossos desejos</p><ul class="linhas">${vazio}${itens}${novo}</ul>${num(f)}</div>`;
}

function htmlViagens(f) {
  const cards = f.itens.map((x, i) => {
    const st = ['sonho', 'planejando', 'fomos'].includes(x.status) ? x.status : 'sonho';
    const foto = x.fotoId ? `<img src="${esc(Store.src(x.fotoId))}" alt="" loading="lazy" decoding="async" draggable="false">` : PAISAGEM;
    const fe = deISO(x.fomosEm);
    const marca = st === 'fomos'
      ? `<span class="postmark"><span>fomos</span><small>${fe ? fmtCurto(fe) : '♥'}</small></span>`
      : `<span class="carimbo st-${st}">${st === 'planejando' ? 'planejando' : 'sonhando'}</span>`;
    return `<button class="postal st-${st}${recente(x.id)}" data-acao="ver-viagem" data-id="${esc(x.id)}" style="--giro:${i % 2 ? .8 : -.9}deg"><span class="foto">${foto}</span><span class="corpo"><span class="lugar">${esc(x.lugar)}</span>${x.quando ? `<span class="quando">${esc(x.quando)}</span>` : ''}${x.motivo ? `<span class="motivo">${esc(x.motivo)}</span>` : ''}</span><span class="selo" aria-hidden="true"><i>${SELOS[st]}</i></span>${marca}</button>`;
  });
  if (f.novo) cards.push('<button class="postal novo" data-acao="nova-viagem"><span class="mais">+</span><span>anotar um lugar</span></button>');
  const vazio = f.vazio ? '<p class="vazio">Nenhum lugar anotado ainda.</p>' : '';
  return `<div class="pag viagens"><p class="cabeca">nossas viagens</p>${vazio}<div class="lista">${cards.join('')}</div>${num(f)}</div>`;
}

function htmlSurpresa(f) {
  const d = diaAtual(), aberta = d >= 365, falta = 365 - d;
  const env = `<button class="envelope" data-acao="surpresa" aria-label="${aberta ? 'Abrir a surpresa' : 'Surpresa guardada até o dia 365'}"><span class="e-corpo"></span><span class="e-bolso"></span><span class="e-aba"></span><span class="e-lacre">${svgCor('')}</span></button>`;
  const texto = aberta
    ? '<p class="sp-t">Chegou o dia.<br>Toque no envelope.</p>'
    : `<p class="sp-t">Esta página guarda uma surpresa. Ela abre no dia 365 do nosso livrinho.</p><p class="sp-falta"><b>${fmtNum(falta)}</b>${falta === 1 ? 'dia' : 'dias'}</p><p class="sp-data">${fmtLongo(dataSurpresa())}</p>`;
  return `<div class="pag surpresa${aberta ? ' aberta' : ''}"><p class="cabeca">a surpresa</p><div class="sp-meio">${env}${texto}</div>${num(f)}</div>`;
}

/* ================= folhas (janelas) ================= */
const veu = $('#veu'), cartao = $('#cartao'), avisoEl = $('#aviso'), fx = $('#fx');
let focoAntes = null, avisoT = 0;
const folhaAberta = () => !veu.hidden;
function abrirFolha(html, aoMontar) {
  focoAntes = document.activeElement;
  cartao.innerHTML = html;
  veu.hidden = false;
  requestAnimationFrame(() => veu.classList.add('on'));
  cartao.querySelectorAll('[data-f="fechar"]').forEach(b => b.addEventListener('click', fecharFolha));
  if (aoMontar) aoMontar(cartao);
  const alvo = cartao.querySelector('[autofocus]');
  setTimeout(() => { if (alvo) alvo.focus({ preventScroll: true }); else cartao.focus({ preventScroll: true }); }, reduzido ? 0 : 280);
}
function fecharFolha() {
  if (veu.hidden) return;
  veu.classList.remove('on');
  setTimeout(() => { veu.hidden = true; cartao.innerHTML = ''; }, reduzido ? 0 : 260);
  if (focoAntes && focoAntes.focus && document.contains(focoAntes)) focoAntes.focus({ preventScroll: true });
}
veu.addEventListener('click', e => { if (e.target === veu) fecharFolha(); });
function avisar(msg) {
  avisoEl.textContent = msg;
  avisoEl.classList.add('on');
  clearTimeout(avisoT);
  avisoT = setTimeout(() => avisoEl.classList.remove('on'), 2900);
}
function confirmarDuplo(btn, texto, fn) {
  if (btn.dataset.armado) { fn(); return; }
  const orig = btn.textContent;
  btn.dataset.armado = '1'; btn.textContent = texto;
  setTimeout(() => { if (btn.isConnected) { delete btn.dataset.armado; btn.textContent = orig; } }, 3500);
}
const quem = x => x.autor === 'ele' ? (S.config.nomeDele || 'ele') : x.autor === 'ela' ? (S.config.nomeDela || 'ela') : '';
const autorAtual = () => S.modo === 'nuvem' ? (S.dono ? 'ele' : 'ela') : '';
function irDepois(col, id) { L.irPara = { col, id, ate: Date.now() + 6000 }; }
function centro(el) { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }

function acao(nome, id, el) {
  if (nome === 'nova-foto') return formFoto();
  if (nome === 'ver-foto') return verFoto(id);
  if (nome === 'novo-desejo') return formDesejo();
  if (nome === 'ver-desejo') return formDesejo(id);
  if (nome === 'marcar-desejo') return marcarDesejo(id, el);
  if (nome === 'nova-viagem') return formViagem();
  if (nome === 'ver-viagem') return formViagem(id);
  if (nome === 'surpresa') return tocarSurpresa(el);
}

function ligarEscolha(c, sel, prevSel, aoEscolher) {
  c.querySelector(sel).addEventListener('change', async ev => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    const prev = c.querySelector(prevSel);
    prev.innerHTML = '<span class="prev-vazio">abrindo a foto…</span>';
    try {
      const r = await comprimir(file);
      const url = URL.createObjectURL(r.blob);
      prev.innerHTML = `<img src="${url}" alt="">`;
      aoEscolher(r, url);
    } catch (e) {
      prev.innerHTML = '<span class="prev-vazio">+ escolher foto</span>';
      avisar(msgErro(e));
    }
  });
}

/* ---------- fotos ---------- */
function formFoto() {
  if (!S.podeFoto) return avisar('Seu acesso não permite colar fotos aqui.');
  abrirFolha(`<h3>Colar uma foto</h3><p class="ajuda">Escolha uma foto de vocês dois. Ela entra no álbum pela data.</p>
    <label class="escolher"><input type="file" accept="image/*" id="fArq" aria-label="Escolher foto"><span class="prev" id="fPrev"><span class="prev-vazio">+ escolher foto</span></span></label>
    <label class="campo"><span>Legenda</span><input type="text" id="fLeg" maxlength="80" placeholder="o dia em que…"></label>
    <label class="campo"><span>Data da foto</span><input type="date" id="fData" value="${hojeISO()}"></label>
    <div class="acoes"><button class="btn sec" data-f="fechar">Cancelar</button><button class="btn pri" id="fOk" disabled>Colar no livrinho</button></div>`, c => {
    let escolhida = null;
    ligarEscolha(c, '#fArq', '#fPrev', r => { escolhida = r; c.querySelector('#fOk').disabled = false; });
    c.querySelector('#fOk').addEventListener('click', async () => {
      if (!escolhida) return;
      const btn = c.querySelector('#fOk');
      btn.disabled = true; btn.textContent = 'Colando…';
      let fotoId = null;
      try {
        fotoId = await Store.enviarFoto(escolhida.blob);
        const dados = { fotoId, legenda: c.querySelector('#fLeg').value.trim().slice(0, 80), data: c.querySelector('#fData').value || hojeISO(), ar: +escolhida.ar.toFixed(4), giro: +(Math.random() * 5 - 2.5).toFixed(2), criadoEm: Date.now(), autor: autorAtual() };
        await Store.adicionar('fotos', dados, id => { marcarRecente(id, 'novo'); irDepois('fotos', id); });
        fecharFolha(); avisar('Foto colada. ♥');
      } catch (e) {
        if (fotoId && S.modo === 'nuvem') Store.apagarFoto(fotoId);
        tratarErro(e); btn.disabled = false; btn.textContent = 'Colar no livrinho';
      }
    });
  });
}
function verFoto(id) {
  const x = S.fotos.find(f => f.id === id);
  if (!x) return;
  const dt = deISO(x.data), q = quem(x);
  const meta = [dt ? fmtLongo(dt) : '', q ? `colada por ${esc(q)}` : ''].filter(Boolean).join(', ');
  abrirFolha(`<figure class="visor"><img src="${esc(Store.src(x.fotoId))}" alt="${esc(x.legenda || 'Foto de vocês dois')}"></figure>
    ${x.legenda ? `<p class="visor-leg">${esc(x.legenda)}</p>` : ''}${meta ? `<p class="visor-meta">${meta}</p>` : ''}
    <div class="acoes">${S.podeEscrever ? '<button class="btn perigo" id="vApagar">Apagar foto</button><button class="btn sec" id="vEditar">Editar</button>' : ''}<button class="btn pri" data-f="fechar">Fechar</button></div>`, c => {
    const ap = c.querySelector('#vApagar');
    if (ap) ap.addEventListener('click', () => confirmarDuplo(ap, 'Toque de novo para apagar', async () => {
      try { await Store.apagar('fotos', x.id); Store.apagarFoto(x.fotoId); fecharFolha(); avisar('Foto apagada.'); } catch (e) { tratarErro(e); }
    }));
    const ed = c.querySelector('#vEditar');
    if (ed) ed.addEventListener('click', () => editarFoto(x));
  });
}
function editarFoto(x) {
  abrirFolha(`<h3>Editar foto</h3>
    <label class="campo"><span>Legenda</span><input type="text" id="eLeg" maxlength="80" value="${esc(x.legenda || '')}" autofocus></label>
    <label class="campo"><span>Data da foto</span><input type="date" id="eData" value="${esc(x.data || '')}"></label>
    <div class="acoes"><button class="btn sec" data-f="fechar">Cancelar</button><button class="btn pri" id="eOk">Salvar</button></div>`, c => {
    c.querySelector('#eOk').addEventListener('click', async () => {
      try { await Store.atualizar('fotos', x.id, { legenda: c.querySelector('#eLeg').value.trim().slice(0, 80), data: c.querySelector('#eData').value || x.data || hojeISO() }); fecharFolha(); avisar('Salvo.'); irDepois('fotos', x.id); }
      catch (e) { tratarErro(e); }
    });
  });
}

/* ---------- desejos ---------- */
function formDesejo(id) {
  const x = id ? S.desejos.find(d => d.id === id) : null;
  if (id && !x) return;
  const ro = !S.podeEscrever;
  let ajuda = 'Uma coisa que vocês querem fazer juntos.';
  if (x) {
    const fe = deISO(x.feitoEm), q = quem(x);
    ajuda = [x.feito ? `Realizado${fe ? ' em ' + fmtLongo(fe) : ''}.` : '', q ? `Escrito por ${esc(q)}${x.criadoEm ? ' em ' + fmtLongo(new Date(x.criadoEm)) : ''}.` : ''].filter(Boolean).join(' ') || 'Um desejo de vocês dois.';
  }
  abrirFolha(`<h3>${x ? (ro ? 'Nosso desejo' : 'Editar desejo') : 'Escrever um desejo'}</h3><p class="ajuda">${ajuda}</p>
    <label class="campo"><span>O que a gente quer fazer?</span><input type="text" id="dT" maxlength="120" value="${esc(x ? x.texto : '')}" placeholder="ver a neve pela primeira vez"${ro ? ' readonly' : ' autofocus'}></label>
    <label class="campo"><span>Quer contar mais? (opcional)</span><textarea id="dN" maxlength="300" rows="3"${ro ? ' readonly' : ''}>${esc(x ? x.nota || '' : '')}</textarea></label>
    ${x && !ro ? `<label class="marcar"><input type="checkbox" id="dF"${x.feito ? ' checked' : ''}><span>Já realizamos este desejo</span></label>` : ''}
    <div class="acoes">${x && !ro ? '<button class="btn perigo" id="dApagar">Apagar</button>' : ''}<button class="btn sec" data-f="fechar">${ro ? 'Fechar' : 'Cancelar'}</button>${ro ? '' : `<button class="btn pri" id="dOk">${x ? 'Salvar' : 'Escrever no livrinho'}</button>`}</div>`, c => {
    const ok = c.querySelector('#dOk');
    if (ok) ok.addEventListener('click', async () => {
      const texto = c.querySelector('#dT').value.trim().slice(0, 120);
      const nota = c.querySelector('#dN').value.trim().slice(0, 300);
      if (!texto) { avisar('Escreva o desejo antes de salvar.'); c.querySelector('#dT').focus(); return; }
      ok.disabled = true;
      try {
        if (x) {
          const feito = c.querySelector('#dF').checked;
          if (feito && !x.feito) marcarRecente(x.id, 'pop');
          await Store.atualizar('desejos', x.id, { texto, nota, feito, feitoEm: feito ? (x.feitoEm || hojeISO()) : null });
          fecharFolha(); avisar(feito && !x.feito ? 'Desejo realizado! ♥' : 'Salvo.');
          if (feito && !x.feito) coracoes(innerWidth / 2, innerHeight / 2, 16, 120);
        } else {
          await Store.adicionar('desejos', { texto, nota, feito: false, feitoEm: null, criadoEm: Date.now(), autor: autorAtual() }, nid => { marcarRecente(nid, 'novo'); irDepois('desejos', nid); });
          fecharFolha(); avisar('Desejo escrito. ♥');
        }
      } catch (e) { tratarErro(e); ok.disabled = false; }
    });
    const ap = c.querySelector('#dApagar');
    if (ap) ap.addEventListener('click', () => confirmarDuplo(ap, 'Toque de novo para apagar', async () => {
      try { await Store.apagar('desejos', x.id); fecharFolha(); avisar('Desejo apagado.'); } catch (e) { tratarErro(e); }
    }));
  });
}
async function marcarDesejo(id, btn) {
  if (!S.podeEscrever) return;
  const x = S.desejos.find(d => d.id === id);
  if (!x) return;
  const feito = !x.feito;
  if (feito) { const [cx, cy] = centro(btn); coracoes(cx, cy, 12, 70); marcarRecente(id, 'pop'); }
  try { await Store.atualizar('desejos', id, { feito, feitoEm: feito ? hojeISO() : null }); if (feito) avisar('Desejo realizado! ♥'); }
  catch (e) { tratarErro(e); }
}

/* ---------- viagens ---------- */
function formViagem(id) {
  const x = id ? S.viagens.find(v => v.id === id) : null;
  if (id && !x) return;
  const ro = !S.podeEscrever;
  let status = x ? (x.status || 'sonho') : 'sonho';
  const chip = (v, t) => `<button type="button" class="chip" data-st="${v}" aria-pressed="${status === v}"${ro ? ' disabled' : ''}>${t}</button>`;
  const fotoBloco = x && x.fotoId ? `<img src="${esc(Store.src(x.fotoId))}" alt="">` : '<span class="prev-vazio">+ foto do lugar (opcional)</span>';
  abrirFolha(`<h3>${x ? (ro ? esc(x.lugar) : 'Editar lugar') : 'Anotar um lugar'}</h3><p class="ajuda">${x ? (quem(x) ? `Anotado por ${esc(quem(x))}.` : 'Um lugar de vocês dois.') : 'Um lugar onde vocês querem ir juntos.'}</p>
    <label class="campo"><span>Lugar</span><input type="text" id="vL" maxlength="60" value="${esc(x ? x.lugar : '')}" placeholder="Gramado, Paris, a praia do Rosa…"${ro ? ' readonly' : ' autofocus'}></label>
    <label class="campo"><span>Por que a gente quer ir? (opcional)</span><textarea id="vM" maxlength="220" rows="3"${ro ? ' readonly' : ''}>${esc(x ? x.motivo || '' : '')}</textarea></label>
    <label class="campo"><span>Quando? (opcional)</span><input type="text" id="vQ" maxlength="40" value="${esc(x ? x.quando || '' : '')}" placeholder="nas férias de julho"${ro ? ' readonly' : ''}></label>
    <div class="campo"><span class="rotulo">Como está esse plano?</span><div class="chips">${chip('sonho', 'sonhando')}${chip('planejando', 'planejando')}${chip('fomos', 'já fomos!')}</div></div>
    <label class="campo" id="vFomosC"${status === 'fomos' ? '' : ' hidden'}><span>Quando fomos</span><input type="date" id="vFD" value="${esc(x && x.fomosEm ? x.fomosEm : hojeISO())}"${ro ? ' readonly' : ''}></label>
    ${ro ? (x && x.fotoId ? `<figure class="visor">${fotoBloco}</figure>` : '') : `<label class="escolher mini"><input type="file" accept="image/*" id="vArq" aria-label="Foto do lugar"><span class="prev" id="vPrev">${fotoBloco}</span></label>`}
    <div class="acoes">${x && !ro ? '<button class="btn perigo" id="vApagar">Apagar</button>' : ''}<button class="btn sec" data-f="fechar">${ro ? 'Fechar' : 'Cancelar'}</button>${ro ? '' : `<button class="btn pri" id="vOk">${x ? 'Salvar' : 'Anotar no livrinho'}</button>`}</div>`, c => {
    let nova = null;
    c.querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => {
      status = b.dataset.st;
      c.querySelectorAll('.chip').forEach(o => o.setAttribute('aria-pressed', String(o === b)));
      c.querySelector('#vFomosC').hidden = status !== 'fomos';
    }));
    if (!ro) ligarEscolha(c, '#vArq', '#vPrev', r => { nova = r; });
    const ok = c.querySelector('#vOk');
    if (ok) ok.addEventListener('click', async () => {
      const lugar = c.querySelector('#vL').value.trim().slice(0, 60);
      if (!lugar) { avisar('Escreva o nome do lugar antes de salvar.'); c.querySelector('#vL').focus(); return; }
      ok.disabled = true; ok.textContent = 'Salvando…';
      let fotoNova = null;
      try {
        if (nova) { if (!S.podeFoto) throw { code: 'not_granted' }; fotoNova = await Store.enviarFoto(nova.blob); }
        const dados = { lugar, motivo: c.querySelector('#vM').value.trim().slice(0, 220), quando: c.querySelector('#vQ').value.trim().slice(0, 40), status, fomosEm: status === 'fomos' ? (c.querySelector('#vFD').value || hojeISO()) : null };
        if (fotoNova) dados.fotoId = fotoNova;
        const virouFomos = status === 'fomos' && (!x || x.status !== 'fomos');
        if (x) {
          await Store.atualizar('viagens', x.id, dados);
          if (fotoNova && x.fotoId) Store.apagarFoto(x.fotoId);
          if (virouFomos) marcarRecente(x.id, 'novo');
          irDepois('viagens', x.id);
        } else {
          await Store.adicionar('viagens', { ...dados, fotoId: fotoNova || null, criadoEm: Date.now(), autor: autorAtual() }, nid => { marcarRecente(nid, 'novo'); irDepois('viagens', nid); });
        }
        fecharFolha();
        avisar(virouFomos ? 'Mais um lugar nosso! ♥' : x ? 'Salvo.' : 'Lugar anotado. ♥');
        if (virouFomos) coracoes(innerWidth / 2, innerHeight / 2, 16, 120);
      } catch (e) {
        if (fotoNova && S.modo === 'nuvem') Store.apagarFoto(fotoNova);
        tratarErro(e); ok.disabled = false; ok.textContent = x ? 'Salvar' : 'Anotar no livrinho';
      }
    });
    const ap = c.querySelector('#vApagar');
    if (ap) ap.addEventListener('click', () => confirmarDuplo(ap, 'Toque de novo para apagar', async () => {
      try { await Store.apagar('viagens', x.id); if (x.fotoId) Store.apagarFoto(x.fotoId); fecharFolha(); avisar('Lugar apagado.'); } catch (e) { tratarErro(e); }
    }));
  });
}

/* ---------- área do autor ---------- */
function mostrarAutor() {}
function formAutor() {
  const c = S.config;
  abrirFolha(`<h3>Área do autor</h3><p class="ajuda">Só você vê esta área. O que você salvar aqui aparece no livrinho. Para voltar aqui, segure a etiqueta “este livrinho pertence a” por um segundo.</p>
    <label class="campo"><span>Nome dela</span><input type="text" id="aNela" maxlength="40" value="${esc(c.nomeDela)}"></label>
    <label class="campo"><span>Seu nome</span><input type="text" id="aNele" maxlength="40" value="${esc(c.nomeDele)}" placeholder="aparece na capa, junto com o dela"></label>
    <label class="campo"><span>Começamos a namorar em (opcional)</span><input type="date" id="aNamoro" value="${esc(c.namoro || '')}"></label>
    <label class="campo"><span>Dia 1 do livrinho (as 365 frases contam a partir dele)</span><input type="date" id="aInicio" value="${esc(c.inicio || INICIO_PADRAO)}"></label>
    <p class="info-autor" id="aInfo"></p>
    <hr class="sep">
    <label class="campo"><span>A carta da surpresa</span><textarea id="aCarta" rows="7" maxlength="6000" placeholder="Escreva aqui o que ela vai ler no dia 365…"></textarea></label>
    <p class="ajuda">Se ficar em branco, ela verá uma carta padrão assinada com o seu nome.</p>
    <span class="rotulo">Foto da surpresa (opcional)</span>
    <label class="escolher mini"><input type="file" accept="image/*" id="aArq" aria-label="Foto da surpresa"><span class="prev" id="aPrev"><span class="prev-vazio">+ escolher foto</span></span></label>
    <button class="btn sec mini" id="aSemFoto" hidden>Tirar a foto da surpresa</button>
    ${S.modo === 'supabase' || (S.modo === 'local' && !window.claude) ? '<p class="ajuda">Este aparelho está no modo autor. Para sair, abra o site com <b>?sair</b> no fim do endereço.</p>' : ''}<div class="acoes"><button class="btn sec" id="aPrevia">Ver a surpresa</button><button class="btn pri" id="aSalvar">Salvar</button></div>`, async el => {
    const v = s => el.querySelector(s).value.trim();
    const info = () => {
      const ini = deISO(el.querySelector('#aInicio').value) || deISO(INICIO_PADRAO);
      const d = Math.max(1, diasEntre(ini, deISO(hojeISO())) + 1);
      el.querySelector('#aInfo').textContent = d >= 365 ? `Hoje é o dia ${fmtNum(d)}. A surpresa já está aberta para ela.` : `Hoje é o dia ${d} de 365. A surpresa abre em ${fmtLongo(somaDias(ini, 364))}.`;
    };
    info();
    el.querySelector('#aInicio').addEventListener('input', info);
    let fotoAtual = null, arAtual = 1, nova = null, novaUrl = '', remover = false;
    const semFoto = el.querySelector('#aSemFoto');
    ligarEscolha(el, '#aArq', '#aPrev', (r, url) => { nova = r; novaUrl = url; remover = false; semFoto.hidden = false; });
    semFoto.addEventListener('click', () => { nova = null; novaUrl = ''; remover = true; semFoto.hidden = true; el.querySelector('#aPrev').innerHTML = '<span class="prev-vazio">+ escolher foto</span>'; });
    try {
      const carta = await Store.lerSurpresa();
      if (carta && el.isConnected) {
        el.querySelector('#aCarta').value = carta.texto || '';
        if (carta.fotoId) { fotoAtual = carta.fotoId; arAtual = carta.ar || 1; el.querySelector('#aPrev').innerHTML = `<img src="${esc(Store.src(fotoAtual))}" alt="">`; semFoto.hidden = false; }
      }
    } catch (e) { console.warn(e); }
    el.querySelector('#aPrevia').addEventListener('click', () => {
      const fotoId = remover ? null : fotoAtual;
      abrirRevelacao({ previa: true, carta: { texto: el.querySelector('#aCarta').value, fotoId: nova ? null : fotoId, ar: nova ? nova.ar : arAtual }, fotoUrl: nova ? novaUrl : '' , nomeDela: v('#aNela'), nomeDele: v('#aNele') });
    });
    el.querySelector('#aSalvar').addEventListener('click', async () => {
      const btn = el.querySelector('#aSalvar');
      btn.disabled = true; btn.textContent = 'Salvando…';
      try {
        await Store.salvarConfig({ nomeDela: v('#aNela') || 'Kemelly', nomeDele: v('#aNele'), namoro: v('#aNamoro'), inicio: v('#aInicio') || INICIO_PADRAO, atualizadoEm: Date.now() });
        let fotoId = remover ? null : fotoAtual, ar = arAtual;
        if (nova) { fotoId = await Store.enviarFoto(nova.blob); ar = +nova.ar.toFixed(4); }
        await Store.salvarSurpresa({ texto: el.querySelector('#aCarta').value.slice(0, 6000), fotoId: fotoId || null, ar, atualizadoEm: Date.now() });
        if (fotoAtual && fotoAtual !== fotoId) Store.apagarFoto(fotoAtual);
        fecharFolha(); avisar('Salvo.');
      } catch (e) { tratarErro(e); btn.disabled = false; btn.textContent = 'Salvar'; }
    });
  });
}

/* ================= a surpresa ================= */
const rv = $('#revelar');
const revelacaoAberta = () => !rv.hidden;
function cartaPadrao(ela, ele) {
  return `${ela || 'Meu amor'},\n\nSe você está lendo isto, é porque a gente completou um ano inteirinho neste livrinho: 365 frases, fotos coladas, desejos escritos e lugares anotados. Cada página foi feita pensando em você.\n\nObrigado por cada dia. Pelos abraços, pelas risadas, pela paciência e até pelos dias difíceis que a gente atravessou de mãos dadas. Você é a parte mais bonita da minha história.\n\nQue venham mais 365 dias. E depois mais 365.\n\nEu te amo.\n${ele ? `Com todo o meu amor,\n${ele}` : 'Com todo o meu amor.'}`;
}
function tocarSurpresa(el) {
  if (!surpresaAberta()) {
    if (!reduzido && el.animate) el.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(3deg)' }, { transform: 'rotate(-2deg)' }, { transform: 'rotate(0)' }], { duration: 520 });
    const falta = 365 - diaAtual();
    avisar(falta > 30 ? 'Ainda não… paciência, meu amor. ♥' : `Falta${falta === 1 ? '' : 'm'} só ${falta} ${falta === 1 ? 'dia' : 'dias'}. ♥`);
    return;
  }
  abrirRevelacao({});
}
async function abrirRevelacao(op) {
  let carta = op.carta;
  if (!carta) { try { carta = await Store.lerSurpresa(); } catch (e) { carta = null; } }
  const ela = op.nomeDela || S.config.nomeDela, ele = op.nomeDele != null ? op.nomeDele : S.config.nomeDele;
  const texto = carta && carta.texto && carta.texto.trim() ? carta.texto : cartaPadrao(ela, ele);
  const foto = op.fotoUrl || (carta && carta.fotoId ? Store.src(carta.fotoId) : '');
  const ar = clamp(Number(carta && carta.ar) || 1, .6, 1.6);
  $('#rvPapel').innerHTML = `${foto ? `<figure class="pola" style="--ar:${ar}"><span class="fita"></span><span class="img"><img src="${esc(foto)}" alt=""></span></figure>` : ''}<div class="rv-texto">${esc(texto)}</div>`;
  $('#rvPrevia').hidden = !op.previa;
  const env = rv.querySelector('.rv-env'), aba = rv.querySelector('.rv-aba'), lacre = rv.querySelector('.rv-lacre'), folha = rv.querySelector('.rv-folha');
  [env, aba, lacre, folha].forEach(x => { if (x.getAnimations) x.getAnimations().forEach(a => a.cancel()); });
  aba.style.zIndex = '';
  rv.classList.remove('lida');
  rv.hidden = false;
  requestAnimationFrame(() => rv.classList.add('on'));
  if (reduzido || !env.animate) { rv.classList.add('lida'); $('#rvFechar').focus(); return; }
  env.animate([{ transform: 'translateY(40px) scale(.85)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' });
  await sleep(850);
  lacre.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: 'translate(-50%,-50%) scale(1.25)', opacity: 1, offset: .35 }, { transform: 'translate(-50%,-50%) scale(.2) rotate(40deg)', opacity: 0 }], { duration: 520, easing: 'ease-in', fill: 'forwards' });
  await sleep(380);
  aba.animate([{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(180deg)' }], { duration: 720, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' });
  await sleep(380);
  aba.style.zIndex = '1';
  await sleep(380);
  folha.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-60%)' }], { duration: 850, easing: 'cubic-bezier(.3,.7,.2,1)', fill: 'forwards' });
  await sleep(900);
  if (rv.hidden) return;
  rv.classList.add('lida');
  chuvaCoracoes();
  setTimeout(() => $('#rvFechar').focus({ preventScroll: true }), 500);
}
function fecharRevelacao() {
  rv.classList.remove('on');
  setTimeout(() => { rv.hidden = true; rv.classList.remove('lida'); }, reduzido ? 0 : 450);
}
$('#rvFechar').addEventListener('click', fecharRevelacao);

/* ================= corações ================= */
const CORES = ['#5E1A2B', '#D98C9A', '#C9A45C', '#B3261E', '#F0CCD2'];
function coracao(tam, cor) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.innerHTML = `<path d="${P_COR}" fill="${cor}"/>`;
  s.style.width = s.style.height = tam + 'px';
  fx.appendChild(s);
  return s;
}
function coracoes(x, y, n, raio) {
  if (reduzido) return;
  for (let k = 0; k < n; k++) {
    const t = 9 + Math.random() * 11, s = coracao(t, CORES[k % CORES.length]);
    const a = Math.random() * Math.PI * 2, d = raio * (.5 + Math.random() * .7);
    const dx = Math.cos(a) * d, dy = Math.sin(a) * d - 25;
    s.animate([
      { transform: `translate(${x - t / 2}px,${y - t / 2}px) scale(.3)`, opacity: 1 },
      { transform: `translate(${x + dx - t / 2}px,${y + dy - t / 2}px) scale(1) rotate(${(Math.random() * 60 - 30) | 0}deg)`, opacity: 1, offset: .55 },
      { transform: `translate(${x + dx * 1.1 - t / 2}px,${y + dy + 45 - t / 2}px) scale(.8) rotate(${(Math.random() * 90 - 45) | 0}deg)`, opacity: 0 }
    ], { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' }).onfinish = () => s.remove();
  }
}
function chuvaCoracoes() {
  if (reduzido) return;
  const W = innerWidth, H = innerHeight;
  for (let k = 0; k < 40; k++) {
    const t = 10 + Math.random() * 16, s = coracao(t, CORES[k % CORES.length]);
    const x = Math.random() * W, balanco = (Math.random() * 2 - 1) * 60;
    s.animate([
      { transform: `translate(${x}px,-30px) rotate(0deg)`, opacity: 0 },
      { transform: `translate(${x + balanco * .5}px,${H * .3}px) rotate(${balanco / 2}deg)`, opacity: 1, offset: .25 },
      { transform: `translate(${x + balanco}px,${H + 30}px) rotate(${balanco}deg)`, opacity: .9 }
    ], { duration: 2600 + Math.random() * 1800, delay: Math.random() * 1400, easing: 'linear', fill: 'both' }).onfinish = () => s.remove();
  }
}

/* ================= início ================= */
btnAnt.innerHTML = SETA_E;
btnProx.innerHTML = SETA_E.replace('M14.5 5.5L8 12l6.5 6.5', 'M9.5 5.5L16 12l-6.5 6.5');
btnAnt.addEventListener('click', anterior);
btnProx.addEventListener('click', proxima);
$('#btnFrase').addEventListener('click', () => irParaChave('frase'));
$('#btnSumario').addEventListener('click', () => irParaChave('sumario'));
$('#btnDica').addEventListener('click', abrirLivro);

/* atalho escondido da área do autor: segurar a etiqueta por 1 segundo */
let seguraT = 0, seguraEl = null;
const cancelaSegura = () => { clearTimeout(seguraT); if (seguraEl) seguraEl.classList.remove('segurando'); seguraEl = null; };
palco.addEventListener('pointerdown', e => {
  const ex = e.target.closest && e.target.closest('.exlibris');
  if (!ex || !S.dono || !L.aberto) return;
  seguraEl = ex; ex.classList.add('segurando');
  seguraT = setTimeout(() => {
    cancelaSegura(); gesto = null; suprimirClique = true;
    setTimeout(() => { suprimirClique = false; }, 600);
    formAutor();
  }, 1100);
});
window.addEventListener('pointerup', cancelaSegura);
window.addEventListener('pointercancel', cancelaSegura);
window.addEventListener('pointermove', e => { if (seguraEl && gesto && Math.abs(e.clientX - gesto.x0) + Math.abs(e.clientY - gesto.y0) > 10) cancelaSegura(); });

let diaVisto = hojeISO();
function verificarDia() { if (hojeISO() !== diaVisto) { diaVisto = hojeISO(); reconstruir(); } }
document.addEventListener('visibilitychange', () => { if (!document.hidden) verificarDia(); });
setInterval(verificarDia, 60000);

let rz = 0;
if (window.ResizeObserver) new ResizeObserver(() => { cancelAnimationFrame(rz); rz = requestAnimationFrame(remedir); }).observe(palco);
else window.addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(remedir); });

aplicarMedidas();
L.faces = montarFaces();
construirFolhas();
L.pos = 0;
repousar();
setTimeout(() => { L.brilhou = true; }, 3500);
Store.iniciar();

})();
