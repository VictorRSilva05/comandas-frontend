import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const gerarRelatorioPDF = ({ titulo, colunas, dados, incluirImagem = false }) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(titulo, 14, 20);

    const body = dados.map((item) =>
        colunas.map((coluna) => item[coluna] || '')
    );

    autoTable(doc, {
        head: [colunas],
        body: body,
        startY: 30,
    });

    if (incluirImagem) {
        let posY = doc.lastAutoTable.finalY + 10;

        dados.forEach((item, index) => {
            if (item.foto && item.foto.startsWith('data:image')) {
                try {
                    doc.addImage(item.foto, 'JPEG', 14, posY, 40, 40);
                    doc.text(`${item.Nome}`, 60, posY + 10);
                    posY += 50;
                } catch (error) {
                    console.warn(`Erro ao adicionar imagem do produto ${item.ID}`, error);
                }
            }
        });
    }

    doc.save(`${titulo}.pdf`);
};
