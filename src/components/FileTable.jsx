import {
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PropTypes from "prop-types";
import FormDocument from "./FormDocument";
import { useState } from "react";

const FileTable = ({ files, onFileDelete, onFileSend }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handlesender = async (file) => {
    try {
      await onFileSend(file);
      await onFileDelete(file);
    } catch (error) {
      console.error(error);
    }
  };

  const hasError = (file) => {
    let error = false;
    if (file.error || file.response?.Estado === "Error") {
      error = true;
    }
    return error;
  };

  const handleColor = (file) => {
    if (hasError(file)) {
      return "error";
    } else if (file.response) {
      return "green";
    } else {
      return "primary";
    }
  };

  return (
    <div>
      {files.map((file, index) => (
        <Accordion
          key={index}
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
        >
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <Typography color={handleColor(file)}>{file.fileName}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {hasError(file) && (
              <Typography color="error">
                {file.error || file.response?.MsgError}
              </Typography>
            )}
            {!hasError(file) && !file.response && (
              <FormDocument
                json={file.data}
                upload={() => handlesender(file.data)}
              />
            )}
            {!hasError(file) && file.response && (
              <Typography>
                El documento {file.fileName} se cargo con exito en SAP DocNum:
                {file.response.DocNum}
              </Typography>
            )}
          </AccordionDetails>
          <AccordionDetails>
            {!hasError(file) && (
              <Button onClick={() => handlesender(file.data)}>Enviar</Button>
            )}
            <Button color="warning" onClick={() => onFileDelete(file)}>
              Eliminar
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

FileTable.propTypes = {
  files: PropTypes.array.isRequired,
  onFileView: PropTypes.func.isRequired,
  onFileDelete: PropTypes.func.isRequired,
  onFileSend: PropTypes.func.isRequired,
};

export default FileTable;
