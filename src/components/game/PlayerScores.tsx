import { Text, Title } from '@mantine/core';
import { Player } from '@/types/game';

interface PlayerScoresProps {
  players: Player[];
}

export function PlayerScores({ players }: PlayerScoresProps) {
  if (players.length === 0) return null;

  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      width: '100%',
    }}>
      {players.map(player => (
        <div
          key={player.id}
          style={{
            flex: 1,
            background: 'linear-gradient(180deg, #0e14b8 0%, #0a0f8a 100%)',
            borderBottom: '4px solid #d4a843',
            borderRadius: '4px',
            padding: '0.6rem 0.75rem',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Title
            order={1}
            ta="center"
            style={{
              color: '#ffffff',
              lineHeight: 1.2,
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
              textTransform: 'uppercase',
            }}
          >
            {player.name}
          </Title>
          <Text
            fw={900}
            ta="center"
            style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.8rem)',
              fontVariantNumeric: 'tabular-nums',
              color: player.score >= 0 ? '#d4a843' : '#ff6b6b',
              lineHeight: 1.2,
              textShadow: player.score >= 0
                ? '2px 2px 4px rgba(0, 0, 0, 0.6)'
                : '0 0 8px rgba(255, 80, 80, 0.4)',
            }}
          >
            ${player.score.toLocaleString()}
          </Text>
        </div>
      ))}
    </div>
  );
}
