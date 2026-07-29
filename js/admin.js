/* ============================================
   NUTRIPRO - PANEL DE ADMINISTRACIÓN
   ============================================ */

// ============================================
// 1. CARGA DE DATOS DEL PANEL ADMIN
// ============================================
async function cargarPanelAdmin() {
  if (!currentUser || currentUser.rol !== 'admin') return;
  document.getElementById('listaUsuariosAdmin').innerHTML = '<div class="loading-spinner"></div>';
  document.getElementById('statUsuarios').textContent = '...';
  document.getElementById('statActivos').textContent = '...';
  document.getElementById('statBloqueados').textContent = '...';
  document.getElementById('statComentarios').textContent = '...';
  try {
    const { data: usuarios } = await sb.from('profiles').select('*').order('created_at', { ascending: false });
    const { count: totalComentarios } = await sb.from('comments').select('*', { count: 'exact', head: true });
    if (usuarios) {
      const total = usuarios.length;
      const bloqueados = usuarios.filter(u => u.bloqueado === true).length;
      const activos = total - bloqueados;
      document.getElementById('statUsuarios').textContent = total;
      document.getElementById('statActivos').textContent = activos;
      document.getElementById('statBloqueados').textContent = bloqueados;
      document.getElementById('statComentarios').textContent = totalComentarios || 0;
      if (usuarios.length === 0) { document.getElementById('listaUsuariosAdmin').innerHTML = '<p class="text-slate-500 text-sm text-center py-4">No hay usuarios registrados.</p>'; }
      else {
        document.getElementById('listaUsuariosAdmin').innerHTML = usuarios.map(u => {
          const esAdmin = u.rol === 'admin';
          const estaBloqueado = u.bloqueado === true;
          const esYo = u.id === currentUser.id;
          const idCorto = u.id.substring(0, 8) + '...';
          return `<div class="admin-user-row"><div class="flex items-center gap-3 flex-1 min-w-0"><div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${esAdmin ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'}">${(u.nombre || 'U').charAt(0).toUpperCase()}</div><div class="flex-1 min-w-0"><div class="font-semibold text-slate-800 dark:text-white text-sm truncate">${DOMPurify.sanitize(u.nombre || 'Sin nombre')}</div><div class="text-xs text-slate-500 dark:text-slate-400 truncate">${idCorto}</div><div class="flex gap-1 mt-1 flex-wrap">${esAdmin ? '<span class="status-badge bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">⚙️ Admin</span>' : '<span class="status-badge bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">👤 Usuario</span>'}${estaBloqueado ? '<span class="status-badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">🚫 Bloqueado</span>' : '<span class="status-badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">✅ Activo</span>'}${esYo ? '<span class="status-badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"> Tú</span>' : ''}</div></div></div><div class="flex gap-2 flex-shrink-0 flex-wrap">${!esYo ? `<button onclick="toggleBloqueoUsuario('${u.id}', ${!estaBloqueado})" class="admin-btn ${estaBloqueado ? 'admin-btn-success' : 'admin-btn-warning'}">${estaBloqueado ? '✅ Desbloquear' : '🚫 Bloquear'}</button>` : '<span class="text-xs text-slate-400 italic">Tu cuenta</span>'}<button onclick="resetPasswordUsuario('${u.id}', '${DOMPurify.sanitize(u.email || '')}')" class="admin-btn admin-btn-primary">🔑 Resetear clave</button></div></div>`;
        }).join('');
      }
    }
    document.getElementById('configUsuario').textContent = currentUser.nombre;
    document.getElementById('configRol').textContent = currentUser.rol;
    document.getElementById('configConexion').textContent = appIsOnline ? '🟢 Online' : '🔴 Offline';
    document.getElementById('configCola').textContent = getOfflineQueue().length;
  } catch (err) { console.error('Error en cargarPanelAdmin:', err); document.getElementById('listaUsuariosAdmin').innerHTML = '<p class="text-red-600 text-sm">Error inesperado al cargar datos.</p>'; }
}

