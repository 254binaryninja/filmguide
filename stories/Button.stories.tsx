import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/ui/button";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
  args: {
    variant: "default",
    children: "Button",
    size: "lg",
  },
  argTypes: {
    variant: {
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
      control: { type: "select" },
    },
    size: {
      options: ["sm", "lg", "default", "icon"],
      control: { type: "select" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  render: (args) => <Button {...args} />,
};
