<template>
    <!-- <v-card>
        <v-card-title>{{ props.title }}</v-card-title>
        <v-card-item>
          <v-card-text> -->
            <numeric-input :bg-color="color" :model-value="props.clearanceMin" @update:model-value="emit('update:clearanceMin', $event)" label="Ventilspiel Minimum" show-buttons :step="0.01" :min="0" suffix="mm"></numeric-input>
            <numeric-input :bg-color="color" :model-value="props.clearanceMax" @update:model-value="emit('update:clearanceMax', $event)" label="Ventilspiel Maximum" show-buttons :step="0.01" :min="0" suffix="mm"></numeric-input>
            <v-alert v-show="!props.isValid" color="warning">Wert fehlt oder fehlerhaft</v-alert>
          <!-- </v-card-text>
        </v-card-item>
    </v-card>
       -->
</template>

<script lang="ts" setup>
import NumericInput from './NumericInput.vue';

const props = defineProps<{
    title: string;
    color: string;
    clearanceMin?: number;
    clearanceMax?: number;
    isValid: boolean;
}>();

const emit = defineEmits<{
    'update:clearanceMin': [value?:number];
    'update:clearanceMax': [value?:number];
}>();

</script>