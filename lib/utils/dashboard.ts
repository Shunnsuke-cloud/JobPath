import type { CompanyStatus } from "@/types/database";

export type DashboardSchedule = {
  start_at: string;
  is_completed: boolean;
  is_deadline: boolean;
  schedule_type?: string;
};

export function getDashboardCounts(statuses: CompanyStatus[], schedules: DashboardSchedule[], now: number) {
  const sevenDays = now + 7 * 86400000;
  return {
    totalCompanies: statuses.length,
    activeCompanies: statuses.filter((status) => !["興味あり", "内定", "不合格", "辞退"].includes(status)).length,
    upcomingSchedules: schedules.filter((schedule) => {
      const time = new Date(schedule.start_at).getTime();
      return !schedule.is_completed && time >= now && time <= sevenDays;
    }).length,
    offers: statuses.filter((status) => status === "内定").length,
  };
}

export function getScheduleState(schedule: DashboardSchedule, now: number) {
  const time = new Date(schedule.start_at).getTime();
  if (schedule.is_completed) return "完了";
  if (time < now) return schedule.is_deadline ? "期限超過" : "終了";
  if (schedule.is_deadline && time - now <= 3 * 86400000) return "締切間近";
  return "予定";
}

export function currentTime() { return Date.now(); }
