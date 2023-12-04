import { defineStore } from "pinia";
import { Ref, computed, reactive, ref } from "vue";

export type Measurement = {
    clearance?: number;
    shim?: number;
};

export enum IntakeExhaust {
    Intake = "in",
    Exhaust = "ex"
}

type ValveMeasurement = Record<string, Measurement>;

function createIsValid(min: Ref<number | undefined>, max: Ref<number | undefined>) {
    return computed(() => min.value !== undefined && max.value !== undefined && min.value < max.value);
}

export const useStore = defineStore('store', () => {
    const numberOfCylinders = ref(1);
    const numberOfIntakeValves = ref(1);
    const numberOfExhaustValves = ref(1);

    const intakeClearanceMin = ref<number>();
    const intakeClearanceMax = ref<number>();
    const isIntakeClearanceValid = createIsValid(intakeClearanceMin, intakeClearanceMax);
    const exhaustClearanceMin = ref<number>();
    const exhaustClearanceMax = ref<number>();
    const isExhaustClearanceValid = createIsValid(exhaustClearanceMin, exhaustClearanceMax);

    const shimStep = ref<number>();
    const measurements = reactive<ValveMeasurement>({});

    function getMeasurement(cylinder: number, valve: number, dir: IntakeExhaust) {
        const key = `${cylinder}_${valve}_${dir}`;
        if (!measurements[key]) {
            measurements[key] = {};
        }
        return measurements[key];
    }

    return {
        numberOfCylinders,
        numberOfIntakeValves,
        numberOfExhaustValves,
        intakeClearanceMin,
        intakeClearanceMax,
        isIntakeClearanceValid,
        exhaustClearanceMin,
        exhaustClearanceMax,
        isExhaustClearanceValid,
        shimStep,
        measurements,
        getMeasurement
    }
}, {
    persist: true
});