import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Title,
} from "@tremor/react";

interface LapData {
  code: string;
  "Lap Time": number;
  familyName: string;
  givenName: string;
}

interface TableProps {
  data: LapData[];
}

export const TremorTable: React.FC<TableProps> = ({ data }) => {
  const sorted = data.sort((a, b) => a["Lap Time"] - b["Lap Time"]);

  return (
    <Card className="mt-6">
      <Title>Lap Times</Title>
      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Place</TableHeaderCell>
            <TableHeaderCell>Driver</TableHeaderCell>
            <TableHeaderCell>Driver Code</TableHeaderCell>
            <TableHeaderCell>Lap Time (in seconds)</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((item, i) => (
            <TableRow key={item.code}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>
                {item.givenName} {item.familyName}
              </TableCell>
              <TableHeaderCell>{item.code}</TableHeaderCell>
              <TableCell>
                <Text>{item["Lap Time"]}</Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
