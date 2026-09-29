import axios from 'axios';
import { baseUrl } from '../libs/Tools';

// Function to send the document data to SAP
async function sendDocumentToSAP(documentData, token) {
    try {
        const response = await axios.post(baseUrl + '/api/ingresarpedido/crearPedido', documentData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.Estado === 'Error') {
            throw new Error(response.data.MsgError);
        }

        console.log(response.data);
        return response.data;
    } catch (error) {
        const responseData = error.response?.data;
        const businessError = responseData?.MsgError ?? (typeof responseData === 'string' ? responseData : null);
        const message = businessError ?? error.message;
        console.error(message);
        throw new Error(message);
    }
}

// Function to send the document data to SAP
async function sendListDocumentToSAP(documentData, token, db) {
    try {

        const list = {
            DBCode: db,
            PedidosSAP: documentData
        }
        const response = await axios.post(baseUrl + '/api/ingresarpedido/crearlistaPedidos', list, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log(response.data);
        return response.data;
    } catch (error) {
        const responseData = error.response?.data;
        const businessError = responseData?.MsgError ?? (typeof responseData === 'string' ? responseData : null);
        const message = businessError ?? error.message;
        console.error(message);
        throw new Error(message);
    }
}

function transformDocument(dbCode, cedula, originalDocument) {
    const transformedDocument = {
        DBCode: dbCode,
        Clave: originalDocument.Clave,
        Cedula: cedula,
        DocDate: originalDocument.DocDate,
        DocDueDate: originalDocument.DocDueDate,
        NumAtCard: originalDocument.NumAtCard,
        DocCur: originalDocument.DocCur,
        Comments: originalDocument.Comments,
        DiscPrcnt: originalDocument.DiscPrcnt,
        Detalles: originalDocument.Detalles.map(detalle => ({
            ItemDescription: detalle.Description,
            UnitPrice: (parseFloat(detalle.UnitPrice) * parseFloat(detalle.Quantity)).toFixed(6),
            Rate: parseFloat(detalle.TaxCode),
            DiscPrcnt: detalle.DiscPrcnt
        }))
    };

    return transformedDocument;
}

export { sendDocumentToSAP, transformDocument, sendListDocumentToSAP };