/* ============================================
   NUTRIPRO - LÓGICA PRINCIPAL DE LA APLICACIÓN
   ============================================ */

// ============================================
// 1. CONFIGURACIÓN DE SUPABASE
// ============================================
const SUPABASE_URL = 'https://xsuqqesjetgzxtyqqqje.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzdXFxZXNqZXRnenh0eXFxcWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NTg5NjUsImV4cCI6MjEwMDEzNDk2NX0.OdQddq33d-dsz3fRpTp_xLs6bDJn2_fyFCKmENcs_t8';

let sb = null;
if (typeof supabase !== 'undefined') {
  sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { storage: sessionStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
  });
} else {
  console.error('Error crítico: La librería de Supabase no se ha cargado.');
}

// ============================================
// 2. VARIABLES GLOBALES DE ESTADO
// ============================================
let currentUser = null;
let userData = null;
let menuData = null;
let pesos = [];
let sustituciones = {};
let chartPeso = null;
let chartSemanal = null;
let currentSwap = null;
let filtroSoloTemporada = false;

let plannerWeekOffset = 0;
let plannerCurrentView = 'calendario';

let ADS_DB = { top: null, sidebar: null, inline: null, footer: null };

let USER_RATINGS = {};
let currentRecipeFoodId = null;

let USER_ACHIEVEMENTS = {};
let achievementStats = {
  evaluaciones: 0,
  listas_compra: 0,
  comentarios: 0,
  batch_cooking_visits: 0,
  dias_registro_peso: 0,
  dias_desde_evaluacion: 0,
  favoritos: 0,
  valoraciones: 0,
  sustituciones: 0,
  rachas_consecutivas: 0
};

const OFFLINE_QUEUE_KEY = 'nutripro_offline_queue';
let appIsOnline = true;

// ============================================
// 3. SISTEMA OFFLINE-FIRST
// ============================================
function getOfflineQueue() {
  try {
    const data = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) { localStorage.removeItem(OFFLINE_QUEUE_KEY); return []; }
    return parsed;
  } catch (e) { localStorage.removeItem(OFFLINE_QUEUE_KEY); return []; }
}

function addToOfflineQueue(action, data) {
  const queue = getOfflineQueue();
  queue.push({ action, data, timestamp: Date.now() });
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  mostrarToast(' Sin conexión. Guardado localmente.');
}

function clearOfflineQueue() { localStorage.removeItem(OFFLINE_QUEUE_KEY); }

async function checkRealConnection() {
  appIsOnline = true;
  updateOnlineStatusUI();
}

function updateOnlineStatusUI() {
  const statusEl = document.getElementById('connectionStatus');
  if (statusEl) {
    if (appIsOnline) { statusEl.classList.add('hidden'); statusEl.classList.remove('flex'); }
    else { statusEl.classList.remove('hidden'); statusEl.classList.add('flex'); }
  }
}

async function processOfflineQueue() {
  const queue = getOfflineQueue();
  if (queue.length === 0) return;
  mostrarToast(' Sincronizando datos pendientes...');
  let successCount = 0;
  const newQueue = [];
  for (const item of queue) {
    try {
      let success = false;
      if (item.action === 'add_weight' && currentUser) {
        const { error } = await sb.from('weight_logs').insert({ user_id: currentUser.id, fecha: item.data.fecha, valor: item.data.valor });
        if (!error) success = true;
      } else if (item.action === 'add_comment' && currentUser) {
        const { error } = await sb.from('comments').insert({ user_id: currentUser.id, user_name: item.data.anonimo ? 'Anónimo' : currentUser.nombre, texto: item.data.texto, is_anonymous: item.data.anonimo });
        if (!error) success = true;
      } else if (item.action === 'save_evaluation' && currentUser) {
        const { error } = await sb.from('user_data').upsert({ user_id: currentUser.id, ...item.data, updated_at: new Date() });
        if (!error) { userData = item.data; saveUserDataToLocal(userData); success = true; }
      } else if (item.action === 'update_profile' && currentUser) {
        const { error } = await sb.from('profiles').update({ nombre: item.data.nombre }).eq('id', currentUser.id);
        if (!error) { currentUser.nombre = item.data.nombre; updateUserUI(); success = true; }
      }
      if (success) { successCount++; } else { newQueue.push(item); }
    } catch (err) { newQueue.push(item); }
  }
  if (newQueue.length === 0) { clearOfflineQueue(); }
  else { localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(newQueue)); }
  if (successCount > 0) {
    mostrarToast(`✅ ${successCount} registro(s) sincronizado(s).`);
    if (userData) { actualizarDashboard(); generarMenu(); generarListaCompra(); generarEjercicio(); cargarDatosEnFormularioEvaluacion(); renderPlanificador(); }
    renderSeguimiento();
    renderComentarios();
  }
}

window.addEventListener('online', () => { appIsOnline = true; updateOnlineStatusUI(); checkRealConnection().then(() => { if (appIsOnline && currentUser) processOfflineQueue(); }); });
window.addEventListener('offline', () => { appIsOnline = false; mostrarToast('🔴 Sin conexión. Los datos se guardarán localmente.'); updateOnlineStatusUI(); });

function saveUserDataToLocal(data) { localStorage.setItem('nutripro_user_data', JSON.stringify(data)); }

// ============================================
// 4. SISTEMA DE TEMPORADA
// ============================================
function obtenerEstacion() {
  const mes = new Date().getMonth();
  if (mes >= 2 && mes <= 4) return 'primavera';
  if (mes >= 5 && mes <= 7) return 'verano';
  if (mes >= 8 && mes <= 10) return 'otono';
  return 'invierno';
}

function obtenerInfoEstacion(estacion) {
  const info = {
    primavera: { emoji: '', nombre: 'Primavera', meses: 'Marzo - Mayo' },
    verano: { emoji: '☀️', nombre: 'Verano', meses: 'Junio - Agosto' },
    otono: { emoji: '', nombre: 'Otoño', meses: 'Septiembre - Noviembre' },
    invierno: { emoji: '❄️', nombre: 'Invierno', meses: 'Diciembre - Febrero' }
  };
  return info[estacion] || info.primavera;
}

function esDeTemporada(alimento) {
  if (!alimento.temporada) return true;
  if (alimento.temporada === 'todo_el_año') return true;
  return alimento.temporada === obtenerEstacion();
}

function getBadgeTemporada(alimento) {
  if (!alimento.temporada || alimento.temporada === 'todo_el_año') {
    return '<span class="temporada-badge temporada-todo" title="Disponible todo el año"> Todo el año</span>';
  }
  const info = obtenerInfoEstacion(alimento.temporada);
  const estacionActual = obtenerEstacion();
  if (alimento.temporada === estacionActual) {
    return `<span class="temporada-badge temporada-actual" title="En temporada: ${info.meses}">${info.emoji} En temporada</span>`;
  }
  return `<span class="temporada-badge temporada-otra" title="Fuera de temporada: ${info.meses}">${info.emoji} ${info.nombre}</span>`;
}

function toggleFiltroTemporada() {
  filtroSoloTemporada = document.getElementById('soloTemporada').checked;
  mostrarToast(filtroSoloTemporada ? '🌱 Filtro de temporada activado' : '🌍 Mostrando todos los alimentos');
  if (menuData) { generarMenu(); renderPlanificador(); }
}

function actualizarBannerEstacion() {
  const estacion = obtenerEstacion();
  const info = obtenerInfoEstacion(estacion);
  document.getElementById('seasonEmoji').textContent = info.emoji;
  document.getElementById('seasonName').textContent = info.nombre;
}

// ============================================
// 5. SISTEMA DE VALORACIONES Y FAVORITOS
// ============================================
async function cargarValoracionesUsuario() {
  if (!currentUser) return;
  try {
    const { data, error } = await sb.from('user_ratings').select('*').eq('user_id', currentUser.id);
    if (error) { console.error('Error cargando valoraciones:', error); return; }
    USER_RATINGS = {};
    if (data) { data.forEach(r => { USER_RATINGS[r.food_id] = { rating: r.rating, is_favorite: r.is_favorite || false, is_excluded: r.is_excluded || false }; }); }
  } catch (err) { console.error('Error en cargarValoracionesUsuario:', err); }
}

async function guardarValoracion(foodId, updates) {
  if (!currentUser) return;
  try {
    const existing = USER_RATINGS[foodId] || {};
    const data = {
      user_id: currentUser.id, food_id: foodId,
      rating: updates.rating !== undefined ? updates.rating : existing.rating,
      is_favorite: updates.is_favorite !== undefined ? updates.is_favorite : (existing.is_favorite || false),
      is_excluded: updates.is_excluded !== undefined ? updates.is_excluded : (existing.is_excluded || false),
      updated_at: new Date()
    };
    const { error } = await sb.from('user_ratings').upsert(data, { onConflict: 'user_id,food_id' });
    if (error) { console.error('Error guardando valoración:', error); mostrarToast('❌ Error al guardar'); return false; }
    USER_RATINGS[foodId] = { rating: data.rating, is_favorite: data.is_favorite, is_excluded: data.is_excluded };
    return true;
  } catch (err) { console.error('Error en guardarValoracion:', err); return false; }
}

async function toggleFavorito(foodId, event) {
  if (event) { event.stopPropagation(); event.preventDefault(); }
  const current = USER_RATINGS[foodId] || {};
  const newFav = !current.is_favorite;
  const ok = await guardarValoracion(foodId, { is_favorite: newFav });
  if (ok) {
    mostrarToast(newFav ? '❤️ Añadido a favoritos' : ' Eliminado de favoritos');
    if (menuData) { renderMenu(); renderPlanificador(); }
    actualizarContadoresPerfil(); renderMisFavoritos(); renderMisExcluidos();
    verificarLogros();
  }
}

async function toggleExcluido(foodId, event) {
  if (event) { event.stopPropagation(); event.preventDefault(); }
  const current = USER_RATINGS[foodId] || {};
  const newExc = !current.is_excluded;
  const ok = await guardarValoracion(foodId, { is_excluded: newExc });
  if (ok) {
    mostrarToast(newExc ? '🚫 Alimento excluido del menú' : '✅ Alimento incluido de nuevo');
    if (menuData) { renderMenu(); renderPlanificador(); }
    actualizarContadoresPerfil(); renderMisFavoritos(); renderMisExcluidos();
    verificarLogros();
  }
}

async function guardarRatingEstrellas(rating) {
  if (!currentRecipeFoodId) return;
  const ok = await guardarValoracion(currentRecipeFoodId, { rating });
  if (ok) { mostrarToast(`⭐ Valoración guardada: ${rating}/5`); verificarLogros(); }
}

