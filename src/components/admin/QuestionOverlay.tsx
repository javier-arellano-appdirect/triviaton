import { useState } from 'react';
import { Modal, Stack, Title, Text, Button, Group, Checkbox } from '@mantine/core';
import { Player, BoardCell } from '@/types/game';

interface QuestionOverlayProps {
  opened: boolean;
  cell: BoardCell | null;
  players: Player[];
  onRevealAnswer: () => void;
  onSubmitResults: (data: { correct?: string | null; incorrect?: string[]; result?: 'correct' | 'incorrect'; playerId?: string }) => void;
  answerRevealed: boolean;
  isDouble: boolean;
}

export function QuestionOverlay({
  opened,
  cell,
  players,
  onRevealAnswer,
  onSubmitResults,
  answerRevealed,
  isDouble,
}: QuestionOverlayProps) {
  const [correctPlayer, setCorrectPlayer] = useState<string | null>(null);
  const [incorrectPlayers, setIncorrectPlayers] = useState<string[]>([]);
  const [doubleResult, setDoubleResult] = useState<'correct' | 'incorrect' | null>(null);
  const [doublePlayerId, setDoublePlayerId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (isDouble) {
      if (doublePlayerId && doubleResult) {
        onSubmitResults({ result: doubleResult, playerId: doublePlayerId });
      }
    } else {
      onSubmitResults({ correct: correctPlayer, incorrect: incorrectPlayers });
    }
    
    // Reset state
    setCorrectPlayer(null);
    setIncorrectPlayers([]);
    setDoubleResult(null);
    setDoublePlayerId(null);
  };

  const toggleIncorrect = (playerId: string) => {
    setIncorrectPlayers(prev =>
      prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      size="xl"
      centered
      withCloseButton={false}
      closeOnClickOutside={false}
    >
      <Stack gap="lg">
        <Title order={2} ta="center">
          ${cell?.value}
        </Title>
        
        <Title order={1} ta="center">
          {cell?.question}
        </Title>
        <div style={{ padding: '1rem', backgroundColor: '#e7f5ff', borderRadius: 8 }}>
              <Text fw={700} size="lg" ta="center">
                Answer: {cell?.answer}
              </Text>
            </div>

        {!answerRevealed ? (
          <Button onClick={onRevealAnswer} size="lg" fullWidth>
            Reveal Answer
          </Button>
        ) : (
          <>
            {isDouble ? (
              <>
                <Title order={4}>Daily Double - Select Player and Result</Title>
                <Stack gap="sm">
                  {players.map(player => (
                    <Button
                      key={player.id}
                      variant={doublePlayerId === player.id ? 'filled' : 'outline'}
                      onClick={() => setDoublePlayerId(player.id)}
                    >
                      {player.name}
                    </Button>
                  ))}
                </Stack>

                {doublePlayerId && (
                  <Group grow>
                    <Button
                      color="green"
                      variant={doubleResult === 'correct' ? 'filled' : 'outline'}
                      onClick={() => setDoubleResult('correct')}
                    >
                      Correct (+ ${cell?.value ? cell.value * 2 : 0})
                    </Button>
                    <Button
                      color="red"
                      variant={doubleResult === 'incorrect' ? 'filled' : 'outline'}
                      onClick={() => setDoubleResult('incorrect')}
                    >
                      Incorrect (- ${cell?.value ? cell.value * 2 : 0})
                    </Button>
                  </Group>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={!doublePlayerId || !doubleResult}
                  size="lg"
                  fullWidth
                >
                  Submit Result
                </Button>
              </>
            ) : (
              <>
                <Title order={4}>Select Correct Player (optional)</Title>
                <Stack gap="sm">
                  {players.map(player => (
                    <Button
                      key={player.id}
                      variant={correctPlayer === player.id ? 'filled' : 'outline'}
                      color="green"
                      onClick={() => setCorrectPlayer(player.id === correctPlayer ? null : player.id)}
                    >
                      {player.name}
                    </Button>
                  ))}
                </Stack>

                <Title order={4}>Select Incorrect Players (optional)</Title>
                <Stack gap="sm">
                  {players.map(player => (
                    <Checkbox
                      key={player.id}
                      label={player.name}
                      checked={incorrectPlayers.includes(player.id)}
                      onChange={() => toggleIncorrect(player.id)}
                      disabled={player.id === correctPlayer}
                    />
                  ))}
                </Stack>

                <Button
                  onClick={handleSubmit}
                  disabled={!correctPlayer && incorrectPlayers.length === 0}
                  size="lg"
                  fullWidth
                >
                  Submit Results
                </Button>
              </>
            )}
          </>
        )}
      </Stack>
    </Modal>
  );
}
