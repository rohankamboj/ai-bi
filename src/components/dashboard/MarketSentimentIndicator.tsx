import React, { useState, useEffect } from 'react';
import { ResponsiveRadialBar } from '@nivo/radial-bar';
import axios from 'axios';

const MarketSentimentIndicator: React.FC = () => {
  const [sentiment, setSentiment] = useState<number>(50); // Default to 50 (Neutral)
  const [description, setDescription] = useState<string>('Neutral');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMarketSentiment = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=finance,economy,market&apikey=WXOUUCFEP7N5U7C');
        const result = response.data;

        if (result.feed && result.feed.length > 0) {
          const overallSentiment = result.feed.reduce((acc: number, article: any) => acc + article.overall_sentiment_score, 0) / result.feed.length;
          const normalizedSentiment = Math.round((overallSentiment + 1) * 50); // Convert from [-1, 1] to [0, 100]
          setSentiment(normalizedSentiment);
          
          if (normalizedSentiment < 30) setDescription('Bearish');
          else if (normalizedSentiment < 70) setDescription('Neutral');
          else setDescription('Bullish');
        } else {
          // If no data is available, default to Neutral
          setSentiment(50);
          setDescription('Neutral');
        }
      } catch (error) {
        console.error('Error fetching market sentiment:', error);
        // Default to Neutral if API fails
        setSentiment(50);
        setDescription('Neutral');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketSentiment();
    const interval = setInterval(fetchMarketSentiment, 3600000); // Refresh every hour

    return () => clearInterval(interval);
  }, []);

  const chartData = [
    {
      id: 'Sentiment',
      data: [{ x: 'Sentiment', y: sentiment }]
    }
  ];

  const getSentimentColor = (sentiment: number) => {
    if (sentiment < 30) return '#E53E3E';
    if (sentiment < 70) return '#ECC94B';
    return '#38A169';
  };

  if (loading) {
    return (
      <div className="bg-[#1A2A2F] p-6 rounded-lg shadow-lg h-full flex items-center justify-center">
        <p className="text-[#4FD1C5]">Loading sentiment data...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A2A2F] p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-[#4FD1C5]">Market Sentiment</h2>
      <div className="flex w-full h-full justify-center items-center my-auto relative">
        <ResponsiveRadialBar
          data={chartData}
          valueFormat=">-.2f"
          padding={0.3}
          cornerRadius={3}
          margin={{ top: 80, right: 20, bottom: 0, left: 20 }}
          radialAxisStart={{ tickSize: 3, tickPadding: 3, tickRotation: 0 }}
          circularAxisOuter={{ tickSize: 3, tickPadding: 8, tickRotation: 0 }}
          colors={[getSentimentColor(sentiment)]}
          borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
          maxValue={100}
          startAngle={-90}
          endAngle={90}
          tracksColor="#2D3748"
          enableRadialGrid={false}
          enableCircularGrid={false}
          theme={{
            labels: {
              text: { fill: '#8B9DA7' }
            },
            axis: {
              ticks: {
                text: { fill: '#8B9DA7' }
              }
            }
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-16">
          <p className="text-3xl font-bold text-white">{sentiment}%</p>
          <p className="text-lg font-medium text-[#8B9DA7]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketSentimentIndicator;