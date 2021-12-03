import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', () => {
  render(<ContactForm />);
});

test('renders the contact form header', () => {
  render(<ContactForm />);

  const header = screen.queryByText(/contact form/i);
  expect(header).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
  render(<ContactForm />);

  const firstNameElement = screen.getByLabelText(/First Name*/i);
  userEvent.type(firstNameElement, 'asdf');

  const errorMsg = await screen.findAllByTestId(/error/i);
  expect(errorMsg).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
  render(<ContactForm />);

  const button = screen.getByRole("button");
  userEvent.click(button);

  await waitFor(() => {
    const errorMsg = screen.queryAllByTestId("error");
    expect(errorMsg).toHaveLength(3);
  });
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
  render(<ContactForm />);

  const FirstName = screen.getByPlaceholderText(/edd/i);
  userEvent.type(FirstName, "Jessica");

  const LastName = screen.getByPlaceholderText(/burke/i);
  userEvent.type(LastName, "Ambrocio");

  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  const errorMsg = screen.queryByText(/error/i);
  expect(errorMsg).toBeInTheDocument();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);

  const email = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i);
  userEvent.type(email, "asdf");

  const errorMsg = await screen.findByText(/email must be a valid email address/i);
  expect(errorMsg).toBeInTheDocument();

});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);

  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  const errorMsg = screen.queryByText(/lastName is a required field/i);
  expect(errorMsg).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
  render(<ContactForm />);

  const FirstName = screen.getByPlaceholderText(/edd/i);
  userEvent.type(FirstName, "Jessica");

  const lastName = screen.getByPlaceholderText(/burke/i);
  userEvent.type(lastName, "Ambrocio");

  const email = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i);
  userEvent.type(email, "asd@gmail.com");

  const button = screen.getByRole("button");
  userEvent.click(button);

  await waitFor(() => {
    const firstNameError = screen.queryByText("Jessica");
    expect(firstNameError).toBeInTheDocument();

    const lastNameError = screen.queryByText("Ambrocio");
    expect(lastNameError).toBeInTheDocument();

    const emailError = screen.queryByText("asd@gmail.com");
    expect(emailError).toBeInTheDocument();

    const msgError = screen.queryByTestId("msgError");
    expect(msgError).not.toBeInTheDocument();

  });

});

test('renders all fields text when all fields are submitted.', async () => {
  render(<ContactForm />);

  const FirstName = screen.getByPlaceholderText(/edd/i);
  userEvent.type(FirstName, "Jessica");

  const lastName = screen.getByPlaceholderText(/burke/i);
  userEvent.type(lastName, "Ambrocio");

  const email = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i);
  userEvent.type(email, "asd@gmail.com");

  const message = screen.getByLabelText(/message/i);
  userEvent.type(message, "text");

  const button = screen.getByRole("button");
  userEvent.click(button);

  await waitFor(() => {
    const firstNameMsg = screen.queryByText("Jessica");
    expect(firstNameMsg).toBeInTheDocument();

    const lastNameMsg = screen.queryByText("Ambrocio");
    expect(lastNameMsg).toBeInTheDocument();

    const emailMsg = screen.queryByText("asd@gmail.com");
    expect(emailMsg).toBeInTheDocument();

    const outputMsg = screen.queryByTestId(/message/i);
    expect(outputMsg).toBeInTheDocument();

  });

});