import type { Meta, StoryObj } from "@storybook/react";
import Preference from "@/components/common/Preference";
import { ClerkProvider } from "@clerk/nextjs";

const meta: Meta<typeof Preference> = {
    title: "Preference",
    component: Preference,
    args: {
        preference: "watchlist", // Default value
    },
    argTypes: {
        preference: {
            options: ["watchlist","history"],
            control: { type: "select" },
        },
    },
};

export default meta;

type Story = StoryObj<typeof Preference>;

export const Default: Story = {
    render: (args) => (
        <>
         <ClerkProvider>
            <Preference {...args} />
         </ClerkProvider>
        </>
    ),
};