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
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Category } from "../categories/categories-table";
import { addProject } from "@/actions/projects";
import { CalendarDate, getLocalTimeZone, parseDate, today } from "@internationalized/date";

const ProjectAddModal = ({ open, setOpen, categories }: {
  open: boolean,
  setOpen: (value: boolean) => void,
  categories: Category[]
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
    addToast({
      title: "Project: " + name,
      description: "Added successfully!!",
      color: "success",
      timeout: 3000,
      shouldShowTimeoutProgess: true
    })
    setName("")
    setDescription("")
    setCategory(undefined)
    setDateRange(null)
  }

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<Category | undefined>(undefined)
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null)

  const [alert, setAlert] = useState(false)

  const handleSubmit = async () => {
    if (name.replaceAll(" ", "") !== "" && description.replaceAll(" ", "") !== "" && category !== undefined && dateRange !== null) {
      setIsLoading(true)
      const project = await addProject(name, description, category, dateRange?.start.toString(), dateRange?.end.toString())
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
              <ModalHeader className="flex flex-col gap-1">Add Project</ModalHeader>
              <ModalBody>
                <Alert title="Fill all fields" isVisible={alert} color="danger" />
                <Input label="Project" variant="flat" onChange={e => setName(e.target.value)} isRequired isClearable />
                <Input label="Description" variant="flat" onChange={e => setDescription(e.target.value)} isRequired isClearable />
                <Select label="Category" isRequired>
                  {categories?.map(category => (
                    <SelectItem key={category.id} onPress={() => setCategory(category)}>{category.name}</SelectItem>
                  ))}
                </Select>
                <DateRangePicker label="Start date" minValue={today(getLocalTimeZone())} onChange={setDateRange} />
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

export default ProjectAddModal