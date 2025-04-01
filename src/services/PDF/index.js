import inquirer from "inquirer";
import { PDFDocument,rgb } from 'pdf-lib';
import fs from 'fs'
import ejs from 'ejs';
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
const downloadsPath = path.join(os.homedir(), 'Documents', 'terminal-etiquetas');

// Define o equivalente de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class PDF {
    constructor(){

    }

    /* Create */
    createLabel = async({
        sku = null,
        descricao:descri = null,
        priceOld = null,
        priceNew = null,
        amount = 1
    }={}) => {
        try {

          // Caminho do template EJS
          const templatePath = path.join(`${downloadsPath}/etiqueta-modelo.ejs`);

          const dados = [...Array(amount).keys()].map((item,k) => ({
            descricao: descri,
            precoAntigo: priceOld,
            precoNovo: priceNew,
            codigo: sku
          }))

          /* const dados = [
              { descricao: "KIT ESPECIAL S.O.S. SHAMPOO 250ML + CONDICIONADOR 250ML - GANHA SACHE MÁSCARA 50G + AMPOLA 15ML", precoAntigo: "R$ 999,99", precoNovo: "R$ 999,99", codigo: "FP00001" },
              { descricao: "KIT ESPECIAL S.O.S. SHAMPOO 250ML + CONDICIONADOR 250ML - GANHA SACHE MÁSCARA 50G + AMPOLA 15ML", precoAntigo: "R$ 999,99", precoNovo: "R$ 999,99", codigo: "FP00002" }
          ]; */
  
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
          const fileName = `${downloadsPath}/etiqueta ${new Date().getTime()}.pdf`;
          fs.writeFileSync(fileName, pdfBuffer);
          console.log('PDF gerado com sucesso!');
          return fileName;
        } catch (error) {
            console.log(error)
            return error;
        }
    }
}