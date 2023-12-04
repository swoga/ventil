<template>
    <v-text-field v-model="input" type="number" :min="props.min" :max="props.max" :step="props.step" v-model:focused="focus">
        <template v-if="props.showButtons" #prepend>
            <slot name="prepend">
                <v-btn icon="mdi-minus" color="white" :rounded="true" :disabled="!canDecrement" @click="decrement"></v-btn>
            </slot>
        </template>
    
        <template v-if="props.showButtons" #append>
            <slot name="append">
                <v-btn icon="mdi-plus" color="white" :rounded="true" :disabled="!canIncrement" @click="increment"></v-btn>
            </slot>
        </template>

    </v-text-field>
</template>

<script lang="ts" setup>
import { scaleDown, scaleUp } from "@/plugins/scaledMath";
import { watch } from "vue";
import { computed, ref } from "vue";

const props = withDefaults(defineProps<{
    modelValue?: number;
    showButtons?: boolean;
    min?: number;
    max?: number;
    step?: number;
    decimals?: number;
}>(), {
    showButtons: false,
    decimals: 2,
    step: 1
});

const emit = defineEmits<{
    'update:modelValue': [value?: number]
}>();

const canDecrement = computed(() => props.modelValue !== undefined && (props.min === undefined || scaleDown(scaleUp(props.modelValue) - scaleUp(props.step)) >= props.min));
const canIncrement = computed(() => props.modelValue !== undefined && (props.max === undefined || scaleDown(scaleUp(props.modelValue) + scaleUp(props.step)) <= props.max));

function decrement() {
    if (props.modelValue === undefined) return;
    const newValue = scaleDown(scaleUp(props.modelValue) - scaleUp(props.step));
    emit('update:modelValue', newValue);
}

function increment() {
    if (props.modelValue === undefined) return;
    const newValue = scaleDown(scaleUp(props.modelValue) + scaleUp(props.step));
    emit('update:modelValue', newValue);
}

const focus = ref(false);
const stage = ref<string>();
// clear staging value on blur
watch(focus, (v) => {
    if (v) return;
    stage.value = undefined;
});

const input = computed({
    get() {
        // show raw value while focused
        if (focus.value && stage.value !== undefined) return stage.value;
        return props.modelValue?.toFixed(props.decimals) ?? '';
    },
    set(raw:any) {
        // cache current raw input value, to display during editing
        stage.value = raw;

        let parsed = parseFloat(raw);
        const isValid = !isNaN(parsed);
        if (isValid && props.decimals > 0) {
            const scale = Math.pow(10, props.decimals);
            parsed = Math.round(parsed * scale) / scale;
        }
        emit('update:modelValue', isValid ? parsed : undefined);
    }
})

</script>