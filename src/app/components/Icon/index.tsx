import type { IconType } from "react-icons";
import {
  LuAccessibility,
  LuBookOpen,
  LuBuilding2,
  LuCalendarDays,
  LuClock3,
  LuFileText,
  LuGraduationCap,
  LuHandshake,
  LuHeart,
  LuHeartHandshake,
  LuLightbulb,
  LuMapPin,
  LuMonitor,
  LuStethoscope,
  LuTrendingUp,
  LuUserRound,
  LuUsers,
  LuRefreshCw,
  LuChartColumn,
  LuIdCard,
  LuHouse,
  LuMail,
  LuPhone,
  LuSchool,
  LuBaby,
  LuHandHeart,
  LuHospital,
} from "react-icons/lu";

const icons: Record<string, IconType> = {
  graduation: LuGraduationCap,
  growth: LuTrendingUp,
  community: LuUsers,
  idea: LuLightbulb,
  calendar: LuCalendarDays,
  people: LuUsers,
  region: LuMapPin,
  handshake: LuHandshake,
  book: LuBookOpen,
  file: LuFileText,
  stethoscope: LuStethoscope,
  physio: LuAccessibility,
  pedagogy: LuGraduationCap,
  clock: LuClock3,
  building: LuBuilding2,
  user: LuUserRound,
  heart: LuHeart,
  care: LuHeartHandshake,
  monitor: LuMonitor,
  refresh: LuRefreshCw,
  chart: LuChartColumn,
  idcard: LuIdCard,
  house: LuHouse,
  mail: LuMail,
  phone: LuPhone,
  school: LuSchool,
  baby: LuBaby,
  handheart: LuHandHeart,
  hospital: LuHospital,
};

export const COURSE_ICON: Record<string, string> = {
  enfermagem: "stethoscope",
  fisioterapia: "physio",
  pedagogia: "pedagogy",
};

type IconProps = {
  name: string;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 24, className }: IconProps) {
  const Component = icons[name] || LuLightbulb;
  return <Component size={size} className={className} aria-hidden="true" />;
}
