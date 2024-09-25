/**
 * Valida un documento.
 * 
 * @param {Object} doc - El documento a validar.
 * @returns {Object} - Un objeto con la información de la validación.
 */
export const validaDocumento = (doc, bd) => {
    const respuesta = {
        error: false,
        mensaje: ''
    };
    if (doc.Receptor.Identificacion.Numero !== '3101568373' && bd === '01') {
        respuesta.error = true;
        respuesta.mensaje += 'El documento debe ser para "CORI MOTORS DE CENTROAMERICA S.A." \r\n';
        return respuesta
    }
    if (doc.Receptor.Identificacion.Numero !== '3101790844' && bd === '02') {
        respuesta.error = true;
        respuesta.mensaje += 'El documento debe ser para "SMART CARS SOCIEDAD ANONIMA" \r\n';
        return respuesta
    }
    return respuesta;
}

/**
 * Verifica si un documento es una factura electrónica.
 * @param {Object} doc - El documento a verificar.
 * @returns {boolean} - Devuelve true si el documento es una factura electrónica, de lo contrario devuelve false.
 */
export const esFactura = (doc) => {
    if (doc.nodeName === 'FacturaElectronica') {
        return true;
    } else return false;
}


// Función para extraer datos de un nodo XML recursivamente
/**
 * Extrae los datos de un nodo XML y los devuelve en un objeto.
 * @param {Node} node - El nodo XML del que se extraerán los datos.
 * @returns {Object} - Un objeto que contiene los datos extraídos del nodo XML.
 */
export const extractDataFromXML = (node) => {
    const result = {};
    for (const childNode of node.children) {
        if (childNode.children.length > 0) {
            if (result[childNode.nodeName]) {
                // Si ya existe una propiedad con este nombre, conviértela en un array
                if (!Array.isArray(result[childNode.nodeName])) {
                    result[childNode.nodeName] = [result[childNode.nodeName]];
                }
                result[childNode.nodeName].push(extractDataFromXML(childNode));
            } else {
                result[childNode.nodeName] = extractDataFromXML(childNode);
            }
        } else {
            result[childNode.nodeName] = childNode.textContent;
        }
    }

    return result;
};

/**
 * Crea un objeto JSON a partir de un documento.
 * @param {Object} doc - El documento a partir del cual se creará el JSON.
 * @returns {Object} - El objeto JSON creado.
 */
export const createJson = (doc) => {
    const json = {
        Clave: doc.Clave || null,
        CardCode: doc.Emisor?.Identificacion?.Numero || null,
        CardName: doc.Emisor?.Nombre || null,
        DocDate: doc.FechaEmision.split('T')[0] || null, // Extract the date part only
        DocDueDate: calculateDueDate(doc) || null,
        NumAtCard: doc.NumeroConsecutivo || null,
        DocCur: doc.ResumenFactura?.CodigoTipoMoneda?.CodigoMoneda.replace('CRC', 'COL') || 'COL',
        Comments: doc.Otros?.OtroTexto || '',
        Detalles: []
    };

    if (Array.isArray(doc.DetalleServicio.LineaDetalle)) {
        for (const detalle of doc.DetalleServicio.LineaDetalle) {
            const detalleJson = {
                LineNum: detalle.NumeroLinea,
                Description: detalle.Detalle || '',
                UnitPrice: detalle.PrecioUnitario,
                Quantity: detalle.Cantidad,
                DiscPrcnt: detalle.Descuento || "0.00",
                TaxCode: detalle.Impuesto ? detalle.Impuesto.Tarifa : "0",
                VatSum: detalle.Impuesto ? detalle.Impuesto.Monto : "0",
                LineTotal: detalle.SubTotal,
                GTotal: detalle.MontoTotal
            };
            json.Detalles.push(detalleJson);
        }
    } else if (typeof doc.DetalleServicio.LineaDetalle === 'object') {
        const detalleJson = {
            LineNum: doc.DetalleServicio.LineaDetalle.NumeroLinea,
            Description: doc.DetalleServicio.LineaDetalle.Detalle || '',
            UnitPrice: doc.DetalleServicio.LineaDetalle.PrecioUnitario,
            Quantity: doc.DetalleServicio.LineaDetalle.Cantidad,
            DiscPrcnt: doc.DetalleServicio.LineaDetalle.Descuento || "0.00",
            TaxCode: doc.DetalleServicio.LineaDetalle.Impuesto ? doc.DetalleServicio.LineaDetalle.Impuesto.Tarifa : "0",
            VatSum: doc.DetalleServicio.LineaDetalle.Impuesto ? doc.DetalleServicio.LineaDetalle.Impuesto.Monto : "0",
            LineTotal: doc.DetalleServicio.LineaDetalle.SubTotal,
            GTotal: doc.DetalleServicio.LineaDetalle.MontoTotalLinea,
        };
        json.Detalles.push(detalleJson);
    }
    return json;
}

/**
 * Calcula la fecha de vencimiento de un documento.
 * Si el documento tiene un plazo de crédito, se suma ese plazo a la fecha de emisión.
 * Si no tiene plazo de crédito, se devuelve la fecha de emisión sin cambios.
 * @param {Object} doc - El documento para el cual se calculará la fecha de vencimiento.
 * @returns {string} La fecha de vencimiento en formato ISO (AAAA-MM-DD).
 */
const calculateDueDate = (doc) => {
    if (doc.PlazoCredito) {
        try {

            const docDate = new Date(doc.FechaEmision);
            const dueDate = new Date(docDate.getTime() + (parseInt(doc.PlazoCredito, 10) * 24 * 60 * 60 * 1000));
            console.log(dueDate);
            return dueDate.toISOString().split('T')[0];
        } catch (error) {
            throw new Error('Error al calcular la fecha de vencimiento del documento');
        }
    } else {
        return doc.FechaEmision.split('T')[0];
    }
}
