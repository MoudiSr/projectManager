import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Alert,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { deleteCategory } from "@/actions/categories"
import { Category } from "./categories-table";

const CategoryDeleteModal = ({ open, setOpen, category }: {
    open: boolean,
    setOpen: (value: boolean) => void,
    category: Category | undefined
}) => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        if (open) onOpen()
    }, [open])

    const [isLoading, setIsLoading] = useState(false)

    const handleClose = () => {
        setIsLoading(false)
        setOpen(false)
        onOpenChange()
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        const result = await deleteCategory(category?.id)
        handleClose()
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleClose} placement="center">
                <ModalContent>
                    {(onClose) => (
                        <>{category !== null && category !== undefined ?
                            <>
                                <ModalHeader className="flex flex-col gap-1">Are you sure you want to delete ?</ModalHeader>
                                <ModalBody>
                                    <Input label="Category" variant="flat" defaultValue={category?.name} isDisabled />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button color="danger" onPress={handleSubmit}>
                                        Delete
                                    </Button>
                                </ModalFooter>
                            </> :
                            <>
                                <ModalHeader>Delete Category</ModalHeader>
                                <ModalBody>
                                    <Alert color="warning" title="No category selected" />
                                </ModalBody>
                                <ModalFooter></ModalFooter>
                            </>}
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default CategoryDeleteModal