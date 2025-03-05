import { render as _render, screen } from 'test/utilities';
import { PackingList } from '.';
import { expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { createStore } from './store';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

const render: typeof _render = (Component, options) => {
  const store = createStore();

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );

  return _render(Component, { ...options, wrapper: Wrapper });
};

const renderComponent = () => {
  return {
    ...render(<PackingList />),
    itemInput: screen.getByPlaceholderText('New Item'),
    addButton: screen.getByRole('button', { name: 'Add New Item' }),
    user: userEvent.setup(),
  };
};

it('renders the Packing List application', () => {
  render(<PackingList />);
});

it('has the correct title', async () => {
  render(<PackingList />);
  screen.getByText('Packing List');
});

it('has an input field for a new item', () => {
  renderComponent();
});

it('has a "Add New Item" button that is disabled when the input is empty', () => {
  const { itemInput, addButton } = renderComponent();
  expect(itemInput).toHaveValue('');
  expect(addButton).toBeDisabled();
});

it('enables the "Add New Item" button when there is text in the input field', async () => {
  const { itemInput, addButton, user } = renderComponent();
  await user.type(itemInput, 'hello');
  expect(itemInput).toHaveValue('hello');
  expect(addButton).toBeEnabled();
  await user.click(addButton);
});

it('adds a new item to the unpacked item list when the clicking "Add New Item"', async () => {
  const { itemInput, addButton, user } = renderComponent();
  await user.type(itemInput, 'hello');
  await user.click(addButton);

  const item = screen.getByText('hello');
  const removeButton = screen.getByRole('button', { name: /remove/i });
});
