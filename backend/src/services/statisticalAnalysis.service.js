/**
 * StatisticalAnalysisService - Servicio para análisis estadístico avanzado
 * 
 * Nota: Esta implementación proporciona cálculos estadísticos básicos.
 * En producción, se integraría con scipy.stats (Python) o bibliotecas estadísticas
 * más completas para cálculos exactos.
 */

export class StatisticalAnalysisService {
  constructor() {
    this.availableTests = {
      't-test-independent': 'Independent samples t-test',
      't-test-paired': 'Paired t-test',
      't-test-welch': "Welch's t-test (unequal variances)",
      't-test-one-sample': 'One-sample t-test',
      'anova-one-way': 'One-way ANOVA',
      'anova-two-way': 'Two-way ANOVA',
      'mann-whitney': 'Mann-Whitney U test (non-parametric)',
      'kruskal-wallis': 'Kruskal-Wallis test (non-parametric)',
      'pearson-correlation': 'Pearson correlation',
      'spearman-correlation': 'Spearman correlation',
    };
  }

  /**
   * Realiza t-test independiente
   */
  performTTest(group1, group2, options = {}) {
    const { testType = 'independent', alpha = 0.05 } = options;

    if (testType === 'independent') {
      return this.independentTTest(group1, group2, alpha);
    } else if (testType === 'paired') {
      return this.pairedTTest(group1, group2, alpha);
    } else if (testType === 'welch') {
      return this.welchTTest(group1, group2, alpha);
    } else if (testType === 'one-sample') {
      return this.oneSampleTTest(group1, group2[0], alpha);
    }

    throw new Error(`Unknown test type: ${testType}`);
  }

  /**
   * T-test para muestras independientes
   */
  independentTTest(group1, group2, alpha) {
    const n1 = group1.length;
    const n2 = group2.length;
    const mean1 = this.mean(group1);
    const mean2 = this.mean(group2);
    const var1 = this.variance(group1, mean1);
    const var2 = this.variance(group2, mean2);

    // Pooled standard error
    const pooledSE = Math.sqrt((var1 / n1) + (var2 / n2));
    const t = (mean1 - mean2) / pooledSE;

    // Degrees of freedom
    const df = n1 + n2 - 2;

    // P-value aproximado (en producción usar distribución t exacta)
    const pValue = this.estimatePValue(t, df);

    return {
      test: 'Independent samples t-test',
      statistic: t,
      pValue,
      df,
      mean1,
      mean2,
      difference: mean1 - mean2,
      significant: pValue < alpha,
      interpretation: this.interpretPValue(pValue, alpha),
      effectSize: this.cohensD(mean1, mean2, var1, var2, n1, n2)
    };
  }

  /**
   * T-test pareado
   */
  pairedTTest(group1, group2, alpha) {
    if (group1.length !== group2.length) {
      throw new Error('Paired t-test requires equal group sizes');
    }

    const differences = group1.map((val, idx) => val - group2[idx]);
    const meanDiff = this.mean(differences);
    const stdDiff = this.standardDeviation(differences, meanDiff);
    const n = differences.length;

    const t = meanDiff / (stdDiff / Math.sqrt(n));
    const df = n - 1;
    const pValue = this.estimatePValue(Math.abs(t), df);

    return {
      test: 'Paired t-test',
      statistic: t,
      pValue,
      df,
      meanDifference: meanDiff,
      significant: pValue < alpha,
      interpretation: this.interpretPValue(pValue, alpha)
    };
  }

  /**
   * Welch's t-test (varianzas desiguales)
   */
  welchTTest(group1, group2, alpha) {
    const n1 = group1.length;
    const n2 = group2.length;
    const mean1 = this.mean(group1);
    const mean2 = this.mean(group2);
    const var1 = this.variance(group1, mean1);
    const var2 = this.variance(group2, mean2);

    const se = Math.sqrt((var1 / n1) + (var2 / n2));
    const t = (mean1 - mean2) / se;

    // Welch-Satterthwaite degrees of freedom
    const df = Math.pow((var1 / n1) + (var2 / n2), 2) /
      (Math.pow(var1 / n1, 2) / (n1 - 1) + Math.pow(var2 / n2, 2) / (n2 - 1));

    const pValue = this.estimatePValue(Math.abs(t), df);

    return {
      test: "Welch's t-test",
      statistic: t,
      pValue,
      df,
      mean1,
      mean2,
      significant: pValue < alpha,
      interpretation: this.interpretPValue(pValue, alpha)
    };
  }

  /**
   * One-sample t-test
   */
  oneSampleTTest(sample, populationMean, alpha) {
    const n = sample.length;
    const mean = this.mean(sample);
    const std = this.standardDeviation(sample, mean);
    const se = std / Math.sqrt(n);
    const t = (mean - populationMean) / se;
    const df = n - 1;
    const pValue = this.estimatePValue(Math.abs(t), df);

    return {
      test: 'One-sample t-test',
      statistic: t,
      pValue,
      df,
      sampleMean: mean,
      populationMean,
      significant: pValue < alpha,
      interpretation: this.interpretPValue(pValue, alpha)
    };
  }