async function toggleBloqueoUsuario(userId, bloquear) {
  if (!confirm(`¿${bloquear ? 'Bloquear' : 'Desbloquear'} este usuario?`)) return;
  try {
    const { error } = await sb.from('profiles').update({ bloqueado: bloquear }).eq('id', userId);
    if (error) { mostrarToast('❌ Error al actualizar usuario'); return; }
    mostrarToast(`✅ Usuario ${bloquear ? 'bloqueado' : 'desbloqueado'}`);
    await cargarPanelAdmin();
  } catch (err) { mostrarToast('❌ Error inesperado'); }
}

async function resetPasswordUsuario(userId, email) {
  if (!email) { alert('Este usuario no tiene email registrado.'); return; }
  if (!confirm(`¿Enviar email de reseteo a ${email}?`)) return;
  try {
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + window.location.pathname });
    if (error) { mostrarToast('❌ Error: ' + error.message); return; }
    mostrarToast('✅ Email de reseteo enviado a ' + email);
  } catch (err) { console.error('Error en resetPasswordUsuario:', err); mostrarToast('❌ Error inesperado'); }
}

// ============================================
// 2. GESTIÓN DE COMENTARIOS
// ============================================
async function cargarComentariosAdmin() {
  try {
    const { data: comments } = await sb.from('comments').select('*').order('created_at', { ascending: false });
    if (!comments || comments.length === 0) { document.getElementById('listaComentariosAdmin').innerHTML = '<p class="text-slate-500 text-sm text-center py-4">No hay comentarios.</p>'; return; }
    document.getElementById('listaComentariosAdmin').innerHTML = comments.map(c => `<div class="admin-comment-row"><div class="flex justify-between items-start gap-3 mb-2"><div class="flex items-center gap-2 flex-1 min-w-0"><div class="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">${DOMPurify.sanitize(c.user_name).charAt(0).toUpperCase()}</div><div class="flex-1 min-w-0"><div class="font-semibold text-slate-800 dark:text-white text-sm truncate">${DOMPurify.sanitize(c.user_name)}</div><div class="text-xs text-slate-400">${new Date(c.created_at).toLocaleString('es-ES')}</div></div></div><button onclick="eliminarComentarioAdmin(${c.id})" class="admin-btn admin-btn-danger flex-shrink-0">🗑️ Eliminar</button></div><p class="text-sm text-slate-700 dark:text-slate-300">${DOMPurify.sanitize(c.texto)}</p>${c.is_anonymous ? '<div class="text-xs text-slate-400 mt-2">🔒 Publicado anónimamente</div>' : ''}</div>`).join('');
  } catch (err) { console.error('Error cargando comentarios admin:', err); }
}

async function eliminarComentarioAdmin(id) {
  if (!confirm('¿Eliminar este comentario permanentemente?')) return;
  try {
    const { error } = await sb.from('comments').delete().eq('id', id);
    if (error) { mostrarToast('❌ Error al eliminar'); return; }
    mostrarToast('✅ Comentario eliminado');
    await cargarComentariosAdmin();
    await cargarPanelAdmin();
  } catch (err) { console.error('Error en eliminarComentarioAdmin:', err); }
}

