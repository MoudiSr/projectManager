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
  Select,
  SelectItem,
  Alert,
  DatePicker,
  DateRangePicker,
  RangeValue,
  DateValue,
  addToast,
  NumberInput,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { CalendarDate, getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { Project } from "../projects/projects-table";
import { addSale } from "@/actions/sales"

const SaleAddModal = ({ open, setOpen, projects }: {
  open: boolean,
  setOpen: (value: boolean) => void,
  projects: Project[]
}) => {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (open) onOpen()
  }, [open])

  const handleClose = () => {
    setIsLoading(false)
    setOpen(false)
    setAlert(false)
    onOpenChange()
    setCustomerName("")
    setCustomerPhone("")
    setPrice(0)
    setProject(undefined)
    setSaleDate(null)
  }

  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [price, setPrice] = useState(0)
  const [project, setProject] = useState<Project | undefined>(undefined)
  const [saleDate, setSaleDate] = useState<DateValue | null>(null)

  const [alert, setAlert] = useState(false)

  const handleSubmit = async () => {
    if (customerName.trim() !== "" && customerPhone.trim() !== "" && project !== undefined && project !== null && saleDate !== null && price !== 0) {
      setIsLoading(true)
      const newProject = await addSale(project, price, customerName, customerPhone, saleDate.toString())
      addToast({
        title: "Sale: " + project.name,
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

  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleClose} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add Sale</ModalHeader>
              <ModalBody>
                <Alert title="Fill all fields" isVisible={alert} color="danger" />
                <Select label="Project" isRequired>
                    {projects.map(p => (
                        <SelectItem key={p.id} onPress={() => setProject(p)}>{p.name}</SelectItem>
                    ))}
                </Select>
                <Input label="Cost" variant="flat" value={project === undefined ? "" : String(project.price)} isDisabled />
                <NumberInput label="Price" variant="flat" onValueChange={setPrice} minValue={0} isRequired />
                <Input label="Customer Name" variant="faded" isRequired onChange={e => setCustomerName(e.target.value)} />
                <Input label="Customer Phone" variant="faded" isRequired onChange={e => setCustomerPhone(e.target.value)} />
                <DatePicker label="Date" onChange={setSaleDate} isRequired />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="success" onPress={handleSubmit} isLoading={isLoading}>
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

export default SaleAddModal