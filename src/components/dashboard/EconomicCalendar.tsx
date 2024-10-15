import React, { useEffect, useState } from 'react';
import { EconomicEventData } from '../../data/dummyData';

interface EconomicCalendarProps {
  data: EconomicEventData[];
}

const EconomicCalendar: React.FC<EconomicCalendarProps> = ({ data }) => {
  const [economicEvents, setEconomicEvents] = useState<EconomicEventData[]>([]);

  useEffect(() => {
    const fetchEconomicCalendar = async () => {
      try {
        const response = await fetch(
          'https://query1.finance.yahoo.com/v1/finance/calendar/economic?lang=en-US&region=US'
        );
        const data = await response.json();
        const formattedData = data.calendar.slice(0, 10).map((event: any) => ({
          date: event.date,
          event: event.event,
          impact: event.importance || 'Medium', // Yahoo Finance doesn't provide impact, so we default to 'Medium'
        }));
        // Sort the events from current date to later
        const sortedData = formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setEconomicEvents(sortedData);
      } catch (error) {
        console.error('Error fetching economic calendar:', error);
        // Fallback to dummy data if API fails
        // Sort the dummy data as well
        const sortedDummyData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setEconomicEvents(sortedDummyData);
      }
    };

    fetchEconomicCalendar();
  }, [data]);

  const getImpactColor = (impact: string) => {
    if (typeof impact !== 'string') {
      return 'bg-gray-500 text-white'; // Default color for unknown impact
    }
    
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-[#1A2A2F] p-4 rounded-lg shadow-lg h-[400px] overflow-y-auto flex flex-col custom-scrollbar">
      <h2 className="text-xl font-bold mb-4 text-[#4FD1C5]">Economic Calendar</h2>
      <div className="overflow-y-auto flex-grow">
        <ul className="space-y-2">
          {economicEvents.map((event, index) => (
            <li key={index} className="bg-[#243B53] p-3 rounded-lg hover:bg-[#2D4A6A] transition-colors duration-200 cursor-pointer">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[#8B9DA7] text-xs">{formatDate(event.date)}</p>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getImpactColor(event.impact)}`}>
                  {event.impact}
                </span>
              </div>
              <p className="text-white text-sm font-semibold">{event.event}</p>
              <p className="text-[#8B9DA7] text-xs mt-1">Expected impact on markets</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EconomicCalendar;