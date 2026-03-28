import colombiaRaw from "@/data/colombia-departments-cities.json";

/** Fila del dataset departamento → municipios (marcovega/colombia-json). */
export type ColombiaDepartmentRow = {
  id: number;
  departamento: string;
  ciudades: string[];
};

const rows = colombiaRaw as ColombiaDepartmentRow[];

const byDept = new Map<string, string[]>();
for (const row of rows) {
  byDept.set(row.departamento, row.ciudades);
}

/** Departamentos ordenados alfabéticamente (es-CO). */
export const COLOMBIA_DEPARTMENTS: string[] = [...byDept.keys()].sort((a, b) =>
  a.localeCompare(b, "es", { sensitivity: "base" })
);

/** Municipios/ciudades del departamento, ordenados alfabéticamente. */
export function getCitiesByDepartment(departmentName: string): string[] {
  const list = byDept.get(departmentName);
  if (!list?.length) return [];
  return [...list].sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
}
