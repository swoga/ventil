const scale = 100;
export const scaleUp = (v: number) => Math.round(v * scale);
export const scaleDown = (v: number) => v / scale;
export const scaleDownMul = (v: number) => Math.pow(scale, v);