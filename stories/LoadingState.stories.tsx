import type { Meta, StoryObj } from "@storybook/react"
import LoadingState from "@/components/common/LoadingState"


const meta: Meta<typeof LoadingState> = {
    title: "LoadingState",
    component: LoadingState,
}

export default meta

type Story = StoryObj<typeof LoadingState>

export const Default: Story = {
    render: () => <LoadingState />,
}