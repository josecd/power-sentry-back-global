export class CreateLocationDto {
    name: string;
    apiUrl: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    description?: string;
    apiConfig?: Record<string, any>;
  }