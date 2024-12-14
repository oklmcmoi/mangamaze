import Phaser from 'phaser';
import { LoadingScene } from './scenes/LoadingScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { PreloadScene } from './scenes/PreloadScene';

export const gameConfig = {
    type: Phaser.WEBGL,
    parent: 'game-container',
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
            fps: 60
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 800,
            height: 600
        },
        max: {
            width: 1920,
            height: 1080
        }
    },
    scene: [PreloadScene, LoadingScene, MenuScene, GameScene],
    pixelArt: false,
    backgroundColor: '#000000',
    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false,
        transparent: false,
        clearBeforeRender: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: false,
        powerPreference: 'high-performance',
        batchSize: 4096
    },
    fps: {
        target: 60,
        forceSetTimeOut: false,
        deltaHistory: 10
    },
    callbacks: {
        postBoot: function (game) {
            // Activation du pipeline de post-processing
            game.renderer.pipelines.add('CustomPipeline', new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline({
                game: game,
                renderer: game.renderer,
                fragShader: `
                    precision mediump float;
                    uniform sampler2D uMainSampler;
                    uniform float time;
                    varying vec2 outTexCoord;
                    void main() {
                        vec4 color = texture2D(uMainSampler, outTexCoord);
                        // Ajout d'effets de post-processing
                        color.rgb += 0.01 * sin(time + outTexCoord.x * 10.0);
                        gl_FragColor = color;
                    }
                `
            }));
        }
    },
    banner: false
};
