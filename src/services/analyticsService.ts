import { persistenceService } from './persistenceService';

export const analyticsService = {
  getSummary(days: number = 30) {
    const stats = persistenceService.getStats();
    const chartData = persistenceService.getChartData(days);
    const violationsByCategory = persistenceService.getViolationsByCategory();
    const topViolations = persistenceService.getTopViolations();
    const all = persistenceService.getAll();

    const categoryDist: Record<string, number> = {};
    all.forEach(i => {
      const cat = i.metadata.productCategory || 'GENERAL';
      categoryDist[cat] = (categoryDist[cat] || 0) + 1;
    });

    const categoryDistribution = Object.entries(categoryDist).map(([name, value]) => ({ name, value }));

    return {
      stats,
      chartData,
      violationsByCategory,
      topViolations,
      categoryDistribution,
    };
  },
};
