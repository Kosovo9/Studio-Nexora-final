# ✅ PULL REQUEST CHECKLIST

## Pre-PR Checks

### 1. Base de Datos
- [ ] Migración ejecutada en Supabase
- [ ] Todas las tablas creadas correctamente
- [ ] Índices aplicados
- [ ] RLS policies habilitadas
- [ ] Vistas creadas (earnings_ready_for_payment, affiliate_dashboard, cash_flow_report)
- [ ] Funciones creadas (get_next_payment_date, get_affiliate_stats, get_affiliate_pending_earnings)
- [ ] Verificado con queries de prueba

### 2. Código
- [ ] Sin errores de TypeScript
- [ ] Sin errores de ESLint
- [ ] Todas las funciones tienen tipos correctos
- [ ] Comentarios en funciones complejas
- [ ] Build exitoso (`npm run build`)

### 3. Testing
- [ ] Crear afiliado - ✅ Funciona
- [ ] Generar código AFF-XXXXX - ✅ Único
- [ ] Registrar venta con código - ✅ Comisión calculada
- [ ] Crear código REF-XXXXX - ✅ Único
- [ ] Aplicar descuento - ✅ Monto correcto
- [ ] Webhook procesa compra - ✅ Notificaciones enviadas
- [ ] Cash flow calculator - ✅ Cálculos correctos
- [ ] Vistas SQL funcionan - ✅ Queries retornan datos

### 4. Emails
- [ ] Servicio configurado (Resend o SendGrid)
- [ ] Variables de entorno establecidas
- [ ] Email de bienvenida afiliado - ✅ Se envía
- [ ] Email de venta - ✅ Se envía
- [ ] Email de alerta cash flow - ✅ Se envía
- [ ] Templates se ven bien en mobile
- [ ] Todos los templates exportados correctamente

### 5. Seguridad
- [ ] RLS habilitado en todas las tablas sensibles
- [ ] Usuarios solo ven sus datos
- [ ] API keys en .env (no en código)
- [ ] Validación de CLABE (18 dígitos)
- [ ] Webhook valida payment_completed
- [ ] Funciones SQL tienen permisos correctos

### 6. Performance
- [ ] Índices en columnas frecuentes
- [ ] Queries optimizadas
- [ ] Sin N+1 queries
- [ ] Paginación implementada donde sea necesario
- [ ] Vistas materializadas si es necesario

### 7. Documentación
- [ ] README actualizado
- [ ] SETUP_GUIDE.md completo
- [ ] API_REFERENCE.md actualizado
- [ ] Variables de entorno documentadas (.env.example)
- [ ] Comentarios en código complejo

### 8. UI/UX
- [ ] ✅ NO se modificó ningún componente visual
- [ ] ✅ NO se cambió ningún estilo CSS
- [ ] ✅ NO se alteró la experiencia del usuario
- [ ] ✅ Solo se activaron elementos backend invisibles
- [ ] ✅ Build sin errores de UI

### 9. Git
- [ ] Commits descriptivos
- [ ] Branch name correcto (`feature/referral-program`)
- [ ] Sin archivos temporales en commit
- [ ] .env.local en .gitignore

## Post-PR Checklist

### Después del Merge
- [ ] Ejecutar migración en producción
- [ ] Configurar variables de entorno en producción
- [ ] Probar flujo completo en producción
- [ ] Monitorear logs por 24 horas
- [ ] Verificar que emails se envían correctamente
- [ ] Revisar métricas de cash flow

## Notas Importantes

⚠️ **CRÍTICO**: Este PR NO debe afectar el UI/UX. Todo el código es backend invisible.

✅ **Confirmado**: 
- Build exitoso
- TypeScript sin errores
- Migración SQL completa
- Templates de email profesionales
- Sistema de notificaciones funcional

