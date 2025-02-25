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
import { addCategory } from "@/actions/categories"

const CategoryAddModal = ({ open, setOpen }: {
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
    addToast({
      title: "Category: "+name,
      description: "Added successfully!!",
      color: "success",
      timeout: 3000,
      shouldShowTimeoutProgess: true
    })
    setName("")
  }

  const [name, setName] = useState("")
  const [alert, setAlert] = useState(false)

  const handleSubmit = async () => {
    if (name.replaceAll(" ", "") !== "") {
      setIsLoading(true)
      const result = await addCategory(name)
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
              <ModalHeader className="flex flex-col gap-1">Add Category</ModalHeader>
              <ModalBody>
                <Alert title="Fill all fields" isVisible={alert} color="danger" />
                <Input label="Category" variant="flat" onChange={e => setName(e.target.value)} isRequired isClearable />
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

export default CategoryAddModal