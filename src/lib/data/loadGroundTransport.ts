import type { GroundTransportRow } from '../types/data.js';
import type { TransportOption } from '../types/view-models.js';
import { readCsv } from './readCsv.js';
import { cleanText } from './normalize.js';

export function loadGroundTransport(): TransportOption[] {
  const rows = readCsv<GroundTransportRow>('ground_transport.csv');
  return rows
    .filter((r) => r.is_active === '1')
    .map((r) => ({
      transportId: r.transport_id,
      transportName: cleanText(r.transport_name),
      transportSlug: cleanText(r.transport_slug),
      tier: cleanText(r.tier),
      vehicleType: cleanText(r.vehicle_type),
      minPax: parseInt(r.min_pax, 10) || 0,
      maxPax: parseInt(r.max_pax, 10) || 0,
      routeGroupId: cleanText(r.route_group_id),
      logicNotes: cleanText(r.logic_notes),
      isActive: true,
    }));
}
