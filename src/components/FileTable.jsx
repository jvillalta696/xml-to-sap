import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";
import FormDocument from "./FormDocument";
import { useState } from "react";

const FileTable = ({ files, json, onFileView, onFileDelete, onFileSend }) => {
  // Add 'onFileSend' to the prop validation
  const [viewingFile, setViewingFile] = useState(null);
  //const [json, setJson] = useState(null);

  const handleView = (file) => {
    onFileView(file);
    setViewingFile(file);
    // Aquí puedes establecer el JSON correspondiente al archivo
    //setJson(JSON);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {files.map((file, index) => (
            <>
              <TableRow key={index}>
                <TableCell>{file.name}</TableCell>
                <TableCell>
                  <Button onClick={() => handleView(file)}>Ver</Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => onFileDelete(file)}>Eliminar</Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      onFileSend(file);
                      onFileDelete(file);
                    }}
                  >
                    Enviar
                  </Button>
                </TableCell>
              </TableRow>
              {viewingFile === file && json && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <FormDocument json={json} upload={onFileSend} />
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

FileTable.propTypes = {
  files: PropTypes.array.isRequired,
  onFileView: PropTypes.func.isRequired,
  onFileDelete: PropTypes.func.isRequired,
  onFileSend: PropTypes.func.isRequired,
};

export default FileTable;