function renderStars(rating) {
  const stars = document.querySelectorAll('#starRating .star');
  stars.forEach((star, idx) => { star.classList.remove('filled', 'hovered'); if (idx < rating) star.classList.add('filled'); });
  const texts = ['Sin valorar', 'Malo ', 'Regular 😐', 'Bueno 🙂', 'Muy bueno 😊', 'Excelente '];
  document.getElementById('ratingText').textContent = texts[rating] || 'Sin valorar';
}

function initStarRating() {
  const container = document.getElementById('starRating');
  const stars = container.querySelectorAll('.star');
  stars.forEach(star => {
    star.addEventListener('mouseenter', () => { const val = parseInt(star.dataset.value); stars.forEach((s, idx) => { s.classList.toggle('hovered', idx < val); }); });
    star.addEventListener('mouseleave', () => { stars.forEach(s => s.classList.remove('hovered')); });
    star.addEventListener('click', async () => { const rating = parseInt(star.dataset.value); renderStars(rating); await guardarRatingEstrellas(rating); });
  });
}

function renderMisFavoritos() {
  const cont = document.getElementById('listaFavoritos');
  const favoritos = Object.entries(USER_RATINGS).filter(([_, r]) => r.is_favorite);
  if (favoritos.length === 0) { cont.innerHTML = '<p class="text-slate-500 dark:text-slate-400 text-sm text-center py-8">Aún no tienes favoritos. Marca alimentos con ❤️ en el menú.</p>'; return; }
  cont.innerHTML = favoritos.map(([foodId, r]) => {
    const food = ALIMENTOS_DB[foodId]; if (!food) return '';
    const starsHtml = r.rating ? '⭐'.repeat(r.rating) + '☆'.repeat(5 - r.rating) : 'Sin valorar';
    return `<div class="food-card-mini"><div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-lg">❤️</div><div class="flex-1 min-w-0"><div class="font-semibold text-slate-800 dark:text-white text-sm truncate">${DOMPurify.sanitize(food.nombre)}</div><div class="flex items-center gap-2 mt-1"><span class="text-xs text-amber-600">${starsHtml}</span><span class="macro-chip bg-slate-100 dark:bg-slate-700 text-xs">🔥 ${food.kcal} kcal</span></div></div><button onclick="toggleFavorito('${foodId}')" class="admin-btn admin-btn-danger" title="Quitar de favoritos">🗑️</button></div>`;
  }).join('');
}

function renderMisExcluidos() {
  const cont = document.getElementById('listaExcluidos');
  const excluidos = Object.entries(USER_RATINGS).filter(([_, r]) => r.is_excluded);
  if (excluidos.length === 0) { cont.innerHTML = '<p class="text-slate-500 dark:text-slate-400 text-sm text-center py-8">No has excluido ningún alimento.</p>'; return; }
  cont.innerHTML = excluidos.map(([foodId, r]) => {
    const food = ALIMENTOS_DB[foodId]; if (!food) return '';
    return `<div class="food-card-mini" style="opacity: 0.7;"><div class="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-lg">🚫</div><div class="flex-1 min-w-0"><div class="font-semibold text-slate-800 dark:text-white text-sm truncate">${DOMPurify.sanitize(food.nombre)}</div><div class="text-xs text-slate-500 dark:text-slate-400 mt-1">No aparecerá en tus menús</div></div><button onclick="toggleExcluido('${foodId}')" class="admin-btn admin-btn-success" title="Incluir de nuevo">✅</button></div>`;
  }).join('');
}

function actualizarContadoresPerfil() {
  const favs = Object.values(USER_RATINGS).filter(r => r.is_favorite).length;
  const excs = Object.values(USER_RATINGS).filter(r => r.is_excluded).length;
  document.getElementById('favCount').textContent = favs;
  document.getElementById('excCount').textContent = excs;
}

// ============================================
// 6. SISTEMA DE LOGROS (FASE 3)
// ============================================
async function cargarLogrosUsuario() {
  if (!currentUser) return;
  try {
    const { data, error } = await sb.from('user_achievements').select('*').eq('user_id', currentUser.id);
    if (error) { console.error('Error cargando logros usuario:', error); return; }
    USER_ACHIEVEMENTS = {};
    if (data) { data.forEach(ua => { USER_ACHIEVEMENTS[ua.achievement_id] = ua; }); }
  } catch (err) { console.error('Error en cargarLogrosUsuario:', err); }
}

async function desbloquearLogro(achievementId) {
  if (!currentUser || USER_ACHIEVEMENTS[achievementId]) return;
  const achievement = LOGROS_DB.find(l => l.id === achievementId);
  if (!achievement) return;
  try {
    const { error } = await sb.from('user_achievements').insert({ user_id: currentUser.id, achievement_id: achievementId });
    if (error) { console.error('Error desbloqueando logro:', error); return; }
    USER_ACHIEVEMENTS[achievementId] = { unlocked_at: new Date() };
    mostrarModalLogroDesbloqueado(achievement);
    renderLogros();
  } catch (err) { console.error('Error en desbloquearLogro:', err); }
}

function mostrarModalLogroDesbloqueado(achievement) {
  const overlay = document.createElement('div');
  overlay.className = 'achievement-overlay';
  overlay.onclick = () => { overlay.remove(); document.getElementById('achievementUnlockModal')?.remove(); };
  const modal = document.createElement('div');
  modal.id = 'achievementUnlockModal';
  modal.className = 'achievement-unlock-modal';
  modal.innerHTML = `<span class="achievement-unlock-icon">${achievement.icono}</span><div class="achievement-unlock-title">¡Logro Desbloqueado!</div><div class="achievement-unlock-desc">${achievement.nombre}</div><div class="text-xs mt-2 opacity-75">${achievement.descripcion}</div>`;
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  setTimeout(() => { overlay.onclick(); }, 3000);
}

async function calcularEstadisticasLogros() {
  if (!currentUser) return;
  try {
    const { count: countEvaluaciones } = await sb.from('user_data').select('*', { count: 'exact', head: true }).eq('user_id', currentUser.id);
    achievementStats.evaluaciones = countEvaluaciones || 0;
    if (userData && userData.updated_at) { achievementStats.dias_desde_evaluacion = Math.floor((Date.now() - new Date(userData.updated_at).getTime()) / (1000 * 60 * 60 * 24)); }
    achievementStats.dias_registro_peso = pesos.length;
    if (pesos.length > 0) {
      const fechasOrdenadas = [...pesos].map(p => new Date(p.fecha)).sort((a, b) => b - a);
      let racha = 1;
      for (let i = 0; i < fechasOrdenadas.length - 1; i++) { if ((fechasOrdenadas[i] - fechasOrdenadas[i + 1]) / (1000 * 60 * 60 * 24) === 1) racha++; else break; }
      achievementStats.rachas_consecutivas = racha;
    }
    achievementStats.favoritos = Object.values(USER_RATINGS).filter(r => r.is_favorite).length;
    achievementStats.valoraciones = Object.values(USER_RATINGS).filter(r => r.rating).length;
    achievementStats.sustituciones = Object.keys(sustituciones).length;
    const { count: countComentarios } = await sb.from('comments').select('*', { count: 'exact', head: true }).eq('user_id', currentUser.id);
    achievementStats.comentarios = countComentarios || 0;
  } catch (err) { console.error('Error calculando estadísticas:', err); }
}

async function verificarLogros() {
  await calcularEstadisticasLogros();
  if (achievementStats.evaluaciones >= 1) await desbloquearLogro('primera_evaluacion');
  if (achievementStats.listas_compra >= 1) await desbloquearLogro('primera_lista_compra');
  if (achievementStats.comentarios >= 1) await desbloquearLogro('primer_comentario');
  if (achievementStats.batch_cooking_visits >= 1) await desbloquearLogro('primer_batch_cooking');
  if (achievementStats.dias_registro_peso >= 7) await desbloquearLogro('primera_semana');
  if (achievementStats.dias_desde_evaluacion >= 30) await desbloquearLogro('un_mes');
  if (achievementStats.dias_desde_evaluacion >= 90) await desbloquearLogro('tres_meses');
  if (achievementStats.favoritos >= 10) await desbloquearLogro('diez_favoritos');
  if (achievementStats.valoraciones >= 50) await desbloquearLogro('cincuenta_valoraciones');
  if (achievementStats.sustituciones >= 25) await desbloquearLogro('veinticinco_sustituciones');
  if (achievementStats.rachas_consecutivas >= 7) await desbloquearLogro('siete_dias_consecutivos');
  if (achievementStats.rachas_consecutivas >= 30) await desbloquearLogro('treinta_dias_consecutivos');
}

function renderLogros() {
  const grid = document.getElementById('achievementsGrid');
  if (!grid) return;
  const logrosArray = LOGROS_DB;
  const desbloqueados = Object.keys(USER_ACHIEVEMENTS).length;
  const total = logrosArray.length;
  const progreso = total > 0 ? Math.round((desbloqueados / total) * 100) : 0;
  document.getElementById('statLogrosDesbloqueados').textContent = desbloqueados;
  document.getElementById('statLogrosTotales').textContent = total;
  document.getElementById('statProgresoGeneral').textContent = progreso + '%';
  document.getElementById('logrosCount').textContent = desbloqueados;
  if (logrosArray.length === 0) { grid.innerHTML = '<p class="text-slate-500 dark:text-slate-400 text-sm text-center py-8 col-span-full">Cargando logros...</p>'; return; }
  const categorias = {};
  logrosArray.forEach(a => { if (!categorias[a.categoria]) categorias[a.categoria] = []; categorias[a.categoria].push(a); });
  let html = '';
  Object.keys(categorias).forEach(cat => {
    html += `<div class="col-span-full mt-4 mb-2"><h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">${cat}</h4></div>`;
    categorias[cat].forEach(a => {
      const desbloqueado = USER_ACHIEVEMENTS[a.id] !== undefined;
      const statKey = a.id === 'primera_semana' ? 'dias_registro_peso' : a.id === 'diez_favoritos' ? 'favoritos' : a.id === 'cincuenta_valoraciones' ? 'valoraciones' : a.id === 'veinticinco_sustituciones' ? 'sustituciones' : (a.id === 'siete_dias_consecutivos' || a.id === 'treinta_dias_consecutivos') ? 'rachas_consecutivas' : (a.id === 'un_mes' || a.id === 'tres_meses') ? 'dias_desde_evaluacion' : a.id === 'primer_comentario' ? 'comentarios' : 0;
      const progresoActual = Math.min(achievementStats[statKey] || 0, a.requisito);
      const progresoPct = Math.min(100, Math.round((progresoActual / a.requisito) * 100));
      html += `<div class="achievement-card ${desbloqueado ? 'unlocked' : 'locked'}"><span class="achievement-icon">${a.icono}</span><div class="achievement-name">${a.nombre}</div><div class="achievement-desc">${a.descripcion}</div><span class="achievement-category">${a.categoria}</span>${!desbloqueado ? `<div class="achievement-progress"><div>${progresoActual} / ${a.requisito}</div><div class="achievement-progress-bar"><div class="achievement-progress-fill" style="width: ${progresoPct}%"></div></div></div>` : '<div class="text-xs text-amber-600 mt-2 font-semibold">✅ Desbloqueado</div>'}</div>`;
    });
  });
  grid.innerHTML = html;
}

