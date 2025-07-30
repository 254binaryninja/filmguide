import type { Meta, StoryObj } from "@storybook/react";
import ErrorState from "@/components/common/ErrorState";

// Custom Error object for the ErrorState component

const mockError: Error = {
  name: "NetworkError",
  message: "Failed to fetch data from the server.",
  stack:
    "Error: Failed to fetch data from the server.\n    at fetchData (http://localhost:3000/app.js:123:45)\n    at http://localhost:3000/app.js:456:78",
};

const meta: Meta<typeof ErrorState> = {
  title: "ErrorState",
  component: ErrorState,
  args: {
    error: mockError,
  },
};

export default meta;

type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {
  render: (args) => <ErrorState {...args} />,
};
