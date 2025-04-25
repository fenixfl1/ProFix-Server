import Business from 'src/entities/Business'
import { RepairOrder } from 'src/entities/RepairOrder'

/**
 * This function generates an HTML content for a receipt based on the provided RepairOrder object.
 * @param order - RepairOrder object
 * @return HTML content for the receipt
 */
export function generateReceiptHtmlContent(
  order: RepairOrder,
  business: Business
): string {
  return `
      <div style="width: 80mm; font-family: 'Courier New', monospace; font-size: 10pt; padding: 5px; color: #000;">
        <pre style="text-align: center; font-weight: bold;">
            COMPROBANTE DE ORDEN DE REPARACIÓN
        </pre>

       <div style="text-align: center; font-weight: bold;">
        <p>${business.name}</p>
        <p>${business.address}</p>
        <p>RNC: ${business.rnc}</p>
       </div>

        <div>
          <p>Orden No.: ${order.repair_order_id}</p>
          <p>Fecha: ${new Date(order.created_at).toLocaleDateString('es-ES')}</p>
          <p>Cliente: ${order.device.customer.name}</p>
          <p>Documento: ${order.device.customer.identity_document ?? 'Sin documento'}</p>
          <p>Teléfono: ${order.device.customer.phone || 'N/A'}</p>
          <p>Correo: ${order.device.customer.email ?? 'N/A'}</p>
        </div>

        ----------------------------------------

        <div>
          <p>Dispositivo: ${order.device.brand.name} - ${order.device.model}</p>
          <p>Color: ${order.device.color}</p>
          <p>IMEI: ${order.device.imei}</p>
          <p>Condición: ${order.device.physical_condition ?? '-'}</p>
          <p>Problema: ${order.reported_issue}</p>
          <p>Diagnóstico: ${order.diagnosis}</p>
          <p>Costo Estimado: $${order.estimated_cost.toFixed?.(2) ?? 0.0}</p>
          <p>Entrega Estimada: ${new Date(order.delivery_date).toLocaleDateString('es-ES')}</p>
        </div>

        ----------------------------------------

        <div>
          <p><strong>Usuario:</strong> ${order.device.customer.username}</p>
          <p><strong>Contraseña:</strong> ${order.device.customer.password}</p>
          <p>Acceda a: ${process.env.ADMIN_APP_URL}</p>
        </div>

        ----------------------------------------

        <p style="text-align: center;">
          Gracias por confiar en nosotros
        </p>
      </div>
  `
}
