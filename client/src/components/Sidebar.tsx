import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Home, LineChart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { t } = useTranslation();

  return (
    <div className="h-full border-r bg-background/60 backdrop-blur-lg w-[240px] flex flex-col">
      <div className="flex h-14 items-center border-b px-6">
        <span className="font-bold">StockSphere</span>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
              isActive ? 'bg-accent' : 'transparent'
            )
          }
        >
          <Home className="h-4 w-4" />
          {t('home')}
        </NavLink>
        <NavLink
          to="/research"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
              isActive ? 'bg-accent' : 'transparent'
            )
          }
        >
          <LineChart className="h-4 w-4" />
          {t('stockResearch')}
        </NavLink>
      </nav>
    </div>
  );
}