const DUNE_API_KEY = import.meta.env.VITE_DUNE_API_KEY || import.meta.env.DUNE_API_KEY;
const DUNE_BASE_URL = 'https://api.dune.com/api/v1';

export interface DuneQueryResult {
  query_id: number;
  state: string;
  submitted_at: string;
  expires_at: string;
  executed_at: string;
  execution_time_seconds: number;
  result: {
    rows: Record<string, unknown>[];
    metadata: {
      column_names: string[];
      row_count: number;
      result_set_bytes: number;
    };
  };
}

export interface AnalyticsData {
  totalEvents: number;
  totalTicketsSold: number;
  totalVolume: string;
  activeEvents: number;
  topEvents: Array<{
    name: string;
    ticketsSold: number;
    volume: string;
  }>;
}

export async function getPaxrAnalytics(): Promise<AnalyticsData | null> {
  if (!DUNE_API_KEY) {
    console.warn('Dune API key not configured');
    return null;
  }

  try {
    const response = await fetch(`${DUNE_BASE_URL}/query/3694082/results`, {
      headers: {
        'x-dune-api-key': DUNE_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Dune analytics');
    }

    const data: DuneQueryResult = await response.json();
    
    if (data.result?.rows?.length > 0) {
      return data.result.rows[0] as unknown as AnalyticsData;
    }
    
    return null;
  } catch (error) {
    console.error('Dune analytics error:', error);
    return null;
  }
}

export async function getEventAnalytics(eventId: number): Promise<{
  ticketsSold: number;
  revenue: string;
  buyers: number;
  resales: number;
} | null> {
  if (!DUNE_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `${DUNE_BASE_URL}/query/3694083/results?event_id=${eventId}`,
      {
        headers: {
          'x-dune-api-key': DUNE_API_KEY,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data: DuneQueryResult = await response.json();
    
    if (data.result?.rows?.length > 0) {
      return data.result.rows[0] as unknown as {
        ticketsSold: number;
        revenue: string;
        buyers: number;
        resales: number;
      };
    }
    
    return null;
  } catch (error) {
    console.error('Event analytics error:', error);
    return null;
  }
}

export async function getTrendingEvents(limit: number = 5): Promise<unknown[]> {
  if (!DUNE_API_KEY) {
    return [];
  }

  try {
    const response = await fetch(
      `${DUNE_BASE_URL}/query/3694084/results?limit=${limit}`,
      {
        headers: {
          'x-dune-api-key': DUNE_API_KEY,
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data: DuneQueryResult = await response.json();
    return data.result?.rows || [];
  } catch {
    return [];
  }
}

export function formatVolume(volume: string | number): string {
  const num = typeof volume === 'string' ? parseFloat(volume) : volume;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}
