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
      gap: '0.6rem',
      width: '100%',
    }}>
      {players.map(player => (
        <div
          key={player.id}
          style={{
            flex: 1,
            background: player.score >= 0
              ? 'linear-gradient(135deg, #1a3a2a 0%, #1e4d35 100%)'
              : 'linear-gradient(135deg, #3a1a1a 0%, #4d1e1e 100%)',
            borderLeft: player.score >= 0 ? '4px solid #40c057' : '4px solid #fa5252',
            borderRight: player.score >= 0 ? '4px solid #40c057' : '4px solid #fa5252',
            borderRadius: '0.5rem',
            padding: '0.5rem 0.75rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Title
            order={1}
            ta="center"
            style={{
              color: '#ffffff',
              lineHeight: 1.2,
            }}
          >
            {player.name.toUpperCase()}
          </Title>
          <Text
            fw={900}
            ta="center"
            style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.8rem)',
              fontVariantNumeric: 'tabular-nums',
              color: player.score >= 0 ? '#69db7c' : '#ff6b6b',
              lineHeight: 1.2,
            }}
          >
            ${player.score.toLocaleString()}
          </Text>
        </div>
      ))}
    </div>
  );
}
