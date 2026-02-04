// utils/csvParser.ts
import type { RawSheetRow } from "../services/SheetAdapter";

export function csvTextToJson(csvText: string): RawSheetRow[] {
    const lines = csvText.split("\n").map(l => l.trim()).filter(l => l);
    if (lines.length < 2) return [];

    // Pega os cabeçalhos (primeira linha) e remove aspas extras se houver
    const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g, "").trim());

    return lines.slice(1).map(line => {
        // Regex complexo para lidar com vírgulas DENTRO de aspas no CSV
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];

        // Mapeia array de valores para objeto { header: valor }
        const row: any = {};
        headers.forEach((header, index) => {
            let val = values[index] || "";
            // Remove aspas duplas dos valores
            val = val.replace(/^"|"$/g, "");
            row[header] = val;
        });
        return row as RawSheetRow;
    });
}