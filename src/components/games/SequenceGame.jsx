import React, { useState, useEffect, useCallback, useRef, memo } from 'react';

/**
 * Sequence Game - Memorize and repeat a sequence (Simon Says)
 */
const SequenceGame = memo(({ data, onWin }) => {
    const [sequence, setSequence] = useState([]);
    const [playerSeq, setPlayerSeq] = useState([]);
    const [playingIdx, setPlayingIdx] = useState(null);
    const [round, setRound] = useState(1);
    const [status, setStatus] = useState('watch');
    const hasWonRef = useRef(false);

    useEffect(() => {
        if (status === 'watch' && !hasWonRef.current) {
            const newStep = Math.floor(Math.random() * 4);
            const newSeq = [...sequence, newStep];
            setSequence(newSeq);
            playSequence(newSeq);
        }
    }, [round, status]);

    const playSequence = async (seq) => {
        setPlayerSeq([]);
        for (let i = 0; i < seq.length; i++) {
            await new Promise(r => setTimeout(r, 500));
            setPlayingIdx(seq[i]);
            await new Promise(r => setTimeout(r, 500));
            setPlayingIdx(null);
        }
        setStatus('play');
    };

    const handleTap = useCallback((index) => {
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
