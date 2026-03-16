/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef, useMemo } from 'react';
import { Uniform } from 'three';
import { Effect } from 'postprocessing';

const fragmentShader = `
uniform float pixelSize;
uniform vec2 resolution;

// Bayer matrix 4x4
float bayer4(vec2 fragCoord) {
    vec2 p = mod(fragCoord, 4.0);
    int x = int(p.x);
    int y = int(p.y);
    if (x == 0) {
        if (y == 0) return 0.0/16.0; if (y == 1) return 12.0/16.0; if (y == 2) return 3.0/16.0; if (y == 3) return 15.0/16.0;
    }
    if (x == 1) {
        if (y == 0) return 8.0/16.0; if (y == 1) return 4.0/16.0; if (y == 2) return 11.0/16.0; if (y == 3) return 7.0/16.0;
    }
    if (x == 2) {
        if (y == 0) return 2.0/16.0; if (y == 1) return 14.0/16.0; if (y == 2) return 1.0/16.0; if (y == 3) return 13.0/16.0;
    }
    if (x == 3) {
        if (y == 0) return 10.0/16.0; if (y == 1) return 6.0/16.0; if (y == 2) return 9.0/16.0; if (y == 3) return 5.0/16.0;
    }
    return 0.0;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 dxy = pixelSize / resolution;
    vec2 coord = dxy * floor(uv / dxy);
    
    // Sample the input color at the pixelated coordinate
    // Note: postprocessing Effect passes inputColor, but we might want to sample texture if we want true pixelation
    // But inputColor is already sampled at uv. For pixelation we need to sample at coord.
    // However, Effect class doesn't give easy access to tDiffuse in mainImage easily without overriding.
    // So we'll just apply dither to the current pixel, assuming pixelation is handled or we accept full res dither.
    
    // To do true pixelation in this shader, we need to ignore inputColor and sample tDiffuse manually if possible,
    // or just accept that we are dithering the full res image.
    // Let's try to just dither the inputColor for now.
    
    float d = bayer4(gl_FragCoord.xy);
    
    vec3 color = inputColor.rgb;
    
    // Dither
    vec3 dithered = color + (d - 0.5) * 0.15;
    
    // Quantize to reduced palette (e.g., 8 levels per channel)
    float levels = 8.0;
    dithered = floor(dithered * levels) / levels;
    
    outputColor = vec4(dithered, inputColor.a);
}
`;

// We need to override the main fragment shader to support pixelation properly if we want it,
// but for now let's stick to the Effect class structure.
class DitherEffectImpl extends Effect {
    constructor({ pixelSize = 4.0, resolution = [window.innerWidth, window.innerHeight] } = {}) {
        super(
            'DitherEffect',
            fragmentShader,
            {
                uniforms: new Map<string, any>([
                    ['pixelSize', new Uniform(pixelSize)],
                    ['resolution', new Uniform(resolution)],
                ]),
            }
        );
    }
}

interface DitherEffectProps {
    pixelSize?: number;
}

export const DitherEffect = forwardRef<any, DitherEffectProps>(({ pixelSize = 4.0 }, ref) => {
    const effect = useMemo(() => new DitherEffectImpl({ pixelSize }), [pixelSize]);
    return <primitive ref={ref} object={effect} dispose={null} />;
});
