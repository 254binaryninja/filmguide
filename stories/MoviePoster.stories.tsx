import type { Meta, StoryObj } from "@storybook/react";
import MoviePoster from "@/components/movies/MoviePoster";
import { ClerkProvider } from "@clerk/nextjs";

const meta: Meta<typeof MoviePoster> = {
  title: "MoviePoster",
  component: MoviePoster,
  args: {
    movie: {
      id: 1,
      title: "Inception",
      overview:
        "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
      release_date: "2010-07-16",
      backdrop_path: "/s3Tj6d8c5a7e9b2f4e5c1f8b2a7.jpg",
      vote_count: 20,
      popularity: 8.5,
      genre_ids: [28, 12, 878],
      poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      vote_average: 8.8,
    },
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

type Story = StoryObj<typeof MoviePoster>;

export const Default: Story = {
  render: (args) => (
    <>
      <ClerkProvider>
        <MoviePoster {...args} />
      </ClerkProvider>
    </>
  ),
};
