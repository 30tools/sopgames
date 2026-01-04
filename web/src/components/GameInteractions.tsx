"use client";

import { useState } from 'react';
import { Maximize2, Share2, Code, Check } from 'lucide-react';
import { Game } from '../types';

export function GameInteractions({ game }: { game: Game }) {
    const [copied, setCopied] = useState(false);

    const toggleFullscreen = () => {
        const iframe = document.querySelector('iframe');
        if (iframe) {
            type IframeWithFullscreen = HTMLIFrameElement & {
                webkitRequestFullscreen?: () => void;
                msRequestFullscreen?: () => void;
            };

            const target = iframe as IframeWithFullscreen;

            if (target.requestFullscreen) {
                target.requestFullscreen();
            } else if (target.webkitRequestFullscreen) { /* Safari */
                target.webkitRequestFullscreen();
            } else if (target.msRequestFullscreen) { /* IE11 */
                target.msRequestFullscreen();
            }
        }
    };

    const copyEmbed = () => {
        const embedCode = `<iframe src="${game.embedUrl}" width="800" height="600" frameborder="0" allowfullscreen></iframe>`;
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareGame = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: game.name,
                    text: `Play ${game.name} on SOP Games!`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className="space-y-4">
            <button
                onClick={toggleFullscreen}
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
                <Maximize2 className="w-5 h-5" />
                Enter Fullscreen
            </button>
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={shareGame}
                    className="py-3 px-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 border border-border"
                >
                    <Share2 className="w-5 h-5" />
                    Share
                </button>
                <button
                    onClick={copyEmbed}
                    className="py-3 px-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 border border-border"
                >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Code className="w-5 h-5" />}
                    {copied ? 'Copied!' : 'Embed'}
                </button>
            </div>
        </div>
    );
}
