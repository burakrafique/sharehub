import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Badge, Button, Alert } from 'react-bootstrap';
import { checkBackendHealth, checkAPIHealth } from '../utils/healthCheck';
import API from '../services/api';

const APITest = () => {
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const tests = [
    { name: 'Backend Health', test: checkBackendHealth },
    { name: 'API Documentation', test: checkAPIHealth },
    { name: 'Get Stats', test: async () => {
      try {
        const res = await API.get('/stats');
        return { success: true, data: res.data };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }},
    { name: 'Get Items', test: async () => {
      try {
        const res = await API.get('/items');
        return { success: true, data: res.data };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }}
  ];

  const runTests = async () => {
    setTesting(true);
    setResults([]);

    for (const test of tests) {
      const result = await test.test();
      setResults(prev => [...prev, { name: test.name, ...result }]);
    }

    setTesting(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <Container className="py-5">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">API Connection Test</h4>
        </Card.Header>
        <Card.Body>
          <Alert variant="info">
            <strong>Testing connection to:</strong> http://localhost:5000
          </Alert>

          <Button 
            variant="primary" 
            onClick={runTests} 
            disabled={testing}
            className="mb-3"
          >
            {testing ? 'Testing...' : 'Run Tests Again'}
          </Button>

          <ListGroup>
            {results.map((result, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{result.name}</strong>
                  {result.success && result.message && (
                    <div className="small text-muted">{result.message}</div>
                  )}
                  {!result.success && result.error && (
                    <div className="small text-danger">{result.error}</div>
                  )}
                </div>
                <Badge bg={result.success ? 'success' : 'danger'}>
                  {result.success ? '✓ Pass' : '✗ Fail'}
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {results.length === 0 && !testing && (
            <Alert variant="secondary" className="mt-3">
              Click "Run Tests" to check API connection
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default APITest;