// ============================================
// 7. AUTENTICACIÓN
// ============================================
async function checkAuth() {
  if (!sb) { console.error('Supabase no inicializado.'); return; }
  try {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { showAuthScreen(); return; }
    const { data: profile, error } = await sb.from('profiles').select('*').eq('id', session.user.id).single();
    if (error || !profile) {
      const nombre = session.user.user_metadata?.nombre || session.user.email.split('@')[0];
      const { error: insertError } = await sb.from('profiles').insert({ id: session.user.id, nombre: nombre, rol: 'user', bloqueado: false });
      if (insertError) { await sb.auth.signOut(); showAuthScreen(); alert('️ Error al inicializar tu cuenta.'); return; }
      location.reload();
      return;
    }
    if (profile.bloqueado) { showBlockedScreen('Tu cuenta ha sido bloqueada.'); return; }
    currentUser = { id: session.user.id, email: session.user.email, nombre: profile.nombre, rol: profile.rol };
    showMainApp();
    await cargarValoracionesUsuario();
    await cargarLogrosUsuario();
    await loadUserDataFromDB();
    actualizarBannerEstacion();
    actualizarContadoresPerfil();
    initDarkMode();
    await checkRealConnection();
    if (appIsOnline) { await processOfflineQueue(); }
    await verificarLogros();
  } catch (err) { console.error('Error en checkAuth:', err); }
}

function showAuthScreen() {
  document.getElementById('authScreen').classList.remove('hidden');
  document.getElementById('blockedScreen').classList.add('hidden');
  document.getElementById('mainApp').classList.add('hidden');
}

function showBlockedScreen(msg) {
  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('blockedScreen').classList.remove('hidden');
  document.getElementById('mainApp').classList.add('hidden');
  document.getElementById('blockedMsg').textContent = msg;
}

function showMainApp() {
  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('blockedScreen').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');
  updateUserUI();
}

function updateUserUI() {
  if (!currentUser) return;
  document.getElementById('userName').textContent = currentUser.nombre.split(' ')[0];
  document.getElementById('userAvatar').textContent = currentUser.nombre.charAt(0).toUpperCase();
  document.getElementById('dropdownName').textContent = currentUser.nombre;
  document.getElementById('dropdownEmail').textContent = currentUser.email;
  const roleEl = document.getElementById('dropdownRole');
  if (currentUser.rol === 'admin') {
    roleEl.innerHTML = '<span class="status-badge bg-purple-100 text-purple-700">️ Administrador</span>';
    document.getElementById('adminMenuItem').classList.remove('hidden');
  } else {
    roleEl.innerHTML = '<span class="status-badge bg-teal-100 text-teal-700">✓ Usuario</span>';
    document.getElementById('adminMenuItem').classList.add('hidden');
  }
  document.getElementById('perfilNombre').value = currentUser.nombre;
  document.getElementById('perfilEmail').value = currentUser.email;
}

async function cerrarSesion() {
  try { await sb.auth.signOut(); currentUser = null; document.getElementById('userDropdown').classList.remove('show'); showAuthScreen(); }
  catch (err) { mostrarToast('⚠️ Error al cerrar sesión.'); }
}

document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPassword').value;
  const err = document.getElementById('loginError');
  try {
    const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });
    if (error) { err.textContent = ' ' + error.message; err.classList.remove('hidden'); }
    else { location.reload(); }
  } catch (errCatch) { err.textContent = ' Error de conexión.'; err.classList.remove('hidden'); }
});

document.getElementById('formRegister').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPassword').value;
  const pass2 = document.getElementById('regPassword2').value;
  const terms = document.getElementById('regTerms').checked;
  const err = document.getElementById('regError');
  const btn = e.target.querySelector('button[type="submit"]');
  err.classList.add('hidden');
  if (!nombre) { err.textContent = '❌ El nombre es obligatorio'; err.classList.remove('hidden'); return; }
  if (!terms) { err.textContent = '❌ Debes aceptar los términos'; err.classList.remove('hidden'); return; }
  if (pass !== pass2) { err.textContent = '❌ Las contraseñas no coinciden'; err.classList.remove('hidden'); return; }
  if (pass.length < 6) { err.textContent = '❌ Mínimo 6 caracteres'; err.classList.remove('hidden'); return; }
  const originalBtnText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Creando cuenta...';
  try {
    const { data, error } = await sb.auth.signUp({ email, password: pass, options: { data: { nombre } } });
    if (error) { err.textContent = '❌ ' + error.message; err.classList.remove('hidden'); }
    else {
      if (data.session) { mostrarToast('✅ Cuenta creada.'); setTimeout(() => location.reload(), 1000); }
      else { alert('✅ Revisa tu email para confirmar la cuenta.'); document.querySelector('.auth-tab[data-auth="login"]').click(); }
    }
  } catch (errCatch) { err.textContent = '❌ Error inesperado.'; err.classList.remove('hidden'); }
  finally { btn.disabled = false; btn.textContent = originalBtnText; }
});

document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    if (tab.dataset.auth === 'login') { document.getElementById('formLogin').classList.remove('hidden'); document.getElementById('formRegister').classList.add('hidden'); }
    else { document.getElementById('formLogin').classList.add('hidden'); document.getElementById('formRegister').classList.remove('hidden'); }
  });
});

async function loadUserDataFromDB() {
  try {
    const { data: uData } = await sb.from('user_data').select('*').eq('user_id', currentUser.id).single();
    if (uData) {
      userData = uData;
      saveUserDataToLocal(userData);
      actualizarDashboard();
      generarMenu();
      generarListaCompra();
      generarEjercicio();
      cargarDatosEnFormularioEvaluacion();
      renderPlanificador();
    }
    const { data: wData } = await sb.from('weight_logs').select('*').eq('user_id', currentUser.id).order('fecha', { ascending: true });
    if (wData) { pesos = wData.map(w => ({ fecha: w.fecha, valor: w.valor })); renderSeguimiento(); }
    await renderComentarios();
  } catch (err) { console.error('Error cargando datos:', err); }
}

document.getElementById('formEvaluacion').addEventListener('submit', async (e) => {
  e.preventDefault();
  const edad = parseInt(document.getElementById('edad').value);
  const sexo = document.getElementById('sexo').value;
  const peso = parseFloat(document.getElementById('peso').value);
  const altura = parseFloat(document.getElementById('altura').value);
  const factor = parseFloat(document.getElementById('actividad').value);
  const objetivo = document.getElementById('objetivo').value;
  const prefs = Array.from(document.querySelectorAll('.pref:checked')).map(c => c.value);
  const tmb = calcularTMB(peso, altura, edad, sexo);
  const getd = calcularGETD(tmb, factor);
  const imc = calcularIMC(peso, altura);
  let deficit = 0;
  if (objetivo === 'perder') deficit = 500;
  else if (objetivo === 'perderSuave') deficit = 300;
  else if (objetivo === 'ganar') deficit = -300;
  if (deficit > 750) deficit = 750;
  const caloriasObjetivo = Math.round(getd - deficit);
  const protG = Math.round(peso * 1.8);
  const grasasG = Math.max(Math.round(peso * 0.9), 50);
  const carbKcal = caloriasObjetivo - (protG * 4) - (grasasG * 9);
  const carbG = Math.round(carbKcal / 4);
  const newUserData = { edad, sexo, peso, altura, factor, objetivo, prefs, tmb: Math.round(tmb), getd: Math.round(getd), imc: imc.toFixed(1), deficit, caloriasObjetivo, protG, grasasG, carbG };
  if (!appIsOnline) {
    addToOfflineQueue('save_evaluation', newUserData);
    userData = newUserData;
    saveUserDataToLocal(userData);
    actualizarDashboard(); generarMenu(); generarListaCompra(); generarEjercicio(); cargarDatosEnFormularioEvaluacion(); renderPlanificador();
    switchTab('dashboard');
    return;
  }
  try {
    const { error } = await sb.from('user_data').upsert({ user_id: currentUser.id, ...newUserData, updated_at: new Date() });
    if (error) { addToOfflineQueue('save_evaluation', newUserData); }
    else {
      userData = newUserData;
      saveUserDataToLocal(userData);
      actualizarDashboard(); generarMenu(); generarListaCompra(); generarEjercicio(); cargarDatosEnFormularioEvaluacion(); renderPlanificador();
      switchTab('dashboard');
      mostrarToast('✅ Evaluación guardada');
      achievementStats.evaluaciones++;
      verificarLogros();
    }
  } catch (err) { addToOfflineQueue('save_evaluation', newUserData); }
});

function cargarDatosEnFormularioEvaluacion() {
  if (!userData) return;
  document.getElementById('edad').value = userData.edad || 30;
  document.getElementById('sexo').value = userData.sexo || 'hombre';
  document.getElementById('peso').value = userData.peso || 75;
  document.getElementById('altura').value = userData.altura || 175;
  document.getElementById('actividad').value = userData.factor || 1.375;
  document.getElementById('objetivo').value = userData.objetivo || 'perder';
  document.querySelectorAll('.pref').forEach(cb => { cb.checked = userData.prefs && userData.prefs.includes(cb.value); });
  document.getElementById('evaluacionStatus').classList.remove('hidden');
}

function mostrarFormularioEvaluacion() { document.getElementById('formEvaluacion').scrollIntoView({ behavior: 'smooth' }); }

function initDarkMode() {
  const toggle = document.getElementById('darkModeToggle');
  const icon = document.getElementById('darkModeIcon');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('nutripro-theme');
  if (!savedTheme || savedTheme === 'dark') { html.classList.add('dark'); icon.textContent = '☀️'; localStorage.setItem('nutripro-theme', 'dark'); }
  else { html.classList.remove('dark'); icon.textContent = ''; }
  toggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    icon.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('nutripro-theme', isDark ? 'dark' : 'light');
    if (chartPeso) renderChartPeso();
    if (chartSemanal) renderAnalisis();
  });
}

