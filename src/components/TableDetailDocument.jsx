import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const TableDetailDocument = ({ details }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 5 }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell># Linea</TableCell>
            <TableCell>Descripcion</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Descuento</TableCell>
            <TableCell>Impuesto</TableCell>
            <TableCell>Monto Impuesto</TableCell>
            <TableCell>Subtotal</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {details.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.LineNum}
              </TableCell>
              <TableCell>{row.Description}</TableCell>
              <TableCell>{parseFloat(row.Quantity)}</TableCell>
              <TableCell>{parseFloat(row.UnitPrice)}</TableCell>
              <TableCell>{parseFloat(row.DiscPrcnt)}</TableCell>
              <TableCell>{parseFloat(row.TaxCode)}</TableCell>
              <TableCell>{parseFloat(row.VatSum)}</TableCell>
              <TableCell>{parseFloat(row.LineTotal)}</TableCell>
              <TableCell>{parseFloat(row.GTotal)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

TableDetailDocument.propTypes = {
  details: PropTypes.array.isRequired,
};

export default TableDetailDocument;
