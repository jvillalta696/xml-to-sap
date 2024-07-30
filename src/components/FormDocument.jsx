import { TextField, Button, Box, Container } from "@mui/material";
import PropTypes from "prop-types";
import TableDetailDocument from "./TableDetailDocument";
const FormDocument = ({ json, upload }) => {
  return (
    <Container>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "max-content" },
          mt: 5,
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Codigo Proveedor"
          value={json.CardCode || ""}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Nombre del Proveedor"
          value={json.CardName || ""}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Clave"
          value={json.Clave || ""}
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          label="Numero de referencia"
          value={json.NumAtCard || ""}
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          label="Fecha del Documento"
          value={json.DocDate || ""}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Fecha de Vencimiento"
          value={json.DocDueDate || ""}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Modena"
          value={json.DocCur || ""}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Comentarios"
          value={json.Comments || ""}
          InputProps={{
            readOnly: true,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={upload}
        >
          Subir a SAP
        </Button>
        <TableDetailDocument details={json.Detalles} />
      </Box>
    </Container>
  );
};

FormDocument.propTypes = {
  json: PropTypes.object.isRequired,
  upload: PropTypes.func.isRequired,
};

export default FormDocument;