// ============================================
// 8. DASHBOARD Y MÉTRICAS
// ============================================
function calcularTMB(peso, altura, edad, sexo) {
  if (sexo === 'hombre') return 10 * peso + 6.25 * altura - 5 * edad + 5;
  return 10 * peso + 6.25 * altura - 5 * edad - 161;
}

function calcularGETD(tmb, factor) { return tmb * factor; }

function calcularIMC(peso, alturaCm) { return peso / Math.pow(alturaCm / 100, 2); }

function categoriaIMC(imc) {
  if (imc < 18.5) return { texto: 'Bajo peso', color: 'text-blue-600' };
  if (imc < 25) return { texto: 'Normopeso', color: 'text-green-600' };
  if (imc < 30) return { texto: 'Sobrepeso', color: 'text-amber-600' };
  return { texto: 'Obesidad', color: 'text-red-600' };
}

function actualizarDashboard() {
  if (!userData) return;
  document.getElementById('dashboardNoData').classList.add('hidden');
  document.getElementById('dashboardContent').classList.remove('hidden');
  document.getElementById('metricTMB').textContent = userData.tmb;
  document.getElementById('metricGETD').textContent = userData.getd;
  document.getElementById('metricObjetivo').textContent = userData.caloriasObjetivo;
  document.getElementById('metricDeficit').textContent = userData.deficit > 0 ? `Déficit: ${userData.deficit} kcal` : (userData.deficit < 0 ? `Superávit: ${Math.abs(userData.deficit)} kcal` : 'Mantenimiento');
  document.getElementById('metricIMC').textContent = userData.imc;
  const catIMC = categoriaIMC(parseFloat(userData.imc));
  document.getElementById('metricIMCCat').textContent = catIMC.texto;
  document.getElementById('metricIMCCat').className = `text-xs font-semibold mt-1 ${catIMC.color}`;
  const alturaM = userData.altura / 100;
  const imcActual = parseFloat(userData.imc);
  const MARGEN_KG = 1.5;
  let imcReferencia;
  if (imcActual < 18.5) imcReferencia = 18.5;
  else if (imcActual > 24.9) imcReferencia = 24.5;
  else imcReferencia = imcActual;
  const pesoReferencia = imcReferencia * alturaM * alturaM;
  const pesoMin = (pesoReferencia - MARGEN_KG).toFixed(1);
  const pesoMax = (pesoReferencia + MARGEN_KG).toFixed(1);
  document.getElementById('metricPesoIdeal').textContent = `${pesoMin} – ${pesoMax} kg`;
  let detalleTexto = '';
  if (imcActual < 18.5) detalleTexto = `Objetivo: alcanzar IMC saludable (18.5)`;
  else if (imcActual > 24.9) detalleTexto = `Objetivo: alcanzar IMC 24.5`;
  else detalleTexto = `Basado en tu IMC actual (${imcActual})`;
  document.getElementById('metricPesoIdealDetalle').textContent = detalleTexto;
  const totalKcal = userData.protG * 4 + userData.grasasG * 9 + userData.carbG * 4;
  const pctProt = Math.round((userData.protG * 4 / totalKcal) * 100);
  const pctCarb = Math.round((userData.carbG * 4 / totalKcal) * 100);
  const pctGrasas = 100 - pctProt - pctCarb;
  document.getElementById('macroProt').textContent = `${userData.protG}g (${pctProt}%)`;
  document.getElementById('macroCarb').textContent = `${userData.carbG}g (${pctCarb}%)`;
  document.getElementById('macroGrasas').textContent = `${userData.grasasG}g (${pctGrasas}%)`;
  document.getElementById('barProt').style.width = pctProt + '%';
  document.getElementById('barCarb').style.width = pctCarb + '%';
  document.getElementById('barGrasas').style.width = pctGrasas + '%';
}

// ============================================
// 9. GENERACIÓN DE MENÚS
// ============================================
function getGrupoById(id) {
  const a = ALIMENTOS_DB[id];
  if (!a) return [];
  return Object.values(ALIMENTOS_DB).filter(f => f.grupo === a.grupo && f.active);
}

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function filtrarPorTemporada(arr) {
  if (!filtroSoloTemporada) return arr;
  const enTemporada = arr.filter(a => esDeTemporada(a));
  return enTemporada.length > 0 ? enTemporada : arr;
}

function excluirNoMeGusta(arr) { return arr.filter(a => !USER_RATINGS[a.id]?.is_excluded); }

function pickRandomConFavoritos(arr) {
  if (arr.length === 0) return null;
  const favoritos = arr.filter(a => USER_RATINGS[a.id]?.is_favorite);
  if (favoritos.length > 0 && Math.random() < 0.7) return pickRandom(favoritos);
  return pickRandom(arr);
}

function generarMenu() {
  if (!userData) return;
  const grupos = {
    prot: excluirNoMeGusta(Object.values(ALIMENTOS_DB).filter(f => f.grupo === 'prot' && f.active)),
    carb: excluirNoMeGusta(Object.values(ALIMENTOS_DB).filter(f => f.grupo === 'carb' && f.active)),
    verd: excluirNoMeGusta(Object.values(ALIMENTOS_DB).filter(f => f.grupo === 'verd' && f.active)),
    grasa: excluirNoMeGusta(Object.values(ALIMENTOS_DB).filter(f => f.grupo === 'grasa' && f.active)),
    des: excluirNoMeGusta(Object.values(ALIMENTOS_DB).filter(f => f.grupo === 'des' && f.active)),
    mer: excluirNoMeGusta(Object.values(ALIMENTOS_DB).filter(f => f.grupo === 'mer' && f.active))
  };
  if (Object.values(grupos).some(g => g.length === 0)) {
    document.getElementById('menuNoData').classList.remove('hidden');
    document.getElementById('menuContent').classList.add('hidden');
    document.getElementById('weekIndicator').classList.add('hidden');
    return;
  }
  const protPescadoAzul = grupos.prot.filter(p => /sardina|caballa|atún|boquerón/i.test(p.nombre));
  const protPescadoBlanco = grupos.prot.filter(p => /merluza|bacalao|dorada|lubina|sepia|pulpo/i.test(p.nombre));
  const protMarisco = grupos.prot.filter(p => /gamba|mejillón|almeja/i.test(p.nombre));
  const protLegumbres = grupos.prot.filter(p => /garbanzo|lenteja|alubia/i.test(p.nombre));
  const protCarneBlanca = grupos.prot.filter(p => /pollo|pavo|conejo/i.test(p.nombre));
  const protCarneRoja = grupos.prot.filter(p => /ternera|solomillo/i.test(p.nombre));
  const protHuevo = grupos.prot.filter(p => /huevo|tortilla|queso fresco/i.test(p.nombre));
  const fallback = grupos.prot;
  const getProts = (arr) => arr.length > 0 ? arr : fallback;
  const planSemanal = [
    { dia: 'Lunes', protComida: getProts(protLegumbres), protCena: getProts(protHuevo) },
    { dia: 'Martes', protComida: getProts(protPescadoAzul), protCena: getProts(protHuevo) },
    { dia: 'Miércoles', protComida: getProts(protCarneBlanca), protCena: getProts(protPescadoBlanco) },
    { dia: 'Jueves', protComida: getProts(protLegumbres), protCena: getProts(protHuevo) },
    { dia: 'Viernes', protComida: getProts(protPescadoBlanco), protCena: getProts(protMarisco.length > 0 ? protMarisco : protPescadoBlanco) },
    { dia: 'Sábado', protComida: getProts(protCarneBlanca), protCena: getProts(protPescadoAzul) },
    { dia: 'Domingo', protComida: getProts(protCarneRoja.length > 0 ? protCarneRoja : protCarneBlanca), protCena: getProts(protHuevo) }
  ];
  document.getElementById('menuNoData').classList.add('hidden');
  document.getElementById('menuContent').classList.remove('hidden');
  document.getElementById('weekIndicator').classList.remove('hidden');
  const now = new Date();
  const dayOfMonth = now.getDate();
  const menuIndex = Math.floor((dayOfMonth - 1) / 7);
  document.getElementById('weekText').textContent = `Semana ${menuIndex + 1} de 4`;
  const menus = [];
  for (let m = 0; m < 4; m++) {
    const menu = [];
    planSemanal.forEach((plan, diaIdx) => {
      const protComida = pickRandomConFavoritos(plan.protComida);
      const protCena = pickRandomConFavoritos(plan.protCena.filter(p => p.id !== protComida.id) || plan.protCena);
      const carbOpciones = grupos.carb.filter(c => !/gazpacho|salmorejo|escalivada/i.test(c.nombre));
      const comidaCarb = pickRandomConFavoritos(carbOpciones);
      const verdurasDisponibles = filtrarPorTemporada(grupos.verd);
      const verdComida = pickRandomConFavoritos(verdurasDisponibles);
      const verdCena = pickRandomConFavoritos(verdurasDisponibles.filter(v => v.id !== verdComida.id) || verdurasDisponibles);
      const comidaGrasa = pickRandomConFavoritos(grupos.grasa);
      const desayuno = pickRandomConFavoritos(grupos.des);
      const merienda = pickRandomConFavoritos(grupos.mer);
      menu.push({
        dia: plan.dia,
        desayuno: { ...desayuno },
        comida: { prot: { ...protComida }, carb: { ...comidaCarb }, verdura: { ...verdComida }, grasa: { ...comidaGrasa } },
        merienda: { ...merienda },
        cena: { prot: { ...protCena }, verdura: { ...verdCena } }
      });
    });
    menus.push(menu);
  }
  menuData = { menu: menus[menuIndex], menuIndex, allMenus: menus };
  aplicarSustitucionesGuardadas();
  renderMenu();
  renderListaCompra();
}

function aplicarSustitucionesGuardadas() {
  if (!menuData) return;
  Object.keys(sustituciones).forEach(key => {
    const [diaIdx, path] = key.split('|');
    const nuevo = ALIMENTOS_DB[sustituciones[key]];
    if (!nuevo) return;
    const dia = menuData.menu[parseInt(diaIdx)];
    if (!dia) return;
    const partes = path.split('.');
    let obj = dia;
    for (let i = 0; i < partes.length - 1; i++) obj = obj[partes[i]];
    obj[partes[partes.length - 1]] = { ...nuevo };
  });
}

