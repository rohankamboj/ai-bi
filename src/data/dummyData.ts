export interface AnalyticsData {
  totalValue: number;
  totalPnL: number;
  dailyChange: number;
}

export interface PortfolioItem {
  symbol: string;
  shares: number;
  avgCost: number;
}

export interface WatchlistItem {
  symbol: string;
  currentPrice: number;
}

export interface PnLLineItem {
  date: string;
  pnl: number;
}

export interface SectorItem {
  sector: string;
  value: number;
}

export interface PerformanceData {
  day: string;
  month: string;
  value: number;
}

export interface AssetAllocationData {
  name: string;
  value: number;
  children?: AssetAllocationData[];
}

export interface TopGainersLosersData {
  gainers: { symbol: string; change: number }[];
  losers: { symbol: string; change: number }[];
}

export interface TransactionData {
  type: "buy" | "sell";
  symbol: string;
  shares: number;
  price: number;
  date: string;
}

export interface MarketSentimentData {
  sentiment: number;
  description: string;
}

export interface EconomicEventData {
  date: string;
  event: string;
  impact: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  portfolioData: PortfolioItem[];
  pnlLineData: PnLLineItem[];
  sectorData: SectorItem[];
  assetAllocationData: AssetAllocationData;
  recentTransactionsData: TransactionData[];
  economicCalendarData: EconomicEventData[];
}

interface ApiUserResponse {
  0: {
    id: string;
    name: string;
    email: string;
    profilePicture: string;
    portfolioData: PortfolioItem[];
    pnlLineData: PnLLineItem[];
    sectorData: SectorItem[];
    assetAllocationData: AssetAllocationData[];
    recentTransactionsData: TransactionData[];
  };
}

const transformApiResponse = (apiUserResponse: ApiUserResponse, economicCalendarData: EconomicEventData[]): User => {
  const userData = apiUserResponse[0];
  return {
    ...userData,
    assetAllocationData: userData.assetAllocationData[0], // Assuming the API returns an array, but we need a single object
    economicCalendarData: economicCalendarData
  };
};

export const fetchUserData = async (userId: string): Promise<User> => {
  try {
    // Fetch user data
    const userResponse = await fetch(`https://wealth-management-api-1060627628276.us-central1.run.app/get_data/${userId}`);
    const userData: ApiUserResponse = await userResponse.json();

    // Fetch economic calendar data
    const calendarResponse = await fetch('https://wealth-management-api-1060627628276.us-central1.run.app/get_calendar_data');
    const calendarData: EconomicEventData[] = await calendarResponse.json();

    // Combine and transform the data
    return transformApiResponse(userData, calendarData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const user1 = await fetchUserData('1');
    // const user2 = await fetchUserData('2');
    // Add more users if needed
    return [user1];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};