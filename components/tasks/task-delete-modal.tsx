'use client'
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
import { deleteTask } from "@/actions/tasks";
import { Project, Task } from "../projects/projects-table";

const TaskDeleteModal = ({ open, setOpen, task, project }: {
    open: boolean,
    setOpen: (value: boolean) => void,
    task: Task | null,
    project: Project | null | undefined
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
        addToast({
            title: "Task: " + task?.name,
            description: "Deleted successfully!!",
            color: "danger",
            timeout: 3000,
            shouldShowTimeoutProgess: true
        })
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        const result = await deleteTask(task, project)
        handleClose()
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleClose} placement="center">
                <ModalContent>
                    {(onClose) => (
                        <>{task !== null && task !== undefined ?
                            <>
                                <ModalHeader className="flex flex-col gap-1">Are you sure you want to delete ?</ModalHeader>
                                <ModalBody>
                                    <Input label="Category" variant="flat" defaultValue={String(task.name)} isDisabled />
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
                                <ModalHeader>Delete Task</ModalHeader>
                                <ModalBody>
                                    <Alert color="warning" title="No task selected" />
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

export default TaskDeleteModal