function calcularKcalDia(dia) {
  return Math.round(dia.desayuno.kcal + dia.comida.prot.kcal + dia.comida.carb.kcal + dia.comida.verdura.kcal + dia.comida.grasa.kcal + dia.merienda.kcal + dia.cena.prot.kcal + dia.cena.verdura.kcal);
}

function regenerarMenu() { sustituciones = {}; generarMenu(); }
function resetSustituciones() { if (!confirm('¿Restaurar menú original?')) return; sustituciones = {}; generarMenu(); }

function renderMenu() {
  const cont = document.getElementById('menuContent');
  cont.innerHTML = '';
  menuData.menu.forEach((dia, diaIdx) => {
    const kcalTotales = calcularKcalDia(dia);
    const card = document.createElement('div');
    card.className = 'meal-card rounded-2xl p-5 shadow-sm';
    const foodItemHTML = (item, path, label, color, emoji) => {
      const key = `${diaIdx}|${path}`;
      const isSub = sustituciones[key] !== undefined;
      const rating = USER_RATINGS[item.id];
      const isFav = rating?.is_favorite || false;
      const isExc = rating?.is_excluded || false;
      const badgeTemporada = getBadgeTemporada(item);
      const ratingStars = rating?.rating ? '⭐'.repeat(rating.rating) : '';
      return `<div class="food-item p-3 ${color} rounded-lg ${isSub ? 'substituted' : ''} ${isFav ? 'is-favorite' : ''} ${isExc ? 'is-excluded' : ''}" onclick="abrirModalSustitucion(${diaIdx}, '${path}', '${item.id}')"><div class="flex justify-between items-start gap-2"><div class="flex-1 min-w-0"><div class="text-xs font-bold uppercase tracking-wide mb-1" style="opacity: 0.8">${emoji} ${label}</div><div class="text-slate-700 dark:text-slate-300 text-sm font-medium">${item.nombre}</div><div class="flex gap-1 mt-1.5 flex-wrap flex-wrap">${badgeTemporada}${ratingStars ? `<span class="macro-chip bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">${ratingStars}</span>` : ''}<span class="macro-chip bg-white/70 dark:bg-slate-700">🔥 ${item.kcal} kcal</span>${item.prot ? `<span class="macro-chip bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300">P ${item.prot}g</span>` : ''}</div></div><div class="flex flex-col gap-1"><button class="recipe-btn w-7 h-7 bg-teal-600 hover:bg-teal-700 text-white rounded-full flex items-center justify-center text-xs" onclick="event.stopPropagation(); abrirModalReceta('${item.id}')" title="Ver receta">👨‍</button><button class="fav-btn w-7 h-7 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-sm border border-slate-200 dark:border-slate-600 ${isFav ? 'fav-icon-active' : ''}" onclick="toggleFavorito('${item.id}', event)" title="${isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}">${isFav ? '❤️' : '🤍'}</button><button class="exclude-btn w-7 h-7 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-sm border border-slate-200 dark:border-slate-600 ${isExc ? 'exclude-icon-active' : ''}" onclick="toggleExcluido('${item.id}', event)" title="${isExc ? 'Incluir en menú' : 'Excluir del menú'}">${isExc ? '🚫' : ''}</button></div></div>${isSub ? `<div class="text-xs text-amber-700 dark:text-amber-400 mt-2 font-semibold">✓ Sustituido</div>` : ''}${isFav ? `<div class="text-xs text-red-600 dark:text-red-400 mt-1 font-semibold">❤️ Favorito</div>` : ''}${isExc ? `<div class="text-xs text-slate-500 mt-1 font-semibold"> Excluido</div>` : ''}</div>`;
    };
    card.innerHTML = `<div class="flex justify-between items-start mb-4 pb-3 border-b border-slate-100 dark:border-slate-700"><div><div class="text-xs font-bold text-teal-600 uppercase">${dia.dia}</div><div class="text-lg font-bold text-slate-800 dark:text-white">Menú completo</div></div><div class="text-right"><div class="text-xs text-slate-500">Total</div><div class="text-lg font-bold text-teal-600">${kcalTotales} kcal</div></div></div><div class="space-y-2">${foodItemHTML(dia.desayuno, 'desayuno', 'Desayuno', 'bg-amber-50 dark:bg-amber-900/20', '☀️')}${foodItemHTML(dia.comida.prot, 'comida.prot', 'Comida · Proteína', 'bg-orange-50 dark:bg-orange-900/20', '🥩')}${foodItemHTML(dia.comida.carb, 'comida.carb', 'Comida · Carbohidrato', 'bg-yellow-50 dark:bg-yellow-900/20', '🍚')}${foodItemHTML(dia.comida.verdura, 'comida.verdura', 'Comida · Verdura', 'bg-green-50 dark:bg-green-900/20', '🥦')}${foodItemHTML(dia.comida.grasa, 'comida.grasa', 'Comida · Grasa', 'bg-emerald-50 dark:bg-emerald-900/20', '🥑')}${foodItemHTML(dia.merienda, 'merienda', 'Merienda', 'bg-pink-50 dark:bg-pink-900/20', '🍎')}${foodItemHTML(dia.cena.prot, 'cena.prot', 'Cena · Proteína', 'bg-indigo-50 dark:bg-indigo-900/20', '')}${foodItemHTML(dia.cena.verdura, 'cena.verdura', 'Cena · Verdura', 'bg-violet-50 dark:bg-violet-900/20', '🥬')}</div>`;
    cont.appendChild(card);
  });
}

function abrirModalReceta(alimentoId) {
  const alimento = ALIMENTOS_DB[alimentoId];
  if (!alimento) return;
  const receta = RECETAS_DB[alimentoId];
  currentRecipeFoodId = alimentoId;
  document.getElementById('recetaTitulo').textContent = alimento.nombre;
  if (receta) {
    document.getElementById('recetaTiempo').textContent = receta.tiempo || '—';
    document.getElementById('recetaDificultad').textContent = receta.dificultad || '—';
    document.getElementById('recetaPorciones').textContent = `${receta.porciones || 2} ${receta.porciones === 1 ? 'porción' : 'porciones'}`;
    document.getElementById('recetaIngredientes').innerHTML = receta.ingredientes.map(ing => `<div class="recipe-ingredient" onclick="toggleIngrediente(this)"><input type="checkbox" class="w-4 h-4 accent-teal-600"><span class="flex-1 text-sm text-slate-700 dark:text-slate-300">${ing.nombre}</span><span class="text-xs text-slate-500 font-semibold">${ing.cantidad}</span></div>`).join('');
    document.getElementById('recetaPasos').innerHTML = receta.pasos.map((paso, i) => `<div class="recipe-step"><div class="recipe-step-number">${i + 1}</div><div class="flex-1 text-sm text-slate-700 dark:text-slate-300">${paso}</div></div>`).join('');
    const consejoEl = document.getElementById('recetaConsejo');
    if (receta.consejo) { document.getElementById('recetaConsejoTexto').textContent = receta.consejo; consejoEl.classList.remove('hidden'); }
    else { consejoEl.classList.add('hidden'); }
  } else {
    document.getElementById('recetaTiempo').textContent = '—';
    document.getElementById('recetaDificultad').textContent = '—';
    document.getElementById('recetaPorciones').textContent = '—';
    document.getElementById('recetaIngredientes').innerHTML = '<p class="text-sm text-slate-500">Receta no disponible. El administrador puede añadir una desde el Panel Admin → Alimentos.</p>';
    document.getElementById('recetaPasos').innerHTML = '';
    document.getElementById('recetaConsejo').classList.add('hidden');
  }
  const rating = USER_RATINGS[alimentoId]?.rating || 0;
  renderStars(rating);
  document.getElementById('modalReceta').classList.remove('hidden');
}

function cerrarModalReceta() { document.getElementById('modalReceta').classList.add('hidden'); currentRecipeFoodId = null; }
function toggleIngrediente(el) { el.classList.toggle('checked'); const cb = el.querySelector('input[type="checkbox"]'); cb.checked = !cb.checked; }

// ============================================
// 10. SUSTITUCIONES
// ============================================
function abrirModalSustitucion(diaIdx, path, currentId) {
  const current = ALIMENTOS_DB[currentId];
  if (!current) return;
  const grupo = getGrupoById(currentId);
  if (grupo.length <= 1) return;
  currentSwap = { diaIdx, path, currentId };
  document.getElementById('modalTitulo').textContent = `Sustituir: ${current.nombre}`;
  const grupoNombre = { 'prot': 'Proteínas', 'carb': 'Carbohidratos', 'verd': 'Verduras', 'grasa': 'Grasas', 'des': 'Desayunos', 'mer': 'Meriendas' };
  document.getElementById('modalSubtitulo').textContent = `Grupo: ${grupoNombre[current.grupo]} · ${grupo.length} alternativas`;
  const cont = document.getElementById('modalOpciones');
  cont.innerHTML = '';
  const ordenados = [...grupo].sort((a, b) => {
    if (a.id === currentId) return -1;
    if (b.id === currentId) return 1;
    const aExc = USER_RATINGS[a.id]?.is_excluded ? 1 : 0;
    const bExc = USER_RATINGS[b.id]?.is_excluded ? 1 : 0;
    if (aExc !== bExc) return aExc - bExc;
    const aFav = USER_RATINGS[a.id]?.is_favorite ? 1 : 0;
    const bFav = USER_RATINGS[b.id]?.is_favorite ? 1 : 0;
    if (aFav !== bFav) return bFav - aFav;
    const aRating = USER_RATINGS[a.id]?.rating || 0;
    const bRating = USER_RATINGS[b.id]?.rating || 0;
    if (aRating !== bRating) return bRating - aRating;
    return Math.abs(a.kcal - current.kcal) - Math.abs(b.kcal - current.kcal);
  });
  ordenados.forEach(alim => {
    const isCurrent = alim.id === currentId;
    const diffKcal = alim.kcal - current.kcal;
    const rating = USER_RATINGS[alim.id];
    const isFav = rating?.is_favorite || false;
    const isExc = rating?.is_excluded || false;
    const badgeTemporada = getBadgeTemporada(alim);
    const starsHtml = rating?.rating ? '⭐'.repeat(rating.rating) : '';
    const opt = document.createElement('div');
    opt.className = `sub-option p-4 border-2 rounded-xl ${isCurrent ? 'current border-green-300' : 'border-slate-200 dark:border-slate-700'} ${isFav ? 'is-favorite-sub' : ''} ${isExc ? 'is-excluded-sub' : ''}`;
    opt.innerHTML = `<div class="flex justify-between items-start gap-3"><div class="flex-1"><div class="flex items-center gap-2 flex-wrap mb-1"><span class="font-bold text-slate-800 dark:text-white">${alim.nombre}</span>${isCurrent ? '<span class="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">ACTUAL</span>' : ''}${isFav ? '<span class="text-xs">❤️</span>' : ''}${isExc ? '<span class="text-xs bg-slate-400 text-white px-2 py-0.5 rounded-full font-bold">EXCLUIDO</span>' : ''}</div><div class="flex gap-1.5 mt-2 flex-wrap flex-wrap">${badgeTemporada}${starsHtml ? `<span class="macro-chip bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">${starsHtml}</span>` : ''}<span class="macro-chip bg-slate-100 dark:bg-slate-700">🔥 ${alim.kcal} kcal</span>${alim.prot ? `<span class="macro-chip bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300">P ${alim.prot}g</span>` : ''}${!isCurrent ? `<span class="macro-chip ${Math.abs(diffKcal) <= 20 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}">${diffKcal > 0 ? '+' : ''}${diffKcal} kcal</span>` : ''}</div></div>${!isCurrent && !isExc ? `<button class="flex-shrink-0 bg-teal-600 text-white px-3 py-2 rounded-lg text-sm font-semibold">Elegir</button>` : ''}</div>`;
    if (!isCurrent && !isExc) opt.addEventListener('click', () => aplicarSustitucion(alim.id));
    cont.appendChild(opt);
  });
  document.getElementById('modalSustitucion').classList.remove('hidden');
}

