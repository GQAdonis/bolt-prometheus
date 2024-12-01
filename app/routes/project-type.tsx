import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';

const PROJECT_TYPES = [
  { id: 'react', name: 'React', description: 'Build a modern single-page application' },
  { id: 'next', name: 'Next.js', description: 'Create a full-stack React framework application' },
  { id: 'svelte', name: 'SvelteKit', description: 'Develop with Svelte\'s powerful framework' },
  { id: 'remix', name: 'Remix', description: 'Build better websites with React and web standards' }
];

export default function ProjectType() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleProjectSelect = (projectType: string) => {
    setSelectedType(projectType);
  };

  const handleContinue = () => {
    if (selectedType) {
      navigate(`/chat/${selectedType}`, {
        state: {
          projectType: selectedType,
          isNewProject: true
        }
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Choose Your Project Type</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECT_TYPES.map((type) => (
          <Card
            key={type.id}
            className={`p-6 cursor-pointer transition-all ${
              selectedType === type.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleProjectSelect(type.id)}
          >
            <h2 className="text-xl font-semibold mb-2">{type.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">{type.description}</p>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!selectedType}
          className="px-6"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
