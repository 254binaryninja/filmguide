import type { Meta, StoryObj } from "@storybook/react"
import Search from "@/components/search/Search"
import { ClerkProvider } from "@clerk/nextjs"
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";


const meta: Meta<typeof Search> = {
    title: "Search",
    component: Search,
}

export default meta

type Story = StoryObj<typeof Search>

export const Default: Story = {
    render: () => (<>
    <ClerkProvider>
        <ReactQueryProvider>
        <Search />
        </ReactQueryProvider>
    </ClerkProvider>
    </>),
}
