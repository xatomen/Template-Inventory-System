import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
  Spinner,
  Button,
  ButtonGroup,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Form,
  Select,
  SelectItem,
  Switch,
  Card,
  Checkbox,
} from "@heroui/react";
import { useState } from "react";
import { addToast } from "@heroui/react";
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
      size="sm"
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

// // Función para añadir usuarios
// export async function addUser(token: string | null, userData: any) {



// }

// Botón para añadir usuarios
export function AddItemButton({ itemName, addItems, columns }: { itemName: string, addItems: Record<string, {key: string, word: string, type: string}>, columns: Record<string, { key: string; allowsSorting: boolean }> }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // const handleAddUser = async () => {
  //   try {
  //     await addUser(token, userData);
  //     onClose();
  //   } catch (error) {
  //   }
  // };

  return (
    <Button color="success" onPress={onOpen}>
      Add
      <Modal isOpen={isOpen} onOpenChange={onClose} className="items-center w-auto">
        <ModalContent>
          <ModalHeader>Add {itemName}</ModalHeader>
          <ModalBody>
            <Form>
              {/* Debemos armar dinámicamente el formulario de acuerdo a la lista */}
              {Object.keys(addItems).map((key) => {
                const item = addItems[key];
                return (
                  <div key={key}>
                    {item.key.includes("is_") ? ( // Si el key contiene "is_", se considera un Switch
                      <Checkbox size="sm" key={key} defaultSelected={false}>
                        {item.word}
                      </Checkbox>
                    ) : (
                      <Input
                        size="sm"
                        key={key}
                        label={item.word}
                        type={item.type}
                      />
                    )}
                  </div>
                );
              })}
            </Form>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup size="sm">
              <Button color="secondary" onPress={onClose}>Cancel</Button>
              <Button color="primary" type="submit">Save</Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Button>
  );
}

// Función que contiene los botones de acción
export function ActionButtons({ itemName, editItems, item, columns }: { itemName: string, editItems: Record<string, {key: string, word: string, type: string}>, item: any, columns: Record<string, { key: string; allowsSorting: boolean }> }) {
  const disableList = ["id", "created_at", "deleted_at", "is_active"];
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ButtonGroup size="sm">
      <Button color="primary" onPress={onOpen}>Edit</Button>
      <Modal isOpen={isOpen} onOpenChange={onClose} className="items-center w-auto">
        <ModalContent>
          <ModalHeader>Edit {itemName}</ModalHeader>
          <ModalBody>
            <Form
              // onSubmit={handleEdit}
            >
              {/* Editar los campos del item, considerando únicamente los keys que coincidan con los indicados en las columnas */}
              {Object.keys(editItems).map((key) => {
                const editItem = editItems[key];
                return (
                  <div key={key}>
                    {typeof item[editItem.key] === "boolean" ? (
                      <Checkbox
                        size="sm"
                        key={key}
                        defaultSelected={item[editItem.word]}
                        isDisabled={disableList.includes(key)}
                      >
                        {editItem.word}
                      </Checkbox>
                    ) : (
                      <Input
                        size="sm"
                        key={key}
                        label={editItem.word}
                        defaultValue={editItem.type === "password" ? "" : item[editItem.key]}
                        type={editItem.type}
                        // Si el campo es "id" o "created_at", será isDisabled
                        isDisabled={disableList.includes(key)}
                      />
                    )}
                  </div>
                );
              })}
            </Form>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup size="sm">
              <Button color="secondary" onPress={onClose}>Cancel</Button>
              <Button color="primary" type="submit">Save</Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>



      <Button
        color="danger"
        // onPress={handleDelete}
      >
        Delete
        </Button>
    </ButtonGroup>
  );
}

// Tabla dinámica con soporte para ordenamiento y exportación a CSV
export function DynamicTable<T extends Record<string, any>>({
  columns,
  items,
  itemName,
  addItems,
  editItems,
  isLoading,
  sortDescriptor,
  onSortChange,
  renderActions,
}: {
  columns: Record<string, { key: string; allowsSorting: boolean }>;
  items: any[];
  itemName: any;
  addItems: Record<string, {key: string, word: string, type: string}>;
  editItems: Record<string, {key: string, word: string, type: string}>;
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
    <div className="flex flex-col w-full h-full">
      <Card className="p-4 w-full">
        <div className="flex justify-between gap-x-4">
          {/* Filtros de búsqueda */}
          <div className="flex-1">
            <SearchInput
              items={items}
              setFilteredItems={setFilteredItems}
            />
          </div>
          {/* Botón para exportar a CSV */}
          <div className="flex justify-end">
            <ButtonGroup size="sm">
              <ExportButton
                columns={columns}
                data={items}
              />
              <AddItemButton
                itemName={itemName}
                addItems={addItems}
                columns={columns}
              />
            </ButtonGroup>
          </div>
        </div>
      </Card>
      <div className="py-4 h-full w-full">
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
                    <ActionButtons itemName={itemName} editItems={editItems} item={item} columns={columns} />
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
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
    const headers = Object.keys(columns).map((columnKey) => `"${columns[columnKey].key}"`);

    // Procesar los datos visibles en la tabla
    const processedData = data.map((item) =>
      Object.keys(columns).reduce((acc, columnKey) => {
        const column = columns[columnKey];
        acc[column.key] = `"${item[column.key]}"`;
        return acc;
      }, {} as Record<string, any>)
    );

    // Crear el contenido CSV con separador ; y codificación UTF-8
    const csvContent = [
      "\uFEFF", // Indicador BOM para UTF-8
      headers.join(";"), // Encabezados
      ...processedData.map((row) => Object.values(row).join(";")), // Filas
    ].join("\n");

    // Crear y descargar el archivo CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exported_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button color="secondary" onPress={handleExport}>
      Export CSV
    </Button>
  );
}