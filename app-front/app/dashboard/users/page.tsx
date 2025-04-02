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

import { fetchUsersFromAPI, DynamicTable } from "@/utils/api";

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

  const userColumns: Record<string, { key: string; allowsSorting: boolean }> = {
    id: { key: "id", allowsSorting: true },
    name: { key: "name", allowsSorting: true },
    lastname: { key: "lastname", allowsSorting: true },
    email: { key: "email", allowsSorting: true },
    created_at: { key: "created_at", allowsSorting: true },
  };
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <section className="flex flex-col w-full h-full">
        <h1 className="text-2xl font-bold p-4">Users</h1>
        <Card className="w-full h-full">
            <div className="flex p-4">
                <div className="grid flex-auto justify-items-start">
                    <Input
                        placeholder="Search..."
                        // className="w-96"
                        // onChange={handleSearchChange}
                    />
                </div>
                <div className="grid flex-1 w-full justify-items-end content-end">
                    <Button color="primary">Export</Button>
                </div>
                <div className="grid flex-1 justify-items-end content-end">
                    <Button color="success" onPress={onOpen}>Add</Button>
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                        {(onClose) => (
                            <>
                            <ModalHeader className="flex flex-col gap-1">Add User</ModalHeader>
                            <ModalBody>
                                <Form>
                                    {/* Name */}
                                    <Input
                                        label="Name"
                                        labelPlacement="outside"
                                        placeholder="Enter your name"
                                        type="text"
                                        variant="bordered"
                                        className="mb-4"
                                    />
                                    {/* Lastname */}
                                    <Input
                                        label="Lastname"
                                        labelPlacement="outside"
                                        placeholder="Enter your lastname"
                                        type="text"
                                        variant="bordered"
                                        className="mb-4"
                                    />
                                    {/* Email */}
                                    <Input
                                        label="Email"
                                        labelPlacement="outside"
                                        placeholder="Enter your email"
                                        type="email"
                                        variant="bordered"
                                        className="mb-4"
                                    />
                                    {/* Password */}
                                    <Input
                                        label="Password"
                                        labelPlacement="outside"
                                        placeholder="Enter your password"
                                        type="password"
                                        variant="bordered"
                                        className="mb-4"
                                    />
                                    {/* Confirm Password */}
                                    <Input
                                        label="Confirm Password"
                                        labelPlacement="outside"
                                        placeholder="Confirm your password"
                                        type="password"
                                        variant="bordered"
                                        className="mb-4"
                                    />
                                    {/* Role */}
                                    <Switch>
                                        <span className="text-sm font-semibold text-default-500">Is Admin?</span>
                                    </Switch>
                                </Form>
                            </ModalBody>
                            <ModalFooter className="justify-center">
                                <Button color="primary" onPress={onClose}>
                                    Add User
                                </Button>
                            </ModalFooter>
                            </>
                        )}
                        </ModalContent>
                    </Modal>
                </div>
            </div>
            <DynamicTable
                columns={userColumns}
                items={list.items}
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
        </Card>
    </section>
  );
}