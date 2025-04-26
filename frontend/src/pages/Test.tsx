import React, { useState } from 'react';
import styled from 'styled-components';

interface Task {
  id: number;
  title: string;
}

const Container = styled.div`
  padding: 20px;
`;

const Section = styled.div`
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    margin-top: 0;
    margin-bottom: 20px;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 0;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  padding: 15px;
  border: 1px solid #dc3545;
  border-radius: 4px;
  margin: 10px 0;
  background-color: #fff;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  padding: 15px;
  border: 1px solid #28a745;
  border-radius: 4px;
  margin: 10px 0;
  background-color: #fff;
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
      <Section>
        <h2>Test API</h2>

        <Button 
          onClick={getTest} 
          disabled={loading}>
          {loading ? 'Testing...' : 'Test'}
        </Button>

        {taskResponse && (
          <SuccessMessage>
            <h3>Endpoint tested successfuly!</h3>
          </SuccessMessage>
        )}
      </Section>

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}
    </Container>
  );
};

export default Test; 