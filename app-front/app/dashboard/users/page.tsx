"use client";

import { getCookie } from "cookies-next";
import { useAsyncList } from "@react-stately/data";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  ButtonGroup,
  Card,
  Divider,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Form,
  Switch,
} from "@heroui/react";
import { useState } from "react";
import { useToast } from "@heroui/react";

import { fetchUsersFromAPI, DynamicTable, ExportButton } from "@/utils/api";

export default function UsersPage() {
  const token = getCookie("access_token") as string | null;

  // Configuración de useAsyncList para manejar datos y ordenamiento
  const list = useAsyncList<{ id: number; name: string; lastname: string; email: string; created_at: string; }>({
    async load() {
      const users = await fetchUsersFromAPI(token);
      return { items: users };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: (items as { id: number; name: string; lastname: string; email: string; created_at: string }[]).sort((a, b) => {
          const first = a[sortDescriptor.column as keyof typeof a];
          const second = b[sortDescriptor.column as keyof typeof b];
          let cmp = (parseInt(first as string) || first) < (parseInt(second as string) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  const tableColumns: Record<string, { key: string; allowsSorting: boolean }> = {
    id: { key: "id", allowsSorting: true },
    name: { key: "name", allowsSorting: true },
    lastname: { key: "lastname", allowsSorting: true },
    email: { key: "email", allowsSorting: true },
    // password_hash: { key: "password_hash", allowsSorting: true },
    created_at: { key: "created_at", allowsSorting: true },
    // deleted_at: { key: "deleted_at", allowsSorting: true },
    is_admin: { key: "is_admin", allowsSorting: true },
    // is_active: { key: "is_active", allowsSorting: true },
  };

  const addColumns: Record<string, { key: string, word: string, type: string }> = {
    // id: { key: "id" },
    name: { key: "name", word: "Name", type: "text" },
    lastname: { key: "lastname", word: "Last Name", type: "text" },
    email: { key: "email", word: "Email", type: "email" },
    password_hash: { key: "password_hash", word: "Password", type: "password" },
    // created_at: { key: "created_at" },
    // deleted_at: { key: "deleted_at" },
    is_admin: { key: "is_admin", word: "Is Admin", type: "checkbox" },
    // is_active: { key: "is_active" },
  };

  const editColumns: Record<string, { key: string, word: string, type: string }> = {
    id: { key: "id", word: "ID", type: "text" },
    name: { key: "name", word: "Name", type: "text" },
    lastname: { key: "lastname", word: "Last Name", type: "text" },
    email: { key: "email", word: "Email", type: "email" },
    password_hash: { key: "password_hash", word: "New Password", type: "password" },
    // created_at: { key: "created_at" },
    // deleted_at: { key: "deleted_at" },
    is_admin: { key: "is_admin", word: "Is Admin", type: "checkbox" },
    // is_active: { key: "is_active" },
  };

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <section className="flex flex-col w-full h-full">
        <h1 className="text-2xl font-bold p-4">Users</h1>
            <DynamicTable
                columns={tableColumns}
                items={list.items}
                itemName="Users"
                addItems={addColumns}
                editItems={editColumns}
                isLoading={list.isLoading}
                sortDescriptor={list.sortDescriptor}
                onSortChange={list.sort}
                renderActions={(item) => (
                    <ButtonGroup>
                        <Button color="primary">Edit</Button>
                        <Button color="danger">Delete</Button>
                    </ButtonGroup>
                )}
            />
    </section>
  );
}