import fs from 'fs/promises';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config(); // Charger les variables depuis .env
class PdfService {
  async buildPDFFromTemplate(templatePath, data, res) {
    // Lire le fichier HTML
    let html = await fs.readFile(templatePath, 'utf-8');

    // Remplacer les variables dynamiques
    html = html
      // Informations de la facture
      .replace('{{numFacture}}', data.numFacture)
      .replace('{{dateFacture}}', data.dateFacture)
      .replace('{{dateEcheance}}', data.dateEcheance)
      
      // Informations de l'entreprise
      .replace('{{nomEntreprise}}', process.env.NOM_ENTREPRISE || 'Nom Entreprise par défaut')
      .replace('{{adresseEntreprise}}', process.env.ADRESSE || 'Nom Entreprise par défaut')
      .replace('{{villeEntreprise}}',  process.env.VILLE || 'Nom Entreprise par défaut')
      .replace('{{codePostalEntreprise}}', process.env.CODE_POSTAL || 'Nom Entreprise par défaut')
      .replace('{{telephoneEntreprise}}',  process.env.TELEPHONE || 'Nom Entreprise par défaut')
      .replace('{{emailEntreprise}}', process.env.EMAIL || 'Nom Entreprise par défaut')
      .replace('{{siretEntreprise}}', process.env.SIRET || 'Nom Entreprise par défaut')
      
      // Informations du client
      .replace('{{nomClient}}', data.client.nom)
      .replace('{{adresseClient}}', data.client.adresse)
      .replace('{{telephoneClient}}', data.client.telephone)
      
   

    // Injecter les lignes de la facture dynamiquement
    let lignesFacture = '';
    let totalHT = 0;
    
    if (data.lignes && data.lignes.length > 0) {
      data.lignes.forEach(ligne => {
        const montantLigne = ligne.quantite * ligne.prixUnitaire;
        totalHT += montantLigne;
        
        lignesFacture += `
          <tr>
            <td>${ligne.description}</td>
            <td>${ligne.quantite}</td>
            <td>${ligne.prixUnitaire.toFixed(2)} MGA</td>
            <td class="right-align">${montantLigne.toFixed(2)} MGA</td>
          </tr>
        `;
      });
      
      // Remplacer le contenu du tableau
      html = html.replace('{{lignesFacture}}', lignesFacture);
      
      // Calculer et remplacer les totaux
      const tva = totalHT * (data.tauxTVA / 100);
      const totalTTC = totalHT + tva;
      
      html = html
        .replace('{{totalHT}}', totalHT.toFixed(2))
        .replace('{{tauxTVA}}', data.tauxTVA)
        .replace('{{montantTVA}}', tva.toFixed(2))
        .replace('{{totalTTC}}', totalTTC.toFixed(2));
    }


    // Générer le PDF via Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Configuration des marges pour l'impression
    const pdfOptions = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    };

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf(pdfOptions);

    await browser.close();

    // Renvoyer le PDF en réponse HTTP
    return pdfBuffer
  }
}

export default new PdfService();