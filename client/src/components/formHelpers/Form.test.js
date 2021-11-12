import { render, fireEvent, screen } from '@testing-library/react';

import Form from './form';

const defaultTestProps = {
  buttonText: 'Submit',
  formFields: [
    { name: 'name', label: 'name Label' },
    { name: 'website', label: 'WebSite label' }
  ],
  id: 'my-test-form',
  options: {
    types: {
      name: 'text',
      website: 'url'
    },
    required: ['website']
  },
  submit: () => {}
};

test('should render', () => {
  render(<Form {...defaultTestProps} />);

  const nameInput = screen.getByLabelText(/name Label/);
  expect(nameInput).not.toBeRequired();
  expect(nameInput).toHaveAttribute('type', 'text');

  const websiteInput = screen.getByLabelText(/WebSite label/);
  expect(websiteInput).toBeRequired();
  expect(websiteInput).toHaveAttribute('type', 'url');

  const button = screen.getByText(/submit/i);
  expect(button).toHaveAttribute('type', 'submit');
  expect(button).toBeDisabled();
});

test('should render with default values', () => {
  const websiteValue = 'http://mysite.com';
  const nameValue = 'John';

  render(
    <Form
      {...defaultTestProps}
      enableSubmit={true}
      initialValues={{ name: nameValue, website: websiteValue }}
    />
  );

  const nameInput = screen.getByLabelText(/name Label/);
  expect(nameInput).toHaveValue(nameValue);

  const websiteInput = screen.getByLabelText(/WebSite label/);
  expect(websiteInput).toHaveValue(websiteValue);

  const button = screen.getByText(/submit/i);
  expect(button).toBeEnabled();
});

test('should submit', () => {
  const submit = jest.fn();
  const props = {
    ...defaultTestProps,
    submit
  };
  const websiteValue = 'http://mysite.com';

  render(<Form {...props} />);

  const websiteInput = screen.getByLabelText(/WebSite label/);
  fireEvent.change(websiteInput, { target: { value: websiteValue } });
  expect(websiteInput).toHaveValue(websiteValue);

  const button = screen.getByText(/submit/i);
  expect(button).toBeEnabled();

  fireEvent.click(button);
  expect(submit).toHaveBeenCalledTimes(1);
  expect(submit.mock.calls[0][0].values).toEqual({ website: websiteValue });

  fireEvent.change(websiteInput, { target: { value: `${websiteValue}///` } });
  expect(websiteInput).toHaveValue(`${websiteValue}///`);

  fireEvent.click(button);
  expect(submit).toHaveBeenCalledTimes(2);
  expect(submit.mock.calls[1][0].values).toEqual({ website: websiteValue });
});
