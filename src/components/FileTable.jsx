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
            <Typography color={file.error ? "error" : "primary"}>
              {file.fileName}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {file.error ? (
              <Typography color="error">{file.error}</Typography>
            ) : (
              <FormDocument
                json={file.data}
                upload={() => handlesender(file.data)}
              />
            )}
          </AccordionDetails>
          <AccordionDetails>
            {file.data && (
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
