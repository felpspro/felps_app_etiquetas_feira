import ejs from 'ejs';
import puppeteer from 'puppeteer';

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Define o equivalente de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function gerarPdf(dados) {
    try {
        // Caminho do template EJS
        const templatePath = path.join(__dirname, 'store/base/modelo.ejs');

        // Renderiza o EJS com os dados fornecidos
        const html = await ejs.renderFile(templatePath, { etiquetas: dados });

        // Inicia o Puppeteer
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'load' });

        // Gera o PDF em buffer
        const pdfBuffer = await page.pdf({
            width: '80mm', // Largura fixa
            //height: 'auto', // Altura automática para caber todas as etiquetas
            printBackground: true
        });

        await browser.close();
        return pdfBuffer; // Retorna o buffer do PDF
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        throw new Error('Falha ao gerar o PDF');
    }
}

const etiquetas = [
    { descricao: "KIT ESPECIAL S.O.S. SHAMPOO 250ML + CONDICIONADOR 250ML - GANHA SACHE MÁSCARA 50G + AMPOLA 15ML", precoAntigo: "R$ 999,99", precoNovo: "R$ 999,99", codigo: "FP00001" },
    { descricao: "KIT ESPECIAL S.O.S. SHAMPOO 250ML + CONDICIONADOR 250ML - GANHA SACHE MÁSCARA 50G + AMPOLA 15ML", precoAntigo: "R$ 999,99", precoNovo: "R$ 999,99", codigo: "FP00002" }
];

gerarPdf(etiquetas)
.then(pdfBuffer => {
    fs.writeFileSync('etiquetas.pdf', pdfBuffer);
    console.log('PDF gerado com sucesso!');
})
.catch(error => console.error(error));