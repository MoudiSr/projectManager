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
    addToast,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { deleteUser } from "@/actions/users";
import { User } from "./accounts-tables";

const UserDeleteModal = ({ open, setOpen, user }: {
    open: boolean,
    setOpen: (value: boolean) => void,
    user: User | undefined
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
        const result = await deleteUser(user?.id)
        addToast({
            title: "User: " + user?.username,
            description: "Delete successfully!!",
            color: "danger",
            timeout: 3000,
            shouldShowTimeoutProgess: true
        })
        handleClose()
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleClose} placement="center">
                <ModalContent>
                    {(onClose) => (
                        <>{user !== null && user !== undefined ?
                            <>
                                <ModalHeader className="flex flex-col gap-1">Are you sure you want to delete ?</ModalHeader>
                                <ModalBody>
                                    <Input label="User" variant="flat" defaultValue={user?.username} isDisabled />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button color="danger" onPress={handleSubmit} isLoading={isLoading}>
                                        Delete
                                    </Button>
                                </ModalFooter>
                            </> :
                            <>
                                <ModalHeader>Delete User</ModalHeader>
                                <ModalBody>
                                    <Alert color="warning" title="No user selected" />
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

export default UserDeleteModal