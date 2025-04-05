import { Table, TableHeader, TableBody, TableRow, TableCell, TableColumn, Spinner, Button, Input } from "@heroui/react";
import { useState } from "react";
import { useToast } from "@heroui/react";
import React from "react";

// Función que retorna el listado de usuarios
export async function fetchUsersFromAPI(token: string | null) {
  if (!token) return []; // Si no hay token, devuelve un array vacío

  try {
    const response = await fetch("http://localhost:8000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data; // Devuelve la lista de usuarios
    } else {
      console.error("Error al obtener la lista de usuarios:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error de red:", error);
    return [];
  }
}

// Función reutilizable para el componente de búsqueda
export function SearchInput<T>({ items, setFilteredItems }: { items: T[]; setFilteredItems: (filtered: T[]) => void }) {
  return (
    <Input
      placeholder="Search..."
      onChange={(e) => {
        const value = e.target.value.toLowerCase();
        const filtered = items.filter((item) =>
          Object.values(item).some((val) =>
            String(val).toLowerCase().includes(value)
          )
        );
        setFilteredItems(filtered);
      }}
    />
  );
}

// Tabla dinámica con soporte para ordenamiento y exportación a CSV
export function DynamicTable<T extends Record<string, any>>({
  columns,
  items,
  isLoading,
  sortDescriptor,
  onSortChange,
  renderActions,
}: {
  columns: Record<string, { key: string; allowsSorting: boolean }>;
  items: any[];
  isLoading: boolean;
  sortDescriptor: any;
  onSortChange: (sortDescriptor: any) => void;
  renderActions?: (item: T) => React.ReactNode;
}) {
  const [filteredItems, setFilteredItems] = React.useState(items);

  React.useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  return (
    <div>
      {/* Filtros de búsqueda */}
      <div className="mb-4">
        <SearchInput
          items={items}
          setFilteredItems={setFilteredItems}
        />
      </div>
      {/* Botón para exportar a CSV */}
      <div className="flex justify-end mb-4">
        <ExportButton
          columns={columns}
          data={items}
        />
      </div>
      {/* Encabezado de la tabla */}
      <Table
        aria-label="Dynamic Table with Sorting"
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
      >
        {/* Encabezado de la tabla */}
        <TableHeader>
          <>
            {Object.keys(columns).map((columnKey) => {
              const column = columns[columnKey];
              return (
                <TableColumn
                  key={columnKey}
                  allowsSorting={column.allowsSorting}
                  allowsResizing
                >
                  {columnKey.charAt(0).toUpperCase() + columnKey.slice(1)}
                </TableColumn>
              );
            })}
            {renderActions && <TableColumn key="actions">Actions</TableColumn>}
          </>
        </TableHeader>

        {/* Cuerpo de la tabla */}
        <TableBody
          items={filteredItems}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item) => (
            <TableRow key={item.id}>
              {Object.keys(columns).map((columnKey) => {
                const column = columns[columnKey];
                return (
                  <TableCell key={columnKey}>
                    {item[column.key]}
                  </TableCell>
                );
              })}
              {renderActions && (
                <TableCell key="actions">
                  {renderActions(item)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Función para exportar la tabla a CSV
export function exportToCSV(headers: string[], data: any[], filename: string) {
  // Crear el contenido CSV
  const csvContent = [
    headers.join(","), // Encabezados
    ...data.map((row) => headers.map((header) => row[header]).join(",")), // Filas
  ].join("\n");

  // Crear y descargar el archivo CSV
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Botón para exportar a CSV
export function ExportButton({ columns, data }: { columns: Record<string, { key: string }>, data: any[] }) {
  const handleExport = () => {
    // Extraer los encabezados de las columnas
    const headers = Object.keys(columns).map((columnKey) => columns[columnKey].key);

    // Procesar los datos visibles en la tabla
    const processedData = data.map((item) =>
      Object.keys(columns).reduce((acc, columnKey) => {
        const column = columns[columnKey];
        acc[column.key] = item[column.key];
        return acc;
      }, {} as Record<string, any>)
    );

    // Exportar los datos a CSV
    exportToCSV(headers, processedData, "exported_data.csv");
  };

  return (
    <Button color="primary" onPress={handleExport}>
      Export to CSV
    </Button>
  );
}