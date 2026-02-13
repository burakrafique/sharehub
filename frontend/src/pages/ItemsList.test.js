// Simple test to verify ItemsList component structure
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ItemsList from './ItemsList';

// Mock the services
jest.mock('../services/itemService', () => ({
  getAllItems: jest.fn(() => Promise.resolve({
    success: true,
    data: {
      items: [],
      totalPages: 1,
      totalItems: 0
    }
  }))
}));

// Mock components
jest.mock('../components/SearchBar', () => {
  return function SearchBar({ onSearch }) {
    return <div data-testid="search-bar">Search Bar</div>;
  };
});

jest.mock('../components/FilterSidebar', () => {
  return function FilterSidebar({ filters, onFilterChange }) {
    return <div data-testid="filter-sidebar">Filter Sidebar</div>;
  };
});

jest.mock('../components/Pagination', () => {
  return function Pagination({ currentPage, totalPages }) {
    return <div data-testid="pagination">Pagination</div>;
  };
});

jest.mock('../components/ItemCard', () => {
  return function ItemCard({ item }) {
    return <div data-testid="item-card">{item.title}</div>;
  };
});

jest.mock('../components/LoadingSpinner', () => {
  return function LoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

jest.mock('../components/EmptyState', () => {
  return function EmptyState({ title, message }) {
    return <div data-testid="empty-state">{title}</div>;
  };
});

describe('ItemsList Component', () => {
  const renderWithRouter = (component) => {
    return (
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('renders without crashing', () => {
    const { container } = render(renderWithRouter(<ItemsList />));
    expect(container).toBeInTheDocument();
  });

  test('contains required components', () => {
    const { getByTestId } = render(renderWithRouter(<ItemsList />));
    
    // Should contain search bar
    expect(getByTestId('search-bar')).toBeInTheDocument();
    
    // Should contain filter sidebar (desktop version)
    expect(getByTestId('filter-sidebar')).toBeInTheDocument();
  });
});

// Export for potential use in other tests
export default ItemsList;