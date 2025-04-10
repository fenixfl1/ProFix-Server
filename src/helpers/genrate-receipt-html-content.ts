import { RepairOrder } from 'src/entities/RepairOrder'

/**
 * This function generates an HTML content for a receipt based on the provided RepairOrder object.
 * @param order - RepairOrder object
 * @return HTML content for the receipt
 */
export function generateReceiptHtmlContent(order: RepairOrder): string {
  return `
    <style>
      /* Estilos generales */
      .receipt-container {
        font-family: Arial, sans-serif;
        width: 100%;
        max-width: 100mm;
        margin: 0 auto;
        padding: 10mm;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
      }

      h2 {
        text-align: center;
        font-size: 16px;
        margin-bottom: 5mm;
      }

      h3 {
        font-size: 14px;
        margin-top: 5mm;
        margin-bottom: 5mm;
      }

      .info {
        margin: 2mm 0;
        font-size: 12px;
      }

      .info strong {
        font-weight: bold;
      }

      hr {
        margin: 5mm 0;
        border: 0;
        border-top: 1px solid #ddd;
      }

      .footer {
        text-align: center;
        font-size: 10px;
        margin-top: 10mm;
        color: #555;
      }

      /* Añadir espacio entre las secciones */
      .info + .info {
        margin-top: 2mm;
      }

      /* Estilo del contenedor de cliente y dispositivo */
      .customer-info, .device-info {
        margin-bottom: 5mm;
        padding-bottom: 5mm;
        border-bottom: 1px dashed #ddd;
      }

      .customer-info strong, .device-info strong {
        display: inline-block;
        width: 40%;
      }
    </style>

    <div class="receipt-container">
      <h2>Orden de Reparación</h2>
      
      <div class="customer-info">
        <div class="info">
          <strong>Orden No.:</strong> ${order.repair_order_id}
        </div>
        <div class="info">
          <strong>Fecha:</strong> ${new Date(order.created_at).toLocaleDateString('es-ES')}
        </div>
        <div class="info">
          <strong>Cliente:</strong> ${order.device.customer.name} (${order.device.customer.identity_document ?? 'Sin documento de identidad'})
        </div>
        <div class="info">
          <strong>Teléfono:</strong> ${order.device.customer.phone || 'N/A'}
        </div>
        <div class="info">
          <strong>Correo:</strong> ${order.device.customer.email ?? 'N/A'}
        </div>
      </div>

      <div class="device-info">
        <div class="info">
          <strong>Dispositivo:</strong> ${order.device.brand.name} - ${order.device.model} (${order.device.color})
        </div>
        <div class="info">
          <strong>IMEI:</strong> ${order.device.imei}
        </div>
        <div class="info">
          <strong>Condición Física:</strong> ${order.device.physical_condition ?? '-'}
        </div>
        <div class="info">
          <strong>Problema Reportado:</strong> ${order.reported_issue}
        </div>
        <div class="info">
          <strong>Diagnóstico:</strong> ${order.diagnosis}
        </div>
        <div class="info">
          <strong>Costo Estimado:</strong> $${order.estimated_cost.toFixed?.(2) ?? 0.0}
        </div>
        <div class="info">
          <strong>Entrega Estimada:</strong> ${new Date(order.delivery_date).toLocaleDateString('es-ES')}
        </div>
      </div>
      
      <hr>

      <h3>Acceso para Seguimiento</h3>
      <div class="info">
        <strong>Usuario:</strong> ${order.device.customer.username}
      </div>
      <div class="info">
        <strong>Contraseña:</strong> ${order.device.customer.password}
      </div>
      <p>Para dar seguimiento a su orden, ingrese a nuestro sistema con las credenciales proporcionadas.</p>

      <hr>

      <div class="footer">
        Gracias por confiar en nuestro servicio. Para cualquier duda, contáctenos.
      </div>
    </div>
  `
}