// ============================================
// 3. GESTIÓN DE ANUNCIOS
// ============================================
async function cargarAnunciosAdmin() {
  try {
    const { data: ads } = await sb.from('ads').select('*').order('order_index');
    if (!ads || ads.length === 0) { document.getElementById('listaAnunciosAdmin').innerHTML = '<p class="text-slate-500 text-sm text-center py-4">No hay anuncios.</p>'; return; }
    const positionNames = { top: '🔝 Superior', sidebar: '📎 Lateral', inline: '📏 En línea', footer: ' Inferior' };
    document.getElementById('listaAnunciosAdmin').innerHTML = ads.map(ad => `<div class="admin-ad-row"><div class="flex justify-between items-start gap-3 mb-2"><div class="flex-1"><div class="flex items-center gap-2 mb-1 flex-wrap"><span class="font-bold text-slate-800 dark:text-white">${DOMPurify.sanitize(ad.title)}</span><span class="status-badge ${ad.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}">${ad.active ? '✅ Activo' : '⏸️ Pausado'}</span><span class="status-badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">${positionNames[ad.position] || ad.position}</span></div>${ad.content ? `<p class="text-sm text-slate-600 dark:text-slate-400">${DOMPurify.sanitize(ad.content)}</p>` : ''}${ad.link_url && ad.link_url !== '#' ? `<p class="text-xs text-teal-600 mt-1">🔗 ${DOMPurify.sanitize(ad.link_url)}</p>` : ''}</div><div class="flex gap-1 flex-shrink-0"><button onclick="editarAnuncio('${ad.id}')" class="admin-btn admin-btn-primary">✏️ Editar</button><button onclick="toggleAnuncio('${ad.id}', ${!ad.active})" class="admin-btn ${ad.active ? 'admin-btn-warning' : 'admin-btn-success'}">${ad.active ? '⏸️ Pausar' : '✅ Activar'}</button><button onclick="eliminarAnuncio('${ad.id}')" class="admin-btn admin-btn-danger">🗑️</button></div></div></div>`).join('');
  } catch (err) { console.error('Error cargando anuncios:', err); }
}

function abrirModalAnuncio(ad = null) {
  document.getElementById('anuncioModalTitulo').textContent = ad ? 'Editar anuncio' : 'Nuevo anuncio';
  document.getElementById('anuncioId').value = ad ? ad.id : '';
  document.getElementById('anuncioPosition').value = ad ? ad.position : 'top';
  document.getElementById('anuncioTitle').value = ad ? ad.title : '';
  document.getElementById('anuncioContent').value = ad ? (ad.content || '') : '';
  document.getElementById('anuncioImageUrl').value = ad ? (ad.image_url || '') : '';
  document.getElementById('anuncioLinkUrl').value = ad ? (ad.link_url || '') : '';
  document.getElementById('anuncioActive').checked = ad ? ad.active : true;
  document.getElementById('modalAnuncio').classList.remove('hidden');
}

function cerrarModalAnuncio() { document.getElementById('modalAnuncio').classList.add('hidden'); }

async function editarAnuncio(id) {
  try {
    const { data: ads } = await sb.from('ads').select('*').eq('id', id);
    if (ads && ads[0]) abrirModalAnuncio(ads[0]);
  } catch (err) { console.error('Error editando anuncio:', err); }
}

async function guardarAnuncio() {
  const id = document.getElementById('anuncioId').value;
  const data = {
    position: document.getElementById('anuncioPosition').value,
    title: document.getElementById('anuncioTitle').value.trim(),
    content: document.getElementById('anuncioContent').value.trim(),
    image_url: document.getElementById('anuncioImageUrl').value.trim() || null,
    link_url: document.getElementById('anuncioLinkUrl').value.trim() || '#',
    active: document.getElementById('anuncioActive').checked
  };
  if (!data.title) { alert('El título es obligatorio'); return; }
  try {
    let error;
    if (id) { ({ error } = await sb.from('ads').update({ ...data, updated_at: new Date() }).eq('id', id)); }
    else { ({ error } = await sb.from('ads').insert([data])); }
    if (error) { mostrarToast('❌ Error: ' + error.message); return; }
    mostrarToast(id ? '✅ Anuncio actualizado' : '✅ Anuncio creado');
    cerrarModalAnuncio();
    await cargarAnunciosAdmin();
    await cargarDatosDinamicos();
  } catch (err) { console.error('Error guardando anuncio:', err); }
}

