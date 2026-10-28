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
  Mic,
  MessageSquare,
  BookOpen,
  Bell,
  Armchair,
  Brain,
  Briefcase,
  CircleDot,
  Clock,
  Cloud,
  Coffee,
  Ear,
  Flower2,
  Focus,
  Footprints,
  MapPin,
  Maximize,
  MessageCircle,
  Move,
  Heart,
  Music,
  Pause,
  Repeat,
  Scan,
  Sunrise,
  Target,
  Users,
  Waves} from 'lucide-react';

// Helper Icon Renderer Component
export const DynamicIcon = ({ name, className = "w-5 h-5" }: { name: string; className?: string }) => {
  switch (name.replaceAll('-', '').toLowerCase()) {
    case 'activity': return <Activity className={className} />;
    case 'armchair': return <Armchair className={className} />;
    case 'bell': return <Bell className={className} />;
    case 'bookopen': return <BookOpen className={className} />;
    case 'brain': return <Brain className={className} />;
    case 'briefcase': return <Briefcase className={className} />;
    case 'circledot': return <CircleDot className={className} />;
    case 'clock': return <Clock className={className} />;
    case 'cloud': return <Cloud className={className} />;
    case 'coffee': return <Coffee className={className} />;
    case 'compass': return <Compass className={className} />;
    case 'ear': return <Ear className={className} />;
    case 'eye': return <Eye className={className} />;
    case 'flame': return <Flame className={className} />;
    case 'flower2': return <Flower2 className={className} />;
    case 'focus': return <Focus className={className} />;
    case 'footprints': return <Footprints className={className} />;
    case 'hand': return <Hand className={className} />;
    case "headphones": return <Headphones className={className} />;
    case "heart": return <Heart className={className} />;
    case "home": return <Home className={className} />;
    case "layers": return <Layers className={className} />;
    case 'mappin': return <MapPin className={className} />;
    case 'maximize': return <Maximize className={className} />;
    case 'messagecircle': return <MessageCircle className={className} />;
    case "messagesquare": return <MessageSquare className={className} />;
    case "mic": return <Mic className={className} />;
    case "moon": return <Moon className={className} />;
    case "move": return <Move className={className} />;
    case "music": return <Music className={className} />;
    case "pause": return <Pause className={className} />;
    case "repeat": return <Repeat className={className} />;
    case "scan": return <Scan className={className} />;
    case 'shieldalert': return <ShieldAlert className={className} />;
    case 'sparkles': return <Sparkles className={className} />;
    case 'sun': return <Sun className={className} />;
    case "sunrise": return <Sunrise className={className} />;
    case "target": return <Target className={className} />;
    case "users": return <Users className={className} />;
    case 'volumex': return <VolumeX className={className} />;
    case "waves": return <Waves className={className} />;
    case "wind": return <Wind className={className} />;
    case 'zap': return <Zap className={className} />;
    default: return null; <Sparkles className={className} />;
  }
};

