/* ============================================
   NUTRIPRO - DATOS DE ALIMENTOS, RECETAS Y LOGROS
   ============================================ */

// ============================================
// 1. BASE DE DATOS DE ALIMENTOS MEDITERRÁNEOS
// ============================================

var ALIMENTOS_DB = {
  // PROTEÍNAS (24 alimentos)
  'p1': { id: 'p1', grupo: 'prot', nombre: 'Pechuga de pollo a la plancha', kcal: 165, prot: 31, ing: ['pollo', 'aceite de oliva', 'sal', 'limón'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'p2': { id: 'p2', grupo: 'prot', nombre: 'Salmón al horno con limón', kcal: 208, prot: 22, ing: ['salmón', 'aceite de oliva', 'limón', 'eneldo', 'ajo'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'p3': { id: 'p3', grupo: 'prot', nombre: 'Merluza a la plancha', kcal: 90, prot: 20, ing: ['merluza', 'aceite de oliva', 'perejil', 'ajo'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'p4': { id: 'p4', grupo: 'prot', nombre: 'Sardinas a la plancha', kcal: 180, prot: 25, ing: ['sardinas', 'aceite de oliva', 'limón', 'sal'], temporada: 'verano', es_fruta: false, active: true },
  'p5': { id: 'p5', grupo: 'prot', nombre: 'Atún fresco a la plancha', kcal: 144, prot: 23, ing: ['atún', 'aceite de oliva', 'romero', 'ajo'], temporada: 'verano', es_fruta: false, active: true },
  'p6': { id: 'p6', grupo: 'prot', nombre: 'Caballa al horno', kcal: 175, prot: 24, ing: ['caballa', 'aceite de oliva', 'limón', 'perejil'], temporada: 'primavera', es_fruta: false, active: true },
  'p7': { id: 'p7', grupo: 'prot', nombre: 'Boquerones frescos fritos', kcal: 160, prot: 22, ing: ['boquerones', 'harina integral', 'aceite de oliva', 'sal'], temporada: 'verano', es_fruta: false, active: true },
  'p8': { id: 'p8', grupo: 'prot', nombre: 'Bacalao al horno con verduras', kcal: 110, prot: 24, ing: ['bacalao', 'tomate', 'pimiento', 'cebolla', 'aceite de oliva'], temporada: 'invierno', es_fruta: false, active: true },
  'p9': { id: 'p9', grupo: 'prot', nombre: 'Dorada a la sal', kcal: 120, prot: 22, ing: ['dorada', 'sal gruesa', 'limón'], temporada: 'otoño', es_fruta: false, active: true },
  'p10': { id: 'p10', grupo: 'prot', nombre: 'Lubina al horno', kcal: 115, prot: 21, ing: ['lubina', 'aceite de oliva', 'limón', 'tomate cherry'], temporada: 'primavera', es_fruta: false, active: true },
  'p11': { id: 'p11', grupo: 'prot', nombre: 'Sepia a la plancha', kcal: 95, prot: 18, ing: ['sepia', 'aceite de oliva', 'ajo', 'perejil'], temporada: 'verano', es_fruta: false, active: true },
  'p12': { id: 'p12', grupo: 'prot', nombre: 'Pulpo a la gallega', kcal: 130, prot: 25, ing: ['pulpo', 'patata', 'pimentón', 'aceite de oliva'], temporada: 'otoño', es_fruta: false, active: true },
  'p13': { id: 'p13', grupo: 'prot', nombre: 'Gambas al ajillo', kcal: 110, prot: 24, ing: ['gambas', 'aceite de oliva', 'ajo', 'guindilla'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'p14': { id: 'p14', grupo: 'prot', nombre: 'Mejillones al vapor', kcal: 85, prot: 12, ing: ['mejillones', 'vino blanco', 'cebolla', 'perejil'], temporada: 'invierno', es_fruta: false, active: true },
  'p15': { id: 'p15', grupo: 'prot', nombre: 'Pavo a la plancha', kcal: 135, prot: 29, ing: ['pavo', 'aceite de oliva', 'romero', 'ajo'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'p16': { id: 'p16', grupo: 'prot', nombre: 'Solomillo de ternera', kcal: 180, prot: 28, ing: ['ternera', 'aceite de oliva', 'sal', 'pimienta'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'p17': { id: 'p17', grupo: 'prot', nombre: 'Conejo al ajillo', kcal: 150, prot: 25, ing: ['conejo', 'aceite de oliva', 'ajo', 'vino blanco', 'tomillo'], temporada: 'otoño', es_fruta: false, active: true },
  'p18': { id: 'p18', grupo: 'prot', nombre: 'Tortilla francesa (2 huevos)', kcal: 180, prot: 14, ing: ['huevos', 'aceite de oliva', 'sal'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'p19': { id: 'p19', grupo: 'prot', nombre: 'Huevos revueltos con espárragos', kcal: 165, prot: 13, ing: ['huevos', 'espárragos', 'aceite de oliva', 'sal'], temporada: 'primavera', es_fruta: false, active: true },
  'p20': { id: 'p20', grupo: 'prot', nombre: 'Queso fresco batido', kcal: 95, prot: 12, ing: ['queso fresco'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'p21': { id: 'p21', grupo: 'prot', nombre: 'Garbanzos cocidos con espinacas', kcal: 190, prot: 11, ing: ['garbanzos', 'espinacas', 'ajo', 'comino', 'aceite de oliva'], temporada: 'invierno', es_fruta: false, active: true },
  'p22': { id: 'p22', grupo: 'prot', nombre: 'Lentejas estofadas con verduras', kcal: 180, prot: 12, ing: ['lentejas', 'zanahoria', 'patata', 'pimiento', 'cebolla', 'aceite de oliva'], temporada: 'invierno', es_fruta: false, active: true },
  'p23': { id: 'p23', grupo: 'prot', nombre: 'Alubias blancas con almejas', kcal: 195, prot: 13, ing: ['alubias', 'almejas', 'cebolla', 'ajo', 'laurel', 'aceite de oliva'], temporada: 'otoño', es_fruta: false, active: true },
  'p24': { id: 'p24', grupo: 'prot', nombre: 'Tofu salteado con verduras', kcal: 144, prot: 15, ing: ['tofu', 'pimiento', 'calabacín', 'salsa de soja', 'aceite de sésamo'], temporada: 'todo_el_año', es_fruta: false, active: true },

  // CARBOHIDRATOS (15 alimentos)
  'c1': { id: 'c1', grupo: 'carb', nombre: 'Arroz integral', kcal: 220, prot: 5, ing: ['arroz integral', 'agua', 'sal'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'c2': { id: 'c2', grupo: 'carb', nombre: 'Arroz bomba (tipo paella)', kcal: 215, prot: 4, ing: ['arroz bomba', 'caldo de verduras', 'azafrán'], temporada: 'verano', es_fruta: false, active: true },
  'c3': { id: 'c3', grupo: 'carb', nombre: 'Pasta integral', kcal: 230, prot: 8, ing: ['pasta integral', 'agua', 'sal'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'c4': { id: 'c4', grupo: 'carb', nombre: 'Cuscús integral', kcal: 210, prot: 7, ing: ['cuscús integral', 'agua', 'sal'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'c5': { id: 'c5', grupo: 'carb', nombre: 'Quinoa', kcal: 222, prot: 8, ing: ['quinoa', 'agua', 'sal'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'c6': { id: 'c6', grupo: 'carb', nombre: 'Bulgur', kcal: 200, prot: 7, ing: ['bulgur', 'agua', 'sal'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'c7': { id: 'c7', grupo: 'carb', nombre: 'Pan integral de pueblo', kcal: 170, prot: 6, ing: ['pan integral', 'harina integral', 'agua', 'levadura', 'sal'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'c8': { id: 'c8', grupo: 'carb', nombre: 'Pan de centeno', kcal: 175, prot: 7, ing: ['pan de centeno', 'harina de centeno', 'agua', 'levadura'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'c9': { id: 'c9', grupo: 'carb', nombre: 'Patata asada con piel', kcal: 160, prot: 4, ing: ['patata', 'aceite de oliva', 'romero', 'sal'], temporada: 'otoño', es_fruta: false, active: true },
  'c10': { id: 'c10', grupo: 'carb', nombre: 'Boniato al horno', kcal: 175, prot: 3, ing: ['boniato', 'aceite de oliva', 'canela'], temporada: 'otoño', es_fruta: false, active: true },
  'c11': { id: 'c11', grupo: 'carb', nombre: 'Avena en copos', kcal: 190, prot: 6, ing: ['avena', 'agua o leche'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'c12': { id: 'c12', grupo: 'carb', nombre: 'Tortilla de patatas (light)', kcal: 185, prot: 9, ing: ['patata', 'huevos', 'cebolla', 'aceite de oliva'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'c13': { id: 'c13', grupo: 'carb', nombre: 'Gazpacho andaluz', kcal: 95, prot: 2, ing: ['tomate', 'pepino', 'pimiento', 'cebolla', 'ajo', 'aceite de oliva', 'vinagre'], temporada: 'verano', es_fruta: false, active: true },
  'c14': { id: 'c14', grupo: 'carb', nombre: 'Salmorejo cordobés', kcal: 145, prot: 3, ing: ['tomate', 'pan del día anterior', 'ajo', 'aceite de oliva', 'vinagre'], temporada: 'verano', es_fruta: false, active: true },
  'c15': { id: 'c15', grupo: 'carb', nombre: 'Escalivada catalana', kcal: 120, prot: 2, ing: ['berenjena', 'pimiento', 'cebolla', 'tomate', 'aceite de oliva'], temporada: 'verano', es_fruta: false, active: true },

  // VERDURAS (25 alimentos)
  'v1': { id: 'v1', grupo: 'verd', nombre: 'Ensalada mixta mediterránea', kcal: 85, prot: 3, ing: ['lechuga', 'tomate', 'pepino', 'cebolla', 'aceitunas', 'aceite de oliva'], temporada: 'verano', es_fruta: false, active: true },
  'v2': { id: 'v2', grupo: 'verd', nombre: 'Ensalada griega', kcal: 120, prot: 4, ing: ['tomate', 'pepino', 'cebolla morada', 'queso feta', 'aceitunas', 'aceite de oliva', 'orégano'], temporada: 'verano', es_fruta: false, active: true },
  'v3': { id: 'v3', grupo: 'verd', nombre: 'Tomate aliñado con AOVE', kcal: 75, prot: 2, ing: ['tomate', 'aceite de oliva virgen extra', 'sal', 'orégano'], temporada: 'verano', es_fruta: false, active: true },
  'v4': { id: 'v4', grupo: 'verd', nombre: 'Pimientos del piquillo rellenos', kcal: 110, prot: 5, ing: ['pimientos del piquillo', 'atún', 'cebolla', 'aceite de oliva'], temporada: 'otoño', es_fruta: false, active: true },
  'v5': { id: 'v5', grupo: 'verd', nombre: 'Berenjenas rellenas de carne', kcal: 165, prot: 12, ing: ['berenjena', 'carne picada', 'tomate', 'cebolla', 'ajo', 'aceite de oliva'], temporada: 'verano', es_fruta: false, active: true },
  'v6': { id: 'v6', grupo: 'verd', nombre: 'Calabacín relleno', kcal: 135, prot: 8, ing: ['calabacín', 'arroz integral', 'verduras', 'aceite de oliva'], temporada: 'verano', es_fruta: false, active: true },
  'v7': { id: 'v7', grupo: 'verd', nombre: 'Alcachofas a la plancha', kcal: 65, prot: 3, ing: ['alcachofas', 'aceite de oliva', 'limón', 'ajo'], temporada: 'primavera', es_fruta: false, active: true },
  'v8': { id: 'v8', grupo: 'verd', nombre: 'Espárragos trigueros a la plancha', kcal: 55, prot: 4, ing: ['espárragos trigueros', 'aceite de oliva', 'sal'], temporada: 'primavera', es_fruta: false, active: true },
  'v9': { id: 'v9', grupo: 'verd', nombre: 'Judías verdes con jamón', kcal: 95, prot: 5, ing: ['judías verdes', 'jamón serrano', 'cebolla', 'aceite de oliva'], temporada: 'primavera', es_fruta: false, active: true },
  'v10': { id: 'v10', grupo: 'verd', nombre: 'Espinacas salteadas con pasas y piñones', kcal: 125, prot: 6, ing: ['espinacas', 'pasas', 'piñones', 'ajo', 'aceite de oliva'], temporada: 'invierno', es_fruta: false, active: true },
  'v11': { id: 'v11', grupo: 'verd', nombre: 'Acelgas con garbanzos', kcal: 145, prot: 7, ing: ['acelgas', 'garbanzos', 'ajo', 'comino', 'aceite de oliva'], temporada: 'invierno', es_fruta: false, active: true },
  'v12': { id: 'v12', grupo: 'verd', nombre: 'Brócoli al vapor con AOVE', kcal: 70, prot: 4, ing: ['brócoli', 'aceite de oliva virgen extra', 'ajo', 'limón'], temporada: 'otoño', es_fruta: false, active: true },
  'v13': { id: 'v13', grupo: 'verd', nombre: 'Coliflor al horno con especias', kcal: 85, prot: 4, ing: ['coliflor', 'aceite de oliva', 'cúrcuma', 'comino'], temporada: 'otoño', es_fruta: false, active: true },
  'v14': { id: 'v14', grupo: 'verd', nombre: 'Zanahoria asada con miel', kcal: 95, prot: 2, ing: ['zanahoria', 'aceite de oliva', 'miel', 'romero'], temporada: 'otoño', es_fruta: false, active: true },
  'v15': { id: 'v15', grupo: 'verd', nombre: 'Champiñones al ajillo', kcal: 75, prot: 4, ing: ['champiñones', 'ajo', 'perejil', 'aceite de oliva'], temporada: 'otoño', es_fruta: false, active: true },
  'v16': { id: 'v16', grupo: 'verd', nombre: 'Setas salteadas', kcal: 65, prot: 3, ing: ['setas variadas', 'ajo', 'perejil', 'aceite de oliva'], temporada: 'otoño', es_fruta: false, active: true },
  'v17': { id: 'v17', grupo: 'verd', nombre: 'Pisto manchego', kcal: 110, prot: 3, ing: ['calabacín', 'berenjena', 'pimiento', 'tomate', 'cebolla', 'aceite de oliva'], temporada: 'verano', es_fruta: false, active: true },
  'v18': { id: 'v18', grupo: 'verd', nombre: 'Menestra de verduras', kcal: 95, prot: 4, ing: ['alcachofas', 'guisantes', 'judías verdes', 'zanahoria', 'aceite de oliva'], temporada: 'primavera', es_fruta: false, active: true },
  'v19': { id: 'v19', grupo: 'verd', nombre: 'Verduras a la parrilla', kcal: 85, prot: 3, ing: ['berenjena', 'calabacín', 'pimiento', 'cebolla', 'aceite de oliva'], temporada: 'verano', es_fruta: false, active: true },
  'v20': { id: 'v20', grupo: 'verd', nombre: 'Coles de Bruselas asadas', kcal: 95, prot: 5, ing: ['coles de bruselas', 'aceite de oliva', 'ajo', 'limón'], temporada: 'invierno', es_fruta: false, active: true },
  'v21': { id: 'v21', grupo: 'verd', nombre: 'Puerros a la plancha', kcal: 70, prot: 2, ing: ['puerros', 'aceite de oliva', 'sal'], temporada: 'invierno', es_fruta: false, active: true },
  'v22': { id: 'v22', grupo: 'verd', nombre: 'Hinojo al horno', kcal: 65, prot: 2, ing: ['hinojo', 'aceite de oliva', 'limón', 'sal'], temporada: 'invierno', es_fruta: false, active: true },
  'v23': { id: 'v23', grupo: 'verd', nombre: 'Apio salteado', kcal: 55, prot: 2, ing: ['apio', 'aceite de oliva', 'ajo'], temporada: 'invierno', es_fruta: false, active: true },
  'v24': { id: 'v24', grupo: 'verd', nombre: 'Remolacha asada', kcal: 85, prot: 3, ing: ['remolacha', 'aceite de oliva', 'sal', 'pimienta'], temporada: 'otoño', es_fruta: false, active: true },
  'v25': { id: 'v25', grupo: 'verd', nombre: 'Col lombarda salteada', kcal: 75, prot: 3, ing: ['col lombarda', 'manzana', 'aceite de oliva', 'vinagre'], temporada: 'invierno', es_fruta: false, active: true },

  // GRASAS SALUDABLES (10 alimentos)
  'g1': { id: 'g1', grupo: 'grasa', nombre: 'Aceite de oliva virgen extra (1 cda)', kcal: 120, prot: 0, ing: ['aceite de oliva virgen extra'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'g2': { id: 'g2', grupo: 'grasa', nombre: 'Aceitunas verdes (30g)', kcal: 45, prot: 0, ing: ['aceitunas verdes'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'g3': { id: 'g3', grupo: 'grasa', nombre: 'Aceitunas negras (30g)', kcal: 50, prot: 0, ing: ['aceitunas negras'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'g4': { id: 'g4', grupo: 'grasa', nombre: 'Aguacate (1/2 unidad)', kcal: 120, prot: 2, ing: ['aguacate'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'g5': { id: 'g5', grupo: 'grasa', nombre: 'Almendras naturales (20g)', kcal: 120, prot: 4, ing: ['almendras'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'g6': { id: 'g6', grupo: 'grasa', nombre: 'Nueces (15g)', kcal: 100, prot: 2, ing: ['nueces'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'g7': { id: 'g7', grupo: 'grasa', nombre: 'Pistachos (15g)', kcal: 95, prot: 3, ing: ['pistachos'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'g8': { id: 'g8', grupo: 'grasa', nombre: 'Anacardos (15g)', kcal: 100, prot: 3, ing: ['anacardos'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'g9': { id: 'g9', grupo: 'grasa', nombre: 'Semillas de calabaza (15g)', kcal: 85, prot: 4, ing: ['semillas de calabaza'], temporada: 'otoño', es_fruta: false, active: true },
  'g10': { id: 'g10', grupo: 'grasa', nombre: 'Tahini (1 cda)', kcal: 90, prot: 3, ing: ['tahini', 'sésamo'], temporada: 'todo_el_año', es_fruta: false, active: true },

  // DESAYUNOS (12 alimentos)
  'd1': { id: 'd1', grupo: 'des', nombre: 'Tostada con tomate y AOVE (pan con tomate)', kcal: 180, prot: 5, ing: ['pan integral', 'tomate', 'aceite de oliva virgen extra', 'sal'], temporada: 'verano', es_fruta: false, active: true },
  'd2': { id: 'd2', grupo: 'des', nombre: 'Tostada con aguacate y huevo', kcal: 280, prot: 12, ing: ['pan integral', 'aguacate', 'huevo', 'aceite de oliva', 'sal'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'd3': { id: 'd3', grupo: 'des', nombre: 'Yogur natural con miel y nueces', kcal: 220, prot: 8, ing: ['yogur natural', 'miel', 'nueces'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'd4': { id: 'd4', grupo: 'des', nombre: 'Avena con frutas y nueces', kcal: 320, prot: 10, ing: ['avena', 'leche', 'plátano', 'nueces', 'canela'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'd5': { id: 'd5', grupo: 'des', nombre: 'Tortilla francesa con espinacas', kcal: 240, prot: 16, ing: ['huevos', 'espinacas', 'aceite de oliva', 'sal'], temporada: 'primavera', es_fruta: false, active: true },
  'd6': { id: 'd6', grupo: 'des', nombre: 'Café con leche y tostada integral', kcal: 200, prot: 7, ing: ['café', 'leche', 'pan integral', 'aceite de oliva'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'd7': { id: 'd7', grupo: 'des', nombre: 'Zumo de naranja natural y tostada', kcal: 220, prot: 6, ing: ['naranja', 'pan integral', 'tomate', 'aceite de oliva'], temporada: 'invierno', es_fruta: false, active: true },
  'd8': { id: 'd8', grupo: 'des', nombre: 'Batido de frutas natural', kcal: 180, prot: 5, ing: ['plátano', 'fresas', 'leche', 'miel'], temporada: 'verano', es_fruta: false, active: true },
  'd9': { id: 'd9', grupo: 'des', nombre: 'Galletas integrales caseras con queso fresco', kcal: 240, prot: 10, ing: ['galletas integrales', 'queso fresco', 'membrillo'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'd10': { id: 'd10', grupo: 'des', nombre: 'Tortita de arroz con aguacate', kcal: 190, prot: 4, ing: ['tortita de arroz', 'aguacate', 'limón', 'sal'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'd11': { id: 'd11', grupo: 'des', nombre: 'Porridge de avena con manzana', kcal: 280, prot: 8, ing: ['avena', 'leche', 'manzana', 'canela', 'miel'], temporada: 'otoño', es_fruta: false, active: true },
  'd12': { id: 'd12', grupo: 'des', nombre: 'Huevos revueltos con tomate', kcal: 220, prot: 14, ing: ['huevos', 'tomate', 'aceite de oliva', 'sal'], temporada: 'verano', es_fruta: false, active: true },

  // MERIENDAS (12 alimentos)
  'm1': { id: 'm1', grupo: 'mer', nombre: 'Fruta de temporada (manzana/pera)', kcal: 95, prot: 1, ing: ['fruta de temporada'], temporada: 'otoño', es_fruta: true, active: true },
  'm2': { id: 'm2', grupo: 'mer', nombre: 'Yogur natural con frutos rojos', kcal: 150, prot: 7, ing: ['yogur natural', 'frutos rojos', 'miel'], temporada: 'verano', es_fruta: true, active: true },
  'm3': { id: 'm3', grupo: 'mer', nombre: 'Hummus con bastones de zanahoria', kcal: 160, prot: 6, ing: ['hummus', 'zanahoria', 'aceite de oliva'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'm4': { id: 'm4', grupo: 'mer', nombre: 'Queso fresco con membrillo', kcal: 170, prot: 8, ing: ['queso fresco', 'membrillo'], temporada: 'otoño', es_fruta: false, active: true },
  'm5': { id: 'm5', grupo: 'mer', nombre: 'Puñado de frutos secos variados', kcal: 180, prot: 5, ing: ['almendras', 'nueces', 'anacardos'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'm6': { id: 'm6', grupo: 'mer', nombre: 'Tostada integral con jamón serrano', kcal: 165, prot: 10, ing: ['pan integral', 'jamón serrano', 'tomate'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'm7': { id: 'm7', grupo: 'mer', nombre: 'Batido de plátano y leche', kcal: 200, prot: 7, ing: ['plátano', 'leche', 'canela'], temporada: 'todo_el_año', es_fruta: true, active: true },
  'm8': { id: 'm8', grupo: 'mer', nombre: 'Galletas de avena caseras', kcal: 180, prot: 4, ing: ['avena', 'miel', 'aceite de oliva', 'canela'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'm9': { id: 'm9', grupo: 'mer', nombre: 'Aceitunas con pan integral', kcal: 150, prot: 4, ing: ['aceitunas', 'pan integral'], temporada: 'todo_el_año', es_fruta: false, active: true },
  'm10': { id: 'm10', grupo: 'mer', nombre: 'Palitos de apio con hummus', kcal: 120, prot: 5, ing: ['apio', 'hummus'], temporada: 'invierno', es_fruta: false, active: true },
  'm11': { id: 'm11', grupo: 'mer', nombre: 'Rodajas de pepino con queso fresco', kcal: 110, prot: 6, ing: ['pepino', 'queso fresco', 'sal'], temporada: 'verano', es_fruta: false, active: true },
  'm12': { id: 'm12', grupo: 'mer', nombre: 'Chocolate negro (2 onzas) y almendras', kcal: 190, prot: 4, ing: ['chocolate negro 70%', 'almendras'], temporada: 'todo_el_año', es_fruta: false, active: true }
};

// ============================================
// 2. BASE DE DATOS DE RECETAS
// ============================================

var RECETAS_DB = {
  'c13': { food_id: 'c13', tiempo: '15 min + 2h reposo', dificultad: 'Fácil', porciones: 4, ingredientes: [{ nombre: 'Tomates maduros', cantidad: '1 kg' }, { nombre: 'Pepino', cantidad: '1/2 unidad' }, { nombre: 'Pimiento verde', cantidad: '1/2 unidad' }, { nombre: 'Cebolla', cantidad: '1/4 unidad' }, { nombre: 'Ajo', cantidad: '1 diente' }, { nombre: 'Aceite de oliva virgen extra', cantidad: '100 ml' }, { nombre: 'Vinagre de Jerez', cantidad: '30 ml' }, { nombre: 'Sal', cantidad: 'al gusto' }], pasos: ['Lavar bien todas las verduras.', 'Trocear tomates, pepino, pimiento, cebolla y ajo.', 'Triturar todo con batidora hasta obtener textura fina.', 'Añadir aceite de oliva, vinagre y sal. Batir de nuevo.', 'Colar si se desea textura más fina.', 'Refrigerar mínimo 2 horas antes de servir.', 'Servir bien frío con tropezones de verdura por encima.'], consejo: 'Se conserva 3-4 días en la nevera. Cuanto más maduros los tomates, mejor sabor.' },
  'c14': { food_id: 'c14', tiempo: '20 min + 1h reposo', dificultad: 'Fácil', porciones: 4, ingredientes: [{ nombre: 'Tomates maduros', cantidad: '1 kg' }, { nombre: 'Pan del día anterior', cantidad: '200 g' }, { nombre: 'Ajo', cantidad: '1 diente' }, { nombre: 'Aceite de oliva virgen extra', cantidad: '150 ml' }, { nombre: 'Vinagre', cantidad: '30 ml' }, { nombre: 'Sal', cantidad: 'al gusto' }], pasos: ['Remojar el pan en agua 10 minutos.', 'Trocear los tomates.', 'Triturar tomates, pan escurrido y ajo.', 'Añadir aceite en hilo mientras se tritura.', 'Agregar vinagre y sal. Batir hasta emulsionar.', 'Refrigerar 1 hora.', 'Servir con huevo duro y jamón picado por encima.'], consejo: 'El pan debe ser del día anterior para mejor textura. El aceite debe añadirse en hilo fino.' },
  'v11': { food_id: 'v11', tiempo: '30 min', dificultad: 'Media', porciones: 4, ingredientes: [{ nombre: 'Espinacas frescas', cantidad: '500 g' }, { nombre: 'Garbanzos cocidos', cantidad: '400 g' }, { nombre: 'Ajo', cantidad: '3 dientes' }, { nombre: 'Comino molido', cantidad: '1 cdta' }, { nombre: 'Pimentón dulce', cantidad: '1 cdta' }, { nombre: 'Aceite de oliva virgen extra', cantidad: '80 ml' }, { nombre: 'Sal', cantidad: 'al gusto' }], pasos: ['Lavar bien las espinacas y escurrir.', 'Calentar aceite en sartén grande.', 'Dorar los ajos laminados.', 'Añadir comino y pimentón, remover 30 segundos.', 'Incorporar espinacas y saltear hasta que reduzcan.', 'Añadir garbanzos y mezclar bien.', 'Cocinar 5 minutos más. Rectificar de sal.'], consejo: 'Tradicional sevillano. Se puede añadir taquitos de jamón para versión no vegana.' },
  'v17': { food_id: 'v17', tiempo: '45 min', dificultad: 'Media', porciones: 4, ingredientes: [{ nombre: 'Calabacín', cantidad: '2 unidades' }, { nombre: 'Berenjena', cantidad: '1 grande' }, { nombre: 'Pimiento verde', cantidad: '1 unidad' }, { nombre: 'Pimiento rojo', cantidad: '1 unidad' }, { nombre: 'Tomate maduro', cantidad: '4 unidades' }, { nombre: 'Cebolla', cantidad: '1 grande' }, { nombre: 'Ajo', cantidad: '2 dientes' }, { nombre: 'Aceite de oliva virgen extra', cantidad: '100 ml' }, { nombre: 'Sal y pimienta', cantidad: 'al gusto' }], pasos: ['Trocear todas las verduras en dados pequeños.', 'Calentar aceite en cazuela amplia.', 'Sofreír cebolla y ajo hasta dorar.', 'Añadir pimientos y cocinar 10 minutos.', 'Incorporar berenjena y calabacín. Cocinar 10 min más.', 'Añadir tomate triturado y salpimentar.', 'Cocinar a fuego lento 20-25 minutos hasta que esté bien hecho.'], consejo: 'Se puede servir frío o caliente. Mejora de un día para otro. Perfecto con huevo poché encima.' },
  'p2': { food_id: 'p2', tiempo: '25 min', dificultad: 'Fácil', porciones: 2, ingredientes: [{ nombre: 'Lomos de salmón', cantidad: '2 unidades (300 g)' }, { nombre: 'Limón', cantidad: '1 unidad' }, { nombre: 'Aceite de oliva virgen extra', cantidad: '2 cdas' }, { nombre: 'Eneldo fresco', cantidad: '2 ramitas' }, { nombre: 'Ajo', cantidad: '2 dientes' }, { nombre: 'Sal y pimienta', cantidad: 'al gusto' }], pasos: ['Precalentar horno a 200°C.', 'Colocar salmón sobre papel de aluminio.', 'Mezclar aceite, zumo de limón, ajo picado y eneldo.', 'Verter mezcla sobre el salmón. Salpimentar.', 'Cerrar el aluminio formando paquete.', 'Hornear 15-18 minutos.', 'Abrir con cuidado y servir con rodajas de limón.'], consejo: 'El salmón está en su punto cuando se desmenuza fácil pero sigue rosado en el centro.' },
  'c2': { food_id: 'c2', tiempo: '50 min', dificultad: 'Media', porciones: 4, ingredientes: [{ nombre: 'Arroz bomba', cantidad: '320 g' }, { nombre: 'Alcachofas', cantidad: '6 unidades' }, { nombre: 'Judías verdes', cantidad: '200 g' }, { nombre: 'Garrofón', cantidad: '100 g' }, { nombre: 'Pimiento rojo', cantidad: '1/2 unidad' }, { nombre: 'Tomate triturado', cantidad: '200 g' }, { nombre: 'Azafrán', cantidad: '1 pizca' }, { nombre: 'Caldo de verduras', cantidad: '1 litro' }, { nombre: 'Aceite de oliva', cantidad: '80 ml' }, { nombre: 'Sal', cantidad: 'al gusto' }], pasos: ['Calentar aceite en paellera.', 'Sofreír verduras troceadas 10 minutos.', 'Añadir tomate y cocinar 5 minutos.', 'Incorporar arroz y remover 2 minutos.', 'Añadir caldo caliente y azafrán.', 'Cocinar 18-20 minutos sin remover.', 'Dejar reposar 5 minutos antes de servir.'], consejo: 'El arroz bomba absorbe mejor el caldo. No remover durante la cocción para que no suelte almidón.' },
  'p3': { food_id: 'p3', tiempo: '30 min', dificultad: 'Media', porciones: 4, ingredientes: [{ nombre: 'Lomos de merluza', cantidad: '4 unidades' }, { nombre: 'Cebolla', cantidad: '2 grandes' }, { nombre: 'Pimiento verde', cantidad: '1 unidad' }, { nombre: 'Tomate maduro', cantidad: '2 unidades' }, { nombre: 'Vino blanco', cantidad: '100 ml' }, { nombre: 'Aceite de oliva', cantidad: '80 ml' }, { nombre: 'Sal', cantidad: 'al gusto' }], pasos: ['Salpimentar la merluza y enharinar ligeramente.', 'Freír en aceite caliente 2 min por lado. Reservar.', 'En el mismo aceite, pochar cebolla y pimiento 15 min.', 'Añadir tomate triturado y cocinar 10 min.', 'Verter vino blanco y reducir.', 'Colocar merluza sobre la salsa.', 'Cocinar 5 minutos más a fuego suave.'], consejo: 'La salsa debe quedar melosa. Se puede añadir guindilla para toque picante.' },
  'c12': { food_id: 'c12', tiempo: '35 min', dificultad: 'Media', porciones: 4, ingredientes: [{ nombre: 'Patatas', cantidad: '600 g' }, { nombre: 'Huevos', cantidad: '6 unidades' }, { nombre: 'Cebolla', cantidad: '1 grande (opcional)' }, { nombre: 'Aceite de oliva', cantidad: '100 ml' }, { nombre: 'Sal', cantidad: 'al gusto' }], pasos: ['Pelar y cortar patatas en láminas finas.', 'Freír en aceite a fuego medio 20 min. Escurrir.', 'Batir huevos con sal.', 'Mezclar patatas con huevo. Dejar reposar 5 min.', 'Cuajar en sartén antiadherente 3 min.', 'Dar la vuelta con ayuda de un plato.', 'Cuajar 2 min más. Debe quedar jugosa por dentro.'], consejo: 'El truco está en el punto de cuajado: debe quedar cremosa por dentro. Se puede hacer sin cebolla.' },
  'p12': { food_id: 'p12', tiempo: '90 min', dificultad: 'Media', porciones: 4, ingredientes: [{ nombre: 'Pulpo', cantidad: '1 kg' }, { nombre: 'Patatas', cantidad: '4 grandes' }, { nombre: 'Pimentón de la Vera', cantidad: '2 cdas' }, { nombre: 'Aceite de oliva virgen extra', cantidad: '80 ml' }, { nombre: 'Sal gruesa', cantidad: 'al gusto' }], pasos: ['Congelar el pulpo 48h antes (rompe fibras).', 'Hervir agua con sal. Asustar el pulpo 3 veces (meter y sacar).', 'Cocinar 40-50 min hasta que esté tierno.', 'Cocer patatas en el mismo caldo.', 'Escurrir pulpo y cortar en rodajas.', 'Servir sobre patatas troceadas.', 'Espolvorear pimentón y regar con aceite de oliva.'], consejo: 'El pimentón debe añadirse al final para que no amargue. La textura debe ser tierna pero firme.' },
  'v2': { food_id: 'v2', tiempo: '15 min', dificultad: 'Fácil', porciones: 4, ingredientes: [{ nombre: 'Tomates maduros', cantidad: '4 grandes' }, { nombre: 'Pepino', cantidad: '1 grande' }, { nombre: 'Cebolla morada', cantidad: '1/2 unidad' }, { nombre: 'Queso feta', cantidad: '200 g' }, { nombre: 'Aceitunas kalamata', cantidad: '100 g' }, { nombre: 'Aceite de oliva virgen extra', cantidad: '80 ml' }, { nombre: 'Orégano', cantidad: '1 cdta' }, { nombre: 'Sal', cantidad: 'al gusto' }], pasos: ['Cortar tomates en gajos grandes.', 'Pelar y rodajas pepino (no muy fino).', 'Cortar cebolla en aros finos.', 'Colocar todo en fuente.', 'Añadir aceitunas.', 'Poner bloque de feta encima (no desmenuzar).', 'Regar con aceite, orégano y sal.'], consejo: 'El feta debe ser auténtico griego. Nunca mezclar, cada comensal se sirve a su gusto.' },
  'v7': { food_id: 'v7', tiempo: '25 min', dificultad: 'Fácil', porciones: 4, ingredientes: [{ nombre: 'Alcachofas frescas', cantidad: '8 unidades' }, { nombre: 'Aceite de oliva virgen extra', cantidad: '60 ml' }, { nombre: 'Limón', cantidad: '1/2 unidad' }, { nombre: 'Ajo', cantidad: '2 dientes' }, { nombre: 'Sal y pimienta', cantidad: 'al gusto' }], pasos: ['Limpiar alcachofas: quitar hojas externas duras.', 'Cortar tallo y puntas. Partir por la mitad.', 'Frotar con limón para que no se oxiden.', 'Calentar plancha o sartén con aceite.', 'Colocar alcachofas cara cortada abajo.', 'Cocinar 8-10 min hasta dorar.', 'Dar vuelta, añadir ajo laminado. 5 min más.'], consejo: 'Deben quedar doradas por fuera y tiernas por dentro. El limón es clave para el sabor.' },
  'v8': { food_id: 'v8', tiempo: '15 min', dificultad: 'Fácil', porciones: 4, ingredientes: [{ nombre: 'Espárragos trigueros', cantidad: '2 manojos' }, { nombre: 'Aceite de oliva virgen extra', cantidad: '50 ml' }, { nombre: 'Sal en escamas', cantidad: 'al gusto' }], pasos: ['Lavar espárragos y secar bien.', 'Cortar parte dura del tallo (2-3 cm).', 'Calentar plancha a fuego fuerte.', 'Colocar espárragos en fila.', 'Cocinar 3-4 min por cada lado.', 'Retirar cuando estén tiernos pero firmes.', 'Aliñar con aceite y sal en escamas.'], consejo: 'No cocinar en exceso, deben quedar al dente. La sal en escamas realza el sabor.' },
  'v5': { food_id: 'v5', tiempo: '60 min', dificultad: 'Media', porciones: 4, ingredientes: [{ nombre: 'Berenjenas grandes', cantidad: '4 unidades' }, { nombre: 'Carne picada mixta', cantidad: '400 g' }, { nombre: 'Cebolla', cantidad: '1 grande' }, { nombre: 'Tomate triturado', cantidad: '200 g' }, { nombre: 'Ajo', cantidad: '2 dientes' }, { nombre: 'Aceite de oliva', cantidad: '60 ml' }, { nombre: 'Sal, pimienta, orégano', cantidad: 'al gusto' }], pasos: ['Partir berenjenas por la mitad longitudinalmente.', 'Vaciar con cuchara (reservar pulpa).', 'Salar y dejar 30 min para que suden.', 'Sofreír cebolla y ajo. Añadir carne.', 'Incorporar pulpa de berenjena picada.', 'Añadir tomate y especias. Cocinar 15 min.', 'Rellenar berenjenas. Hornear 25 min a 180°C.'], consejo: 'Salar las berenjenas elimina el amargor. Se puede gratinar con queso al final.' },
  'v9': { food_id: 'v9', tiempo: '35 min', dificultad: 'Fácil', porciones: 4, ingredientes: [{ nombre: 'Judías verdes', cantidad: '600 g' }, { nombre: 'Jamón serrano', cantidad: '100 g' }, { nombre: 'Cebolla', cantidad: '1 pequeña' }, { nombre: 'Aceite de oliva', cantidad: '40 ml' }, { nombre: 'Sal', cantidad: 'al gusto' }], pasos: ['Limpiar judías y cortar puntas.', 'Cocer en agua con sal 20 min. Escurrir.', 'Picar cebolla y jamón en taquitos.', 'Sofreír cebolla en aceite.', 'Añadir jamón y dorar.', 'Incorporar judías y saltear 5 min.', 'Rectificar de sal y servir.'], consejo: 'Las judías deben quedar al dente, no pasadas. El jamón aporta umami.' },
  'v15': { food_id: 'v15', tiempo: '15 min', dificultad: 'Fácil', porciones: 4, ingredientes: [{ nombre: 'Champiñones frescos', cantidad: '500 g' }, { nombre: 'Ajo', cantidad: '4 dientes' }, { nombre: 'Perejil fresco', cantidad: '1 manojo' }, { nombre: 'Aceite de oliva virgen extra', cantidad: '80 ml' }, { nombre: 'Sal y pimienta', cantidad: 'al gusto' }, { nombre: 'Guindilla (opcional)', cantidad: '1 unidad' }], pasos: ['Limpiar champiñones con paño húmedo.', 'Laminar o cortar en cuartos.', 'Laminar ajos finamente.', 'Calentar aceite en sartén amplia.', 'Dorar ajos (sin quemar).', 'Añadir champiñones y saltear 5-7 min.', 'Agregar perejil picado, sal y pimienta.'], consejo: 'Los champiñones sueltan agua, cocinar hasta que se evapore. El perejil al final para que no se queme.' },
  'd1': { food_id: 'd1', tiempo: '5 min', dificultad: 'Fácil', porciones: 1, ingredientes: [{ nombre: 'Pan integral de pueblo', cantidad: '2 rebanadas' }, { nombre: 'Tomate maduro', cantidad: '1 grande' }, { nombre: 'Aceite de oliva virgen extra', cantidad: '2 cdas' }, { nombre: 'Sal', cantidad: 'al gusto' }], pasos: ['Tostar el pan ligeramente.', 'Cortar tomate por la mitad.', 'Frotar tomate sobre el pan (como rallador).', 'Regar con aceite de oliva virgen extra.', 'Añadir sal al gusto.', 'Opcional: añadir jamón serrano o queso fresco.'], consejo: 'El tomate debe estar muy maduro. El pan debe ser del día anterior para mejor textura.' },
  'm3': { food_id: 'm3', tiempo: '15 min + reposo', dificultad: 'Fácil', porciones: 4, ingredientes: [{ nombre: 'Garbanzos cocidos', cantidad: '400 g' }, { nombre: 'Tahini', cantidad: '3 cdas' }, { nombre: 'Limón', cantidad: '1 unidad' }, { nombre: 'Ajo', cantidad: '1 diente' }, { nombre: 'Aceite de oliva virgen extra', cantidad: '50 ml' }, { nombre: 'Comino', cantidad: '1/2 cdta' }, { nombre: 'Sal', cantidad: 'al gusto' }], pasos: ['Escurrir garbanzos (reservar líquido).', 'Triturar garbanzos con tahini, ajo y limón.', 'Añadir aceite en hilo mientras se tritura.', 'Agregar comino y sal.', 'Ajustar textura con líquido de cocción.', 'Refrigerar 1 hora.', 'Servir con aceite de oliva y pimentón por encima.'], consejo: 'Cuanto más tiempo repose, mejor sabor. Se conserva 5 días en nevera.' },
  'm4': { food_id: 'm4', tiempo: '5 min', dificultad: 'Fácil', porciones: 2, ingredientes: [{ nombre: 'Queso fresco batido', cantidad: '200 g' }, { nombre: 'Membrillo', cantidad: '100 g' }, { nombre: 'Nueces (opcional)', cantidad: '20 g' }], pasos: ['Cortar queso fresco en rodajas gruesas.', 'Colocar en plato.', 'Añadir membrillo en trozos al lado.', 'Opcional: añadir nueces troceadas.', 'Servir inmediatamente.'], consejo: 'Clásico español. El contraste dulce-salado es perfecto. Se puede añadir miel.' },
  'm7': { food_id: 'm7', tiempo: '5 min', dificultad: 'Fácil', porciones: 1, ingredientes: [{ nombre: 'Plátano maduro', cantidad: '1 unidad' }, { nombre: 'Leche', cantidad: '250 ml' }, { nombre: 'Canela', cantidad: '1 pizca' }, { nombre: 'Miel (opcional)', cantidad: '1 cdta' }], pasos: ['Pelar plátano.', 'Trocear.', 'Añadir leche.', 'Batir hasta obtener textura cremosa.', 'Añadir canela.', 'Opcional: miel al gusto.', 'Servir inmediatamente.'], consejo: 'El plátano debe estar maduro para más dulzor natural. Se puede añadir avena para más consistencia.' },
  'p4': { food_id: 'p4', tiempo: '15 min', dificultad: 'Fácil', porciones: 2, ingredientes: [{ nombre: 'Sardinas frescas', cantidad: '8 unidades' }, { nombre: 'Aceite de oliva virgen extra', cantidad: '30 ml' }, { nombre: 'Limón', cantidad: '1/2 unidad' }, { nombre: 'Sal gruesa', cantidad: 'al gusto' }], pasos: ['Limpiar sardinas: quitar cabeza y vísceras.', 'Lavar y secar bien.', 'Salpimentar.', 'Calentar plancha a fuego fuerte.', 'Colocar sardinas 3-4 min por lado.', 'Retirar cuando piel esté crujiente.', 'Aliñar con aceite y limón.'], consejo: 'Las sardinas frescas del día son clave. La piel debe quedar crujiente.' }
};

// ============================================
// 3. SISTEMA DE LOGROS (FASE 3)
// ============================================

var LOGROS_DB = [
  { id: 'primera_evaluacion', nombre: 'Primera Evaluación', descripcion: 'Completaste tu primera evaluación nutricional', icono: '📋', categoria: 'básico', requisito: 1 },
  { id: 'primera_lista_compra', nombre: 'Comprador Organizado', descripcion: 'Generaste tu primera lista de la compra', icono: '🛒', categoria: 'básico', requisito: 1 },
  { id: 'primer_comentario', nombre: 'Voz de la Comunidad', descripcion: 'Publicaste tu primer comentario', icono: '💬', categoria: 'básico', requisito: 1 },
  { id: 'primer_batch_cooking', nombre: 'Chef Organizado', descripcion: 'Visitaste el modo Batch Cooking', icono: '🍳', categoria: 'básico', requisito: 1 },
  { id: 'primera_semana', nombre: 'Primera Semana', descripcion: 'Registraste peso durante 7 días', icono: '📅', categoria: 'seguimiento', requisito: 7 },
  { id: 'un_mes', nombre: 'Un Mes Constante', descripcion: '30 días desde tu evaluación', icono: '🥈', categoria: 'seguimiento', requisito: 30 },
  { id: 'tres_meses', nombre: 'Trayectoria Ejemplar', descripcion: '90 días usando NutriPro', icono: '🥇', categoria: 'seguimiento', requisito: 90 },
  { id: 'diez_favoritos', nombre: 'Coleccionista', descripcion: 'Guardaste 10 alimentos favoritos', icono: '❤️', categoria: 'interacción', requisito: 10 },
  { id: 'cincuenta_valoraciones', nombre: 'Crítico Gastronómico', descripcion: 'Valoraste 50 platos', icono: '⭐', categoria: 'interacción', requisito: 50 },
  { id: 'veinticinco_sustituciones', nombre: 'Explorador Culinario', descripcion: 'Hiciste 25 sustituciones de alimentos', icono: '🔄', categoria: 'interacción', requisito: 25 },
  { id: 'siete_dias_consecutivos', nombre: 'Racha Semanal', descripcion: '7 días consecutivos registrando peso', icono: '💪', categoria: 'consistencia', requisito: 7 },
  { id: 'treinta_dias_consecutivos', nombre: 'Racha Mensual', descripcion: '30 días consecutivos registrando peso', icono: '🔥', categoria: 'consistencia', requisito: 30 }
];

// ============================================
// 4. FUNCIONES DE UTILIDAD PARA DATOS
// ============================================

function obtenerAlimento(id) { return ALIMENTOS_DB[id] || null; }
function obtenerReceta(foodId) { return RECETAS_DB[foodId] || null; }
function obtenerLogro(id) { return LOGROS_DB.find(l => l.id === id) || null; }
function obtenerAlimentosPorGrupo(grupo) { return Object.values(ALIMENTOS_DB).filter(a => a.grupo === grupo && a.active); }
function obtenerAlimentosDeTemporada(estacion) { return Object.values(ALIMENTOS_DB).filter(a => a.active && (a.temporada === estacion || a.temporada === 'todo_el_año')); }

// Exportar para uso global
window.ALIMENTOS_DB = ALIMENTOS_DB;
window.RECETAS_DB = RECETAS_DB;
window.LOGROS_DB = LOGROS_DB;
window.obtenerAlimento = obtenerAlimento;
window.obtenerReceta = obtenerReceta;
window.obtenerLogro = obtenerLogro;
window.obtenerAlimentosPorGrupo = obtenerAlimentosPorGrupo;
window.obtenerAlimentosDeTemporada = obtenerAlimentosDeTemporada;

console.log('[NutriPro] Datos cargados: ' + Object.keys(ALIMENTOS_DB).length + ' alimentos, ' + Object.keys(RECETAS_DB).length + ' recetas, ' + LOGROS_DB.length + ' logros');
// ============================================================
// 5. CONSEJOS NUTRICIONALES PERSONALIZADOS (FASE 3 · PASO 2)
//    Banco declarativo + motor de selección puro (sin acoples).
//    app.js construye el contexto (ctx) y llama a estas funciones.
// ============================================================

var CONSEJOS_DB = [
  {
    id: 'saciedad_imc', cat: 'saciedad', icono: '🥗',
    titulo: 'Sacia sin pasar hambre',
    texto: 'Llena la mitad del plato con verduras, un cuarto con proteína y un cuarto con carbohidrato integral. El volumen y la fibra activan los receptores de saciedad del estómago antes de que el cerebro pida más.',
    fuente: 'Consenso clínico · plato saludable',
    cond: { objetivo: ['perder', 'perderSuave'], imcMin: 25 }
  },
  {
    id: 'proteina_cada_comida', cat: 'proteina', icono: '🥩',
    titulo: 'Proteína en cada comida',
    texto: 'Reparte 20‑30 g de proteína en desayuno, comida y cena. Mantener el aporte a lo largo del día protege la masa muscular durante el déficit y reduce los picos de hambre.',
    fuente: 'Consenso clínico · distribución proteica',
    cond: { objetivo: ['perder', 'perderSuave', 'mantener'] }
  },
  {
    id: 'proteina_edad', cat: 'proteina', icono: '💪',
    titulo: 'A partir de los 50, sube la proteína',
    texto: 'Con la edad aumenta la resistencia anabólica: el cuerpo necesita más proteína por toma para mantener el músculo. Combínala con trabajo de fuerza 2‑3 días por semana.',
    fuente: 'Consenso clínico · sarcopenia',
    cond: { edadMin: 50 }
  },
  {
    id: 'proteina_vegetal', cat: 'proteina', icono: '🌱',
    titulo: 'Proteína vegetal completa',
    texto: 'Combina legumbres con cereales (lentejas + arroz, garbanzos + pan integral) a lo largo del día: juntas aportan todos los aminoácidos esenciales sin necesidad de forzarlos en el mismo plato.',
    fuente: 'Consenso clínico · dieta vegetal',
    cond: { prefs: ['vegetariano', 'vegano'] }
  },
  {
    id: 'hierro_mujer', cat: 'micronutrientes', icono: '🩸',
    titulo: 'Hierro que se absorbe mejor',
    texto: 'Si menstrúas, tus necesidades de hierro son mayores. Acompaña las fuentes de hierro (legumbres, carnes, huevo) con vitamina C (tomate, pimiento, cítricos) y evita el té o café en esa misma comida.',
    fuente: 'EFSA · requerimientos de hierro',
    cond: { sexo: 'mujer' }
  },
  {
    id: 'hidratacion', cat: 'hidratacion', icono: '💧',
    titulo: 'Bebe antes de tener sed',
    texto: 'La sed ya es una señal tardía. Un vaso de agua al levantarte y otro antes de cada comida mejora el rendimiento, la digestión y ayuda a distinguir hambre real de sed.',
    fuente: 'EFSA · ingesta de agua',
    cond: { siempre: true }
  },
  {
    id: 'sueno', cat: 'sueno', icono: '😴',
    titulo: 'Dormir también es nutrición',
    texto: 'Dormir menos de 7 h altera la grelina y la leptina, las hormonas del hambre y la saciedad. Priorizar 7‑9 h es tan estratégico como ajustar las calorías.',
    fuente: 'Consenso clínico · sueño y metabolismo',
    cond: { siempre: true }
  },
  {
    id: 'neat', cat: 'movimiento', icono: '🚶',
    titulo: 'Muévete fuera del gimnasio',
    texto: 'El NEAT (caminar, estar de pie, las tareas diarias) puede sumar cientos de kcal al día sin "hacer ejercicio". Si tu actividad es baja, subir pasos es el cambio con mayor retorno.',
    fuente: 'Consenso clínico · gasto energético',
    cond: { actividadMax: 1.375 }
  },
  {
    id: 'temp_verano', cat: 'temporada', icono: '☀️',
    titulo: 'Aprovecha el verano en el plato',
    texto: 'Tomate, pepino, sandía y melón están en su mejor momento: más sabor, más agua y mejor precio. Un gazpacho o una ensalada densa en verduras cubren volumen e hidratación de golpe.',
    fuente: 'Productos de temporada',
    cond: { estacion: 'verano' }
  },
  {
    id: 'temp_otono', cat: 'temporada', icono: '🍂',
    titulo: 'El otoño pide raíz y legumbre',
    texto: 'Calabaza, boniato, setas y coles aportan fibra y saciedad en platos de cuchara. Las legumbres, estrella de la estación, combinan proteína y fibra a coste muy bajo.',
    fuente: 'Productos de temporada',
    cond: { estacion: 'otono' }
  },
  {
    id: 'temp_invierno', cat: 'temporada', icono: '❄️',
    titulo: 'Invierno: calor sin exceso',
    texto: 'Cremas de verduras, potajes de legumbres y cítricos de temporada dan confort y vitamina C. Prioriza cocciones que conserven el volumen del plato para saciarte mejor.',
    fuente: 'Productos de temporada',
    cond: { estacion: 'invierno' }
  },
  {
    id: 'temp_primavera', cat: 'temporada', icono: '🌸',
    titulo: 'Primavera verde',
    texto: 'Espárragos, alcachofas, habas y guisantes están en plena temporada: fibra, micronutrientes y mucha variedad. Rotarlos evita la monotonía del menú.',
    fuente: 'Productos de temporada',
    cond: { estacion: 'primavera' }
  },
  {
    id: 'fibra', cat: 'fibra', icono: '🌾',
    titulo: 'Meta de fibra diaria',
    texto: 'Busca 25‑30 g de fibra al día (verduras, legumbres, fruta con piel, integrales). La fibra modera el apetito, cuida la microbiota y estabiliza la glucosa tras las comidas.',
    fuente: 'EFSA · fibra dietética',
    cond: { siempre: true }
  },
  {
    id: 'grasas_buenas', cat: 'grasas', icono: '🥑',
    titulo: 'Grasa no es el enemigo',
    texto: 'Aceite de oliva virgen extra, frutos secos y aguacate aportan saciedad y ayudan a absorber vitaminas. Un puñado de frutos secos o un chorrito de AOVE cambian el plato sin dispararlo.',
    fuente: 'Consenso clínico · grasa saludable',
    cond: { siempre: true }
  },
  {
    id: 'ultraprocesados', cat: 'calidad', icono: '🍫',
    titulo: 'Reduce, no prohíbas',
    texto: 'Los ultraprocesados están diseñados para superar tu saciedad. No hace falta eliminarlos: basta con que no sean la base. Aplica la regla 80/20 y gana adherencia a largo plazo.',
    fuente: 'Consenso clínico · adherencia',
    cond: { objetivo: ['perder', 'perderSuave'] }
  },
  {
    id: 'alcohol', cat: 'calidad', icono: '🍷',
    titulo: 'Alcohol: calorías invisibles',
    texto: 'El alcohol aporta 7 kcal/g y frena la oxidación de grasa. Si bebes, modera y nunca lo cuentes como "inofensivo": es uno de los puntos ciegos más frecuentes en un déficit.',
    fuente: 'OMS · consumo de alcohol',
    cond: { siempre: true }
  },
  {
    id: 'mindful', cat: 'conducta', icono: '🧘',
    titulo: 'Come con atención',
    texto: 'Masticar despacio y sin pantallas permite que la señal de saciedad (tarda ~20 min) llegue a tiempo. Comer consciente reduce los atracones sin cambiar una sola receta.',
    fuente: 'Consenso clínico · conducta alimentaria',
    cond: { siempre: true }
  },
  {
    id: 'consistencia', cat: 'conducta', icono: '🎯',
    titulo: 'Consistencia > perfección',
    texto: 'Un día fuera del plan no arruina nada; abandonar sí. La reeducación alimentaria se gana por repetición, no por pureza. Vuelve al siguiente plato, sin castigos ni compensaciones.',
    fuente: 'Filosofía NutriPro',
    cond: { siempre: true }
  },
  {
    id: 'batch', cat: 'organizacion', icono: '🍳',
    titulo: 'Cocina una vez, come toda la semana',
    texto: 'Dedicar 2‑3 h el domingo a bases (legumbres, arroces, proteínas, verduras asadas) elimina la decisión improvisada entre semana, que es donde más se descarrila un déficit.',
    fuente: 'Estrategia de adherencia',
    cond: { siempre: true }
  },
  {
    id: 'sin_gluten', cat: 'restricciones', icono: '🌾',
    titulo: 'Sin gluten, sin carencias',
    texto: 'Si evitas el gluten, asegura fibra y energía con quinoa, arroz integral, boniato y legumbres. Revisa etiquetas: muchos "sin gluten" industriales son pobres en nutrientes.',
    fuente: 'Consenso clínico · dieta sin gluten',
    cond: { prefs: ['sinGluten'] }
  }
];

// ---- Motor de selección (funciones puras) ----

// Evalúa si un consejo aplica al contexto del usuario.
function consejoAplica(c, ctx) {
  ctx = ctx || {};
  var cond = c.cond || {};
  if (cond.siempre) return true;
  if (cond.objetivo && cond.objetivo.indexOf(ctx.objetivo) === -1) return false;
  if (typeof cond.imcMin === 'number' && (typeof ctx.imc !== 'number' || ctx.imc < cond.imcMin)) return false;
  if (typeof cond.imcMax === 'number' && (typeof ctx.imc !== 'number' || ctx.imc > cond.imcMax)) return false;
  if (typeof cond.edadMin === 'number' && (typeof ctx.edad !== 'number' || ctx.edad < cond.edadMin)) return false;
  if (typeof cond.edadMax === 'number' && (typeof ctx.edad !== 'number' || ctx.edad > cond.edadMax)) return false;
  if (cond.sexo && cond.sexo !== ctx.sexo) return false;
  if (typeof cond.actividadMax === 'number' && (typeof ctx.factor !== 'number' || ctx.factor > cond.actividadMax)) return false;
  if (cond.estacion) {
    var est = Array.isArray(cond.estacion) ? cond.estacion : [cond.estacion];
    if (est.indexOf(ctx.estacion) === -1) return false;
  }
  if (cond.prefs) {
    var up = ctx.prefs || [];
    var hit = cond.prefs.some(function (p) { return up.indexOf(p) !== -1; });
    if (!hit) return false;
  }
  if (cond.sinPrefs) {
    var up2 = ctx.prefs || [];
    var bloqueado = cond.sinPrefs.some(function (p) { return up2.indexOf(p) !== -1; });
    if (bloqueado) return false;
  }
  return true;
}

// Puntúa por especificidad: a más condiciones a medida, más relevante.
function puntuarConsejo(c) {
  var cond = c.cond || {};
  if (cond.siempre) return 1;
  var s = 2;
  if (cond.objetivo) s += 2;
  if (typeof cond.imcMin === 'number' || typeof cond.imcMax === 'number') s += 2;
  if (cond.prefs) s += 2;
  if (cond.estacion) s += 1;
  if (cond.sexo) s += 1;
  if (typeof cond.edadMin === 'number' || typeof cond.edadMax === 'number') s += 1;
  if (typeof cond.actividadMax === 'number') s += 1;
  return s;
}

// Devuelve los consejos aplicables, ordenados por relevancia (estable por id).
function calcularConsejosAplicables(ctx) {
  return CONSEJOS_DB
    .filter(function (c) { return consejoAplica(c, ctx); })
    .map(function (c) { return { consejo: c, score: puntuarConsejo(c) }; })
    .sort(function (a, b) { return b.score - a.score || (a.consejo.id < b.consejo.id ? -1 : 1); })
    .map(function (x) { return x.consejo; });
}

// Texto humano que explica POR QUÉ se personalizó un consejo.
function razonPersonalizacion(c, ctx) {
  var cond = c.cond || {};
  if (cond.objetivo && ctx && ctx.objetivoLabel) return 'Porque tu objetivo es ' + ctx.objetivoLabel;
  if (cond.prefs) return 'Adaptado a tu preferencia alimentaria';
  if (cond.estacion) return 'Porque estás en ' + (ctx && ctx.estacionLabel ? ctx.estacionLabel : 'esta estación');
  if (cond.sexo) return 'Ajustado a tus necesidades';
  if (typeof cond.edadMin === 'number') return 'Por tu rango de edad';
  if (typeof cond.actividadMax === 'number') return 'Por tu nivel de actividad actual';
  if (typeof cond.imcMin === 'number') return 'Por tu composición corporal actual';
  return 'Consejo general basado en evidencia';
}

// Hash determinista simple para elegir el consejo del día.
function hashSemilla(str) {
  var h = 0;
  for (var i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) | 0; }
  return Math.abs(h);
}

// Exportación global
window.CONSEJOS_DB = CONSEJOS_DB;
window.consejoAplica = consejoAplica;
window.puntuarConsejo = puntuarConsejo;
window.calcularConsejosAplicables = calcularConsejosAplicables;
window.razonPersonalizacion = razonPersonalizacion;
window.hashSemilla = hashSemilla;

console.log('[NutriPro] Consejos cargados: ' + CONSEJOS_DB.length + ' reglas de personalización');
// ============================================================
// 6. MODO DIABETES (FASE 4 · sub-paso 1.2)
//    Datos glucémicos ORIENTATIVOS por plato + reglas de consejo.
//    INERTES hasta que app.js alimente ctx.diabetes (sub-paso 1.5).
//    hc = hidratos por ración estándar (g); 1 ración de HC = 10 g.
//    ig = índice glucémico orientativo: 'bajo' | 'medio' | 'alto'.
//    NO son análisis de laboratorio: el usuario con diabetes debe
//    contrastar con su educación diabetológica / etiquetas / equipo.
// ============================================================

var GLUCEMIA_DB = {
  // PROTEÍNAS (HC ≈ 0; legumbres como plato sí cargan HC)
  'p1':  { hc: 0,  fibra: 0, ig: 'bajo' }, 'p2':  { hc: 0,  fibra: 0, ig: 'bajo' },
  'p3':  { hc: 0,  fibra: 0, ig: 'bajo' }, 'p4':  { hc: 0,  fibra: 0, ig: 'bajo' },
  'p5':  { hc: 0,  fibra: 0, ig: 'bajo' }, 'p6':  { hc: 0,  fibra: 0, ig: 'bajo' },
  'p7':  { hc: 6,  fibra: 1, ig: 'medio' }, 'p8':  { hc: 4,  fibra: 1, ig: 'bajo' },
  'p9':  { hc: 0,  fibra: 0, ig: 'bajo' }, 'p10': { hc: 0,  fibra: 0, ig: 'bajo' },
  'p11': { hc: 2,  fibra: 0, ig: 'bajo' }, 'p12': { hc: 12, fibra: 2, ig: 'medio' },
  'p13': { hc: 1,  fibra: 0, ig: 'bajo' }, 'p14': { hc: 3,  fibra: 0, ig: 'bajo' },
  'p15': { hc: 0,  fibra: 0, ig: 'bajo' }, 'p16': { hc: 0,  fibra: 0, ig: 'bajo' },
  'p17': { hc: 1,  fibra: 0, ig: 'bajo' }, 'p18': { hc: 1,  fibra: 0, ig: 'bajo' },
  'p19': { hc: 3,  fibra: 1, ig: 'bajo' }, 'p20': { hc: 3,  fibra: 0, ig: 'bajo' },
  'p21': { hc: 26, fibra: 7, ig: 'medio' }, 'p22': { hc: 28, fibra: 8, ig: 'medio' },
  'p23': { hc: 27, fibra: 7, ig: 'medio' }, 'p24': { hc: 5,  fibra: 2, ig: 'bajo' },
  // CARBOHIDRATOS (los que más cargan HC)
  'c1':  { hc: 42, fibra: 4, ig: 'medio' }, 'c2':  { hc: 45, fibra: 1, ig: 'alto' },
  'c3':  { hc: 40, fibra: 5, ig: 'medio' }, 'c4':  { hc: 41, fibra: 4, ig: 'medio' },
  'c5':  { hc: 39, fibra: 5, ig: 'medio' }, 'c6':  { hc: 38, fibra: 6, ig: 'medio' },
  'c7':  { hc: 24, fibra: 4, ig: 'medio' }, 'c8':  { hc: 23, fibra: 5, ig: 'medio' },
  'c9':  { hc: 30, fibra: 3, ig: 'medio' }, 'c10': { hc: 26, fibra: 4, ig: 'medio' },
  'c11': { hc: 25, fibra: 4, ig: 'bajo' }, 'c12': { hc: 16, fibra: 2, ig: 'medio' },
  'c13': { hc: 8,  fibra: 2, ig: 'bajo' }, 'c14': { hc: 13, fibra: 1, ig: 'medio' },
  'c15': { hc: 11, fibra: 4, ig: 'bajo' },
  // VERDURAS (bajas; suben si llevan legumbre/patata/pasas)
  'v1':  { hc: 5,  fibra: 2, ig: 'bajo' }, 'v2':  { hc: 6,  fibra: 2, ig: 'bajo' },
  'v3':  { hc: 4,  fibra: 1, ig: 'bajo' }, 'v4':  { hc: 7,  fibra: 2, ig: 'bajo' },
  'v5':  { hc: 9,  fibra: 4, ig: 'bajo' }, 'v6':  { hc: 15, fibra: 3, ig: 'medio' },
  'v7':  { hc: 6,  fibra: 4, ig: 'bajo' }, 'v8':  { hc: 4,  fibra: 2, ig: 'bajo' },
  'v9':  { hc: 6,  fibra: 3, ig: 'bajo' }, 'v10': { hc: 13, fibra: 4, ig: 'medio' },
  'v11': { hc: 18, fibra: 6, ig: 'medio' }, 'v12': { hc: 5,  fibra: 3, ig: 'bajo' },
  'v13': { hc: 6,  fibra: 3, ig: 'bajo' }, 'v14': { hc: 10, fibra: 3, ig: 'medio' },
  'v15': { hc: 4,  fibra: 2, ig: 'bajo' }, 'v16': { hc: 4,  fibra: 2, ig: 'bajo' },
  'v17': { hc: 10, fibra: 4, ig: 'bajo' }, 'v18': { hc: 11, fibra: 5, ig: 'medio' },
  'v19': { hc: 8,  fibra: 4, ig: 'bajo' }, 'v20': { hc: 7,  fibra: 4, ig: 'bajo' },
  'v21': { hc: 6,  fibra: 2, ig: 'bajo' }, 'v22': { hc: 6,  fibra: 3, ig: 'bajo' },
  'v23': { hc: 3,  fibra: 2, ig: 'bajo' }, 'v24': { hc: 9,  fibra: 3, ig: 'medio' },
  'v25': { hc: 7,  fibra: 3, ig: 'bajo' },
  // GRASAS (HC ≈ 0-4)
  'g1':  { hc: 0,  fibra: 0, ig: 'bajo' }, 'g2':  { hc: 1,  fibra: 1, ig: 'bajo' },
  'g3':  { hc: 1,  fibra: 1, ig: 'bajo' }, 'g4':  { hc: 2,  fibra: 3, ig: 'bajo' },
  'g5':  { hc: 2,  fibra: 2, ig: 'bajo' }, 'g6':  { hc: 1,  fibra: 1, ig: 'bajo' },
  'g7':  { hc: 2,  fibra: 1, ig: 'bajo' }, 'g8':  { hc: 4,  fibra: 1, ig: 'bajo' },
  'g9':  { hc: 2,  fibra: 2, ig: 'bajo' }, 'g10': { hc: 3,  fibra: 1, ig: 'bajo' },
  // DESAYUNOS
  'd1':  { hc: 20, fibra: 3, ig: 'medio' }, 'd2':  { hc: 22, fibra: 4, ig: 'medio' },
  'd3':  { hc: 18, fibra: 1, ig: 'medio' }, 'd4':  { hc: 40, fibra: 6, ig: 'medio' },
  'd5':  { hc: 2,  fibra: 1, ig: 'bajo' }, 'd6':  { hc: 18, fibra: 2, ig: 'medio' },
  'd7':  { hc: 30, fibra: 1, ig: 'alto' }, 'd8':  { hc: 25, fibra: 2, ig: 'medio' },
  'd9':  { hc: 25, fibra: 3, ig: 'medio' }, 'd10': { hc: 20, fibra: 1, ig: 'alto' },
  'd11': { hc: 35, fibra: 5, ig: 'medio' }, 'd12': { hc: 3,  fibra: 1, ig: 'bajo' },
  // MERIENDAS
  'm1':  { hc: 15, fibra: 3, ig: 'medio' }, 'm2':  { hc: 14, fibra: 1, ig: 'medio' },
  'm3':  { hc: 12, fibra: 4, ig: 'bajo' }, 'm4':  { hc: 18, fibra: 1, ig: 'medio' },
  'm5':  { hc: 4,  fibra: 2, ig: 'bajo' }, 'm6':  { hc: 18, fibra: 2, ig: 'medio' },
  'm7':  { hc: 25, fibra: 2, ig: 'medio' }, 'm8':  { hc: 20, fibra: 3, ig: 'medio' },
  'm9':  { hc: 15, fibra: 2, ig: 'medio' }, 'm10': { hc: 8,  fibra: 3, ig: 'bajo' },
  'm11': { hc: 3,  fibra: 1, ig: 'bajo' }, 'm12': { hc: 8,  fibra: 3, ig: 'bajo' }
};

// Devuelve el registro glucémico de un plato, o un fallback conservador.
function glucemiaDe(id) {
  return GLUCEMIA_DB[id] || { hc: 0, fibra: 0, ig: 'bajo' };
}

// Raciones de HC orientativas de un plato (1 ración = 10 g de HC).
function racionesHCDe(id) {
  return Math.round((glucemiaDe(id).hc / 10) * 10) / 10;
}

// ---- Reglas de consejo específicas de diabetes ----
// cond.diabetes  -> solo si el usuario tiene el modo activo (ctx.diabetes === true)
// cond.diabetesTipo -> además, solo para esos subtipos (v1: t2 / prediabetes / control)
var CONSEJOS_DIABETES = [
  { id: 'diab_raciones', cat: 'raciones', icono: '',
    titulo: 'Cuenta raciones, no prohibas',
    texto: 'Una ración de hidratos son 10 g. Saber cuántas lleva cada plato te deja repartirlos con calma en vez de eliminarlos: la reeducación gana a la restricción.',
    fuente: 'Educación diabetológica · ración = 10 g HC',
    cond: { diabetes: true } },
  { id: 'diab_objetivo_comida', cat: 'raciones', icono: '🎯',
    titulo: 'Un tope de HC por comida ayuda',
    texto: 'Mantener un objetivo de hidratos por comida (el que fijes en la evaluación) evita picos grandes. No es una jaula: es una referencia para construir el plato.',
    fuente: 'Consenso clínico · reparto de HC',
    cond: { diabetes: true } },
  { id: 'diab_fibra_freno', cat: 'fibra', icono: '🌾',
    titulo: 'La fibra frena el pico',
    texto: 'Acompañar los hidratos con fibra (verdura, legumbre, integral) enlentece la absorción y modera la glucemia tras comer. Más fibra, subida más suave.',
    fuente: 'Consenso clínico · fibra y glucemia postprandial',
    cond: { diabetes: true } },
  { id: 'diab_orden_plato', cat: 'conducta', icono: '🍽️',
    titulo: 'El orden del plato importa',
    texto: 'Empezar por la verdura y la proteína y dejar el hidrato para el final reduce el pico de glucemia frente a comerlo todo a la vez. Un truco simple y con evidencia.',
    fuente: 'Evidencia · orden de ingestión',
    cond: { diabetes: true } },
  { id: 'diab_zumos', cat: 'calidad', icono: '🧃',
    titulo: 'Cuidado con los zumos',
    texto: 'El zumo concentra el azúcar y pierde la fibra de la fruta: dispara la glucemia. Mejor fruta entera, que sacia más y sube menos.',
    fuente: 'Consenso clínico · azúcares libres',
    cond: { diabetes: true } },
  { id: 'diab_integral', cat: 'calidad', icono: '🌾',
    titulo: 'Integral mejor que refinado',
    texto: 'Arroz, pasta y pan integrales tienen más fibra y una carga glucémica menor que sus versiones refinadas. Pequeño cambio, efecto real en el pico.',
    fuente: 'Consenso clínico · índice glucémico',
    cond: { diabetes: true } },
  { id: 'diab_grasa_prote_freno', cat: 'grasas', icono: '🥑',
    titulo: 'Grasa y proteína moderan la subida',
    texto: 'Un plato mixto (hidrato + proteína + grasa saludable) sube menos y más lento que el hidrato solo. Por eso el menú combina los grupos en cada comida.',
    fuente: 'Consenso clínico · comida mixta',
    cond: { diabetes: true } },
  { id: 'diab_movimiento_post', cat: 'movimiento', icono: '🚶',
    titulo: 'Moverte tras comer ayuda',
    texto: 'Un paseo de 10-15 minutos después de comer aprovecha la glucosa que entra y baja la glucemia postprandial. Sin sudar la camiseta: basta caminar.',
    fuente: 'Consenso clínico · actividad postprandial',
    cond: { diabetes: true } },
  { id: 'diab_registro_patrones', cat: 'organizacion', icono: '📈',
    titulo: 'Registra y mira patrones',
    texto: 'Anotar tu glucemia (en Seguimiento) junto a lo que comiste te revela qué platos te suben más a ti. La diabetes es personal: tus datos mandan sobre las tablas.',
    fuente: 'Autocontrol glucémico',
    cond: { diabetes: true } },
  { id: 'diab_predi_reversion', cat: 'conducta', icono: '🔄',
    titulo: 'En prediabetes, peso y músculo mandan',
    texto: 'Una pérdida de peso moderada y sostenida, sumada a trabajo de fuerza, puede frenar o revertir la prediabetes. No hace falta perfección: hace falta constancia.',
    fuente: 'Consenso clínico · prediabetes',
    cond: { diabetes: true, diabetesTipo: ['prediabetes'] } },
  { id: 'diab_hba1c_brújula', cat: 'conducta', icono: '🧭',
    titulo: 'La HbA1c es tu brújula trimestral',
    texto: 'Si la anotas, la verás como referencia informativa. Pero quien la interpreta y fija objetivos eres tú con tu médico: la app la muestra, no la juzga.',
    fuente: 'Control glucémico · HbA1c',
    cond: { diabetes: true } }
];

// Añade las reglas de diabetes al banco (siguen inertes sin ctx.diabetes).
CONSEJOS_DIABETES.forEach(function (r) { CONSEJOS_DB.push(r); });

// ---- Wrapper del motor: añade la rama 'diabetes' sin tocar las 20 reglas base ----
var _consejoAplicaBase = consejoAplica;
consejoAplica = function (c, ctx) {
  ctx = ctx || {};
  var cond = c.cond || {};
  if (cond.diabetes) {
    if (ctx.diabetes !== true) return false;                 // seguro por defecto
    if (cond.diabetesTipo) {
      var tipos = Array.isArray(cond.diabetesTipo) ? cond.diabetesTipo : [cond.diabetesTipo];
      if (tipos.indexOf(ctx.diabetesTipo) === -1) return false;
    }
  }
  return _consejoAplicaBase(c, ctx);                         // delega el resto en la original
};

// Exportación global
window.GLUCEMIA_DB = GLUCEMIA_DB;
window.glucemiaDe = glucemiaDe;
window.racionesHCDe = racionesHCDe;
window.consejoAplica = consejoAplica;

console.log('[NutriPro] Diabetes cargado: ' + Object.keys(GLUCEMIA_DB).length + ' platos glucémicos, ' + CONSEJOS_DIABETES.length + ' reglas (total consejos: ' + CONSEJOS_DB.length + ')');