async function toggleAnuncio(id, active) {
  try {
    const { error } = await sb.from('ads').update({ active, updated_at: new Date() }).eq('id', id);
    if (error) { mostrarToast('❌ Error'); return; }
    mostrarToast(active ? '✅ Anuncio activado' : '⏸️ Anuncio pausado');
    await cargarAnunciosAdmin();
    await cargarDatosDinamicos();
  } catch (err) { console.error('Error toggling anuncio:', err); }
}

async function eliminarAnuncio(id) {
  if (!confirm('¿Eliminar este anuncio permanentemente?')) return;
  try {
    const { error } = await sb.from('ads').delete().eq('id', id);
    if (error) { mostrarToast('❌ Error'); return; }
    mostrarToast('🗑️ Anuncio eliminado');
    await cargarAnunciosAdmin();
    await cargarDatosDinamicos();
  } catch (err) { console.error('Error eliminando anuncio:', err); }
}

// ============================================
// 4. GESTIÓN DE ALIMENTOS
// ============================================
async function cargarAlimentosAdmin() {
  try {
    const { data: foods } = await sb.from('foods').select('*').order('grupo', { ascending: true }).order('nombre');
    if (!foods || foods.length === 0) { document.getElementById('listaAlimentosAdmin').innerHTML = '<p class="text-slate-500 text-sm text-center py-4">No hay alimentos.</p>'; return; }
    const grupoNames = { prot: ' Proteínas', carb: ' Carbohidratos', verd: ' Verduras', grasa: '🥑 Grasas', des: '☀️ Desayunos', mer: '🍎 Meriendas' };
    const temporadaNames = { todo_el_año: ' Todo el año', primavera: ' Primavera', verano: '☀️ Verano', otono: '🍂 Otoño', invierno: '❄️ Invierno' };
    let html = '';
    let currentGrupo = null;
    foods.forEach(f => {
      if (f.grupo !== currentGrupo) {
        currentGrupo = f.grupo;
        html += `<h4 class="font-bold text-slate-700 dark:text-slate-300 mt-4 mb-2 pb-2 border-b border-slate-200 dark:border-slate-700">${grupoNames[f.grupo] || f.grupo}</h4>`;
      }
      const tieneReceta = RECETAS_DB[f.id] !== undefined;
      const badgeTemp = temporadaNames[f.temporada] || ' Todo el año';
      html += `<div class="admin-food-row"><div class="flex justify-between items-start gap-3"><div class="flex-1"><div class="flex items-center gap-2 mb-1 flex-wrap"><span class="font-bold text-slate-800 dark:text-white">${DOMPurify.sanitize(f.nombre)}</span><span class="status-badge ${f.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}">${f.active ? '✅ Activo' : '⏸️ Oculto'}</span><span class="status-badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">${badgeTemp}</span>${f.es_fruta ? '<span class="status-badge bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">🍎 Fruta</span>' : ''}<span class="macro-chip bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">🔥 ${f.kcal} kcal</span>${f.prot ? `<span class="macro-chip bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300">P ${f.prot}g</span>` : ''}${tieneReceta ? '<span class="status-badge bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">📖 Con receta</span>' : '<span class="status-badge bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400">📄 Sin receta</span>'}</div><p class="text-xs text-slate-500 dark:text-slate-400">ID: <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">${f.id}</code></p></div><div class="flex gap-1 flex-shrink-0 flex-wrap"><button onclick="editarAlimento('${f.id}')" class="admin-btn admin-btn-primary">️ Editar</button><button onclick="toggleAlimento('${f.id}', ${!f.active})" class="admin-btn ${f.active ? 'admin-btn-warning' : 'admin-btn-success'}">${f.active ? '️ Ocultar' : '✅ Mostrar'}</button><button onclick="eliminarAlimento('${f.id}')" class="admin-btn admin-btn-danger">️</button></div></div></div>`;
    });
    document.getElementById('listaAlimentosAdmin').innerHTML = html;
  } catch (err) { console.error('Error cargando alimentos:', err); }
}

