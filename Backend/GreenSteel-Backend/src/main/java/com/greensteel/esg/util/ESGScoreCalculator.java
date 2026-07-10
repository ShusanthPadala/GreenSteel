package com.greensteel.esg.util;

public class ESGScoreCalculator {

    private ESGScoreCalculator() {
    }

    public static double calculateEnvironmentalScore(
            double carbonScore,
            double water,
            double recycling,
            double renewable
    ) {

        return (carbonScore * 0.40)
                + (water * 0.20)
                + (recycling * 0.20)
                + (renewable * 0.20);

    }

    public static double calculateSocialScore(
            double safety,
            double training
    ) {

        return (safety * 0.60)
                + (training * 0.40);

    }

    public static double calculateGovernanceScore(
            double board,
            double sustainability
    ) {

        return (board * 0.60)
                + (sustainability * 0.40);

    }

    public static double calculateOverallScore(
            double environmental,
            double social,
            double governance
    ) {

        return (environmental + social + governance) / 3;

    }

}