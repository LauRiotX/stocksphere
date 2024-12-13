import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { getDailyStockData, getWeeklyStockData, getMonthlyStockData, addToFavorites } from '@/api/stocks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Star, Search } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type StockForm = {
  symbol: string;
};

type MetricToggle = {
  [key: string]: boolean;
};

const METRICS = {
  close: 'Close Price',
  open: 'Open Price',
  high: 'High Price',
  low: 'Low Price',
  volume: 'Volume',
  dividend: 'Dividend Amount'
};

const METRIC_COLORS = {
  close: '#8884d8',
  open: '#82ca9d',
  high: '#ffc658',
  low: '#ff8042',
  volume: '#0088fe',
  dividend: '#00C49F'
};

export function Research() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { register, handleSubmit } = useForm<StockForm>();
  const [stockData, setStockData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSymbol, setCurrentSymbol] = useState<string>('');
  const [metrics, setMetrics] = useState<MetricToggle>({
    close: true,
    open: false,
    high: false,
    low: false,
    volume: false,
    dividend: false
  });

  const onSubmit = async (data: StockForm) => {
    try {
      setLoading(true);
      const response = await getDailyStockData(data.symbol);
      setStockData(response.data);
      setCurrentSymbol(data.symbol);
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

  const handleTabChange = async (period: string) => {
    if (!currentSymbol) return;

    try {
      setLoading(true);
      let response;
      switch (period) {
        case 'daily':
          response = await getDailyStockData(currentSymbol);
          break;
        case 'weekly':
          response = await getWeeklyStockData(currentSymbol);
          break;
        case 'monthly':
          response = await getMonthlyStockData(currentSymbol);
          break;
      }
      setStockData(response.data);
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

  const handleAddToFavorites = async () => {
    if (!currentSymbol) return;

    try {
      const result = await addToFavorites(currentSymbol);
      toast({
        title: "Success",
        description: result.message,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const toggleMetric = (metric: string) => {
    setMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('stockResearch')}</h1>
        {currentSymbol && (
          <Button onClick={handleAddToFavorites}>
            <Star className="mr-2 h-4 w-4" />
            {t('addToFavorites')}
          </Button>
        )}
      </div>

      <Card className="backdrop-blur-lg bg-background/60">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder={t('stockCode')}
                {...register('symbol', { required: true })}
              />
            </div>
            <Button type="submit" disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              {t('search')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {stockData.length > 0 && (
        <>
          <Card className="backdrop-blur-lg bg-background/60">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(METRICS).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={key}
                      checked={metrics[key]}
                      onCheckedChange={() => toggleMetric(key)}
                    />
                    <Label htmlFor={key}>{t(label)}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-lg bg-background/60">
            <CardContent className="pt-6">
              <Tabs defaultValue="daily" onValueChange={handleTabChange}>
                <TabsList>
                  <TabsTrigger value="daily">{t('daily')}</TabsTrigger>
                  <TabsTrigger value="weekly">{t('weekly')}</TabsTrigger>
                  <TabsTrigger value="monthly">{t('monthly')}</TabsTrigger>
                </TabsList>
                <TabsContent value="daily">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stockData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="price" />
                        <YAxis yAxisId="volume" orientation="right" />
                        <Tooltip />
                        <Legend />
                        {metrics.close && (
                          <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="close"
                            stroke={METRIC_COLORS.close}
                            name={t('Close Price')}
                          />
                        )}
                        {metrics.open && (
                          <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="open"
                            stroke={METRIC_COLORS.open}
                            name={t('Open Price')}
                          />
                        )}
                        {metrics.high && (
                          <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="high"
                            stroke={METRIC_COLORS.high}
                            name={t('High Price')}
                          />
                        )}
                        {metrics.low && (
                          <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="low"
                            stroke={METRIC_COLORS.low}
                            name={t('Low Price')}
                          />
                        )}
                        {metrics.volume && (
                          <Line
                            yAxisId="volume"
                            type="monotone"
                            dataKey="volume"
                            stroke={METRIC_COLORS.volume}
                            name={t('Volume')}
                          />
                        )}
                        {metrics.dividend && (
                          <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="dividend"
                            stroke={METRIC_COLORS.dividend}
                            name={t('Dividend Amount')}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="weekly">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stockData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="price" />
                        <YAxis yAxisId="volume" orientation="right" />
                        <Tooltip />
                        <Legend />
                        {metrics.close && (
                          <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="close"
                            stroke={METRIC_COLORS.close}
                            name={t('Close Price')}
                          />
                        )}
                        {metrics.open && (
                          <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="open"
                            stroke={METRIC_COLORS.open}
                            name={t('Open Price')}
                          />
                        )}
                        {metrics.high && (
                          <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="high"
                            stroke={METRIC_COLORS.high}
                            name={t('High Price')}
                          />
                        )}
                        {metrics.low && (
                          <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="low"
                            stroke={METRIC_COLORS.low}
                            name={t('Low Price')}
                          />
                        )}
                        {metrics.volume && (
                          <Line
                            yAxisId="volume"
                            type="monotone"
                            dataKey="volume"
                            stroke={METRIC_COLORS.volume}
                            name={t('Volume')}
                          />
                        )}
                        {metrics.dividend && (
                          <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="dividend"
                            stroke={METRIC_COLORS.dividend}
                            name={t('Dividend Amount')}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="monthly">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stockData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="price" />
                        <YAxis yAxisId="volume" orientation="right" />
                        <Tooltip />
                        <Legend />
                        {metrics.close && (
                          <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="close"
                            stroke={METRIC_COLORS.close}
                            name={t('Close Price')}
                          />
                        )}
                        {metrics.open && (
                          <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="open"
                            stroke={METRIC_COLORS.open}
                            name={t('Open Price')}
                          />
                        )}
                        {metrics.high && (
                          <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="high"
                            stroke={METRIC_COLORS.high}
                            name={t('High Price')}
                          />
                        )}
                        {metrics.low && (
                          <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="low"
                            stroke={METRIC_COLORS.low}
                            name={t('Low Price')}
                          />
                        )}
                        {metrics.volume && (
                          <Line
                            yAxisId="volume"
                            type="monotone"
                            dataKey="volume"
                            stroke={METRIC_COLORS.volume}
                            name={t('Volume')}
                          />
                        )}
                        {metrics.dividend && (
                          <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="dividend"
                            stroke={METRIC_COLORS.dividend}
                            name={t('Dividend Amount')}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}