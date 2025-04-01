import servicePrint from "./src/services/Printer/index.js";
import servicePDF from "./src/services/PDF/index.js";
import serviceQuestions from "./src/services/Questions/index.js";
import serviceConsole from "./src/services/Console/index.js";
/*  */
import { fileURLToPath } from 'url';
import path from 'path';
import os from 'os';
import fs from 'fs';

/*  */
const Console = new serviceConsole();
const Questions = new serviceQuestions();
const PDF = new servicePDF();
const Print = new servicePrint();


const downloadsPath = path.join(os.homedir(), 'Documents', 'terminal-etiquetas');

async function csvToJson(filePath) {
    const data = fs.readFileSync(path.resolve(filePath), 'utf8');
    const [header, ...rows] = data.replaceAll('\r', '').split('\n').map(row => row.split(';'));
    const dataMap = rows.map(row => Object.fromEntries(header.map((col, i) => [col, row[i]])))
    return dataMap.filter(y => y.codigo != '').map(item => {
        const val = Object.values(item)[0];
        const col = Object.keys(item)[0];
        item[col] = val.toUpperCase();
        return item;
    });
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

class Main {
    constructor(){

    }

    /* Start */
    startApp = async() => {
        try {
            console.clear()
            //await Console.consoleLog({ message: 'Carregando modulos.. Aguarde', awaitClear: 2000 });
            await Console.consoleLog({ message: 'Carregando modulos e impressoras.. Aguarde', awaitClear: 2000, endClear:true });
            await Console.consoleLog({ message: 'Atencao: Para que o terminal funcione perfeitamente o "Monitor de porta LPR" e "Servico de impressao LPD" precisam esta ativos!', awaitClear: 2000, endClear:true });
            
            const response1 = await Questions.questionSimple({ message: 'Digite o SKU' });
            // Validando sku
            const dataProducts = await csvToJson(`${downloadsPath}/database.csv`)
            const $find = dataProducts.find(t => t.codigo == response1.value.toUpperCase()) || null;
            if($find==null){
                await Console.consoleLog({ message: 'Produto nao encontrado.. Tente novamente', awaitClear: 2000 });
                this.startApp();
                return;
            }

            //
            const response2 = await Questions.questionSimple({ message: 'Digite o valor final (por) (use somente virgulas para casas decimais sem o "R$")' });
            const response3 = await Questions.questionSimple({ message: 'Quantidade de etiquetas' });

            //
            const dirFile = await PDF.createLabel({
                sku: $find.codigo,
                descricao: $find.nome,
                priceOld: $find.pantigo,
                priceNew: formatCurrency(parseFloat(response2.value.replaceAll(',', '.'))),
                amount: parseInt(response3.value || 0),
            });

            // Imprimindo: listando impressora
            const dataPrinters = await Print.listPrinters();
            const response4 = await Questions.questionList({ message: 'Selecione a impressora', listOptions: dataPrinters.map(item => item.name)});

            // Imprimindo: Imprimindo arquivo
            const result = await Print.sendPrinter({ dir: dirFile, printerName: response4.value })

            setTimeout(() => {
                // Deletando arquivo
                fs.unlink(dirFile, async(err) => {
                    if (err) {
                      console.error('Erro ao deletar o arquivo:', err);
                    } else {
                      console.log(`${dirFile} deletado com sucesso`);
                      await this.startApp()
                    }
                });
            }, 5000);
        } catch (error) {
            console.log(error);
        }
    }
}
process.stdin.resume(); // Impede que o terminal feche imediatamente
const start = new Main();
start.startApp();