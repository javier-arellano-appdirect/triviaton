import { Text } from '@mantine/core';
import { QuestionCategory, BoardCell } from '@/types/game';

interface GameBoardProps {
  categories: QuestionCategory[];
  board: BoardCell[][];
}

export function GameBoard({ categories, board }: GameBoardProps) {
  return (
    <div style={{ flex: 1, overflowX: 'auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${board.length}, 1fr)`,
        gap: '4px',
        minWidth: 'min-content',
        background: '#0c0c3c',
        borderRadius: '0.5rem',
        padding: '4px',
        border: '3px solid #3a3a8a',
        boxShadow: '0 0 40px rgba(10, 10, 80, 0.6), inset 0 0 30px rgba(0, 0, 0, 0.3)',
      }}>
        {board.map((column, colIndex) => (
          <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* Category header */}
            <div
              style={{
                textAlign: 'center',
                backgroundColor: '#0e14b8',
                minHeight: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                borderRadius: '2px',
                boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.3)',
              }}
            >
              <Text fw={800} c="white" size="1.4rem" lh={1.2}
                style={{
                  textTransform: 'uppercase',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
                  letterSpacing: '0.02em',
                }}
              >
                {categories[colIndex]?.name || ''}
              </Text>
            </div>

            {/* Value cells */}
            {column.map((cell, rowIndex) => (
              <div
                key={rowIndex}
                style={{
                  backgroundColor: cell.revealed ? '#08083a' : '#0e14b8',
                  textAlign: 'center',
                  minHeight: 90,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '2px',
                  transition: 'all 0.4s ease',
                  boxShadow: cell.revealed
                    ? 'inset 0 0 20px rgba(0, 0, 0, 0.6)'
                    : 'inset 0 0 15px rgba(0, 0, 0, 0.3)',
                }}
              >
                {!cell.revealed && (
                  <Text
                    fw={800}
                    size="2.2rem"
                    style={{
                      fontVariantNumeric: 'tabular-nums',
                      color: '#d4a843',
                      textShadow: '2px 3px 4px rgba(0, 0, 0, 0.7)',
                    }}
                  >
                    ${cell.value}
                  </Text>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
