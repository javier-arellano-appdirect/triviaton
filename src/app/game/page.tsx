'use client';

import { useEffect, useState, useCallback } from 'react';
import { Stack, Text, Loader, Button } from '@mantine/core';
import { SerializedGameState } from '@/types/game';
import { PlayerScores } from '@/components/game/PlayerScores';
import { GameBoard } from '@/components/game/GameBoard';
import { BoardAnimation } from '@/components/game/BoardAnimation';
import { QuestionDisplay } from '@/components/game/QuestionDisplay';
import { GameOverOverlay } from '@/components/game/GameOverOverlay';

export default function GamePage() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [gameState, setGameState] = useState<SerializedGameState | null>(null);

  const handleEnterGame = useCallback(() => {
    // Create and resume an AudioContext to unlock audio playback
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    ctx.resume().then(() => ctx.close());
    setHasInteracted(true);
  }, []);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;
    let retryCount = 0;
    let unmounted = false;

    function connect() {
      if (unmounted) return;

      eventSource = new EventSource('/api/game/stream');

      eventSource.onmessage = (event) => {
        retryCount = 0; // Reset on successful message
        try {
          const data = JSON.parse(event.data) as SerializedGameState;
          setGameState(data);
        } catch (error) {
          console.error('Failed to parse SSE data:', error);
        }
      };

      eventSource.onerror = () => {
        if (unmounted) return;

        // EventSource fires onerror on any connection issue.
        // readyState CONNECTING (0) means it's auto-reconnecting.
        // readyState CLOSED (2) means it gave up — we handle manual retry.
        if (eventSource?.readyState === EventSource.CLOSED) {
          eventSource.close();
          const delay = Math.min(1000 * 2 ** retryCount, 30000);
          retryCount++;
          retryTimeout = setTimeout(connect, delay);
        }
        // When readyState is CONNECTING, the browser is already retrying
        // automatically — no action needed and no console spam.
      };
    }

    connect();

    return () => {
      unmounted = true;
      eventSource?.close();
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, []);

  // Handle board animation completion
  const handleAnimationComplete = () => {
    // Send completion signal to admin page via API
    fetch('/api/game/animation-complete', {
      method: 'POST',
    }).catch(err => console.error('Failed to signal animation complete:', err));
  };

  // Gate: require a user interaction to unlock audio autoplay
  if (!hasInteracted) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #060b2e 0%, #0e14b8 50%, #060b2e 100%)',
      }}>
        <Button
          onClick={handleEnterGame}
          variant="filled"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            height: 'auto',
            padding: '1.5rem 4rem',
            borderRadius: '0.5rem',
            background: 'linear-gradient(135deg, #d4a843 0%, #b8942e 50%, #d4a843 100%)',
            color: '#060b2e',
            lineHeight: 1.2,
            fontWeight: 900,
            letterSpacing: '0.05em',
            border: '3px solid #f0d080',
            boxShadow: '0 0 30px rgba(212, 168, 67, 0.3)',
            textTransform: 'uppercase',
          }}
        >
          Enter Game
        </Button>
      </div>
    );
  }

  if (!gameState || gameState.state === 'idle' || gameState.state === 'selectPlayers' || gameState.state === 'selectCategories') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #060b2e 0%, #0e14b8 50%, #060b2e 100%)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '60vw',
          height: '60vh',
          gap: '2rem',
        }}>
          <Loader size={120} color="#d4a843" />
          <Text
            fw={800}
            ta="center"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              color: '#d4a843',
              textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)',
              letterSpacing: '0.03em',
            }}
          >
            Waiting for game to start...
          </Text>
        </div>
      </div>
    );
  }

  const { context } = gameState;

  // Board animation state
  if (gameState.state === 'boardAnimation') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '1rem',
        gap: '1rem',
        background: '#060b2e',
      }}>
        {/* Players row on top */}
        <PlayerScores players={context.players} />

        {/* Animated board */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <BoardAnimation
            categories={context.categories}
            board={context.board}
            onComplete={handleAnimationComplete}
          />
        </div>
      </div>
    );
  }

  // Game over state
  if (gameState.state === 'gameOver') {
    return <GameOverOverlay players={context.players} />;
  }

  // Get current clue if in question state
  const currentClue = context.currentClue
    ? context.board[context.currentClue.col]?.[context.currentClue.row]
    : null;

  const isQuestionState = gameState.state.startsWith('showQuestion.');

  const isDouble = currentClue?.isDouble || false;
  const answerRevealed = gameState.state === 'showQuestion.answerRevealed';

  return (
    <>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh', 
        padding: '1rem',
        gap: '1rem',
        background: '#060b2e',
      }}>
        {/* Players row on top */}
        <PlayerScores players={context.players} />

        {/* Center - Game Board */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {context.board.length > 0 ? (
            <GameBoard categories={context.categories} board={context.board} />
          ) : (
            <Stack align="center" justify="center">
              <Loader size="xl" color="#d4a843" />
              <Text style={{ color: '#d4a843', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>Setting up board...</Text>
            </Stack>
          )}
        </div>
      </div>

      {/* Question overlay - full screen */}
      {isQuestionState && currentClue && (
        <QuestionDisplay
          cell={currentClue}
          isDouble={isDouble}
          answerRevealed={answerRevealed}
        />
      )}
    </>
  );
}