function abrirModalAlimento(food = null, recipe = null) {
  document.getElementById('alimentoModalTitulo').textContent = food ? 'Editar alimento' : 'Nuevo alimento';
  document.getElementById('alimentoId').value = food ? food.id : '';
  document.getElementById('alimentoIdInput').value = food ? food.id : '';
  document.getElementById('alimentoIdInput').disabled = !!food;
  document.getElementById('alimentoGrupo').value = food ? food.grupo : 'prot';
  document.getElementById('alimentoNombre').value = food ? food.nombre : '';
  document.getElementById('alimentoKcal').value = food ? food.kcal : '';
  document.getElementById('alimentoProt').value = food ? (food.prot || 0) : '';
  document.getElementById('alimentoTemporada').value = food ? (food.temporada || 'todo_el_año') : 'todo_el_año';
  document.getElementById('alimentoEsFruta').checked = food ? (food.es_fruta || false) : false;
  document.getElementById('alimentoIng').value = food ? (Array.isArray(food.ing) ? food.ing.join(', ') : '') : '';
  document.getElementById('alimentoActive').checked = food ? food.active : true;
  if (recipe) {
    document.getElementById('recetaTiempoInput').value = recipe.tiempo || '';
    document.getElementById('recetaDificultadInput').value = recipe.dificultad || '';
    document.getElementById('recetaPorcionesInput').value = recipe.porciones || '';
    document.getElementById('recetaIngredientesInput').value = recipe.ingredientes ? recipe.ingredientes.map(i => `${i.nombre} | ${i.cantidad}`).join('\n') : '';
    document.getElementById('recetaPasosInput').value = recipe.pasos ? recipe.pasos.join('\n') : '';
    document.getElementById('recetaConsejoInput').value = recipe.consejo || '';
  } else {
    document.getElementById('recetaTiempoInput').value = '';
    document.getElementById('recetaDificultadInput').value = '';
    document.getElementById('recetaPorcionesInput').value = '';
    document.getElementById('recetaIngredientesInput').value = '';
    document.getElementById('recetaPasosInput').value = '';
    document.getElementById('recetaConsejoInput').value = '';
  }
  document.getElementById('modalAlimento').classList.remove('hidden');
}

function cerrarModalAlimento() { document.getElementById('modalAlimento').classList.add('hidden'); }

async function editarAlimento(id) {
  try {
    const { data: foods } = await sb.from('foods').select('*').eq('id', id);
    const { data: recipes } = await sb.from('recipes').select('*').eq('food_id', id);
    if (foods && foods[0]) abrirModalAlimento(foods[0], recipes && recipes[0] ? recipes[0] : null);
  } catch (err) { console.error('Error editando alimento:', err); }
}

