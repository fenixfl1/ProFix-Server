import { RepairHistory } from 'src/entities/RepairHistory'
import { RepairOrder } from 'src/entities/RepairOrder'
import { RepairProduct } from 'src/entities/RepairProduct'
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm'

@EventSubscriber()
export class RepairProductSubscriber
  implements EntitySubscriberInterface<RepairProduct>
{
  listenTo() {
    return RepairProduct
  }

  async afterInsert({ entity, manager }: InsertEvent<RepairProduct>) {
    const repairOrder =
      entity.repair ??
      ((await manager.findOneOrFail('RepairOrder', {
        where: { repair_order_id: entity.repair.repair_order_id },
      })) as RepairOrder)

    const history = new RepairHistory()
    history.repair = repairOrder
    history.previous_status = repairOrder.status
    history.new_status = repairOrder.status
    history.comment = `Ha utilizado '${entity.product.product?.name ?? ''} ${entity.product.brand} ${entity.product.model}' en el reparo`
    history.created_by = repairOrder.updated_by

    await manager.save(history)
  }
}
