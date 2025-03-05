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
    SelectItem,
    Select,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { addUser } from "@/actions/users"
import { Eye, EyeClosed } from "lucide-react";

const UserAddModal = ({ open, setOpen }: {
    open: boolean,
    setOpen: (value: boolean) => void
}) => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        if (open) onOpen()
    }, [open])

    const [isLoading, setIsLoading] = useState(false)

    const handleClose = () => {
        setIsLoading(false)
        setOpen(false)
        setAlert(false)
        onOpenChange()
        setName("")
    }

    const [name, setName] = useState("")
    const [role, setRole] = useState("")
    const [password, setPassword] = useState("")
    const [alert, setAlert] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    const handleSubmit = async () => {
        if (name.replaceAll(" ", "") !== "" && role.replaceAll(" ", "") !== "" && password.replaceAll(" ", "") !== "") {
            setIsLoading(true)
            const result = await addUser(name, password, role)
            addToast({
                title: "User: " + name,
                description: "Added successfully!!",
                color: "success",
                timeout: 3000,
                shouldShowTimeoutProgess: true
            })
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
                            <ModalHeader className="flex flex-col gap-1">Add User</ModalHeader>
                            <ModalBody>
                                <Alert title="Fill all fields" isVisible={alert} color="danger" />
                                <Input variant="faded" radius="sm" label="Username" placeholder="Enter username" onChange={e => setName(e.target.value)} isRequired isClearable />
                                <Input variant="faded" placeholder="Enter password" type={isVisible ? "text" : "password"} label="Password" endContent={
                                    <button
                                        aria-label="toggle password visibility"
                                        className="focus:outline-none"
                                        type="button"
                                        onClick={() => setIsVisible(prev => !prev)}
                                    >
                                        {isVisible ? (
                                            <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <Eye className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                    </button>
                                } isInvalid={alert} radius="sm" isRequired onChange={e => setPassword(e.target.value)} />
                                <Select label="Role" isRequired>
                                    <SelectItem onPress={() => setRole("admin")}>admin</SelectItem>
                                    <SelectItem onPress={() => setRole("user")}>user</SelectItem>
                                    <SelectItem onPress={() => setRole("editor")}>editor</SelectItem>
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="success" onPress={handleSubmit} isLoading={isLoading} >
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

export default UserAddModal