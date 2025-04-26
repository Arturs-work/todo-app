import React, { useState } from 'react';
import styled from 'styled-components';

interface Task {
  id: number;
  title: string;
}

const Container = styled.div`
  padding: 20px;
`;

const Test: React.FC = () => {
  const [taskResponse, setTaskResponse] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetch('http://localhost:4000/api/tasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!result.ok) {
        throw new Error(`HTTP error! Status: ${result.status}`);
      }
      
      const data = await result.json();
      setTaskResponse(data);
    } catch (err) {
      console.error('Error testing endpoint:', err);

      setError('Failed to test endpoint. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
    </Container>
  );
};

export default Test; 