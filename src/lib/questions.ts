import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { QuestionCategory, Question } from '@/types/game';

interface YAMLQuestion {
  question: string;
  answer: string;
  value: number;
}

interface YAMLCategory {
  name: string;
  types: string[];
  questions: YAMLQuestion[];
}

export function loadQuestions(): QuestionCategory[] {
  const questionsDir = path.join(process.cwd(), 'questions');
  
  if (!fs.existsSync(questionsDir)) {
    console.warn('Questions directory not found');
    return [];
  }

  const files = fs.readdirSync(questionsDir).filter(file => file.endsWith('.yaml'));
  
  const categories: QuestionCategory[] = files.map((file) => {
    const filePath = path.join(questionsDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents) as YAMLCategory;
    
    return {
      id: file.replace('.yaml', ''),
      name: data.name,
      types: data.types,
      questions: data.questions as Question[],
    };
  });

  return categories;
}
