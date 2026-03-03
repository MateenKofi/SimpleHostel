import { RoomFilterConfig } from './room_filter_config'

// Get room type config from filter configuration
const roomTypeConfig = RoomFilterConfig.find(c => c.category === 'roomType')

// Convert backend value (SINGLE, DOUBLE, SUITE, QUAD) to user-friendly display format
export const backendRoomTypeToDisplay = (backendValue: string | null | undefined): string => {
  if (!backendValue) return 'Not specified'

  switch (backendValue) {
    case 'SINGLE':
      return '1 in a room'
    case 'DOUBLE':
      return '2 in a room'
    case 'SUITE':
      return '3 in a room'
    case 'QUAD':
      return '4 in a room'
    default:
      return backendValue || 'Not specified'
  }
}
