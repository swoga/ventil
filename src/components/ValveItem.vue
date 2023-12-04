<template>
  <v-row>
    <v-col style="padding-top:0;padding-left:0;padding-right:0;padding-bottom: 4px;">
  <v-card :color="props.intake ? 'blue':'red'">
    <v-card-title>Zylinder {{props.cylinder}} - {{ props.intake ? 'Einlass': 'Auslass'}} {{ props.valve }}</v-card-title>
      <v-card-text>
        <h3>Messwerte</h3>
        <br />
        <numeric-input
          v-model="props.measurement.clearance"
          :disabled="!hasValidSettings"
          :step="0.01"
          :min="0"
          :show-buttons="true"
          label="Aktuelles Ventilspiel"
          suffix="mm"
        ></numeric-input>
        <v-alert
          :color="hasValidSettings && hasMeasurementClearance && isShimInTolerance ? 'success' : 'warning'"
        >{{ hasValidSettings ?
        (hasMeasurementClearance ? `Ventilspiel ist ${
            isShimInTolerance ? 'innerhalb' : 'außerhalb'
          } der Toleranz` : 'Eingabe fehlt')
         : 'Einstellungen fehlerhaft' }}</v-alert>
        <br>
        <numeric-input
          v-model="props.measurement.shim"
          :disabled="!hasValidSettings"
          :step="0.01"
          :min="0"
          :show-buttons="true"
          label="Aktueller Shim"
          suffix="mm"
        ></numeric-input>
        <h3>Berechnung</h3>
        <br>
        <numeric-input
          :model-value="recommendedShim"
          :disabled="!hasValidSettings || recommendedShim === undefined"
          :bg-color="recommendedShim !== undefined && recommendedShim < 0 ? 'warning': undefined"
          show-buttons
          type="number"
          label="Neuer Shim"
          readonly
          suffix="mm"
        >
        <template #prepend>
          <v-btn
              :rounded="true"
                icon="mdi-minus"
                color="white"
                :disabled="!isPreviousInTolerance"
                @click="setPreviousShim"
              ></v-btn>
        </template>
          <template #append>
              <v-btn
              :rounded="true"
                icon="mdi-plus"
                color="white"
                :disabled="!isNextInTolerance"
                @click="setNextShim"
              ></v-btn>
          </template>
        </numeric-input>
        <numeric-input
          :model-value="calculatedClearance"
          :disabled="!hasValidSettings || calculatedClearance === undefined"
          type="number"
          label="Neues Ventilspiel"
          readonly
          suffix="mm"
          hide-details="auto"
        ></numeric-input>
      </v-card-text>
  </v-card>
</v-col>
  </v-row>
</template>

<script setup lang="ts">
import NumericInput from "./NumericInput.vue";
import { Measurement } from "@/plugins/pinia";
import { scaleUp, scaleDown, scaleDownMul } from "@/plugins/scaledMath";
import { watchEffect } from "vue";
import { computed, ref, watch } from "vue";

const props = defineProps<{
  cylinder: number;
  valve: number;
  intake: boolean;
  clearanceMin?: number;
  clearanceMax?: number;
  clearanceValid: boolean;
  shimStep?: number;
  measurement: Measurement;
}>();

const hasValidSettings = computed(() => props.clearanceValid && props.clearanceMin !== undefined && props.clearanceMax !== undefined && props.shimStep !== undefined);

const hasMeasurementClearance = computed(
  () => props.measurement.clearance !== undefined
);

function isInTolerance(clearance?: number) {
  return clearance !== undefined &&
  props.clearanceMin !== undefined &&
  props.clearanceMax !== undefined &&
  clearance >= props.clearanceMin &&
  clearance <= props.clearanceMax
}

const isShimInTolerance = computed(() => isInTolerance(props.measurement.clearance));

const recommendedShim = ref<number>();

watchEffect(() => {
  recommendedShim.value = undefined;

  if (props.measurement.clearance === undefined) return;
  if (props.measurement.shim === undefined) return;
  if (props.clearanceMin === undefined) return;
  if (props.shimStep === undefined) return;

  const total =
    scaleDown(scaleUp(props.measurement.clearance) + scaleUp(props.measurement.shim) - scaleUp(props.clearanceMin));
  const shimSize = Math.floor(scaleUp(total) / scaleUp(props.shimStep));
  recommendedShim.value = scaleUp(shimSize) * scaleUp(props.shimStep) / scaleDownMul(2);
});

function calcClearance(shim?: number) {
  if (props.measurement.clearance === undefined) return undefined;
  if (props.measurement.shim === undefined) return undefined;
  if (shim === undefined) return undefined;

  return scaleDown(
    scaleUp(props.measurement.clearance) +
    scaleUp(props.measurement.shim) -
    scaleUp(shim)
  );
}

const calculatedClearance = computed(() => calcClearance(recommendedShim.value));

const previousShim = computed(() => { 
  if (recommendedShim.value === undefined) return undefined;
  if (props.shimStep === undefined) return undefined;
  return scaleDown(scaleUp(recommendedShim.value) - scaleUp(props.shimStep))
});
const previousClearance = computed(() => calcClearance(previousShim.value));
const isPreviousInTolerance = computed(() => previousShim.value !== undefined && previousShim.value >= 0 &&  isInTolerance(previousClearance.value));
const nextShim = computed(() => {
  if (recommendedShim.value === undefined) return undefined;
  if (props.shimStep === undefined) return undefined;
  return scaleDown(scaleUp(recommendedShim.value) + scaleUp(props.shimStep))
});
const nextClearance = computed(() => calcClearance(nextShim.value));
const isNextInTolerance = computed(() => isInTolerance(nextClearance.value));


function setPreviousShim() {
  recommendedShim.value = previousShim.value;
}

function setNextShim() {
  recommendedShim.value = nextShim.value
}

</script>