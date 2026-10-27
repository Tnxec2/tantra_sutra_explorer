import { 
  Sparkles, 
  Zap, 
  ShieldAlert, 
  Activity, 
  Compass, 
  Sun, 
  Eye} from 'lucide-react';

// Helper Icon Renderer Component
export const DynamicIcon = ({ name, className = "w-5 h-5" }: { name: string; className?: string }) => {
  switch (name) {
    case 'Zap': return <Zap className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Compass': return <Compass className={className} />;
    case 'Sun': return <Sun className={className} />;
    case 'Eye': return <Eye className={className} />;
    default: return <Sparkles className={className} />;
  }
};