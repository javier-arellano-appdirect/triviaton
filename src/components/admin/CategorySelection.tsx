import { useState, useMemo } from 'react';
import { Button, Stack, Title, MultiSelect, Card, Group, Badge, Checkbox, Text } from '@mantine/core';
import { QuestionCategory } from '@/types/game';

interface CategorySelectionProps {
  categories: QuestionCategory[];
  onConfirm: (categoryIds: string[]) => void;
}

export function CategorySelection({ categories, onConfirm }: CategorySelectionProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  // Get all unique types
  const allTypes = useMemo(() => {
    const types = new Set<string>();
    categories.forEach(cat => {
      cat.types.forEach(type => types.add(type));
    });
    return Array.from(types).sort();
  }, [categories]);

  // Filter categories by selected types
  const filteredCategories = useMemo(() => {
    if (typeFilter.length === 0) return categories;
    return categories.filter(cat =>
      cat.types.some(type => typeFilter.includes(type))
    );
  }, [categories, typeFilter]);

  const handleToggle = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else if (prev.length < 6) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    if (selectedIds.length === 6) {
      onConfirm(selectedIds);
    }
  };

  return (
    <Stack gap="md" style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <Title order={2}>Select 6 Categories</Title>
      
      <Text size="sm" c="dimmed">
        Selected: {selectedIds.length} / 6
      </Text>

      <MultiSelect
        label="Filter by Type"
        placeholder="Select types to filter"
        data={allTypes}
        value={typeFilter}
        onChange={setTypeFilter}
        clearable
      />

      <Stack gap="sm">
        {filteredCategories.map(category => (
          <Card
            key={category.id}
            shadow="sm"
            padding="md"
            withBorder
            style={{
              cursor: 'pointer',
              backgroundColor: selectedIds.includes(category.id) ? '#e7f5ff' : undefined,
            }}
            onClick={() => handleToggle(category.id)}
          >
            <Group justify="space-between">
              <Group>
                <Checkbox
                  checked={selectedIds.includes(category.id)}
                  onChange={() => handleToggle(category.id)}
                  disabled={!selectedIds.includes(category.id) && selectedIds.length >= 6}
                />
                <div>
                  <Text fw={500}>{category.name}</Text>
                  <Text size="sm" c="dimmed">
                    {category.questions.length} questions
                  </Text>
                </div>
              </Group>
              <Group gap="xs">
                {category.types.map(type => (
                  <Badge key={type} variant="light">
                    {type}
                  </Badge>
                ))}
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>

      <Button
        onClick={handleSubmit}
        disabled={selectedIds.length !== 6}
        size="lg"
      >
        Start Game ({selectedIds.length}/6 selected)
      </Button>
    </Stack>
  );
}
