'use client';

import { useEffect, useState } from 'react';
import { Text } from '@mantine/core';
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
          <div
            key={colIndex}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              opacity: colIndex < revealedCategories ? 1 : 0,
              transform: colIndex < revealedCategories ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'all 0.5s ease-out',
            }}
          >
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
                  backgroundColor: '#0e14b8',
                  textAlign: 'center',
                  minHeight: 90,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '2px',
                  boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.3)',
                  opacity: rowIndex < revealedRows ? 1 : 0,
                  transform: rowIndex < revealedRows ? 'scale(1)' : 'scale(0.8)',
                  transition: 'all 0.3s ease-out',
                }}
              >
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
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
