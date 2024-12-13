import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFavoriteStocks, removeFromFavorites } from '@/api/stocks';
import { getUserProfile } from '@/api/auth';
import { Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { UserProfile } from '@/components/UserProfile';

type FavoriteStock = {
  symbol: string;
  name: string;
  performance: {
    lastDay: number;
    monthlyAverage: number;
  };
};

export function Home() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [stocks, setStocks] = useState<FavoriteStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadFavoriteStocks();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profile = await getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('Error'),
        description: error.message,
      });
    }
  };

  const loadFavoriteStocks = async () => {
    try {
      setLoading(true);
      const response = await getFavoriteStocks();
      // Transform the response to match the expected format
      const stocksWithPerformance = response.stocks.map(symbol => ({
        symbol,
        name: symbol, // You might want to fetch the company name from another API
        performance: {
          lastDay: Math.random() * 10 - 5, // Random number between -5 and 5
          monthlyAverage: Math.random() * 15 - 7.5, // Random number between -7.5 and 7.5
        }
      }));
      setStocks(stocksWithPerformance);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (symbol: string) => {
    try {
      await removeFromFavorites(symbol);
      setStocks(stocks.filter(stock => stock.symbol !== symbol));
      toast({
        title: "Success",
        description: t('Stock removed from favorites'),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('Welcome to StockSphere')}</h1>

      {userProfile && <UserProfile {...userProfile} />}

      <h2 className="text-2xl font-bold mt-6">{t('stockPerformance')}</h2>
      {loading ? (
        <p>{t('Loading...')}</p>
      ) : stocks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stocks.map((stock) => (
            <Card key={stock.symbol} className="backdrop-blur-lg bg-background/60">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFromFavorites(stock.symbol)}
                >
                  <Star className="h-4 w-4 fill-primary" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{t('lastBusinessDay')}</span>
                    <div className={`flex items-center ${stock.performance.lastDay >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.performance.lastDay >= 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      <span>{Math.abs(stock.performance.lastDay).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{t('monthlyAverage')}</span>
                    <div className={`flex items-center ${stock.performance.monthlyAverage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.performance.monthlyAverage >= 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      <span>{Math.abs(stock.performance.monthlyAverage).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">{t('No favorites yet')}</p>
      )}
    </div>
  );
}