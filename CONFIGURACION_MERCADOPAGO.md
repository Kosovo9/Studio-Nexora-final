# 💳 CONFIGURACIÓN MERCADO PAGO

## 📋 INFORMACIÓN BANCARIA GUARDADA

Esta información está guardada en `src/lib/config/mercadopago.ts` y se usa en todo el sistema.

### Datos de Transferencia Bancaria:

- **CLABE**: `722969020209036818`
- **Beneficiario**: `Neil Ernesto Ortega Castro`
- **Institución**: `Mercado Pago W`
- **Link de Pago**: `https://link.mercadopago.com.mx/studionexora`

---

## 📁 ARCHIVOS CREADOS

### 1. `src/lib/config/mercadopago.ts`
Configuración centralizada con todas las funciones para acceder a la información de Mercado Pago.

**Funciones disponibles:**
- `getMercadoPagoBankInfo()` - Obtiene toda la información
- `getFormattedCLABE()` - Obtiene CLABE formateado
- `getBeneficiaryName()` - Obtiene nombre del beneficiario
- `getInstitutionName()` - Obtiene nombre de la institución
- `getMercadoPagoLink()` - Obtiene link de pago

### 2. `src/components/MercadoPagoPayment.tsx`
Componente completo para mostrar información de transferencia bancaria con:
- CLABE con botón de copiar
- Beneficiario
- Institución
- Link de pago con Mercado Pago

---

## 🔧 USO EN EL SISTEMA

### En Footer (ya actualizado):
```typescript
import { getMercadoPagoLink } from '../lib/config/mercadopago';

// Usar en el link
<a href={getMercadoPagoLink()}>
  Mercado Pago
</a>
```

### En cualquier componente:
```typescript
import { 
  getMercadoPagoBankInfo,
  getFormattedCLABE,
  getBeneficiaryName,
  getInstitutionName 
} from '../lib/config/mercadopago';

// Obtener información completa
const bankInfo = getMercadoPagoBankInfo();

// O usar funciones individuales
const clabe = getFormattedCLABE();
const beneficiary = getBeneficiaryName();
```

### Componente completo de pago:
```typescript
import MercadoPagoPayment from './components/MercadoPagoPayment';

// En tu componente
<MercadoPagoPayment 
  lang={lang}
  onCopy={(field) => console.log('Copied:', field)}
/>
```

---

## ✅ ACTUALIZACIONES REALIZADAS

1. ✅ Configuración centralizada creada
2. ✅ Componente de pago completo creado
3. ✅ Footer actualizado para usar configuración centralizada
4. ✅ Funciones helper para fácil acceso

---

## 📝 NOTAS

- **CLABE**: Número de cuenta interbancaria para transferencias
- **Beneficiario**: Nombre del titular de la cuenta
- **Institución**: Banco o institución financiera
- **Link**: Enlace directo para pagos con Mercado Pago

---

## 🔄 PARA ACTUALIZAR LA INFORMACIÓN

Si necesitas cambiar la información, solo edita `src/lib/config/mercadopago.ts`:

```typescript
export const MERCADOPAGO_CONFIG: MercadoPagoBankInfo = {
  clabe: 'NUEVO_CLABE',
  beneficiario: 'NUEVO_BENEFICIARIO',
  institucion: 'NUEVA_INSTITUCION',
  link: 'NUEVO_LINK',
};
```

Todos los componentes se actualizarán automáticamente.

---

**✅ Información guardada y lista para usar en todo el sistema.**

