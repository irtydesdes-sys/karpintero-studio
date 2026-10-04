/* Núcleo de datos REAL compartido (localStorage) — ver karpintero_build.js */
(function (global) {
  const KEY = 'karpintero_db_v1';
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) {}
    return { proyectos: [], piezas: [], retales: [], activeProjectId: null };
  }
  function save(db) { db.updated_at = new Date().toISOString(); try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} }
  function uid(p) { return p + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function ensureSeed() {
    const db = load();
    if (db.proyectos.length === 0) {
      const p = { id: uid('prj'), codigo: 'PRJ-' + new Date().getFullYear() + '-01', nombre: 'Mi Primer Proyecto', cliente_nombre: '', estado: 'MEDICION', fase_actual: 1, firmado: false, fecha_creacion: new Date().toISOString() };
      db.proyectos.push(p); db.activeProjectId = p.id; save(db);
    } else if (!db.activeProjectId) { db.activeProjectId = db.proyectos[0].id; save(db); }
    if (!db.lecturas) { db.lecturas = []; save(db); }
    if (!db.ajustes) { db.ajustes = { kerf_mm: 4, margen_mm: 2 }; save(db); }
    return db;
  }
  const FASES = ['Replanteo Obra', 'Modelado Paramétrico', 'BOM & Despiece', 'Corte CNC & Nesting', 'Integración Eléctrica LED', 'Logística & Entrega'];
  global.KarpinteroDB = {
    FASES: FASES,
    listProjects() { return ensureSeed().proyectos; },
    getActiveProject() { const db = ensureSeed(); return db.proyectos.find((p) => p.id === db.activeProjectId) || null; },
    setActiveProject(id) { const db = load(); db.activeProjectId = id; save(db); },
    createProject({ nombre, cliente_nombre }) {
      const db = load();
      const codigo = 'PRJ-' + new Date().getFullYear() + '-' + String(db.proyectos.length + 1).padStart(2, '0');
      const p = { id: uid('prj'), codigo, nombre: nombre || 'Nuevo Proyecto', cliente_nombre: cliente_nombre || '', estado: 'MEDICION', fase_actual: 1, firmado: false, fecha_creacion: new Date().toISOString() };
      db.proyectos.push(p); db.activeProjectId = p.id; save(db); return p;
    },
    getFaseActual(proyectoId) {
      const db = ensureSeed(); const p = db.proyectos.find((x) => x.id === (proyectoId || db.activeProjectId));
      return p ? (p.fase_actual || 1) : 1;
    },
    avanzarFase(proyectoId) {
      const db = ensureSeed(); const p = db.proyectos.find((x) => x.id === (proyectoId || db.activeProjectId));
      if (!p) return 1;
      p.fase_actual = Math.min(6, (p.fase_actual || 1) + 1);
      if (p.fase_actual >= 6) p.estado = 'ENTREGADO';
      else if (p.fase_actual >= 4) p.estado = 'CORTE';
      save(db);
      return p.fase_actual;
    },
    firmarActa(proyectoId) {
      const db = ensureSeed(); const p = db.proyectos.find((x) => x.id === (proyectoId || db.activeProjectId));
      if (!p) return null;
      p.firmado = true; p.fecha_entrega = new Date().toISOString();
      save(db); return p;
    },
    getAjustes() { return ensureSeed().ajustes; },
    setAjustes(a) { const db = ensureSeed(); db.ajustes = Object.assign(db.ajustes, a); save(db); return db.ajustes; },
    addLectura(l) {
      const db = ensureSeed();
      const item = Object.assign({ id: uid('lec'), proyecto_id: db.activeProjectId, timestamp: new Date().toISOString() }, l);
      db.lecturas.push(item); save(db); return item;
    },
    listLecturas(proyectoId) {
      const db = ensureSeed(); const pid = proyectoId || db.activeProjectId;
      return db.lecturas.filter((l) => l.proyecto_id === pid);
    },
    marcarQrImpreso(id) { const db = load(); const pz = db.piezas.find((p) => p.id === id); if (pz) { pz.qr_impreso = true; save(db); } },
    exportBackup() { return JSON.stringify(ensureSeed(), null, 2); },
    importBackup(jsonStr) {
      const parsed = JSON.parse(jsonStr);
      save(parsed);
      return parsed;
    },
    getStorageInfo() {
      const db = ensureSeed();
      const raw = JSON.stringify(db);
      return { bytes: raw.length, lastSaved: db.updated_at || null, totalPiezas: db.piezas.length, totalProyectos: db.proyectos.length };
    },
    listPiezas(proyectoId, modulo) { const db = ensureSeed(); const pid = proyectoId || db.activeProjectId; return db.piezas.filter((pz) => pz.proyecto_id === pid && (!modulo || pz.modulo === modulo)); },
    addPieza(pieza) { const db = ensureSeed(); const pz = Object.assign({ id: uid('pz'), proyecto_id: db.activeProjectId, estado: 'PENDIENTE', qr_impreso: false, modulo: 'General' }, pieza); db.piezas.push(pz); save(db); return pz; },
    updatePiezaEstado(id, estado) { const db = load(); const pz = db.piezas.find((p) => p.id === id); if (pz) { pz.estado = estado; save(db); } },
    removePieza(id) { const db = load(); db.piezas = db.piezas.filter((p) => p.id !== id); save(db); },
    marcarTodasEnviadasAOptimizador(proyectoId) {
      const db = ensureSeed(); const pid = proyectoId || db.activeProjectId; let n = 0;
      db.piezas.forEach((pz) => { if (pz.proyecto_id === pid && pz.estado === 'PENDIENTE') { pz.estado = 'EN_OPTIMIZADOR'; n++; } });
      save(db); return n;
    },
    listRetales() { return ensureSeed().retales.filter((r) => r.disponible); },
    addRetal(retal) { const db = ensureSeed(); const r = Object.assign({ id: uid('rt'), codigo_qr: uid('QR').toUpperCase(), disponible: true }, retal); db.retales.push(r); save(db); return r; },
    useRetal(id) { const db = load(); const r = db.retales.find((x) => x.id === id); if (r) { r.disponible = false; save(db); } },
    setPresupuesto(data) { const db = ensureSeed(); const p = db.proyectos.find((x) => x.id === db.activeProjectId); if (p) { p.presupuesto = data; save(db); } return data; },
    getPresupuesto() { const p = this.getActiveProject(); return (p && p.presupuesto) || null; },
  };
})(window);
