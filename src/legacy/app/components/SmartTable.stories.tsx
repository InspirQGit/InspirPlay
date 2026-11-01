import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./SmartTable";

const meta = {
  title: "Data display/Smart table",
  component: Table,
  parameters: { layout: "padded" },
  render: () => (
    <Table toolsLabel="Bookings" exportName="bookings">
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>Sport</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell>Aarav Shah</TableCell><TableCell>Badminton</TableCell><TableCell>₹1,200</TableCell></TableRow>
        <TableRow><TableCell>Meera Nair</TableCell><TableCell>Football</TableCell><TableCell>₹850</TableCell></TableRow>
      </TableBody>
    </Table>
  ),
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
