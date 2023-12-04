<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable" title="Ventilspiel/Shims berechnen">
      <v-btn icon="mdi-cog" variant="text" @click="showSettings = true"></v-btn>
    </v-app-bar>
    <v-main>
      <v-dialog v-model="showSettings" fullscreen scrollable>
        
        <v-card>
          <v-toolbar color="primary" density="comfortable" title="Einstellungen">
          <v-btn icon="mdi-close" variant="text" @click="showSettings = false"></v-btn>
        </v-toolbar>
          <v-card-text>
            <numeric-input label="Anzahl Zylinder" v-model="store.numberOfCylinders" :show-buttons="true" readonly :step="1" :min="1" :decimals="0"></numeric-input>
            <numeric-input label="Größenabstufung Shims" v-model="store.shimStep" :show-buttons="true" :step="0.01" :min="0.01" suffix="mm"></numeric-input>
            <h3>Einlass</h3>
            <br>
            <numeric-input label="Anzahl Einlassventile" v-model="store.numberOfIntakeValves" bg-color="blue" :show-buttons="true" readonly :step="1" :min="1" :decimals="0"></numeric-input>
            <clearance-inputs title="Toleranzen Einlass" color="blue" v-model:clearance-min="store.intakeClearanceMin" v-model:clearance-max="store.intakeClearanceMax" :is-valid="store.isIntakeClearanceValid"></clearance-inputs>
            <br>
            <h3>Auslass</h3>
            <br>
            <numeric-input label="Anzahl Auslassventile" v-model="store.numberOfExhaustValves" bg-color="red" :show-buttons="true" readonly :step="1" :min="1" :decimals="0"></numeric-input>
            <clearance-inputs color="red" title="Toleranzen Auslass" v-model:clearance-min="store.exhaustClearanceMin" v-model:clearance-max="store.exhaustClearanceMax" :is-valid="store.isExhaustClearanceValid"></clearance-inputs>            
          </v-card-text>
        
      </v-card>
      </v-dialog>
      <v-container fluid>
     
      <template v-for="cylinder in store.numberOfCylinders">
        <valve-item
        v-for="valve in store.numberOfIntakeValves"
        :key="`${cylinder}_in_${valve}`"
        :cylinder="cylinder"
        :valve="valve"
        :intake="true"
        :shim-step="store.shimStep"
        :clearance-min="store.intakeClearanceMin"
        :clearance-max="store.intakeClearanceMax"
        :clearance-valid="store.isIntakeClearanceValid"
        :measurement="store.getMeasurement(cylinder, valve, IntakeExhaust.Intake)"
      ></valve-item>
      <valve-item
        v-for="valve in store.numberOfExhaustValves"
        :key="`${cylinder}_ex_${valve}`"
        :cylinder="cylinder"
        :valve="valve"
        :intake="false"
        :shim-step="store.shimStep ?? 1"
        :clearance-min="store.exhaustClearanceMin ?? 0"
        :clearance-max="store.exhaustClearanceMax ?? 0"
        :clearance-valid="store.isExhaustClearanceValid"
        :measurement="store.getMeasurement(cylinder, valve, IntakeExhaust.Exhaust)"
      ></valve-item>
      </template>
    </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import ValveItem from "@/components/ValveItem.vue";
import { ref } from "vue";
import ClearanceInputs from "./components/ClearanceInputs.vue";
import NumericInput from "./components/NumericInput.vue";
import { IntakeExhaust, useStore } from "./plugins/pinia";

const store = useStore();

const showSettings = ref(false);

</script>
