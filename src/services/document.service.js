import axios from 'axios';

// Function to send the document data to SAP
async function sendDocumentToSAP(documentData, token) {
    try {
        const response = await axios.post('https://db.cloud.delserint.com:456/api/ingresarpedido/crearPedido', documentData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 201) {
            if (response.data.Estado === 'Error') {
                throw new Error(response.data.MsgError);
            }
        }

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

// Function to send the document data to SAP
async function sendListDocumentToSAP(documentData, token, db) {
    try {

        const list = {
            DBCode: db,
            PedidosSAP: documentData
        }
        const response = await axios.post('https://db.cloud.delserint.com:456/api/ingresarpedido/crearlistaPedidos', list, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
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
        Detalles: originalDocument.Detalles.map(detalle => ({
            ItemDescription: detalle.Description,
            UnitPrice: (parseFloat(detalle.UnitPrice) * parseFloat(detalle.Quantity)).toFixed(6),
            Rate: parseFloat(detalle.TaxCode)
        }))
    };

    return transformedDocument;
}

export { sendDocumentToSAP, transformDocument, sendListDocumentToSAP };