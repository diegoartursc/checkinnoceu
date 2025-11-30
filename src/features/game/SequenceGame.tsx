// src/features/game/SequenceGame.tsx
import React, { memo, useState, useEffect, useCallback, useRef } from 'react';

interface SequenceGameProps {
    data: {
        items: string[];
    };
    onWin: () => void;
}

const SequenceGame = memo(({ data, onWin }: SequenceGameProps) => {
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerSeq, setPlayerSeq] = useState<number[]>([]);
    const [playingIdx, setPlayingIdx] = useState<number | null>(null);
    const [round, setRound] = useState(1);
    const [status, setStatus] = useState<'watch' | 'play'>('watch');
    const hasWonRef = useRef(false);

    const playSequence = useCallback(async (seq: number[]) => {
        setPlayerSeq([]);
        for (let i = 0; i < seq.length; i++) {
            await new Promise(r => setTimeout(r, 500));
            setPlayingIdx(seq[i]);
            await new Promise(r => setTimeout(r, 500));
            setPlayingIdx(null);
        }
        setStatus('play');
    }, []);

    useEffect(() => {
        if (status === 'watch' && !hasWonRef.current) {
            const newStep = Math.floor(Math.random() * 4);
            // We set state here to trigger the sequence update
            setSequence(prev => {
                const newSeq = [...prev, newStep];
                // We play the sequence as a side effect of this state update
                // But since we are in useEffect, we need to be careful.
                // It's better to play it here immediately after calculating it.
                // However, playSequence is async and updates state (playingIdx).
                playSequence(newSeq);
                return newSeq;
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [round, status]);

    const handleTap = useCallback((index: number) => {
        if (status !== 'play') return;
        setPlayingIdx(index);
        setTimeout(() => setPlayingIdx(null), 200);

        const newPlayerSeq = [...playerSeq, index];
        setPlayerSeq(newPlayerSeq);

        if (sequence[newPlayerSeq.length - 1] !== index) {
            alert("Ops! Tente de novo.");
            setSequence([]);
            setRound(1);
            setStatus('watch');
            return;
        }

        if (newPlayerSeq.length === sequence.length) {
            if (round >= 3) {
                if (!hasWonRef.current) {
                    hasWonRef.current = true;
                    onWin();
                }
            } else {
                setRound(r => r + 1);
                setStatus('watch');
            }
        }
    }, [status, playerSeq, sequence, round, onWin]);

    return (
        <div className="h-full flex flex-col items-center justify-center bg-pink-50 rounded-xl p-4">
            <h4 className="font-bold text-pink-700 mb-4 text-sm sm:text-base">
                {status === 'watch' ? 'Observe...' : 'Repita!'} (Fase {round}/3)
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-48 h-48 sm:w-64 sm:h-64">
                {data.items.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => handleTap(i)}
                        className={`rounded-2xl text-3xl sm:text-4xl flex items-center justify-center transition-all duration-200 border-4 border-white shadow-md ${
                            playingIdx === i ? 'bg-white scale-105 brightness-125' : 'bg-pink-200 opacity-80'
                        }`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
});

SequenceGame.displayName = 'SequenceGame';

export default SequenceGame;
