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
import { editUser } from "@/actions/users"
import { Eye, EyeClosed } from "lucide-react";
import { User } from "./accounts-tables";

const UserEditModal = ({ open, setOpen, user }: {
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
        if (role.replaceAll(" ", "") !== "") {
            setIsLoading(true)
            const result = await editUser(user, password, role)
            addToast({
                title: "User: " + name,
                description: "Edited successfully!!",
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

    useEffect(() => {
        setName(String(user?.username))
        setRole(String(user?.role))
    }, [open])

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleClose} placement="center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Edit User | {name}</ModalHeader>
                            <ModalBody>
                                <Alert title="Fill all fields" isVisible={alert} color="danger" />
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
                                <Select label="Role" isRequired placeholder={role}>
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

export default UserEditModal