function cerrarModal() { document.getElementById('modalSustitucion').classList.add('hidden'); currentSwap = null; }

function aplicarSustitucion(nuevoId) {
  if (!currentSwap || !menuData) return;
  const { diaIdx, path } = currentSwap;
  const nuevo = ALIMENTOS_DB[nuevoId];
  const dia = menuData.menu[diaIdx];
  const partes = path.split('.');
  let obj = dia;
  for (let i = 0; i < partes.length - 1; i++) obj = obj[partes[i]];
  obj[partes[partes.length - 1]] = { ...nuevo };
  sustituciones[`${diaIdx}|${path}`] = nuevoId;
  cerrarModal();
  renderMenu();
  renderListaCompra();
  renderPlanificador();
  mostrarToast(`✓ ${nuevo.nombre} sustituido`);
  achievementStats.sustituciones++;
  verificarLogros();
}

function mostrarToast(mensaje) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl z-[200] font-semibold text-sm';
  toast.style.animation = 'fadeIn 0.3s ease-out';
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 2200);
}

document.getElementById('modalSustitucion').addEventListener('click', (e) => { if (e.target.id === 'modalSustitucion') cerrarModal(); });
document.getElementById('modalReceta').addEventListener('click', (e) => { if (e.target.id === 'modalReceta') cerrarModalReceta(); });
document.getElementById('modalAnuncio').addEventListener('click', (e) => { if (e.target.id === 'modalAnuncio') cerrarModalAnuncio(); });
document.getElementById('modalAlimento').addEventListener('click', (e) => { if (e.target.id === 'modalAlimento') cerrarModalAlimento(); });

async function compartirApp() {
  const shareData = { title: 'NutriPro', text: '¡Estoy mejorando mi salud con NutriPro!', url: window.location.href };
  if (navigator.share) { try { await navigator.share(shareData); } catch (err) {} }
  else { window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`, '_blank'); }
}

// ============================================
// 11. LISTA DE COMPRA
// ============================================
function categorizarIngrediente(ing) {
  const lower = ing.toLowerCase();
  if (/pollo|pavo|salmón|merluza|atún|huevo|tofu|lentejas|garbanzos|alubias|ternera/.test(lower)) return { cat: ' Proteínas', color: 'from-rose-500 to-pink-500' };
  if (/arroz|quinoa|pasta|batata|avena|pan|cuscús|bulgur|boniato|tortita/.test(lower)) return { cat: ' Carbohidratos', color: 'from-amber-500 to-orange-500' };
  if (/aceite|aguacate|almendra|nueces|pistacho|anacardo|semilla|tahini|aceituna/.test(lower)) return { cat: ' Grasas Saludables', color: 'from-emerald-500 to-teal-500' };
  if (/manzana|plátano|pera|fresa|cereza|sandía|melón|melocotón|nectarina|albaricoque|higo|granada|uva|caqui|mandarina|naranja|kiwi|pomelo|lima|frutos rojos|membrillo|pasas/.test(lower)) return { cat: '🍎 Frutas', color: 'from-red-500 to-rose-500' };
  if (/brócoli|espinaca|tomate|calabacín|lechuga|pepino|cebolla|pimiento|berenjena|coliflor|alcachofa|espárrago|judía|acelga|col|seta|champiñón|puerro|hinojo|apio|remolacha|zanahoria|guisante|haba|calabaza|col lombarda|coles de bruselas|menestra|pisto|escalivada|gazpacho|salmorejo|hummus/.test(lower)) return { cat: ' Verduras', color: 'from-green-500 to-emerald-500' };
  return { cat: '🛒 Otros', color: 'from-blue-500 to-cyan-500' };
}

function generarListaCompra() {
  if (!menuData) return;
  document.getElementById('compraNoData').classList.add('hidden');
  document.getElementById('compraContent').classList.remove('hidden');
  renderListaCompra();
  achievementStats.listas_compra++;
  verificarLogros();
}

function obtenerIngredientes() {
  const totales = {};
  menuData.menu.forEach(dia => {
    const items = [dia.desayuno.ing, dia.comida.prot.ing, dia.comida.carb.ing, dia.comida.verdura.ing, dia.comida.grasa.ing, dia.merienda.ing, dia.cena.prot.ing, dia.cena.verdura.ing];
    items.forEach(lista => { if (!lista) return; lista.forEach(ing => { totales[ing] = (totales[ing] || 0) + 1; }); });
  });
  return totales;
}

function renderListaCompra() {
  if (!menuData) return;
  const totales = obtenerIngredientes();
  const cont = document.getElementById('compraContent');
  cont.innerHTML = '';
  const categorias = {};
  Object.keys(totales).forEach(ing => {
    const { cat, color } = categorizarIngrediente(ing);
    if (!categorias[cat]) categorias[cat] = { color, items: [] };
    categorias[cat].items.push({ nombre: ing, cantidad: totales[ing] });
  });
  Object.keys(categorias).sort().forEach(cat => {
    const data = categorias[cat];
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl border border-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700';
    card.innerHTML = `<div class="bg-gradient-to-r ${data.color} text-white p-4"><h3 class="font-bold">${cat}</h3><p class="text-xs opacity-90">${data.items.length} productos</p></div><ul class="p-4 space-y-2">${data.items.map(item => `<li class="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer"><input type="checkbox" class="w-4 h-4 accent-teal-600"><span class="flex-1 text-sm text-slate-700 dark:text-slate-300">${item.nombre.charAt(0).toUpperCase() + item.nombre.slice(1)}</span><span class="text-xs text-slate-400">×${item.cantidad}</span></li>`).join('')}</ul>`;
    cont.appendChild(card);
  });
}

// ============================================
// 12. SEGUIMIENTO DE PESO Y GRÁFICOS
// ============================================
async function agregarPeso() {
  const fecha = document.getElementById('fechaPeso').value;
  const valor = parseFloat(document.getElementById('valorPeso').value);
  if (!fecha || isNaN(valor)) { mostrarToast('⚠️ Introduce fecha y peso válido'); return; }
  const pesoData = { fecha, valor };
  if (!appIsOnline) {
    addToOfflineQueue('add_weight', pesoData);
    pesos.push(pesoData);
    pesos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    document.getElementById('valorPeso').value = '';
    renderSeguimiento();
    return;
  }
  try {
    const { error } = await sb.from('weight_logs').insert({ user_id: currentUser.id, fecha, valor });
    if (error) { addToOfflineQueue('add_weight', pesoData); return; }
    pesos.push(pesoData);
    pesos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    document.getElementById('valorPeso').value = '';
    renderSeguimiento();
    mostrarToast('✅ Peso registrado');
    verificarLogros();
  } catch (err) { addToOfflineQueue('add_weight', pesoData); }
}

function mediaMovil(arr, ventana = 7) {
  return arr.map((p, i) => {
    const inicio = Math.max(0, i - ventana + 1);
    const slice = arr.slice(inicio, i + 1);
    return { fecha: p.fecha, valor: parseFloat((slice.reduce((s, x) => s + x.valor, 0) / slice.length).toFixed(2)) };
  });
}

function renderSeguimiento() {
  const hist = document.getElementById('historialPeso');
  if (pesos.length === 0) { hist.innerHTML = '<p class="text-slate-500 text-sm">Sin registros.</p>'; }
  else { hist.innerHTML = pesos.slice().reverse().slice(0, 10).map(p => `<div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"><span class="text-sm">${new Date(p.fecha).toLocaleDateString('es-ES')}</span><span class="font-bold">${p.valor} kg</span></div>`).join(''); }
  renderChartPeso();
}

function renderChartPeso() {
  const ctx = document.getElementById('chartPeso').getContext('2d');
  if (chartPeso) chartPeso.destroy();
  if (pesos.length === 0) return;
  const labels = pesos.map(p => new Date(p.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }));
  chartPeso = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [
      { label: 'Peso real', data: pesos.map(p => p.valor), borderColor: '#0d9488', tension: 0.3, fill: true, backgroundColor: 'rgba(13,148,136,0.1)' },
      { label: 'Media móvil', data: mediaMovil(pesos).map(p => p.valor), borderColor: '#f59e0b', borderDash: [5, 5], tension: 0.4, pointRadius: 0 }
    ]},
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}

function renderAnalisis() {
  if (pesos.length < 4) { document.getElementById('analisisNoData').classList.remove('hidden'); document.getElementById('analisisContent').classList.add('hidden'); return; }
  document.getElementById('analisisNoData').classList.add('hidden');
  document.getElementById('analisisContent').classList.remove('hidden');
  const ctx = document.getElementById('chartSemanal').getContext('2d');
  if (chartSemanal) chartSemanal.destroy();
  const semanas = [];
  for (let i = 0; i < pesos.length; i += 7) { const s = pesos.slice(i, i + 7); semanas.push(parseFloat((s.reduce((a, p) => a + p.valor, 0) / s.length).toFixed(2))); }
  chartSemanal = new Chart(ctx, { type: 'bar', data: { labels: semanas.map((_, i) => `Sem ${i+1}`), datasets: [{ data: semanas, backgroundColor: '#0d9488', borderRadius: 8 }] }, options: { responsive: true } });
}

