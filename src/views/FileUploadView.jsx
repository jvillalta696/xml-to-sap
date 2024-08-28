import { useEffect, useState } from "react";
//import axios from 'axios';
import "./FileUploadView.css"; // Asegúrate de crear este archivo CSS
import { createJson, esFactura, extractDataFromXML } from "../libs/Tools";
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
  sendListDocumentToSAP,
  transformDocument,
} from "../services/document.service";
import FileTable from "../components/FileTable";
//import { extractDataFromXML } from '../libs/Tools';

function FileUploadView() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const { db, token, logout } = useAuth();
  const [jsonList, setJsonList] = useState(null);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleFileChange = (event) => {
    setJsonList(null);
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
    const selectedFile = event.dataTransfer.files;
    if (selectedFile) {
      setFile(Array.from(selectedFile));
      setMessage("");
    } else {
      setMessage("Por favor, selecciona un archivo XML.");
    }
  };

  const handleFileUpload = async (js) => {
    try {
      setMessage("");
      setError("");
      setLoading(true);
      const data = transformDocument(db, js.CardCode, js);
      console.log(data);
      const response = await sendDocumentToSAP(data, token);
      console.log(response);
      setIsError(false);
      setMessage("¡Documento enviado exitosamente!");
    } catch (error) {
      setIsError(true);
      setError(error.message);
      console.log(error.message);
      throw error;
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  const handleListFileUpload = async () => {
    try {
      const filteredJsonList = jsonList.filter((item) => !item.error);
      setJsonList(filteredJsonList);
      setMessage("");
      setError("");
      setLoading(true);
      const data = filteredJsonList.map((js) =>
        transformDocument(db, js.data.CardCode, js.data),
      );
      const response = await sendListDocumentToSAP(data, token, db);
      // Buscar la respuesta asociada a cada documento del jsonList
      const updatedJsonList = filteredJsonList.map((js) => {
        const responseItem = response.find(
          (item) => item.clave === js.data.Clave,
        );
        if (responseItem) {
          return { ...js, response: responseItem };
        }
        return js;
      });
      setJsonList(updatedJsonList);
      setIsError(false);
      setMessage(
        "¡Documentos enviados exitosamente! Favor revisar los resultados.",
      );
    } catch (error) {
      setIsError(true);
      setError(error.message);
      console.log(error.message);
      throw error;
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  const handleDelete = (fileToDelete) => {
    setJsonList((prevFiles) =>
      prevFiles.filter((fl) => fl.fileName !== fileToDelete.fileName),
    );
  };

  // Función para manejar la subida del archivo
  const handleFileLoad = async (fl) => {
    // Verificar si se ha seleccionado un archivo

    // Establecer el estado de subida a true

    const readFileAsText = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
      });
    };

    try {
      const xmlContent = await readFileAsText(fl);

      // Crear un parser para convertir el contenido en un documento XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
      const rootElement = xmlDoc.documentElement;

      if (esFactura(rootElement)) {
        // Extraer los datos del XML
        const extractedData = extractDataFromXML(rootElement);
        try {
          // Enviar los datos extraídos al servidor
          // const response = await axios.post('https://api.example.com/endpoint', extractedData);
          console.log(extractedData);
          const obj = createJson(extractedData);
          return { data: obj, error: null };
        } catch (error) {
          setMessage("Error al cargar el archivo.");
          console.log(error.message);
          setUploading(false);
        }
      } else {
        setUploading(false);
        return {
          data: null,
          error: "El documento no es una factura electronica",
        };
      }
    } catch (error) {
      console.error("Error al leer el archivo:", error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const listJson = async () => {
      try {
        const lsjson = [];
        for (let i = 0; i < file.length; i++) {
          const fl = file[i];
          const readFileAsText = (file) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target.result);
              reader.onerror = (e) => reject(e);
              reader.readAsText(file);
            });
          };
          const xmlContent = await readFileAsText(fl);
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
          const rootElement = xmlDoc.documentElement;
          if (esFactura(rootElement)) {
            const extractedData = extractDataFromXML(rootElement);
            try {
              const obj = createJson(extractedData);
              lsjson.push({ data: obj, error: null, fileName: fl.name });
            } catch (error) {
              console.log(error.message);
            }
          } else {
            lsjson.push({
              data: null,
              error: "El documento no es una factura electronica",
              fileName: fl.name,
            });
          }
        }
        setJsonList(lsjson);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (file) {
      listJson();
    }
  }, [file]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          pb: "1rem",
          bgcolor: "white",
        }}
      >
        <Typography variant="h3" sx={{ ml: 5 }}>
          {db === "01" ? "CORIMOTORS" : "SMARTCARS"}
        </Typography>
        <Button
          sx={{ mt: "1rem", mr: "1rem" }}
          variant="contained"
          onClick={logout}
          startIcon={<Logout />}
        >
          Salir
        </Button>
        {loading && (
          <LinearProgress
            sx={{ zIndex: 1000, position: "fixed", top: 65, left: 0, right: 0 }}
          />
        )}
      </Box>

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
            onClick={handleListFileUpload}
            disabled={uploading}
            startIcon={<Send />}
          >
            {uploading ? "Enviando..." : "Envar TODOS los archivos a SAP"}
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
        {jsonList && (
          <>
            <Typography>Archivos seleccionados: </Typography>
            <FileTable
              onFileView={handleFileLoad}
              files={jsonList}
              onFileDelete={handleDelete}
              onFileSend={handleFileUpload}
            />
          </>
        )}
        {/*json && <FormDocument json={json} upload={handleFileUpload} />*/}
      </Container>
    </>
  );
}

export default FileUploadView;
