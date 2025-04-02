import { Table, TableHeader, TableBody, TableRow, TableCell, TableColumn, Spinner } from "@heroui/react";

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

export function DynamicTable({
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
  renderActions?: (item: any) => React.ReactNode;
}) {
  return (
    <Table
      aria-label="Dynamic Table with Sorting"
      sortDescriptor={sortDescriptor}
      onSortChange={onSortChange}
    >
      {/* Encabezado de la tabla */}
      <TableHeader>
        {Object.keys(columns).map((columnKey) => {
          const column = columns[columnKey];
          return (
            <TableColumn
              key={columnKey}
              allowsSorting={column.allowsSorting}
            >
              {column.key
                .replace(/_/g, " ")
                .charAt(0)
                .toUpperCase() +
                column.key.slice(1).replace(/_/g, " ")}
            </TableColumn>
          );
        })}
        {renderActions && <TableColumn key="actions">Actions</TableColumn>}
      </TableHeader>

      {/* Cuerpo de la tabla */}
      <TableBody
        items={items}
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
              <TableCell key="actions">{renderActions(item)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}