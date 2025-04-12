'use client'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Alert,
    DateValue,
    addToast,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Project } from "../projects/projects-table";
import { addSale, deleteSale } from "@/actions/sales"
import { Sale } from "./sales-table";

const SaleDeleteModal = ({ open, setOpen, selectedSale }: {
    open: boolean,
    setOpen: (value: boolean) => void,
    selectedSale: Sale | null
}) => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        if (open) onOpen()
    }, [open])

    const handleClose = () => {
        setIsLoading(false)
        setOpen(false)
        onOpenChange()
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        const result = await deleteSale(selectedSale?.id)
        addToast({
            title: "Sale: " + selectedSale?.id,
            description: "Delete successfully!!",
            color: "danger",
            timeout: 3000,
            shouldShowTimeoutProgess: true
        })
        handleClose()
    }

    const [isLoading, setIsLoading] = useState(false)

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleClose} placement="center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Delete Sale</ModalHeader>
                            <ModalBody>
                                <div>
                                    <h1>Are you sure you want to delete this sale ?</h1>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="danger" onPress={handleSubmit} isLoading={isLoading}>
                                    Yes
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default SaleDeleteModal