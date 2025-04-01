import PdfPrinter from "pdf-to-printer";

export default class Printer {
    constructor(){

    }

    /* List printers */
    listPrinters = async() => {
        try {
            return (await PdfPrinter.getPrinters()).map(print => ({
                name: print.name
            }))
        } catch (error) {
            throw error;
        }
    }

    /* Print file */
    sendPrinter = async({ dir = '', printerName = '' }={}) => {
        try {   
            await PdfPrinter.print(dir, {
                printer: printerName,
            })
            .then(data => data)
            .catch(err => {
                console.log(`Erro ao impirmir ${dir}: ${err.message}`)
            })
        } catch (error) {
            throw error;
        }
    }
}