import type { Meta, StoryObj } from "@storybook/react"
import Header from "@/components/header/header"
import { ClerkProvider } from "@clerk/nextjs"
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

const meta: Meta<typeof Header> = {
    title: "Header",
    component: Header,
}


export default meta

type Story = StoryObj<typeof Header>

export const Default: Story = {
    render: () => (
        <>
        <ClerkProvider>
            <ReactQueryProvider>
            <Header />
            </ReactQueryProvider>
        </ClerkProvider>
        </>
    ),
}