async function guardarAlimento() {
  const id = document.getElementById('alimentoId').value;
  const newId = document.getElementById('alimentoIdInput').value.trim();
  const foodData = {
    id: id || newId,
    grupo: document.getElementById('alimentoGrupo').value,
    nombre: document.getElementById('alimentoNombre').value.trim(),
    kcal: parseInt(document.getElementById('alimentoKcal').value) || 0,
    prot: parseInt(document.getElementById('alimentoProt').value) || 0,
    temporada: document.getElementById('alimentoTemporada').value,
    es_fruta: document.getElementById('alimentoEsFruta').checked,
    ing: document.getElementById('alimentoIng').value.split(',').map(s => s.trim()).filter(s => s),
    active: document.getElementById('alimentoActive').checked
  };
  if (!foodData.nombre || !foodData.id) { alert('El ID y el nombre son obligatorios'); return; }
  try {
    let error;
    if (id) { ({ error } = await sb.from('foods').update(foodData).eq('id', id)); }
    else { ({ error } = await sb.from('foods').insert([foodData])); }
    if (error) { mostrarToast(' Error: ' + error.message); return; }
    const recetaIngredientesRaw = document.getElementById('recetaIngredientesInput').value.trim();
    const recetaPasosRaw = document.getElementById('recetaPasosInput').value.trim();
    const recetaConsejo = document.getElementById('recetaConsejoInput').value.trim();
    const recetaTiempo = document.getElementById('recetaTiempoInput').value.trim();
    const recetaDificultad = document.getElementById('recetaDificultadInput').value.trim();
    const recetaPorciones = parseInt(document.getElementById('recetaPorcionesInput').value) || 2;
    if (recetaIngredientesRaw || recetaPasosRaw || recetaConsejo) {
      const ingredientes = recetaIngredientesRaw.split('\n').filter(l => l.trim()).map(l => { const [nombre, cantidad] = l.split('|').map(s => s.trim()); return { nombre: nombre || l, cantidad: cantidad || '' }; });
      const pasos = recetaPasosRaw.split('\n').filter(l => l.trim());
      const recipeData = { food_id: foodData.id, tiempo: recetaTiempo, dificultad: recetaDificultad, porciones: recetaPorciones, ingredientes, pasos, consejo: recetaConsejo, updated_at: new Date() };
      const { error: recipeError } = await sb.from('recipes').upsert(recipeData, { onConflict: 'food_id' });
      if (recipeError) console.error('Error guardando receta:', recipeError);
    } else { await sb.from('recipes').delete().eq('food_id', foodData.id); }
    mostrarToast(id ? '✅ Alimento actualizado' : '✅ Alimento creado');
    cerrarModalAlimento();
    await cargarAlimentosAdmin();
    await cargarDatosDinamicos();
  } catch (err) { console.error('Error guardando alimento:', err); }
}

async function toggleAlimento(id, active) {
  try {
    const { error } = await sb.from('foods').update({ active }).eq('id', id);
    if (error) { mostrarToast('❌ Error'); return; }
    mostrarToast(active ? '✅ Alimento activado' : '⏸️ Alimento ocultado');
    await cargarAlimentosAdmin();
    await cargarDatosDinamicos();
  } catch (err) { console.error('Error toggling alimento:', err); }
}

async function eliminarAlimento(id) {
  if (!confirm('¿Eliminar este alimento y su receta?')) return;
  try {
    await sb.from('recipes').delete().eq('food_id', id);
    const { error } = await sb.from('foods').delete().eq('id', id);
    if (error) { mostrarToast('❌ Error'); return; }
    mostrarToast('🗑️ Alimento eliminado');
    await cargarAlimentosAdmin();
    await cargarDatosDinamicos();
  } catch (err) { console.error('Error eliminando alimento:', err); }
}

// ============================================
// 5. SINCRONIZACIÓN Y CONFIGURACIÓN
// ============================================
async function forzarSincronizacion() {
  if (!appIsOnline) { mostrarToast('⚠️ No hay conexión.'); return; }
  await processOfflineQueue();
  document.getElementById('configCola').textContent = getOfflineQueue().length;
}

function limpiarColaOffline() {
  if (!confirm('¿Limpiar toda la cola offline?')) return;
  clearOfflineQueue();
  document.getElementById('configCola').textContent = '0';
  mostrarToast('🗑️ Cola offline limpiada');
}

// ============================================
// 6. NAVEGACIÓN DEL PANEL ADMIN
// ============================================
document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.admin-tab').forEach(t => { t.classList.remove('active', 'border-teal-600', 'text-teal-600'); t.classList.add('border-transparent', 'text-slate-500'); });
    tab.classList.add('active', 'border-teal-600', 'text-teal-600');
    tab.classList.remove('border-transparent', 'text-slate-500');
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById('admin-' + tab.dataset.atab).classList.remove('hidden');
  });
});

console.log('[NutriPro] admin.js cargado correctamente');
