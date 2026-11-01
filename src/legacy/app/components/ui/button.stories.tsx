import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download, Filter } from "lucide-react";
import { Button } from "./button";

const meta = {
  title: "Foundation/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Find a game" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "outline", children: "View details" } };
export const WithIcon: Story = { args: { children: <><Filter />Filter results</> } };
export const Export: Story = { args: { variant: "outline", children: <><Download />Export CSV</> } };
export const Disabled: Story = { args: { disabled: true, children: "Unavailable" } };
