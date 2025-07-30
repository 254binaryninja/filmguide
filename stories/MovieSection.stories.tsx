import type { Meta, StoryObj } from "@storybook/react"
import MovieSection from "@/components/movies/MovieSection"


const meta: Meta<typeof MovieSection> = {
    title: "MovieSection",
    component: MovieSection,
}

export default meta


type Story = StoryObj<typeof MovieSection>

export const Default: Story = {
    render: () => <MovieSection />,
}