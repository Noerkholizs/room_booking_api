// Request DTOs
export interface CreateRoomDto {
  name: string;
  description?: string;
  capacity: number;
}

export interface UpdateRoomDto {
  name?: string;
  description?: string;
  capacity?: number;
  isActive?: boolean;
}

// Response DTO
export interface RoomResponseDto {
  id: number;
  name: string;
  description?: string;
  capacity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
