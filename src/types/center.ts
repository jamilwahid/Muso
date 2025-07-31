export interface Center {
  center_id: string;
  center_name: string;
  center_listing_url: string;
  location: {
    address: string;
    ward: string;
    postal_code: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  center_contact: {
    name: string;
    phone: string;
    website: string | null;
  };
  subsidy_available: boolean;
  CWELCC_participant: boolean;
  languages_spoken: string[];
  programs: Program[];
  dietary_services: string[];
  city_support_notes: string;
  last_updated: string;
}

export interface Program {
  age_group: string;
  capacity: number;
  vacancy: string | null;
  quality_rating: number | null;
}

export interface Filters {
  CWELCC_participant: boolean | null;
  subsidy_available: boolean | null;
  languages_spoken: string[];
  dietary_services: string[];
}

export interface FavoriteActions {
  called: boolean;
  applied: boolean;
  visited: boolean;
}

export type KanbanStatus = 'interested' | 'contacted' | 'visited' | 'applied' | 'decided';

export interface FavoriteCenterData {
  center_id: string;
  actions: FavoriteActions;
  notes: string;
  lastUpdated: string;
  kanbanStatus: KanbanStatus;
}