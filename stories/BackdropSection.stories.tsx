import type { Meta, StoryObj } from "@storybook/react";
import BackdropSection from "@/components/movies/BackdropSection";

/// Mocked movie details for the BackdropSection component
import { MovieDetails } from "@/lib/api/types";

const mockMovieDetails: MovieDetails = {
  id: 1,
  title: "Mock Movie",
  overview: "This is a mock movie for testing purposes.",
  backdrop_path: "/mock-backdrop.jpg",
  release_date: "2023-01-01",
  runtime: 120,
  genres: [{ id: 1, name: "Action" }],
  vote_average: 8.5,
  poster_path: "/mock-poster.jpg",
  vote_count: 1000,
  genre_ids: [1],
  popularity: 99.9,
};

const meta: Meta<typeof BackdropSection> = {
  title: "BackdropSection",
  component: BackdropSection,
  //Args based on movie details
  args: {
    movie: mockMovieDetails,
  },
  argTypes: {
    movie: {
      control: {
        type: "object",
      },
      description: "Movie details object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof BackdropSection>;

export const Default: Story = {
  render: (args) => <BackdropSection {...args} />,
};