// ============================================
// 13. EJERCICIO
// ============================================
function generarEjercicio() {
  if (!userData) return;
  document.getElementById('ejercicioNoData').classList.add('hidden');
  document.getElementById('ejercicioContent').classList.remove('hidden');
  const edad = userData.edad;
  let ejercicios;
  if (edad >= 18 && edad <= 35) ejercicios = [{ nombre: 'Sentadillas búlgaras', reps: '3x12' }, { nombre: 'Flexiones', reps: '3x10' }, { nombre: 'Plancha', reps: '3x30s' }];
  else if (edad >= 36 && edad <= 55) ejercicios = [{ nombre: 'Sentadilla a silla', reps: '3x12' }, { nombre: 'Flexiones en pared', reps: '3x12' }, { nombre: 'Caminata', reps: '30 min' }];
  else ejercicios = [{ nombre: 'Sentadilla asistida', reps: '3x10' }, { nombre: 'Bandas elásticas', reps: '3x12' }, { nombre: 'Caminata suave', reps: '20 min' }];
  document.getElementById('ejerciciosList').innerHTML = ejercicios.map((ej, i) => `<div class="bg-white rounded-2xl p-5 border border-slate-100 dark:bg-slate-800 dark:border-slate-700"><h4 class="font-bold mb-1">${ej.nombre}</h4><p class="text-sm text-teal-600 font-semibold mb-3">${ej.reps}</p><button onclick="buscarVideo('${ej.nombre}')" class="w-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-2 rounded-lg text-sm font-semibold">▶️ Ver tutorial</button></div>`).join('');
}

function buscarVideo(nombre) { window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent('como hacer ' + nombre)}`, '_blank'); }

// ============================================
// 14. SALUD Y HÁBITOS
// ============================================
const HABITOS_SALUD = [
  { icon: '', titulo: 'Dejar de fumar', texto: 'El tabaco daña prácticamente todos los órganos.', videos: ['beneficios de dejar de fumar'] },
  { icon: '😴', titulo: 'Dormir 7-9 horas', texto: 'Regula hormonas del hambre y saciedad.', videos: ['higiene del sueño'] },
  { icon: '💧', titulo: 'Hidratación', texto: 'Mejora rendimiento y saciedad.', videos: ['cuánta agua beber'] },
  { icon: '🚶', titulo: 'Moverse cada día', texto: 'El NEAT suma al gasto diario.', videos: ['qué es el NEAT'] }
];

function renderSalud() {
  const cont = document.getElementById('saludCards');
  if (!cont || cont.dataset.rendered === '1') return;
  cont.innerHTML = HABITOS_SALUD.map(h => `<div class="habit-card"><div class="flex items-start gap-3 mb-3"><div class="text-3xl">${h.icon}</div><h3 class="text-lg font-bold">${h.titulo}</h3></div><p class="text-sm text-slate-600 dark:text-slate-400 mb-4">${h.texto}</p><div class="flex flex-wrap gap-2">${h.videos.map(v => `<button class="habit-video-btn" onclick="buscarVideoHabito('${v}')">▶️ ${v}</button>`).join('')}</div></div>`).join('');
  cont.dataset.rendered = '1';
}

function buscarVideoHabito(q) { window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(q), '_blank'); }

// ============================================
// 15. COMENTARIOS
// ============================================
async function publicarComentario() {
  const texto = document.getElementById('nuevoComentario').value.trim();
  if (!texto) { mostrarToast('⚠️ Escribe un comentario'); return; }
  const anonimo = document.getElementById('comentarioAnonimo').checked;
  const commentData = { texto, anonimo };
  if (!appIsOnline) {
    addToOfflineQueue('add_comment', commentData);
    document.getElementById('nuevoComentario').value = '';
    mostrarToast('📴 Comentario guardado localmente');
    return;
  }
  try {
    const { error } = await sb.from('comments').insert({ user_id: currentUser.id, user_name: anonimo ? 'Anónimo' : currentUser.nombre, texto, is_anonymous: anonimo });
    if (error) { addToOfflineQueue('add_comment', commentData); return; }
    document.getElementById('nuevoComentario').value = '';
    await renderComentarios();
    mostrarToast('💬 Comentario publicado');
    achievementStats.comentarios++;
    verificarLogros();
  } catch (err) { addToOfflineQueue('add_comment', commentData); }
}

async function renderComentarios() {
  try {
    const { data: comments } = await sb.from('comments').select('*').order('created_at', { ascending: false });
    const cont = document.getElementById('listaComentarios');
    if (!comments || comments.length === 0) { cont.innerHTML = '<div class="bg-white rounded-2xl p-8 text-center border border-slate-100 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">Sé el primero en compartir tu experiencia 💬</div>'; return; }
    cont.innerHTML = comments.map(c => {
      const fecha = new Date(c.created_at).toLocaleDateString('es-ES');
      const textoSeguro = DOMPurify.sanitize(c.texto);
      const nombreSeguro = DOMPurify.sanitize(c.user_name);
      return `<div class="comment-card"><div class="flex items-center gap-2 mb-2"><div class="w-9 h-9 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-sm">${nombreSeguro.charAt(0).toUpperCase()}</div><div><div class="font-semibold text-slate-800 dark:text-white text-sm">${nombreSeguro}</div><div class="text-xs text-slate-400">${fecha}</div></div></div><p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">${textoSeguro}</p></div>`;
    }).join('');
  } catch (err) { console.error('Error cargando comentarios:', err); }
}

// ============================================
// 16. PLANIFICADOR Y BATCH COOKING
// ============================================
function getLunesSemana(offset = 0) { const hoy = new Date(); const diaSemana = hoy.getDay(); const diff = hoy.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1) + (offset * 7); const lunes = new Date(hoy); lunes.setDate(diff); lunes.setHours(0, 0, 0, 0); return lunes; }
function getDomingoSemana(offset = 0) { const lunes = getLunesSemana(offset); const domingo = new Date(lunes); domingo.setDate(lunes.getDate() + 6); return domingo; }
function formatDateShort(date) { return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }); }
function isToday(date) { const hoy = new Date(); return date.toDateString() === hoy.toDateString(); }

function navegarSemana(offset) { if (offset === 0) { plannerWeekOffset = 0; } else { plannerWeekOffset += offset; } renderPlanificador(); }

function cambiarVistaPlanificador(vista) {
  plannerCurrentView = vista;
  document.querySelectorAll('.planner-view-btn').forEach(btn => { btn.classList.toggle('active', btn.dataset.view === vista); });
  document.getElementById('vistaCalendario').classList.toggle('hidden', vista !== 'calendario');
  document.getElementById('vistaBatch').classList.toggle('hidden', vista !== 'batch');
  if (vista === 'batch') { achievementStats.batch_cooking_visits++; verificarLogros(); }
}

