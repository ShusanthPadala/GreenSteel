package com.greensteel.emissiontype.service;

import com.greensteel.emissiontype.entity.EmissionType;
import com.greensteel.emissiontype.repository.EmissionTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Emission limits per tracked pollutant.
 *
 * Defaults are typical stack-emission reference values for an integrated steel
 * plant. An active Emission Type with a positive {@code limitValue} overrides
 * its pollutant's default, so each plant can enter limits from its own
 * consent-to-operate conditions. Keep defaults in sync with the frontend's
 * src/constants/plantModel.js.
 */
@Service
@RequiredArgsConstructor
public class EmissionLimitService {

    /** pollutant key -> display label */
    public static final Map<String, String> LABELS = Map.of(
            "cox", "COx", "nox", "NOx", "sox", "SOx", "pm", "PM");

    private static final Map<String, Double> DEFAULT_LIMITS = Map.of(
            "cox", 500.0,   // ppm
            "nox", 300.0,   // ppm
            "sox", 300.0,   // ppm
            "pm", 50.0      // mg/Nm3
    );

    private static final Map<String, List<String>> ALIASES = Map.of(
            "cox", List.of("cox", "co", "co2", "carbon", "carbonoxides", "carbonmonoxide", "carbondioxide"),
            "nox", List.of("nox", "no", "no2", "nitrogen", "nitrogenoxides"),
            "sox", List.of("sox", "so2", "sulphur", "sulfur", "sulphuroxides", "sulfuroxides", "sulphurdioxide", "sulfurdioxide"),
            "pm", List.of("pm", "pm10", "pm25", "particulate", "particulatematter", "dust")
    );

    private final EmissionTypeRepository emissionTypeRepository;

    /** Current limit for each pollutant key (cox, nox, sox, pm). */
    public Map<String, Double> currentLimits() {
        Map<String, Double> limits = new LinkedHashMap<>(DEFAULT_LIMITS);
        for (EmissionType type : emissionTypeRepository.findAll()) {
            if (Boolean.FALSE.equals(type.getActive())) {
                continue;
            }
            Double limit = type.getLimitValue();
            String key = pollutantKeyFor(type.getEmissionType());
            if (key != null && limit != null && limit > 0) {
                limits.put(key, limit);
            }
        }
        return limits;
    }

    /** Map an emission type name ("CO2", "Sulphur Dioxide", "PM10"...) to a pollutant key. */
    public static String pollutantKeyFor(String name) {
        if (name == null) {
            return null;
        }
        String n = name.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
        if (n.isEmpty()) {
            return null;
        }
        for (Map.Entry<String, List<String>> e : ALIASES.entrySet()) {
            if (e.getValue().contains(n)) {
                return e.getKey();
            }
        }
        for (Map.Entry<String, List<String>> e : ALIASES.entrySet()) {
            for (String alias : e.getValue()) {
                if (alias.length() > 2 && n.contains(alias)) {
                    return e.getKey();
                }
            }
        }
        return null;
    }
}
