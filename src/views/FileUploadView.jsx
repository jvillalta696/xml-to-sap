import { useState } from "react";
//import axios from 'axios';
import "./FileUploadView.css"; // Asegúrate de crear este archivo CSS
import { createJson, esFactura, extractDataFromXML } from "../libs/Tools";
import FormDocument from "../components/FormDocument";
import {
  Alert,
  Box,
  Button,
  Container,
  LinearProgress,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Logout, Send } from "@mui/icons-material";
import { useAuth } from "../context/auth.context";
import {
  sendDocumentToSAP,
  transformDocument,
} from "../services/document.service";
import FileTable from "../components/FileTable";
//import { extractDataFromXML } from '../libs/Tools';

function FileUploadView() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [json, setJson] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const { db, token, logout } = useAuth();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleFileChange = (event) => {
    setJson(null);
    const selectedFile = event.target.files;
    if (selectedFile) {
      setFile(Array.from(selectedFile));
      setMessage("");
    } else {
      setMessage("Por favor, selecciona un archivo XML.");
    }
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    setJson(null);
    const selectedFile = event.dataTransfer.files;
    if (selectedFile) {
      setFile(Array.from(selectedFile));
      setMessage("");
    } else {
      setMessage("Por favor, selecciona un archivo XML.");
    }
  };

  const handleFileUpload = async () => {
    try {
      setMessage("");
      setError("");
      setLoading(true);
      const data = transformDocument(db, json.CardCode, json);
      console.log(data);
      const response = await sendDocumentToSAP(data, token);
      console.log(response);
      setIsError(false);
      setMessage("¡Documento enviado exitosamente!");
    } catch (error) {
      setIsError(true);
      setError(error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
      setOpen(true);
      setJson(null);
    }
  };

  const handleDelete = (fileToDelete) => {
    setFile((prevFiles) => prevFiles.filter((fl) => fl !== fileToDelete));
    setJson(null);
  };

  // Función para manejar la subida del archivo
  const handleFileLoad = async (fl) => {
    // Verificar si se ha seleccionado un archivo
    if (!file) {
      setMessage("Por favor, selecciona un archivo primero.");
      return;
    }

    // Establecer el estado de subida a true
    setUploading(true);

    // Leer el contenido del archivo
    const reader = new FileReader();
    reader.onload = async (e) => {
      const xmlContent = e.target.result;

      // Crear un parser para convertir el contenido en un documento XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
      const rootElement = xmlDoc.documentElement;
      if (esFactura(rootElement)) {
        // Extraer los datos del XML
        const extractedData = extractDataFromXML(rootElement);
        try {
          // Enviar los datos extraídos al servidor
          //const response = await axios.post('https://api.example.com/endpoint', extractedData);
          console.log(extractedData);
          const obj = createJson(extractedData);
          setJson(obj);
          console.log(obj);
          console.log(json);
          setMessage("¡Archivo cargado exitosamente!");
        } catch (error) {
          setMessage("Error al cargar el archivo.");
          console.log(error.message);
        } finally {
          // Establecer el estado de subida a false
          setUploading(false);
        }
      } else {
        setUploading(false);
        setMessage("El documento no es una factura electronica");
        setJson(null);
      }
    };

    // Leer el archivo como texto
    reader.readAsText(fl);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Button
          sx={{ mt: "1rem", mr: "1rem" }}
          variant="contained"
          onClick={logout}
          startIcon={<Logout />}
        >
          Salir
        </Button>
      </Box>
      {loading && <LinearProgress />}
      <Container sx={{ bgcolor: "white", minHeight: "100vh", mt: "1rem" }}>
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            marginBottom: "1rem",
            pt: "5rem",
          }}
        >
          <Typography variant="h3">Subir Archivo de Compras a SAP</Typography>
          <Typography variant="h4">
            Seleccione su archivo xml de factura para cargarlo en SAP
          </Typography>
        </Box>
        <Box
          className="file-upload-container"
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <TextField
            variant="outlined"
            fullWidth
            type="file"
            inputProps={{ accept: ".xml", multiple: true }}
            onChange={handleFileChange}
          />
          <Button
            variant="contained"
            onClick={handleFileLoad}
            disabled={uploading}
            startIcon={<Send />}
          >
            {uploading ? "Cargando..." : "Cargar Archivo"}
          </Button>
          {message && <p>{message}</p>}
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity={isError ? "error" : "success"}
              sx={{ width: "100%" }}
            >
              {isError ? error : message}
            </Alert>
          </Snackbar>
        </Box>
        {file && (
          <>
            <Typography>Archivos seleccionados: </Typography>
            <FileTable
              onFileView={handleFileLoad}
              files={file}
              onFileDelete={handleDelete}
              onFileSend={handleFileUpload}
              json={json}
            />
          </>
        )}
        {/*json && <FormDocument json={json} upload={handleFileUpload} />*/}
      </Container>
    </>
  );
}

export default FileUploadView;
