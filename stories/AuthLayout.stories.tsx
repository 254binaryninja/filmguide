import type { Meta, StoryObj } from "@storybook/react";
import AuthLayout from "@/components/auth/AuthLayout";

const meta: Meta<typeof AuthLayout> = {
  title: "AuthLayout",
  component: AuthLayout,
  args: {
    children: "Auth Layout Content",
  },
};

export default meta;

type Story = StoryObj<typeof AuthLayout>;

export const Default: Story = {
  render: (args) => <AuthLayout {...args} />,
};
