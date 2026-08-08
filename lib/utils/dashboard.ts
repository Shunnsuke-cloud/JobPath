import type { CompanyStatus } from "@/types/database";
export function getDashboardCounts(statuses: CompanyStatus[], scheduleDates: string[], now: number) { const sevenDays = now + 7 * 86400000; return { totalCompanies: statuses.length, activeCompanies: statuses.filter((status) => !["興味あり", "内定", "不合格", "辞退"].includes(status)).length, upcomingSchedules: scheduleDates.filter((date) => { const time = new Date(date).getTime(); return time >= now && time <= sevenDays; }).length, offers: statuses.filter((status) => status === "内定").length }; }
export function currentTime() { return Date.now(); }