function renderPlanificador() {
  if (!userData || !menuData) { document.getElementById('planificadorNoData').classList.remove('hidden'); document.getElementById('planificadorContent').classList.add('hidden'); return; }
  document.getElementById('planificadorNoData').classList.add('hidden');
  document.getElementById('planificadorContent').classList.remove('hidden');
  const lunes = getLunesSemana(plannerWeekOffset);
  const domingo = getDomingoSemana(plannerWeekOffset);
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  document.getElementById('plannerMonthYear').textContent = `${meses[lunes.getMonth()]} ${lunes.getFullYear()}`;
  document.getElementById('plannerWeekRange').textContent = `${formatDateShort(lunes)} - ${formatDateShort(domingo)}`;
  const grid = document.getElementById('plannerGrid');
  grid.innerHTML = '';
  const diasCortos = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  let totalKcalSemana = 0;
  let totalProteinas = 0;
  const alimentosUsados = new Set();
  for (let i = 0; i < 7; i++) {
    const fecha = new Date(lunes);
    fecha.setDate(lunes.getDate() + i);
    const menuIdx = i;
    const diaMenu = menuData.menu[menuIdx];
    const kcalDia = calcularKcalDia(diaMenu);
    totalKcalSemana += kcalDia;
    totalProteinas += (diaMenu.comida.prot.prot || 0) + (diaMenu.cena.prot.prot || 0);
    [diaMenu.desayuno, diaMenu.comida.prot, diaMenu.comida.carb, diaMenu.comida.verdura, diaMenu.comida.grasa, diaMenu.merienda, diaMenu.cena.prot, diaMenu.cena.verdura].forEach(a => { if (a && a.id) alimentosUsados.add(a.id); });
    const card = document.createElement('div');
    card.className = `planner-day-card ${isToday(fecha) ? 'today' : ''}`;
    card.onclick = () => { switchTab('menu'); setTimeout(() => { const cards = document.querySelectorAll('#menuContent > div'); if (cards[menuIdx]) cards[menuIdx].scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100); };
    card.innerHTML = `<div class="planner-day-name">${diasCortos[i]}</div><div class="planner-day-date">${formatDateShort(fecha)}${isToday(fecha) ? ' · Hoy' : ''}</div><div class="planner-meal planner-meal-breakfast" title="${DOMPurify.sanitize(diaMenu.desayuno.nombre)}">☀️ ${diaMenu.desayuno.nombre.substring(0, 25)}${diaMenu.desayuno.nombre.length > 25 ? '...' : ''}</div><div class="planner-meal planner-meal-lunch" title="${DOMPurify.sanitize(diaMenu.comida.prot.nombre)}">🍽️ ${diaMenu.comida.prot.nombre.substring(0, 25)}${diaMenu.comida.prot.nombre.length > 25 ? '...' : ''}</div><div class="planner-meal planner-meal-dinner" title="${DOMPurify.sanitize(diaMenu.cena.prot.nombre)}">🌙 ${diaMenu.cena.prot.nombre.substring(0, 25)}${diaMenu.cena.prot.nombre.length > 25 ? '...' : ''}</div><div class="planner-kcal"> ${kcalDia} kcal</div>`;
    grid.appendChild(card);
  }
  document.getElementById('resumenKcalSemana').textContent = totalKcalSemana.toLocaleString('es-ES');
  document.getElementById('resumenKcalDiario').textContent = Math.round(totalKcalSemana / 7).toLocaleString('es-ES');
  document.getElementById('resumenProteinas').textContent = Math.round(totalProteinas / 7) + 'g';
  document.getElementById('resumenVariedad').textContent = alimentosUsados.size;
  renderBatchCooking();
}

function renderBatchCooking() {
  if (!menuData) return;
  const tareas = [
    { tiempo: '16:00', duracion: '30 min', tarea: '🫘 Cocer legumbres (garbanzos, lentejas, alubias)', tipo: 'base' },
    { tiempo: '16:30', duracion: '45 min', tarea: '🍚 Cocinar arroces y pastas para la semana', tipo: 'base' },
    { tiempo: '17:00', duracion: '40 min', tarea: '🥦 Asar verduras (berenjenas, pimientos, calabacín)', tipo: 'verduras' },
    { tiempo: '17:30', duracion: '45 min', tarea: '🍗 Cocinar proteínas (pollo, pescado, huevos)', tipo: 'proteinas' },
    { tiempo: '18:00', duracion: '20 min', tarea: '🥗 Preparar ensaladas y gazpacho', tipo: 'frio' },
    { tiempo: '18:20', duracion: '25 min', tarea: ' Envasar en tuppers y etiquetar', tipo: 'envasado' },
    { tiempo: '18:45', duracion: '15 min', tarea: ' Limpieza de cocina', tipo: 'limpieza' }
  ];
  const cont = document.getElementById('batchTasks');
  cont.innerHTML = tareas.map((t, i) => `<div class="batch-task" onclick="this.classList.toggle('completed')"><input type="checkbox" class="batch-check"><div class="batch-time">${t.tiempo}</div><div class="flex-1"><div class="font-semibold text-slate-800 dark:text-white text-sm">${t.tarea}</div><div class="text-xs text-slate-500 dark:text-slate-400">️ ${t.duracion}</div></div></div>`).join('');
  document.getElementById('batchTuppersComida').textContent = '7';
  document.getElementById('batchTuppersCena').textContent = '7';
  document.getElementById('batchDesayunos').textContent = '7';
  document.getElementById('batchMeriendas').textContent = '7';
}

// ============================================
// 17. EXPORTACIÓN PDF
// ============================================
function exportarMenuPDF() {
  if (!menuData) { alert('Genera tu menú primero'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFillColor(13, 148, 136); doc.rect(0, 0, 210, 25, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(18); doc.setFont('helvetica', 'bold');
  doc.text('NutriPro · Menú Semanal', 14, 16);
  let yPos = 40;
  menuData.menu.forEach((dia) => {
    if (yPos > 250) { doc.addPage(); yPos = 20; }
    doc.setTextColor(13, 148, 136); doc.setFontSize(12); doc.setFont('helvetica', 'bold');
    doc.text(`${dia.dia} - ${calcularKcalDia(dia)} kcal`, 14, yPos);
    yPos += 8;
    doc.setTextColor(50, 50, 50); doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    const rows = [['Desayuno', dia.desayuno.nombre], ['Comida', `${dia.comida.prot.nombre} + ${dia.comida.carb.nombre} + ${dia.comida.verdura.nombre}`], ['Cena', `${dia.cena.prot.nombre} + ${dia.cena.verdura.nombre}`]];
    doc.autoTable({ startY: yPos, body: rows, theme: 'plain', margin: { left: 14, right: 14 } });
    yPos = doc.lastAutoTable.finalY + 8;
  });
  doc.save('Menu_NutriPro.pdf');
  mostrarToast('📄 Menú exportado');
}

function exportarCompraPDF() {
  if (!menuData) { alert('Genera tu menú primero'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(18); doc.text('Lista de la Compra - NutriPro', 14, 20);
  const totales = obtenerIngredientes();
  let yPos = 30;
  Object.keys(totales).forEach(ing => {
    if (yPos > 280) { doc.addPage(); yPos = 20; }
    doc.setFontSize(11); doc.text(`☐ ${ing} (×${totales[ing]})`, 14, yPos);
    yPos += 8;
  });
  doc.save('Lista_Compra_NutriPro.pdf');
  mostrarToast('📄 Lista exportada');
}

function exportarProgresoPDF() {
  if (pesos.length === 0) { alert('No hay datos'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(18); doc.text('Reporte de Progreso - NutriPro', 14, 20);
  let yPos = 30;
  pesos.forEach(p => {
    doc.setFontSize(11); doc.text(`${new Date(p.fecha).toLocaleDateString('es-ES')}: ${p.valor} kg`, 14, yPos);
    yPos += 8;
  });
  doc.save('Progreso_NutriPro.pdf');
  mostrarToast(' Reporte exportado');
}

function exportarInformeCompletoPDF() {
  if (!userData) { alert('Completa la evaluación primero'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFillColor(13, 148, 136); doc.rect(0, 0, 210, 25, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(18); doc.setFont('helvetica', 'bold');
  doc.text('NutriPro - Informe Completo', 14, 16);
  doc.setTextColor(50, 50, 50); doc.setFontSize(11); doc.setFont('helvetica', 'normal');
  let yPos = 40;
  const lines = [`Usuario: ${currentUser.nombre}`, `TMB: ${userData.tmb} kcal/día`, `GETD: ${userData.getd} kcal/día`, `Objetivo: ${userData.caloriasObjetivo} kcal/día`, `IMC: ${userData.imc}`, `Peso actual: ${userData.peso} kg`, `Proteínas: ${userData.protG}g | Carbohidratos: ${userData.carbG}g | Grasas: ${userData.grasasG}g`];
  lines.forEach(l => { doc.text(l, 14, yPos); yPos += 8; });
  doc.save('Informe_NutriPro.pdf');
  mostrarToast('📊 Informe exportado');
}

function exportarPlanificadorPDF() {
  if (!menuData) { alert('Genera tu menú primero'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('landscape');
  doc.setFillColor(13, 148, 136); doc.rect(0, 0, 297, 25, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(20); doc.setFont('helvetica', 'bold');
  doc.text('NutriPro · Planificador Semanal', 14, 17);
  doc.setTextColor(100, 100, 100); doc.setFontSize(10); doc.setFont('helvetica', 'normal');
  const lunes = getLunesSemana(plannerWeekOffset);
  const domingo = getDomingoSemana(plannerWeekOffset);
  doc.text(`Semana del ${formatDateShort(lunes)} al ${formatDateShort(domingo)}`, 14, 32);
  let yPos = 40;
  const diasCortos = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  menuData.menu.forEach((dia, i) => {
    if (yPos > 180) { doc.addPage(); yPos = 20; }
    doc.setFillColor(240, 253, 250); doc.rect(14, yPos - 5, 270, 8, 'F');
    doc.setTextColor(13, 148, 136); doc.setFontSize(12); doc.setFont('helvetica', 'bold');
    doc.text(`${diasCortos[i]} - ${calcularKcalDia(dia)} kcal`, 16, yPos);
    yPos += 8;
    doc.setTextColor(50, 50, 50); doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    const rows = [['☀️ Desayuno', dia.desayuno.nombre], ['🍽️ Comida', `${dia.comida.prot.nombre} + ${dia.comida.carb.nombre} + ${dia.comida.verdura.nombre} + ${dia.comida.grasa.nombre}`], [' Merienda', dia.merienda.nombre], ['🌙 Cena', `${dia.cena.prot.nombre} + ${dia.cena.verdura.nombre}`]];
    doc.autoTable({ startY: yPos, body: rows, theme: 'plain', margin: { left: 14, right: 14 }, columnStyles: { 0: { cellWidth: 40, fontStyle: 'bold' } } });
    yPos = doc.lastAutoTable.finalY + 6;
  });
  doc.save('Planificador_NutriPro.pdf');
  mostrarToast(' Planificador exportado');
}

// ============================================
// 18. PERFIL
// ============================================
document.getElementById('formPerfil').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('perfilNombre').value.trim();
  if (!nombre) return;
  if (!appIsOnline) { addToOfflineQueue('update_profile', { nombre }); currentUser.nombre = nombre; updateUserUI(); mostrarToast('📴 Guardado localmente'); return; }
  try {
    const { error } = await sb.from('profiles').update({ nombre }).eq('id', currentUser.id);
    if (error) { mostrarToast('❌ Error'); return; }
    currentUser.nombre = nombre;
    updateUserUI();
    mostrarToast('✓ Perfil actualizado');
  } catch (err) { mostrarToast('❌ Error'); }
});

document.getElementById('formPassword').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nueva = document.getElementById('passNueva').value;
  const conf = document.getElementById('passConfirm').value;
  if (nueva !== conf) { mostrarToast('❌ Las contraseñas no coinciden'); return; }
  if (nueva.length < 6) { mostrarToast('❌ Mínimo 6 caracteres'); return; }
  if (!appIsOnline) { mostrarToast('️ Se requiere conexión'); return; }
  try {
    const { error } = await sb.auth.updateUser({ password: nueva });
    if (error) { mostrarToast('❌ Error: ' + error.message); }
    else { document.getElementById('formPassword').reset(); mostrarToast('✓ Contraseña cambiada'); }
  } catch (err) { mostrarToast('❌ Error de conexión'); }
});

// ============================================
// 19. NAVEGACIÓN
// ============================================
document.querySelectorAll('.nav-btn').forEach(btn => { btn.addEventListener('click', () => switchTab(btn.dataset.tab)); });

function switchTab(tab) {
  if (tab === 'admin' && (!currentUser || currentUser.rol !== 'admin')) { alert(' Acceso restringido'); return; }
  document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => { b.classList.remove('active'); b.classList.add('text-white/80'); });
  const section = document.getElementById(tab);
  if (section) section.classList.add('active');
  const btn = document.querySelector(`.nav-btn[data-tab="${tab}"]`);
  if (btn) { btn.classList.add('active'); btn.classList.remove('text-white/80'); }
  document.getElementById('userDropdown').classList.remove('show');
  if (tab === 'comentarios') renderComentarios();
  if (tab === 'analisis') renderAnalisis();
  if (tab === 'seguimiento') renderSeguimiento();
  if (tab === 'salud') renderSalud();
  if (tab === 'planificador') renderPlanificador();
  if (tab === 'perfil') { renderMisFavoritos(); renderMisExcluidos(); renderLogros(); }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.profile-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.profile-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('perfil-' + tab.dataset.ptab);
    if (panel) panel.classList.add('active');
    if (tab.dataset.ptab === 'logros') renderLogros();
  });
});

document.getElementById('userBtn').addEventListener('click', (e) => { e.stopPropagation(); document.getElementById('userDropdown').classList.toggle('show'); });
document.addEventListener('click', (e) => { if (!e.target.closest('.user-menu')) document.getElementById('userDropdown').classList.remove('show'); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { cerrarModal(); cerrarModalReceta(); cerrarModalAnuncio(); cerrarModalAlimento(); } });

// ============================================
// 20. INICIALIZACIÓN
// ============================================
initStarRating();
checkAuth();

console.log('[NutriPro] app.js cargado correctamente');
