'use client';

import { useEffect, useState } from 'react';
import { Stack, Card, Text } from '@mantine/core';
import { QuestionCategory, BoardCell } from '@/types/game';

interface BoardAnimationProps {
  categories: QuestionCategory[];
  board: BoardCell[][];
  onComplete: () => void;
}

export function BoardAnimation({ categories, board, onComplete }: BoardAnimationProps) {
  const [revealedCategories, setRevealedCategories] = useState(0);
  const [revealedRows, setRevealedRows] = useState(0);

  useEffect(() => {
    // Reveal categories one by one
    if (revealedCategories < categories.length) {
      const timer = setTimeout(() => {
        // Play sound placeholder
        try {
          const audio = new Audio('/sounds/category-reveal.mp3');
          audio.play().catch(() => {
            console.log('Sound not available yet');
          });
        } catch (error) {
          console.log('Sound not loaded');
        }

        setRevealedCategories(prev => prev + 1);
      }, 800); // 800ms between each category

      return () => clearTimeout(timer);
    } else if (revealedRows < 5) {
      // After all categories revealed, reveal rows one by one
      const timer = setTimeout(() => {
        setRevealedRows(prev => prev + 1);
      }, 600); // 600ms between each row

      return () => clearTimeout(timer);
    } else {
      // Animation complete
      const timer = setTimeout(() => {
        onComplete();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [revealedCategories, revealedRows, categories.length, onComplete]);

  return (
    <div style={{ flex: 1, overflowX: 'auto' }}>
      <div style={{ 
        display: 'flex', 
        gap: '0.6rem', 
        minWidth: 'min-content',
        justifyContent: 'center',
      }}>
        {board.map((column, colIndex) => (
          <div 
            key={colIndex} 
            style={{ 
              flex: '1 1 0', 
              minWidth: 140,
              opacity: colIndex < revealedCategories ? 1 : 0,
              transform: colIndex < revealedCategories ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'all 0.5s ease-out',
            }}
          >
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
                    backgroundColor: '#fff',
                    textAlign: 'center',
                    minHeight: 90,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: rowIndex < revealedRows ? 1 : 0,
                    transform: rowIndex < revealedRows ? 'scale(1)' : 'scale(0.8)',
                    transition: 'all 0.3s ease-out',
                  }}
                >
                  <Text 
                    fw={800} 
                    size="2.2rem" 
                    c="blue"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    ${cell.value}
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
