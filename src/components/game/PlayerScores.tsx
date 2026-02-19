import { Text, Title } from '@mantine/core';
import { Player } from '@/types/game';

interface PlayerScoresProps {
  players: Player[];
}

export function PlayerScores({ players }: PlayerScoresProps) {
  if (players.length === 0) return null;

  const count = players.length;
  const isCompact = count > 6;

  const nameFontSize = isCompact
    ? 'clamp(0.65rem, 1.4vw, 1rem)'
    : 'clamp(0.8rem, 2vw, 1.4rem)';

  const scoreFontSize = isCompact
    ? 'clamp(1rem, 2.2vw, 1.8rem)'
    : 'clamp(1.5rem, 3.5vw, 2.8rem)';

  const padding = isCompact ? '0.35rem 0.4rem' : '0.6rem 0.75rem';

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
            minWidth: 0,
            background: 'linear-gradient(180deg, #0e14b8 0%, #0a0f8a 100%)',
            borderBottom: '4px solid #d4a843',
            borderRadius: '4px',
            padding,
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
          }}
        >
          <Title
            order={isCompact ? 3 : 1}
            ta="center"
            style={{
              color: '#ffffff',
              lineHeight: 1.2,
              fontSize: nameFontSize,
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {player.name}
          </Title>
          <Text
            fw={900}
            ta="center"
            style={{
              fontSize: scoreFontSize,
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
