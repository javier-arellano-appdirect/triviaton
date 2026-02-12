'use client';

import { useEffect, useState } from 'react';
import { Stack, Text } from '@mantine/core';
import { Player } from '@/types/game';

interface GameOverOverlayProps {
  players: Player[];
}

export function GameOverOverlay({ players }: GameOverOverlayProps) {
  const [revealedPlayers, setRevealedPlayers] = useState(0);

  // Sort players by score (lowest to highest)
  const sortedPlayers = [...players].sort((a, b) => a.score - b.score);

  useEffect(() => {
    if (revealedPlayers < sortedPlayers.length) {
      const timer = setTimeout(() => {
        setRevealedPlayers(prev => prev + 1);
      }, 1000); // Reveal one player per second

      return () => clearTimeout(timer);
    }
  }, [revealedPlayers, sortedPlayers.length]);

  // Generate emoji rain
  const emojis = ['🎉', '🏆', '⭐', '🎊', '🌟', '✨', '🎈', '🎆'];
  const emojiCount = 50;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        overflow: 'hidden',
      }}
    >
      {/* Emoji rain */}
      {Array.from({ length: emojiCount }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: -50,
            left: `${Math.random() * 100}%`,
            fontSize: `${20 + Math.random() * 30}px`,
            animation: `fall ${3 + Math.random() * 4}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          {emojis[Math.floor(Math.random() * emojis.length)]}
        </div>
      ))}

      <Stack gap="xl" align="center" style={{ zIndex: 1, maxWidth: 800 }}>
        <Text size="80px" fw={900} c="white" ta="center">
          Game Over!
        </Text>

        <Stack gap="md" style={{ width: '100%', marginTop: '2rem' }}>
          {sortedPlayers.map((player, index) => {
            const isWinner = index === sortedPlayers.length - 1;
            const isRevealed = index < revealedPlayers;

            return (
              <div
                key={player.id}
                style={{
                  opacity: isRevealed ? 1 : 0,
                  transform: isRevealed ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.5s ease-out',
                  transitionDelay: `${index * 0.1}s`,
                }}
              >
                {isWinner ? (
                  <div
                    style={{
                      padding: '2rem',
                      backgroundColor: '#ffd700',
                      borderRadius: 16,
                      textAlign: 'center',
                      border: '4px solid #fff',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                      <Text size="60px">🏆</Text>
                      <Stack gap="xs" align="center">
                        <Text size="50px" fw={900} c="black">
                          {player.name}
                        </Text>
                        <Text size="40px" fw={700} c="black">
                          ${player.score.toLocaleString()}
                        </Text>
                        <Text size="30px" fw={700} c="black">
                          WINNER!
                        </Text>
                      </Stack>
                      <Text size="60px">🏆</Text>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 8,
                      textAlign: 'center',
                    }}
                  >
                    <Text size="30px" fw={700} c="white">
                      {player.name} - ${player.score.toLocaleString()}
                    </Text>
                  </div>
                )}
              </div>
            );
          })}
        </Stack>
      </Stack>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
