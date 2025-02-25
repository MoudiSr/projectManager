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
    NumberInput
} from "@heroui/react";
import { useEffect, useState } from "react";
import { addTask } from "@/actions/tasks"
import { Project } from "../projects/projects-table";

const TaskAddModal = ({ open, setOpen, project }: {
    open: boolean,
    setOpen: (value: boolean) => void,
    project: Project | null | undefined
}) => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        if (open) onOpen()
    }, [open])

    const handleClose = () => {
        setOpen(false)
        setName("")
        setCost(0)
        setTimeNeeded(0)
        setAlert(false)
        onOpenChange()
    }

    const [name, setName] = useState("")
    const [cost, setCost] = useState(0)

    const [alert, setAlert] = useState(false)
    const [timeNeeded, setTimeNeeded] = useState(0)

    const handleSubmit = async () => {
        if (name.replaceAll(" ", "") !== "" && cost !== 0 && timeNeeded !== 0) {
            const task = await addTask(project, name, cost, timeNeeded)
            handleClose()
        } else {
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
            }, 1000)
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleClose} placement="center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add Task</ModalHeader>
                            <ModalBody>
                                <Alert title="Fill all fields" isVisible={alert} color="danger" />
                                <Input label="Task" variant="flat" onChange={e => setName(e.target.value)} onClear={() => setName("")} isRequired isClearable />
                                <NumberInput label="Cost" variant="flat" value={cost} onValueChange={setCost} placeholder="0.00 $" isRequired/>
                                <NumberInput label="Time needed (Days)" variant="flat" value={timeNeeded} onValueChange={setTimeNeeded} placeholder="1" isRequired/>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="success" onPress={handleSubmit}>
                                    Submit
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default TaskAddModal