  /**
   * One-way ANOVA
   */
  performANOVA(groups, options = {}) {
    const { design = 'one-way', alpha = 0.05 } = options;

    if (design === 'one-way') {
      return this.oneWayANOVA(groups, alpha);
    }

    throw new Error(`ANOVA design ${design} not yet implemented`);
  }

  /**
   * One-way ANOVA
   */
  oneWayANOVA(groups, alpha) {
    const k = groups.length; // number of groups
    const n = groups.reduce((sum, group) => sum + group.length, 0); // total observations
    const grandMean = this.mean(groups.flat());

    // Between-group sum of squares
    let SSBetween = 0;
    groups.forEach((group) => {
      const groupMean = this.mean(group);
      SSBetween += group.length * Math.pow(groupMean - grandMean, 2);
    });

    // Within-group sum of squares
    let SSWithin = 0;
    groups.forEach((group) => {
      const groupMean = this.mean(group);
      group.forEach((value) => {
        SSWithin += Math.pow(value - groupMean, 2);
      });
    });

    const dfBetween = k - 1;
    const dfWithin = n - k;
    const MSBetween = SSBetween / dfBetween;
    const MSWithin = SSWithin / dfWithin;
    const F = MSBetween / MSWithin;

    // P-value aproximado (en producción usar distribución F exacta)
    const pValue = this.estimateFValue(F, dfBetween, dfWithin);

    return {
      test: 'One-way ANOVA',
      statistic: F,
      pValue,
      dfBetween,
      dfWithin,
      SSBetween,
      SSWithin,
      MSBetween,
      MSWithin,
      significant: pValue < alpha,
      interpretation: this.interpretPValue(pValue, alpha),
      etaSquared: SSBetween / (SSBetween + SSWithin) // Effect size
    };
  }

  /**
   * Correlación de Pearson
   */
  pearsonCorrelation(x, y) {
    if (x.length !== y.length) {
      throw new Error('Arrays must have same length');
    }

    const meanX = this.mean(x);
    const meanY = this.mean(y);

    let numerator = 0;
    let sumSqX = 0;
    let sumSqY = 0;

    for (let i = 0; i < x.length; i++) {
      const dx = x[i] - meanX;
      const dy = y[i] - meanY;
      numerator += dx * dy;
      sumSqX += dx * dx;
      sumSqY += dy * dy;
    }

    const denominator = Math.sqrt(sumSqX * sumSqY);
    const r = denominator === 0 ? 0 : numerator / denominator;

    // Test de significancia
    const n = x.length;
    const t = r * Math.sqrt((n - 2) / (1 - r * r));
    const pValue = this.estimatePValue(Math.abs(t), n - 2);

    return {
      test: 'Pearson correlation',
      coefficient: r,
      pValue,
      significant: pValue < 0.05,
      interpretation: this.interpretCorrelation(r)
    };
  }

  /**
   * Correlación de Spearman (rank-based)
   */
  spearmanCorrelation(x, y) {
    if (x.length !== y.length) {
      throw new Error('Arrays must have same length');
    }

    const rankedX = this.rank(x);
    const rankedY = this.rank(y);

    return this.pearsonCorrelation(rankedX, rankedY);
  }

  // Helper functions
  mean(values) {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  variance(values, mean) {
    const sumSqDiff = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
    return sumSqDiff / (values.length - 1);
  }

  standardDeviation(values, mean) {
    return Math.sqrt(this.variance(values, mean));
  }

  rank(values) {
    const sorted = [...values].map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);
    const ranks = new Array(values.length);
    sorted.forEach((item, rank) => {
      ranks[item.idx] = rank + 1;
    });
    return ranks;
  }

  cohensD(mean1, mean2, var1, var2, n1, n2) {
    const pooledStd = Math.sqrt(((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2));
    return (mean1 - mean2) / pooledStd;
  }

  estimatePValue(t, df) {
    // Aproximación simplificada de p-value
    // En producción usar distribución t exacta
    const absT = Math.abs(t);
    if (absT > 3) return 0.001;
    if (absT > 2.5) return 0.01;
    if (absT > 2) return 0.05;
    if (absT > 1.5) return 0.1;
    return 0.2;
  }

  estimateFValue(f, df1, df2) {
    // Aproximación simplificada
    if (f > 5) return 0.001;
    if (f > 3) return 0.01;
    if (f > 2) return 0.05;
    return 0.1;
  }

  interpretPValue(pValue, alpha) {
    if (pValue < 0.001) return 'Highly significant (p < 0.001)';
    if (pValue < 0.01) return 'Very significant (p < 0.01)';
    if (pValue < alpha) return `Significant (p < ${alpha})`;
    return `Not significant (p = ${pValue.toFixed(3)})`;
  }

  interpretCorrelation(r) {
    const absR = Math.abs(r);
    if (absR > 0.8) return 'Very strong correlation';
    if (absR > 0.6) return 'Strong correlation';
    if (absR > 0.4) return 'Moderate correlation';
    if (absR > 0.2) return 'Weak correlation';
    return 'Very weak or no correlation';
  }

  getAvailableTests() {
    return Object.keys(this.availableTests).map(key => ({
      id: key,
      name: this.availableTests[key]
    }));
  }
}

