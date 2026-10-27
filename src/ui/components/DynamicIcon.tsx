import { 
  Sparkles, 
  Zap, 
  ShieldAlert, 
  Activity, 
  Compass, 
  Sun, 
  Eye,
  Wind,
  Flame,
  Headphones,
  Hand,
  Home,
  Layers,
  Moon,
  VolumeX,
  Mic} from 'lucide-react';

// Helper Icon Renderer Component
export const DynamicIcon = ({ name, className = "w-5 h-5" }: { name: string; className?: string }) => {
  switch (name) {
    case 'Activity': return <Activity className={className} />;
    case 'Compass': return <Compass className={className} />;
    case 'Eye': return <Eye className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'Hand': return <Hand className={className} />;
    case "Headphones": return <Headphones className={className} />;
    case "Home": return <Home className={className} />;
    case "Layers": return <Layers className={className} />;
    case "Moon": return <Moon className={className} />;
    case "Mic": return <Mic className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Sun': return <Sun className={className} />;
    case 'VolumeX': return <VolumeX className={className} />;
    case "Wind": return <Wind className={className} />;
    case 'Zap': return <Zap className={className} />;
    default: return <Sparkles className={className} />;
  }
};

