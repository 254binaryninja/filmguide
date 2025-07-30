import type { Meta, StoryObj } from "@storybook/react";
import FilmGuideHeroSection from "@/components/hero/HeroSection";

const meta: Meta<typeof FilmGuideHeroSection> = {
  title: "HeroSection",
  component: FilmGuideHeroSection,
};

export default meta;

type Story = StoryObj<typeof FilmGuideHeroSection>;

export const Default: Story = {
  render: () => <FilmGuideHeroSection />,
};
