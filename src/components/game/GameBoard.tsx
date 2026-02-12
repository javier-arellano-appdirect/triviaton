import { Stack, Card, Text } from '@mantine/core';
import { QuestionCategory, BoardCell } from '@/types/game';

interface GameBoardProps {
  categories: QuestionCategory[];
  board: BoardCell[][];
}

export function GameBoard({ categories, board }: GameBoardProps) {
  return (
    <div style={{ flex: 1, overflowX: 'auto' }}>
      <div style={{ display: 'flex', gap: '0.6rem', minWidth: 'min-content', justifyContent: 'center' }}>
        {board.map((column, colIndex) => (
          <div key={colIndex} style={{ flex: '1 1 0', minWidth: 140 }}>
            <Card
              padding="md"
              withBorder
              style={{ 
                marginBottom: '0.6rem', 
                textAlign: 'center', 
                backgroundColor: '#1971c2',
                minHeight: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text fw={800} c="white" size="1.5rem" lh={1.2}>
                {categories[colIndex]?.name || ''}
              </Text>
            </Card>
            
            <Stack gap="sm">
              {column.map((cell, rowIndex) => (
                <Card
                  key={rowIndex}
                  padding="md"
                  withBorder
                  shadow="sm"
                  style={{
                    backgroundColor: cell.revealed ? '#f1f3f5' : '#fff',
                    opacity: cell.revealed ? 0.4 : 1,
                    textAlign: 'center',
                    minHeight: 90,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <Text 
                    fw={800} 
                    size="2.2rem" 
                    c={cell.revealed ? 'dimmed' : 'blue'}
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {cell.revealed ? '' : `$${cell.value}`}
                  </Text>
                </Card>
              ))}
            </Stack>
          </div>
        ))}
      </div>
    </div>
  );
}
