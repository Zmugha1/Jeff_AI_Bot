import type { ElementType } from 'react';
import {
  Sun,
  Target,
  Users,
  Zap,
  BarChart2,
  Settings,
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: ElementType;
  /** Legacy App.tsx keys that should highlight this item until routing is updated */
  legacyActive?: string[];
}

const navItems: NavItem[] = [
  { id: 'morning', label: 'Morning Brief', icon: Sun, legacyActive: ['executive'] },
  { id: 'goals', label: 'Business Goals', icon: Target },
  { id: 'clients', label: 'Client Intelligence', icon: Users },
  { id: 'interventions', label: 'Health Interventions', icon: Zap },
  {
    id: 'practice',
    label: 'My Practice',
    icon: BarChart2,
    legacyActive: ['roi'],
  },
];

function isItemActive(item: NavItem, activePage: string): boolean {
  if (activePage === item.id) return true;
  return item.legacyActive?.includes(activePage) ?? false;
}

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const sidebarStyle = { backgroundColor: '#2D4459' } as const;

  return (
    <aside
      className="w-64 h-screen fixed left-0 top-0 flex flex-col"
      style={sidebarStyle}
    >
      {/* App header */}
      <div className="px-4 pt-6" style={{ marginBottom: 32 }}>
        <div className="flex items-center gap-3">
          <div
            className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
            style={{
              width: 30,
              height: 30,
              backgroundColor: '#3BBFBF',
              fontSize: 14,
            }}
          >
            U
          </div>
          <div className="min-w-0">
            <h1
              className="font-bold leading-tight text-white"
              style={{ fontSize: 16 }}
            >
              Up At Dawn
            </h1>
            <p
              className="leading-tight"
              style={{
                fontSize: 10,
                color: 'rgba(200, 232, 229, 0.6)',
              }}
            >
              Your clients. Compounding.
            </p>
          </div>
        </div>
      </div>

      {/* Primary navigation */}
      <nav className="flex-1 overflow-y-auto px-0 pb-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item, activePage);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onPageChange(item.id)}
              className={cn(
                'flex w-full items-center border-solid text-left font-medium transition-all duration-150',
                isActive
                  ? 'rounded-r-lg'
                  : 'rounded-lg',
              )}
              style={{
                padding: '10px 16px',
                paddingLeft: isActive ? 13 : 16,
                gap: 10,
                fontSize: 13,
                fontWeight: 500,
                borderRadius: isActive ? '0 8px 8px 0' : 8,
                margin: isActive ? '2px 8px 2px 0' : '2px 8px',
                marginLeft: isActive ? 0 : undefined,
                borderLeftWidth: 3,
                borderLeftColor: isActive ? '#3BBFBF' : 'transparent',
                backgroundColor: isActive
                  ? 'rgba(59,191,191,0.1)'
                  : 'transparent',
                color: isActive ? '#3BBFBF' : '#7A8F95',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor =
                    'rgba(200,232,229,0.08)';
                  e.currentTarget.style.color = '#C8E8E5';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#7A8F95';
                }
              }}
            >
              <Icon style={{ width: 18, height: 18, flexShrink: 0 }} strokeWidth={2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="mt-auto"
        style={{
          padding: 16,
          borderTop: '1px solid rgba(200,232,229,0.15)',
        }}
      >
        <button
          type="button"
          onClick={() => onPageChange('settings')}
          className="flex w-full items-center gap-2 rounded-lg transition-colors duration-150"
          style={{ color: '#7A8F95' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#C8E8E5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#7A8F95';
          }}
        >
          <Settings style={{ width: 16, height: 16 }} strokeWidth={2} />
          <span style={{ fontSize: 11 }}>Settings</span>
        </button>
      </div>
    </aside>
  );
}
