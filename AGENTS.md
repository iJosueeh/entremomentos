# Reglas de trabajo — EntreMomentos

- Leer README, arquitectura, decisiones y estado de verificación antes de modificar. Inspeccionar archivos y Git; conservar cambios ajenos.
- Consultar skills globales y locales relevantes antes de actuar. Verificar existencia y leer SKILL.md. No instalar ni reinstalar skills sin autorización.
- El brief y la documentación oficial prevalecen sobre recetas genéricas. Registrar conflictos y decisiones relevantes.
- Mantener arquitectura feature-first: rutas componen; features poseen datos, contratos, presentación y animaciones. Código compartido no importa features. Evitar ciclos y usar la API pública desde fuera.
- TypeScript strict. Inferir tipos desde Zod; validar datos externos antes de renderizar. No acoplar Story Player a persistencia ni Supabase.
- Encapsular GSAP en animations y ciclo de vida en hooks. Browser APIs solo en efectos; revertir contextos propios y limpiar listeners. Nunca eliminar triggers globalmente.
- Respetar movimiento reducido, navegación por teclado, foco visible y mobile-first. Contenido legible sin animaciones.
- No implementar escenas completas durante M0. No añadir abstracciones, carpetas vacías, dependencias o gestores de estado sin uso concreto.
- Documentar decisiones arquitectónicas en docs/decisions y actualizar documentación afectada.
- Ejecutar npm run verify tras cambios relevantes. Ante fallos, diagnosticar y corregir la causa; nunca desactivar pruebas o reglas para ocultarla. Verificar UI en navegador cuando esté disponible.
- Informar comandos ejecutados, resultados reales y bloqueos. No presentar inspecciones estáticas o pruebas auxiliares como build, Vitest o revisión visual aprobados.
- No modificar archivos fuera del alcance. No crear commits ni hacer push sin autorización explícita. Comunicar riesgos relevantes sin ampliar el alcance.
- Con red disponible: resolver dependencias, conservar lockfile y comprobar peers y engines. No cerrar M0 hasta aprobar verificaciones integradas y manuales.
